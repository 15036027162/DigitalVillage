<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="exportBtn" v-if="isAuth('honor:public:down')" >导出</el-button>
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择："  v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="场景分类：">
        <el-select v-model="searchForm.scene" placeholder="场景分类">
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发放状态：">
        <el-select v-model="searchForm.state" placeholder="发放状态">
          <el-option label="--请选择--" value></el-option>
          <el-option label="被投诉" value="3"></el-option>
          <el-option label="公示中" value="4"></el-option>
          <el-option label="已完成" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件名称：">
        <el-input v-model="searchForm.sceneName" placeholder="请输入事件名称"></el-input>
      </el-form-item>

      <el-form-item label="姓名：">
        <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
         <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="ssex" label="参与者">
        <template slot-scope="scope">{{
          scope.row.isDoor == '2' ? "个人" : "家庭"
        }}</template>
      </el-table-column>
      <el-table-column prop="sceneName" label="事件名称/事由"></el-table-column>
      <el-table-column prop="honorPoint " label="积分">
        <template slot-scope="scope">{{ scope.row.isAddPlus == 1 ? "+" : "-"
          }}{{ scope.row.honorPoint }}</template>
      </el-table-column>

      <el-table-column prop="state" label="状态" :formatter="formatter3"></el-table-column>
      <el-table-column prop="createTime" label="提交时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="handleViews(scope.row, 1)" v-if="isAuth('honor:public:view')">查看</el-button>

          <el-button type="text" @click="handleViews(scope.row, 2)" v-if="(scope.row.state == 3&&isAuth('honor:public:edit')) || (scope.row.state == 4&&isAuth('honor:public:edit'))">修正</el-button>
          <!-- <el-button
              type="text"
              @click="handleViews(scope.row, 2)"
              v-if="scope.row.state == 5"
              disabled="disabled"
              >修正</el-button
            > -->

        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="paging" background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" v-if="listMain.totalPage > 0" :page-size="listMain.pageSize" :page-count="listMain.totalPage" :pager-count="7" :current-page.sync="listMain.pageNo" :total="listMain.total"></el-pagination>
    <!-- 编辑 -->
    <add-edit ref="addedit" :memberId="memberId" :info="info" @changehonor="getListData()"></add-edit>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../../components/common/provinces";
import { baseUrl } from "../../../config/env";
import { sign } from "../../../config/signApi";
import addEdit from "./addEditPublicity";
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
        sceneName: "",
        villageCode: "",
        areaCode: "",
        streetCode: "",
        scene: "",
        state: "",
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: {},
      memberId: "",
      honorSetId: "",
      issue: "",
      info: {},
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isPower: false,
      role_list: [],
      isAudit: "",
      list: [],
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
          sceneName: "",
          state: "",
          scene: "",
          name: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          sceneName: "",
          state: "",
          scene: "",
          name: "",
        };
      }else if (this.deptLevel == 5) {
        this.searchForm = {
          sceneName: "",
          state: "",
          scene: "",
          name: "",
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
    //格式化手机号
    formatter4(row) {
      var reg = /^(\d{3})\d*(\d{4})$/;
      if (row.mobile) {
        return row.mobile.replace(reg, "$1****$2");
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
        memberId: this.adminUserInfo.memberId,
      };
      const res = await this.$http.honorPublicList({
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
        // this.isAudit=resData.list[0].isAudit;
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
      // this.$refs.addedit.dialogFormVisible = true;
      this.searchForm1 = this.searchForm;
      this.obj = this.searchForm;
      this.getListData();
    },
    handleView(item, type) {
      return;
      if (type == 1) {
        this.memberId = item.memberId;
        this.info = item;
        this.$refs.addedit.dialogFormVisible = true;
        // console.log(item.status);
        // this.$confirm("确认关闭？")
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      } else {
        this.$router.push({
          name: "honorValueExamView",
        });
      }
    },
    handleViews(item, type) {
      this.$router.push({
        name: "honorValuePublicityView",
        query: {
          honorCode: item.honorCode,
          type: type,
        },
      });
    },
    changeTown(val) {
      this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      if (val.villageCode) {
        this.searchForm.villageCode = val.villageCode;
      } else {
        this.searchForm.villageCode = "";
      }
    },
    formatter3(item) {
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

    exportBtn() {
      window.open(
        baseUrl +
          "integratemall/v2/w/integral/exportPublic?villageCode=" +
          this.searchForm.villageCode +
          "&areaCode=" +
          this.searchForm.areaCode +
          "&streetCode=" +
          this.searchForm.streetCode +
          "&scene=" +
          this.searchForm.scene +
          "&sceneName=" +
          this.searchForm.sceneName +
          "&state=" +
          this.searchForm.state +
          "&name=" +
          this.searchForm.name +
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