<template>
    <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="30%">
        <el-form :model="organizationForm" :rules="organizationRules" label-width="100px" ref="ruleForm">
            <el-form-item label="组织名称：" prop="name">
                <el-input v-model="organizationForm.name" placeholder="请输入10字以内的组织名称" clearable></el-input>
            </el-form-item>
            <el-form-item class="changeNum" label="显示顺序：" prop="order">
                <el-input type="number" v-model="organizationForm.order" placeholder="请输入显示顺序" :precision="2" clearable></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="closeChange">取 消</el-button>
            <el-button type="primary" @click="sureChange">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "changeModel",
        props:['title'],
        data(){
            return{
                dialogVisible:false, //弹窗显示
                organizationForm:{
                    name:'',
                    order:''
                },
                organizationRules:{
                    name: [
                        { required: true,min: 1, message: '请输入10字以内的组织名称', trigger: 'blur' },
                        { max: 10, message: '字符超过限制', trigger: 'blur' }
                    ],
                    order: [
                        { required: true, message: '请输入显示顺序', trigger: 'blur' },
                        { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '显示顺序必须为数字值,可保留两位小数' }
                    ],
                },
                memberId:0,
                parentId:0,
            }
        },
        methods:{
            closeChange(){
                this.dialogVisible = false
            },
            async sureChange(){
                let parentId =this.parentId
                let dataObj = {
                    memberId:this.memberId,
                    deptName:this.organizationForm.name,
                    sort:this.organizationForm.order,
                    id:parentId,
                }
                if(this.organizationForm.name.length<=0 || this.organizationForm.name.length>10){
                    this.$message({
                        type: 'warning',
                        message: '组名称不能为空/字符超过限制',
                        duration: 1000,
                    });
                }else if(this.organizationForm.order.length<=0){
                    this.$message({
                        type: 'warning',
                        message: '显示顺序不能为空',
                        duration: 1000,
                    });
                }else{
                    const res = await this.$http.businessDeptUpdate(dataObj);
                    if(res.status==='success'){
                        this.dialogVisible = false
                        this.$message({
                            type: 'success',
                            message: res.msg || '修改成功',
                            duration: 1000,
                        });
                        this.$parent.getInfo()
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg,
                            duration: 1500,
                        });
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .dialog-footer{
        text-align: center;
    }
</style>