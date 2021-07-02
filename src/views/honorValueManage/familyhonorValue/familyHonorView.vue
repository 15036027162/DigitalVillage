<!--  -->
<template>
  <div class="honorValuePonitView" id="pdfDom">
    <div class="rightBtn">
      <!-- <el-button type="text" @click="exportBtn">导出明细</el-button> -->
    </div>
    <div class="formdiv">
      <div class="leftHeadImg div">
        
        <img
          src="../../../assets/u5451.png"
          alt
         
        />
        
      </div>
      <div class="div">
        <div class="formItems">户主姓名：{{ details.name || "无" }}</div>
               <div class="formItems">户主手机号：{{ details.mobile || "无" }}</div>
    
        <div class="formItems">户主身份证号：{{ details.identity || "无" }}</div>
 
      
        <div class="formItems">
          家庭地址：{{ details.areaName }}{{ details.streetName
          }}{{ details.villageName }}{{ details.groupName }}{{ details.groupName?'组':''}}{{ details.houseNumber }}{{ details.houseNumber?'号':''}}
        </div>
        
      </div>
      <div class="honorValue div">
        <div class="honorCon">{{ details.honorPoint }}</div>
        <div>积分总额</div>
      </div>
      <div class="honorValue div">
        <div class="honorCon">{{ details.rank }}</div>
        <div>家庭排名</div>
      </div>
    </div>
    <el-table border :data="tableListData" style="width: 100%">
      <el-table-column prop="modifyTime" label="发生时间"></el-table-column>
      <el-table-column prop="modifierName" label="操作员"></el-table-column>
      <el-table-column
        prop="sceneName"
        label="变更事项"
      
      ></el-table-column>
       <el-table-column prop="honorName" label="贡献者"></el-table-column>
       <el-table-column prop="modifyTime" label="贡献或消费">
            <template slot-scope="scope"
          >{{ scope.row.isAddPlus == 1 ? "+" : "-"
          }}{{ scope.row.honorPoint }}</template
        >
       </el-table-column>
       <el-table-column prop="integralTotal" label="可用额度"></el-table-column>
        <el-table-column prop="honorTotal" label="积分结算总额"></el-table-column>
    
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
   
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
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
      doorMemberId: "",
      adminUserInfo: {},
      details: {},
      villageCode:'',
      doorNum:''
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));

    if (this.$route.query.doorMemberId) {
      this.doorMemberId = this.$route.query.doorMemberId;
      this.villageCode = this.$route.query.villageCode;
      this.doorNum = this.$route.query.doorNum;
      this.getListData();
    }
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getDoorHonorDetail({
        doorMemberId: this.doorMemberId,
        doorNum:this.doorNum,
        villageCode:this.villageCode,
        pageNumber: this.listMain.pageNo,
        pageSize: this.listMain.pageSize
      });
      if (res.status === "success") {
        var resData = res.data || {};
      
        this.details = resData;
        if (resData.map) {
          this.listMain.total = resData.map.total || 0;
          this.listMain.pageNo = resData.map.pageNum || 1;
          this.listMain.totalPage = resData.map.pages || 0;
          this.listMain.pageSize = resData.map.pageSize || 10;
          this.tableListData = resData.map.list || [];
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