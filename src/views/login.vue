<template>
  <div class="loginContent_bg">
    <div class="loginContent_title"></div>
    <div class="loginContent po-relative">
      <!--忘记密码-->
      <retrievePwd v-if="retrievePwd"></retrievePwd>

      <el-form v-else :model="ruleForm" status-icon :rules="rules" ref="loginForm" label-width="100px">
        <el-form-item prop="user">
          <el-input v-model="ruleForm.user" placeholder="请输入用户名或手机号码" minlength="0" maxlength="20">
            <i slot="prefix" class="el-input__icon el-input_user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="ruleForm.pass" placeholder="请输入密码" minlength="6" maxlength="12" @keyup.enter.native="joinIn('loginForm')">
            <i slot="prefix" class="el-input__icon el-input_pwd"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="po-relative">
          <el-button type="text" @click="resetPwd" class="reset_btn po-absolute" :disabled="loginBtnDisabled">找回密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="joinIn('loginForm')" class="submit_btn" :disabled="loginBtnDisabled">登录</el-button>
        </el-form-item>
        <el-form-item prop="reMemberMe">
          <el-checkbox v-model="ruleForm.reMemberMe">自动登录</el-checkbox>
        </el-form-item>
      </el-form>
      <div class="loginContent_bottom"></div>
    </div>
    <p class="compayInfo">&copy;️2020 美丽乡村信息技术（苏州）有限公司  |  版权所有 苏ICP备18052549号</p>
  </div>
</template>

<script>
  import retrievePwd from '@/components/public/retrievePwd'
  import {mapMutations} from "vuex";
