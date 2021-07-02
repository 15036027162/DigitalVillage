<!--  -->
<template>
  <el-dialog
    class="addEdits"
    title="积分发放-修正"
    :visible.sync="dialogFormVisible"
    width="600px"
    :before-close="handleClose"
  >
    <el-form :model="form" ref="form" :rules="editRules">
      <el-form-item
        label="姓名："
        class="formItems"
        :label-width="labelWidth"
        >{{ info.name }}</el-form-item
      >
      <el-form-item
        label="性别："
        class="formItems"
        :label-width="labelWidth"
        >{{ info.ssex == 1 ? "男" : "女" }}</el-form-item
      >
      <el-form-item
        label="手机号："
        class="formItems"
        :label-width="labelWidth"
        >{{ info.mobile }}</el-form-item
      >
      <el-form-item
        label="与户主关系："
        class="formItems"
        :label-width="labelWidth"
        >{{ formatter2(info.isHousehold) }}</el-form-item
      >
      <el-form-item
        label="地址："
        class="formItems formItems1"
        :label-width="labelWidth"
        >{{ info.fixedAddress }}</el-form-item
      >
      <br />
      <el-form-item
        label="场景分类："
        class="formItems"
        :label-width="labelWidth"
        >{{ formatter1(info.scene) }}</el-form-item
      >
      <el-form-item label="积分：" class="formItems" :label-width="labelWidth"
        >{{ info.isAddPlus == "1" ? "+" : "-"
        }}{{ info.honorPoint }}</el-form-item
      >
      <el-form-item label="积分：" class="formItems" :label-width="labelWidth"
        >{{ info.isAddPlus == "1" ? "+" : "-"
        }}{{ info.integralPoint }}</el-form-item
      >
      <el-form-item
        label="状态："
        class="formItems"
        :label-width="labelWidth"
        >{{ formatter3(info.state) }}</el-form-item
      >
