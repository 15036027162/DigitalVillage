<!--  -->
<template>
  <div class="wrap">
    <top-header></top-header>
    <left-menu></left-menu>
    <div class="rightcontent" :class="{ hideSidebars: isCollapse }">
      <!-- <page-tab></page-tab> -->
      <!-- <bread-crumb></bread-crumb> -->
      <div class="contents">
        <bread-crumb v-show="$route.name!='home'"></bread-crumb>
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
    //this.getMenu();
    this.getMenus();
  },
  computed: {
    ...mapState([
      "leftMenu",
      "leftMenuActiveName",
      "keepPageTabs",
      "isCollapse",
      "keepAlive"
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
        // console.log(levelList);

        // console.log(levelList);
        this.updateBreadcrumb(levelList); //面包屑
       // console.log(levelList)
        //tab
        // let tab = {
        //   title: meta.title, //中文名
        //   routeName: originRouteName, //路由名称
        //   params: routeQuerys,
        //   noCache: meta.noCache
        // };
        // let index1 = this.keepPageTabs.findIndex(
        //   b => b.routeName === currentRouteName
        // );
        // // 当前页面不在tab中
        // if (index1 === -1 && currentRouteName) {
        //   this.updateKeepPageTabs({ type: "add", data: tab });
        // }
      }
    }
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
      "updateTopMenuActiveName"
    ]),
    isHome(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim() === "home";
    },

    getMenu() {
      var menuList = [];
      let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
      let roleList = session_adminInfo.role_list;
      let index = roleList.findIndex(val => {
        return val.id == "1";
      });

      menuList = [
        {
          name: "首页",
          routeName: "home",
          twoMenu: []
        },

        {
          name: "基础设置",
          routeName: "organizationManage",
          twoMenu: [
            {
              name: "积分发放设置",
              routeName: "distributionSet"
            },

            {
              name: "商品管理",
              routeName: "goodsManage"
            },
            {
              name: "村级分组管理",
              routeName: "groupManage"
            },
            {
              name: "家庭户管理",
              routeName: "familyList"
            },
            {
              name: "用户管理",
              routeName: "userManage"
            },
            {
              name: "用户实名审核",
              routeName: "authentication"
            }
          ]
        },
        {
          name: "积分管理",
          routeName: "honorValuePonit",
          twoMenu: [
            {
              name: "积分批量审核",
              routeName: "honorValueExam"
            },
            {
              name: "村民加分审核",
              routeName: "villagerExam"
            },

            {
              name: "积分公示",
              routeName: "honorValuePublicity"
            },
            {
              name: "家庭积分列表",
              routeName: "familyhonorValue"
            },
            {
              name: "各村积分统计",
              routeName: "villagerStatistics"
            }
          ]
        },

        {
          name: "荣誉墙内容管理",
          routeName: "honorWall",
          twoMenu: [
            {
              name: "红黑榜",
              routeName: "billboard"
            },
            {
              name: "荣誉表彰",
              routeName: "honerRecognition"
            },
            {
              name: "积分规则",
              routeName: "statement"
            },
            {
              name: "市场动向热点信息",
              routeName: "policyPublish"
            },
            {
              name: "首页轮播图管理",
              routeName: "advertisementPublish"
            }
          ]
        },

        {
          name: "系统管理",
          routeName: "roleManagement",
          twoMenu: [
            {
              name: "角色管理",
              routeName: "roleManagement"
            },
            {
              name: "操作成员管理",
              routeName: "operateMember"
            },
            {
              name: "类别设置",
              routeName: "categorySetting"
            },
          ]
        }
      ];

      this.updateLeftMenu(menuList);
    },
    async getMenus() {
      var menuList = [];
      let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
      const res = await this.$http.getMenu({
        memberId: session_adminInfo.memberId,
       // memberId: "20201601280895092"
      });
      if (res.status === "success") {

        menuList= res.data
        menuList.unshift( {
          name: "首页",
          url: "home",
          list: []
        },)
        this.updateLeftMenu(menuList);
        // console.log(menuList)
      } else {
      }
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
