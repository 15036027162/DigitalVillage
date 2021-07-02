<template>
    <div class="fixedBg" v-if="showHoner">
        <div class="po-absolute modelMess">
            <div class="el-icon-close po-absolute iconCLose" @click="closeChangePhone"></div>
            <h1 class="modelTitle">添加人员</h1>
            <!--搜索人员信息-->
            <el-form ref="editChangeMobileForm" :model="honerModelForm">
                <el-form-item prop="mobile">
                    <el-input v-model="honerModelForm.name" placeholder="请输入姓名" style="width: 210px;margin-right: 20px"></el-input>
                    <el-button type="primary" size="medium"  @click="searchUser">查询</el-button>
                </el-form-item>
            </el-form>

            <!--列表-->
            <ul class="honerModelList" v-if="userList">
                <li class="flex" v-for="(item,index) in userList" :key="index">
                    <div class="flex">
                        <div class="demo-basic--circle">
                            <div class="block"><el-avatar :size="50" :src="item.avatar||'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar></div>
                        </div>
                        <div style="margin-left: 10px;font-size: 12px">
                            <p>{{item.name}}</p>
                            <p>{{item.sexName}}</p>
                            <p>{{phoneNumFilterLogin(item.mobile)}}</p>
                        </div>
                    </div>
                    <el-button style="height: 35px" type="primary" size="medium"  @click="addMember(item)">添加</el-button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "honerModel",
        data(){
            return{
                honerModelForm:{
                    name:''
                },
                showHoner:false,
                userList:[],
            }
        },
        created() {
            this.searchUser()
        },
        methods:{
            /*关闭*/
            closeChangePhone(){
                this.showHoner = false
                this.honerModelForm.name = ''
                this.searchUser()
            },

            /*查询*/
            async searchUser(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo'));
                let sessionCode = session_adminInfo.deptDistrictsCode
                let res = await this.$http.getMemberByVillageCode({
                    name:this.honerModelForm.name || '',
                    villageCode:sessionCode
                })
                if(res.status==='success'){
                   this.userList = res.data
                    if(this.userList.length>0){
                        this.userList.map(k=>{
                            if(k.ssex ==1){
                                k.sexName = '男'
                            }else{
                                k.sexName = '女'
                            }
                        })
                    }else{
                        this.$message({
                            type: 'warning',
                            message: res.msg,
                            duration: 1000,
                        });
                    }
                }
            },

            /*添加成员*/
            addMember(val){
                this.$emit("addMember",val);
                this.showHoner = false
                if(this.showHoner==false){
                    this.honerModelForm.name = ''
                    this.searchUser()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .honerModelList{
        height: 320px;
        overflow-y: auto;
        li{
            margin-bottom: 10px;
        }
    }
</style>
