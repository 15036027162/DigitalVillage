<template>
  <div class="addVillager">
    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="120px">
      <div class="userHeader">村民个人信息</div>
      <div class="floatLeft">
        <el-form-item label="姓名：" prop="name" class="formItems">
          <el-input
            v-model="editForm.name"
            placeholder="姓名"
            @input="autoGenerateUser"
            minlength="0"
            maxlength="10"
            :disabled="memberId!=''"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户名：" prop="account" class="formItems">
          <el-input v-model="editForm.account" placeholder disabled></el-input>
        </el-form-item>
      </div>
      <div class="floatLeft">
        <el-form-item label="性别：" prop="ssex" class="formItems">
          <el-radio-group v-model="editForm.ssex" :disabled="memberId!=''">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="民族：" prop="national" class="formItems">
          <el-select v-model="editForm.national" placeholder="请选择" value :disabled="memberId!=''" clearable filterable>
           <el-option
            label="--请选择--"
            value=""
          ></el-option>
            <el-option
              v-for="item in nationList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="floatLeft">
        <el-form-item label="身份证号：" prop="identity" class="formItems">
          <el-input
            v-model="editForm.identity"
            placeholder="身份证号"
            :disabled="memberId!=''"
            minlength="0"
            maxlength="18"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="linkMobile" class="formItems">
          <el-input
            v-model.trim="editForm.linkMobile"
            placeholder="联系电话"
            minlength="0"
            maxlength="11"
          ></el-input>
        </el-form-item>
      </div>
      <div class="floatLeft">
        <el-form-item label="婚姻状况：" prop="marriage" class="formItems">
          <el-select v-model="editForm.marriage" placeholder="请选择" value clearable>
            <el-option
            label="--请选择--"
            value=""
          ></el-option>
            <el-option
              v-for="item in marriageList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文化程度：" prop="eduBackground" class="formItems">
          <el-select v-model="editForm.eduBackground" placeholder="请选择" value clearable >
            <el-option
            label="--请选择--"
            value=""
          ></el-option>
            <el-option
              v-for="item in eduList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="floatLeft">
        <el-form-item label="政治面貌：" class="formItems" prop="politicsFace">
          <el-select v-model="editForm.politicsFace" placeholder="请选择" value clearable>
            <el-option
            label="--请选择--"
            value=""
          ></el-option>
            <el-option
              v-for="item in politicsFaceList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="与户主关系：" prop="isHousehold" class="formItems">
          <el-select v-model="editForm.isHousehold" placeholder="请选择" value clearable>
            <el-option
            label="--请选择--"
            value=""
          ></el-option>
            <el-option
              v-for="item in relationshipList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="floatLefts">
        <el-form-item label="户籍地址：" prop="address" class="formItems">
          <el-input v-model="editForm.fixedAddress" placeholder="户籍地址" minlength="0" maxlength="60"></el-input>
        </el-form-item>
      </div>

      <div class="userHeader">村民居住信息</div>
      <div class>
        <!-- is-required -->

        <el-form-item label="区域选择：" class="provincess" prop="" required>
          <!-- <el-input v-show="false" type="text" v-model="editForm.villageCode" placeholder></el-input> -->
          <provinces
            @changeTown="changeTown"
            :provinces="provincesobj"
            v-if="memberId&&isprovincesobj"
          ></provinces>
          <provinces @changeTown="changeTown" :isadd="provincesobj1" v-if="!memberId"></provinces>
          <div class="el-form-item__error" v-if="iscode">请选择到村</div>
        </el-form-item>
      </div>
      <div class="floatLeft">
        <el-form-item label="选择组：" prop="groupCode" class="formItems">
          <el-select v-model="editForm.groupCode" placeholder="请选择" @change="changename" clearable filterable>
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

        <el-form-item label="门牌号：" prop="doorNum" class="formItems">
          <el-select v-model="editForm.doorNum" placeholder="请选择门牌号" clearable filterable >
            <el-option
            label="--请选择--"
            value=""
          ></el-option>
            <el-option
              v-for="item in doorNumList"
              :key="item.doorNum"
              :label="item.houseNumber"
              :value="item.doorNum"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button @click="onSaveConfirm('editForm')" type="primary" v-if="!memberId">确定添加</el-button>
        <el-button @click="onSaveConfirm('editForm')" type="primary" v-else>保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import provinces from "../../../components/common/provinces1";