<div v-if="info.avatar" class="leftHeadImg1">
      <img   :src="info.avatar" alt />
      </div>
      <img
        class="leftHeadImg"
        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        alt
        v-else
      />

      <el-form-item label="处理方式：" prop="resource" style="margin-top:10px">
        <el-radio-group v-model="form.method">
          <el-radio :label="1">维持原有</el-radio>
          <el-radio :label="2">取消给分</el-radio>
          <el-radio :label="3">手动给分</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.method == 3">
        <!-- <el-col :span="11">
          <el-form-item prop="honorValue" label="积分：">
            <el-input v-model="form.honorValue" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
          </el-form-item>
        </el-col>

        <el-col class="line" :span="2"></el-col>
        <el-col :span="11">
          <el-form-item prop="ponits" label="积分：">
            <el-input v-model="form.ponits" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
          </el-form-item>
        </el-col>-->
        <el-form-item label="积分：" :label-width="labelWidth">
          <div class="addbox">
            <!-- <div>
              <el-button size="medium" @click="changehonor(2)">-</el-button>
              <el-input
                v-model="form.honorValue1"
                oninput="value=value.replace(/[^\d^\.]/g,'')"
                @input="inputs(2)"
              ></el-input>
            </div>
            <div>
              <el-button size="medium" @click="changehonor(1)">+</el-button>
              <el-input
                v-model="form.honorValue"
                oninput="value=value.replace(/[^\d^\.]/g,'')"
                @input="inputs(1)"
              ></el-input>
            </div> -->
            <div>
              <el-radio-group
                v-model="form.isAddPlusHonor"
                size="medium"
                @change="changehonor"
              >
                <el-radio-button :label="1">加分</el-radio-button>
                <el-radio-button :label="2">减分</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <el-input
                v-model="form.honorValue"
                oninput="value=value.replace(/[^\d^\.]/g,'')"
              ></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="积分：" :label-width="labelWidth">
          <div class="addbox">
            <!-- <div>
              <el-button size="medium" @click="changepoint(2)">-</el-button>
              <el-input
                v-model="form.ponit1"
                oninput="value=value.replace(/[^\d^\.]/g,'')"
                @input="inputs1(2)"
              ></el-input>
            </div>
            <div>
              <el-button size="medium" @click="changepoint(1)">+</el-button>
              <el-input
                v-model="form.ponits"
                oninput="value=value.replace(/[^\d^\.]/g,'')"
                @input="inputs1(1)"
              ></el-input>
            </div> -->

            <div>
              <el-radio-group
                v-model="form.isAddPlusIntegral"
                size="medium"
                @change="changepoint"
              >
                <el-radio-button :label="1">加分</el-radio-button>
                <el-radio-button :label="2">减分</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <el-input
                v-model="form.ponits"
                oninput="value=value.replace(/[^\d^\.]/g,'')"
              ></el-input>
            </div>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="goReject('form')">取消</el-button>
      <el-button type="primary" @click="submitForm('form')">修正</el-button>
    </div>
  </el-dialog>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  props: {
    memberId: {
      type: String
    },
    info: {
      type: Object
    }
  },
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        honorValue: "",
        honorValue1: "",
        ponits: "",
        ponits1: "",
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        method: 1,
        isAddPlusHonor: 1,
        isAddPlusIntegral: 1
      },
      labelWidth: "100px",
      adminUserInfo: "",
      editRules: {
        honorValue: [
          {
            required: false,
            message: "请输入积分",
            trigger: "blur"
          }
        ],
        ponits: [
          {
            required: false,
            message: "请输入积分",
            trigger: "blur"
          }
        ]
      }
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    // this.form.honorValue = this.info.honorPoint;
    // this.form.ponits = this.info.integralPoint;
  },

  //方法集合
  methods: {
    handleClose(done) {
      this.dialogFormVisible = false;
      this.form.honorValue = "";
      this.form.ponits = "";
      this.form.method = 1;
      // this.ruleForm.desc = "";
      this.form.isAddPlusHonor = 1;
      this.form.isAddPlusIntegral = 1;
    },
    changehonor(type) {
      this.form.honorValue = "";
    },

    changepoint(type) {
      this.form.ponits = "";
    },
    // changehonor(type) {
    //   if (type == 1) {
    //     this.form.honorValue++;
    //   } else {
    //     this.form.honorValue1++;
    //   }

    //   this.form.isAddPlusHonor = type;
    // },

    // changepoint(type) {
    //   if (type == 1) {
    //     this.form.ponits++;
    //   } else {
    //     this.form.ponits1++;
    //   }

    //   this.form.isAddPlusIntegral = type;
    // },
    inputs(type) {
      this.form.isAddPlusHonor = type;
    },
    inputs1(type) {
      this.form.isAddPlusIntegral = type;
    },
    // 获取列表数据

    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.form.method == 3) {
            var obj = {
              memberId: this.memberId,
              loginMemberId: this.adminUserInfo.memberId,
              name: this.info.name,
              honorDetailId: this.info.honorDetailId,
              integralDetailId: this.info.integralDetailId,
              method: this.form.method,
              isAddPlusHonor: this.form.isAddPlusHonor,
              honorPoint: Number(this.form.honorValue),
              isAddPlusIntegral: this.form.isAddPlusIntegral,
              integralPoint: Number(this.form.ponits)
              // isAddPlusHonor: this.form.isAddPlusHonor,
              // honorPoint:
              //   this.form.isAddPlusHonor == 1
              //     ? this.form.honorValue
              //     : this.form.honorValue1,
              // isAddPlusIntegral: this.form.isAddPlusIntegral,
              // integralPoint:
              //   this.form.isAddPlusIntegral == 1
              //     ? this.form.ponits
              //     : this.form.ponits1
            };
          } else {
            var obj = {
              memberId: this.memberId,
              loginMemberId: this.adminUserInfo.memberId,
              name: this.info.name,
              honorDetailId: this.info.honorDetailId,
              integralDetailId: this.info.integralDetailId,
              method: this.form.method
            };
          }
          const res = await this.$http.correctHonorIntegralPoint(obj);
          if (res.status === "success") {
            this.$message({
              type: "success",
              message: res.msg
            });
            setTimeout(() => {
              this.form.honorValue = "";

              this.form.ponits = "";

              this.dialogFormVisible = false;
              this.form.method = 1;
              this.form.isAddPlusHonor = 1;
              this.form.isAddPlusIntegral = 1;
              this.$emit("changehonor");
            }, 1000);
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        } else {
          this.$message.warning("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    goReject(formName) {
      this.dialogFormVisible = false;
      this.form.honorValue = "";
      this.form.ponits = "";
      this.form.method = 1;
      this.form.isAddPlusHonor = 1;
      this.form.isAddPlusIntegral = 1;
    },
    formatter3(state) {
      if (state == 1) {
        return "待审核";
      } else if (state == 2) {
        return "已驳回";
      } else if (state == 3) {
        return "被投诉";
      } else if (state == 4) {
        return "公示中";
      } else if (state == 5) {
        return "已完成";
      }
    },
    formatter1(scene) {
      var day = "";
      switch (scene) {
        case "1":
          day = "垃圾分类";
          break;
        case "2":
          day = "环境治理";
          break;
        case "3":
          day = "文明建设";
          break;
             case "4":
          day = "积分兑换";
          break;
        default:
          day = "垃圾分类";
      }
      return day;
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
.addEdits {
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
      width: 80px;

      .el-input__inner {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        // border-radius: 0;
      }
    }
    input {
      vertical-align: baseline;
    }
  }
  .el-dialog__body {
    position: relative;
    overflow: hidden;
  }
  .el-form-item {
    margin-bottom: 14px;
  }
  .formItems1 {
    width: 350px;
  }
  .el-input {
    width: 120px;
  }
  .leftHeadImg {
    width: 200px;
  
  }
   .leftHeadImg1{
     width: 130px;
     height:130px;
     overflow: hidden;
     border-radius: 50%;
     border:1px solid #ccc ;
       position: absolute;
    right: 24px;
    top: 24px;
     img{
         width: 130px;
      height:130px;
     }
  }

  .leftHeadImg {
    width: 130px;
    height:130px;
      position: absolute;
    right: 24px;
    top: 24px;
  }

  .el-form-item {
    margin-bottom: 10px;
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
  .addbox {
    overflow: hidden;
    .el-button {
      &:first-child {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }
      &:last-child {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }
    .el-select {
      width: 247px;
    }
    .el-input {
      display: inline-block;
      width: 150px;

      .el-input__inner {
        border-radius: 0;
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