
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

    <div class="viewItem">
      <label>分类：</label>
      <div class="inputwarp">
        <el-select v-model="details.sceneClassify" placeholder="场景分类" @change="gosceneClassify">
          <el-option label="--请选择--" value='-1'></el-option>
          <el-option v-for="item in listtype" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <template v-if="details.sceneClassify == 0">
      <el-form :model="sceneForm" :rules="sceneRules" ref="sceneForm" label-width="198px">
        <el-form-item label="加分事项：" prop="addname">
          <el-input v-model="sceneForm.addname" placeholder="请输入加分事由限20字内" clearable style="width: 262px;margin-left: 17px"></el-input>
        </el-form-item>
        <el-form-item label="积分：" prop="honorNum">
          <el-input v-model="sceneForm.honorNum" placeholder="请输入200以内的分数" oninput="value=value.replace(/[^\d^\.]/g,'')" clearable style="width: 262px;margin-left: 17px"></el-input>
        </el-form-item>
      </el-form>
      <!--<div class="viewItem">
        <label>加分事项：</label>
        <div class="inputwarp">
          <el-input v-model="addname" placeholder="请输入加分事由限20字内" maxlength="20"></el-input>
        </div>
      </div>
      <div class="viewItem">
        <label>积分：</label>
        <div class="inputwarp">
          <el-input v-model="honorNum" placeholder="请输入200以内的分数" oninput="value=value.replace(/[^\d^\.]/g,'')" max="200"></el-input>
        </div>
      </div>-->
    </template>
    <template v-else>
      <div class="viewItem">
        <label>事件名称：</label>
        <div class="inputwarp">
          <el-select v-model="honorSetId" placeholder="事件名称" @change="thingName">
            <el-option label="--请选择--" value='-1'></el-option>
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="viewItem">
        <label>积分：</label>
        <div>{{ isAddPlus == 1 ? "+" : "-" }}{{ scores }}</div>
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
        <span style="color:#67C23A;margin-left:0" v-if="details.houseNumber">[{{ details.houseNumber }}]</span>{{ details.areaName }}{{ details.streetName }}{{ details.villageName }}
      </div>
    </div>
    <div style="margin-left:60px">
      <el-button type="primary" size="medium" @click="goExam(1,'sceneForm')">通过</el-button>
      <el-button style="margin-left:40px" size="medium" @click="goExam(2,'sceneForm')">驳回</el-button>
    </div>
    <el-dialog class="addEdit" title="驳回操作" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入20字以内驳回说明" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goReject('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
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
      sceneForm:{
        addname: "",
        honorNum: ""
      },
      sceneRules:{
        addname: [
          {required: true, message: "请输入加分事由限20字内", trigger: "blur", min: 1, max: 20}
        ],
        honorNum: [
          {required: true, message: "请输入200以内的分数", trigger: "blur", min: 1, max: 200}
        ]
      },
      honorSetId: "",
      sjname: "",
      ruleForm: {
        desc: "",
      },
      rules: {
        desc: [
          {
            required: true,
            message: "请输入20字以内驳回说明",
            trigger: "blur",
            min: 1,
            max: 20,
          },
        ],
      },

      details: {},
      honorCode: "",
      type: "",
      villageCode: "",
      list: [],
      listtype: [],
      isAddPlus:'',
      scores:'',
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.honorCode) {
      this.honorCode = this.$route.query.honorCode;
    }

    this.getListData();
    // this.getList();

  },
  //方法集合
  methods: {
    thingName(val){
      this.isAddPlus = '1'
      this.scores = '0'
      this.list.forEach(k=>{
        if (k.id == val) {
          this.isAddPlus = k.addPlusPoint
          this.scores = k.honorValue
          this.$forceUpdate()
          return;
        }
      })
    },
    //
    gosceneClassify(val) {
      this.sceneForm.addname = "";
      if (val != 0) {
        this.getPersonalSceneByScene();
      }
    },
    // 获取列表数据
    async getList() {
      const res = await this.$http.getSelectDictionary({
        type: 3,
      });
      if (res.status === "success") {
        this.listtype = res.data;
          if(this.details.sceneClassify=='0'){
          this.listtype.push({
            id:0,
            name:'其他'
          })
        }
      } else {
      }
    },
    //获取事件下拉列表
    // 获取列表数据
    async getPersonalSceneByScene() {
      this.list=[]
      const res = await this.$http.getPersonalSceneByScene({
        villageCode: this.details.villageCode || "",
        scene: this.details.sceneClassify,
      });
      if (res.status === "success") {

        this.list = res.data;

      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    // 获取列表数据
    async getListData() {
      const res = await this.$http.personalDetails({
        honorCode: this.honorCode || 1,
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData[0];
        this.isAddPlus = this.details.isAddPlus
        this.scores = this.details.scores
        this.details.sceneClassify = Number(this.details.sceneClassify);

        if (this.details.state == 1) {
          this.details.state1 = "待审核";
        } else if (this.details.state == 3) {
          this.details.state1 = "审核通过";
        } else {
          this.details.state1 = "审核未通过";
        }
           this.getList();
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    goExam(type,sceneForm) {
      if (this.details.sceneClassify == "-1") {
        this.$message.error("请选择分类!");
        return;
      }
      if (this.details.sceneClassify != 0) {
        if (this.honorSetId == "-1") {
          this.$message.error("请选择事件名称!");
          return;
        }
        //审核通过
        if (type == 1) {
          this.$alert(
            "确定通过" + this.details.name + "提交的积分发放申请?",
            "审核提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then((_) => {
              this.exam(type);
            })
            .catch((_) => {});
        } else {
          //审核不通过
          this.dialogFormVisible = true;
        }
      } else {

        this.$refs[sceneForm].validate(async (valid) => {
          if (valid) {
            //审核通过
            if (type == 1) {
              this.$alert(
                      "确定通过" + this.details.name + "提交的积分发放申请?",
                      "审核提示",
                      {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }
              )
                      .then((_) => {
                        this.exam(type);
                      })
                      .catch((_) => {});
            } else {
              //审核不通过
              this.dialogFormVisible = true;
            }
          }
        })
        // if (this.sceneForm.addname == "" || this.sceneForm.addname.length > 20) {
        //   this.$message.error("请输入加分事由限20字内!");
        //   return;
        // }
        // if (this.sceneForm.honorNum == "" || this.sceneForm.honorNum > 200) {
        //   this.$message.error("请输入200以内的分数!");
        //   return;
        // }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.exam(2);
        } else {
          // this.$message.error("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    async exam(type) {
      var obj = {
        honorCode: this.honorCode,
        sceneClassify: this.details.sceneClassify,
        state: type,
        comment: this.ruleForm.desc,
        score: this.sceneForm.honorNum ? Number(this.sceneForm.honorNum) : "",
        addExplain: this.sceneForm.addname,
        honorSetId: this.honorSetId,
      };
      console.log(obj);
      //   return;
      const res = await this.$http.updatePersonalHonorState({
        honorCode: this.honorCode,
        sceneClassify: this.details.sceneClassify,
        state: type,
        comment: this.ruleForm.desc,
        score: this.sceneForm.honorNum ? Number(this.sceneForm.honorNum) : "",
        addExplain: this.sceneForm.addname,
        honorSetId: this.honorSetId,
      });
      if (res.code === "0") {
        this.$message({
          type: "success",
          message: res.msg,
        });
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000);
      } else {
        this.$message({
          type: "error",
          message: res.msg,
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
      var day = "";
      switch (Number(row.sceneClassify)) {
        case 0:
          day = "其他";
          break;
        case 1:
          day = "遵纪守法类";
          break;
        case 2:
          day = "热心公益类";
          break;
        case 3:
          day = "乡村建设类";
          break;
        case 4:
          day = "环境治理类";
          break;
        case 5:
          day = "奖励荣誉类";
          break;
        case 6:
          day = "文明建设类";
          break;
        case 7:
          day = "孝老爱亲类";
          break;
        case 8:
          day = "综合扣分类";
          break;
        default:
          day = "其他";
      }
      return day;
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
          name: "addPolicy",
        });
        // console.log(item.status);
        // this.$confirm("确认关闭？")
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      } else {
        this.$router.push({
          name: "policyView",
        });
      }
    },
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
