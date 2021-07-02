<template>
    <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="30%" @closed="closeChange('addForm')">
        <el-form :model="organizationForm" :rules="organizationRules" label-width="100px" ref="addForm">
            <el-form-item label="组织名称：" prop="name">
                <el-input v-model="organizationForm.name" placeholder="请输入10字以内的组织名称" clearable></el-input>
            </el-form-item>
            <el-form-item class="changeNum" label="显示顺序：" prop="order">
                <el-input type="number" v-model="organizationForm.order" placeholder="请输入显示顺序" :precision="2" clearable></el-input>
            </el-form-item>
            <el-form-item label="类别：" required>
                <el-select v-model="organizationForm.type" placeholder="--请选择--" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option label="基层组织" value="1"></el-option>
                    <el-option label="经济组织" value="2"></el-option>
                </el-select>
            </el-form-item>
            <!--<el-form-item label="所属部门：">
                <el-select v-model="organizationForm.organization" placeholder="&#45;&#45;请选择&#45;&#45;">
                    <el-option label="&#45;&#45;请选择&#45;&#45;" value="0"></el-option>
                    <el-option label="独立部门" value="1"></el-option>
                    <el-option label="财务部" value="2"></el-option>
                    <el-option label="农经办" value="3"></el-option>
                </el-select>
            </el-form-item>-->
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="closeChange('addForm')">取 消</el-button>
            <el-button type="primary" @click="sureChange('addForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "addModel",
        props:['title','orangeId'],
        data(){
            return{
                dialogVisible:false, //弹窗显示
                organizationForm:{
                    name:'',
                    order:'',
                    type:'',
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
                memberId:'',
                parentId:'',
                regionCode:'',
                regionLevel:'',
                regionName:'',
                showSuper:false,
            }
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            let roleList = session_adminInfo.role_list;
            let index = roleList.findIndex(val => {
                return val.id == "1";
            });
            if (index >-1) {
                this.showSuper = true;
            } else {
                this.showSuper = false;
            }
            // this.regionLevel = this.$getStore('districtsLevel')
            // this.regionCode = this.$getStore('districtsCode')
        },
        methods:{
            /*取消*/
            closeChange(formName){
                this.dialogVisible = false
                this.$refs[formName].resetFields();
                this.organizationForm={
                    name:'',
                    order:'',
                    type:'',
                }
            },
            /*提交*/
            async sureChange(formName){
                let parentId =this.parentId
                let dataObj = {
                    memberId:this.memberId,
                    deptLevel:this.regionLevel,
                    deptDistrictsCode:this.regionCode,
                    deptDistrictsName:this.regionName,
                    deptName:this.organizationForm.name,
                    type:this.organizationForm.type,
                    sort:this.organizationForm.order,
                    parentId:parentId,
                }
               // console.log(dataObj);
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
                }else if(this.organizationForm.type.length<=0){
                    this.$message({
                        type: 'warning',
                        message: '类别不能为空',
                        duration: 1000,
                    });
                }else{
                    let res = await this.$http.businessDeptSave(dataObj);
                    if(res.status==='success'){
                        this.$message({
                            type: 'success',
                            message: res.msg || '添加成功',
                            duration: 1000,
                        });
                        this.dialogVisible = false
                        this.$refs[formName].resetFields();
                        this.$parent.chooseCondition = false
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