export default {
  components: {retrievePwd},
  data() {
    //这里存放数据
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        user: '',
        pass: '',
        reMemberMe:true,
      },
      rules: {
        user: [
          {validator: validateUser, trigger: 'blur'}
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
      },
      loginBtnDisabled:false,  //禁止双击按钮事件
      retrievePwd:false, //找回密码
      adminUserInfo: '',// 本地存储方式
    }
  },
  mounted() {
    let _this = this;
    const session_adminInfo = JSON.parse(_this.$getStore('adminUserInfo')) || '';
    const loginAdminId = session_adminInfo.memberId || 0;
    const token = _this.$getStore('tokenId') || '';
    let hasLogin = _this.$cookies.get('hasLogin') || false;
    if (hasLogin !== false && loginAdminId !== 0 && token.length > 0) {
      _this.$router.push({name: 'index'});
    } else {
      // 退出标识
      if(_this.$cookies.isKey('hasLogin')){
        _this.$cookies.remove('hasLogin');
      }
      // 清除数据
      _this.$removeStore('tokenId');
      _this.$removeStore('adminUserInfo');
      _this.$removeStore('remember_me');
      _this.$removeStore('townListInfo');
      _this.$removeStore('villageListInfo');
      _this.$removeStore('districtsLevel');
      _this.$removeStore('districtsCode');
      _this.$removeStore('permissions');


    }
  },
  methods: {
    ...mapMutations([
      "updateisAuthentication"
    ]),
    /*登录*/
    async joinIn(loginForm){
      let _this = this;
      let userName = _this.ruleForm.user || '';
      let passWord = _this.ruleForm.pass || '';
      let reMemberMe = _this.ruleForm.reMemberMe;
      _this.$refs[loginForm].validate(async (valid) =>{
        if(valid){
          _this.loginBtnDisabled = true;
          // 加载loading
          const rLoading = _this.openLoading();
          const lData = {
            user: userName,
            password: passWord,
          };
          const res = await _this.$http.memberLogin(lData);
          if(res.status === 'success' && res.code === '4101'){
            // 用户信息
            const adminGUserInfo = res.data[0] || [];
            const resToken = adminGUserInfo.token_id || '';
            const districtsLevel = adminGUserInfo.deptLevel || '';
            const districtsCode = adminGUserInfo.deptDistrictsCode || '';

            // 记录token;以备后用。
            _this.$setStore('tokenId', resToken);
            //console.log(sRes);
            //记录级别
            _this.$setStore('districtsLevel', districtsLevel);
            _this.$setStore('districtsCode', districtsCode);

            // 登录信息失效时间
            _this.$setStore('remember_me', reMemberMe);
            //const expiresTime = !reMemberMe ? '1y' : 60 * 60 * 2;
            const expiresTime = reMemberMe ? -1 : 0;
            _this.$cookies.set("hasLogin", true, expiresTime);
            //_this.$cookies.set("hasLogin", true, {expires:30});

            var menuList=res.data[0].menuList.map(val=>{
              return val.perms
            })
            _this.$setStore('permissions', JSON.stringify(menuList));

            if(reMemberMe==false){
              window.addEventListener('beforeunload',()=>{
                _this.$removeStore('tokenId');
                _this.$removeStore('adminUserInfo');
                _this.$removeStore('remember_me');
                _this.$removeStore('townListInfo');
                _this.$removeStore('villageListInfo');
                _this.$removeStore('districtsLevel');
                _this.$removeStore('districtsCode');
                _this.$removeStore('permissions');
              })
            }

            // 登录用户信息
            adminGUserInfo.phone = _this.phoneNumFilterLogin(adminGUserInfo.phone || '');// 手机号处理
            adminGUserInfo.avatar = adminGUserInfo.avatar || '';
            _this.$setStore('adminUserInfo', JSON.stringify(adminGUserInfo));

            // 缓存镇列表数据
            const sessionCityCode = adminGUserInfo.areaCode || '';// 县code
            const sessionTownCode = adminGUserInfo.streetCode || '';// 镇code
            const townList = await _this.getTownList(sessionCityCode) || [];
            const villageList = await _this.getVillageList(sessionTownCode) || [];
            _this.$setStore('townListInfo', JSON.stringify(townList));
            _this.$setStore('villageListInfo', JSON.stringify(villageList));

            _this.$message({
              type: 'success',
              message: res.msg || '登录成功',
              duration: 1000,
            });

            _this.updateisAuthentication({type:1})

            // 进入管理中心
            setTimeout(() => {
              rLoading.close();
              _this.adminUserInfo = adminGUserInfo;
              _this.$router.push({name:'index'});
            }, 1000);
          }else {
            const errMsg = res.msg || '登录账号或密码不正确！';
            _this.loginBtnDisabled = false;
            // _this.$message({
            //   type: 'error',
            //   message: errMsg,
            //   duration: 1000,
            // });
            _this.$alert(errMsg, '错误提示', {
              confirmButtonText: '确定',
              // callback: action => {
              //   this.$message({
              //     type: 'info',
              //     message: `action: ${ action }`
              //   });
              // }
            });
          }
        }else{
          _this.loginBtnDisabled = false;
        }
      })
      // if (userName.length > 0 && passWord.length > 0) {
      //
      // }else{
      //   // 账号、密码都为空
      //   _this.loginBtnDisabled = false;
      //   _this.$message({
      //     type: 'error',
      //     message: '登录账号或密码不能为空！',
      //     duration: 1000,
      //   });
      // }
    },
    // 获取镇列表
    async getTownList(cityCode) {
      var townList = [];
      if (cityCode.length > 0) {
        const res = await this.$http.getStreetByArea({areaCode: cityCode});
        if (res.status === 'success') {
          res.data.unshift({
            code: '',
            name: '--请选择--'
          });
          townList = res.data || [];
        }
      }
      return townList;
    },
    // 获取村列表
    async getVillageList(townCode) {
      var villageList = [];
      if (townCode.length > 0) {
        const res = await this.$http.getVillageByStreet({streetCode: townCode});
        if (res.status === 'success') {
          res.data.unshift({
            code: '',
            name: '--请选择--'
          });
          villageList = res.data || [];
        }
      }
      return villageList;
    },

    /*重置密码*/
    resetPwd(){
      this.retrievePwd = true
    },
  },
  watch:{
    // 监听登录用户信息变化
    adminUserInfo: function (arrData) {
      let uid = arrData.memberId || 0;
      let token = this.$getStore('tokenId') || '';
      let hasLogin = this.$cookies.get('hasLogin') || false;
      if(hasLogin !== false){
        // 登录状态
        if (uid > 0 && token.length > 0) {
          this.$router.push({name: 'index'});
        } else {
          // 清除本地存储及会话存储信息
          this.$removeStore('tokenId');
          this.$removeStore('adminUserInfo');
          this.$removeStore('remember_me');
          this.$removeStore('townListInfo');
          this.$removeStore('villageListInfo');
          this.$removeStore('districtsLevel');
          this.$removeStore('districtsCode');
          this.$router.push({name: "login"});
        }
      } else {
        // 退出状态
        this.$removeStore('tokenId');
        this.$removeStore('adminUserInfo');
        this.$removeStore('remember_me');
        this.$removeStore('townListInfo');
        this.$removeStore('villageListInfo');
        this.$removeStore('districtsLevel');
        this.$removeStore('districtsCode');
        this.$router.push({name: "login"});
      }
    }
  }
}
</script>
<style lang='less' scoped>
.loginContent_bg{
  width: 100vw;
  height: 100vh;
  background: url("../assets/img/login_bg.png") no-repeat 0 0;
  background-size: 100% 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.loginContent_title{
  position: absolute;
  width: 400px;
  height: 143px;
  background: url("../assets/img/login_title.png") no-repeat 0 0;
  background-size: 100%;
  left: 25vw;
  top: 380px;
}
  .loginContent {
    position: absolute;
    width: 400px;
    height: auto;
    padding: 60px 48px 0px 48px;
    box-sizing: border-box;
    left: 62vw;
    top: 260px;
    border-radius: 5px;
    background: #FAF9FF;
    box-shadow: 0px 4px 20px 0px rgba(73, 122, 201, 0.35);
    .el-input_user{
      display: inline-block;
      width: 15px;
      height: 15px;
      background: url("../assets/img/login_user.png") no-repeat 0 0;
      background-size: 100%;
      position: relative;
      top: 13px;
      left: 5px;
    }
    .el-input_pwd{
      display: inline-block;
      width: 15px;
      height: 15px;
      background: url("../assets/img/login_pwd.png") no-repeat 0 0;
      background-size: 100%;
      position: relative;
      top: 13px;
      left: 5px;
    }
  }
  .submit_btn{
    width: 100%;
  }
  .reset_btn{
    font-size: 12px;
    width: 100%;
    text-align: right;
    top: -15px;
  }
  .compayInfo{
    width: 100%;
    position: fixed;
    bottom: 0px;
    text-align: center;
    font-size: 12px;
    color: #fff;
    background: #1E2037;
    line-height: 70px;
  }
  .loginContent_bottom{
    position: absolute;
    width: 400px;
    height: 80px;
    background: url("../assets/img/login_footer.png") no-repeat 0 0;
    background-size: 100%;
    bottom: 0;
    left: 0;
  }
</style>
