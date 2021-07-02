<template>
    <div>
        <el-form v-if="authentForm" v-model="authentForm" label-width="100px"
                 ref="memberChangeRef">
            <div class="flex" style="width: 800px">
                <el-form-item label="用户名：" style="width: 400px">{{authentForm.account}}</el-form-item>
                <el-form-item label="所属乡村：" style="width: 400px">{{authentForm.areaName}} - {{authentForm.streetName}} - {{authentForm.villageName}}</el-form-item>
            </div>
            <div class="flex" style="width: 800px">
                <el-form-item label="绑定手机号：" style="width: 400px">{{authentForm.mobile|| '暂未绑定'}}</el-form-item>
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
        <div>
            <el-button style="width: 150px;margin-right: 30px" @click="passAuthent('2')">不通过</el-button>
            <el-button type="primary" style="width: 150px" @click="passAuthent('1')">通过</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "passAuthentication",
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
                }
            },
            async passAuthent(val){
                let res = await this.$http.updateStatus({
                    editMemberId:this.$route.params.id,
                    status:val
                })
                if(res.status==='success'){
                    this.$message({
                        type: 'success',
                        message: res.msg,
                        duration: 1000,
                    })
                    setTimeout(() => {
                        this.$router.push({name: 'authentication'});
                    }, 1000)
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg,
                        duration: 1000,
                    })
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
