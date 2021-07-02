<!--  -->
<template>
  <div class="wrap">
    <top-header></top-header>
    <left-menu></left-menu>
    <div class="rightcontent" :class="{hideSidebars:isCollapse}">
      <!-- <page-tab></page-tab> -->
      <!-- <bread-crumb></bread-crumb> -->
      <div class="contents">
        <bread-crumb></bread-crumb>
        <el-main>
          <!-- <keep-alive :include="keepAlive"> -->
          <router-view />
          <!-- </keep-alive> -->
        </el-main>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import leftMenu from "../components/leftMenu";
import pageTab from "../components/pageTab";
import breadCrumb from "../components/breadcrum";
import topHeader from "../components/topHeader";
import { mapState, mapMutations } from "vuex";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { leftMenu, pageTab, breadCrumb, topHeader },
  data() {
    //这里存放数据
    return {};
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    /*let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
    let roleList = session_adminInfo.role_list;
    roleList.map(k=>{
      if(k.id==='1' || k.id==='3'){
        this.$router.push({name: 'index1'});
        this.updateisAuthentication()
      }else{
        this.updateisAuthentication()
        this.$router.push({name: 'index'});
      }
    })*/
    this.getMenu();
  },
  computed: {
    ...mapState([
      "leftMenu",
      "leftMenuActiveName",
      "keepPageTabs",
      "isCollapse",
      "keepAlive",
    ])
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        let routeQuerys = to.query;
        let meta = to.meta || {};
        let currentRouteName = to.name; // 当前路由 name
        let originRouteName = currentRouteName; // 顶级菜单路由名称
        //更新leftMenuActiveName
        if (meta.activeMenu) {
          this.updateleftMenuActiveName(meta.activeMenu);
        } else {
          this.updateleftMenuActiveName(originRouteName);

        }
        //console.log(this.$route.matched)
        let matched = this.$route.matched.filter(
          item => item.meta && item.meta.title
        );
        let first = matched[0]; //第一个路由
        if (!this.isHome(first)) {
          // matched = [
          //   { path: "/home", name: "home", meta: { title: "首页" } }
          // ].concat(matched);
        }
        var levelList = matched.filter(item => item.meta && item.meta.title);
        //console.log(levelList);

        this.updateBreadcrumb(levelList); //面包屑
       
        //tab
        let tab = {
          title: meta.title, //中文名
          routeName: originRouteName, //路由名称
          params: routeQuerys,
          noCache: meta.noCache
        };
        let index1 = this.keepPageTabs.findIndex(
          b => b.routeName === currentRouteName
        );
        // 当前页面不在tab中
        if (index1 === -1 && currentRouteName) {
          this.updateKeepPageTabs({ type: "add", data: tab });
        }
      }
    },

  },
  //方法集合
  methods: {
    ...mapMutations([
      "updateLeftMenu",
      "updateleftMenuActiveName",
      "updateKeepPageTabs",
      "updateBreadcrumb",
      "updateTopMenu",
      "updateAllMenuList",
      "updateTopMenuActiveName",
      "updateisAuthentication"
    ]),
    isHome(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim() === "home";
    },

    getMenu() {


        var menuList = [
           {
            name: "村级分组管理",
            routeName: "groupManage",
            twoMenu: []
          },
          {
            name: "家庭户管理",
            routeName: "familyList",
            twoMenu: []
          },
          {
            name: "村民档案管理",
            routeName: "villagersRecordList",
            twoMenu: []
          },

        ];


      this.updateLeftMenu(menuList);
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
