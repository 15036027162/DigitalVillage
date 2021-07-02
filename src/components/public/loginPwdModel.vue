<template>
    <div class="resetContent">
        <el-form ref="editChangeMobileForm" :model="mobileForm" :rules="mobileRules">
            <el-form-item prop="mobile">
                <el-input v-model="mobileForm.mobile" placeholder="请输入新手机号" minlength="1" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item prop="smsCode" :disabled="formSmsBtn">
                <el-input v-model="mobileForm.smsCode" placeholder="请输入验证码" minlength="6" maxlength="6" style="width: 230px"></el-input>
                <el-button size="medium" class="Modelcode" @click="sendSmsCode('mobile')" style="width: 110px;height:40px " :disabled="disabled=!showSms" >
                    <span v-show="showSms">获取验证码</span>
                    <span v-show="!showSms">{{countSms}} s</span>
                </el-button>
            </el-form-item>
            <el-form-item prop="pwd">
                <el-input type="password" v-model="mobileForm.pwd" placeholder="请输入新密码" minlength="1" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" style="width: 100%;height: 40px;margin-top: 20px" @click="submitPhone('editChangeMobileForm')" :disabled="changePwdDis">提交</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="medium" style="width: 100%;height: 40px;" @click="closeChangePhone()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!--<div class="fixedBg">
        <div class="po-absolute modelMess">
            <div class="el-icon-close po-absolute iconCLose" @click="closeChangePhone"></div>
            <h1 class="modelTitle">找回密码</h1>
            &lt;!&ndash;当前手机号&ndash;&gt;
            <el-form ref="editChangeMobileForm" :model="mobileForm" :rules="mobileRules">
                <el-form-item prop="mobile">
                    <el-input v-model="mobileForm.mobile" placeholder="请输入新手机号" minlength="1" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item prop="smsCode" :disabled="formSmsBtn">
                    <el-input v-model="mobileForm.smsCode" placeholder="请输入验证码" minlength="6" maxlength="6" style="width: 180px"></el-input>
                    <el-button size="medium" class="Modelcode" @click="sendSmsCode('mobile')" style="width: 110px" :disabled="disabled=!showSms" >
                        <span v-show="showSms">获取验证码</span>
                        <span v-show="!showSms">{{countSms}} s</span>
                    </el-button>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input type="password" v-model="mobileForm.pwd" placeholder="请输入新密码" minlength="1" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" style="width: 100%" @click="submitPhone('editChangeMobileForm')" :disabled="changePwdDis">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>-->
</template>

<script>
    export default {
        name: "loginPwdModel",
        data(){
            /*验证手机号   修改手机号专用*/
            const mobileSms = (rule, value, callback) => {
                const reg = /^1[3456789]\d{9}$/;
                //const reg = /^1[3-9]\d{9}$/;
                if (value == '' || value == undefined || value == null) {
                    callback();
                } else {
                    if ((!reg.test(value)) && value != '') {
                        callback(new Error('请输入正确的手机号码'));
                    } else {
                        this.formSmsBtn = false;
                        callback();
                    }
                }
            };
            const logPwd2 = (rule, value, callback) => {
                //@#￥%&_=+.,
                const reg =/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#￥%&_+={}:,.]).{6,12}/
                if (!value) {
                    return callback(new Error('请输入新密码'))
                } else if (!reg.test(value)) {
                    return callback(new Error('请输入6-12位的数字、字母大小写和特殊符号'))
                } else {
                    callback()
                }
            };
            return{
                mobileForm:{
                    mobile:'',
                    pwd:'',
                    smsCode:''
                },
                mobileRules:{
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur', type: "string"},
                        {validator: mobileSms, trigger: 'blur'}
                    ],
                    pwd: [
                        {required: true, validator: logPwd2, trigger: 'blur'},
                    ],
                    smsCode: [
                        {required: true, message: '请输入短信验证码', trigger: 'blur'},
                        {min: 6, max: 6, message: '限6个字符', trigger: 'blur'}
                    ],
                },
                formSmsBtn:true,
                showSms:true,
                countSms:60,
                changePwdDis:false,  //防止多次点击提交
            }
        },
        inject: ['reload'],
        methods:{
            /*发送验证码*/
            async sendSmsCode(){
                let _this = this;
                const dataObj = {
                    mobile: _this.mobileForm.mobile,
                    module: 103,
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
                let mobile = _this.mobileForm.mobile || '';
                let passWord = _this.mobileForm.pwd || '';
                let smsCode = _this.mobileForm.smsCode || '';

                let changeData = {
                    mobile:mobile,
                    password:passWord,
                    code:smsCode,
                    module:103,
                }

                if (mobile.length > 0 && passWord.length > 0 && smsCode.length > 0) {
                    _this.$refs[loginForm].validate(async (valid) => {
                        if (valid) {
                            const res = await _this.$http.retrievePassword(changeData);

                            if(res.status === 'success'){
                                _this.changePwdDis = true
                                _this.$parent.retrievePwd = false
                                _this.$message({
                                    type: 'success',
                                    message: res.msg || '修改密码成功',
                                    duration: 1000,
                                });

                                //退出
                                _this.closeCookie()
                                //重新登录
                                setTimeout(() => {
                                    _this.reload();
                                }, 1000)
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
                this.$parent.retrievePwd = false
            }
        }
    }
</script>

<style scoped>
    .resetContent {
        width: 450px;
        height: auto;
        padding: 50px 50px 10px 50px;
        box-sizing: border-box;
        margin: 0 auto;
        margin-top: 250px;
        border-radius: 5px;
        background: #fff;
    }
    .resetContent .Modelcode{
        margin-left: 10px;
    }
</style>