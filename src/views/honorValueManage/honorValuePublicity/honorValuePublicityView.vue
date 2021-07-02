
<template>
  <div class="policyView">
    <div class="rightBtn">
      <!-- <el-button type="text" @click="handleView(1,1)">添加</el-button> -->
    </div>
    <div class="examstatus examstatus1">
     <div >积分公示栏：</div> <span>{{ details.state1 }}</span>
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
    <div class="viewItem" v-if="details.state=='3'">
      <label>投诉理由：</label>
      <div>{{details.comment}}</div>
    </div>
    <div class="viewItem">
      <label>分类：</label>
      <div>{{ details.sceneClassifyExplain }}</div>
    </div>
    <div class="viewItem">
      <label>事件名称：</label>
      <div>{{details.sceneName}}</div>
    </div>

    <div class="viewItem" v-if="type==2">
      <label>积分：</label>
      <div class="addbox">
        <div class="addbox1">
          <el-radio-group
            v-model="dataForm.isAddPluss"
            size="medium"
            @change="changehonor"
          >
            <el-radio-button :label="1">加分</el-radio-button>
            <el-radio-button :label="2">减分</el-radio-button>
          </el-radio-group>
        </div>
        <div class="addbox1">
          <el-input
            v-model="dataForm.honorPoint"
            oninput="value=value.replace(/[^\d^\.]/g,'')"
          ></el-input>
        </div>
        <div class="addbox1">
          <el-checkbox v-model="checked">不给分</el-checkbox>
        </div>
      </div>
    </div>
      <div class="viewItem" v-else>
      <label>积分：</label>
      <div>{{details.isAddPlus==1?'+':'-'}}{{details.scores}}</div>
    </div>
    <div class="viewItem">
      <label>时间：</label>
      <div>{{details.modifyTime?details.modifyTime:'--'}}</div>
    </div>
    <div class="viewItem">
      <label>事件说明：</label>
      <div>{{details.remark?details.remark:'--'}}</div>
    </div>

    <div class="viewItem">
      <label>图片：</label>
     
        <div class="imgwrap" v-if="details.fileList.length>0">
          <img class :src="item.fileUrl" alt v-for="item in details.fileList" />
        </div>
        <div v-else>--</div>
    
    </div>

    <div class="viewItem">
      <label>申请人：</label>
      <div>{{ details.name }}({{details.ssex=='1'?"男":"女"}})</div>
    </div>
    <div class="viewItem">
      <label>手机号：</label>
      <div>{{details.mobile?details.mobile:'--'}}</div>
    </div>
    <div class="viewItem">
      <label>与户主关系：</label>
      <div>{{ formatter2(details) }}</div>
    </div>
    <div class="viewItem">
      <label>所在家庭户：</label>
      <div>
      <span style="color:#67C23A;margin-left:0" v-show="details.houseNumber">[{{ details.houseNumber }}]</span
      >{{ details.areaName }}{{ details.streetName }}{{ details.villageName }}{{ details.groupName }}{{ details.groupName?'组':''}}
      </div>
    </div>
    <div style="margin-left:60px" v-show="type==2">
      <el-button type="primary" size="medium" @click="goExam()"
        >修正处理</el-button
      >
      <el-button style="margin-left:40px" size="medium" @click="toBack">返回</el-button>
    </div>
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
      checked: false,
      details: {
     
      },
      dataForm:{
 isAddPluss:1,
        honorPoint:''
      },
      honorCode: "",
      type:'',
      list:[],
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.honorCode) {
      this.honorCode = this.$route.query.honorCode;
    }
    this.type=this.$route.query.type
     if (this.$route.query.type == 1) {
      this.$route.meta.title = "查看";
    } else {
      this.$route.meta.title = "审核";
    }
    this.getListData()
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
    changehonor(type) {
      this.dataForm.honorPoint = "";
    },
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getDetailByPublic({
        honorCode: this.honorCode || 1
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData[0];
        if (this.details.state == 1) {
          this.details.state1 = "待审核";
        } else if (this.details.state == 2) {
          this.details.state1 = "已驳回";
        } else if(this.details.state == 3){
          this.details.state1 = "被投诉";
        }else if(this.details.state == 4){
          this.details.state1 = "公示中";
        }else if(this.details.state == 5){
          this.details.state1 = "已完成";
        }
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    async goExam(type) {
      if(this.details.scores==''){
        this.$message({
          type: "error",
          message: "请输入积分"
        });
        return;
      }
      var obj = {
        honorCode: this.honorCode,
        method: this.checked ? 1 : 2,
        isAddPlus: this.dataForm.isAddPluss,
        honorPoint: Number(this.dataForm.honorPoint)
      };
      const res = await this.$http.correctHonorIntegralPoint(obj);
      if (res.status === "success") {
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
      }
    },
    // 返回
    toBack() {
      this.$router.go(-1);
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
.addbox {
  .imgwrap{
  overflow: hidden;
  img{
    height:100px;
  width:200px;
  float: left;
  margin-right: 10px;
  }
}
  .addbox1 {
    display: inline-block;
    margin: 0 !important;
    &:first-child {
      margin-left: 0 !important;
    }
    &:last-child {
      margin-left: 10px !important;
    }
    label {
      width: auto !important;
    }
    span {
      color: #909399;
      margin-left: 0 !important;
    }
    .el-radio-group {
      margin: 0 !important;
    }
    .el-input {
      margin-left: 10px !important;
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
</style>