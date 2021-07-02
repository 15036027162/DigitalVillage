<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <!-- v-if="isAuth('content:phfinance:add')" -->
      <el-button type="primary" size="medium" plain @click="handleView(1, 1)" v-if="isAuth('content:phfinance:add')">发布信息</el-button>
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder>
          <el-option label="--请选择--" value></el-option>
          <el-option label="上架" :value="1"></el-option>
          <el-option label="下架" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主题名称：">
        <el-input v-model="searchForm.title" maxlength="20" placeholder="请输入主题名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="id" label="序号" width="80px"></el-table-column>
      <el-table-column prop="title" label="主题名称" width="300px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt width="50px" height="50px" style="margin:6px;auto" />
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" :formatter="formatter"></el-table-column>
      <el-table-column prop="reading" label="阅读量"></el-table-column>
      <el-table-column prop="creator" label="发布人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
              <!-- v-if="scope.row.state==2&&isAuth('content:phfinance:load')" -->
              <!-- v-if="scope.row.state==1&&isAuth('content:phfinance:load')" -->
              <!-- v-if="isAuth('content:phfinance:del')" -->
              <!-- v-if="isAuth('content:phfinance:add')" -->
               <!-- v-if="isAuth('content:phfinance:view')" -->
            <el-button type="text" @click="handleView(scope.row, 2)"  v-if="isAuth('content:phfinance:add')" >修改</el-button>
            <el-button type="text" @click="handleonline(scope.row,1)" v-if="scope.row.status==2&&isAuth('content:phfinance:load')">上架</el-button>
            <el-button type="text" @click="handleonline(scope.row,2)" v-if="scope.row.status==1&&isAuth('content:phfinance:load')">下架</el-button>
            <el-button type="text" @click="handleView(scope.row, 3)" v-if="isAuth('content:phfinance:view')">查看</el-button>
            <el-button type="text"  @click="handleDelete(scope.row)" v-if="isAuth('content:phfinance:del')">删除</el-button>
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
        title: "",
        status: "",
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
    this.searchForm1 = this.searchForm;
    this.obj = this.searchForm1;
    this.getListData();
  },
  //方法集合
  methods: {
    //重置
    resetForm() {
      this.searchForm = {
        title: "",
        status: "",
      };
      this.searchForm1 = this.searchForm;
      this.obj = this.searchForm1;
      this.isReset = true;
      this.listMain.pageNo = 1;
      this.getListData();
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
        startPage: this.listMain.pageNo,
        pageSize: this.listMain.pageSize,
      };
      const res = await this.$http.getFinanceList({
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
      if (item.status == 1) {
        return "上架";
      } else if (item.status == 2) {
        return "下架";
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
          name: "addFinance",
        });
      } else if (type == 2) {
        this.$router.push({
          name: "addFinance",
          query: {
            id: item.id,
          },
        });
      } else {
        this.$router.push({
          name: "financeView",
          query: {
            id: item.id,
          },
        });
      }
    },
    //上架下架
    handleonline(item, type) {
      //审核通过

      if (type == 1) {
        this.$alert("您确定要上架该数据吗?", "上架操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.exam(item, type);
          })
          .catch((_) => {});
      } else if (type == 2) {
        this.$alert("您确定要下架该数据吗?", "下架操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.exam(item, type);
          })
          .catch((_) => {});
      }
    },
    async exam(item, type) {
      const res = await this.$http.getFinanceupdateStatus({
        id: item.id,
        status: type,
        // member_id: this.adminUserInfo.memberId
      });
      if (res.code === "0") {
        this.$message({
          type: "success",
          message: res.msg,
        });
        this.getListData();
        // if (type == 4) {
        //   item.state = 2;
        // }
        // if (type == 1) {
        //   item.state = 4;
        // }
      } else {
        this.$message({
          type: "error",
          message: res.msg,
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
      const res = await this.$http.getFinanceDelete({
        id: item.id,
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