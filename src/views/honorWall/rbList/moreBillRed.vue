<template>
    <div class="moreBill">
        <div style="margin-bottom: 20px">
            <span style="font-weight: 600">{{title}}</span>
            <el-divider></el-divider>
            <span>上榜人员名单：</span>
        </div>

        <!--列表-->
        <el-table :data="tableListData" border
                  v-loading = "showListLoading"
                  element-loading-background = "rgba(0, 0, 0, 0.3)"
                  element-loading-text = "数据加载中"
                  element-loading-spinner = "el-icon-loading">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="ssexName" label="性别"></el-table-column>
            <el-table-column prop="groupName" label="所属村组"></el-table-column>
            <el-table-column prop="remarks" label="上榜理由"></el-table-column>
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
        name: "moreBillRed",
        data(){
            return{
                title:'',
                tableListData:[],
                showListLoading:false,
                /*分页*/
                listMain: {
                    pageNo: 1,
                    totalPage: 0,
                    pageSize: 10,
                    total: 0
                },
            }
        },
        mounted() {
            this.getInfo()
        },
        methods:{
            /*获取列表*/
            async getInfo(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let res = await this.$http.rankListById({
                    memberId:memberId,
                    id:this.$route.params.id,
                    pageNumber:this.listMain.pageNo,
                    pageSize:this.listMain.pageSize,
                })
                if(res.status==='success'){
                    this.title = res.data.title
                    this.tableListData = res.data.memberList.list
                    this.listMain.total = res.data.memberList.total
                    this.listMain.totalPage = res.data.memberList.pages
                    if(this.tableListData){
                        this.tableListData.map(k=>{
                            if(k.ssex==1){
                                k.ssexName = '男'
                            }else{
                                k.ssexName = '女'
                            }
                        })
                    }
                }
            },

            /*分页*/
            handleCurrentChange(val){
                this.listMain.pageNo = val;
                this.getInfo();
            }
        }
    }
</script>

<style scoped>

</style>