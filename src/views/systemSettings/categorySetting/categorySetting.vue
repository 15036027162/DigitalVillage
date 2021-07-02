<template>
    <div>
        <div class="rightBtn">
            <el-button type="primary" size="medium" plain @click="addCategory" v-if="isAuth('sys:category:add')">添加分类</el-button>
        </div>
        <!--查询-->
        <el-form :inline="true" :model="categoryForm" class="demo-form-inline">
            <el-form-item label="类别用途：">
                <el-select v-model="categoryForm.type" placeholder="--请选择--" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option label="信息分类" value="1"></el-option>
                    <!--<el-option label="表彰名称" value="2"></el-option>-->
                    <el-option label="场景分类" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium"  @click="searchCategory">查询</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
        <!--列表-->
        <el-table :data="tableListData" border
                  v-loading = "showListLoading"
                  element-loading-background = "rgba(0, 0, 0, 0.3)"
                  element-loading-text = "数据加载中"
                  element-loading-spinner = "el-icon-loading">
            <el-table-column prop="name" label="荣誉表彰名称"></el-table-column>
            <el-table-column prop="modifytime" label="更新时间"></el-table-column>
            <el-table-column prop="creator" label="操作人"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.row)" type="text" v-if="isAuth('sys:category:edit')">编辑</el-button>
                    <el-button @click="delView(scope.row)" type="text" v-if="isAuth('sys:category:del')">删除</el-button>
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

        <!--新增模块-->
        <el-dialog :title="changeName" :visible.sync="dialogVisible" width="30%">
            <el-form :inline="true" ref="statusForm" :model="addName" :rules="addNameRules">
                <el-form-item label="类别用途：" prop="purpose">
                    <el-select v-model="addName.purpose" placeholder="--请选择--" clearable :disabled="changeVisible">
                        <el-option label="--请选择--" value=""></el-option>
                        <el-option label="信息分类" value="1"></el-option>
                        <!--<el-option label="表彰名称" value="2"></el-option>-->
                        <el-option label="场景分类" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别名称：" prop="purpose">
                    <el-input v-model="addName.name" placeholder="请输入8字以内的名称" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSure('statusForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "categorySetting",
        data(){
            return{
                categoryForm:{
                    type:''
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
                dialogVisible:false,  //添加名称
                changeVisible:false,  //添加名称新增、修改
                addName:{
                    purpose:'',
                    name:'',
                    id:''
                },
                addNameRules:{
                    purpose: [{required: true, message: "请选择类别用途", trigger: "change"}],
                    name: [{required: true, message: "请输入8字以内的名称", trigger: "blur"}]
                },
                changeName:'',
                memberId:''
            }
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0;
            this.getInfo()
        },
        methods:{
            async getInfo(){
                let res = await this.$http.getDictionaryByType({
                    type: this.categoryForm.type,
                    pageNumber: this.listMain.pageNo
                })
                if (res.status === 'success') {
                    var resData = res.data || {};
                    this.listMain.total = resData.total || 0;
                    this.listMain.pageNo = resData.pageNum || 1;
                    this.listMain.totalPage = resData.pages || 0;
                    this.listMain.pageSize = resData.pageSize || 10;
                    this.tableListData = resData.list || [];
                }
            },
            /*新增*/
            addCategory(){
                this.dialogVisible = true
                this.changeVisible = false
                this.changeName = '添加分类'
                this.addName.purpose = ''
                this.addName.name = ''
                this.addName.id = ''
            },
            /*查询*/
            searchCategory(){
                if(this.categoryForm.type.length>0){
                    this.listMain.pageNo = 1
                    this.getInfo()
                }
            },
            /*重置*/
            resetForm(){
                this.categoryForm = {
                    type:''
                }
                this.listMain.pageNo = 1
                this.getInfo()
            },
            /*确定添加*/
            async handleSure(statusForm){
                let data = {}
                if(this.changeVisible==false){
                    data = {
                        style: 1,
                        memberId: this.memberId,
                        name: this.addName.name,
                        type: this.addName.purpose,
                    }
                }else{
                    data = {
                        style: 2,
                        memberId: this.memberId,
                        id: this.addName.id,
                        name: this.addName.name,
                        type: this.addName.purpose,
                    }
                }
                this.$refs[statusForm].validate(async (valid) => {
                    if (valid) {
                        if(this.addName.name<=0 || this.addName.name>8){
                            this.$message({
                                type: 'warning',
                                message: '类别名称不能为空/字数超限',
                                duration: 1000,
                            });
                        }else {
                            let res = await this.$http.saveDictionary(data)
                            if (res.status === 'success') {
                                this.dialogVisible = false
                                this.$message({
                                    type: 'success',
                                    message: res.msg || '发布成功',
                                    duration: 1000,
                                });
                                this.listMain.pageNo = 1
                                this.getInfo()
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg,
                                    duration: 1000,
                                });
                            }
                        }
                    }
                })
                // if(this.addName.name<=0 || this.addName.name>8){
                //     this.$message({
                //         type: 'warning',
                //         message: '类别名称不能为空/字数超限',
                //         duration: 1000,
                //     });
                // }else{
                //
                // }
            },
            /*编辑*/
            handleView(val){
                this.dialogVisible = true
                this.changeVisible = true
                this.changeName = '编辑分类'
                this.addName.id = val.id
                this.addName.name = val.name
                if(val.type==1){
                    this.addName.purpose = '信息分类'
                }else if (val.type==2){
                    this.addName.purpose = '表彰名称'
                }else if (val.type==3){
                    this.addName.purpose = '场景分类'
                }
            },
            /*删除*/
            delView(item){
                this.$alert("删除后，引用该分类的内容可能无法使用，请谨慎操作！", "删除类别", {
                    confirmButtonText: "确定删除",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(_ => {
                    this.goDelete(item)
                    done();
                }).catch(_ => {});
            },
            async goDelete(item) {
                const res = await this.$http.delDictionary({
                    memberId: this.memberId,
                    id: item.id
                });
                if (res.status === 'success') {
                    this.$message({
                        type: "success",
                        message: res.msg
                    });
                    this.listMain.pageNo = 1
                    this.getInfo()
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
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
