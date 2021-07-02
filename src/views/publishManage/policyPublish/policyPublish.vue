<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="handleView(1, 1)" v-if="isAuth('content:policy:add')">发布信息</el-button>
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="信息分类：">
        <el-select v-model="searchForm.dicId" placeholder>
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder>
          <el-option label="--请选择--" value></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="审核通过" value="2"></el-option>
          <el-option label="审核未通过" value="3"></el-option>
        </el-select>
      </el-form-item>
      <!-- <br /> -->
      <el-form-item label="主题名称：">
        <el-input v-model="searchForm.policyName" placeholder="请输入主题名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <!-- <el-table-column prop="id" label="序号" width="80px" ></el-table-column> -->
      <el-table-column prop="title" label="主题名称" width="300px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dicName" label="信息分类"></el-table-column>
      <el-table-column prop="state" label="状态" :formatter="formatter"></el-table-column>
      <el-table-column prop="creator" label="申请人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="handleView(scope.row, 2)" v-if="scope.row.state!=1&&isAuth('content:policy:edit')">修改</el-button>
            <el-button type="text" @click="handleView(scope.row, 4)" v-if="scope.row.state==1&&isAuth('content:policy:audit')">审核</el-button>
            <el-button type="text" @click="handleView(scope.row, 3)" v-if="isAuth('content:policy:view')">查看</el-button>
            <el-button type="text" v-if="isAuth('content:policy:del')" @click="handleDelete(scope.row)">删除</el-button>
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
      adminUserInfo: {},
      tableListData: [],
      searchForm: {
        policyName: "",
        status: "",
        dicId: "",
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      isPower: false,
      role_list: [],
      deptLevel: "",
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
          policyName: "",
          status: "",
          dicId: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          policyName: "",
          status: "",
          dicId: "",
        };
      }else if (this.deptLevel == 5) {
        this.searchForm = {
          policyName: "",
          status: "",
          dicId: "",
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
        type: 1,
      });
      if (res.status === "success") {
        this.list = res.data;
      } else {
      }
    },
    changeTown(val) {
      this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      this.searchForm.villageCode = val.villageCode;
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
      };
      const res = await this.$http.policyList({
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
    formatter(item) {
      if (item.state == 1) {
        return "待审核";
      } else if (item.state == 2) {
        return "审核通过";
      } else {
        return "审核未通过";
      }
    },
    formatter1(item) {
      return this.$formatDateTime(item.createTime, "yyyy-MM-dd HH:mm");
    },
    formatter2(item) {
      var day = "";
      switch (Number(row.sceneClassify)) {
        case 0:
          day = "综合";
          break;
        case 1:
          day = "政策信息";
          break;
        case 2:
          day = "宣传";
          break;
        case 3:
          day = "招商信息";
          break;
        case 4:
          day = "公告";
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
          query: {
            type: 1,
          },
        });
      } else if (type == 2) {
        this.$router.push({
          name: "addPolicy",
          query: {
            id: item.id,
            type: 2,
          },
        });
      } else {
        this.$router.push({
          name: "policyView",
          query: {
            id: item.id,
            type: type,
          },
        });
      }
    },
    handleDelete(item) {
      this.$alert("删除后不可恢复，您确定要继续吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((_) => {
          this.goDelete(item);
          done();
        })
        .catch((_) => {});
    },
    async goDelete(item) {
      const res = await this.$http.policyUpdateState({
        id: item.id,
        type: 3,
        // member_id: this.adminUserInfo.memberId,
        reason: "",
      });
      if (res.code === "0") {
        this.$message({
          type: "success",
          message: res.msg,
        });
        this.getListData();
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>