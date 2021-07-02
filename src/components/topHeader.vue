<!--  -->
<template>
  <div class="header">
    <!-- <div class="isCollapsediv" @click="updateCollapse">
      <i class="el-icon-s-unfold" v-if="isCollapse"></i>
      <i class="el-icon-s-fold" v-else></i>
    </div> -->
    <div class="headerTitle" >韶山市荣誉值管理中心</div>

    <div class="headerRight">
  
      <img v-if="adminUserInfo.avatar" :src="adminUserInfo.avatar" alt class="user-avator"/>
      <img v-else src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt class="user-avator"/>
      <el-dropdown @command="selectOption">
        <span class="el-dropdown-link">
          {{adminUserInfo.name}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="1">个人信息</el-dropdown-item>
          <el-dropdown-item :command="2">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapState, mapMutations } from "vuex";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      activeIndex: '1',
      adminUserInfo:{},
      isPower:false,
    };
  },
  computed: {
    ...mapState(["isCollapse","topMenu","topMenuActiveName","isAuthentication"])
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  mounted() {
    let _this = this;
    _this.getUserInfo()
    // 检查是否登录
    // let token = _this.$getStore('tokenId') || '';
    // let hasLogin = _this.$cookies.get('hasLogin') || false;
    // if(!hasLogin || hasLogin == false || token.length === 0){
    //   _this.$router.push({name: "login"});
    // } else {
    //   _this.getUserInfo()
    // }
  },
  methods: {
    ...mapMutations([
      "updateKeepPageTabs",
      "updateBreadcrumb",
      "updateleftMenuActiveName",
      "updateCollapse",
      "updateisAuthentication"

    ]),
    /*获取用户信息*/
    async getUserInfo() {
      let _this = this;
      // 获取用户信息
      const session_adminInfo = JSON.parse(_this.$getStore('adminUserInfo')) || '';
      const session_admin_id = session_adminInfo.memberId || 0;
      let token = _this.$getStore('tokenId') || '';
      if (session_admin_id > 0 && token.length > 0) {
        _this.adminUserInfo = session_adminInfo; 
      let roleList = session_adminInfo.role_list;
      /*权限*/
      let index = roleList.findIndex(val => {
        return val.id == "1";
      });
      let index2 = roleList.findIndex(val => {
        return val.id == "3";
      });
      if (index >-1 || index2 > -1) {
        
       this.isPower=true
      }


      } else {
        // 清除本地存储及会话存储信息
        _this.$removeStore('tokenId');
        _this.$removeStore('adminUserInfo');
        _this.$removeStore('remember_me');
        _this.$removeStore('townListInfo');
        _this.$removeStore('villageListInfo');
        _this.$removeStore('districtsLevel');
        _this.$removeStore('districtsCode');
        _this.$removeStore('subMember');
        _this.$removeStore('permissions');

        _this.$router.push({name:"login"});
      }
    },

    async selectOption(val) {
      //console.log(val);
      if (val == 1) {
        this.$router.push({
          name: "userInfo"
        });
      } else {
        let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
        let memberId = session_adminInfo.memberId || 0;
        let res = await this.$http.memberLoginOut({memberId:memberId});
        if(res.status==='success'){
          this.updateKeepPageTabs({
            type: "all",
            data: { routeName: this.$route.name }
          });
          this.updateBreadcrumb([]);
          this.updateleftMenuActiveName("");
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
          });
          // 退出标识
          this.closeCookie()
        }else{
          this.$message({
            type: 'error',
            message: res.msg,
            duration: 1500,
          });
        }
      }
    },
    //统一身份认证
    goAuthentication(){
      let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
      let roleList = session_adminInfo.role_list;
      /*权限*/
      let index = roleList.findIndex(val => {
        return val.id == "1";
      });
      let index2 = roleList.findIndex(val => {
        return val.id == "3";
      });
      if (index >-1 || index2 > -1) {
        this.$router.push({name: 'index1'});
        this.updateisAuthentication()
      }
    },
    // 返回首页
    goIndex(){
      this.updateisAuthentication()
       this.$router.push({name: 'index'});
    }

    
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
.headerTitle {
  font-size: 22px;
  color: #fff;
  float: left;
}
.headerRight {
  float: right;
  .user-avator {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
    top: 0;
    margin-right: 16px;
  }
  .el-dropdown-link {
    color: #fff;
  }
}
.isCollapsediv{
  color: #fff;
  float: left;
  font-size: 22px;
  margin-right: 20px;
}
.authentication{
  color: #409EFF;
    margin-right: 20px;
    font-size: 18px;
    cursor: pointer;

}
</style>