<template>
    <div class="fixedBg">
        <div class="po-absolute modelMess">
            <div class="el-icon-close po-absolute iconCLose" @click="closeChangePhone"></div>
            <h1 class="modelTitle">修改密码</h1>
            <!--当前手机号-->
            <el-form ref="editChangeMobileForm" :model="mobileForm" :rules="mobileRules">
                <div class="modelNum" v-if="phone">当前手机号：{{phoneNumFilterLogin(phone)}}</div>
                <el-form-item prop="smsCode" :disabled="formSmsBtn">
                    <el-input v-model="mobileForm.smsCode" placeholder="请输入验证码" minlength="6" maxlength="6" style="width: 180px"></el-input>
                    <el-button size="medium" class="Modelcode" @click="sendSmsCode('mobile')" style="width: 110px" :disabled="disabled=!showSms" >
                        <span v-show="showSms">获取验证码</span>
                        <span v-show="!showSms">{{countSms}} s</span>
                    </el-button>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input type="password" auto-complete="new-password" v-model="mobileForm.pwd" placeholder="请输入新密码" minlength="1" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" style="width: 100%" @click="submitPhone('editChangeMobileForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pwdModel",
        props:['phone'],
        data(){
            /*验证手机号   修改手机号专用*/
            // const logPwd2 = (rule, value, callback) => {
            //     //@#￥%&_=+.,
            //     const reg =/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#￥%&_+={}:,.]).{6,12}/
            //     if (!value) {
            //         return callback(new Error('请输入新密码'))
            //     } else if (!reg.test(value)) {
            //         return callback(new Error('请输入6-12位的数字、字母大小写和特殊符号'))
            //     } else {
            //         callback()
            //     }
            // };
            return{
                mobileForm:{
                    pwd:'',
                    smsCode:''
                },
                mobileRules:{
                    pwd: [
                        {required: true, message: '请输入密码', trigger: 'blur', type: "string"}
                    ],
                    smsCode: [
                        {required: true, message: '请输入短信验证码', trigger: 'blur'},
                        {min: 6, max: 6, message: '限6个字符', trigger: 'blur'}
                    ],
                },
                formSmsBtn:true,
                showSms:true,
                countSms:60,
            }
        },
        methods:{
            /*发送验证码*/
            async sendSmsCode(){
                let _this = this;
                const dataObj = {
                    mobile: _this.phone,
                    module: 105,
                };
                const res = await _this.$http.sendShortMessageCode(dataObj);
                if (res.status === 'success') {
                    _this.$message({
                        type: 'success',
                        message: res.msg
                    });
                    _this.showSms = false
                    _this.timerSms = setInterval(() => {
                        if (_this.countSms > 0 && _this.countSms <= 60) {
                            _this.countSms--;
                            if(_this.countSms<=0){
                                _this.showSms = true;
                                clearInterval(_this.timerSms);  // 清除定时器
                            }
                        }
                    }, 1000)
                } else {
                    _this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            },
            /*提交*/
            submitPhone(loginForm){
                let _this = this
                let passWord = _this.mobileForm.pwd || '';
                let smsCode = _this.mobileForm.smsCode || '';
                let tokenId = _this.$getStore('tokenId') || '';
                let session_adminInfo = JSON.parse(_this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;

                let changeData = {
                    memberId: memberId,
                    m_token_id: tokenId,
                    mobile:_this.phone,
                    password:passWord,
                    code:smsCode,
                    module:105,
                }

                if (_this.phone.length > 0 && passWord.length > 0 && smsCode.length > 0) {
                    _this.$refs[loginForm].validate(async (valid) => {
                        if (valid) {
                            const res = await _this.$http.changeMemberPassword(changeData);

                            if(res.status === 'success'){
                                _this.changePwdDis = true
                                _this.$parent.changePwd = false
                                _this.$message({
                                    type: 'success',
                                    message: res.msg || '修改密码成功',
                                    duration: 1000,
                                });

                                //退出
                                _this.closeCookie()
                            }else {
                                _this.changePwdDis = false;
                                _this.$message({
                                    type: 'error',
                                    message: res.msg,
                                    duration: 1000,
                                });
                            }
                        }else{
                            _this.changePwdDis = false;
                        }
                    })
                }else{
                    _this.changePwdDis = false;
                    _this.$message({
                        type: 'error',
                        message: '手机号、验证码或密码不能为空！',
                        duration: 1000,
                    });
                }
            },

            /*关闭*/
            closeChangePhone(){
                this.$parent.changePwd = false
            }
        }
    }
</script>

<style scoped>

</style>
