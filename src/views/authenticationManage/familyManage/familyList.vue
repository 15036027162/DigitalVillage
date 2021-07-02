<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="downloadCode" v-if="isAuth('base:door:batdown')">批量下载家庭二维码</el-button>
      <el-button type="primary" size="medium" plain @click="addAllGroup" v-if="isAuth('base:door:batadd')">批量添加家庭户</el-button>
      <el-button type="primary" size="medium" plain @click="addDGroup" v-if="isAuth('base:door:add')">添加家庭户</el-button>
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" >
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>

      <el-form-item label="村级组：">
        <el-select v-model="searchForm.groupCode" placeholder="请选择" clearable filterable>
          <el-option label="--请选择--" value=""></el-option>
          <el-option v-for="item in groupList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="家庭类型：">
        <el-select v-model="searchForm.doorType" placeholder="请选择">
          <el-option v-for="item in doorList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <!-- <br /> -->
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="请选择">
          <el-option label="--请选择--" value></el-option>
          <el-option label="已激活" :value="2"></el-option>
          <el-option label="未激活" :value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="户主名称：">
        <el-input v-model="searchForm.doorName" placeholder="请输入户主名称"></el-input>
      </el-form-item>
      <el-form-item label="门牌号：">
        <el-input v-model="searchForm.houseNumber" placeholder="请输入门牌号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="houseNumber" label="门牌号"></el-table-column>
      <el-table-column prop="doorName" label="户主名称">
        <template slot-scope="scope">{{
          scope.row.doorName == "" ? "无":scope.row.doorName
        }}</template>
      </el-table-column>
      <el-table-column prop="idcard" label="户主身份证号" :formatter="formatter"></el-table-column>
      <el-table-column prop="doorType" label="家庭类型" :formatter="formatter1"></el-table-column>
      <el-table-column prop="groupName" label="所属组"></el-table-column>
      <el-table-column prop="doorCounts" label="家庭人数"></el-table-column>
      <el-table-column prop="" label="状态">
        <template slot-scope="scope">{{
          scope.row.status == 0 ? "未激活" : "已激活"
        }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="handleView(scope.row)" v-if="isAuth('base:door:view')">查看</el-button>
            <el-button type="text" @click="handleEdit(scope.row)" v-if="isAuth('base:door:edit')">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row, 2)" v-if="isAuth('base:door:del')">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="paging" background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" v-if="listMain.totalPage > 0" :page-size="listMain.pageSize" :page-count="listMain.totalPage" :pager-count="7" :current-page.sync="listMain.pageNo" :total="listMain.total"></el-pagination>
    <!--新增-->
    <addFamily v-if="addGroupModel"></addFamily>
    <!--编辑-->
    <editFamily v-if="editGroupModel" :data="groupEdit"></editFamily>
    <!-- 批量新增 -->
    <allAddFamily v-if="allAddFamilyModle"></allAddFamily>
    <!-- 批量下载 -->
    <downloadCode v-if="downloadModel"></downloadCode>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../../components/common/provinces";
