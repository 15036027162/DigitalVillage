<template>
  <div>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="addDistribution" v-if="isAuth('base:honorset:add')">添加</el-button>
    </div>
    <!--查询条件-->
    <el-form :inline="true" :model="distributionForm" class="demo-form-inline" ref="searchForm">
      <el-form-item label="区域选择：" v-if="deptLevel !=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="场景分类：">
        <el-select v-model="distributionForm.organization" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value=""></el-option>
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事项名称：">
        <el-input v-model="distributionForm.name" placeholder="输入事项名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="searchMore">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table :data="distributionSetData" border v-loading="showListLoading" element-loading-background="rgba(0, 0, 0, 0.3)" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading">
      <el-table-column prop="setDistrictsName" label="所属村组"></el-table-column>
      <el-table-column prop="sceneClassifyExplain" label="场景分类"></el-table-column>
      <el-table-column prop="name" label="事项名称"></el-table-column>
      <el-table-column prop="honorValue" label="积分"></el-table-column>
      <!--<el-table-column prop="integral" label="积分"></el-table-column>-->
      <el-table-column prop="isPhotosName" label="拍照"></el-table-column>
      <el-table-column prop="isTextDescName" label="文字说明"></el-table-column>
      <!--<el-table-column prop="steps" label="审核步骤"></el-table-column>-->
      <el-table-column prop="modifyTime" label="更新时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)" v-if="isAuth('base:honorset:edit')">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)" v-if="isAuth('base:honorset:del')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="paging" background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" v-if='listMain.totalPage > 0' :page-size="listMain.pageSize" :page-count="listMain.totalPage" :pager-count="7" :current-page.sync="listMain.pageNo" :total="listMain.total">
    </el-pagination>
  </div>
</template>

<script>
import provinces from "@/components/common/provinces";
export default {
  name: "distributionSet",
  components: { provinces },
  data() {
    return {
      distributionForm: {
        organization: "",
        name: "",
      },
      distributionSetData: [], //列表数据
      showListLoading: false, //加载中。。。
      /*分页*/
      listMain: {
        pageNo: 1,
        totalPage: 0,
        pageSize: 10,
        total: 0,
      },
      searchShow: false,
      roleDept: false,
      villageCode: "",
      areaCode: "",
      streetCode: "",
      deptLevel: "",
      options: [],
      isReset: false
    };
  },
  inject: ["reload"],
  mounted() {
    let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
    this.deptLevel = session_adminInfo.deptLevel;
    let roleList = session_adminInfo.role_list;
    //this.villageCode = session_adminInfo.deptDistrictsCode || 0;
    this.areaCode = session_adminInfo.areaCode;
    if(this.deptLevel==3){
      this.villageCode = '';
      this.streetCode = '';
    }else if(this.deptLevel==4){
      this.villageCode = ''
      this.streetCode = session_adminInfo.streetCode
    }else if(this.deptLevel==5){
      this.villageCode = session_adminInfo.villageCode
      this.streetCode = session_adminInfo.streetCode
    }
    /*权限*/
    if (session_adminInfo.deptLevel == "5") {
      /*权限*/
      let index = roleList.findIndex((val) => {
        return val.id == "1";
      });
      let index2 = roleList.findIndex((val) => {
        return val.id == "2";
      });
      if (index > -1 || index2 > -1) {
        this.roleDept = false;
      } else {
        this.roleDept = true;
      }
    } else {
      this.roleDept = true;
    }

    this.getInfo();
    this.getName();
  },
  methods: {
    /*获取场景*/
    async getName() {
      let res = await this.$http.getSelectDictionary({ type: "3" });
      if (res.status === "success") {
        this.options = res.data;
      }
    },
    /*列表*/
    async getInfo() {
      let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
      let memberId = session_adminInfo.memberId || 0;
      let data = {};
      if (this.searchShow == false) {
        data = {
          memberId: memberId,
          villageCode: this.villageCode,
          streetCode: this.streetCode,
          areaCode: this.areaCode,
          name: "",
          sceneClassify: "",
          pageNumber: this.listMain.pageNo,
          pageSize: this.listMain.pageSize,
        };
      } else {
        data = {
          memberId: memberId,
          villageCode: this.villageCode,
          streetCode: this.streetCode,
          areaCode: this.areaCode,
          name: this.distributionForm.name || "",
          sceneClassify: this.distributionForm.organization || "",
          pageNumber: this.listMain.pageNo,
          pageSize: this.listMain.pageSize,
        };
      }
      let res = await this.$http.distributionSetList(data);
      if (res.status === "success") {
        res.data.list.map((k) => {
          if (k.sceneClassify == 1) {
            k.sceneClassifyName = "垃圾分类";
          } else if (k.sceneClassify == 2) {
            k.sceneClassifyName = "环境治理";
          } else {
            k.sceneClassifyName = "文明建设";
          }
          if (k.isPhotos == 1) {
            k.isPhotosName = "非必选";
          } else {
            k.isPhotosName = "必选";
          }
          if (k.isTextDesc == 1) {
            k.isTextDescName = "非必选";
          } else {
            k.isTextDescName = "必选";
          }
        });
        this.distributionSetData = res.data.list;
        this.listMain.total = res.data.total;
        this.listMain.totalPage = res.data.pages;
      }
    },

    /*查询*/
    searchMore() {
      this.listMain.pageNo = 1;
      if (this.distributionForm.name || this.distributionForm.organization) {
        this.searchShow = true;
        this.getInfo();
      } else {
        this.searchShow = false;
        this.getInfo();
      }
    },
    /*重置*/
    resetForm(){
      let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
      if (this.deptLevel == 3) {
        this.villageCode = '';
        this.streetCode = '';
      }else if (this.deptLevel == 4) {
        this.villageCode = '';
        this.streetCode = session_adminInfo.streetCode;
      }
      this.distributionForm = {
        organization: "",
        name: "",
      }
      this.listMain.pageNo = 1
      this.isReset = true
      this.searchShow = false
      this.getInfo()
    },

    /*新增*/
    addDistribution() {
      this.$router.push({
        name: "addDistibutionSet",
      });
    },

    /*编辑*/
    handleEdit(val) {
      this.$router.push({
        path: `/distributionSet/EditDistibutionSet/${val.id}`,
      });
    },

    /*删除*/
    async handleDelete(val) {
      let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
      let memberId = session_adminInfo.memberId || 0;
      let dataObj = {
        memberId: memberId,
        id: val.id,
      };
      /*删除提示*/
      this.$alert(
        "删除后将不可以在用该场景发入积分，你确定已通过村民会议协商了么？",
        "删除发放场景",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          let res = await this.$http.distributionSetDelete(dataObj);
          if (res.status === "success") {
            this.$message({
              type: "success",
              message: res.msg || "积分发放场景已删除!",
            });
            this.reload();
            this.getInfo();
          } else {
            this.$alert(res.msg, "操作失败！", {
              confirmButtonText: "我知道了",
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    /*分页*/
    handleCurrentChange(val) {
      this.listMain.pageNo = val;
      this.getInfo();
    },

    /*地区下拉*/
    changeTown(val) {
      let _this = this;
      //   if (val.villageCode) {
      //     _this.villageCode = val.villageCode;
      //   } else if (val.townCode) {
      //     _this.villageCode = val.townCode;
      //   } else if (val.cityCode) {
      //     _this.villageCode = val.cityCode;
      //   }
      _this.isReset = false;
      _this.areaCode = val.cityCode;
      _this.streetCode = val.townCode;
      _this.villageCode = val.villageCode;
    },
  },
};
</script>

<style scoped>
</style>
