<!--  -->
<template>
<div class=''>
     <div  class="formdiv">
      <div class="leftHeadImg leftHeadImgs div">
        <img
          class
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599046549246&di=8e9a8d4832630a6756b8089e5fafe4a1&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F8df8682b569987dcf07186b15945a47b8151a89d34049-cfgKuv_fw658"
          alt
        />
       
      </div>
       <div class="div">
        <div  class="formItems" >姓名：李木子</div>
        <div  class="formItems">性别：女</div>
          <div class="formItems">身份证号：18549963761</div>
        <div class="formItems">手机号：18549963761</div>
         <div class="formItems">与户主关系：户主</div>
          <div  class="formItems" >行政区划：韶山市银田镇杨林乡禁山湾17组108号</div>
        <div  class="formItems" >地址：韶山市银田镇杨林乡禁山湾17组108号</div>
      </div>
     <div class="div">
        <div label="姓名：" class="formItems" >积分：4</div>
        <div label="性别：" class="formItems" >积分：19</div>
        <div label="手机号：" class="formItems" >等级：L1</div>
        <div label="地址：" class="formItems" >荣誉称号：积极村民</div>
      </div>
    </div>
    <el-table border :data="tableListData" style="width: 100%">
      <el-table-column prop="date" label="姓名"></el-table-column>
      <el-table-column prop="name" label="性别" show-overflow-tooltip width="180"></el-table-column>
      <el-table-column prop="address" label="手机号"></el-table-column>
      <el-table-column prop="address" label="与户主关系"></el-table-column>
      <el-table-column prop="address" label="积分"></el-table-column>
      <el-table-column prop="address" label="等级"></el-table-column>
      <el-table-column prop="address" label="荣誉称号"></el-table-column>
      <el-table-column prop="address" label="积分"></el-table-column>
    </el-table>
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
tableListData:[],
};
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {

},
//方法集合
methods: {

},
}
</script>
<style lang='less'>
//@import url(); 引入公共css类
.leftHeadImgs img{
    border-radius: 0!important;
    // border:0!important;
}
</style>