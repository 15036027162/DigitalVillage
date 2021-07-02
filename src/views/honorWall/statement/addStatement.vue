<template>
  <div>
    <el-form ref="stateForm" :inline="true" :model="stateForm" :rules="editRules" class="demo-form-inline">
      <el-form-item label="区域选择：">
        <provinces @changeTown="changeTown" :isadd="true"></provinces>
        <el-checkbox v-model="stateForm.type">全部更新</el-checkbox>
      </el-form-item>
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
        <el-button type="primary" size="medium" @click="submitForm('stateForm')" style="width: 150px" :disabled="submitOver">发布
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import provinces from "@/components/common/provinces1";
import { baseUrl } from "../../../config/env";
export default {
  name: "addStatement",
  components: { provinces },
  data() {
    var validatecontent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入政策详情(最多1000字)"));
      } else {
        var contents = this.stateForm.details;
        contents = this.removeTAG(contents);
        if (contents.length > 1000) {
          callback(new Error("请输入积分规则说明(最多1000字)"));
        } else {
          callback();
        }
      }
    };
    return {
      stateForm: {
        type: false,
        details: "",
      },
      editorOption: {
        placeholder: "输入积分规则说明最多1000字",
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
    this.areaCode = session_adminInfo.areaCode;
    this.areaName = session_adminInfo.areaName;
    this.deptLevel = session_adminInfo.deptLevel;
    if (this.deptLevel == 4) {
      this.streetCode = session_adminInfo.streetCode;
      this.streetName = session_adminInfo.streetName;
    } else if (this.deptLevel == 5) {
      this.streetCode = session_adminInfo.streetCode;
      this.streetName = session_adminInfo.streetName;
      this.villageCode = session_adminInfo.villageCode;
      this.villageName = session_adminInfo.villageName;
    }
    this.memberId = session_adminInfo.memberId || 0;
  },
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
    // 编辑器文字变化
    onEditorChange() {
      let _this = this;
      let editorWord = _this.stateForm.details || "";
      _this.editorWordLength = _this.removeTAG(editorWord).length;
    },
    //去除富文本标签
    removeTAG(str) {
      return str.replace(/<[^>]+>/g, "");
    },
    //发布
    async submitForm() {
      let data = {};
      let isUpdate = "";
      if (this.stateForm.type === false) {
        isUpdate = "0";
      } else {
        isUpdate = "1";
      }
      data = {
        type: 1,
        id: "",
        memberId: this.memberId,
        details: this.stateForm.details,
        areaCode: this.areaCode,
        streetCode: this.streetCode,
        villageCode: this.villageCode,
        areaName: this.areaName,
        streetName: this.streetName,
        villageName: this.villageName,
        isUpdate: isUpdate,
      };
      if (this.villageCode.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择地区到村",
        });
      } else if (this.stateForm.details.length <= 0 || this.editorWordLength > 1000) {
        this.$message({
          type: "warning",
          message: "请输入1000字以内的积分规则说明",
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
