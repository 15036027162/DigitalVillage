<template>
    <div>
        <div class="rightBtn">
            <el-button type="text" @click="addRanking">新增</el-button>
        </div>
        <!--查询条件-->
        <el-form :inline="true" :model="rankingForm" class="demo-form-inline">
            <el-form-item label="发布日期：">
                <el-date-picker
                        v-model="rankingForm.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="rankingForm.organization" placeholder="--请选择--">
                    <el-option label="基层组织" value="1"></el-option>
                    <el-option label="经济组织" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发布主题：">
                <el-input v-model="rankingForm.theme" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" >查询</el-button>
            </el-form-item>
        </el-form>

        <!--列表-->
        <el-table :data="rankListData" border
                  v-loading = "showListLoading"
                  element-loading-background = "rgba(0, 0, 0, 0.3)"
                  element-loading-text = "数据加载中"
                  element-loading-spinner = "el-icon-loading">
            <el-table-column prop="" label="发布主题"></el-table-column>
            <el-table-column prop="" label="计算周期"></el-table-column>
            <el-table-column prop="" label="发布人"></el-table-column>
            <el-table-column prop="" label="发布日期"></el-table-column>
            <el-table-column prop="" label="状态"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.row)" type="text">查看</el-button>
                    <el-button type="text" @click="handleEdit(scope.row)" style="color: #F56C6C">取消修改</el-button>
                    <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="text" @click="handleUpload(scope.row)">发布</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "ranking",
        data(){
            return{
                rankingForm:{},
                rankListData:[],
                showListLoading:false,  //列表加载中...
            }
        },
        methods:{
            /*新增*/
            addRanking(){
                this.$router.push({
                    name: "addRanking"
                });
            },

            /*操作*/
            handleView(){},
            handleEdit(){},
            handleUpload(){},
        }
    }
</script>

<style scoped>

</style>