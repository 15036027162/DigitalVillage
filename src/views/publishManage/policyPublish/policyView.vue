
<template>
  <div class="policyView">
       <!-- 审核状态： -->
    <!-- <div class="examstatus">
      <img
        src="../../../assets/1.png"
        alt=""
        class=""
        v-if="details.state == 1"
      />
      <img
        src="../../../assets/2.png"
        alt=""
        class=""
        v-if="details.state == 2"
      />
      <img
        src="../../../assets/3.png"
        alt=""
        class=""
        v-if="details.state == 3"
      />
    </div> -->
    <div class="examstatus examstatus1" v-if="type==3">
      <div>审核状态：</div>
      <span>{{ details.state1}}</span>
    </div>
    <div class="viewItem">
      <label>政策主题：</label>
      <div>{{ details.title }}</div>
    </div>
    <div class="viewItem">
      <label>{{type==3?'更新时间':'创建时间'}}：</label>
      <div>{{ details.createTime }}</div>
    </div>
    <div class="viewItem" v-if="type==4">
      <label>申请人：</label>
      <div>{{ details.creator }}</div>
    </div>
     <div class="viewItem" v-if="type==3">
      <label>所属区划：</label>
      <div>{{ details.areaName }}{{ details.streetName }}{{details.villageName}}</div>
    </div>
    <div class="viewItem" v-if="type==3">
      <label>操作人：</label>
      <div>{{ details.creator }}</div>
    </div>
    <div class="viewItem">
      <label>封面图片：</label>
      <div>
        <img v-if="details.fileUrl" class :src="details.fileUrl" alt />
      </div>
    </div>

    <div class="viewItem">
      <label>政策内容：</label>
      <div v-html="details.details"></div>
    </div>
    <template v-show="details.state!=1">
    <div class="viewItem" v-if="type==3">
      <label>审核员：</label>
      <div>{{ details.auditor }}</div>
    </div>
      </template>
     <div class="viewItem" v-if="type==3&&details.state == 3">
      <label>备注：</label>
      <div>{{ details.reason }}</div>
    </div>

    <!-- <div class="viewItem" v-if="details.state == 3">
      <label>审核未通过原因：</label>
      <div>{{ details.reason }}</div>
    </div> -->
    <div v-if="type==4">
      <el-button type="primary" size="medium" @click="goExam(1)">通过</el-button>
      <el-button style="margin-left:40px" size="medium" @click="goExam(2)">不通过</el-button>
    </div>
    <el-dialog
      class="addEdit"
      title="审核操作"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="desc">
          <el-input
            type="textarea"
            v-model="ruleForm.desc"
            placeholder="请输入50字以内不通过的备注说明"
            maxlength="50"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goReject('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定不通过</el-button
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
          { required: true, message: "请输入50字以内不通过的备注说明", trigger: "blur" }
        ]
      },
      listMain: {
        pageNo: 1,
        totalPage: 0,
        pageSize: 10,
        total: 100
      },
      loading: false,
      id: "",
      tableListData: [],
      searchForm: {
        rank: "-1",
        region: 0,
        userName: "",
        phone: "",
        dateBetween: ""
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      details: {},
      obj: {},
      type:'',
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    this.type = this.$route.query.type;
    if (this.type==3){
      this.$route.meta.title = "查看";
    } else {
      this.$route.meta.title = "审核";
    }
    this.getListData();
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.policyDetail({
        id: this.id || 1
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData[0];
        if (this.details.state == 1) {
          this.details.state1 = "待审核";
        } else if (this.details.state == 2) {
          this.details.state1 = "审核通过";
        } else {
          this.details.state1 = "审核未通过";
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
      this.$alert(
            "确定通过主题为【" + this.details.title + "】信息发布?",
            "审核操作",
            {
              confirmButtonText: "确定通过",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(_ => {
              this.exam(type);
            })
            .catch(_ => {});
      } else {
        //审核不通过
        this.dialogFormVisible = true;
      }
    },
     async exam(type) {
      const res = await this.$http.policyUpdateState({
        id: this.id,
        type: type,
        // member_id: this.adminUserInfo.memberId,
        reason: this.ruleForm.desc
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
          this.$message.warning("请输入50字以内不通过的备注说明！");
          return false;
        }
      });
    },
    goExamine() {
      this.dialogFormVisible = true;
      this.$refs["ruleForm"].resetFields();
    },
    goReject(formName) {
      this.dialogFormVisible = false;
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
