<!--  -->
<template>
  <div>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
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
      dialogFormVisible: false,
      form: {
        name: "",
        region: ""
      },
      formLabelWidth: "120px"
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //方法集合
  methods: {
    init() {
        
      this.form = {
        name: "小张",
        region: "shanghai"
      };
       return new Promise((resolve, reject) => {
        this.resolve = resolve
        //console.log(this.resolve);
        this.reject = reject
      })
    },
    submitFn(){
        this.resolve(1)
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>