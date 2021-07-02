<template>
  <div class="addgoods">
    <div class="rightBtn">
      <!-- <el-button type="text" @click="handleView(1,1)">保存</el-button>
            <el-button type="text" @click="handleView(1,1)">发布</el-button> -->
    </div>

    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
      <el-form-item label="区域选择：" required v-if="!id">
        <provinces @changeTown="changeTown" :isadd="true"></provinces>
        <br />
        <div v-if="showVill" style="color: #F56C6C;font-size: 12px">请选择到村</div>
      </el-form-item>
      <el-form-item label="区域选择：" required v-if="id && provinces">
        <provinces :provinces="provinces" :disableselect="true" :isadd="false"></provinces>
      </el-form-item>
      <div class="proInput">
        <el-form-item label="商品名称：" prop="goodsName">
          <el-input v-model="editForm.goodsName" placeholder="请输入10字以内的商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格：" prop="price">
          <el-input v-model="editForm.price" placeholder="请输入商品价格" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="商品数量：" prop="stock">
          <el-input v-model="editForm.stock" placeholder="请输入商品数量" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="兑换值：" prop="changePoint">
          <el-input v-model="editForm.changePoint" placeholder="请输入兑换值" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="商品图片：" class="imgupload" ref="picListRef" prop="picListUrls">
        <el-upload class="editOrAddImgList" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg" :on-remove="handleRemoveImg" :on-success="handleUpLoadImgSuccess" :before-upload="beforeImgUpload" :file-list="fileImgList" :limit="limitUploadNum" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <!-- <div slot="tip" class="el-upload__tip">
                      照片最大{{ limitMaxSize }}MB，支持jpg,jpeg,png,gif格式
                    </div> -->
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="medium" :disabled="isdisable" @click="submitForm('editForm')">提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import provinces from "@/components/common/provinces1";
import { baseUrl } from "../../config/env";
import { validateUploadFileNum } from "../../config/validate";
import moment from "moment";

