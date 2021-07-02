
<template>
  <div class="policyView">
    <div class="rightBtn">
      <!-- <el-button type="text" @click="handleView(1,1)">添加</el-button> -->
    </div>

    <div class="examstatus examstatus1">
      <div>加分申请：</div>
      <span>{{ details.state1 }}</span>
    </div>
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
        v-if="details.state == 3"
      />
      <img
        src="../../../assets/3.png"
        alt=""
        class=""
        v-if="details.state == 2"
      />
      <img
        src="../../../assets/4.png"
        alt=""
        class=""
        v-if="details.state == 4"
      />
    </div> -->

    <template v-if="details.sceneClassify != 0 || type == 1">
      <div class="viewItem">
        <label>分类：</label>
        <div>{{ details.sceneClassifyExplain }}</div>
      </div>
      <div class="viewItem">
        <label>事件名称：</label>
        <div>{{ details.sceneName }}</div>
      </div>
      <div class="viewItem">
        <label>积分：</label>
        <div>{{details.isAddPlus==1?'+':'-'}}{{ details.scores }}</div>
      </div>
    </template>
    <template v-else>
      <div class="viewItem">
        <label>分类：</label>
        <div class="inputwarp">
          <el-select v-model="details.sceneClassify" placeholder="场景分类">
            <el-option label="--请选择--" value></el-option>
            <el-option label="其他" :value="0"></el-option>
            <el-option label="遵纪守法类" :value="1"></el-option>
            <el-option label="热心公益类" :value="2"></el-option>
            <el-option label="乡村建设类" :value="3"></el-option>
            <el-option label="环境治理类" :value="4"></el-option>
            <el-option label="奖励荣誉类" :value="5"></el-option>
            <el-option label="文明建设类" :value="6"></el-option>
            <el-option label="孝老爱亲类" :value="7"></el-option>
            <el-option label="综合扣分类" :value="8"></el-option>
          </el-select>
        </div>
      </div>
      <div class="viewItem">
        <label>加分事项：</label>
        <div class="inputwarp">
          <el-input
            v-model="addname"
            placeholder="请输入加分事由限20字内"
            maxlength="20"
          ></el-input>
        </div>
      </div>
      <div class="viewItem">
        <label>积分：</label>
        <div class="inputwarp">
          <el-input
            v-model="honorNum"
            placeholder="请输入200以内的分数"
            max="200"
            oninput="value=value.replace(/[^\d^\.]/g,'')"
          ></el-input>
        </div>
      </div>
    </template>
    <div class="viewItem">
      <label>事件说明：</label>
      <div>{{ details.remark }}</div>
    </div>
    <div class="viewItem">
      <label>图片：</label>
      <div class="imgwrap">
        <img class :src="item.fileUrl" alt v-for="item in details.fileList" />
      </div>
    </div>
    <div class="viewItem">
      <label>申请时间：</label>
      <div>{{ details.modifyTime }}</div>
    </div>
    <div class="viewItem">
      <label>申请人：</label>
      <div>{{ details.name }}({{ details.ssex == "1" ? "男" : "女" }})</div>
    </div>
    <div class="viewItem">
      <label>手机号：</label>
      <div>{{ details.mobile }}</div>
    </div>
    <div class="viewItem">
      <label>与户主关系：</label>
      <div>{{ formatter2(details) }}</div>
    </div>
    <div class="viewItem">
      <label>所在家庭户：</label>
      <div>
        <span style="color:#67C23A;margin-left:0" v-if="details.houseNumber"
          >[{{ details.houseNumber }}]</span
        >{{ details.areaName }}{{ details.streetName }}{{ details.villageName }}{{details.groupName }}{{ details.groupName?'组':''}}
      </div>
    </div>
     <div class="viewItem" v-show="type != 2&&details.state==2">
      <label>驳回理由：</label>
      <div>{{ details.comment }}</div>
    </div>
    <div style="margin-left:60px" v-show="type == 2">
      <el-button type="primary" size="medium" @click="goExam(1)"
        >通过</el-button
      >
      <el-button style="margin-left:40px" size="medium" @click="goExam(2)"
        >驳回</el-button
      >
    </div>
    <el-dialog
      class="addEdit"
      title="驳回操作"
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
      addname: "",
      honorNum: "",
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

      details: {},
      honorCode: "",
      type: "",
      list:[],
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.honorCode) {
      this.honorCode = this.$route.query.honorCode;
    }
    this.type = this.$route.query.type;
    if (this.$route.query.type == 1) {
      this.$route.meta.title = "查看";
    } else {
      this.$route.meta.title = "审核";
    }
    this.getListData();
    this.getList()
  },
  //方法集合
  methods: {
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
      const res = await this.$http.personalDetails({
        honorCode: this.honorCode || 1
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData[0];
            this.details.sceneClassify=Number(this.details.sceneClassify)
        if (this.details.state == 1) {
          this.details.state1 = "待审核";
        } else if (this.details.state == 3) {
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
      if (this.details.sceneClassify != 0) {
        //审核通过
        if (type == 1) {
          this.$alert(
            "确定通过" + this.details.name + "提交的积分发放申请?",
            "审核提示",
            {
              confirmButtonText: "确定",
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
      } else {
        if (this.addname == "" || this.addname.length > 20) {
          this.$message.error("请输入加分事由限20字内!");
          return;
        }
        if (this.honorNum == "" || this.honorNum > 200) {
          this.$message.error("请输入200以内的分数!");
          return;
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.exam(2);
        } else {
          this.$message.error("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    async exam(type) {
      const res = await this.$http.updatePersonalHonorState({
        honorCode: this.honorCode,
        sceneClassify: this.details.sceneClassify,
        state: type,
        comment: this.ruleForm.desc,
        score: "",
        addExplain: ""
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
    goExamine() {
      this.dialogFormVisible = true;
      this.$refs["ruleForm"].resetFields();
    },
    goReject(formName) {
      this.dialogFormVisible = false;
    },
    formatter1(row) {
      
       var index = this.list.findIndex(val => {
        return val.id == row.sceneClassify;
      });
     if (index != -1) {
        return this.list[index].name;
      }
    },
    formatter2(row) {
      var day = "";
      switch (Number(row.isHousehold)) {
        case 1:
          day = "户主";
          break;
        case 2:
          day = "配偶";
          break;
        case 3:
          day = "子女";
          break;
        case 4:
          day = "父母";
          break;
        case 5:
          day = "孙子孙女";
          break;
        case 6:
          day = "祖父母";
          break;
        case 7:
          day = "兄弟姐妹";
          break;
        case 8:
          day = "女婿儿媳";
          break;
        case 9:
          day = "其他";
          break;
        default:
          day = "其他";
      }
      return day;
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
.inputwarp {
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
    margin-left: 0 !important;
    width: 260px;
  }
  .el-select {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
    margin-left: 0 !important;
    width: 260px;
  }
}
.imgwrap {
  overflow: hidden;
  img {
    height: 100px;
    width: 200px;
    float: left;
    margin-right: 10px;
  }
}
</style>