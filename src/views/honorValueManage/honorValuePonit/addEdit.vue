<!--  -->
<template>
  <el-dialog
    class="addEdit"
    title="积分积分修改"
    :visible.sync="dialogFormVisible"
    width="600px"
    :before-close="handleClose"
  >
    <el-form :model="ruleForm" :rules="rules1" ref="ruleForm">
      <el-row :gutter="10">
        <el-col :span="6">
          <div  v-if="details.avatar"  class="leftHeadImg1">
          <img

            :src="details.avatar"
            alt

          />
          </div>
          <img
            class="leftHeadImg"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            alt
            v-else
          />
        </el-col>
        <el-col :span="18">
          <el-form-item
            label="姓名："
            class="formItems"
            :label-width="labelWidth"
            >{{ details.name }}</el-form-item
          >
          <el-form-item
            label="性别："
            class="formItems"
            :label-width="labelWidth"
            >{{ details.ssex == 1 ? "男" : "女" }}</el-form-item
          >
          <el-form-item
            label="手机号："
            class="formItems"
            :label-width="labelWidth"
            >{{ details.mobile || "无" }}</el-form-item
          >
          <el-form-item
            label="与户主关系："
            class="formItems"
            :label-width="labelWidth"
            >{{ details.isHousehold || "无" }}</el-form-item
          >
          <el-form-item
            label="地址："
            class="formItems formItems1"
            :label-width="labelWidth"
            >{{ details.fixedAddress || "无" }}</el-form-item
          >
          <el-form-item label="积分：" :label-width="labelWidth">
            <div class="addbox">
              <!-- <div>
                <el-button size="medium" @click="changehonor(2)">-</el-button>
                <el-input
                  v-model="ruleForm.honorValue1"
                  oninput="value=value.replace(/[^\d^\.]/g,'')"
                  @input="inputs(2)"
                ></el-input>
              </div>
              <div>
                <el-button size="medium" @click="changehonor(1)">+</el-button>
                <el-input
                  v-model="ruleForm.honorValue"
                  oninput="value=value.replace(/[^\d^\.]/g,'')"
                  @input="inputs(1)"
                ></el-input>
              </div> -->
              <div>
                <el-radio-group
                  v-model="ruleForm.isAddPlusHonor"
                  size="medium"
                  @change="changehonor"
                >
                  <el-radio-button :label="1">加分</el-radio-button>
                  <el-radio-button :label="2">减分</el-radio-button>
                </el-radio-group>
              </div>
              <div>
                <el-input
                  v-model="ruleForm.honorValue"
                  oninput="value=value.replace(/[^\d^\.]/g,'')"
                ></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="积分：" :label-width="labelWidth">
            <div class="addbox">
              <div>
                <el-radio-group
                  v-model="ruleForm.isAddPlusIntegral"
                  size="medium"
                  @change="changepoint"
                >
                  <el-radio-button :label="1">加分</el-radio-button>
                  <el-radio-button :label="2">减分</el-radio-button>
                </el-radio-group>
              </div>
              <div>
                <el-input
                  v-model="ruleForm.ponits"
                  oninput="value=value.replace(/[^\d^\.]/g,'')"
                ></el-input>
              </div>
              <!-- <div>
                <el-button size="medium" @click="changepoint(2)">-</el-button>
                <el-input
                  v-model="ruleForm.ponits1"
                  oninput="value=value.replace(/[^\d^\.]/g,'')"
                  @input="inputs1(2)"
                ></el-input>
              </div>
              <div>
                <el-button size="medium" @click="changepoint(1)">+</el-button>
                <el-input
                  v-model="ruleForm.ponits"
                  oninput="value=value.replace(/[^\d^\.]/g,'')"
                  @input="inputs1(1)"
                ></el-input>
              </div> -->
            </div>
          </el-form-item>
          <el-form-item label="等级称号：" :label-width="labelWidth">
            <el-select
              v-model="ruleForm.rankTitle"
              placeholder="请选择等级称号"
            >
              <el-option label="普通村民" value="L1"></el-option>
              <el-option label="积极村民" value="L2"></el-option>
              <el-option label="优秀村民" value="L3"></el-option>
              <el-option label="先进村民" value="L4"></el-option>
              <el-option label="杰出村民" value="L5"></el-option>
              <el-option label="模范村民" value="L6"></el-option>
              <el-option label="加冕乡贤" value="L7"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="修改理由："
        label-width="100px"
        prop="desc"
        class="textaresa"
      >
        <el-input
          v-model="ruleForm.desc"
          type="textarea"
          placeholder="请输入10字以内的积分积分修改理由"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="goReject('ruleForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >确定修改</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    memberId: {
      type: String
    }
  },
  data() {
    //这里存放数据
    return {
      dialogFormVisible: false,
      ruleForm: {
        honorValue: "",
        ponits: "",
        honorValue1: "",
        ponits1: "",
        name: "",
        rankTitle: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        isAddPlusHonor: 1,
        isAddPlusIntegral: 1
      },
      labelWidth: "100px",
      rules1: {
        desc: [
          {
            required: true,
            message: "请输入10字以内的积分积分修改理由",
            trigger: "blur",
            min: 1,
            max: 10
          }
        ]
      },
      adminUserInfo: "",
      details: {}
    };
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));

    // if (this.memberId) {
    //   this.getListData();
    // }
  },
  watch: {
    memberId() {
      this.getListData();
    }
  },
  //方法集合
  methods: {
    handleClose(done) {
      this.$refs["ruleForm"].resetFields();
      this.dialogFormVisible = false;
      this.ruleForm.honorValue = "";
      this.ruleForm.ponits = "";
      this.ruleForm.desc = "";
      this.ruleForm.isAddPlusHonor = 1;
      this.ruleForm.isAddPlusIntegral = 1;
    },
    changehonor(type) {
      this.ruleForm.honorValue = "";
    },

    changepoint(type) {
      this.ruleForm.ponits = "";
    },
    inputs(type) {
      this.ruleForm.isAddPlusHonor = type;
    },
    inputs1(type) {
      this.ruleForm.isAddPlusIntegral = type;
    },
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getHonorIntegerDetail({
        memberId: this.memberId,
        loginMemberId: this.adminUserInfo.memberId,
        pageNumber: 1,
        pageSize: 10
      });
      if (res.status === "success") {
        var resData = res.data || {};
        var isHousehold = this.formatter2(resData.baseInfo.isHousehold);
        resData.baseInfo.isHousehold = isHousehold;
        this.details = resData.baseInfo;
        console.log(this.details);
        this.ruleForm.rankTitle = resData.baseInfo.rankTitle;
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    async submitForm(formName) {


      // if(this.ruleForm.honorValue==''&&this.ruleForm.ponits==''){

      // }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          var obj = {
            loginMemberId: this.adminUserInfo.memberId,
            memberId: this.memberId,
            name: this.details.name,
            isAddPlusHonor: this.ruleForm.isAddPlusHonor,
            honorPoint:Number(this.ruleForm.honorValue),
            isAddPlusIntegral: this.ruleForm.isAddPlusIntegral,
            integralPoint: Number(this.ruleForm.ponits),
            rankTitle: this.ruleForm.rankTitle,
            comment: this.ruleForm.desc
          };

          const res = await this.$http.updateHonorIntegralPoint(obj);
          if (res.status === "success") {
            this.$message({
              type: "success",
              message: res.msg
            });
            setTimeout(() => {
              this.ruleForm.honorValue = "";
              this.ruleForm.ponits = "";
              this.ruleForm.desc = "";
              this.ruleForm.isAddPlusHonor =1;
              this.ruleForm.isAddPlusIntegral = 1;
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              this.$emit("changehonor");
            }, 1000);
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        } else {
          // this.$message.warning("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    goReject(formName) {
      this.$refs[formName].resetFields();
       this.ruleForm.honorValue = "";
              this.ruleForm.ponits = "";
              this.ruleForm.desc = "";
              this.ruleForm.isAddPlusHonor =1;
              this.ruleForm.isAddPlusIntegral = 1;
      this.dialogFormVisible = false;
    },
    formatter2(isHousehold) {
      var day = "";
      switch (isHousehold) {
        case "1":
          day = "户主";
          break;
        case "2":
          day = "配偶";
          break;
        case "3":
          day = "子女";
          break;
        case "4":
          day = "父母";
          break;
        case "5":
          day = "孙子孙女";
          break;
        case "6":
          day = "祖父母";
          break;
        case "7":
          day = "兄弟姐妹";
          break;
        case "8":
          day = "女婿儿媳";
          break;
        case "9":
          day = "其他";
          break;
        default:
          day = "其他";
      }
      return day;
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
.addEdit {
  .formItems1 {
    width: 350px;
    margin-bottom: 10px !important;
  }
  .el-input {
    width: 246px;
  }
  .leftHeadImg1{
     width: 130px;
     height:130px;
     overflow: hidden;
     border-radius: 50%;
     border:1px solid #ccc ;
     img{
         width: 130px;
      height:130px;
     }
  }

  .leftHeadImg {
    width: 130px;
     height:130px;
  }
  .el-form-item__content {
    line-height: 24px !important;
  }
  .formItems {
    margin-bottom: 4px;
    .el-form-item__label {
      line-height: 24px !important;
    }
    .el-form-item__content {
      line-height: 24px !important;
    }
  }
  .el-form-item {
    margin-bottom: 14px;
  }

  .addbox {
    div {
      display: inline-block;
      &:first-child {
        margin-right: 20px;
      }
    }
    .el-button {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      border-right: 0;
      // &:first-child {
      //   border-top-right-radius: 0 !important;
      //   border-bottom-right-radius: 0 !important;
      // }
      // &:last-child {
      //   border-top-left-radius: 0 !important;
      //   border-bottom-left-radius: 0 !important;
      // }
    }
    .el-select {
      width: 247px;
    }
    .el-input {
      display: inline-block;
      width: 110px;

      .el-input__inner {
        // border-top-left-radius: 0 !important;
        // border-bottom-left-radius: 0 !important;
        // border-radius: 0;
      }
    }
    input {
      vertical-align: baseline;
    }
  }
  .dialog-footer {
    text-align: center;
    .el-button--default {
      margin-right: 60px;
    }
  }
}
</style>
