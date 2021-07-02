import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueCookies from 'vue-cookies'
import * as api from './api/getData'
import { setStore,getStore, removeStore,setSessionStore,getSessionStore,removeSessionStore,formatDateTime} from "./config/mUtils";
import {isAuth} from "./config/validate";
import { baseUrl } from "./config/env";
Vue.config.productionTip = false
Vue.prototype.$baseUrl = baseUrl;
Vue.prototype.$setStore = setStore;
Vue.prototype.$getStore = getStore;
Vue.prototype.$removeStore = removeStore;
Vue.prototype.$setSessionStore = setSessionStore;
Vue.prototype.$getSessionStore = getSessionStore;
Vue.prototype.$removeSessionStore = removeSessionStore;
Vue.prototype.$formatDateTime = formatDateTime;
 Vue.prototype.$http = api;
 Vue.prototype.isAuth = isAuth     // 权限方法
Vue.use(VueCookies)
Vue.use(ElementUI);
Vue.config.productionTip = false;
import htmlToPdf from './utils/htmlToPdf'
Vue.use(htmlToPdf)
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */);
//store.commit('setKeepPageTabs', JSON.parse(sessionStorage.getItem('keepPageTabs') || '[]'))
router.beforeEach((to, from, next) => {
  if (to.name!='login'){ // 判断该路由是否需要登录权限
    let token = getStore('tokenId') || '';
    let hasLogin =VueCookies.get('hasLogin') || false;
  if(!hasLogin || hasLogin == false || token.length === 0){
    next({
        path: '/',
        // query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
    else {
        next();
     
    }
  }
  else {
    next();
  }
});

// 加载中
Vue.prototype.openLoading = function() {
    const loading = this.$loading({           // 声明一个loading对象
        lock: true,                             // 是否锁屏
        text: '加载中...',                     // 加载动画的文字
        spinner: 'el-icon-loading',             // 引入的loading图标
        background: 'rgba(0, 0, 0, 0.3)',       // 背景颜色
        target: '.loading-area',                    // 需要遮罩的区域
        body: true,
        customClass: 'mask'                     // 遮罩层新增类名
    });
    setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
        loading.close();                        // 关闭遮罩层
    }, 2000);
    return loading;
};


// 手机号处理
Vue.prototype.phoneNumFilterLogin = function(phone){
    let phoneStr = String(phone);
    let pLen = phoneStr.length || 0;
    if (pLen >= 11) {
        const reg = /^1[3456789]\d{9}$/;
        if (phone === '' || phone === undefined || phone === null) {
            return phone;
        } else {
            if ((!reg.test(phone)) && phone !== '') {
                return phone;
            } else {
                let str = String(phone)
                phone = `${str.slice(0, 3)}****${str.slice(7, 11)}`;
            }
        }
    }
    return phone;
}

/*退出标识*/
Vue.prototype.closeCookie = function(){
    let _this = this
    // 设置退出标识
    if(_this.$cookies.isKey('hasLogin')){
        _this.$cookies.remove('hasLogin');
    }
    // 清除数据
    removeStore('tokenId');
    removeStore('adminUserInfo');
    removeStore('remember_me');
    removeStore('townListInfo');
    removeStore('villageListInfo');
    removeStore('districtsLevel');
    removeStore('districtsCode');
    removeStore('subMember');
    //重新登录
    setTimeout(() => {
        _this.$router.push({name: 'login'});
    }, 1200);
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
