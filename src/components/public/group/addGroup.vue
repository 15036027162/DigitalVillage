<template>
    <div class="fixedBg">
        <div class="po-absolute modelMess modelMessGroup">
            <div class="el-icon-close po-absolute iconCLose" @click="closeGroup"></div>
            <h1 class="modelTitle">添加组</h1>
            <!--当前手机号-->
            <el-form ref="editChangeMobileForm" :model="addGroupForm" :rules="groupRules"  label-width="100px">
                <el-form-item label="组名称：" prop="name">
                    <el-input v-model="addGroupForm.name" placeholder="请输入10字以内的组织名称" style="width: 300px" clearable></el-input>
                </el-form-item>
                <el-form-item class="changeNum" label="显示顺序：" prop="sort">
                    <el-input type="number" v-model="addGroupForm.sort" placeholder="请输入显示顺序" style="width: 300px" :precision="1" clearable></el-input>
                </el-form-item>
                <el-form-item label="区域选择：" required>
                    <provinces @changeTown="changeTown"></provinces>
                    <div v-if="showVill" style="color: #F56C6C;font-size: 12px">请选择到村</div>
                </el-form-item>
                <el-form-item style="text-align: center;position:relative;left: -50px">
                    <el-button size="medium" @click="closeGroup" style="margin-right: 30px">取消</el-button>
                    <el-button type="primary" size="medium" @click="submitGroup('editChangeMobileForm')" :disabled="showSubmitGroup">确定添加</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import provinces from "@/components/common/provinces";
    export default {
        name: "addGroup",
        components: {provinces},
        data(){
            return{
                addGroupForm:{
                    name:'',
                    sort:'',
                },
                groupRules:{
                    name: [
                        { required: true,min: 1, message: '请输入10字以内的组名称', trigger: 'blur' },
                        { max: 10, message: '字符超过限制', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入显示顺序', trigger: 'blur' },
                        { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1})?$)/, message: '显示顺序必须为数字值,可保留一位小数' }
                    ],
                },
                villageCode:'',
                townCode:'',
                cityCode:'',
                showSubmitGroup:false,
                showVill:false,
            }
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            if(session_adminInfo.deptLevel=='5'){
                this.villageCode = session_adminInfo.villageCode
                this.townCode = session_adminInfo.townCode
                this.cityCode = session_adminInfo.cityCode
            }else{
                this.villageCode = ''
                this.townCode = ''
                this.cityCode = ''
            }
        },
        methods:{
            /*改变区域*/
            changeTown(val){
                let _this = this
                _this.villageCode= val.villageCode
                _this.townCode= val.townCode
                _this.cityCode= val.cityCode
            },

            /*关闭*/
            closeGroup(){
                this.$parent.addGroupModel = false
            },
            /*确定*/
            async submitGroup(editChangeMobileForm){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let memberName = session_adminInfo.name || '';
                let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1})?$)/
                let data = {
                    memberId:memberId,
                    memberName:memberName,
                    villageCode:this.villageCode,
                    groupName:this.addGroupForm.name,
                    sort:this.addGroupForm.sort,
                }
                this.$refs[editChangeMobileForm].validate(async (valid) => {
                    if (valid) {
                        /*if(this.addGroupForm.name.length<=0 || this.addGroupForm.name.length>10){
                            this.$message({
                                type: 'warning',
                                message: '组名称不能为空/字符超过限制',
                                duration: 1000,
                            });
                        }else if(this.addGroupForm.sort.length<=0 || !reg.test(this.addGroupForm.sort)){
                            this.$message({
                                type: 'warning',
                                message: '显示顺序不能为空,必须为数字值,可保留一位小数',
                                duration: 1000,
                            });
                        }else*/ if(this.villageCode.length<=0 && this.townCode.length<=0&& this.cityCode.length<=0){
                            this.showVill = true
                            // this.$message({
                            //     type: 'warning',
                            //     message: '村级不能为空',
                            //     duration: 1000,
                            // });
                        }else{
                            this.showVill = false
                            const res = await this.$http.commonalityGroupSave(data);
                            if (res.status === 'success') {
                                this.showSubmitGroup = true
                                this.$message({
                                    type: 'success',
                                    message: res.msg || '添加成功'
                                });
                                this.$parent.addGroupModel = true
                                this.$parent.getInfo()
                                this.$parent.addGroupModel = false
                            }else {
                                this.showSubmitGroup = false
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        }
                    }
                })
            },

        }
    }
</script>

<style scoped>

</style>
