<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="exportBtn" v-if="isAuth('honor:statics:down')">导出</el-button>
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
      <el-form-item label="年份：">
        <el-date-picker v-model="searchForm.year" type="year" value-format="yyyy" format="yyyy" placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="年月季报表：">
        <el-select v-model="searchForm.type" placeholder="年月季报表" @change="changetype">
          <el-option label="--请选择--" value></el-option>
          <el-option label="月报" :value="2"></el-option>
          <el-option label="季报" :value="1"></el-option>
          <el-option label="年报" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="searchForm.type==2">

        <el-form-item label="月份：">
          <el-select v-model="searchForm.month" placeholder="月份">
            <el-option label="--请选择--" value></el-option>
            <el-option label="1月" :value="1"></el-option>
            <el-option label="2月" :value="2"></el-option>
            <el-option label="3月" :value="3"></el-option>
            <el-option label="4月" :value="4"></el-option>
            <el-option label="5月" :value="5"></el-option>
            <el-option label="6月" :value="6"></el-option>
            <el-option label="7月" :value="7"></el-option>
            <el-option label="8月" :value="8"></el-option>
            <el-option label="9月" :value="9"></el-option>
            <el-option label="10月" :value="10"></el-option>
            <el-option label="11月" :value="11"></el-option>
            <el-option label="12月" :value="12"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="searchForm.type==1">
        <el-form-item label="季度：">
          <el-select v-model="searchForm.quarter" placeholder="季度">
            <el-option label="--请选择--" value></el-option>
            <el-option label="一季度" :value="1"></el-option>
            <el-option label="二季度" :value="2"></el-option>
            <el-option label="三季度" :value="3"></el-option>
            <el-option label="四季度" :value="4"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <!-- <el-table-column prop="issue" label="期次"></el-table-column>
      <el-table-column prop="memberCount" label="参与人数"></el-table-column> -->
      <el-table-column prop="createTime" label="日期"></el-table-column>
      <el-table-column prop="houseNumber" label="门牌号"></el-table-column>
      <el-table-column prop="name" label="户主姓名"></el-table-column>
      <el-table-column prop="groupName" label="所属组"></el-table-column>
      <el-table-column prop="doorCount" label="家庭人数"></el-table-column>
      <el-table-column prop="honorTotal" label="积分总额"></el-table-column>
      <el-table-column prop="integralTotal" label="可用额度"></el-table-column>
    </el-table>
    <el-pagination class="paging" background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" v-if="listMain.totalPage > 0" :page-size="listMain.pageSize" :page-count="listMain.totalPage" :pager-count="7" :current-page.sync="listMain.pageNo" :total="listMain.total"></el-pagination>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../components/common/provinces";
import { baseUrl } from "../../config/env";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    provinces,
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
        scene: "",
        groupCode: "",
        villageCode: "",
        name: "",
        year: new Date().getFullYear().toString(),
        //year:new Date(),
        // year:2018,
        month: "",
        quarter: "",
        type: 3,
        areaCode: "",
        streetCode: "",
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: {},
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isPower: false,
      role_list: [],
      list: [],
      groupList: [],
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
    this.getList();
    this.groupByVillages();
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
          year: new Date().getFullYear().toString(),
          month: "",
          quarter: "",
          type: 3,
          scene: "",
          groupCode: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
           villageCode: "",
          name: "",
          year: new Date().getFullYear().toString(),
          month: "",
          quarter: "",
          type: 3,
          scene: "",
          groupCode: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          name: "",
          year: new Date().getFullYear().toString(),
          month: "",
          quarter: "",
          type: 3,
          scene: "",
          groupCode: "",
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
    //月季切换
    changetype(val) {
      this.searchForm.month = "";
      this.searchForm.quarter = "";
    },
    formatter(item) {
      if (item.state == 1) {
        return "待审核";
      } else if (item.state == 2) {
        return "已驳回";
      } else if (item.state == 3) {
        return "被投诉";
      } else if (item.state == 4) {
        return "公示中";
      } else if (item.state == 5) {
        return "已完成";
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
      var obj = {
        scene: this.obj.scene,
        villageCode: this.obj.villageCode,
        streetCode: this.obj.streetCode,
        areaCode: this.obj.areaCode,
        groupCode: this.obj.groupCode,
        year: this.obj.year,
      };

      if (this.obj.type == 1) {
        obj.type = 1;
        obj.time = this.obj.quarter;
      } else if (this.obj.type == 2) {
        obj.type = 2;
        obj.time = this.obj.month;
      }

      const res = await this.$http.doorHonorStaticsList({
        ...objcommon,
        ...obj,
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
        this.$router.push({
          name: "honorValueExamView",
          query: {
            honorSetId: item.honorSetId,
            issue: item.issue,
            type: 1,
            state: item.state,
            isAudit: item.isAudit,
          },
        });
      } else {
        this.$router.push({
          name: "honorValueExamView",
          query: {
            honorSetId: item.honorSetId,
            issue: item.issue,
            type: 2,
            state: item.state,
            isAudit: item.isAudit,
          },
        });
      }
      // if (type == 1) {
      //   console.log(item.status);
      //   this.$confirm("确认关闭？")
      //     .then(_ => {
      //       done();
      //     })
      //     .catch(_ => {});
      // } else {
      //   this.$router.push({
      //     name: "honorValueExamView"
      //   });
      // }
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
    exportBtn() {
      var url =
        baseUrl +
        "integratemall/v2/w/integral/exportStatics?villageCode=" +
        this.searchForm.villageCode +
        "&areaCode=" +
        this.searchForm.areaCode +
        "&streetCode=" +
        this.searchForm.streetCode +
        "&scene=" +
        this.searchForm.scene +
        "&groupCode=" +
        this.searchForm.groupCode +
        "&year=" +
        this.searchForm.year +
        "&NO_SIGN=N";
      if (this.searchForm.type == 2) {
        url =
          baseUrl +
          "integratemall/v2/w/integral/exportStatics?villageCode=" +
          this.searchForm.villageCode +
          "&areaCode=" +
          this.searchForm.areaCode +
          "&streetCode=" +
          this.searchForm.streetCode +
          "&scene=" +
          this.searchForm.scene +
          "&groupCode=" +
          this.searchForm.groupCode +
          "&year=" +
          this.searchForm.year +
          "&type=1&time=" +
          this.searchForm.quarter +
          "&NO_SIGN=N";
      } else if (this.searchForm.type == 3) {
        url =
          baseUrl +
          "integratemall/v2/w/integral/exportStatics?villageCode=" +
          this.searchForm.villageCode +
          "&areaCode=" +
          this.searchForm.areaCode +
          "&streetCode=" +
          this.searchForm.streetCode +
          "&scene=" +
          this.searchForm.scene +
          "&groupCode=" +
          this.searchForm.groupCode +
          "&year=" +
          this.searchForm.year +
          "&type=2&time=" +
          this.searchForm.month +
          "&NO_SIGN=N";
      }
      window.open(url, "_blank", "");
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>