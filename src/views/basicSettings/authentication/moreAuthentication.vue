<template>
    <div>
        <el-form v-if="authentForm" v-model="authentForm" label-width="100px"
                 ref="memberChangeRef">
            <div class="flex" style="width: 800px">
                <el-form-item label="用户名：" style="width: 400px">{{authentForm.account}}</el-form-item>
                <el-form-item label="所属乡村：" style="width: 400px">{{authentForm.areaName}} - {{authentForm.streetName}} - {{authentForm.villageName}}</el-form-item>
            </div>
            <div class="flex" style="width: 800px">
                <el-form-item label="绑定手机号：" style="width: 400px">{{authentForm.mobile || '暂未绑定'}}</el-form-item>
                <el-form-item label="姓名：" style="width: 400px">{{authentForm.name}}</el-form-item>
            </div>
            <div class="flex" style="width: 800px">
                <el-form-item label="提交时间：" style="width: 400px">{{authentForm.modifyTime}}</el-form-item>
                <el-form-item label="身份证号：" style="width: 400px">{{authentForm.identity}}</el-form-item>
            </div>
        </el-form>
        <div style="margin-bottom: 30px">
            <img style="margin-right: 50px" class="authentForm_img" :src="authentForm.front" alt="">
            <img class="authentForm_img" :src="authentForm.reverse" alt="">
        </div>
        <div v-if="this.authentForm.status==4" style="color: red;font-size: 20px">审核状态 <span style="margin-left: 60px">{{authentForm.statusName}}</span></div>
        <div v-if="this.authentForm.status==1" style="color: green;font-size: 20px">审核状态 <span style="margin-left: 60px">{{authentForm.statusName}}</span></div>
    </div>
</template>

<script>
    export default {
        name: "moreAuthentication",
        data(){
            return{
                authentForm:{}
            }
        },
        mounted() {
            this.getAuthent()
        },
        methods:{
            async getAuthent(){
                let res = await this.$http.getInfoByMemberId({editMemberId:this.$route.params.id})
                if(res.status==='success'){
                    this.authentForm = res.data[0]
                    // let reg = /^(\d{4})\d*(\d{2})$/;
                    // this.authentForm.identity = this.authentForm.identity.replace(reg, "$1************$2")
                    if(this.authentForm.status==1){
                        this.authentForm.statusName = '已认证'
                    }else if(this.authentForm.status==3){
                        this.authentForm.statusName = '审核中'
                    }else if(this.authentForm.status==4){
                        this.authentForm.statusName = '未通过'
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .authentForm_img{
        width: 410px;
        height: 260px;
    }
</style>
