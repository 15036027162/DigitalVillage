<!--  -->
<template>
  <!-- 搜索S -->
    <div class="main-search mcl">
      <el-form ref="searchForm" :model="searchForm" class="main-search-form mcl">
        <el-form-item label="选择地区：" prop="cityCode" class="area-select-item area-select-autoWidth">
          <el-select
            v-model="searchForm.cityCode"
            placeholder="请选择县"
            value
            :disabled="disableSelectCity"
          >
            <el-option
              v-for="item in cityList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop="townCode" class="area-select-item area-select-autoWidth">
          <el-select
            v-model="searchForm.townCode"
            placeholder="请选择镇"
            @change="changeTown"
            value
            :disabled="disableSelectTown"
          >
            <el-option
              v-for="item in townList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop="villageCode" class="area-select-autoWidth">
          <el-select
            v-model="searchForm.villageCode"
            placeholder="请选择村"
            value
            :disabled="disableSelectVillage"
          >
            <el-option
              v-for="item in villageList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-btnCon">
          <el-button type="primary" @click="onSearchSubmit" class="confirm-btn search-btn">查询</el-button>
          <el-button type="primary" @click="exportList" class="confirm-btn export-btn">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索E -->
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import {
  getPartyAffairsOneList,
  getTownListByCityCode,
  getVillageListByTownCode,
  getFinanceAllCount,
} from "../api/getData";
import { getStore } from "../config/mUtils";
import { baseUrl } from "../config/env";

export default {
//import引入的组件需要注入到对象中才能使用
data() {
//这里存放数据
return {
  searchForm: {
        cityCode: "", // 县
        townCode: "", // 镇
        villageCode: "", // 村
      }, // 搜索
       searchForm1: {
        cityCode: "", // 县
        townCode: "", // 镇
        villageCode: "", // 村
      }, // 搜索
      cityList: [], // 市县列表
      townList: [], // 镇列表
      villageList: [], // 村列表
      disableSelectCity: false, // 可选市
      disableSelectTown: false, // 可选镇
      disableSelectVillage: false, // 可选村
};
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
  this.getAreaListData()
},
//方法集合
methods: {
   // 获取县镇村列表数据及相关处理
    async getAreaListData() {
      let _this = this;

      ////
      // 获取用户信息
      const sessionAdminInfo = JSON.parse(getStore("adminUserInfo")) || "";
      //const session_admin_id = sessionAdminInfo.memberId || 0;
      //const sessionOrgType = sessionAdminInfo.org_type || 3;// 类型（0管理员，1村民，2基层组织，3经济组织）
      const sessionAreaCode = sessionAdminInfo.areaCode || ""; // 县code
      const sessionAreaName = sessionAdminInfo.area_name || ""; // 县名称
      const sessionTownCode = sessionAdminInfo.streetCode || ""; // 镇code
      const sessionVillageCode = sessionAdminInfo.village_code || ""; // 村code
      const sessionRegionType = sessionAdminInfo.region_type || 3; // 所属部门组织的区划类型：1县级，2镇级，3村级
      this.level = sessionRegionType;
      this.sessionVillageCode = sessionVillageCode;
      // 列表数据处理
      if (sessionAreaCode.length > 0) {
        // 取县列表
        _this.searchForm.cityCode = sessionAreaCode;
        _this.cityList.unshift({
          code: sessionAreaCode,
          name: sessionAreaName,
        });

        // 取镇列表
        await _this.getTownList(sessionAreaCode);

        // 禁用处理
        if (sessionRegionType === "1") {
          // 县 状态赋值
          _this.disableSelectCity = true;
        } else if (sessionRegionType === "2") {
          // 镇 状态赋值
          _this.disableSelectCity = true;
          _this.disableSelectTown = true;
          // 取村列表
          await _this.getVillageList(sessionTownCode);
          // 表单赋值
          _this.searchForm.townCode = sessionTownCode;
        } else {
          // 村 状态赋值
          _this.disableSelectCity = true;
          _this.disableSelectTown = true;
          _this.disableSelectVillage = true;
          // 取村列表
          await _this.getVillageList(sessionTownCode);
          // 表单赋值
          _this.searchForm.townCode = sessionTownCode;
          _this.searchForm.villageCode = sessionVillageCode;
        }

        // 设置数据
        _this.adminUserInfo = sessionAdminInfo;
        this.obj = {
          areaCode: this.searchForm.cityCode, // 县
          streetCode: this.searchForm.townCode, // 镇
          village_code: this.searchForm.villageCode, // 村
        };
        this.searchForm1 = {
          cityCode: sessionAreaCode, // 县
          townCode: sessionTownCode, // 镇
          villageCode: sessionVillageCode, // 村
        };
      }
    },
    // 获取镇列表
    async getTownList(areaCode, set = true) {
      if (areaCode.length > 0) {
        const session_townList = JSON.parse(getStore("townListInfo")) || "";
        if (session_townList.length > 0) {
          if (set !== false) {
            this.townList = session_townList;
          }
        } else {
          const res = await getTownListByCityCode({ areaCode: areaCode });
          if (res.status === "success") {
            res.data.unshift({
              code: "",
              name: "--请选择--",
            });
            if (set !== false) {
              this.townList = res.data || [];
            }
          }
        }
      }else{
        this.townList = [];
      }
    },
    // 获取村列表
    async getVillageList(streetCode, set = true) {
      if (streetCode.length > 0) {
        const session_villageList =
          JSON.parse(getStore("villageListInfo")) || "";
        if (session_villageList.length > 0) {
          if (set !== false) {
            this.villageList = session_villageList;
          }
        } else {
          const res = await getVillageListByTownCode({
            streetCode: streetCode,
          });
          if (res.status === "success") {
            res.data.unshift({
              code: "",
              name: "--请选择--",
            });
            if (set !== false) {
              this.villageList = res.data || [];
            }
          }
        }
      }else{
        this.villageList =[];
      }
    },
      // 切换镇
    changeTown() {
      const _this = this;
      const townCode = _this.searchForm.townCode || "";
      //_this.searchForm.townCode = townCode;
      _this.searchForm.villageCode = "";
      _this.getVillageList(townCode);
    },
     // 搜索查询
    onSearchSubmit() {
      let _this = this;
    //   _this.listMain.pageNo = 1;
      this.searchForm1 = {
        cityCode: this.searchForm.cityCode, // 县
        townCode: this.searchForm.townCode, // 镇
        villageCode: this.searchForm.villageCode, // 村
      };
      this.obj = {
        areaCode: this.searchForm.cityCode, // 县
        streetCode: this.searchForm.townCode, // 镇
        village_code: this.searchForm.villageCode, // 村
      };
    //   _this.getListData();
    this.$emit("searchsubmit",this.searchForm,this.searchForm1,this.obj)
    },
    exportList() {
      window.open(
        baseUrl +
          "financePlan/exportFinanceAllCount?areaCode=" +
          this.searchForm.cityCode +
          "&streetCode=" +
          this.searchForm.townCode +
          "&village_code=" +
          this.searchForm.villageCode,
        "_blank",
        ""
      );
    },
},
}
</script>
<style lang='less'>
//@import url(); 引入公共css类

</style>