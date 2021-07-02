<template>
  <div>
    <div class="rightBtn">
      <el-button type="text" @click="addMember" v-if="!roleDept">添加成员</el-button>
    </div>
    <el-form :inline="true" :model="organizationForm" class="demo-form-inline">
      <el-form-item label="区域选择：">
        <provinces @changeTown="changeTown"></provinces>
      </el-form-item>
      <el-form-item label="部门名称：">
        <el-select v-model="organizationForm.organization" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value=""></el-option>
          <el-option v-for="(item,index) in organizationForm.organizationList" :label="item.deptName" :key="index" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="成员姓名：">
        <el-input v-model="organizationForm.name" placeholder="搜索成员名或手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium"  @click="searchManage">查询</el-button>
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
      <el-table-column prop="newMobile" label="手机号"></el-table-column>
      <el-table-column prop="positionName" label="职务"></el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column prop="createTime" label="添加时间"></el-table-column>
      <el-table-column label="操作" width="150" v-if="!roleDept">
        <template slot-scope="scope">
          <el-button @click="handleView(scope.row)" type="text">修改</el-button>
          <el-button type="text" @click="handleEdit(scope.row,'1')" style="color: #F56C6C" v-if="scope.row.state=='0'">禁用</el-button>
          <el-button type="text" @click="handleEdit(scope.row,'0')" v-if="scope.row.state=='1'">启用</el-button>
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
  </div>
</template>

<script>
  import provinces from "@/components/common/provinces";
  export default {
    components: {provinces},
    data() {
      return {
        organizationForm:{
          name:'',
          organization:'',
          organizationList:[]
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
        regionCode:'',
      }
    },
    inject:['reload'],
    created() {
      let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
      this.memberId = session_adminInfo.memberId || 0;
      this.regionCode = this.$getStore('districtsCode')
      //let roleList = session_adminInfo.role_list;
      /*权限*/
      // let index = roleList.findIndex(val => {
      //   return val.id == "1";
      // });
      // let index2 = roleList.findIndex(val => {
      //   return val.id == "2";
      // });
      // if (index >-1 || index2 > -1) {
      //   this.roleDept = false;
      // } else {
      //   this.roleDept = true;
      // }
      this.getJob()
      this.getInfo()
    },
    methods: {
      /*成员信息*/
      async getInfo(){
        this.showListLoading = true

        let dataObj = {}
        //let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
        if(this.chooseCondition == false){
          dataObj = {
            memberId:this.memberId,
            memberLevel:this.$getStore('districtsLevel'),
            districtsCode:this.regionCode,
            deptId:'',
            param:'',
            pageNumber:this.listMain.pageNo,
            pageSize:this.listMain.pageSize,
          }
        }else{
          dataObj = {
            memberId:this.memberId,
            memberLevel:this.$getStore('districtsLevel'),
            districtsCode:this.regionCode,
            deptId:this.organizationForm.organization,
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
              k.newMobile = this.phoneNumFilterLogin(k.mobile )
              if(k.type==1){
                k.typeName = '基层组织'
              }else{
                k.typeName = '经济组织'
              }
              if(k.ssex==1){
                k.sexName = '男'
              }else{
                k.sexName = '女'
              }
              if(k.roles){
                var str = ''
                k.roles.map(m=>{
                  str += m.roleName +' '
                })
                k.roleName = str
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

      /*获取部门*/
      async getJob(code){
        let sessionCode = ''
        let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
        if(code){
          sessionCode = code
        }else{
          sessionCode = session_adminInfo.deptDistrictsCode
        }
        let res = await this.$http.getDeptsByDistricts({code:sessionCode});
        if(res.status==='success'){
          this.organizationForm.organizationList = res.data
        }
      },

      /*查询*/
      searchManage(){
        this.listMain.pageNo = 1
        if(this.organizationForm.name || this.organizationForm.organization || this.regionCode){
          this.chooseCondition = true
          this.getInfo()
        }else{
          this.chooseCondition = false
          this.getInfo()
        }
      },

      /*地区下拉*/
      changeTown(val){
        let _this = this
        let code = ''
        if(val.villageCode){
          code = val.villageCode
          _this.regionCode = val.villageCode
        }else if(val.townCode){
          code = val.townCode
          _this.regionCode = val.townCode
        }else if(val.cityCode){
          code = val.cityCode
          _this.regionCode = val.cityCode
        }
        _this.getJob(code)
        //_this.getInfo()
      },

      handleView(val){
        this.$router.push({name: "changeMember"});
        this.$setStore('childId',val.memberId)
      },
      /*禁用*/
      async handleEdit(val,num){
        let disableTxt = ''
        let disableTitle = ''
        let disableSuccess = ''
        if(num==1){
          disableTxt = '禁用后该成员将无法登录。确认要禁用吗？'
          disableTitle = '禁用成员'
          disableSuccess = '已被成功禁用'
        }else{
          disableTxt = '该成员将被重新启用。确认要启用吗？'
          disableTitle = '启用成员'
          disableSuccess = '已被成功启用'
        }
        this.$alert(disableTxt, disableTitle, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let res = await this.$http.relationshipDisabled({
            memberId:val.memberId,
            loginMemberId:this.memberId,
            state:num,
          });
          if(res.status==='success'){
            this.$message({
              type: 'success',
              message: res.msg || disableSuccess,
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
          name: "editMember"
        });
      },
    },
  }
</script>
<style lang='less' scoped>
</style>