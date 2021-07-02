<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="exportBtn" v-if="isAuth('honor:doortotal:down')">导出</el-button>
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="村级组：">
        <el-select v-model="searchForm.groupCode" placeholder="请选择" clearable filterable>
          <el-option label="--请选择--" value=""></el-option>
          <el-option v-for="item in groupList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="场景分类：">
        <el-select v-model="searchForm.scene" placeholder="场景分类">
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="户主姓名：">
        <el-input v-model="searchForm.name" placeholder="请输入户主姓名"></el-input>
      </el-form-item>
      <el-form-item label="门牌号：">
        <el-input v-model="searchForm.houseNumber" placeholder="请输入门牌号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="houseNumber" label="门牌号"></el-table-column>
      <el-table-column prop="name" label="户主姓名"></el-table-column>
      <el-table-column prop="groupName" label="所属组"></el-table-column>
      <el-table-column prop="doorCount" label="家庭人数"></el-table-column>
      <el-table-column prop="honorTotal" label="积分总额"></el-table-column>
      <el-table-column prop="integralTotal" label="可用额度"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="handleView(scope.row, 1)" v-if="isAuth('honor:doortotal:edit')">修改</el-button>
            <el-button type="text" @click="handleView(scope.row, 2)" v-if="isAuth('honor:doortotal:view')">查看</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="paging" background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" v-if="listMain.totalPage > 0" :page-size="listMain.pageSize" :page-count="listMain.totalPage" :pager-count="7" :current-page.sync="listMain.pageNo" :total="listMain.total"></el-pagination>
    <!-- 编辑 -->
    <add-edit ref="addedit" :memberId="memberId" :villageCode="villageCode" :doorNum="doorNum" @changehonor="getListData()"></add-edit>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../../components/common/provinces";
import addEdit from "./addEdit";
import { baseUrl } from "../../../config/env";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    provinces,
    addEdit,
  },
  data() {
    //这里存放数据
    return {
      listMain: {
        pageNo: 1,
        totalPage: 0,
        pageSize: 10,
        total: 100,
      },
      loading: false,
      tableListData: [],
      searchForm: {
        name: "",
        groupCode: "",
        houseNumber: "",
        scene: "",
        villageCode: "",
        areaCode: "",
        streetCode: "",
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: {},
      memberId: "",
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isPower: false,
      role_list: [],
      groupList: [],
      list: [],
      villageCode: "",
      doorNum: "",
      isReset: false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
    this.searchForm.areaCode = this.adminUserInfo.areaCode;
    if (this.deptLevel == 4) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
    } else if (this.deptLevel == 5) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
      this.searchForm.villageCode = this.adminUserInfo.villageCode;
    }
    this.searchForm1 = this.searchForm;
    this.obj = this.searchForm1;
    this.getListData();
    this.groupByVillages();
    this.getList();
  },
  //方法集合
  methods: {
    //重置
    resetForm() {
      if (this.deptLevel == 3) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: "",
          villageCode: "",
          name: "",
          groupCode: "",
          houseNumber: "",
          scene: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          name: "",
          groupCode: "",
          houseNumber: "",
          scene: "",
        };
      }else if (this.deptLevel == 5) {
        this.searchForm = {
          name: "",
          groupCode: "",
          houseNumber: "",
          scene: "",
           areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: this.searchForm.villageCode
        };
      }

      this.searchForm1 = this.searchForm;
      this.obj = this.searchForm1;
      this.isReset = true;
      this.listMain.pageNo = 1;
      this.getListData();
    },
    // 获取列表数据
    async getList() {
      const res = await this.$http.getSelectDictionary({
        type: 3,
      });
      if (res.status === "success") {
        this.list = res.data;
      } else {
      }
    },
    // 获取组
    async groupByVillages() {
      const res = await this.$http.groupByVillage({
        villageCode: this.searchForm.villageCode || "",
      });
      if (res.status === "success") {
        this.groupList = res.data;
      } else {
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
        pageNumber: this.listMain.pageNo,
        pageSize: this.listMain.pageSize,
      };
      const res = await this.$http.doorHonorList({
        ...objcommon,
        ...this.obj,
      });
      if (res.status === "success") {
        var resData = res.data || {};

        this.listMain.total = resData.total || 0;
        this.listMain.pageNo = resData.pageNum || 1;
        this.listMain.totalPage = resData.pages || 0;
        this.listMain.pageSize = resData.pageSize || 10;
        this.tableListData = resData.list || [];

        //console.log(this.listMain);

        this.loading = false;
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
        this.loading = false;
      }
    },
    goSearch() {
      this.listMain.pageNo = 1;
      this.searchForm1 = this.searchForm;
      this.obj = this.searchForm;
      this.getListData();
    },
    handleView(item, type) {
      if (type == 1) {
        this.memberId = item.memberId;
        this.$refs.addedit.dialogFormVisible = true;
        this.memberId = item.memberId;
        this.villageCode = item.villageCode;
        this.doorNum = item.doorNum;
        // console.log(item.status);
        // this.$confirm("确认关闭？")
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      } else {
        this.$router.push({
          name: "familyHonorView",
          query: {
            doorMemberId: item.memberId,
            doorNum: item.doorNum,
            villageCode: item.villageCode,
          },
        });
      }
    },

    changeTown(val) {
      this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      if (val.villageCode) {
        this.searchForm.villageCode = val.villageCode;
        this.groupByVillages();
      } else {
        this.searchForm.villageCode = "";
        this.groupByVillages();
      }
    },
    //格式化手机号
    formatter(row) {
      var reg = /^(\d{3})\d*(\d{4})$/;
      return row.mobile.replace(reg, "$1****$2");
    },
    formatter1(row) {
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
    },
    exportBtn() {
      window.open(
        baseUrl +
          "integratemall/v2/w/integral/exportDoor?villageCode=" +
          this.searchForm.villageCode +
          "&areaCode=" +
          this.searchForm.areaCode +
          "&streetCode=" +
          this.searchForm.streetCode +
          "&scene=" +
          this.searchForm.scene +
          "&groupCode=" +
          this.searchForm.groupCode +
          "&houseNumber=" +
          this.searchForm.state +
          "&name=" +
          this.searchForm.houseNumber +
          "&NO_SIGN=N",
        "_blank",
        ""
      );
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>