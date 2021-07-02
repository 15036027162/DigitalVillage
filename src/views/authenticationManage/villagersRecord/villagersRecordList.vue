<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="text" @click="addVillager(1,1)">添加村民</el-button>
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：">
        <provinces @changeTown="changeTown"></provinces>
      </el-form-item>

      <el-form-item label="村级组：">
        <el-select v-model="searchForm.groupCode" placeholder="村级组" clearable filterable>
          <el-option
            label="--请选择--"
            value=""
          ></el-option>
          <el-option
            v-for="item in groupList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="姓名：">
        <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="身份证号：">
        <el-input v-model="searchForm.identity" placeholder="通过身份证号查询"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <!-- <el-button size="mini" type="text" @click="addVillager(item,2)">修改</el-button> -->
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="account" label="用户名"></el-table-column>
      <el-table-column prop="identity" label="身份证号"></el-table-column>
      <el-table-column prop="ssex" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.ssex==1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column prop="national" label="民族"></el-table-column>
      <el-table-column prop="linkMobile" label="联系电话"></el-table-column>
      <el-table-column prop="isHousehold" label="与户主关系" :formatter="formatter1"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="addVillager(scope.row,2)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row,2)">注销</el-button>
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
        groupCode: "",
        villageCode: "",
        name: "",
        identity: ""
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: {},
      groupList: [],
      relationshipList: [
        {
          name: "户主",
          code: "1"
        },
        {
          name: "配偶",
          code: "2"
        },
        {
          name: "子女",
          code: "3"
        },
        {
          name: "父母",
          code: "4"
        },
        {
          name: "孙子孙女",
          code: "5"
        },
        {
          name: "祖父母",
          code: "6"
        },
        {
          name: "兄弟姐妹",
          code: "7"
        },
        {
          name: "女婿儿媳",
          code: "8"
        },
        {
          name: "其他",
          code: "9"
        }
      ],
      deptLevel: ""
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
    if (this.deptLevel == 5) {
      this.searchForm.villageCode = this.adminUserInfo.villageCode;
    }

    this.groupByVillages();
    this.searchForm1 = this.searchForm;
    this.obj = this.searchForm1;
    this.getListData();
  },
  //方法集合
  methods: {
    // 获取组
    async groupByVillages() {
      const res = await this.$http.groupByVillage({
        villageCode: this.searchForm.villageCode || ""
      });
      if (res.status === "success") {
        this.groupList = res.data;
      } else {
      }
    },
    handleDelete(item) {
      this.$alert(
        "注销村民后将会清除该村民的所有使用信息，请谨慎操作！",
        "注销村民",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(_ => {
          this.goDelete(item);
        })
        .catch(_ => {});
    },

    async goDelete(item) {
      const res = await this.$http.delMember({
        loginMemberId: this.adminUserInfo.memberId,
        memberId: item.memberId
      });
      if (res.code === "0") {
        setTimeout(() => {
          this.$alert(res.msg, "操作成功", {
            confirmButtonText: "我知道了",
            type: "success"
          });
          this.getListData();
        }, 1000);
      } else {
        setTimeout(() => {
          this.$alert(res.msg, "操作失败", {
            confirmButtonText: "我知道了",
            type: "error"
          });
        }, 1000);
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
        memberId: this.adminUserInfo.memberId
      };
      const res = await this.$http.getMemberList({
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

    changeTown(val) {
      if (val.villageCode) {
        this.searchForm.villageCode = val.villageCode;
        this.groupByVillages();
      }

      this.searchForm1 = this.searchForm;
      this.obj = this.searchForm1;
    },
    addVillager(item, type) {
      if (type == 1) {
        //添加
        this.$router.push({
          name: "addVillager",
          query: {
            type: 0
          }
        });
      } else if (type == 2) {
        //编辑
        this.$router.push({
          name: "addVillager",
          query: {
            memberId: item.memberId,
            type: 1
          }
        });
      }
    },
    formatter1(row) {
      var day = "";
      switch (row.isHousehold) {
        case 1:
          day = "户主";
          break;
        case 2:
          day = "配偶";
          break;
        case 3:
          day = "子女";
          break;
        case 4:
          day = "父母";
          break;
        case 5:
          day = "孙子孙女";
          break;
        case 6:
          day = "祖父母";
          break;
        case 7:
          day = "兄弟姐妹";
          break;
        case 8:
          day = "女婿儿媳";
          break;
        case 9:
          day = "其他";
          break;
        default:
          day = "其他";
      }
      return day;
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>