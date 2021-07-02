<template>
    <div>
        <div class="rightBtn">
            <el-button type="text" @click="addEdit" v-if="!roleDept">添加组织</el-button>
        </div>
        <el-form :inline="true" :model="organizationForm" class="demo-form-inline">
            <el-form-item label="区域选择：">
                <provinces @changeTown="changeTown"></provinces>
            </el-form-item>
            <el-form-item label="组织类型：">
                <el-select v-model="organizationForm.organization" placeholder="--请选择--" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option label="基层组织" value="1"></el-option>
                    <el-option label="经济组织" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchMore">查询</el-button>
            </el-form-item>
        </el-form>

        <!--列表-->
        <el-table :data="tableListData" border
                  v-loading = "showListLoading"
                  element-loading-background = "rgba(0, 0, 0, 0.3)"
                  element-loading-text = "数据加载中"
                  element-loading-spinner = "el-icon-loading">
            <el-table-column prop="deptName" label="部门名称"></el-table-column>
            <el-table-column prop="parentName" label="所属上级"></el-table-column>
            <el-table-column prop="typeName" label="组织类别"></el-table-column>
            <el-table-column prop="sort" label="显示顺序"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column label="组织成员">
                <template slot-scope="scope">
                    <el-button @click="seeMember(scope.row)" type="text">查看成员</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" v-if="!roleDept">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.row)" type="text" :disabled="roleDept">添加子级</el-button>
                    <el-button type="text" @click="handleEdit(scope.row)" :disabled="roleDept">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" :disabled="roleDept">删除</el-button>
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

        <!--编辑模态框-->
        <addModel :title="'添加组织部门'" ref="addModel"></addModel>
        <addModelChild :title="'添加组织部门'" ref="addModelChild"></addModelChild>
        <changeModel :title="'编辑组织部门'" ref="changeModel"></changeModel>
    </div>
</template>

<script>
    import provinces from "@/components/common/provinces";
    import addModel from "@/components/public/organeModel/addModel";
    import addModelChild from "@/components/public/organeModel/addModelChild";
    import changeModel from "@/components/public/organeModel/changeModel";
    export default {
        components: {provinces,changeModel,addModel,addModelChild},
        data() {
            return {
                organizationForm:{
                    organization:''
                },
                /*列表*/
                tableListData: [],
                showListLoading:true,
                /*分页*/
                listMain: {
                    pageNo: 1,
                    totalPage: 0,
                    pageSize: 10,
                    total: 0
                },
                chooseCondition:false,  //查询中间变量
                regionLevel:'', //地区level
                regionCode:'', //组织code
                memberId:0,
                roleDept:false,
            }
        },
        inject:['reload'],
        created() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0;
            this.regionLevel = this.$getStore('districtsLevel')
            this.regionCode = this.$getStore('districtsCode')
            // let roleList = session_adminInfo.role_list;

            /*权限*/
            // let index = roleList.findIndex(val => {
            //     return val.id == "1";
            // });
            // let index2 = roleList.findIndex(val => {
            //     return val.id == "2";
            // });
            // if (index >-1 || index2 > -1) {
            //     this.roleDept = false;
            // } else {
            //     this.roleDept = true;
            // }

            this.getInfo()
        },
        methods: {
            /*组织列表*/
            async getInfo(){
                this.showListLoading = true

                let dataObj = {}
                if(this.chooseCondition == false){
                    dataObj = {
                        memberId:this.memberId,
                        districtsLevel:this.regionLevel,
                        districtsCode:this.regionCode,
                        type:'',
                        pageNumber:this.listMain.pageNo,
                        pageSize:this.listMain.pageSize,
                    }
                }else{
                    dataObj = {
                        memberId:this.memberId,
                        districtsLevel:this.regionLevel,
                        districtsCode:this.regionCode,
                        type:this.organizationForm.organization,
                        pageNumber:this.listMain.pageNo,
                        pageSize:this.listMain.pageSize,
                    }
                }

                let res = await this.$http.businessDeptList(dataObj);
                if(res.status==='success'){
                    this.showListLoading = false
                    this.tableListData = res.data.list
                    this.listMain.total = res.data.total
                    this.listMain.totalPage = res.data.pages
                    if(this.tableListData){
                        this.tableListData.map(k=>{
                            if(k.type==1){
                                k.typeName = '基层组织'
                            }else{
                                k.typeName = '经济组织'
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

            /*添加组织*/
            addEdit(){
                this.$refs.addModel.dialogVisible = true
                this.$refs.addModel.memberId = this.memberId
            },

            /*查询*/
            searchMore(){
                let _this = this
                _this.listMain.pageNo = 1
                if(_this.regionCode || _this.organizationForm.organization){
                    _this.chooseCondition = true
                    _this.getInfo()
                }else{
                    _this.chooseCondition = false
                    _this.getInfo()
                }

            },

            /*查看成员*/
            seeMember(val){
                //console.log(val);
                this.$setStore('subMember',val)
                this.$router.push({
                    name: "moreOrganization"
                });
            },

            /*地区下拉*/
            changeTown(val){
                let _this = this
                if(val.villageCode){
                    _this.regionCode= val.villageCode
                    _this.regionLevel= 5
                }else if(val.townCode){
                    _this.regionCode= val.townCode
                    _this.regionLevel= 4
                }else if(val.cityCode){
                    _this.regionCode= val.cityCode
                    _this.regionLevel= 3
                }
            },

            /*添加子级*/
            handleView(val){
               // console.log(val);
                this.$refs.addModelChild.dialogVisible = true
                this.$refs.addModelChild.memberId = this.memberId
                this.$refs.addModelChild.regionLevel = val.deptLevel
                this.$refs.addModelChild.regionCode = val.deptDistrictsCode
                this.$refs.addModelChild.regionName = val.deptDistrictsName
                this.$refs.addModelChild.parentId = val.id
            },
            /*编辑*/
            handleEdit(val){
                this.$refs.changeModel.dialogVisible = true
                this.$refs.changeModel.memberId = this.memberId
                this.$refs.changeModel.parentId = val.id
                this.$refs.changeModel.organizationForm.name = val.deptName
                this.$refs.changeModel.organizationForm.order = val.sort
            },
            /*删除*/
            async handleDelete(val){
                let dataObj = {
                    memberId:this.memberId,
                    id:val.id
                }
                /*删除提示*/
                this.$alert('删除部门组织后不可恢复！你确定要删除 "'+val.deptName+'" 组织结构么？', '删除部门组织', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let res = await this.$http.businessDeptDelete(dataObj);
                    if(res.status==='success'){
                        this.$message({
                            type: 'success',
                            message: res.msg || '删除成功!'
                        });
                        this.reload()
                        this.getInfo()
                    }else{
                        /*this.$message({
                            type: 'error',
                            message: res.msg,
                            duration: 1000,
                        });*/
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
            }
        },
        watch:{
            tableListData(){
                return this.tableListData
            }
        }
    }
</script>
<style lang='less' scoped>
</style>