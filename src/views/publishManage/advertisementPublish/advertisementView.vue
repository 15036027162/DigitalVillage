
<template>
  <div class="policyView">
    <div class="rightBtn">
      <!-- <el-button type="text" @click="handleView(1,1)">添加</el-button> -->
    </div>

    <!-- <div class="examstatus">状态：审核通过</div> -->
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
       <img
        src="../../../assets/4.png"
        alt=""
        class=""
        v-if="details.state == 4"
      />
    </div> -->
    <div class="viewItem">
      <label>商业名称：</label>
      <div>{{ details.title }}</div>
    </div>
    <div class="viewItem">
      <label>上传图片：</label>
      <div>
        <img class :src="details.picUrl" alt />
      </div>
    </div>
    <div class="viewItem">
      <label>跳转方式：</label>
      <div>{{ getformat(details.style) }}</div>
    </div>
    <div class="viewItem">
      <label>链接：</label>
      <div v-if="details.url">
        <a
          :href="details.url"
          target="_blank"
          style="color:#409EFF;text-decoration:underline;"
          >{{ details.url }}</a
        >
      </div>
      <div v-else>--</div>
    </div>

    <div class="viewItem">
      <label>发布时间：</label>
      <div>{{ details.createTime }}</div>
    </div>
    <div class="viewItem">
      <label>发布者：</label>
      <div>{{ details.creator }}</div>
    </div>
    <div class="viewItem">
      <label>所属区划：</label>
      <div>{{ details.areaName }}{{ details.streetName }}{{details.villageName}}</div>
    </div>
    <div class="viewItem">
      <label>上架状态：</label>
      <div>{{ details.state == 2 ? "已上架" : "未上架" }}</div>
    </div>


    <div class="viewItem" v-show=" details.state==2">
      <label>上架时间：</label>
      <div>{{details.passTime}}</div>
    </div>

    <!-- <div style="margin-left:60px">
      <el-button type="primary" size="medium" @click="goExam(1)">审核通过</el-button>
      <el-button type="primary" size="medium" @click="goExam(2)">审核不通过</el-button>
    </div> -->
    <el-dialog
      class="addEdit"
      title="积分发放-审核"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="desc">
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
          >确定</el-button
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
            required: true,
            message: "请输入20字以内驳回说明",
            trigger: "blur",
            min: 1,
            max: 20
          }
        ]
      },

      details: {}
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    this.getListData();
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.advDetail({
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
          this.details.state1 = "审核不通过";
        }
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    getformat(style) {
      var day = "";
      switch (Number(style)) {
        case 1:
          day = "外部URL";
          break;
        case 2:
          day = "内部链接";
          break;
        case 0:
          day = "不跳转";
        default:
          day = "不跳转";
      }
      return day;
    },
    goExam(type) {
      //审核通过
      if (type == 1) {
        this.$alert("您确定要通过审核吗?", "审核提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(_ => {
            done();
          })
          .catch(_ => {});
      } else {
        //审核不通过
        this.dialogFormVisible = true;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          this.$message.error("请修改表单提示区域内容后重新提交！");
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
    },

    handleView(item, type) {
      if (type == 1) {
        this.$router.push({
          name: "addPolicy"
        });
        // console.log(item.status);
        // this.$confirm("确认关闭？")
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      } else {
        this.$router.push({
          name: "policyView"
        });
      }
    }
  }
};
</script>
<style lang='less'>
</style>