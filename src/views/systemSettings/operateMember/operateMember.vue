<template>
  <div>
    <div class="rightBtn">
      <el-button type="primary" size="medium" plain @click="addMember" v-if="isAuth('sys:operation:add')">添加操作员</el-button>
    </div>
    <el-form :inline="true" :model="organizationForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-if="deptLevel !=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="成员姓名：">
        <el-input v-model="organizationForm.name" placeholder="搜索成员名或手机号" clearable></el-input>
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
      <el-table-column prop="account" label="用户名"></el-table-column>
      <el-table-column prop="name" label="成员姓名"></el-table-column>
      <el-table-column prop="sexName" label="性别"></el-table-column>
      <el-table-column prop="linkMobile" label="联系电话"></el-table-column>
      <el-table-column prop="position" label="职务"></el-table-column>
      <el-table-column prop="typeName" label="角色"></el-table-column>
      <el-table-column prop="createTime" label="添加时间"></el-table-column>
      <el-table-column label="操作" width="150" v-if="!roleDept">
        <template slot-scope="scope">
          <el-button @click="handleView(scope.row)" type="text" v-if="isAuth('sys:operation:view')">查看</el-button>
          <el-button @click="updateView(scope.row)" type="text" v-if="isAuth('sys:operation:edit') && scope.row.memberShow">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)" v-if="isAuth('sys:operation:del') && scope.row.memberShow">删除</el-button>
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
  import provinces from "@/components/common/provinces";
  export default {
    components: {provinces},
    data() {
      return {
        organizationForm:{
          name:''
        },
        /*列表*/
        tableListData: [],
        showListLoading:false,
        /*分页*/
        listMain: {
          pageNo: 1,
          totalPage: 0,
          pageSize: 10,
          total: 0
        },
        memberId:0,
        chooseCondition:false,  //查询中间变量
        roleDept:false,
        villageCode:'',
        streetCode:'',
        areaCode:'',
        deptLevel:0,
        isReset:false
      }
    },
    inject:['reload'],
    created() {
      let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
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
      this.getInfo()
    },
    methods: {
      /*成员信息*/
      async getInfo(){
        this.showListLoading = true
        let dataObj = {}
        if(this.chooseCondition == false){
          dataObj = {
            memberId:this.memberId,
            villageCode:this.villageCode,
            streetCode:this.streetCode,
            areaCode:this.areaCode,
            param:'',
            pageNumber:this.listMain.pageNo,
            pageSize:this.listMain.pageSize,
          }
        }else{
          dataObj = {
            memberId:this.memberId,
            villageCode:this.villageCode,
            streetCode:this.streetCode,
            areaCode:this.areaCode,
            param:this.organizationForm.name,
            pageNumber:this.listMain.pageNo,
            pageSize:this.listMain.pageSize,
          }
        }

        let res = await this.$http.relationshipList(dataObj);
        if(res.status==='success'){
          this.showListLoading = false
          this.tableListData = res.data.list
          this.listMain.total = res.data.total
          this.listMain.totalPage = res.data.pages
          if(this.tableListData){
            this.tableListData.map(k=>{
              k.linkMobile = this.phoneNumFilterLogin(k.linkMobile)
              if(k.ssex==1){
                k.sexName = '男'
              }else{
                k.sexName = '女'
              }
              if(k.type==0){
                k.typeName = '普通管理员'
              }else if(k.type==1){
                k.typeName = '系统管理员'
              }else if(k.type==2){
                k.typeName = '系统管理员'
              }
              if(k.memberId==this.memberId){
                k.memberShow = false
              }else{
                k.memberShow = true
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

      /*查询*/
      searchManage(){
        this.listMain.pageNo = 1
        if(this.organizationForm.name || this.villageCode){
          this.chooseCondition = true
          this.getInfo()
        }else{
          this.chooseCondition = false
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
        this.organizationForm = {
          name:''
        }
        this.listMain.pageNo = 1
        this.isReset = true
        this.chooseCondition = false
        this.getInfo()
      },

      /*地区下拉*/
      changeTown(val){
        this.isReset = false
        this.villageCode = val.villageCode
        this.streetCode = val.townCode
        this.areaCode = val.cityCode
      },
      handleView(val){
        this.$router.push({
          path: `/operateMember/moreOperator/${val.memberId}`
        })
      },
      updateView(val){
        this.$router.push({
          path: `/operateMember/editOperator/${val.memberId}`
        })
      },
      /*删除*/
      async handleDelete(val){
        this.$alert('删除成员后，该用户的所有信息都将会被清空，你确定要删除吗？', '删除部门组织', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let res = await this.$http.relationshipDel({
            memberId:val.memberId,
            loginMemberId:this.memberId,
          });
          if(res.status==='success'){
            this.$message({
              type: 'success',
              message: res.msg || '删除成功',
              duration: 1000,
            });
            this.reload()
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

      /*详情新页面*/
      addMember() {
        this.$router.push({
          name: "addOperator"
        });
      },
    },
  }
</script>
<style lang='less' scoped>
</style>
