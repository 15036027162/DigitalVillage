<template>
    <div class="addHonor_content">
        <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="130px">
            <el-form-item label="表彰名称：" prop="name">
                <el-input v-model="editForm.name" placeholder="请输入8字以内的表彰名称" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="徽章图片：" class="imgupload clear" prop="imageUrl">
                <el-upload
                        class="avatar-uploader fl-left"
                        style="margin-right: 20px"
                        :action="upLoadApiUrl"
                        :show-file-list="false"
                        :data="uploadImgData"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img :src="editForm.imageUrl" class="avatar" v-if="editForm.imageUrl"/>
                    <div v-else>
                        <i class="el-icon-plus avatar-uploader-icon"/><span>上传（已获得）</span>
                    </div>
                </el-upload>
                <el-upload
                        class="avatar-uploader fl-left"
                        :action="upLoadApiUrl"
                        :show-file-list="false"
                        :data="uploadImgData"
                        :on-success="handleObtainedSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img :src="editForm.obtainedUrl" class="avatar" v-if="editForm.obtainedUrl"/>
                    <div v-else>
                        <i class="el-icon-plus avatar-uploader-icon"/><span>上传（未获得）</span>
                    </div>
                </el-upload>
            </el-form-item>
            <!--<el-form-item label="表彰证书背景：" class="imgupload" prop="credUrl">
                <el-upload
                        class="avatar-uploader"
                        :action="upLoadApiUrl"
                        :show-file-list="false"
                        :data="uploadImgData"
                        :on-success="handleCredUrlSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img :src="editForm.credUrl" class="avatar" v-if="editForm.credUrl"/>
                    <div v-else>
                        <i class="el-icon-plus avatar-uploader-icon"/><span>上传</span>
                    </div>
                </el-upload>
            </el-form-item>-->
            <el-form-item>
                <el-button type="primary" size="medium" @click="submitForm('editForm')" :disabled="isdisable">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { baseUrl } from "../../../config/env";
    export default {
        name: "editHonor",
        data(){
            return{
                editForm:{
                    name:'',
                    imageUrl:'', // 上传（已获得）img
                    obtainedUrl:'', // 上传（未获得）img
                    credUrl:'' // 表彰证书背景 img
                },
                editRules:{
                    name: [
                        { required: true, message: '请输入表彰名称', trigger: 'blur' },
                        { min:1, max: 8, message: '请输入8字以内的表彰名称', trigger: 'blur' }
                    ],
                    imageUrl:[
                        {required: true, message: '请选择徽章图片', trigger: 'blur'}
                    ],
                    credUrl:[
                        {required: true, message: '请选择表彰证书背景', trigger: 'blur'}
                    ]
                },
                uploadImgData: {
                    file: "",
                    type: "2",
                },
                upLoadApiUrl: baseUrl + "commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
                limitMaxSize: 4, // 文件大小
                isdisable:false
            }
        },
        mounted() {
            this.getInfo()
        },
        methods:{
            // 详情
            async getInfo(){
                let res = await this.$http.commendationGetById({id:this.$route.params.id});
                if(res.status==='success'){
                    this.editForm.name = res.data[0].name
                    this.editForm.imageUrl = res.data[0].winUrl
                    this.editForm.obtainedUrl = res.data[0].noWinUrl
                    this.editForm.credUrl = res.data[0].backUrl
                }
            },
            // 图片上传检测
            beforeAvatarUpload(file) {
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
            handleAvatarSuccess(res, file) {
                if(res.status === 'success'){
                    this.editForm.imageUrl = res.data[0]
                }
            },
            handleObtainedSuccess(res, file) {
                if(res.status === 'success'){
                    this.editForm.obtainedUrl = res.data[0]
                }
            },
            handleCredUrlSuccess(res, file) {
                if(res.status === 'success'){
                    this.editForm.credUrl = res.data[0]
                }
            },

            // 保存
            submitForm(editForm){
                let dataObj = {
                    id:this.$route.params.id,
                    name:this.editForm.name,
                    winUrl:this.editForm.imageUrl,
                    noWinUrl:this.editForm.obtainedUrl,
                    backUrl:this.editForm.credUrl
                }
                this.$refs[editForm].validate(async (valid) => {
                    if (valid) {
                        this.isdisable = true
                        let res = await this.$http.commendationSetEdit(dataObj);
                        if(res.status==='success'){
                            this.$message({
                                type: 'success',
                                message: res.msg,
                                duration: 1000,
                            });
                            setTimeout(() => {
                                this.$router.push({name: 'honorSetting'});
                                this.isdisable = false
                            }, 1000);
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.msg,
                                duration: 1500,
                            });
                            setTimeout(() => {
                                this.isdisable = false
                            }, 1000);
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
