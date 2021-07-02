<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：">
        <provinces @changeTown="changeTown"></provinces>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder>
          <el-option label="--请选择--" value></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="审核通过" value="2"></el-option>
          <el-option label="审核不通过" value="3"></el-option>
             <el-option label="下架" value="4"></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="广告主题：">
        <el-input v-model="searchForm.advName" placeholder="广告主题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <!-- <el-table-column prop="id" label="序号" width="80px" ></el-table-column> -->
      <el-table-column prop="title" label="广告主题" width="300px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt width="50px" height="50px" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <!-- <el-table-column prop="address" label="申请日期" :formatter="formatter1"></el-table-column> -->
      <el-table-column prop="creatorName" label="申请人"></el-table-column>

      <el-table-column prop="state" label="状态" :formatter="formatter"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="handleView(scope.row,1)">查看</el-button>
            <el-button type="text" @click="handleView(scope.row,2)" v-if="scope.row.state==1&&isPower">审核</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="paging"
      background
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, jumper"
      v-if="listMain.totalPage > 0"
      :page-size="listMain.pageSize"
      :page-count="listMain.totalPage"
      :pager-count="7"
      :current-page.sync="listMain.pageNo"
      :total="listMain.total"
    ></el-pagination>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../../components/common/provinces";
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
        advName: "",
        status: "",
        areaCode: "",
        streetCode: "",
        villageCode: ""
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: "",
       isPower: false,
       role_list: [],
       deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
     this.role_list = this.adminUserInfo.role_list;
       this.deptLevel = this.adminUserInfo.deptLevel;
      //积分管理员id=7
      // let index = this.role_list.findIndex(val => {
      //   return val.id == "4"|| val.id == "1";
      // });
       let index = this.role_list.findIndex(val => {
        return val.id == "4";
      });
      if (index != -1) {
        this.isPower = true;
      } else {
        this.isPower = false;
      }
    // this.searchForm.areaCode = this.adminUserInfo.areaCode;
    // this.searchForm.streetCode = this.adminUserInfo.streetCode;
    // this.searchForm.villageCode = this.adminUserInfo.villageCode;
     if (this.deptLevel == 3) {
      this.searchForm.areaCode = this.adminUserInfo.areaCode;
    } else if (this.deptLevel == 4) {
      this.searchForm.areaCode = this.adminUserInfo.areaCode;
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
    } else if (this.deptLevel == 5) {
      this.searchForm.areaCode = this.adminUserInfo.areaCode;
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
      this.searchForm.villageCode = this.adminUserInfo.villageCode;
    }
    this.searchForm1 = this.searchForm;
    this.obj = this.searchForm1;
    this.getListData();
  },
  //方法集合
  methods: {
    changeTown(val) {
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      this.searchForm.villageCode = val.villageCode;
    },
    //上架下架
    handleonline(item, type) {},

    handleCurrentChange(val) {
      this.listMain.pageNo = val;
      this.obj = this.searchForm1;
      this.getListData();
    },
    // 获取列表数据
    async getListData() {
      this.loading = true;
      var objcommon = {
        pageNumber: this.listMain.pageNo
      };
      const res = await this.$http.advCheckList({
        ...objcommon,
        ...this.obj
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
          message: res.msg
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
      } else if(item.state == 3) {
        return "审核不通过";
      }else if(item.state == 4){
         return "下架";
      }
    },
    formatter1(item) {
      return this.$formatDateTime(item.createTime, "yyyy-MM-dd");
    },
    handleView(item, type) {
      if (type == 1) {
        this.$router.push({
          name: "advertisementExamView",
          query: {
            id: item.id,
            type: 0
          }
        });
      } else if (type == 2) {
        //审核
        this.$router.push({
          name: "advertisementExamView",
          query: {
            id: item.id,
            type: 1
          }
        });
      }
    },

    exportBtn() {}
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>