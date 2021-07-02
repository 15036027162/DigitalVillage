<template>
    <div>
        <!--状态一-->
        <div class="po-relative" v-if="statusShow" style="z-index: 2">
            <h1 class="retrieveTitle" style="text-align: center">找回密码</h1>
            <el-form ref="editChangeMobile" :model="mobileForm" :rules="mobileRules">
                <el-form-item prop="mobile">
                    <el-input v-model="mobileForm.mobile" placeholder="请输入新手机号" minlength="1" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item prop="smsCode" :disabled="formSmsBtn">
                    <el-input v-model="mobileForm.smsCode" placeholder="请输入验证码" minlength="6" maxlength="6" style="width: 180px"></el-input>
                    <el-button class="retrieveCode" @click="sendSmsCode('mobile')" style="width: 114px" :disabled="disabled=!showSms" >
                        <span v-show="showSms">获取验证码</span>
                        <span v-show="!showSms">{{countSms}} s</span>
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" style="width: 100%;height: 40px" @click="nextTab('editChangeMobile')">下一步</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="medium" style="width: 100%;height: 40px;" @click="closeChangePhone">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--状态二-->
        <div class="po-relative" v-if="!statusShow" style="z-index: 2">
            <h1 class="retrieveTitle" style="text-align: center">设置新密码</h1>
            <el-form ref="editChangeMobileForm" :model="mobileForm" :rules="mobileRules">
                <el-form-item prop="pwd">
                    <el-input type="password" v-model="mobileForm.pwd" placeholder="请输入新密码" minlength="1" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="newPwd">
                    <el-input type="password" v-model="mobileForm.newPwd" placeholder="确认新密码" minlength="1" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" style="width: 100%;height: 40px;" @click="submitPhone('editChangeMobileForm')" :disabled="changePwdDis">提交</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="medium" style="width: 100%;height: 40px;" @click="closeChangePhone">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "retrievePwd",
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
                    mobile:'',
                    pwd:'',
                    newPwd:'',
                    smsCode:''
                },
                mobileRules:{
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur', type: "string"},
                        {validator: mobileSms, trigger: 'blur'}
                    ],
                    pwd: [
                        {required: true, message: '请输入密码', trigger: 'blur', type: "string"},
                    ],
                    newPwd: [
                        {required: true, message: '请输入确认密码', trigger: 'blur', type: "string"},
                    ],
                    smsCode: [
                        {required: true, message: '请输入短信验证码', trigger: 'blur'},
                        {min: 6, max: 6, message: '限6个字符', trigger: 'blur'}
                    ],
                },
                formSmsBtn:true,
                showSms:true,
                countSms:60,
                statusShow:true,
                changePwdDis:false,
            }
        },
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
                                _this.countSms=60
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
            /*下一步*/
            async nextTab(editChangeMobile){
                let _this = this;
                let smsCode = _this.mobileForm.smsCode || '';
                const dataObj = {
                    mobile: _this.mobileForm.mobile,
                    code:smsCode,
                    module: 103,
                };
                _this.$refs[editChangeMobile].validate(async (valid) => {
                    if (valid) {
                        const res = await _this.$http.loginCheckCode(dataObj);
                        if (res.status === 'success') {
                            this.statusShow = false
                        }else{
                            _this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    }
                })

            },
            /*取消*/
            closeChangePhone(){
                this.$parent.retrievePwd = false
                this.statusShow = true
            },
            /*提交*/
            submitPhone(loginForm){
                let _this = this
                let passWord = _this.mobileForm.pwd || '';
                let passWordNew = _this.mobileForm.newPwd || '';
                if(passWord && passWord===passWordNew){
                    let changeData = {
                        mobile:_this.mobileForm.mobile,
                        password:passWord,
                        module:103,
                    }
                    _this.$refs[loginForm].validate(async (valid) => {
                        if (valid) {
                            const res = await _this.$http.retrievePasswordNew(changeData);
                            if(res.status === 'success'){
                                _this.changePwdDis = true
                                _this.$parent.retrievePwd = false
                                _this.$message({
                                    type: 'success',
                                    message: res.msg,
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
                        message: '密码不能为空！',
                        duration: 1000,
                    });
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .retrieveTitle{
        font-size: 16px;
        position: relative;
        top: -30px;
    }
    .retrieveCode{
        margin-left: 10px;
        position: relative;
        top: 1px;
    }
</style>
