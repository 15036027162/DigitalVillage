<template>
    <div>
        <div class="rightBtn">
            <el-button type="primary" size="medium" plain @click="addRecognition" v-if="isAuth('content:comment:add')">添加</el-button>
        </div>
        <!--查询-->
        <el-form :inline="true" :model="honerRecognitionForm" class="demo-form-inline">
            <el-form-item label="区域选择：" v-if="deptLevel !=5">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
            </el-form-item>
            <!--<el-form-item label="家庭或个人：">
                <el-select v-model="honerRecognitionForm.billState" placeholder="&#45;&#45;请选择&#45;&#45;" clearable>
                    <el-option label="&#45;&#45;请选择&#45;&#45;" value=""></el-option>
                    <el-option label="家庭" value="1"></el-option>
                    <el-option label="个人" value="2"></el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item label="显示状态：">
                <el-select v-model="honerRecognitionForm.state" placeholder="--请选择--" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option label="置顶显示" value="1"></el-option>
                    <el-option label="显示" value="2"></el-option>
                    <el-option label="隐藏" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="表彰名称：">
                <el-select v-model="honerRecognitionForm.type" placeholder="--请选择--" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    <!--<el-option label="美丽庭院" value="1"></el-option>
                    <el-option label="最佳清洁户" value="2"></el-option>
                    <el-option label="最佳垃圾分类户" value="3"></el-option>
                    <el-option label="荣誉村民" value="4"></el-option>
                    <el-option label="十星级文明户" value="5"></el-option>
                    <el-option label="卫生清洁户" value="6"></el-option>
                    <el-option label="五星党员" value="7"></el-option>-->
                </el-select>
            </el-form-item>
            <el-form-item label="主题名称：">
                <el-input v-model="honerRecognitionForm.title" placeholder="输入发布的主题名称" style="width: 300px" clearable></el-input>
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
            <el-table-column prop="publishRegion" label="所属村组"></el-table-column>
            <el-table-column prop="typeExplain" label="表彰名称"></el-table-column>
            <el-table-column prop="publishName" label="荣誉获得者"></el-table-column>
            <el-table-column prop="title" label="主题名称"></el-table-column>
            <el-table-column prop="createTime" label="发布日期"></el-table-column>
            <!--<el-table-column prop="modifyTime" label="结束时间"></el-table-column>
            <el-table-column prop="creator" label="发布人"></el-table-column>-->
            <el-table-column prop="statusName" label="荣誉墙状态"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.row)" type="text" v-if="isAuth('content:comment:view')">查看</el-button>
                    <el-button type="text" @click="showStatus(scope.row)" v-if="isAuth('content:comment:dispaly')">显示设置</el-button>
                    <!--<el-button type="text" @click="dialogVisible = true" v-if="scope.row.status==1 && !roleDept">显示设置</el-button>-->
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

        <!--显示选择-->
        <el-dialog
                title="显示设置显示方式"
                :visible.sync="dialogVisible"
                width="30%">
            <el-form ref="statusForm" :model="statusForm">
                <el-form-item>
                    <el-radio-group v-model="statusForm.status">
                        <el-radio :label="'1'">置顶显示</el-radio>
                        <el-radio :label="'2'">显示</el-radio>
                        <el-radio :label="'3'">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureChange()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import provinces from '@/components/common/provinces'
    export default {
        components:{provinces},
        name: "honerRecognition",
        data(){
            return{
                honerRecognitionForm:{
                    theme:'',
                    state:'',
                    type:'',
                    title:'',
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
                villageCode:'',
                searchShow:false,
                roleDept:false,
                dialogVisible:false,
                statusForm:{
                    id:1,
                    status:'1'
                },
                options:[],
                memberId:'',
                deptLevel:0,
                isReset: false
            }
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0;
            let roleList = session_adminInfo.role_list;
            this.villageCode = session_adminInfo.deptDistrictsCode || 0;
            this.deptLevel = session_adminInfo.deptLevel
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
            this.getName()
        },
        methods:{
            /*获取名称*/
            async getName() {
                // let res = await this.$http.getSelectDictionary({type: "2"})
                let res = await this.$http.getCommendation()
                if (res.status === 'success') {
                    this.options = res.data
                }
            },
            /*获取列表*/
            async getInfo(){
                let data = {}
                if(this.searchShow==false){
                    data = {
                        //member_id:memberId,
                        type:'',
                        state:'',
                        title:'',
                        pageNumber:this.listMain.pageNo,
                        pageSize:this.listMain.pageSize,
                        code:this.villageCode
                    }
                }else{
                    data = {
                        //member_id:memberId,
                        type:this.honerRecognitionForm.type,
                        state:this.honerRecognitionForm.state,
                        title:this.honerRecognitionForm.title,
                        pageNumber:this.listMain.pageNo,
                        pageSize:this.listMain.pageSize,
                        code:this.villageCode
                    }
                }
                let res = await this.$http.commendationList(data)
                if(res.status==='success'){
                    this.tableListData = res.data.list
                    this.listMain.total = res.data.total
                    this.listMain.totalPage = res.data.pages
                    this.tableListData.map(k=>{
                        if(k.status==1){
                            k.statusName = '置顶显示'
                        }else if (k.status==2){
                            k.statusName = '显示'
                        }else{
                            k.statusName = '隐藏'
                        }
                        if(k.modifyTime){
                           return  k.modifyTime
                        }else{
                            k.modifyTime = '--'
                        }
                    })
                }
            },

            /*查询*/
            searchManage(){
                this.listMain.pageNo = 1
                if(this.honerRecognitionForm.theme||this.honerRecognitionForm.billState||this.villageCode){
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
                this.villageCode = session_adminInfo.deptDistrictsCode || 0;
                this.honerRecognitionForm = {
                    theme:'',
                    state:'',
                    type:'',
                    title:'',
                }
                this.listMain.pageNo = 1
                this.isReset = true
                this.searchShow = false
                this.getInfo()
            },

            /*新增*/
            addRecognition(){
                this.$router.push({
                    name: "addHonerRecognition"
                });
            },

            /*查看*/
            handleView(val){
                this.$router.push({
                    path: `/honerRecognition/moreRecognition/${val.id}`
                });
            },

            /*区域选择*/
            changeTown(val){
                let _this = this
                _this.isReset = false;
                if(val.villageCode){
                    _this.villageCode= val.villageCode
                }else if(val.townCode){
                    _this.villageCode= val.townCode
                }else if(val.cityCode){
                    _this.villageCode= val.cityCode
                }
            },

            /*更新*/
            showStatus(val){
                this.dialogVisible = true
                this.statusForm.status = val.status
                this.statusForm.id = val.id
            },
            async sureChange(){
                let res = await this.$http.updateCommendationFinish({
                    id:this.statusForm.id,
                    member_id:this.memberId,
                    status:this.statusForm.status
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
