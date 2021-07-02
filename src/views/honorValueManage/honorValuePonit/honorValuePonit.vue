<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <!-- <el-button type="text" @click="exportBtn">导出</el-button> -->
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：">
        <provinces @changeTown="changeTown"></provinces>
      </el-form-item>

      <el-form-item label="等级称号：">
        <el-select v-model="searchForm.rankTitle" placeholder>
          <el-option label="--请选择--" value></el-option>
          <el-option label="普通村民" value="L1"></el-option>
          <el-option label="积极村民" value="L2"></el-option>
          <el-option label="优秀村民" value="L3"></el-option>
          <el-option label="先进村民" value="L4"></el-option>
          <el-option label="杰出村民" value="L5"></el-option>
          <el-option label="模范村民" value="L6"></el-option>
          <el-option label="加冕乡贤" value="L7"></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="姓名：">
        <el-input v-model="searchForm.names" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model="searchForm.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="ssex" label="性别">
        <template slot-scope="scope">{{scope.row.ssex==1?"男":"女"}}</template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" :formatter="formatter"></el-table-column>
      <el-table-column prop="isHousehold" label="与户主关系" :formatter="formatter1"></el-table-column>
      <el-table-column prop="honorPoint" label="积分"></el-table-column>
      <el-table-column prop="rankTitle" label="等级"></el-table-column>
      <el-table-column prop="rankTitleExplain" label="荣誉称号"></el-table-column>
      <el-table-column prop="integralPoint" label="积分"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="handleView(scope.row,1)" v-if="isPower">修改</el-button>
            <el-button type="text" @click="handleView(scope.row,2)">查看</el-button>
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
    <!-- 编辑 -->
    <add-edit ref="addedit" :memberId="memberId"  @changehonor="getListData()"></add-edit>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../../components/common/provinces";
import addEdit from "./addEdit";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    provinces,
    addEdit
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
        rankTitle: "",
        names: "",
        phone: "",
        disDistrictsCode: "",
        name: ""
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: {},
      memberId: "",
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isPower: false,
      role_list: []
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
   
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
    this.role_list = this.adminUserInfo.role_list;
  var index=-1,index2=-1;
    if (this.deptLevel == 5) {
      //积分管理员id=8
       index = this.role_list.findIndex(val => {
        return val.id == "8";
      });
      // if (index != -1) {
      //   this.isPower = true;
      // } else {
      //   this.isPower = false;
      // }
    } else {
      
    }
    if (index !=-1) {
        this.isPower = true;
      } else {
        this.isPower = false;
      }
    //  //积分管理员id=8
    //    index2 = this.role_list.findIndex(val => {
    //     return val.id == "1";
    //   });
    //   if (index2 != -1||index !=-1) {
    //     this.isPower = true;
    //   } else {
    //     this.isPower = false;
    //   }
    if (this.deptLevel == 3) {
      this.searchForm.disDistrictsCode = this.adminUserInfo.areaCode;
    }
    if (this.deptLevel == 4) {
      this.searchForm.disDistrictsCode = this.adminUserInfo.streetCode;
    }
    if (this.deptLevel == 5) {
      this.searchForm.disDistrictsCode = this.adminUserInfo.villageCode;
    }
     this.searchForm1 = this.searchForm;
    this.obj = this.searchForm1;
    this.getListData();
  },
  //方法集合
  methods: {
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
        memberId: this.adminUserInfo.memberId
      };
      var obj = {
        name: this.obj.name,
        rankTitle: this.obj.rankTitle,
        disDistrictsCode: this.obj.disDistrictsCode
      };

      const res = await this.$http.honorIntegralList({
        ...objcommon,
        ...obj
        // name: this.searchForm.phone || this.searchForm.name,
        // rankTitle: this.searchForm.rankTitle,
        // disDistrictsCode: this.searchForm.disDistrictsCode
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
      this.searchForm.name = this.searchForm.phone || this.searchForm.names;
      this.searchForm1 = this.searchForm;
      this.obj = this.searchForm;
      this.getListData();
    },
    handleView(item, type) {
      if (type == 1) {
        this.memberId = item.memberId;
        this.$refs.addedit.dialogFormVisible = true;
        this.memberId = item.memberId;
        // console.log(item.status);
        // this.$confirm("确认关闭？")
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      } else {
        this.$router.push({
          name: "honorValuePonitView",
          query: {
            memberId: item.memberId
          }
        });
      }
    },
    changeTown(val) {
      if (val.cityCode) {
        this.searchForm.disDistrictsCode = val.cityCode;
      }
      // if (val.townCode) {
      //   this.searchForm.disDistrictsCode = val.townCode;
      // }
      // if (val.villageCode) {
      //   this.searchForm.disDistrictsCode = val.villageCode;
      // }
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
    exportBtn() {}
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>