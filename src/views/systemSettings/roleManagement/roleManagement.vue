<template>
    <div>
        <div class="rightBtn">
            <el-button type="primary" size="medium" plain @click="addRole" v-if="isAuth('sys:role:add')">添加角色</el-button>
        </div>
        <el-form :inline="true" :model="organizationForm" class="demo-form-inline">
            <el-form-item label="角色名称：">
                <el-input v-model="organizationForm.name" placeholder="输入角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="organizationForm.scene" placeholder="处理状态">
                    <el-option label="--请选择--" value></el-option>
                    <el-option label="禁用" :value="1"></el-option>
                    <el-option label="启用" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium"  @click="searchManage">查询</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <!--列表-->
        <el-table :data="tableListData" border
                  v-loading = "showListLoading"
                  element-loading-background = "rgba(0, 0, 0, 0.3)"
                  element-loading-text = "数据加载中"
                  element-loading-spinner = "el-icon-loading">
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="stateName" label="状态"></el-table-column>
            <el-table-column prop="creator" label="操作人"></el-table-column>
            <el-table-column prop="modifyTime" label="更新时间"></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.row)" type="text" v-if="isAuth('sys:role:view')">查看</el-button>
                    <el-button type="text" @click="handleEdit(scope.row,'1')" style="color: #F56C6C" v-if="scope.row.isEnable=='0'&&isAuth('sys:role:able')">禁用</el-button>
                    <el-button type="text" @click="handleEdit(scope.row,'0')" v-if="scope.row.isEnable=='1'&&isAuth('sys:role:able')">启用</el-button>
                    <el-button @click="updateView(scope.row)" type="text" v-if="isAuth('sys:role:edit')">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-if="isAuth('sys:role:del')">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
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
    export default {
        data() {
            return {
                organizationForm:{
                    name:'',
                    scene:'',
                },
                /*列表*/
                tableListData: [],
                showListLoading:false,
                /*分页*/
                listMain: {
                    pageNo: 1,
                    totalPage: 0,
                    pageSize: 10,
                    total: 0
                },
                memberId:0,
                chooseCondition:false,  //查询中间变量
                roleDept:false,
                villageCode:''
            }
        },
        inject:['reload'],
        created() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.villageCode = session_adminInfo.villageCode || '';
            this.memberId = session_adminInfo.memberId || 0;
            this.getInfo()
        },
        methods: {
            /*成员信息*/
            async getInfo(){
                this.showListLoading = true
                let dataObj = {}
                if(this.chooseCondition == false){
                    dataObj = {
                        villageCode:this.villageCode,
                        isEnable:'',
                        roleName:'',
                        pageNumber:this.listMain.pageNo
                    }
                }else{
                    dataObj = {
                        villageCode:this.villageCode,
                        isEnable:this.organizationForm.scene,
                        roleName:this.organizationForm.name,
                        pageNumber:this.listMain.pageNo
                    }
                }

                let res = await this.$http.getRoleByDistricts(dataObj);
                if(res.status==='success'){
                    this.showListLoading = false
                    this.tableListData = res.data.list
                    this.listMain.total = res.data.total
                    this.listMain.totalPage = res.data.pages
                    if(this.tableListData){
                        this.tableListData.map(k=>{
                            if(k.isEnable==1){
                                k.stateName = '禁用'
                            }else{
                                k.stateName = '启用'
                            }
                            if(k.roles){
                                var str = ''
                                k.roles.map(m=>{
                                    str += m.roleName +' '
                                })
                                k.roleName = str
                            }
                        })
                    }
                    /*权限*/
                    if(res.data.isHide=='0'){
                        this.roleDept = true;
                    }else{
                        this.roleDept = false;
                    }
                }
            },

            /*查询*/
            searchManage(){
                this.listMain.pageNo = 1
                if(this.organizationForm.name || this.organizationForm.scene==0 || this.organizationForm.scene==1){
                    this.chooseCondition = true
                    this.getInfo()
                }else{
                    this.chooseCondition = false
                    this.getInfo()
                }
            },
            /*重置*/
            resetForm(){
                this.organizationForm = {
                    name:'',
                    scene:'',
                }
                this.listMain.pageNo = 1
                this.chooseCondition = false
                this.getInfo()
            },

            handleView(val){
                this.$router.push({
                    path: `/roleManagement/moreRole/${val.id}`
                });
            },
            /*禁用*/
            async handleEdit(val,num){
                let disableTxt = ''
                let disableTitle = ''
                let disableSuccess = ''
                if(num==1){
                    disableTxt = '禁用后该成员将无法登录。确认要禁用吗？'
                    disableTitle = '禁用成员'
                    disableSuccess = '已被成功禁用'
                }else{
                    disableTxt = '该成员将被重新启用。确认要启用吗？'
                    disableTitle = '启用成员'
                    disableSuccess = '已被成功启用'
                }
                this.$alert(disableTxt, disableTitle, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let res = await this.$http.roleSave({
                        type:2,
                        id:val.id,
                        member_id:this.memberId,
                        loginMemberId:this.memberId,
                        isEnable:num,
                    });
                    if(res.status==='success'){
                        this.$message({
                            type: 'success',
                            message: res.msg || disableSuccess,
                            duration: 1000,
                        });
                        this.reload()
                        this.getInfo()
                    }else{
                        this.$alert(res.msg, '操作失败！', {
                            confirmButtonText: '我知道了',
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            /*编辑*/
            updateView(val){
                this.$router.push({
                    path: `/roleManagement/editRole/${val.id}`
                });
            },
            /*删除*/
            async handleDelete(val){
                this.$alert('删除成员后，该用户的所有信息都将会被清空，你确定要删除吗？', '删除部门组织', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let res = await this.$http.roleSave({
                        type:2,
                        id:val.id,
                        is_del:1
                    })
                    if(res.status==='success'){
                        this.$message({
                            type: 'success',
                            message: res.msg || '删除成功',
                            duration: 1000,
                        });
                        this.reload()
                        this.getInfo()
                    }else{
                        this.$alert(res.msg, '操作失败！', {
                            confirmButtonText: '我知道了',
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },

            /*分页*/
            handleCurrentChange(val){
                this.listMain.pageNo = val
                this.getInfo()
            },

            /*详情新页面*/
            addRole() {
                this.$router.push({
                    name: "addRole"
                });
            },
        },
    }
</script>
<style lang='less' scoped>
</style>
