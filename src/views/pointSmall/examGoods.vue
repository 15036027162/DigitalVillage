
<template>
  <div class="policyView">
    <div class="rightBtn">
      <!-- <el-button type="text" @click="handleView(1,1)">添加</el-button> -->
    </div>
    <div class="viewItem">
      <label>商品名称：</label>
      <div>{{details.goodsName}}</div>
    </div>
    <div class="viewItem">
      <label>商品价格：</label>
      <div>{{details.price}}</div>
    </div>
    
    <div class="viewItem">
      <label>商品数量：</label>
      <div>{{details.stock}}</div>
    </div>
    <div class="viewItem">
      <label>兑换值：</label>
      <div>{{details.changePoint}}</div>
    </div>
    <div class="viewItem">
      <label>商品图片：</label>
      <div>
        <img
          class
          :src="details.picUrl"
          alt
        />
        <!-- <span>注：移动端显示</span>  -->
      </div>
    </div>
    
    <div  style="margin-left:60px">
      <el-button type="primary" size="medium" @click="goExam(1)">确认通过</el-button>
      <el-button  style="margin-left:40px"  size="medium" @click="goExam(2)">不通过</el-button>
    </div>
    <el-dialog class="addEdit" title="广告审核" :visible.sync="dialogFormVisible" :before-close="handleClose" width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="desc" class="textaresa">
          <el-input
            type="textarea"
            v-model="ruleForm.desc"
            placeholder="请输入20字以内驳回说明"
           maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goReject('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">驳回</el-button>
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

      ruleForm: {
        desc: ""
      },
      rules: {
        desc: [
          { required: true, message: "请输入20字以内驳回说明", trigger: "blur", min: 1,
            max: 20, }
        ]
      },
 
adminUserInfo:{},
      details:{},
      isPower: false,
       role_list: [],
       deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
       this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
       this.role_list = this.adminUserInfo.role_list;
      //积分管理员id=7
      // let index = this.role_list.findIndex(val => {
      //   return val.id == "4"|| val.id == "1";
      // });
      let index = this.role_list.findIndex(val => {
        return val.id == "4";
      });
      if (index != -1) {
        this.isPower = true;
      } else {
        this.isPower = false;
      }
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.type = this.$route.query.type;
    }
   if(this.$route.query.id){
   this.id=this.$route.query.id
       this.type = this.$route.query.type;
}
    this.getListData()
  },
  //方法集合
  methods: {
     handleClose(done) {
          this.$refs["ruleForm"].resetFields();
       this.dialogFormVisible = false;
      },
      // 获取列表数据
    async getListData() {
      const res = await this.$http.exGoodsInfo({
        goodsId:this.id||1
      });
      if (res.status === "success") {
        var resData = res.data || {};
       this.details=resData[0]
        if (this.details.state == 1) {
       this.details.state1="待审核";
      } else if (this.details.state == 2) {
       this.details.state1="审核通过";
      } else {
       this.details.state1= "审核不通过";
      }
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
    
      }
    },
    goExam(type) {
      //审核通过

      if (type == 1) {
        this.$alert("确定要审核该商品么?", "审核确认", {
          confirmButtonText: "确定通过",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
            this.exam(3);
            done();
          })
          .catch(_ => {});
      } else {
         this.$alert("确定要审核该商品么?", "审核确认", {
          confirmButtonText: "不通过",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
            this.exam(2);
            done();
          })
          .catch(_ => {});
      }
    },
    async exam(type) {
      const res = await this.$http.updateExGoodsStatus({
        goodsId: this.id,
        type:1,
        status:type
      });
      if (res.code === "0") {
        this.$message({
          type: "success",
          message: res.msg
        });
        setTimeout(() => {
          this.$router.go(-1);
       
        }, 1000);
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
           if (type == 2) {
            this.dialogFormVisible = true;
          }
      }
    },
     submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.exam(2);
        } else {
          this.$message.warning("请输入20字以内驳回说明！");
          return false;
        }
      });
    },
   
    goReject(formName) {
      this.dialogFormVisible = false;
           this.$refs["ruleForm"].resetFields();
    },
  
  }
};
</script>
<style lang='less'>
.textaresa{
  font-family: "微软雅黑";
  textarea{
    font-family: "微软雅黑";
  }
}
</style>