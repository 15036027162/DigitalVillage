<template>
  <div class="fixedBg">
    <div class="po-absolute modelMess modelMess1">
      <div
        class="el-icon-close po-absolute iconCLose"
        @click="closeFamily"
      ></div>
      <h1 class="modelTitle">批量下载家庭二维码</h1>
      <!--当前手机号-->
      <el-form
        ref="editChangeMobileForm"
        :model="addFamilyForm"
        :rules="familyRules"
        label-width="100px"
      >
        <el-form-item label="区域选择：" required class="selectitems">
          <provinces
            @changeTown="changeTown"
            :isadd="provincesobj1"
          ></provinces>
          <div class="el-form-item__error" v-show="iscun">请选择到村</div>
        </el-form-item>
        <el-form-item label="所属组：" prop="groups">
          <el-select
            clearable
            filterable
            v-model="addFamilyForm.groups"
            placeholder="请选择"
            @change="changename"
          >
            <el-option label="--请选择--" value=""></el-option>
            <el-option
              v-for="item in groupList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          只支持未激活状态的家庭码下载
        </el-form-item>
        <el-form-item style="text-align: center;position:relative;left: -45px">
          <el-button
            size="medium"
            @click="closeFamily('editChangeMobileForm')"
            style="margin-right: 30px"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="medium"
            @click="submitFamily('editChangeMobileForm')"
            >批量下载</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import provinces from "@/components/common/provinces1";
