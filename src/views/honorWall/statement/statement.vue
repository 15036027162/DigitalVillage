<template>
    <div>
        <div class="rightBtn">
            <el-button type="primary" size="medium" plain @click="addState" v-if="isAuth('content:state:add')">发布</el-button>
        </div>
        <!--县、镇-->
        <div>
            <!--查询-->
            <el-form :inline="true" :model="stateForm" class="demo-form-inline" v-if="deptLevel !=5">
                <el-form-item label="区域选择：">
                    <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium"  @click="searchState">查询</el-button>
                    <el-button size="medium" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>

            <!--列表-->
            <el-table :data="tableListData" border
                      element-loading-background = "rgba(0, 0, 0, 0.3)"
                      element-loading-text = "数据加载中"
                      element-loading-spinner = "el-icon-loading">
                <el-table-column prop="villageName" label="村庄"></el-table-column>
                <el-table-column prop="modifier" label="操作人"></el-table-column>
                <el-table-column prop="modifyTime" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleView(scope.row)" type="text" v-if="isAuth('content:state:view')">查看</el-button>
                        <el-button @click="changeView(scope.row)" type="text" v-if="isAuth('content:state:edit')">编辑</el-button>
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
    </div>
</template>

<script>
    import provinces from '@/components/common/provinces'
    export default {
        name: "statement",
        components:{provinces},
        data(){
            return{
                roleDept:false,
                areaCode:'',
                streetCode:'',
                villageCode:'',
                stateForm:{},
                searchShow:false,
                tableListData:[],
                /*分页*/
                listMain: {
                    pageNo: 1,
                    totalPage: 0,
                    pageSize: 10,
                    total: 0
                },
                /*发布*/
                addStateForm:{
                    desc:'',
                },
                rulesState:{
                    desc:[
                        { required: true, message: '请输入说明内容', trigger: 'blur' },
                        { max: 300, message: '字符超过限制', trigger: 'blur' }
                    ],
                },
                stateId:'',
                memberId: '',
                type:'1',
                deptLevel:0,
                isReset:false
            }
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            let roleList = session_adminInfo.role_list;
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
            if(session_adminInfo.deptLevel=='5'){
                /*权限*/
                let index2 = roleList.findIndex(val => {
                    return val.id == "7";
                });
                if (index2 > -1) {
                    this.roleDept = false;
                } else {
                    this.roleDept = true;
                }
            }else{
                this.roleDept = true;
            }
            this.getInfo()
        },
        methods:{
            /*列表信息*/
            async getInfo(){
                let data = {}
                data = {
                    areaCode:this.areaCode,
                    streetCode:this.streetCode,
                    villageCode:this.villageCode,
                    pageNumber:this.listMain.pageNo,
                }
                let res = await this.$http.honorstatementList(data)
                if(res.status==='success') {
                    this.tableListData = res.data.list
                    this.listMain.total = res.data.total
                    this.listMain.totalPage = res.data.pages
                }
                // let resInfo = await this.$http.getByVillageCode({
                //     villageCode:this.villageCode,
                // })
                // if(resInfo.status==='success'){
                //     if(resInfo.data.length>0){
                //         this.stateId = resInfo.data[0].id
                //         this.addStateForm.desc = resInfo.data[0].details
                //         if(resInfo.data[0].details){
                //             this.type = '2'
                //         }else{
                //             this.type = '1'
                //         }
                //     }
                // }
            },

            /*新增*/
            addState(){
                this.$router.push({
                    name: "addStatement"
                });
            },

            /*查询*/
            searchState(){
                this.listMain.pageNo = 1
                this.getInfo()
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
                this.listMain.pageNo = 1
                this.isReset = true
                this.getInfo()
            },

            /*地区选择*/
            changeTown(val){
                let _this = this
                _this.isReset = true
                _this.areaCode= val.cityCode
                _this.streetCode= val.townCode
                _this.villageCode= val.villageCode
            },

            /*查看*/
            handleView(val){
                this.$router.push({
                    path: `/statement/moreStatement/${val.id}`
                });
            },
            /*编辑*/
            changeView(val){
                this.$router.push({
                    path: `/statement/editStatement/${val.id}`
                });
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
