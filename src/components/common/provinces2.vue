<!--  -->
<template>
  <!-- 搜索S -->
  <div class="formItem">
    <!-- <el-form-item label="选择地区："> -->
    <div class="formItem">
      <!-- <span class="formItemLabel">选择地区：</span> -->
      <el-select
        v-model="searchForm.cityCode"
        placeholder="--请选择县--"
        filterable
        :disabled="disableSelectCity"
      >
        <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <!-- </el-form-item> -->
    <!-- <el-form-item label> -->
    <div class="formItem">
      <el-select
        v-model="searchForm.townCode"
        placeholder="--请选择镇--"
        @change="changeTown"
        filterable
        :disabled="disableSelectTown"
      >
        <el-option v-for="item in townList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <!-- </el-form-item> -->
    <!-- <el-form-item label> -->
    <div class="formItem">
      <el-select
        v-model="searchForm.villageCode"
        placeholder="--请选择村--"
        @change="changeVillage"
        filterable
        :disabled="disableSelectVillage"
      >
        <el-option
          v-for="item in villageList"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        ></el-option>
      </el-select>
    </div>
    <!-- </el-form-item> -->
  </div>
  <!-- 搜索E -->
</template>

<script>
export default {
  //import引入的组件需要注入到对象中才能使用
  props: {
    provinces: {
      type: Object
    },
    disableselect: {
      type: Boolean
    }
  },
  data() {
    //这里存放数据
    return {
      searchForm: {
        cityCode: "", // 县
        townCode: "", // 镇
        villageCode: "" // 村
      }, // 搜索
      cityList: [], // 市县列表
      townList: [], // 镇列表
      villageList: [], // 村列表
      disableSelectCity: true, // 可选市
      disableSelectTown: this.disableselect, // 可选镇
      disableSelectVillage: this.disableselect // 可选村
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  mounted() {
    if(this.provinces){
      this.getAreaListData();
    }
  },
  //方法集合
  methods: {
    // 获取县镇村列表数据及相关处理
    async getAreaListData() {
      let _this = this;
      let sessionAreaCode = _this.provinces.areaCode;
      let sessionAreaName = _this.provinces.areaName;
      let sessionTownCode = _this.provinces.streetCode;
      let sessionVillageCode = _this.provinces.villageCode;
      // 列表数据处理
      if (sessionAreaCode.length > 0) {
        // 取县列表
        _this.searchForm.cityCode = sessionAreaCode;
        _this.cityList.unshift({
          code: sessionAreaCode,
          name: sessionAreaName
        });

        // 取镇列表
        await _this.getTownList(sessionAreaCode);
        await _this.getVillageList(sessionTownCode);
        // // 表单赋值
        _this.searchForm.townCode = sessionTownCode;
        _this.searchForm.villageCode = sessionVillageCode;
      }
    },
    // 获取镇列表
    async getTownList(areaCode) {
      if (areaCode.length > 0) {
        const res = await this.$http.getStreetByArea({
          areaCode: areaCode
        });
        if (res.status === "success") {
          res.data.unshift({
            code: "",
            name: "--请选择--"
          });
          this.townList = res.data || [];
        }
      } else {
        this.townList = [];
      }
    },
    // 获取村列表
    async getVillageList(streetCode) {
      if (streetCode.length > 0) {
        const res = await this.$http.getVillageByStreet({
          streetCode: streetCode
        });
        if (res.status === "success") {
          res.data.unshift({
            code: "",
            name: "--请选择--"
          });

          this.villageList = res.data || [];
        }
      } else {
        this.villageList = [];
      }
    },
    // 切换镇
    changeTown(val) {
      const _this = this;
      const townCode = _this.searchForm.townCode || "";
      //_this.searchForm.townCode = townCode;
      _this.searchForm.villageCode = "";
      _this.getVillageList(townCode, true);
      this.$emit("changeTown", this.searchForm);
    },
    //切换村
    changeVillage(val) {
      this.$emit("changeTown", this.searchForm);
    }
  },
  watch: {
    provinces() {
      return this.provinces;
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>