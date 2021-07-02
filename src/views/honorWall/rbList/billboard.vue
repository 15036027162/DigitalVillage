<template>
    <div>
        <div class="rightBtn">
            <el-button type="primary" size="medium" plain @click="addBillboard" v-if="isAuth('content:black:add')">添加</el-button>
        </div>
        <!--查询-->
        <el-form :inline="true" :model="billboardForm" class="demo-form-inline">
            <el-form-item label="区域选择：" v-if="deptLevel !=5">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
            </el-form-item>
            <!--<el-form-item label="红黑榜：">
                <el-select v-model="billboardForm.type" placeholder="&#45;&#45;请选择&#45;&#45;" clearable>
                    <el-option label="&#45;&#45;请选择&#45;&#45;" value=""></el-option>
                    <el-option label="红榜" value="1"></el-option>
                    <el-option label="黑榜" value="2"></el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item label="状态：">
                <el-select v-model="billboardForm.status" placeholder="--请选择--" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option label="公示中" value="0"></el-option>
                    <el-option label="已撤榜" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名：">
                <el-input v-model="billboardForm.name" placeholder="输入姓名" style="width: 300px" clearable></el-input>
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
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="memberIdRegion" label="所属村组"></el-table-column>
            <!--<el-table-column prop="typeName" label="红黑榜"></el-table-column>-->
            <el-table-column prop="title" label="上榜理由"></el-table-column>
            <el-table-column prop="createTime" label="发布日期"></el-table-column>
            <el-table-column prop="statusName" label="状态"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.row)" type="text" v-if="isAuth('content:black:view')">查看</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)" v-if="scope.row.status==0&&isAuth('content:black:revoke')">撤榜</el-button>
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
    import provinces from '@/components/common/provinces'
    export default {
        name: "billboard",
        components:{provinces},
        data(){
            return{
                billboardForm:{
                    name:'',
                    type:'',
                    status:'',
                },
                tableListData:[],
                showListLoading:false,
                /*分页*/
                listMain: {
                    pageNo: 1,
                    totalPage: 0,
                    pageSize: 10,
                    total: 0
                },
                searchShow:false,
                areaCode:'', //区域选择
                villageCode:'', //区域选择
                streetCode:'', //区域选择
                deptLevel:0,
                isReset:false
            }
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
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
            /*红黑榜*/
            async getInfo(){
                let data = {}
                if(this.searchShow==false){
                    data = {
                        areaCode:this.areaCode,
                        streetCode:this.streetCode,
                        villageCode:this.villageCode,
                        name:'',
                        type:'',
                        status:'',
                        pageNumber:this.listMain.pageNo,
                        pageSize:this.listMain.pageSize,
                    }
                }else{
                    data = {
                        areaCode:this.areaCode,
                        streetCode:this.streetCode,
                        villageCode:this.villageCode,
                        name:this.billboardForm.name,
                        type:this.billboardForm.type,
                        status:this.billboardForm.status,
                        pageNumber:this.listMain.pageNo,
                        pageSize:this.listMain.pageSize,
                    }
                }
                let res = await this.$http.rankList(data)
                if(res.status==='success'){
                    this.tableListData = res.data.list
                    this.listMain.total = res.data.total
                    this.listMain.totalPage = res.data.pages
                    if(this.tableListData){
                        this.tableListData.map(k=>{
                            if(k.type==1){
                                k.typeName = '红榜'
                            }else{
                                k.typeName = '黑榜'
                            }
                            if(k.status==0){
                                k.statusName = '公示中'
                            }else{
                                k.statusName = '已撤销'
                            }
                            if(k.endTime){
                                return  k.endTime
                            }else{
                                k.endTime = '--'
                            }
                        })
                    }

                }

            },

            /*查询*/
            searchManage(){
                this.listMain.pageNo = 1
                if(this.billboardForm.name||this.billboardForm.type||this.status||this.areaCode||this.streetCode||this.villageCode){
                    this.searchShow = true
                    this.getInfo()
                }else{
                    this.searchShow = false
                    this.getInfo()
                }
            },
            /*重置*/
            resetForm(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                if (this.deptLevel == 3) {
                    this.villageCode = '';
                    this.streetCode = '';
                }else if(this.deptLevel == 4){
                    this.villageCode = '';
                    this.streetCode = session_adminInfo.streetCode;
                }
                this.billboardForm = {
                    name:'',
                    type:'',
                    status:'',
                }
                this.listMain.pageNo = 1
                this.isReset = true
                this.searchShow = false
                this.getInfo()
            },

            /*新增*/
            addBillboard(){
                this.$router.push({
                    name: "addBillboard"
                });
            },

            /*查看*/
            handleView(val){
                this.$router.push({
                    path: `/billboard/moreBillboard/${val.id}`
                });
                // if(val.type==1){
                //     this.$router.push({
                //         path: `/billboard/moreBillRed/${val.id}`
                //     });
                // }else{
                //     this.$router.push({
                //         path: `/billboard/moreBillBlack/${val.id}`
                //     });
                // }
            },

            /*结束*/
            async handleDelete(val){
                this.$alert("你确定要撤销该用户的公示情况么？", "撤榜", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(async() => {
                    let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                    let memberId = session_adminInfo.memberId || 0;
                    let res = await this.$http.rankListUpdateState({
                        memberId:memberId,
                        id:val.id
                    })
                    if(res.status==='success'){
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            duration: 1000,
                        });
                        this.getInfo()
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg,
                            duration: 1000,
                        });
                    }
                }).catch(()=> {});
            },

            /*区域选择*/
            changeTown(val){
                let _this = this
                _this.isReset = false;
                _this.areaCode= val.cityCode
                _this.streetCode= val.townCode
                _this.villageCode= val.villageCode
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
