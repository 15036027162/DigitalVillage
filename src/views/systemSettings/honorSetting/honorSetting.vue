<template>
    <div>
        <div class="rightBtn">
            <el-button type="primary" size="medium" plain @click="addHonor" v-if="isAuth('sys:commentset:add')">添加</el-button>
        </div>
        <!--列表-->
        <el-table :data="tableListData" border
                  v-loading = "showListLoading"
                  element-loading-background = "rgba(0, 0, 0, 0.3)"
                  element-loading-text = "数据加载中"
                  element-loading-spinner = "el-icon-loading">
            <el-table-column prop="name" label="荣誉表彰名称"></el-table-column>
            <el-table-column prop="name" label="已获得徽章">
                <template slot-scope="scope">
                    <img v-if="scope.row.winUrl" :src="scope.row.winUrl" alt width="50px" height="50px" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="未获得徽章">
                <template slot-scope="scope">
                    <img v-if="scope.row.noWinUrl" :src="scope.row.noWinUrl" alt width="50px" height="50px" />
                </template>
            </el-table-column>
            <!--<el-table-column prop="name" label="背景图">
                <template slot-scope="scope">
                    <img v-if="scope.row.backUrl" :src="scope.row.backUrl" alt width="50px" height="50px" />
                </template>
            </el-table-column>-->
            <el-table-column prop="modifyTime" label="更新时间"></el-table-column>
            <el-table-column prop="creatorName" label="操作人"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="updateView(scope.row)" type="text" v-if="isAuth('sys:commentset:edit')">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-if="isAuth('sys:commentset:del')">删除</el-button>
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
        name: "honorSetting",
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
                }
            }
        },
        created() {
            this.getInfo()
        },
        methods:{
            async getInfo(){
                let dataObj = {
                    pageNumber:this.listMain.pageNo,
                    pageSize:this.listMain.pageSize
                }
                let res = await this.$http.commendationSetList(dataObj);
                if(res.status==='success') {
                    this.showListLoading = false
                    this.tableListData = res.data.list
                    this.listMain.total = res.data.total
                    this.listMain.totalPage = res.data.pages
                }
            },
            // 新增
            addHonor(){
                this.$router.push({
                    name: "addHonor"
                });
            },
            // 编辑
            updateView(val){
                this.$router.push({
                    path: `/districtMember/editHonor/${val.id}`
                })
            },
            // 删除
            async handleDelete(val){
                this.$alert('删除后影响已发布的表彰信息，请谨慎操作！', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let res = await this.$http.commendationSetDelete({
                        id:val.id
                    });
                    if(res.status==='success'){
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            duration: 1000,
                        });
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
        }
    }
</script>

<style scoped>

</style>