import addFamily from "@/components/public/family/addFamily";
import editFamily from "@/components/public/family/editFamily";
import downloadCode from "@/components/public/family/downloadCode";
import allAddFamily from "@/components/public/family/allAddFamily";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    provinces,
    addFamily,
    editFamily,
    downloadCode,
    allAddFamily,
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
      addGroupModel: false, //新增
      editGroupModel: false, //编辑
      downloadModel: false, //下载
      allAddFamilyModle: false, //批量添加
      groupEdit: "",
      searchForm: {
        groupCode: "",
        areaCode: "",
        streetCode: "",
        villageCode: "",
        doorName: "",
        houseNumber: "",
        doorType: "",
        status: "",
      },
      groupList: [],
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: {},
      relationshipList: [
        {
          name: "户主",
          code: "1",
        },
        {
          name: "配偶",
          code: "2",
        },
        {
          name: "子女",
          code: "3",
        },
        {
          name: "父母",
          code: "4",
        },
        {
          name: "孙子孙女",
          code: "5",
        },
        {
          name: "祖父母",
          code: "6",
        },
        {
          name: "兄弟姐妹",
          code: "7",
        },
        {
          name: "女婿儿媳",
          code: "8",
        },
        {
          name: "其他",
          code: "9",
        },
      ],
      doorList: [
        {
          name: "--请选择--",
          code: "",
        },
        {
          name: "普通家庭",
          code: 1,
        },
        {
          name: "贫困户（含已脱贫）",
          code: 5,
        },
        {
          name: "独生子女家庭",
          code: 6,
        },
        {
          name: "军人家庭",
          code: 7,
        },
        {
          name: "集体户口",
          code: 2,
        },
        {
          name: "外来常住户口",
          code: 3,
        },
        {
          name: "其他",
          code: 4,
        },
      ],
      deptLevel: "",
      isReset: false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
    this.searchForm.areaCode = this.adminUserInfo.areaCode;
    if (this.deptLevel == 5) {
      this.searchForm.villageCode = this.adminUserInfo.villageCode;
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
    } else if (this.deptLevel == 4) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
    }
    this.groupByVillages();
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
          groupCode: "",
          streetCode: "",
          villageCode: "",
          doorName: "",
          houseNumber: "",
          doorType: "",
          status: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          groupCode: "",
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          doorName: "",
          houseNumber: "",
          doorType: "",
          status: "",
        };
      }else if (this.deptLevel == 5) {
        this.searchForm = {
          groupCode: "",
          doorName: "",
          houseNumber: "",
          doorType: "",
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
    formatter(row) {
      var reg = /^(\d{4})\d*(\d{2})$/;
      if (row.idcard) {
        return row.idcard.replace(reg, "$1************$2");
      } else {
        return "无";
      }
    },
    //批量添加家庭户
    addAllGroup() {
      this.allAddFamilyModle = true;
    },
    //批量下载二维码
    downloadCode() {
      this.downloadModel = true;
    },
    /*添加组*/
    addDGroup() {
      this.addGroupModel = true;
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
    /*编辑*/
    handleEdit(val) {
      this.editGroupModel = true;
      this.groupEdit = val;
      console.log(this.groupEdit);
      // console.log(val)
      //console.log("fff")
    },
    handleDelete(item) {
      this.$alert("删除后，该家庭下的村民的乡村认证标识将失效!", "删除家庭户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((_) => {
          this.goDelete(item);
        })
        .catch((_) => {});
    },

    async goDelete(item) {
      const res = await this.$http.deleteFamily({
        memberId: this.adminUserInfo.memberId,
        doorNum: item.doorNum,
      });
      if (res.code === "0") {
        // this.$alert(res.msg, "操作失败", {
        //   confirmButtonText: "我知道了",
        //   type: "success"
        // });
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
        // this.$alert(res.msg, "操作成功", {
        //   confirmButtonText: "我知道了",
        //   type: "error"
        // });
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
      const res = await this.$http.familyList({
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
      this.$router.push({
        name: "familyView",
        query: {
          doorNum: item.doorNum,
        },
      });
    },
    changeTown(val) {
      this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      this.searchForm.villageCode = val.villageCode;
      this.groupByVillages();
      // if (val.villageCode) {
      //   this.searchForm.villageCode = val.villageCode;
      //   this.groupByVillages();
      // }else{
      //    this.searchForm.villageCode = '';
      //   this.groupByVillages();
      // }
    },
    addVillager(item, type) {
      if (type == 1) {
        //查看
        this.$router.push({
          name: "addVillager",
          query: {
            id: item.id,
            type: 0,
          },
        });
      } else if (type == 2) {
        //审核
        this.$router.push({
          name: "addVillager",
          query: {
            id: item.id,
            type: 1,
          },
        });
      }
    },
    formatter1(row) {
      var day = "";
      switch (row.doorType) {
        case "1":
          day = "普通家庭";
          break;
        case "2":
          day = "集体户口";
          break;
        case "3":
          day = "外来常住户口";
          break;
        case "4":
          day = "其他";
          break;
        case "5":
          day = "贫困户（含已脱贫）";
          break;
        case "6":
          day = "独生子女家庭";
          break;
        case "7":
          day = "军人家庭";
          break;
      }
      return day;
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
