<!--  -->
<template>
  <div class="siteTab">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
      @tab-click="tabClick"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in keepPageTabs"
        :key="item.routeName"
        :label="item.title"
        :name="item.routeName"
      ></el-tab-pane>
    </el-tabs>
    <!-- <div class="labelOption">标签选项</div> -->
    <el-dropdown class="labelOptions" @command="selectOption" v-if="keepPageTabs.length">
      <div class="labelOption">
        标签选项
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="1">关闭其他</el-dropdown-item>
        <el-dropdown-item :command="2">关闭所有</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapState, mapMutations } from "vuex";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},

  data() {
    //这里存放数据
    return {
      //首页tab
         tab : {
          title: "首页", //中文名
          routeName: "home", //路由名称
          params: {},
          noCache: true
        }
    };
  },
  computed: {
    ...mapState(["keepPageTabs"]),
    editableTabsValue: {
      set: function() {
        return this.$route.name;
      },
      get: function() {
        return this.$route.name;
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // console.log(this.$route);
  },
  //方法集合
  methods: {
    ...mapMutations(["updateKeepPageTabs"]),
    tabClick(val) {
      let index = this.keepPageTabs.findIndex(b => b.routeName === val.name);
      let isCurrent = this.$route.name === val.name;
      if (isCurrent) {
        return false;
      } else {
        this.$router.push({
          name: val.name,
          query: this.keepPageTabs[index].routeQuerys
        });
      }
    },
    removeTab(targetName) {
      let originRouteName = targetName;
      let isCurrent = this.$route.name === originRouteName;
       // 如果只剩一个tab,那么如果是首页则不做处理，不是首页，跳到首页
      if (this.keepPageTabs.length === 1) {
        if (this.keepPageTabs[0].name == this.tab.routeName) {
          return;
        } else {
          this.updateKeepPageTabs({
            type: "all",
            data: this.tab
          });
          return;
        }
      }
      // 如果删除的是当前展示的页面，需要切换到其他 tab
      if (isCurrent) {
        let gotoTabIndex;
        let index = this.keepPageTabs.findIndex(
          tab => tab.routeName === originRouteName
        );
        if (index === 0) {
          gotoTabIndex = 1;
        } else {
          gotoTabIndex = index - 1;
        }
        this.$router.push({
          name: this.keepPageTabs[gotoTabIndex].routeName,
          params: this.keepPageTabs[gotoTabIndex].params
        });
      }
      this.updateKeepPageTabs({
        type: "del",
        data: { routeName: targetName }
      });
    },
    selectOption(val) {
   //   console.log(val);
      if (val == 1) {
        //删除其他
        this.updateKeepPageTabs({
          type: "other",
          data: { routeName: this.$route.name }
        });
      } else {
        //删除全部，只保留一个首页
        this.updateKeepPageTabs({
          type: "all",
          data: this.tab
        });
      }
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>