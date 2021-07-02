<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="handleAdd(1)" v-if="isAuth('base:goods:add')">添加商品</el-button>
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="上架状态：">
        <el-select v-model="searchForm.status" placeholder="请选择">
          <el-option label="--请选择--" value></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="审核未通过" :value="2"></el-option>
          <el-option label="可兑换" :value="3"></el-option>
          <el-option label="已下架" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <!-- <br /> -->
      <el-form-item label="商品名称：">
        <el-input v-model="searchForm.goodsName" placeholder="输入商品名称进行查询"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="id" label="序号" width="100px"></el-table-column>
      <el-table-column prop="picUrl" label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt width="100px" />
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip width="180"></el-table-column>
      <el-table-column prop="price" label="价格">
        <template slot-scope="scope">
          ￥{{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column prop="changePoint" label="兑换值"></el-table-column>
      <el-table-column prop="state" label="商品状态" :formatter="formatter">
      </el-table-column>
      <el-table-column prop="modifyTime" label="更新时间"></el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="examView(scope.row)" v-if="scope.row.state == 1&&isAuth('base:goods:audit')">审核</el-button>

          <el-button type="text" @click="handleAdd(2, scope.row)" v-if="scope.row.state == 2&&isAuth('base:goods:edit')">修改</el-button>
          <el-button type="text" @click="handleView(scope.row, 3)" v-if="scope.row.state == 4&&isAuth('base:goods:load')">上架</el-button>
          <el-button type="text" @click="handleView(scope.row, 4)" v-if="scope.row.state == 3&&isAuth('base:goods:load')">下架</el-button>
          <el-button type="text" v-if="isAuth('base:goods:del')" @click="delView(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="paging" background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" v-if="listMain.totalPage > 0" :page-size="listMain.pageSize" :page-count="listMain.totalPage" :pager-count="7" :current-page.sync="listMain.pageNo" :total="listMain.total"></el-pagination>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

import provinces from "../../components/common/provinces";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { provinces },
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
        goodsName: "",
        status: "",
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: "",
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
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
          goodsName: "",
          status: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          goodsName: "",
          status: "",
        };
      }else if (this.deptLevel == 5) {
        this.searchForm = {
          goodsName: "",
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
    formatter(item) {
      if (item.state == 1) {
        return "待审核";
      } else if (item.state == 2) {
        return "审核未通过";
      } else if (item.state == 3) {
        return "可兑换";
      } else {
        return "已下架";
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
        // pageSize: this.listMain.pageSize,
        // member_id: this.adminUserInfo.memberId,
        districtsCode: this.adminUserInfo.areaCode,
      };
      const res = await this.$http.exGoodst({
        ...objcommon,
        ...this.obj,
      });
      if (res.code === "0") {
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
    handleView(item, type) {
      let str = "";
      if (type == 3) {
        str = "确定要上架该商品吗?";
        this.$alert(str, "上架操作", {
          confirmButtonText: "确定上架",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.changeStatus(item, type);
          })
          .catch((_) => {});
      } else {
        str = "确定要下架该商品吗?";
        this.$alert(str, "下架操作", {
          confirmButtonText: "确定下架",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.changeStatus(item, type);
          })
          .catch((_) => {});
      }
    },
    //详情添加
    handleAdd(type, item) {
      if (type == 2) {
        this.$router.push({
          name: "addGoods",
          query: {
            id: item.id,
          },
        });
      } else {
        this.$router.push({
          name: "addGoods",
        });
      }
    },
    examView(item) {
      this.$router.push({
        name: "examGoods",
        query: {
          id: item.id,
          // type: type
        },
      });
    },
    /*删除*/
    async delView(item) {
      var str = "确定要删除该商品吗?";
      this.$alert(str, "删除操作", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((_) => {
          this.changeStatus1(item);
        })
        .catch((_) => {});
    },
    async changeStatus(item, type) {
      const res = await this.$http.updateExGoodsStatus({
        goodsId: item.id,
        status: type,
        type: 1,
        // member_id: this.adminUserInfo.memberId
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
    async changeStatus1(item) {
      const res = await this.$http.updateExGoodsStatus({
        goodsId: item.id,
        status: 1,
        type: 0,
        // member_id: this.adminUserInfo.memberId
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
