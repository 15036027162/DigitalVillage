<template>
  <div>
    <el-form ref="stateForm" :inline="true" :model="stateForm" :rules="editRules" class="demo-form-inline">
      <el-form-item label="积分规则说明：" class="editor-item-con" prop="details">
        <el-input v-show="false" type="textarea" minlength="0" maxlength="1000" :rows="10" v-model="stateForm.details" placeholder></el-input>
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
        <quill-editor v-model="stateForm.details" ref="myQuillEditor" :options="editorOption" @change="onEditorChange()"></quill-editor>
        <div class="editorWordNumber">{{editorWordLength}}/1000</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="submitForm('stateForm')" style="width: 150px" :disabled="submitOver">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseUrl } from "../../../config/env";
export default {
  name: "editStatement",
  data() {
    var validatecontent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入政策详情(最多1000字)"));
      } else {
        var contents = this.stateForm.details;
        contents = this.removeTAG(contents);
        if (contents.length > 1000) {
          callback(new Error("请输入政策详情(最多1000字)"));
        } else {
          callback();
        }
      }
    };
    return {
      stateForm: {
        details: "",
      },
      editorOption: {
        placeholder: "输入积分规则说明最多1000字)",
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
      editRules: {
        details: [
          { required: true, validator: validatecontent, trigger: "blur" },
        ],
      },
      editorWordLength: 0,
      memberId: "",
      areaCode: "",
      streetCode: "",
      villageCode: "",
      areaName: "",
      streetName: "",
      villageName: "",
      submitOver: false,
       upLoadApiUrl: baseUrl + "commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
        uploadImgData: {
        file: "",
        type: "2",
      },
    };
  },
  mounted() {
    let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
    this.memberId = session_adminInfo.memberId || 0;
    this.getInfo();
  },
  methods: {
    async getInfo() {
      let res = await this.$http.honorstatementDetail({
        id: this.$route.params.id,
      });
      if (res.status === "success") {
        this.areaCode = res.data[0].areaCode;
        this.areaName = res.data[0].areaName;
        this.streetCode = res.data[0].streetCode;
        this.streetName = res.data[0].streetName;
        this.villageCode = res.data[0].villageCode;
        this.villageName = res.data[0].villageName;
        this.stateForm.details = res.data[0].details;
      }
    },
    // 编辑器文字变化
    onEditorChange() {
      let _this = this;
      let editorWord = _this.stateForm.details || "";
      _this.editorWordLength = _this.removeTAG(editorWord).length;
      //_this.editorWordLength = editorWord.length;
    },
    //去除富文本标签
    removeTAG(str) {
      return str.replace(/<[^>]+>/g, "");
    },
    //保存
    async submitForm() {
      let data = {};
      data = {
        type: 2,
        id: this.$route.params.id,
        memberId: this.memberId,
        details: this.stateForm.details,
        areaCode: this.areaCode,
        streetCode: this.streetCode,
        villageCode: this.villageCode,
        areaName: this.areaName,
        streetName: this.streetName,
        villageName: this.villageName,
        isUpdate: 0,
      };
      if (
        this.stateForm.details.length <= 0 ||
        this.editorWordLength > 1000
      ) {
        this.$message({
          type: "warning",
          message: "说明内容不能为空/字符超过限制",
        });
      } else {
        this.submitOver = true;
        let res = await this.$http.saveAndUpdate(data);
        if (res.status === "success") {
          this.$message({
            type: "success",
            message: res.msg || "发布成功",
          });
          setTimeout(() => {
            this.$router.push({ name: "statement" });
            this.submitOver = false;
          }, 1000);
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
          setTimeout(() => {
            this.submitOver = false;
          }, 1000);
        }
      }
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
  },
};
</script>

<style scoped>
</style>
