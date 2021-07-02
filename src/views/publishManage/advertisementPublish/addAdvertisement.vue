<template>
  <div class="addAdvertisement">
    <div class="rightBtn">
      <!-- <el-button type="text" @click="handleView(1,1)">保存</el-button>
      <el-button type="text" @click="handleView(1,1)">发布</el-button> -->
    </div>

    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
      <el-form-item label="主题名称：" prop="adv_name">
        <el-input v-model="editForm.adv_name" placeholder="请输入20字以内的主题名称"></el-input>
      </el-form-item>
      <el-form-item label="上传图片：" class="imgupload" ref="picListRef" prop="picListUrls">
        <el-upload class="editOrAddImgList" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg" :on-remove="handleRemoveImg" :on-success="handleUpLoadImgSuccess" :before-upload="beforeImgUpload" :file-list="fileImgList" :limit="limitUploadNum" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
            建议尺寸为640*384像素，大小小于
            {{ limitMaxSize }}MB
          </div>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="排序：" prop="sort">
        <el-input v-model="editForm.sort"  placeholder oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
      </el-form-item> -->
      <el-form-item label="跳转方式：" prop="way" class="waydiv">
        <el-select v-model="editForm.way" placeholder="--请选择--">
          <el-option label="--请选择--" value></el-option>
          <el-option label="外部URL" :value="1"></el-option>
          <el-option label="内部链接" :value="2"></el-option>
          <el-option label="不跳转" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="链接：" prop="url" v-if="editForm.way == 1">
        <el-input v-model="editForm.url" placeholder="复制链接粘贴到此处"></el-input>
      </el-form-item>
      <div class="urldiv">
        <el-form-item label="内部链接：" prop="dicId" v-if="editForm.way == 2" class="innerdiv">
          <el-select v-model="editForm.dicId" placeholder="请选择信息分类" @change="goway">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="innerId" v-if="editForm.way == 2" class="innerdiv">
          <el-select v-model="editForm.innerId" placeholder="--请选择--">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in innerList2" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" size="medium" @click="submitForm('editForm')" :disabled="isdisable">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseUrl } from "../../../config/env";