export default {
  components: { provinces },
  data() {
    var validatecontent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入正文内容(最多8000字)"));
      } else {
        var contents = this.editForm.content;
        contents = this.removeTAG(contents);
        if (contents.length > 8000) {
          callback(new Error("正文内容最多8000字"));
        } else {
          callback();
        }
      }
    };
    return {
      editForm: {
        goodsName: "",
        price: "",
        stock: "",
        changePoint: "",
        picListUrls: "",
      },
      type: 1,
      id: "",
      details: {},
      editRules: {
        goodsName: [
          {
            required: true,
            min: 0,
            max: 10,
            message: "请输入10字以内的商品名称",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        stock: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        changePoint: [
          {
            required: true,
            message: "请输入兑换值",
            trigger: "blur",
          },
        ],
        picListUrls: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
      },
      upLoadApiUrl: baseUrl + "commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
      fileImgList: [], // 图片
      uploadImgData: {
        file: "",
        type: "2",
      },
      removeImgAndFileIds: [], // 删除图片和附件资源ID
      limitUploadNum: 1,
      limitMaxSize: 4, // 文件大小
      fileDataList: [], // 附件
      uploadFileData: {
        file: "",
        type: "3",
      },
      limitFileUploadNum: 6,
      limitFileMaxSize: 50, // 文件大小
      pickerOptionsLimit: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      editorWordLength: 0,
      isdisable: false,
      isPower: false,
      showVill: false,
      role_list: [],
      areaCode: "",
      streetCode: "",
      villageCode: "",
      areaName: "",
      streetName: "",
      villageName: "",
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      provinces: {},
    };
  },
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.role_list = this.adminUserInfo.role_list;
    this.deptLevel = this.adminUserInfo.deptLevel;
    this.areaCode = this.adminUserInfo.areaCode;
    this.areaName = this.adminUserInfo.areaName;
    if (this.deptLevel == 4) {
      this.streetCode = this.adminUserInfo.streetCode;
      this.streetName = this.adminUserInfo.streetName;
    } else if (this.deptLevel == 5) {
      this.streetCode = this.adminUserInfo.streetCode;
      this.streetName = this.adminUserInfo.streetName;
      this.villageCode = this.adminUserInfo.villageCode;
      this.villageName = this.adminUserInfo.villageName;
    }

    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.$route.meta.title = "修改";
      this.getListData();
    } else {
      this.$route.meta.title = "发布";
    }
  },
  mounted() {},
  methods: {
    changeTown(val) {
      let _this = this;
      _this.areaCode = val.cityCode;
      _this.streetCode = val.townCode;
      _this.villageCode = val.villageCode;
      _this.areaName = val.cityName;
      _this.streetName = val.townName;
      _this.villageName = val.villageName;
    },
    //跳转方式
    goway(val) {},
    // 获取列表数据
    async getListData() {
      const res = await this.$http.exGoodsInfo({
        goodsId: this.id || 1,
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.editForm = resData[0];
        this.editForm.picListUrls = 1;
        this.provinces = {
          areaCode: this.editForm.areaCode,
          areaName: this.editForm.areaName,
          streetCode: this.editForm.streetCode,
          streetName: this.editForm.streetName,
          villageCode: this.editForm.villageCode,
          villageName: this.editForm.villageName,
        };
        this.areaCode = this.editForm.areaCode;
        this.streetCode = this.editForm.streetCode;
        this.villageCode = this.editForm.villageCode;
        this.areaName = this.editForm.areaName;
        this.streetName = this.editForm.streetName;
        this.villageName = this.editForm.villageName;

        this.fileImgList = [
          {
            url: resData[0].picUrl,
            name: "1",
          },
        ];
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    //发布
    async submitForm(formName) {
      var fileNum = this.fileImgList.length;
      if (this.villageCode.length <= 0) {
        this.showVill = true;
      }
      if (fileNum > 0) {
        this.$refs.picListRef.clearValidate();
      } else {
        this.$set(this.editRules, "picListUrls", {
          required: true,
          message: "请上传图片片",
          trigger: "change",
          validator: validateUploadFileNum,
        });
        this.$refs["editForm"].validateField("picListUrls");
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.villageCode.length <= 0) {
            this.showVill = true;
          } else {
            this.showVill = false;
            var obj;
            delete this.editForm.picListUrls;
            if (!this.id) {
              obj = {
                type: 1,
                picUrl: this.fileImgList[0].url,
                areaCode: this.areaCode,
                streetCode: this.streetCode,
                villageCode: this.villageCode,
                areaName: this.areaName,
                streetName: this.streetName,
                villageName: this.villageName,
                ...this.editForm,
              };
            } else {
              obj = {
                type: 0,
                goodsId: this.id,
                picUrl: this.fileImgList[0].url,
                ...this.editForm,
              };
            }
            this.isdisable = true;
            const res = await this.$http.saveExGoods(obj);
            if (res.status === "success") {
              this.$message({
                type: "success",
                message: res.msg,
              });
              setTimeout(() => {
                this.$router.go(-1);
                this.isdisable = false;
              }, 1000);
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
              setTimeout(() => {
                this.isdisable = false;
              }, 1000);
            }
          }
        } else {
          /*this.$message({
                          type: "warning",
                          message: "请修改表单提示区域内容后重新提交！"
                        });*/
          return false;
        }
      });
    },
    // 编辑器文字变化
    onEditorChange() {
      // let _this = this;
      // var editorWord = _this.editForm.content || "";
      // _this.editorWordLength = _this.removeTAG(editorWord).length;
    },
    //去除富文本标签
    removeTAG(str) {
      return str.replace(/<[^>]+>/g, "");
    },

    // 文件超出个数限制时的钩子
    handleExceedImg(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitUploadNum) {
        this.$message.warning("最多只能上传" + this.limitUploadNum + "张图片!");
      }
    },
    // 图片上传检测
    beforeImgUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      // const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize;
      // if (!isJPG) {
      //   this.$message.warning("上传图片只能是 jpg/jpeg/png/gif 格式!");
      // }
      // if (!isLt4M) {
      //   this.$message.warning(
      //     "上传单个图片大小不能超过 " + this.limitMaxSize + "MB!"
      //   );
      // }
      // return isJPG && isLt4M;
      return isJPG;
    },

    // 上传图片完成
    handleUpLoadImgSuccess(res, file, fileList) {
      const picStatus = res.status || "error",
        picLink = res.data[0] || "";
      if (picStatus === "success" && picLink.length > 0) {
        this.fileImgList = [
          {
            name: file.name || picLink,
            url: picLink,
          },
        ];

        this.$refs.picListRef.clearValidate();
        // 图片附件数量
        this.editForm.picListUrls = fileList.length || 0;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 删除图片
    async handleRemoveImg(file, fileList) {
      let imgUid = file.uid || 999999;
      let imgLink = file.url || "";
      var index = this.fileImgList.findIndex((item) => {
        if (item.uid === imgUid) {
          return true;
        }
      });

      if (index >= 0 && imgLink.length > 0) {
        // 改变资源
        this.fileImgList.splice(index, 1);

        // 图片附件数量
        var imgArrListRem = this.transformImgToSimpleArr(this.fileImgList);
        let fileDelNum = imgArrListRem.length || 0;
        this.editForm.picListUrls = fileDelNum > 0 ? fileDelNum : "";

        // // 添加验证
        // if (fileDelNum === 0) {
        //   // 添加甲方图片　验证
        //   this.$set(this.editRules, "picListUrls", {
        //     required: true,
        //     message: "请上传图片",
        //     trigger: "change",
        //     validator: validateUploadFileNum
        //   });
        //   this.$refs["editForm"].validateField("picListUrls");
        // }
      }
    },
    // 图片数组转换  繁 =》 简
    transformImgToSimpleArr(arr) {
      const arrLen = arr.length || 0;
      var fileArr = [];
      if (arrLen > 0) {
        for (var i = 0, len = arrLen; i < len; i++) {
          fileArr[i] = arr[i]["url"];
        }
      }
      return fileArr;
    },
    // 图片数组转换  数组对象转数组 (接口数据转换专用)
    transformImgObjToArr(arr) {
      const arrLen = arr.length || 0;
      var newArr = [];
      if (arrLen > 0) {
        for (var i = 0, len = arrLen; i < len; i++) {
          newArr[i] = {
            name: "img_" + i,
            url: arr[i].pic_url || "",
            i: i,
            fileId: arr[i].file_id || i,
          };
        }
      }

      return newArr;
    },
    // 附件数组转换  数组对象转数组 (接口数据转换专用)
    transformFileObjToArr(arr) {
      const arrLen = arr.length || 0;
      var newArr = [];
      if (arrLen > 0) {
        for (var i = 0, len = arrLen; i < len; i++) {
          newArr[i] = {
            name: arr[i].file_name || "",
            url: arr[i].file_url || "",
            i: i,
            fileId: arr[i].file_id || i,
          };
        }
      }

      return newArr;
    },
    // 附件数据处理   编辑、提交时使用
    transformFileToApiArr(arr) {
      const arrLen = arr.length || 0;
      var newArr = [];
      if (arrLen > 0) {
        for (var i = 0, len = arrLen; i < len; i++) {
          newArr[i] = {
            file_name: arr[i].name || "",
            file_url: arr[i].url || "",
          };
        }
      }
      return newArr;
    },
    // 文件超出个数限制时的钩子
    handleExceedFile_QT(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitFileUploadNum) {
        this.$message.warning(
          "最多只能上传" + this.limitFileUploadNum + "个文件!"
        );
      }
    },
    // 附件上传检测
    beforeUploadFile_QT(file) {
      const isJPG =
        file.type === "image/jpg" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "application/pdf";
      const isLt2M = file.size / 1024 / 1024 < this.limitFileMaxSize;

      if (!isJPG) {
        this.$message.warning("上传文件只能上传jpg/jpeg/png/gif/pdf格式!");
      }
      if (!isLt2M) {
        this.$message.warning(
          "上传文件大小不能超过 " + this.limitFileMaxSize + "MB!"
        );
      }
      return isJPG && isLt2M;
    },
    // 上传附件完成
    handleUpLoadFileSuccess_QT(res, file, fileList) {
      const picStatus = res.status || "error",
        picLink = res.data[0] || "";
      if (picStatus === "success" && picLink.length > 0) {
        this.fileDataList.push({
          name: file.name || picLink,
          url: picLink,
        });

        //this.$refs.picListRef.clearValidate();
      }

      // 图片附件数量
      //this.editForm.picListUrls = fileList.length || 0;
    },
    // 删除附件
    async handleRemoveFile_QT(file, fileList) {
      let imgUid = file.uid || 999999;
      let imgLink = file.url || "";
      var index = this.fileDataList.findIndex((item) => {
        if (item.uid === imgUid) {
          return true;
        }
      });

      if (index >= 0 && imgLink.length > 0) {
        // 改变资源
        this.fileDataList.splice(index, 1);
      }
    },

    // 返回
    onBackConfirm() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less">
.addgoods {
  .imgupload {
    position: relative;
  }

  .ts {
    color: #909399;
    position: absolute;
    left: 178px;
    top: 39%;
    transform: translateY(-50%);
  }

  .ts1 {
    color: #909399;
    position: absolute;
    margin-left: 20px;
  }

  .proInput {
    .el-input {
      width: 400px;
    }
  }

  /*.el-input {
          min-width: 400px;
          max-width: 600px;
        }*/
  /*.el-select {*/
  /*  // display:block;*/
  /*  min-width: 400px;*/
  /*  max-width: 600px;*/
  /*  width: 100%;*/
  /*  //   max-width: 600px;*/
  /*  .el-input {*/
  /*    min-width: auto;*/
  /*    max-width: auto;*/
  /*  }*/
  /*}*/

  .margins {
    margin-left: 20px;
  }
}
</style>
