<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <!-- <el-button type="text" @click="exportBtn">导出</el-button> -->
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="处理状态：">
        <el-select v-model="searchForm.state" placeholder="处理状态">
          <el-option label="--请选择--" value></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="审核通过" :value="3"></el-option>
          <el-option label="审核未通过" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- <br /> -->
      <el-form-item label="场景分类：">
        <el-select v-model="searchForm.scene" placeholder="场景分类">
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件名称：">
        <el-input v-model="searchForm.sceneName" placeholder="请输入事件名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="issue" label="批次编号"></el-table-column>
      <el-table-column prop="sceneClassifyExplain" label="场景分类"></el-table-column>
      <el-table-column prop="sceneName" label="事件名称"></el-table-column>
      <el-table-column prop="memberCount" label="参与人/户"></el-table-column>
      <el-table-column prop="state" label="处理状态" :formatter="formatter"></el-table-column>

      <el-table-column prop="createTime" label="提交时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="handleView(scope.row, 2)" v-if="scope.row.state == 1 && isAuth('honor:batch:audit')">审核</el-button>
            <el-button type="text" v-if="isAuth('honor:batch:view')" @click="handleView(scope.row, 1)">查看</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="paging" background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" v-if="listMain.totalPage > 0" :page-size="listMain.pageSize" :page-count="listMain.totalPage" :pager-count="7" :current-page.sync="listMain.pageNo" :total="listMain.total"></el-pagination>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../../components/common/provinces";
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
        villageCode: "",
        sceneName: "",
        state: "",
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
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          sceneName: "",
          state: "",
          scene: "",
        };
      }else if (this.deptLevel == 5) {
        this.searchForm = {
          sceneName: "",
          state: "",
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
    formatter1(row) {
      var index = this.list.findIndex((val) => {
        return val.id == row.scene;
      });
      if (index != -1) {
        return this.list[index].name;
      }
    },
    formatter(item) {
      if (item.state == 1) {
        return "待审核";
      } else if (item.state == 2) {
        return "审核未通过";
      } else if (item.state == 3) {
        return "审核通过";
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
      const res = await this.$http.auditHonorIntegralList({
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
        this.$router.push({
          name: "honorValueExamView",
          query: {
            issue: item.issue,
            type: 1,
            state: item.state,
            villageCode: item.villageCode,
            honorSetId: item.honorSetId,
          },
        });
      } else {
        this.$router.push({
          name: "honorValueExamView",
          query: {
            issue: item.issue,
            type: 2,
            state: item.state,
            villageCode: item.villageCode,
            honorSetId: item.honorSetId,
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
      } else {
        this.searchForm.villageCode = "";
      }
    },
    exportBtn() {},
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>