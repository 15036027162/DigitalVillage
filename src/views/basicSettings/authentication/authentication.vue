<template>
    <div>
        <!--查询条件-->
        <el-form :inline="true" :model="authenForm" class="demo-form-inline">
            <el-form-item label="区域选择：" v-if="deptLevel !=5">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
            </el-form-item>
            <el-form-item label="认证状态：">
                <el-select v-model="authenForm.status" placeholder="--请选择--" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option label="待审核" value="3"></el-option>
                    <el-option label="已认证" value="1"></el-option>
                    <el-option label="未通过" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名：">
                <el-input v-model="authenForm.name" placeholder="请输入用户名或手机号查询" clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
                <el-input v-model="authenForm.isCard" placeholder="请输入身份证号查询" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchMore">查询</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <!--列表-->
        <el-table :data="setDataList" border
                  v-loading = "showListLoading"
                  element-loading-background = "rgba(0, 0, 0, 0.3)"
                  element-loading-text = "数据加载中"
                  element-loading-spinner = "el-icon-loading">
            <el-table-column prop="account" label="用户名"></el-table-column>
            <el-table-column prop="mobile" label="绑定手机"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="identity" label="身份证号"></el-table-column>
            <el-table-column prop="statusName" label="认证状态"></el-table-column>
            <el-table-column prop="modifyTime" label="提交时间"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row)" v-if="scope.row.status==3&&isAuth('base:auth:audit')">审核</el-button>
                    <el-button type="text" @click="handleView(scope.row)" v-if="scope.row.status!=3&&isAuth('base:auth:view')">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页-->
        <el-pagination
                class="paging"
                background
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next, jumper"
                v-if='listMain.totalPage > 0'
                :page-size="listMain.pageSize"
                :page-count="listMain.totalPage"
                :pager-count="7"
                :current-page.sync="listMain.pageNo"
                :total="listMain.total">
        </el-pagination>
    </div>
</template>

<script>
    import provinces from "@/components/common/provinces";
    export default {
        name: "authentication",
        components:{provinces},
        data(){
            return{
                authenForm:{
                    status:'',
                    name:'',
                    isCard:''
                },
                setDataList:[],  //列表数据
                showListLoading:false,  //加载中。。。
                /*分页*/
                listMain: {
                    pageNo: 1,
                    totalPage: 0,
                    pageSize: 10,
                    total: 0
                },
                chooseCondition:false,  //查询中间变量
                villageCode:'',
                streetCode:'',
                areaCode:'',
                deptLevel:0,
                isReset: false
            }
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0;
            this.areaCode = session_adminInfo.areaCode
            this.deptLevel = session_adminInfo.deptLevel
            if(this.deptLevel==3){
                this.villageCode = '';
                this.streetCode = '';
            }else if(this.deptLevel==4){
                this.villageCode = ''
                this.streetCode = session_adminInfo.streetCode
            }else if(this.deptLevel==5){
                this.villageCode = session_adminInfo.villageCode
                this.streetCode = session_adminInfo.streetCode
            }
            this.getInfo()
        },
        methods:{
            async getInfo(){
                let data ={}
                this.showListLoading = true
                if(this.chooseCondition == false){
                    data = {
                        memberId:this.memberId,
                        villageCode:this.villageCode,
                        streetCode:this.streetCode,
                        areaCode:this.areaCode,
                        identity:'',
                        param:'',
                        status:'',
                        pageNumber:this.listMain.pageNo,
                        pageSize:this.listMain.pageSize
                    }
                }else{
                    data = {
                        memberId:this.memberId,
                        villageCode:this.villageCode,
                        streetCode:this.streetCode,
                        areaCode:this.areaCode,
                        identity:this.authenForm.isCard,
                        param:this.authenForm.name,
                        status:this.authenForm.status,
                        pageNumber:this.listMain.pageNo,
                        pageSize:this.listMain.pageSize
                    }
                }
                let res = await this.$http.authenticationList(data)
                if(res.status==='success'){
                    this.showListLoading = false
                    this.setDataList = res.data.list
                    this.listMain.total = res.data.total
                    this.listMain.totalPage = res.data.pages
                    this.setDataList.map(k=>{
                        let reg = /^(\d{4})\d*(\d{2})$/;
                        k.identity = k.identity.replace(reg, "$1************$2")
                        k.mobile = this.phoneNumFilterLogin(k.mobile)
                        if(k.status==1){
                            k.statusName = '已认证'
                        }else if(k.status==3){
                            k.statusName = '待审核'
                        }else if(k.status==4){
                            k.statusName = '未通过'
                        }
                    })

                }
            },
            // 查询
            searchMore(){
                this.listMain.pageNo = 1
                if(this.authenForm.name || this.authenForm.isCard || this.authenForm.status || this.villageCode || this.streetCode || this.areaCode){
                    this.chooseCondition = true
                    this.getInfo()
                }else{
                    this.chooseCondition = false
                    this.getInfo()
                }
            },
            /*重置*/
            resetForm(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                if(this.deptLevel==3){
                    this.villageCode = '';
                    this.streetCode = '';
                }else if(this.deptLevel==4){
                    this.villageCode = ''
                    this.streetCode = session_adminInfo.streetCode
                }
                this.listMain.pageNo = 1
                this.authenForm = {
                    status:'',
                    name:'',
                    isCard:''
                }
                this.isReset = true
                this.chooseCondition = false
                this.getInfo()
            },
            // 区域选择
            changeTown(val){
                this.isReset = false;
                this.villageCode = val.villageCode
                this.streetCode = val.townCode
                this.areaCode = val.cityCode
            },
            // 审核
            handleEdit(val){
                this.$router.push({
                    path: `/authentication/passAuthentication/${val.memberId}`
                })
            },
            // 查看
            handleView(val){
                this.$router.push({
                    path: `/authentication/moreAuthentication/${val.memberId}`
                })
            },
            /*分页*/
            handleCurrentChange(val){
                this.listMain.pageNo = val
                this.getInfo()
            },
        }
    }
</script>

<style scoped>

</style>
