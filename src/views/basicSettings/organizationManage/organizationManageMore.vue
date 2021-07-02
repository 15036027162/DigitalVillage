<template>
    <div>
        <div class="rightBtn">
            <el-button type="text" @click="addEdit">添加组织</el-button>
        </div>
        <el-form :inline="true" :model="organizationForm" class="demo-form-inline">
            <el-form-item label="区域选择：">
                <provinces @changeTown="changeTown"></provinces>
            </el-form-item>
            <el-form-item label="组织类型：">
                <el-select v-model="organizationForm.organization" placeholder="--请选择--">
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
                  element-loading-spinner = "el-icon-loading"
                  row-key="id"
                  :tree-props="{children: 'children'}">>
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.row)" type="text" v-if="!scope.row.child">添加子级</el-button>
                    <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
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
        <changeModel :title="'编辑组织部门'" ref="changeModel"></changeModel>
    </div>
</template>

<script>
    import provinces from "@/components/common/provinces";
    import addModel from "@/components/public/organeModel/addModel";
    import changeModel from "@/components/public/organeModel/changeModel";
    import {getStore} from "../../../config/mUtils";
    import {businessDeptList} from "../../../api/getData";
    export default {
        components: {provinces,changeModel,addModel},
        data() {
            return {
                organizationForm:{
                    region:'',
                    organization:''
                },
                /*列表*/
                tableListData: [{
                    id:1,
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    children: [{
                        id: 11,
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄',
                        child:'111',
                        children: [{
                            id: 13,
                            date: '2016-05-01',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1519 弄',
                            child:'111'
                        }, {
                            id: 14,
                            date: '2016-05-01',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1519 弄',
                            child:'111'
                        }]
                    }, {
                        id: 12,
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }]
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                showListLoading:false,
                /*分页*/
                listMain: {
                    pageNo: 1,
                    totalPage: 10,
                    pageSize: 10,
                    total: 100
                },
            }
        },
        mounted() {
            this.getInfo()
        },
        methods: {
            /*组织列表*/
            async getInfo(){
                let session_adminInfo = JSON.parse(getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let dataObj = {
                    memberId:memberId,
                    memberLevel:'',
                    districtsCode:'',
                    type:'',
                    pageNumber:this.listMain.pageNo,
                    pageSize:this.listMain.pageSize,
                }
                let res = await businessDeptList(dataObj);
                if(res.status==='success'){
                   // console.log(res);
                }
            },

            /*添加组织*/
            addEdit(){
                this.$refs.addModel.dialogVisible = true
            },

            /*查看成员*/
            searchMore(){
                this.$router.push({
                    name: "moreOrganization"
                });
            },

            /*地区下拉*/
            changeTown(){},

            handleView(){},
            handleEdit(val){
               // console.log(val);
                this.$refs.changeModel.dialogVisible = true
            },
            handleDelete(){},

            /*分页*/
            handleCurrentChange(){}
        },
    }
</script>
<style lang='less' scoped>
</style>