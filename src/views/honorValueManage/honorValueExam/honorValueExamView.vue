<!--  -->
<template>
  <div class="honorValueExamView">
    <div class="rightBtn">
      <!-- v-if="type==2" -->
      <el-button type="text" style="color:#F56C6C" @click="goExamines(2)" v-if="type == 2"
        >驳回</el-button
      >
      <el-button type="text"  @click="goExamines(1)" v-if="type == 2"
        >通过</el-button
      >
    </div>
    <h3 style="text-align:center">积分发放申请单</h3>
    <div class="tabletit">
      <div class="pnumber">批次编号：{{ details.issue }}</div>
      <div class="pnumber">
        审核状态：<span>{{ formatter2(details.state) }}</span>
      </div>
    </div>
    <table style="width:100%" class="table_content">
      <tr>
        <td>场景分类：{{ details.sceneClassifyExplain }}</td>
        <td>申请人：{{ details.creatorName }}</td>
        <td>申请日期：{{ details.createTime }}</td>
      </tr>
      <tr>
        <td>事件名称</td>
        <td colspan="2">{{ details.sceneName }}</td>
      </tr>
      <tr>
        <td>参与人/户</td>
        <td colspan="2">{{ details.memberCount }}</td>
      </tr>
      <tr v-if="type == 1&&state==2">
        <td>驳回理由</td>
        <td colspan="2">{{ details.comment }}</td>
      </tr>
    </table>

    <el-table border :data="tableListData" style="width: 100%">
      <el-table-column prop="date" label="村民基本信息" style="width:60%">
        <template slot-scope="scope">
          <div>户主姓名：{{ scope.row.name }}</div>
          <div>户主手机号：{{ scope.row.mobile }}</div>
          <div>户主身份证号码：{{ scope.row.identity }}</div>
          <!-- <div>与户主关系：{{ formatter1(scope.row.isHousehold) }}</div> -->
          <div class="adress">
            家庭地址：{{ scope.row.areaName }}{{ scope.row.streetName
            }}{{ scope.row.villageName }}{{ scope.row.groupName
            }}{{ scope.row.houseNumber }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="picUrl" label="图片" style="width:20%">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt width="100px" v-if="scope.row.picUrl" />
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="事件说明" style="width:20%">
        <template slot-scope="scope">
          <div>
            {{scope.row.remark?scope.row.remark:'--'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="发放积分" style="width:20%">
        <template slot-scope="scope">
          <div>
            {{ scope.row.isAddPlus == 1 ? "+" : "-" }}{{ scope.row.scores }}
          </div>
        </template>
      </el-table-column>
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
    <el-dialog
      class="addEdit"
      title="驳回操作"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
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
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定驳回</el-button
        >
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
          {
            required: false,
            message: "请输入20字以内驳回说明",
            trigger: "blur",
            min: 1,
            max: 20
          }
        ]
      },
      labelWidth: "90px",
      tableListData: [],
      details: {},
      listMain: {
        pageNo: 1,
        totalPage: 1,
        pageSize: 10,
        total: 100
      },
      adminUserInfo: {},
      honorSetId: "",
      issue: "",
      type: "",
      isAudit: "",
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isPower: false,
      role_list: [],
      villageCode: "",
      list: []
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.type = this.$route.query.type;
    this.issue = this.$route.query.issue;
    this.state = this.$route.query.state;
    this.villageCode = this.$route.query.villageCode;
    this.honorSetId = this.$route.query.honorSetId;
    this.type = this.$route.query.type;
    if (this.$route.query.type == 1) {
      this.$route.meta.title = "查看";
    } else {
      this.$route.meta.title = "审核";
    }
      //this.getList();
    this.getListData();
  
  },
  watch: {},
  //方法集合
  methods: {
      goReject(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // 获取列表数据
    async getList() {
      const res = await this.$http.getSelectDictionary({
        type: 3
      });
      if (res.status === "success") {
        this.list = res.data;
      } else {
      }
    },
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getHonorIntegerByIssue({
        memberId: this.memberId,
        issue: this.issue,
        villageCode: this.villageCode,
        pageNumber: this.listMain.pageNo,
        pageSize: this.listMain.pageSize
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData;
        this.tableListData = resData.list || [];
        this.listMain.total = resData.total || 0;
        this.listMain.pageNo = resData.pageNum || 1;
        this.listMain.totalPage = resData.pages || 0;
        this.listMain.pageSize = resData.pageSize || 10;
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    formatter4(scene) {
      var index = this.list.findIndex(val => {
        return val.id == scene;
      });
     if (index != -1) {
        return this.list[index].name;
      }
    },

    // formatter1(isHousehold) {
    //   var day = "";
    //   switch (isHousehold) {
    //     case "1":
    //       day = "户主";
    //       break;
    //     case "2":
    //       day = "配偶";
    //       break;
    //     case "3":
    //       day = "子女";
    //       break;
    //     case "4":
    //       day = "父母";
    //       break;
    //     case "5":
    //       day = "孙子孙女";
    //       break;
    //     case "6":
    //       day = "祖父母";
    //       break;
    //     case "7":
    //       day = "兄弟姐妹";
    //       break;
    //     case "8":
    //       day = "女婿儿媳";
    //       break;
    //     case "9":
    //       day = "其他";
    //       break;
    //     default:
    //       day = "其他";
    //   }
    //   return day;
    // },
    formatter2(state) {
      if (state == 1) {
        return "待审核";
      } else if (state == 2) {
        return "审核未通过";
      } else if (state == 3) {
        return "审核通过";
      }
    },
    handleCurrentChange(val) {
      this.listMain.pageNo = val;
    },
    submitForm(formName) {
    
        this.rules.desc[0].required = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.exam(2);
          } else {
            this.$message.warning("请修改表单提示区域内容后重新提交！");
            return false;
          }
        });
      } ,
    
    goExamines(type) {
      //审核通过
      if (type == 1) {
        this.$alert("确定通过第"+this.details.issue+"期"+this.details.creatorName+"提交的积分发放？", "通过操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(_ => {
            this.exam(1);
          })
          .catch(_ => {});
      } else {
        //审核不通过
        this.dialogFormVisible = true;
      }
    },
    
    async exam(type) {
 
      const res = await this.$http.updateHonorIntegralState({
        issue: this.issue,
        honorSetId: this.honorSetId,
        state: type,
        comment: this.ruleForm.desc
      });

      if (res.code === "0") {
        this.$message({
          type: "success",
          message: res.msg
        });
        setTimeout(() => {
          this.$router.go(-1);
          this.dialogFormVisible = false;
        }, 1500);
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    }}
  
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
.honorValueExamView {
  .el-table tr td .cell {
    overflow: auto;
    display: inline-block;
    /* text-overflow: ellipsis; */
    /* display: -webkit-box; */
    /* -webkit-line-clamp: 2; */
    /* -webkit-box-orient: vertical; */
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }
  .el-table td,
  .el-table th.is-leaf {
    text-align: left !important;
  }
  .adress {
    // width:300px;
    word-wrap: break-word;
  }
  .table_content {
    width: 100%;
    color: #606266;
    font-size: 14px;
    border: 1px solid #dcdfe6;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .table_content td {
    padding: 14px 0;
    line-height: 24px;
    text-align: center;
    border: 1px solid #a4a4a9;
  }
}
</style>