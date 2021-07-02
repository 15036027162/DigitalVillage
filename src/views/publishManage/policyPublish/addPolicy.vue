<template>
  <div class>
    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px" style="width:60%">
      <el-form-item label="信息分类：" class="infotype" v-if="!this.id" required>
        <el-select v-model="editForm.dicId" placeholder="--请选择--" prop="dicId">
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主题名称：" prop="title">
        <el-input v-model="editForm.title" placeholder="请输入20字以内的主题名称"></el-input>
      </el-form-item>
      <el-form-item label="封面图片：" class="imgupload" ref="picListRef" prop="picListUrls">
        <el-upload class="editOrAddImgList" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg" :on-remove="handleRemoveImg" :on-success="handleUpLoadImgSuccess" :before-upload="beforeImgUpload" :file-list="fileImgList" :limit="limitUploadNum" :auto-upload="true">
          <i class="el-icon-plus"></i>

          <div slot="tip" class="el-upload__tip">
            建议尺寸为640*384像素，大小小于
            {{ limitMaxSize }}MB
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="政策内容：" class="editor-item-con" prop="details">
        <el-input v-show="false" type="textarea" minlength="0" maxlength="2000" :rows="10" v-model="editForm.details" placeholder></el-input>
        <!-- 编辑器　替换　-->
        <!-- 图片上传组件辅助-->
        <el-upload
          class="avatar-uploader"
          :action="upLoadApiUrl"
          accept="image/jpeg, image/jpg, image/gif, image/png"
          :data="uploadImgData"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        ></el-upload>
        <quill-editor v-model="editForm.details" ref="myQuillEditor" :options="editorOption" @change="onEditorChange()"></quill-editor>
        <div class="editorWordNumber">{{ editorWordLength }}/2000</div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :disabled="isdisable" size="medium" @click="submitForm('editForm')">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseUrl } from "../../../config/env";
