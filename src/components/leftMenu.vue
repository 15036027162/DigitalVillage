<!--  -->
<template>
  <div class="menu" :class="{'has-logo':showLogo,hideSidebar:isCollapse}">
    <logo :collapse="isCollapse" v-if="showLogo"></logo>

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="leftMenuActiveName"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
         :collapse-transition="false"
        :unique-opened="true"
      >
        <div v-for="(item,index) in leftMenu" :key="index">
          <el-menu-item :index="item.url" @click="goRouter(item)" v-if="!item.list.length">
           
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
          <el-submenu :index="index.toString()" v-else>
            <template slot="title">
             
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="items.url"
                v-for="(items,index) in item.list"
                @click="goRouter(items)"
                :key="index"
              >{{items.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapState, mapMutations } from "vuex";
import logo from "./Logo";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { logo },
  data() {
    //这里存放数据
    return {
      showLogo: false,
      leftMenuActiveNames:''
    };
  },
  computed: {
    ...mapState(["leftMenu", "leftMenuActiveName","isCollapse","keepAlive"])
  },
   watch: {
  //   $route: {
  //     immediate: true,
  //     handler(to, from) {
  //       let routeQuerys = to.query;
  //       let meta = to.meta || {};
  //        let currentRouteName = to.name; // 当前路由 name
  //       let originRouteName = currentRouteName; // 顶级菜单路由名称
  //      if (meta.activeMenu) {
  //        this.leftMenuActiveNames=meta.activeMenu;
  //       } else {
  //        this.leftMenuActiveNames=originRouteName;
  //        console.log(this.leftMenuActiveNames)
  //       }
  //       // this.$forceUpdate()
  //   },
 
  // },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    
 
  },
  //方法集合
  methods: {
    ...mapMutations(["updateLeftMenu", "updateleftMenuActiveName"]),
    goRouter(item) {
        
      this.$router.push({ name: item.url });
      //console.log(this.keepAlive)
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>