import {
  validateIdCardNoSecond,
  validatePhone
} from "../../../config/validate";
import moment from "moment";
export default {
  components: {
    provinces
  },
  data() {
    // var validateChineseCharacter = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请填写姓名(限10个汉字以内)"));
    //   } else {
    //     // !/^[\u0391-\uFFE5A-Za-z]+$/
    //     if (!/^[\u0391-\uFFE5]+$/.test(value)) {
    //       callback(new Error("请填写姓名(限10个汉字以内)"));
    //     } else {
    //       callback();
    //     }
    //   }
    // };
    return {
      departId: "",
      adminUserInfo: {},
      provincesobj: {},
      provincesobj1: true,
      isprovincesobj: false,
      showListLoading: true,
      iscode: false,
      editForm: {
        linkMobile: "",
        name: "",
        national: "汉族", //民族
        account: "",
        marriage: "", //婚姻状况
        groupName: "", //组name
        groupCode: "", //组code
        doorNum: "", //门牌号
        isHousehold: "", //与户主的关系
        identity: "",
        ssex: 1,
        politicsFace: "",
        eduBackground: "",
        fixedAddress: "",
        proCode: "",
        proName: "",
        cityCode: "",
        cityName: "",
        areaCode: "",
        areaName: "",
        streetCode: "",
        streetName: "",
        villageCode: "",
        villageName: ""
        // province: "" //区划
      },
      cityList: [], // 市县列表
      townList: [], // 镇列表
      villageList: [], // 村列表
      disableSelectCity: false, // 可选市
      disableSelectTown: false, // 可选镇
      disableSelectVillage: false, // 可选村
      pickerOptionsLimit: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      groupList: [],
      doorNumList: [],
      editRules: {
        villageCode: [
          {
            required: true,
            message: "请选择区划",
            trigger: "blur",
            type: "string"
          }
        ],
        linkMobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
            type: "string"
          },
          { validator: validatePhone, trigger: "blur" }
        ],
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
            type: "string"
          }
          // {
          //   required: true,
          //   validator: validateChineseCharacter,
          //   trigger: "blur"
          // },
          // {
          //   required: true,
          //   message: "请填写姓名(限10个汉字以内)",
          //   trigger: "blur"
          // },
          // {
          //   min: 1,
          //   max: 10,
          //   message: "请填写姓名(限10个汉字以内)",
          //   trigger: "blur"
          // }
        ],
        account: [
          { required: false, message: "请填写用户名", trigger: "blur" }
        ],
        position: [
          { required: true, message: "请填写职务", trigger: "blur" },
          { min: 1, max: 10, message: "限10个字符", trigger: "blur" }
        ],
        identity: [
          {
            required: true,
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
        doorNum: [
          {
            required: false,
            message: "请选择门牌号",
            trigger: "change"
          }
        ],
        birth: [
          {
            required: false,
            message: "请选择出生日期",
            trigger: "blur"
          }
        ],
        ssex: [{ required: true, message: "请选择性别", trigger: "change" }],
        politicsFace: [
          { required: false, message: "请选择政治面貌", trigger: "change" }
        ],

        eduBackground: [
          {
            required: false,
            message: "请选择学历",
            trigger: "change"
          }
        ],
        national: [
          {
            required: true,
            message: "请选择民族",
            trigger: "change"
          }
        ],
        isHousehold: [
          {
            required: true,
            message: "请选择与户主关系",
            trigger: "change"
          }
        ],
        marriage: [
          {
            required: false,
            message: "请选择婚姻状况",
            trigger: "change"
          }
        ],
        
        groupCode: [
          {
            required: false,
            message: "请选择组",
            trigger: "change"
          }
        ],
        //cityCode: [{required: true, message: '请选择县级组织', trigger: 'change'},],
        //townCode: [{required: true, message: '请选择镇级组织', trigger: 'change'},],
        //villageCode: [{required: true, message: '请选择村级组织', trigger: 'change'},],
        fixedAddress: [
          { required: false, message: "请填写详细地址", trigger: "blur" },
          { min: 1, max: 60, message: "限60个字符", trigger: "blur" }
        ]
      },
      nationList: [
        {
          name: "汉族",
          code: "汉族"
        },
        {
          name: "壮族",
          code: "壮族"
        },
        {
          name: "满族",
          code: "满族"
        },
        {
          name: "回族",
          code: "回族"
        },
        {
          name: "苗族",
          code: "苗族"
        },
        {
          name: "蒙古族",
          code: "蒙古族"
        },
        {
          name: "维吾尔族",
          code: "维吾尔族"
        },
        {
          name: "彝族",
          code: "彝族"
        },
        {
          name: "土家族",
          code: "土家族"
        },
        {
          name: "藏族",
          code: "藏族"
        },
        {
          name: "傣族",
          code: "傣族"
        },
        {
          name: "僳僳族",
          code: "僳僳族"
        },
        {
          name: "朝鲜族",
          code: "朝鲜族"
        },
        {
          name: "高山族",
          code: "高山族"
        },
        {
          name: "纳西族",
          code: "纳西族"
        },
        {
          name: "布朗族",
          code: "布朗族"
        },
        {
          name: "阿昌族",
          code: "阿昌族"
        },
        {
          name: "怒族",
          code: "怒族"
        },
        {
          name: "鄂温克族",
          code: "鄂温克族"
        },
        {
          name: "鄂伦春族",
          code: "鄂伦春族"
        },
        {
          name: "赫哲族",
          code: "赫哲族"
        },
        {
          name: "门巴族",
          code: "门巴族"
        },
        {
          name: "白族",
          code: "白族"
        },
        {
          name: "保安族",
          code: "保安族"
        },
        {
          name: "布依族",
          code: "布依族"
        },
        {
          name: "达斡尔族",
          code: "达斡尔族"
        },
        {
          name: "德昂族",
          code: "德昂族"
        },
        {
          name: "东乡族",
          code: "东乡族"
        },
        {
          name: "侗族",
          code: "侗族"
        },
        {
          name: "独龙族",
          code: "独龙族"
        },
        {
          name: "俄罗斯族",
          code: "俄罗斯族"
        },
        {
          name: "哈尼族",
          code: "哈尼族"
        },
        {
          name: "哈萨克族",
          code: "哈萨克族"
        },
        {
          name: "基诺族",
          code: "基诺族"
        },
        {
          name: "京族",
          code: "京族"
        },
        {
          name: "景颇族",
          code: "景颇族"
        },
        {
          name: "柯尔克孜族",
          code: "柯尔克孜族"
        },
        {
          name: "拉祜族",
          code: "拉祜族"
        },
        {
          name: "黎族",
          code: "黎族"
        },
        {
          name: "畲族",
          code: "畲族"
        },
        {
          name: "珞巴族",
          code: "珞巴族"
        },
        {
          name: "毛南族",
          code: "毛南族"
        },
        {
          name: "仫佬族",
          code: "仫佬族"
        },
        {
          name: "普米族",
          code: "普米族"
        },
        {
          name: "羌族",
          code: "羌族"
        },
        {
          name: "撒拉族",
          code: "撒拉族"
        },
        {
          name: "水族",
          code: "水族"
        },
        {
          name: "塔吉克族",
          code: "塔吉克族"
        },
        {
          name: "塔塔尔族",
          code: "塔塔尔族"
        },
        {
          name: "仡佬族",
          code: "仡佬族"
        },
        {
          name: "土族",
          code: "土族"
        },
        {
          name: "佤族",
          code: "佤族"
        },
        {
          name: "乌孜别克族",
          code: "乌孜别克族"
        },
        {
          name: "锡伯族",
          code: "锡伯族"
        },
        {
          name: "瑶族",
          code: "瑶族"
        },
        {
          name: "裕固族",
          code: "裕固族"
        }
      ],
      relationshipList: [
        {
          name: "户主",
          code: 1
        },
        {
          name: "配偶",
          code: 2
        },
        {
          name: "子女",
          code: 3
        },
        {
          name: "父母",
          code: 4
        },
        {
          name: "孙子孙女",
          code: 5
        },
        {
          name: "祖父母",
          code: 6
        },
        {
          name: "兄弟姐妹",
          code: 7
        },
        {
          name: "女婿儿媳",
          code: 8
        },
        {
          name: "其他",
          code: 9
        }
      ],
      marriageList: [
        {
          name: "已婚",
          code: 1
        },
        {
          name: "未婚",
          code: 2
        },
        {
          name: "离异",
          code: 3
        },
        {
          name: "离异后与前任住在一起",
          code: 4
        },
        {
          name: "丧偶",
          code: 5
        },
        {
          name: "其他",
          code: 6
        }
      ],
      genderList: [
        {
          name: "男",
          code: "1",
          disabled: false
        },
        {
          name: "女",
          code: "0",
          disabled: false
        }
      ],
      eduList: [
        {
          name: "小学及小学以下",
          code: 1,
          disabled: false
        },
        {
          name: "初中",
          code: 2,
          disabled: false
        },
        {
          name: "中专或技校",
          code: 3,
          disabled: false
        },
        {
          name: "高中",
          code: 4,
          disabled: false
        },
        {
          name: "大学专科",
          code: 5,
          disabled: false
        },
        {
          name: "本科",
          code: 6,
          disabled: false
        },
        {
          name: "研究生",
          code: 7,
          disabled: false
        },
        {
          name: "博士及以上",
          code: 8,
          disabled: false
        },
        {
          name: "其他",
          code: 9,
          disabled: false
        }
      ],
      politicsFaceList: [
        {
          name: "党员",
          code: "1",
          disabled: false
        },
        {
          name: "预备党员",
          code: "4",
          disabled: false
        },
        {
          name: "群众",
          code: "2",
          disabled: false
        },
        {
          name: "积极分子",
          code: "3",
          disabled: false
        }
      ],
      checkMobileTxt: "",
      adress1: "",
      isdisable: false,
      memberId: "",
      deptLevel:''
    };
  },
 watch: {
    'editForm.villageCode'(val) {
      if (val) {
        this.iscode = false;
      } else {
        this.iscode = true;
      }
    }
  },
   created() {
    // let _this = this;
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
    this.editForm.proCode = this.adminUserInfo.proCode;
    this.editForm.proName = this.adminUserInfo.proName;
    this.editForm.cityCode = this.adminUserInfo.cityCode;
    this.editForm.cityName = this.adminUserInfo.cityName;
    this.deptLevel = this.adminUserInfo.deptLevel;
   if (!this.$route.query.memberId) {
    if (this.deptLevel == 3) {
      this.editForm.areaCode = this.adminUserInfo.areaCode;
      this.editForm.areaName = this.adminUserInfo.areaName;
    } else if (this.deptLevel == 4) {
      this.editForm.areaCode = this.adminUserInfo.areaCode;
      this.editForm.areaName = this.adminUserInfo.areaName;
      this.editForm.streetCode = this.adminUserInfo.streetCode;
      this.editForm.streetName = this.adminUserInfo.streetName;
    } else if (this.deptLevel == 5) {
      this.editForm.areaCode = this.adminUserInfo.areaCode;
      this.editForm.areaName = this.adminUserInfo.areaName;
      this.editForm.streetCode = this.adminUserInfo.streetCode;
      this.editForm.streetName = this.adminUserInfo.streetName;
      this.editForm.villageCode = this.adminUserInfo.villageCode;
      this.editForm.villageName = this.adminUserInfo.villageName;
       //选择组
    this.groupByVillages();
    }
   }

    if (this.$route.query.memberId) {
      this.memberId = this.$route.query.memberId;
      this.memberDetails();

      this.$route.meta.title = "编辑村民";
    } else {
      this.$route.meta.title = "添加村民";
    }

  
  },

  methods: {
    changeTown(val) {
      if (val.areaCode) {
        this.editForm.areaCode = val.cityCode;
        this.editForm.areaName = val.cityName;
      }
      if (val.townCode) {
        this.editForm.streetCode = val.townCode;
        this.editForm.streetName = val.townName;
      }
      if (val.villageCode) {
        this.editForm.villageCode = val.villageCode;
        this.editForm.villageName = val.villageName;
        //选择组
        this.groupByVillages();
      }
    },

    // 保存
    async onSaveConfirm(formName) {
      let _this = this;
      // if (!this.editForm.villageCode) {
      //   _this.$message({
      //     type: "warning",
      //     message: "请修改表单提示区域内容后重新提交！"
      //   });
      //   this.iscode = true;
      // } else {
      //   this.iscode = false;
      // }

      _this.$refs[formName].validate(async valid => {
        if (valid) {
            if (!this.editForm.villageCode) {
        _this.$message({
          type: "warning",
          message: "请修改表单提示区域内容后重新提交！"
        });
        this.iscode = true;
        return false;
      } else {
        this.iscode = false;
      }
          // 新增
          // const addDataObj = {
          //   loginMemberId: _this.adminUserInfo.memberId || "",
          //   national: _this.editForm.nation,
          //   account: _this.editForm.account,
          //   name: _this.editForm.name,
          //   identity: _this.editForm.identity,
          //   ssex: _this.editForm.ssex,
          //   marriage: _this.editForm.marriage,
          //   isHousehold: _this.editForm.isHousehold,
          //   linkMobile: _this.editForm.linkMobile,
          //   proCode: _this.editForm.proCode,
          //   cityCode: _this.editForm.cityCode,
          //   areaCode: _this.editForm.areaCode,
          //   streetCode: _this.editForm.streetCode,
          //   villageCode: _this.adminUserInfo.villageCode,
          //   proName: this.editForm.proName,
          //   cityName: this.editForm.cityName,
          //   areaName: this.editForm.areaName,
          //   streetName: this.editForm.streetName,
          //   villageName: this.editForm.villageName,
          //   groupName: this.editForm.group,
          //   eduBackground: this.editForm.edu,
          //   fixedAddress: this.editForm.address,
          //   politicsFace: this.editForm.politicsFace
          // };
          //updateMember
          var obj = {};
          let res;
          // return;
          if (!this.memberId) {
            res = await this.$http.saveMember({
              ...this.editForm,
              type: "2",
              loginMemberId: this.adminUserInfo.memberId
            });
          } else {
            res = await this.$http.updateMember({
              type: "2",
              loginMemberId: this.adminUserInfo.memberId,
              memberId: this.memberId,
              doorNum: this.editForm.doorNum,
              marriage: this.editForm.marriage,
              isHousehold: this.editForm.isHousehold,
              linkMobile: this.editForm.linkMobile,
              eduBackground: this.editForm.eduBackground || "",
              fixedAddress: this.editForm.fixedAddress,
              politicsFace: this.editForm.politicsFace,
              groupName: this.editForm.groupName,
              groupCode: this.editForm.groupCode,
              proCode: this.editForm.proCode,
              cityCode: this.editForm.cityCode,
              areaCode: this.editForm.areaCode,
              streetCode: this.editForm.streetCode,
              villageCode: this.editForm.villageCode,
              proName: this.editForm.proName,
              cityName: this.editForm.cityName,
              areaName: this.editForm.areaName,
              streetName: this.editForm.streetName,
              villageName: this.editForm.villageName
            });
          }

          if (res.status === "success") {
            _this.$message({
              type: "success",
              message: res.msg
            });

            setTimeout(() => {
              _this.$router.go(-1);
            }, 1000);
          } else {
            _this.$message({
              type: "error",
              message: res.msg
            });
          }
        } else {
          _this.$message({
            type: "warning",
            message: "请修改表单提示区域内容后重新提交！"
          });
        }
      });
    },
    // 获取xiangq
    async memberDetails() {
      const res = await this.$http.memberDetails({
        loginMemberId: this.adminUserInfo.memberId || "",
        memberId: this.memberId
      });
      if (res.status === "success") {
        var data = res.data;

        this.provincesobj = {
          areaCode: data.areaCode,
          areaName: data.areaName,
          streetCode: data.streetCode,
          villageCode: data.villageCode,
          streetName: data.streetName,
          villageName: data.villageName
        };
        this.isprovincesobj = true;
        this.editForm = res.data;
    
       
         this.editForm.marriage = res.data.marriage==0?'':res.data.marriage;
          this.editForm.eduBackground = res.data.eduBackground==0?'':res.data.eduBackground;
          //选择组
        this.groupByVillages();
        this.getHouseNumberByGroupCode();
        //  sessionAreaCode = this.provinces.cityCode;
        // sessionAreaName = this.provinces.cityName;
        // sessionTownCode = this.provinces.townCode;
        // sessionVillageCode = this.provinces.villageCode;
      } else {
        this.editForm.account = "";
      }
    },
    // 获取用户名
    async autoGenerateUser() {
      const res = await this.$http.autoGenerateUser({
        memberId: this.adminUserInfo.memberId || "",
        realName: this.editForm.name
      });
      if (res.status === "success") {
        this.editForm.account = res.data.user;
      } else {
        this.editForm.account = "";
      }
    },
    // 获取组
    async groupByVillages() {
      const res = await this.$http.groupByVillage({
        villageCode: this.editForm.villageCode || ""
      });
      if (res.status === "success") {
        this.groupList = res.data;
      } else {
      }
    },

    // 获取门牌号
    async getHouseNumberByGroupCode() {
      const res = await this.$http.getHouseNumberByGroupCode({
        groupCode: this.editForm.groupCode || ""
      });
      if (res.status === "success") {
        this.doorNumList = res.data;
      } else {
      }
    },
    changename(val) {
      var index = this.groupList.findIndex(ele => {
        return ele.code == val;
      });
      this.editForm.groupName = this.groupList[index].name;
      this.getHouseNumberByGroupCode();
      this.editForm.doorNum = "";
    },
    // 返回
    toBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" >
.addVillager {
  // width: 80%;
  // input{
  //   max-width: 600px;
  //      min-width: 200px;
  // }
  // .el-input {
  //   min-width: 200px;
  //   max-width: 300px;
  // }
  .hj {
    min-width: auto;
    max-width: auto;
  }
  .el-select {
    // display:block;
    // min-width: 200px;
    // max-width: 300px;
    // width: 100%;
    //   max-width: 600px;
    display: block;
    .el-input {
      min-width: auto;
      max-width: auto;
    }
  }
}
</style>


