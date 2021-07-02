<!--  -->
<template>
  <div class>
    <!-- 分页S -->
    <el-pagination
     class="paging"
      background
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, jumper"
      :page-size="pageSize"
      :page-count="totalPage"
      :current-page.sync="pageNo"
      :total="total"
    ></el-pagination>
    <!-- 分页E -->
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
      listMain: {
        pageNo: 1,
        totalPage: 0,
        pageSize: 10,
        total: 0
      } // 分页
    };
  },
  props: {
    pageNo: Number,
    totalPage: Number,
    pageSize: Number,
    total: Number
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //方法集合
  methods: {
    handleCurrentChange(val) {
     // console.log(val)
        this.$emit('handleCurrentChange',val)
    //   let _this = this;
    //   _this.listMain.pageNo = val;
    //   this.obj = {
    //     areaCode: this.searchForm1.cityCode, // 县
    //     streetCode: this.searchForm1.townCode, // 镇
    //     village_code: this.searchForm1.villageCode // 村
    //   };
    //   _this.getListData();
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>