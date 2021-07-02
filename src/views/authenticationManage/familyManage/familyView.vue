<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="text" @click="downLoad()"  v-if="isAuth('base:door:batdown')">下载家庭二维码</el-button>
      <!-- <el-button type="text" @click="addVillager(1,1)">添加家庭成员</el-button> -->
    </div>
     <div class="userHeader">户籍信息</div>
    <div class="familyInfo">
      <!-- <h3 v-if="familyInfo.doorName">{{familyInfo.doorName}} 家</h3> -->
      <div class="familyInfo1">
        <div class="familyItem">
          户主姓名
          <span>{{familyInfo.doorName?familyInfo.doorName:'无'}}</span>
        </div>
        <div class="familyItem">
          身份证号
          <span>{{formatter6(familyInfo)?formatter6(familyInfo):'无'}}</span>
        </div>
      </div>
      <div class="familyInfo1">
        <div class="familyItem">
          家庭类型
          <span>{{this.formatter1(familyInfo)}}</span>
        </div>
         <div class="familyItem">
          家庭地址
          <span>{{familyInfo.areaName}}-{{familyInfo.streetName}}-{{familyInfo.villageName}}-{{familyInfo.groupName}}{{familyInfo.groupName?'组':''}}-{{familyInfo.houseNumber}}{{familyInfo.houseNumber?'号':''}}</span>
        </div>
        </div>
    </div>
         <div class="userHeader">家庭成员</div>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="account" label="用户名"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="identity" label="身份证号" :formatter="formatter"></el-table-column>

      <el-table-column prop="ssex" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.ssex==1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="national" label="民族"></el-table-column>
      <el-table-column prop="linkMobile" label="联系电话"></el-table-column> -->
      <el-table-column prop="isHousehold" label="与户主关系" :formatter="formatter2"></el-table-column>
      <el-table-column prop="joinTime" label="添加时间"></el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="lookView(scope.row)"  v-if="isAuth('base:door:view')">查看</el-button>
            <!-- <el-button type="text" @click="addVillager(scope.row,2)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row,2)">移出</el-button> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑 -->
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../../components/common/provinces";
import { baseUrl } from "../../../config/env";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    provinces
  },
  data() {
    //这里存放数据
    return {
      listMain: {
        pageNo: 1,
        totalPage: 0,
        pageSize: 10,
        total: 100
      },
      loading: false,
      tableListData: [],
      searchForm: {
        groupCode: "-1",
        villageCode: "",
        name: "",
        identity: ""
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: {},
      relationshipList: [
        {
          name: "户主",
          code: "1"
        },
        {
          name: "配偶",
          code: "2"
        },
        {
          name: "子女",
          code: "3"
        },
        {
          name: "父母",
          code: "4"
        },
        {
          name: "孙子孙女",
          code: "5"
        },
        {
          name: "祖父母",
          code: "6"
        },
        {
          name: "兄弟姐妹",
          code: "7"
        },
        {
          name: "女婿儿媳",
          code: "8"
        },
        {
          name: "其他",
          code: "9"
        }
      ],
      doorNum: "",
      familyInfo: ""
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.doorNum) {
      this.doorNum = this.$route.query.doorNum;
    }
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.searchForm1 = this.searchForm;
    this.obj = this.searchForm1;
    this.getListData();
  },
  //方法集合
  methods: {
    downLoad() {
      // this.createCode();
       var url =
          baseUrl +
          "member/v2/w/member/downCode?doorNum=" +
           this.doorNum +
          "&doorName=" +
          this.familyInfo.doorName +

          "&villageCode=" +
          this.familyInfo.villageCode +
          "&NO_SIGN=N";

      window.open(url, "_blank", "");
    },
    //格式化手机号
    formatter(row) {
      var reg = /^(\d{4})\d*(\d{2})$/;
      return row.identity.replace(reg, "$1************$2");
    },
     //格式化手机号
    formatter6(row) {
      if(row.idcard){
var reg = /^(\d{4})\d*(\d{2})$/;
      return row.idcard.replace(reg, "$1************$2");
      }else{
        return "无"
      }

    },
       formatter1(row) {
      var day = "";
      switch (row.doorType) {
        case "1":
          day = "普通家庭";
          break;
        case "2":
          day = "集体户口";
          break;
        case "3":
          day = "外来常住户口";
          break;
        case "4":
          day = "其他";
          break;
        case "5":
          day = "贫困户（含已脱贫）";
          break;
        case "6":
          day = "独生子女家庭";
          break;
        case "7":
          day = "军人家庭";
          break;


      }
      return day;
    },

    handleDelete(item) {
       this.$alert("移出家庭成员后将会清除该家庭成员的所有使用信息，请谨慎操作！", "移出提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(_ => {
          this.goDelete(item);
          done();
        })
        .catch(_ => {});
    },
    //生成二维码
    async createCode() {
      const res = await this.$http.generateQRCodeByScene({
        doorNum: this.doorNum,
        scene: "normal",
        qrCodeType: "F",
        qt: "info"
      });
      if (res.code === "0") {
        this.download(res.data[0].qrCode);
      } else {
      }
    },
    download(base64) {
      let imgData = base64; //这里放需要下载的base64
      var str = "";
      if (this.familyInfo.doorName) {
        str =this.familyInfo.villageName+this.familyInfo.groupName+this.familyInfo.houseNumber+this.familyInfo.doorName + "家";
      } else if (this.familyInfo.houseNumber) {
        str = "门牌号" + this.familyInfo.houseNumber + "家";
      } else {
        str = "二维码";
      }

      this.downloadFile(str + ".png", imgData);
    },
    downloadFile(fileName, content) {
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob(content); //new Blob([content]);

      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);

      // aLink.dispatchEvent(evt);
      aLink.click();
    },
    //base64转blob
    base64ToBlob(code) {
      let parts = code.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;

      let uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    },
    async goDelete(item) {
      const res = await this.$http.removeDoor({
        loginMemberId: this.adminUserInfo.memberId,
        memberId: item.memberId
      });
      if (res.code === "0") {
        setTimeout(() => {
          this.$alert(res.msg, "操作成功", {
            confirmButtonText: "我知道了",
            type: "success"
          });
          this.getListData();
        }, 1000);
      } else {
        setTimeout(() => {
          this.$alert(res.msg, "操作失败", {
            confirmButtonText: "我知道了",
            type: "error"
          });
        }, 1000);
      }
    },
    handleCurrentChange(val) {
      this.listMain.pageNo = val;
      this.obj = this.searchForm1;
      this.getListData();
    },
    // 获取列表数据
    async getListData() {
      this.loading = true;
      var objcommon = {
        memberId: this.adminUserInfo.memberId,
        doorNum: this.doorNum
      };
      const res = await this.$http.getMemberListByDoorNum({
        ...objcommon
      });
      if (res.status === "success") {
        var resData = res.data || {};

        this.familyInfo = res.data;
        this.tableListData = resData.list || [];

        //console.log(this.listMain);

        this.loading = false;
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
        this.loading = false;
      }
    },
    goSearch() {
      this.$refs.addedit.dialogFormVisible = true;
      this.searchForm1 = this.searchForm;
      this.obj = this.searchForm;
      this.getListData();
    },

    changeTown(val) {
      if (val.villageCode) {
        this.searchForm.villageCode = val.villageCode;
      }

      this.searchForm1 = this.searchForm;
      this.obj = this.searchForm1;
    },
    addVillager(item, type) {
      if (type == 1) {
        //添加
        this.$router.push({
          name: "addMember",
          query: {
            doorNum: this.doorNum
          }
        });
      } else if (type == 2) {
        //编辑
        this.$router.push({
          name: "addMember",
          query: {
            memberId: item.memberId,
            doorNum: this.doorNum
          }
        });
      }
    },
    lookView(item){
 this.$router.push({
          name: "userView",
          query: {
             editMemberId:item.memberId,
             doorNum: this.doorNum
          }
        });
    },
    formatter2(row) {
      var day = "";
      switch (row.isHousehold) {
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
</style>
