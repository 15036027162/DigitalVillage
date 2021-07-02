<!--  -->
<template>
  <div class="honorValuePonitView" id="pdfDom">
    <div class="rightBtn">
      <!-- <el-button type="text" @click="exportBtn">导出明细</el-button> -->
    </div>
    <div class="formdiv">
      <div class="leftHeadImg div">
        <img class :src="details.avatar" alt v-if="details.avatar" />
        <img
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          alt
          v-else
        />
        <div>
          {{ details.rankTitle || "L1"
          }}:{{ details.rankTitleExplain || "普通村民村民" }}
        </div>
      </div>
      <div class="div">
        <div class="formItems">姓名：{{ details.name || "无" }}</div>
        <div class="formItems">性别：{{ details.ssex == 1 ? "男" : "女" }}</div>
        <div class="formItems">身份证号：{{ details.identity || "无" }}</div>
        <div class="formItems">手机号：{{ details.mobile || "无" }}</div>
        <div class="formItems">
          与户主关系：{{ details.isHousehold || "无" }}
        </div>
        <div class="formItems">
          行政区划：{{ details.areaName }}{{ details.streetName
          }}{{ details.villageName }}
        </div>
        <div class="formItems">地址：{{ details.fixedAddress || "无" }}</div>
      </div>
      <div class="honorValue div">
        <div class="honorCon">{{ details.honorPointTotal }}</div>
        <div>积分</div>
      </div>
      <div class="honorValue div">
        <div class="honorCon">{{ details.integralPointTotal }}</div>
        <div>积分余额</div>
      </div>
    </div>
    <el-table border :data="tableListData" style="width: 100%">
      <el-table-column prop="modifyTime" label="发生时间"></el-table-column>
      <el-table-column prop="modifierName" label="操作员"></el-table-column>
      <el-table-column
        prop="scene"
        label="场景"
        :formatter="formatter1"
      ></el-table-column>
      <el-table-column prop="honorPoint" label="积分+-">
        <template slot-scope="scope"
          >{{ scope.row.isAddPlusHonor == 1 ? "+" : "-"
          }}{{ scope.row.honorPoint }}</template
        >
      </el-table-column>
      <el-table-column prop="integralPoint" label="积分+-">
        <template slot-scope="scope"
          >{{ scope.row.isAddPlusIntegral == 1 ? "+" : "-"
          }}{{ scope.row.integralPoint }}</template
        >
      </el-table-column>
      <!-- <el-table-column prop="address" label="积分结算">
      </el-table-column>
      <el-table-column prop="address" label="积分余额"></el-table-column>-->
    </el-table>
    <el-pagination
      class="paging"
      background
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, jumper"
      v-if="listMain.totalPage > 0"
      :page-size="listMain.pageSize"
      :page-count="listMain.totalPage"
      :pager-count="7"
      :current-page.sync="listMain.pageNo"
      :total="listMain.total"
    ></el-pagination>
    <!-- <el-dialog class="addEdit" title="导出个人明细" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="forms" :rules="rules" ref="forms">
        <div style="text-align: center;margin-bottom:20px">请选择要导出的时间段</div>
        <el-form-item label>
          <el-col :span="11">
            <el-form-item label>
              <el-date-picker
                v-model="forms.start"
                type="date"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
                placeholder="xxxx年xxx月xx日"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-form-item label>
              <el-date-picker
                v-model="forms.end"
                type="date"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
                placeholder="xxxx年xxx月xx日"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goReject('forms')">取消</el-button>
        <el-button type="primary" @click="submitForm('forms')">导出</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import pdfHtml from "./pdfHtml";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { pdfHtml },
  data() {
    //这里存放数据
    return {
      dialogFormVisible: false,
      htmlTitle: "页面导出PDF文件名",
      forms: {
        start: "",
        end: ""
      },
      form: {
        honorValue: "",
        ponits: "",
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      labelWidth: "90px",
      tableListData: [],
      listMain: {
        pageNo: 1,
        totalPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        start: [
          {
            type: "date",
            required: true,
            message: "请选择开始日期",
            trigger: "change"
          }
        ],
        end: [
          {
            type: "date",
            required: true,
            message: "请选择结束日期",
            trigger: "change"
          }
        ]
      },
      memberId: "",
      adminUserInfo: {},
      details: {}
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));

    if (this.$route.query.memberId) {
      this.memberId = this.$route.query.memberId;

      this.getListData();
    }
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getHonorIntegerDetail({
        memberId: this.memberId,
        loginMemberId: this.adminUserInfo.memberId,
        pageNumber: this.listMain.pageNo,
        pageSize: this.listMain.pageSize
      });
      if (res.status === "success") {
        var resData = res.data || {};
        var isHousehold = this.formatter2(resData.baseInfo.isHousehold);
        resData.baseInfo.isHousehold = isHousehold;
        this.details = resData.baseInfo;
        if (resData.HonorMap) {
          this.listMain.total = resData.HonorMap.total || 0;
          this.listMain.pageNo = resData.HonorMap.pageNum || 1;
          this.listMain.totalPage = resData.HonorMap.pages || 0;
          this.listMain.pageSize = resData.HonorMap.pageSize || 10;
          this.tableListData = resData.HonorMap.list || [];
        }
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    handleCurrentChange(val) {
      this.listMain.pageNo = val;
      this.getListData();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          this.$message.warning("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    exportBtn() {
      this.getPdf();
      return;
      this.dialogFormVisible = true;
      this.$refs["ruleForm"].resetFields();
    },
    goReject(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    formatter1(row) {
      var day = "";
      switch (row.scene) {
        case 1:
          day = "垃圾分类";
          break;
        case 2:
          day = "环境治理";
          break;
        case 3:
          day = "文明建设";
          break;
           case 4:
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
.honorValuePonitView {
  .formdiv {
    overflow: hidden;
    margin-bottom: 20px;
    .div {
      float: left;
      margin-right: 40px;
    }
  }
  .formItems {
    margin-bottom: 0;
    line-height: 30px;
  }
  .leftHeadImg {
    width: 160px;
    height: 160px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #ccc;
    }
    div {
        width: 128px;
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      background: #1cc2ac;
      border-radius: 4px;
      color: #fff;
      text-align: center;
      position: absolute;
      bottom: -10px;
      transform: translateX(-50%);
      left: 50%;
    }
  }
  .honorValue {
    font-size: 16px;
    text-align: center;
    font-weight: bold;

    div {
      margin: 0 auto;
    }
    .honorCon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 1px solid #ccc;
      margin-bottom: 10px;
      line-height: 100px;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }
}
</style>