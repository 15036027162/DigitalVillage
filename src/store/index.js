import Vue from "vue";
import Vuex from "vuex";
import router from '../router/index.js'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    leftMenu: [], //侧边栏
    leftMenuActiveName: '', // 侧边栏活动的 menuitem index 
    keepPageTabs: [], // 顶部缓存页面对应tab 
    keepAlive: [], // 需要 keep-alive 缓存的页面
    breadcrumb: [], // 显示的面包屑数据
    isCollapse: false,
    isAuthentication:false,//是否跳了统一身份认证
  },
  mutations: {
    updateLeftMenu(state, list) {
      state.leftMenu = list
    },
    updateleftMenuActiveName(state, name) {
      state.leftMenuActiveName = name
    },
    // 修改页面 tab
    updateKeepPageTabs(state, obj) {
      let data = obj.data;
      let type = obj.type;
      // console.log(data)
      // 查找 tab 位置
      let index = state.keepPageTabs.findIndex((tab) => (tab.routeName === data.routeName))
      if (type === 'add') {
        //tab
        state.keepPageTabs.push(data)
        //缓存
        if (!data.noCache) {
          state.keepAlive.push(data.routeName)
        }

      } else if (type === 'del') {
        state.keepPageTabs.splice(index, 1)
        //缓存
        state.keepAlive.splice(index, 1)
      } else if (type === 'other') {

        state.keepPageTabs = state.keepPageTabs.filter(val => {
          return val.routeName == data.routeName
        })
        //缓存
        state.keepAlive = state.keepAlive.filter(val => {
          return val == data.routeName
        })
      } else if (type === 'all') {
        //首页添加进去
        state.keepPageTabs = [data]
        //缓存
        if (!data.noCache) {
          state.keepAlive = [data.routeName]
        }
        router.push({
          name: data.routeName,
        });


      }


      // sessionStorage.setItem('keepPageTabs', JSON.stringify(state.keepPageTabs))
    },
    updateBreadcrumb(state, data) {
      state.breadcrumb = data;
    },
    // 重置页面 tab
    setKeepPageTabs(state, tabs) {
      state.keepPageTabs = tabs
    },
    //左侧菜单折叠展开
    updateCollapse(state, data) {
      state.isCollapse = !state.isCollapse
    },
    //统一身份认证
    updateisAuthentication(state, data) {
      if(data&&data.type){
        state.isAuthentication = false;
      }else{
        state.isAuthentication = !state.isAuthentication
      }
     
    }
  },
  actions: {
    updateLeftMenu({ commit }, list) {
      commit('updateLeftMenu', list);
    },
  },
  modules: {},
  plugins: [createPersistedState({
    storage: window.sessionStorage, reducer(val) {
      return {
        // keepPageTabs: val.keepPageTabs,
        isAuthentication:val.isAuthentication,
        leftMenu:val.leftMenu
      }
    }
  })]
});
