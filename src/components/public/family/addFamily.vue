<template>
  <div class="fixedBg">
    <div class="po-absolute modelMess modelMess1">
      <div
        class="el-icon-close po-absolute iconCLose"
        @click="closeFamily"
      ></div>
      <h1 class="modelTitle">添加家庭户</h1>
      <!--当前手机号-->
      <el-form
        ref="editChangeMobileForm"
        :model="addFamilyForm"
        :rules="familyRules"
        label-width="100px"
      >
        <el-form-item label="门牌号：" prop="houseNumber">
          <el-input
            v-model="addFamilyForm.houseNumber"
            placeholder="请输入5位以内的整数"
            oninput="value=value.replace(/[^\d^\.]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="家庭类型：" prop="households">
          <el-select v-model="addFamilyForm.households" placeholder="请选择">
            <el-option
              v-for="item in doorList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

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
        <el-form-item label="户主名称：" prop="doorName">
          <el-input
            v-model="addFamilyForm.doorName"
            placeholder="请输入户主名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="idcard">
          <el-input
            v-model="addFamilyForm.idcard"
            placeholder="请输入身份证号"
          ></el-input>
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
            >确定添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import provinces from "@/components/common/provinces1";
import {
  // validateIdCardNoSecond,
  validatePhone
} from "../../../config/validate";
export default {
  name: "addFamily",
  components: { provinces },
  data() {
  const  validateIdCardNoSecond = (rule, value, callback) => {
    // if (!value) {
    //     return callback(new Error('身份证不能为空'))
    // }
    if (value&&!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        callback(new Error('请输入正确的身份证号码'))
    } else {
        callback()
    }
};
    return {
      iscun: false,
      provincesobj1: true,
      addFamilyForm: {
        doorName: "",
        households: "",
        address: "",
        houseNumber: "",
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
        idcard:''

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
          code: 5
        },
        {
          name: "独生子女家庭",
          code: 6
        },
        {
          name: "军人家庭",
          code: 7
        },
        {
          name: "集体户口",
          code: 2
        },
        {
          name: "外来常住户口",
          code: 3
        },
        {
          name: "其他",
          code: 4
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
         idcard: [
          {
            required: false,
            min: 18,
            max: 18,
            message: "请输入正确的身份证号码",
            trigger: "blur"
          },
          {
            required: false,
            validator: validateIdCardNoSecond,
            trigger: "blur"
          }
        ],
        doorName: [
          {
            required: false,
            message: "请输入户主姓名",
            trigger: "blur"
          }
        ],

        houseNumber: [
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
      groupList: [],
      villageCode: ""
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
      this.$parent.addGroupModel = false;
      this.addFamilyForm.households = "";
      this.addFamilyForm.houseNumber = "";
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
          // if (!this.addFamilyForm.villageCode) {
          //   this.$message({
          //     type: "wraning",
          //     message: "区域选择选择到村才可以选择组！"
          //   });
          // }

          let data = {
            memberId: this.adminUserInfo.memberId,
            doorType: this.addFamilyForm.households,
            houseNumber: this.addFamilyForm.houseNumber,
            groupCode: this.addFamilyForm.groups,
            groupName: this.addFamilyForm.groupName,
            // doorAddress: this.addFamilyForm.address,
            proCode: this.addFamilyForm.proCode,
            cityCode: this.addFamilyForm.cityCode,
            areaCode: this.addFamilyForm.areaCode,
            streetCode: this.addFamilyForm.streetCode,
            villageCode: this.addFamilyForm.villageCode,
            proName: this.addFamilyForm.proName,
            cityName: this.addFamilyForm.cityName,
            areaName: this.addFamilyForm.areaName,
            streetName: this.addFamilyForm.streetName,
            villageName: this.addFamilyForm.villageName,
            doorName:this.addFamilyForm.doorName,
            idcard:this.addFamilyForm.idcard
          };
          const res = await this.$http.addFamily(data);
          if (res.status === "success") {
            this.$message({
              type: "success",
              message: res.msg || "添加成功"
            });
            this.$refs[formName].resetFields();
            this.$parent.getListData();
            this.$parent.addGroupModel = false;
          }else{
             this.$message({
              type: "success",
              message: res.msg
            });
          }
        } else {
          // this.$message({
          //   type: "warning",
          //   message: "请修改表单提示区域内容后重新提交！"
          // });
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
