<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="handleView(1,1)" v-if="isAuth('content:advert:add')">发布</el-button>
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder>
          <el-option label="--请选择--" value></el-option>
          <el-option label="已上架" value="2"></el-option>
          <el-option label="未上架" value="4"></el-option>
        </el-select>
      </el-form-item>

      <!-- <br /> -->
      <el-form-item label="主题名称：">
        <el-input v-model="searchForm.advName" placeholder="主题名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="id" label="序号" width="80px"></el-table-column>
      <el-table-column prop="name" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt width="50px" height="50px" style="margin:6px;auto" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="主题名称" width="300px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="url" label="URL链接">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" style="color:#409EFF;text-decoration:underline">{{scope.row.url}}</a>
        </template>
      </el-table-column>

      <el-table-column prop="state" label="状态" :formatter="formatter"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="handleView(scope.row,2)" v-if="scope.row.state==4&&isAuth('content:advert:edit')">修改</el-button>
            <el-button type="text" @click="handleView(scope.row,3)">查看</el-button>
            <el-button type="text" @click="handleonline(scope.row,1)" v-if="scope.row.state==4&&isAuth('content:advert:load')">上架</el-button>
            <el-button type="text" @click="handleonline(scope.row,4)" v-if="scope.row.state==2&&isAuth('content:advert:load')">下架</el-button>
            <el-button type="text" @click="handleonline(scope.row,3)" v-if="isAuth('content:advert:del')">删除</el-button>
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
        advName: "",
        status: "",
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: {},
      isPower: false,
      role_list: [],
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isReset:false,
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
          advName: "",
          status: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          advName: "",
          status: "",
        };
      }else if (this.deptLevel == 5) {
        this.searchForm = {
          advName: "",
          status: "",
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
    changeTown(val) {
       this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      this.searchForm.villageCode = val.villageCode;
    },
    //上架下架
    handleonline(item, type) {
      //审核通过

      if (type == 1) {
        this.$alert("您确定要上架该商业信息吗?", "上架操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.exam(item, type);
          })
          .catch((_) => {});
      } else if (type == 4) {
        this.$alert("您确定要下架该商业信息吗?", "下架操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.exam(item, type);
          })
          .catch((_) => {});
      } else if (type == 3) {
        this.$alert("删除后将不在app展示，确定要删除么?", "删除商业信息", {
          confirmButtonText: "确定删除",
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
      const res = await this.$http.advUpdateState({
        id: item.id,
        type: type,
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
      const res = await this.$http.getadvList({
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
    formatter(item) {
      if (item.state == 2) {
        return "已上架";
      } else if (item.state == 4) {
        return "未上架";
      }
    },
    formatter1(item) {
      return this.$formatDateTime(item.createTime, "yyyy-MM-dd");
    },
    handleView(item, type) {
      if (type == 1) {
        this.$router.push({
          name: "addAdvertisement",
          query: {
            type: 1,
          },
        });
      } else if (type == 2) {
        this.$router.push({
          name: "addAdvertisement",
          query: {
            id: item.id,
            type: 2,
          },
        });
      } else {
        this.$router.push({
          name: "advertisementView",
          query: {
            id: item.id,
          },
        });
      }
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>