import { validateUploadFileNum } from "../../../config/validate";
import moment from "moment";
export default {
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
        adv_name: "",
        picListUrls: "",
        publishDate: "",
        content: "",
        files: "",
        checked: true,
        way: 1,
        url: "",
        tag: "",
        dateBetween: "",
        sort: "",
        innerId: "",
        dicId: "",
      },
      type: 1,
      id: "",
      details: {},
      editRules: {
        adv_name: [
          {
            required: true,
            min: 0,
            max: 20,
            message: "请输入20字以内的主题名称",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: "请输入url",
            trigger: "blur",
          },
        ],
        sort: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
          },
        ],
        way: [
          {
            required: true,
            message: "请选择跳转方式",
            trigger: "change",
          },
        ],
        picListUrls: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
        innerId: [{ required: true, message: "请选择", trigger: "change" }],
        dicId: [
          { required: true, message: "请选择信息分类", trigger: "change" },
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
      role_list: [],
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      list: [],
      innerList: [],
      innerList2: [],
      deptDistrictsCode:'',
      deptLevel:''
    };
  },
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
    // if (this.deptLevel == 3) {
    //   this.deptDistrictsCode = this.adminUserInfo.areaCode;
    // } 
    // else if (this.deptLevel == 4) {
    //   this.deptDistrictsCode = this.adminUserInfo.streetCode;
 
    // }else if (this.deptLevel == 5) {
    //   this.deptDistrictsCode = this.adminUserInfo.villageCode;
    // }


    this.type = this.$route.query.type;
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.$route.meta.title = "修改";
        this.getList();
    this.getinnerSelectList();
      this.getListData();
    } else {
      this.$route.meta.title = "发布";
        this.getList();
    this.getinnerSelectList();
    }

  },
  mounted() {},
  methods: {
    // 获取列表数据
    async getList() {
      const res = await this.$http.getSelectDictionary({
        type: 1,
      });
      if (res.status === "success") {
        this.list = res.data;
      } else {
      }
    },
    // 获取列表数据
    async getinnerSelectList() {
      const res = await this.$http.innerSelectList({
        villageCode:this.adminUserInfo.villageCode,
      });
      if (res.status === "success") {
        this.innerList = res.data;
      } else {
      }
    },
    //跳转方式
    goway(val) {
      let index = this.innerList.findIndex((ele) => {
        return ele.id == val;
      });
      this.editForm.innerId = "";
      if (index != -1) {
        this.innerList2 = this.innerList[index].list;
      } else {
        this.innerList2 = [];
      }
    },
    // 获取列表数据
    async getListData() {

      const res = await this.$http.advDetail({
        id: this.id || 1,
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData[0];
        this.editForm.adv_name = resData[0].title;
        this.editForm.url = resData[0].url;
        this.editForm.picListUrls = 1;
        this.editForm.way = Number(resData[0].style);
        if (resData[0].innerId) {
          this.editForm.innerId =Number(resData[0].innerId) ;
          for (var i = 0; i < this.innerList.length; i++) {
            for (var j = 0; j < this.innerList[i].list.length; j++) {
              if (resData[0].innerId == this.innerList[i].list[j].id) {
                this.innerList2 = this.innerList[i].list;
                console.log(this.innerList2)
                this.editForm.dicId = this.innerList[i].id;


                break;
              }
            }
          }


        }

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
          var obj;
          if (this.type == 1) {
            obj = {
              type: this.type,
              // member_id: this.adminUserInfo.memberId,
              adv_name: this.editForm.adv_name,
              pic_url: this.fileImgList[0].url,
              url: this.editForm.way == 1 ? this.editForm.url : "",
              // sort: this.editForm.sort,
              style: this.editForm.way,
              innerId: this.editForm.innerId,
            };
          } else {
            obj = {
              type: this.type,
              id: this.id,
              // member_id: this.adminUserInfo.memberId,
              adv_name: this.editForm.adv_name,
              pic_url: this.fileImgList[0].url,
              url: this.editForm.way == 1 ? this.editForm.url : "",
              // sort: this.editForm.sort,
              style: this.editForm.way,
              innerId: this.editForm.innerId,
            };
          }
this.isdisable=true;
          const res = await this.$http.advPublish(obj);
          if (res.status === "success") {
            this.$message({
              type: "success",
              message: res.msg,
            });
            setTimeout(() => {
              this.$router.go(-1);
              this.isdisable=false;
            }, 1000);
          } else {

            this.$message({
              type: "error",
              message: res.msg,
            });
              setTimeout(() => {
              this.isdisable=false;
            }, 1000);
          }

        } else {
          // this.$message({
          //   type: "warning",
          //   message: "请修改表单提示区域内容后重新提交！",
          // });
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
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize;
      if (!isJPG) {
        this.$message.warning("上传图片只能是 jpg/jpeg/png/gif 格式!");
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个图片大小不能超过 " + this.limitMaxSize + "MB!"
        );
      }
      return isJPG && isLt4M;
    },

    // 上传图片完成
    handleUpLoadImgSuccess(res, file, fileList) {
      const picStatus = res.status || "error",
        picLink = res.data[0] || "";
      if (picStatus === "success" && picLink.length > 0) {
        this.fileImgList.push({
          name: file.name || picLink,
          url: picLink,
        });

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

<style  lang="less">
.addAdvertisement {
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
  .el-input {
    min-width: 400px;
    max-width: 600px;
  }
  .waydiv {
    .el-select {
      // display:block;
      min-width: 400px;
      max-width: 600px;
      width: 100%;
      //   max-width: 600px;
      .el-input {
        min-width: auto;
        max-width: auto;
      }
    }
  }
  .urldiv {
    overflow: hidden;
  }
  .innerdiv {
    width: 300px;
    float: left;
    .el-select {
      // display:block;
      // width: 200px;
      //   max-width: 600px;
      .el-input {
        min-width: auto;
        max-width: auto;
      }
    }
    &:last-child {
      .el-form-item__content {
        margin-left: 20px !important;
      }
    }
  }

  .margins {
    margin-left: 20px;
  }
}
</style>
