<!--  -->
<template>
  <div class>
    <el-upload
      :action="upLoadApiUrl"
      :list-type="listType"
      :on-remove="handleRemove"
      :on-exceed="exceed"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :limit="limitNum"
      :file-list="imgList"
      :data="uploadImgData"
      :accept="uploadType"
    >
      <i class="el-icon-plus" v-if="listType=='picture-card'"></i>
       <el-button size="small" type="primary" v-else>点击上传</el-button>
      <div
        slot="tip"
        class="el-upload__tip"
      >照片最大{{limitMaxSize}}MB，支持{{uploadTypeText}}格式，最多{{limitNum}}张</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      imgList: this.imgs,
      upLoadApiUrl: this.$baseUrl + "qiNiuYunUpload/singleFileUpload", // 图片上传接口
      uploadImgData: {
        file: "",
        type: "2"
      }
    };
  },
  props: {
    limitNum: Number,
    limitMaxSize: Number,
    imgs: Array,
    listType:{
type: String,
      default: "picture-card"
    },
    uploadType: {
      type: String,
      default: "image/jpg,image/jpeg,image/png,image/gif"
    }
  },
  computed: {
    // 计算属性的 getter
    uploadTypeText: function() {
      let arr1 = this.uploadType.split(",");
      let arr2 = arr1.map(val => {
        return val.split("/")[1];
      });
      return arr2.join(",");
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
   
  },
  //方法集合
  methods: {
    handleRemove(file, fileList) {
      let imgUid = file.uid;
      var index = this.imgList.findIndex(item => {
        if (item.uid === imgUid) {
          return true;
        }
      });
      this.imgList.splice(index, 1);
     // console.log(this.imgs);
      this.$emit("getimgList", this.imgList);
    },
    handleSuccess(res, file, fileList) {
      var url = res.data[0];
      if (res.code === "0") {
        this.imgList.push({
          name: file.name,
          url: url
        });
        this.$emit("getimgList", this.imgList);
      }
    },
    exceed(file, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitNum) {
        this.$message.error("最多只能上传" + this.limitNum + "张图片!");
      }
    },
    beforeUpload(file, fileList) {
      // const isJPG =
      //   file.type === "image/jpeg" ||
      //   file.type === "image/jpeg" ||
      //   file.type === "image/png" ||
      //   file.type === "image/gif";
      //       var uploadTypeList=this.uploadType.split(',')
      //       for(var i=0;i<uploadTypeList.length;i++){
      //         if(uploadTypeList[i]==file.type){
      // const isJPG=true;
      // break;
      //         }
      //       }
      const isJPG = /^image\/\w+$/i.test(file.type);
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize;
      if (!isJPG) {
        this.$message.error("上传图片只能是"+this.uploadTypeText+"格式!");
      }
      if (!isLt4M) {
        this.$message.error(
          "上传单个图片大小不能超过 " + this.limitMaxSize + "MB!"
        );
      }
      return isJPG && isLt4M;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>