import { validateUploadFileNum } from "../../../config/validate";
export default {
  data() {
    var validatecontent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入政策内容(最多1000字)"));
      } else {
        var contents = this.editForm.details;
        contents = this.removeTAG(contents);
        if (contents.length > 2000) {
          callback(new Error("请输入政策内容(最多2000字)"));
        } else {
          callback();
        }
      }
    };
    return {
      editForm: {
        title: "",
        file_url: "",
        picListUrls: "",
        details: "",
        dicId: "",
      },
      type: 1,
      id: "",
      details: {},
      adminUserInfo: {},
      editRules: {
        dicId: [
          { required: true, message: "请选择信息分类", trigger: "change" },
        ],
        title: [
          {
            required: true,
            min: 0,
            max: 20,
            message: " 请输入20字以内的主题名称",
            trigger: "blur",
          },
        ],
        picListUrls: [
          { required: true, message: "请上传封面图片", trigger: "change" },
        ],
        details: [
          { required: true, validator: validatecontent, trigger: "blur" },
        ],
      },
      upLoadApiUrl: baseUrl + "commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
      fileImgList: [], // 图片
      uploadImgData: {
        file: "",
        type: "2",
      },
      limitUploadNum: 1,
      limitMaxSize: 2, // 文件大小
      editorOption: {
        placeholder: "请输入政策内容(最多2000字)",
        theme: "snow",
    modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
              ["blockquote", "code-block"], //引用，代码块
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ list: "ordered" }, { list: "bullet" }], //列表
              [{ script: "sub" }, { script: "super" }], // 上下标
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ direction: "rtl" }], // 文本方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              [{ font: [] }], //字体
              [{ align: [] }], //对齐方式
              ["image"],
              ["clean"], //清除字体样式
            ],
            handlers: {
          image: function (value) {
          
            if (value) {
         
              // 触发input框选择图片文件
              document.querySelector(".avatar-uploader input").click();
            } else {
              this.quill.format("image", false);
            }
          },
        },

          },
        },
      },
      isPower: false,
      role_list: [],
      deptLevel: "",
      editorWordLength: 0,
      list: [],
      isdisable: false,
    };
  },
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.role_list = this.adminUserInfo.role_list;


    this.type = this.$route.query.type;
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.$route.meta.title = "修改";
      this.getListData();
    } else {
      this.$route.meta.title = "发布";
    }
    this.getList();
  },
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
    // 编辑器文字变化
    onEditorChange() {
      let _this = this;
      var editorWord = _this.editForm.details || "";
      _this.editorWordLength = _this.removeTAG(editorWord).length;
    },
    //去除富文本标签
    removeTAG(str) {
      return str.replace(/<[^>]+>/g, "");
    },
    // 获取列表数据
    async getListData() {
      const res = await this.$http.policyDetail({
        id: this.id || 1,
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData[0];
        this.editForm.title = resData[0].title;
        this.editForm.dicId = resData[0].dicId;
        this.editForm.picListUrls = 1;
        this.editForm.details = resData[0].details;
        this.fileImgList = [
          {
            url: resData[0].fileUrl,
            name: "1",
          },
        ];
        // this.$nextTick(() => {
        //   this.$refs.myQuillEditor.quill.enable(true);
        //   this.$refs.myQuillEditor.quill.blur();
        // });
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
      if(this.editForm.dicId.length<=0){
        this.$message({
          type: "warning",
          message: '请选择信息分类'
        });
        return;
      }else if(this.editForm.title.length<=0||this.editForm.title.length>20){
        this.$message({
          type: "warning",
          message: '请输入20字以内的主题名称'
        });
      }else if(fileNum <= 0){
        this.$message({
          type: "warning",
          message: '请上传封面'
        });
      }else if(this.editForm.details<=0 || this.editorWordLength>2000){
        this.$message({
          type: "warning",
          message: '请输入2000字以内的政策内容'
        });
      }else{
        if (fileNum > 0) {
          this.$refs.picListRef.clearValidate();
        }
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.$alert("确定要发布该文本信息么?", "发布确定", {
              confirmButtonText: "确定发布",
              cancelButtonText: "取消",
              type: "warning",
            })
                    .then(async () => {
                      this.isdisable = true;
                      const res = await this.$http.policySave({
                        type: this.type,
                        id: this.id,
                        dicId: this.editForm.dicId,
                        // member_id: this.adminUserInfo.memberId,
                        title: this.editForm.title,
                        details: this.editForm.details,
                        file_url: this.fileImgList[0].url
                                ? this.fileImgList[0].url
                                : "",
                      });
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
                    })
                    .catch((_) => {});
          }
          // else {
          //   this.$message({
          //     type: "warning",
          //     message: "请修改表单提示区域内容后重新提交！",
          //   });
          //   return false;
          // }
        });
      }
      // if (fileNum > 0) {
      //   this.$refs.picListRef.clearValidate();
      // } else {
      //   this.$set(this.editRules, "picListUrls", {
      //     required: true,
      //     message: "请上传封面",
      //     trigger: "change",
      //     validator: validateUploadFileNum,
      //   });
      //   this.$refs["editForm"].validateField("picListUrls");
      //   return;
      // }
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

    //富文本图片上传成功
    uploadSuccess(res, file) {
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == "0") {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片
        quill.insertEmbed(length, "image", res.data[0]);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message("图片插入失败");
      }
    },
    // 富文本图片上传失败
    uploadError() {
      this.$message.error("图片插入失败");
    },
    // 上传图片完成
    handleUpLoadImgSuccess(res, file, fileList) {
      // console.log(res)
      const picStatus = res.status || "error",
        picLink = res.data[0] || "";
      if (picStatus === "success" && picLink.length > 0) {
        this.fileImgList.push({
          name: file.name || picLink,
          url: picLink,
        });

        this.$refs.picListRef.clearValidate();
        this.editForm.picListUrls = fileList.length || 0;
      } else {
        this.$message.error(res.msg);
        //return;
      }

      // 图片附件数量
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
    // 返回
    onBackConfirm() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less">
.imgupload {
  position: relative;
}
.infotype {
  .el-select {
    display: block;
  }
}
.ts {
  color: #909399;
  position: absolute;
  left: 178px;
  top: 39%;
  transform: translateY(-50%);
}
.editorWordNumber {
  position: absolute;
  bottom: -30px;
  right: 1px;
  width: auto;
  height: 24px;
  line-height: 24px;
  background: #fff;
  border-radius: 3px;
  padding: 0 1px;
  color: #666;
  font-size: 13px;
}
</style>