import {
  validateIdCardNoSecond,
  validatePhone
} from "../../../config/validate";
import { baseUrl } from "../../../config/env";
export default {
  name: "addFamily",
  components: { provinces },
  data() {
    return {
      iscun: false,
      provincesobj1: true,
      addFamilyForm: {
        name: "",
        households: "",
        address: "",
        doornum: "",
        groups: "",
        groupName: "",
        proCode: "",
        proName: "",
        cityCode: "",
        cityName: "",
        areaCode: "",
        areaName: "",
        streetCode: "",
        streetName: "",
        villageCode: "",
        villageName: "",
        identity: ""
      },
      doorList: [
        {
          name: "--请选择--",
          code: ""
        },
        {
          name: "普通家庭",
          code: 1
        },
        {
          name: "贫困户（含已脱贫）",
          code: 2
        },
        {
          name: "独生子女家庭",
          code: 3
        },
        {
          name: "军人家庭",
          code: 4
        },
        {
          name: "集体户口",
          code: 5
        },
        {
          name: "外来常住户口",
          code: 6
        },
        {
          name: "其它",
          code: 7
        }
      ],
      familyRules: {
        groups: [
          {
            required: true,
            message: "请选择组",
            trigger: "change"
          }
        ],
        households: [
          {
            required: true,
            message: "请选择家庭类型",
            trigger: "change"
          }
        ],
        identity: [
          {
            required: false,
            min: 18,
            max: 18,
            message: "请输入18位身份证号码",
            trigger: "blur"
          },
          {
            required: true,
            validator: validateIdCardNoSecond,
            trigger: "blur"
          }
        ],
        name: [
          {
            required: false,
            message: "请输入户主姓名名称",
            trigger: "blur"
          }
        ],

        doornum: [
          {
            required: true,
            message: "请输入5位以内的整数",
            trigger: "blur"
          },
          {
            min: 1,
            max: 5,
            message: "请输入5位以内的整数",
            trigger: "blur"
          }
        ]
      },
      villageCode: "",
      adminUserInfo: "",
      groupList: []
    };
  },
  watch: {
    "addFamilyForm.villageCode"(val) {
      if (val) {
        this.iscun = false;
      } else {
        this.iscun = true;
      }
    }
  },
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.villageCode = this.adminUserInfo.villageCode;
    this.addFamilyForm.proCode = this.adminUserInfo.proCode;
    this.addFamilyForm.proName = this.adminUserInfo.proName;
    this.addFamilyForm.cityCode = this.adminUserInfo.cityCode;
    this.addFamilyForm.cityName = this.adminUserInfo.cityName;

    this.deptLevel = this.adminUserInfo.deptLevel;
    if (this.deptLevel == 3) {
      this.addFamilyForm.areaCode = this.adminUserInfo.areaCode;
      this.addFamilyForm.areaName = this.adminUserInfo.areaName;
    } else if (this.deptLevel == 4) {
      this.addFamilyForm.areaCode = this.adminUserInfo.areaCode;
      this.addFamilyForm.areaName = this.adminUserInfo.areaName;
      this.addFamilyForm.streetCode = this.adminUserInfo.streetCode;
      this.addFamilyForm.streetName = this.adminUserInfo.streetName;
    } else if (this.deptLevel == 5) {
      this.addFamilyForm.areaCode = this.adminUserInfo.areaCode;
      this.addFamilyForm.areaName = this.adminUserInfo.areaName;
      this.addFamilyForm.streetCode = this.adminUserInfo.streetCode;
      this.addFamilyForm.streetName = this.adminUserInfo.streetName;
      this.addFamilyForm.villageCode = this.adminUserInfo.villageCode;
      this.addFamilyForm.villageName = this.adminUserInfo.villageName;
      this.groupByVillages();
    }
  },
  methods: {
    /*改变区域*/
    changeTown(val) {
      if (val.cityCode) {
        this.addFamilyForm.areaCode = val.cityCode;
        this.addFamilyForm.areaName = val.cityName;
      }
      if (val.townCode) {
        this.addFamilyForm.streetCode = val.townCode;
        this.addFamilyForm.streetName = val.townName;
      }
      if (val.villageCode) {
        this.addFamilyForm.villageCode = val.villageCode;
        this.addFamilyForm.villageName = val.villageName;
        //选择组
        this.groupByVillages();
      }
    },

    /*关闭*/
    closeFamily(formName) {
      this.$parent.downloadModel = false;
      this.addFamilyForm.households = "";
      this.addFamilyForm.doornum = "";
      this.addFamilyForm.groups = "";
      this.addFamilyForm.name = "";
      this.addFamilyForm.address = "";
    },
    //查找组名
    changename(val) {
      var index = this.groupList.findIndex(ele => {
        return ele.code == val;
      });
      this.addFamilyForm.groupName = this.groupList[index].name;
    },
    /*确定*/
    async submitFamily(formName) {
      if (!this.addFamilyForm.villageCode) {
        this.iscun = true;
        // this.$message({
        //   type: "wraning",
        //   message: "请选择到村！"
        // });
      }

      this.$refs[formName].validate(async valid => {
        if (valid) {
          var url =
            baseUrl +
            "member/v2/w/member//batchDownCode?areaCode=" +
            this.addFamilyForm.areaCode +
            "&streetCode=" +
            this.addFamilyForm.streetCode +
            "&villageCode=" +
            this.addFamilyForm.villageCode +
            "&villageName=" +
            this.addFamilyForm.villageName +
            "&groupCode=" +
            this.addFamilyForm.groups +
            "&groupName=" +
            this.addFamilyForm.groupName +
            "&NO_SIGN=N";

          window.open(url, "_blank", "");
          this.$refs[formName].resetFields();
          this.$parent.downloadModel = false;
        } else {
          /*this.$message({
            type: "warning",
            message: "请修改表单提示区域内容后重新提交！"
          });*/
          return false;
        }
      });
    },
    // 获取组
    async groupByVillages() {
      const res = await this.$http.groupByVillage({
        villageCode: this.addFamilyForm.villageCode || ""
      });
      if (res.status === "success") {
        this.groupList = res.data;
      } else {
      }
    }
  }
};
</script>

<style lang="less">
.modelMess1 {
  width: 600px;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .el-select {
    display: block;
    position: relative;
  }
  .selectitems .el-select {
    width: 140px;
    display: inline-block;
  }
}
</style>
