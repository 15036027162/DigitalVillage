<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchform" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="searchform.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="searchform.name" placeholder="名称"></el-input>
      </el-form-item>
       <slot name="header1"></slot>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <slot name="header"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      searchform: {
        title: "1",
        name: ""
      },
      searchform1: {},
      obj1: "",
      obj2: ""
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.searchform1 = Object.assign({}, this.searchform);
  },
  //方法集合
  methods: {
    search() {
      //   console.log(this.searchform1)
      this.$emit("searchSubmit", this.searchform);
      //   console.log(this.searchform)
      //         console.log(this.searchform1)
    }
  }
  //   watch:{
  //      searchform: {
  //                 handler: function(newVal) {
  //                     let _this = this;

  //                     if(newVal !== _this.searchform1){
  //                         //_this.bindSearchBtn = false;
  //                        // console.log("1")
  //                     }
  //                 },
  //                 deep: true
  //             },
  //   }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>