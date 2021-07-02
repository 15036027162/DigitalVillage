<!--  -->
<template>
  <div class>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="dialogFormVisible = true" v-if="isAuth('base:credit:import')">导入</el-button>
    </div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <!-- <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item> -->

      <!-- <el-form-item label="村级组：">
        <el-select v-model="searchForm.groupCode" placeholder="村级组" clearable filterable>
          <el-option label="--请选择--" value=""></el-option>
          <el-option v-for="item in groupList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <br /> -->

      <el-form-item label="姓名：">
        <el-input v-model="searchForm.name" maxlength="11" clearable placeholder="请输入姓名查询"></el-input>
      </el-form-item>
      <el-form-item label="身份证号：">
        <el-input v-model="searchForm.identity" maxlength="18" clearable placeholder="请输入身份证号查询"></el-input>
      </el-form-item>
      <el-form-item label="银行卡号：">
        <el-input v-model="searchForm.bankCardNum" maxlength="20" clearable placeholder="请输入银行卡号查询"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="tableListData" style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="identity" label="身份证号"></el-table-column>
      <el-table-column prop="bankCardNum" label="银行卡号"></el-table-column>
      <el-table-column prop="creditLevel" label="信用等级"></el-table-column>
      <el-table-column prop="creditMoney" label="拟授信金额"></el-table-column>
    </el-table>
    <el-pagination class="paging" background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" v-if="listMain.totalPage > 0" :page-size="listMain.pageSize" :page-count="listMain.totalPage" :pager-count="7" :current-page.sync="listMain.pageNo" :total="listMain.total"></el-pagination>
    <!-- 编辑 -->
    <!-- 批量导入积分 -->
    <el-dialog title="批量导入评级授信信息" :visible.sync="dialogFormVisible" width="500px" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="导入文件：" prop="picListUrls">
          <el-checkbox v-model="ruleForm.picListUrls" v-show="false">备选项</el-checkbox>
          <el-upload class="upload-demo" action="#" accept=".xls,.xlsx" :auto-upload="false" :before-upload="beforeAvatarUpload" :on-change="changeUpload" :limit="limitUploadNum" :on-exceed="handleExceed" :file-list="fileList">
            <el-button type="primary" size="medium">上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goCancel('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isdisable">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../../components/common/provinces";
import { baseUrl } from "../../../config/env";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    provinces,
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
      searchForm: {
        // areaCode: "",
        // streetCode: "",
        // groupCode: "",
        // villageCode: "",
        identity: "",
        name: "",
        bankCardNum: "",
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      obj: {},
      adminUserInfo: {},
      dialogFormVisible: false,
      groupList: [],
      ruleForm: {
        picListUrls: "",
      },
      fileList: [],
      limitUploadNum: 1,
      limitMaxSize: 2, // 文件大小
      rules: {
        picListUrls: [
          { required: true, message: "请上传文件", trigger: "change" },
        ],
      },
      deptLevel: "",
      isReset: false,
      isdisable: false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
    this.searchForm.areaCode = this.adminUserInfo.areaCode;
    // if (this.deptLevel == 4) {
    //   this.searchForm.streetCode = this.adminUserInfo.streetCode;
    // } else if (this.deptLevel == 5) {
    //   this.searchForm.streetCode = this.adminUserInfo.streetCode;
    //   this.searchForm.villageCode = this.adminUserInfo.villageCode;
    // }

    //this.groupByVillages();
    this.searchForm1 = this.searchForm;
    this.obj = this.searchForm1;
    this.getListData();
  },
  //方法集合
  methods: {
    //上传文件状态改变
    changeUpload(file, fileList) {
     
      const isIMAGE =
        file.raw.type === "application/vnd.ms-excel" ||
        file.raw.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize;
      if (!isIMAGE) {
        this.$message.warning("上传文件只能是xlsx,xls格式!");
        // return false;
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传文件大小不能超过 " + this.limitMaxSize + "MB!"
        );
        // return false;
      }
      if (isIMAGE && isLt4M) {
        this.fileURL = file.raw;
        this.fileList = fileList;
        this.ruleForm.picListUrls = fileList.length;
      } else {
        this.fileList = [];
      }
      console.log(this.fileList)
        console.log(fileList)
    },
    // 文件上传检测
    beforeAvatarUpload(file) {
      console.log("111");
      return;
      console.log(file);
      console.log("1");
      const isIMAGE =
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize;
      if (!isIMAGE) {
        this.$message.warning("上传文件只能是xlsx,xls格式!");
        return false;
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传文件大小不能超过 " + this.limitMaxSize + "MB!"
        );
        return false;
      }

      return isIMAGE && isLt4M;
    },
    handleExceed(files, fileList) {
      const realNum = fileList.length || 0;
      console.log(realNum);
      if (realNum >= this.limitUploadNum) {
        this.$message.warning("最多只能上传" + this.limitUploadNum + "个文件!");
      }
    },
    //   beforeUpload(file) {
    //   console.log(file);
    //   const isIMAGE =
    //     file.type === "application/vnd.ms-excel" ||
    //     file.type ===
    //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    //     file.type === "text/plain" ||
    //     file.type === "";
    //   const isLt4M = file.size / 1024 / 1024 < 10;

    //   if (!isIMAGE) {
    //     this.$message.warning("上传文件只能是txt、xlsx、xls、csv、et格式!");
    //   }
    //   if (!isLt4M) {
    //     this.$message.warning("上传文件大小不能超过10MB!");
    //   }
    //   if (isIMAGE && isLt4M) {
    //     this.fileURL = file;
    //     this.ruleForm.picListUrls=1;
    //   }
    //   return isIMAGE && isLt4M;
    // },
    handleClose() {
      this.ruleForm = {
        picListUrls: "",
      };
      this.fileList = [];
      if (this.dialogFormVisible) {
        this.$refs["ruleForm"].resetFields();
        this.dialogFormVisible = false;
      }
    },
    //取消
    goCancel(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
      this.fileList = [];
      this.ruleForm.picListUrls = "";
    },
    //确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this;
          this.isdisable = true;
          var data = new FormData();
          data.append("file", this.fileURL);

          var request = new XMLHttpRequest();
          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              try {
                var resp = JSON.parse(request.response); //判断结果
                console.log(resp);
                _this.isdisable = false;
                if (resp.code == "0") {
                  _this.$message({
                    type: "success",
                    message: resp.msg,
                  });
                  _this.dialogFormVisible = false;
                  _this.ruleForm.picListUrls = "";
                  _this.fileList = [];
                  // if (resp.data.length > 0) {
                  //   _this.gqfhlist = resp.data;
                  // }
                  _this.pageIndex = 1;
                  _this.getListData();
                } else {
                  _this.$message({
                    type: "error",
                    message: resp.msg,
                  });
                }
              } catch (e) {
                var resp = {
                  status: "error",
                  data: "Unknown error occurred: [" + request.message + "]",
                };
              }
            }
          };

          request.open("POST", baseUrl + "integratemall/v1/w/credit/upload");
          request.send(data);
        } else {
          this.$message.warning("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    //重置
    resetForm() {
      if (this.deptLevel == 3) {
        this.searchForm = {
          // areaCode: this.searchForm.areaCode,
          // streetCode: "",
          // groupCode: "",
          // villageCode: "",
          identity: "",
          name: "",
          bankCardNum: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          // areaCode: this.searchForm.areaCode,
          // streetCode: this.searchForm.streetCode,
          // groupCode: "",
          // villageCode: "",
          identity: "",
          name: "",
          bankCardNum: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          // groupCode: "",
          //   areaCode: this.searchForm.areaCode,
          // streetCode: this.searchForm.streetCode,
          // villageCode: this.searchForm.villageCode,
          identity: "",
          name: "",
          bankCardNum: "",
        };
      }

      this.searchForm1 = this.searchForm;
      this.obj = this.searchForm1;
      this.isReset = true;
      this.listMain.pageNo = 1;
      this.getListData();
    },
    //格式化手机号
    formatter4(row) {
      var reg = /^(\d{3})\d*(\d{4})$/;
      if (row.mobile) {
        return row.mobile.replace(reg, "$1****$2");
      }
    },
    formatter(row) {
      var reg = /^(\d{4})\d*(\d{2})$/;
      return row.identity.replace(reg, "$1************$2");
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
    handleDelete(item, type) {
      if (type == 1) {
        this.$alert(
          "禁用该用户不可继续使用积分app，您确定要禁用么？",
          "禁用成员操作",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then((_) => {
            this.goDelete(item, type);
          })
          .catch((_) => {});
      } else {
        this.$alert("确定要启用" + item.account + "用户么？", "启用成员操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.goDelete(item, type);
          })
          .catch((_) => {});
      }
    },

    async goDelete(item, type) {
      const res = await this.$http.editMember({
        editMemberId: item.memberId,
        isEnable: type,
      });
      if (res.code === "0") {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: res.msg,
          });
          this.getListData();
        }, 1000);
      } else {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: res.msg,
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
        startPage: this.listMain.pageNo,
        pageSize: this.listMain.pageSize,
        // memberId: this.adminUserInfo.memberId
      };
      const res = await this.$http.getCreditList({
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

    changeTown(val) {
      this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      if (val.villageCode) {
        this.searchForm.villageCode = val.villageCode;
        // this.groupByVillages();
      } else {
        this.searchForm.villageCode = "";
        //this.groupByVillages();
      }
    },
    lookView(item) {
      this.$router.push({
        name: "userViews",
        query: {
          editMemberId: item.memberId,
        },
      });
    },
    addVillager(item, type) {
      if (type == 1) {
        //添加
        this.$router.push({
          name: "addVillager",
          query: {
            type: 0,
          },
        });
      } else if (type == 2) {
        //编辑
        this.$router.push({
          name: "addVillager",
          query: {
            memberId: item.memberId,
            type: 1,
          },
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
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
