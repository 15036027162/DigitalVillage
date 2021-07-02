<!--  -->
<template>
  <router-view></router-view>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  components: {},
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  created() {
  },
  methods: {
    reload() {},
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
@import "./style/common";
@import "./style/reset";
</style>