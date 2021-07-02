<template>
    <div>
        <!--列表-->
        <el-table :data="tableListData" border
                  v-loading = "showListLoading"
                  element-loading-background = "rgba(0, 0, 0, 0.3)"
                  element-loading-text = "数据加载中"
                  element-loading-spinner = "el-icon-loading">
            <el-table-column type="index" label="序号" width="80px" ></el-table-column>
            <el-table-column prop="name" label="发布人"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="complaintStatus" label="投诉状态">
                <template slot-scope="{row}">
                    <span v-if="row.complaintStatus==1">待审核</span>
                    <span v-if="row.complaintStatus==2">删除</span>
                    <span v-if="row.complaintStatus==3">不删除</span>
                </template>
            </el-table-column>
            <el-table-column prop="complaint" label="投诉类型">
                <template slot-scope="{row}">
                    <span v-if="row.complaint==1">色情淫秽</span>
                    <span v-if="row.complaint==2">辱骂他人</span>
                    <span v-if="row.complaint==3">广告欺诈</span>
                    <span v-if="row.complaint==3">地域攻击</span>
                    <span v-if="row.complaint==3">其他</span>
                </template>
            </el-table-column>
            <el-table-column prop="complaintContent" label="投诉内容"></el-table-column>
            <el-table-column prop="complaintName" label="投诉人"></el-table-column>
            <el-table-column prop="complaintTime" label="投诉时间" width="160px"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="updateView(scope.row)" type="text" v-if="isAuth('sys:dynamicset:audit')">审核</el-button>
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

        <el-dialog
                title="审核"
                :visible.sync="dialogVisible"
                @close="handleClose"
                width="400px">
            <el-form ref="addForm" :model="addForm" label-width="80px" >
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="addForm.auditContent" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleReset(3)">不删除</el-button>
                <el-button type="primary" @click="handleReset(2)">删除</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "dynamicSet",
        data(){
            return{
                showListLoading:false,
                tableListData:[],
                /*分页*/
                listMain: {
                    pageNo: 1,
                    totalPage: 0,
                    pageSize: 10,
                    total: 0
                },
                addForm:{
                    auditContent:''
                },
                id:'',
                dialogVisible:false
            }
        },
        mounted() {
            this.getInfo()
        },
        methods:{
            async getInfo(){
                this.showListLoading = true
                const session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let areaCode = session_adminInfo.areaCode || '';
                let streetCode = session_adminInfo.streetCode || '';
                let villageCode = session_adminInfo.villageCode || '';
                let dataObj = {
                    member_id:memberId,
                    areaCode:areaCode,
                    streetCode:streetCode,
                    villageCode:villageCode,
                    pageNumber:this.listMain.pageNo,
                    pageSize:this.listMain.pageSize
                }
                let res = await this.$http.dynamicList(dataObj);
                if(res.status==='success') {
                    this.showListLoading = false
                    this.tableListData = res.data.list
                    this.listMain.total = res.data.total
                    this.listMain.totalPage = res.data.pages
                }
            },
            /*审核*/
            updateView(val){
                this.dialogVisible = true
                this.id = val.id
            },
            handleClose(){
                this.dialogVisible = false
                this.addForm.auditContent = ''
            },
            async handleReset(val){
                let res = await this.$http.dynamicAudit({
                    id:this.id,
                    auditContent:this.addForm.auditContent,
                    complaintStatus:val
                })
                if(res.status==='success'){
                    this.$message({
                        type: 'success',
                        message: res.msg,
                        duration: 1000,
                    });
                    this.dialogVisible = false
                    this.getInfo()
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg,
                        duration: 1000,
                    });
                }
            },
            handleCurrentChange(val){
                this.listMain.pageNo = val;
                this.getInfo();
            }
        }
    }
</script>

<style scoped>

</style>
