<template>
    <div class="fixedBg">
        <div class="po-absolute modelMess modelMessGroup">
            <div class="el-icon-close po-absolute iconCLose" @click="closeGroup"></div>
            <h1 class="modelTitle">编辑组</h1>
            <!--当前手机号-->
            <el-form ref="editChangeMobileForm" :model="addGroupForm" :rules="groupRules"  label-width="100px">
                <el-form-item label="组名称：" prop="groupName">
                    <el-input v-model="addGroupForm.groupName" placeholder="请输入10字以内的组织名称" style="width: 300px" clearable></el-input>
                </el-form-item>
                <el-form-item class="changeNum" label="显示顺序：" prop="sort">
                    <el-input type="number" v-model="addGroupForm.sort" placeholder="请输入显示顺序" style="width: 300px" :precision="1" clearable></el-input>
                </el-form-item>
                <!--<el-form-item label="区域选择：" required>
                    <provinces @changeTown="changeTown" v-if="JSON.stringify(provinces) !=='{}'" :provinces="provinces" :disableselect="true"></provinces>
                </el-form-item>-->
                <el-form-item style="text-align: center;position:relative;left: -50px">
                    <el-button size="medium" @click="closeGroup" style="margin-right: 30px">取消</el-button>
                    <el-button type="primary" size="medium" @click="submitGroup('editChangeMobileForm')" :disabled="showSubmitGroup">确定修改</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import provinces from "@/components/common/provinces2";
    export default {
        name: "editGroup",
        components: {provinces},
        props:['data'],
        data(){
            return{
                addGroupForm:{
                    groupName:'',
                    sort:'',
                },
                groupRules:{
                    groupName: [
                        { required: true, message: '请输入10字以内的组名称', trigger: 'blur' },
                        { max: 10, message: '字符超过限制', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入显示顺序', trigger: 'blur' },
                        { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1})?$)/, message: '显示顺序必须为数字值,可保留一位小数' }
                    ],
                },
                provinces:{},
                showSubmitGroup:false,
            }
        },
        created() {
            this.getInfo()
        },
        methods:{
            /*组详情*/
            async getInfo(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                const res = await this.$http.commonalityGroupId({
                    memberId:memberId,
                    id:this.data.id
                });
                if(res.status === 'success'){
                    this.addGroupForm = res.data
                    this.provinces = res.data
                    this.villageCode = res.data.villageCode
                }

            },

            /*区域选择*/
            changeTown(){},

            /*关闭*/
            closeGroup(){
                this.$parent.editGroupModel = false
            },
            /*确定*/
            async submitGroup(editChangeMobileForm){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let memberName = session_adminInfo.name || '';
                let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1})?$)/
                this.$refs[editChangeMobileForm].validate(async (valid) => {
                    if (valid) {
                        if(this.addGroupForm.groupName.length<=0 || this.addGroupForm.groupName.length>10){
                            this.$message({
                                type: 'warning',
                                message: '组名称不能为空/字符超过限制',
                                duration: 1000,
                            });
                        }else if(this.addGroupForm.sort.length<=0 || !reg.test(this.addGroupForm.sort)){
                            this.$message({
                                type: 'warning',
                                message: '显示顺序必须为数字值,可保留一位小数',
                                duration: 1000,
                            });
                        }else{
                            const res = await this.$http.commonalityGroupUpdate({
                                memberId:memberId,
                                memberName:memberName,
                                id:this.addGroupForm.id,
                                groupName:this.addGroupForm.groupName,
                                sort:this.addGroupForm.sort,
                            });
                            if(res.status === 'success'){
                                this.showSubmitGroup = true
                                this.$message({
                                    type: 'success',
                                    message: res.msg || '修改成功'
                                });
                                this.$parent.getInfo()
                                this.$parent.editGroupModel = false
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
