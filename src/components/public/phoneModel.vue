<template>
    <div class="fixedBg">
        <div class="po-absolute modelMess">
            <div class="el-icon-close po-absolute iconCLose" @click="closeChangePhone"></div>
            <h1 class="modelTitle" v-if="phone">修改手机号</h1>
            <h1 class="modelTitle" v-else>绑定手机号</h1>
            <!--当前手机号-->
            <el-form ref="editChangeMobileForm" :model="mobileForm" :rules="mobileRules">
                <div class="modelNum" v-if="phone">当前手机号：{{phoneNumFilterLogin(phone)}}</div>
                <el-form-item prop="mobile">
                    <el-input v-if="phone" v-model="mobileForm.mobile" placeholder="请输入新手机号" minlength="1" maxlength="11"></el-input>
                    <el-input v-else v-model="mobileForm.mobile" placeholder="请输入手机号" minlength="1" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item prop="smsCode" :disabled="formSmsBtn">
                    <el-input v-model="mobileForm.smsCode" placeholder="请输入验证码" minlength="6" maxlength="6" style="width: 180px"></el-input>
                    <el-button size="medium" class="Modelcode" @click="sendSmsCode('mobile')" style="width: 110px" :disabled="disabled=!showSms" >
                        <span v-show="showSms">获取验证码</span>
                        <span v-show="!showSms">{{countSms}} s</span>
                    </el-button>
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
        name: "phoneModel",
        props:['phone'],
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
            return{
                mobileForm:{
                    mobile:'',
                    smsCode:''
                },
                mobileRules:{
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur', type: "string"},
                        {validator: mobileSms, trigger: 'blur'}
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
                if(_this.mobileForm.mobile){
                    const dataObj = {
                        mobile: _this.mobileForm.mobile,
                        module: 104,
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
                }else{
                    _this.$message({
                        type: 'warning',
                        message: '请输入新手机号！',
                        duration: 1000,
                    });
                }
            },
            /*提交*/
            submitPhone(loginForm){
                let _this = this
                let mobile = _this.mobileForm.mobile || '';
                let smsCode = _this.mobileForm.smsCode || '';
                let session_adminInfo = JSON.parse(_this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;

                let changeData = {
                    memberId: memberId,
                    oldMobile:_this.phone,
                    newMobile:mobile,
                    code:smsCode,
                    module:104,
                }

                if (mobile.length > 0 && smsCode.length > 0) {
                    _this.$refs[loginForm].validate(async (valid) => {
                        if (valid) {
                            const res = await _this.$http.changeMemberPhone(changeData);

                            if(res.status === 'success'){
                                _this.changePwdDis = true
                                _this.$parent.changePhone = false
                                _this.$message({
                                    type: 'success',
                                    message: res.msg || '修改手机号成功',
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
                        message: '手机号或验证码不能为空！',
                        duration: 1000,
                    });
                }
            },

            /*关闭*/
            closeChangePhone(){
                this.$parent.changePhone = false
            }
        }
    }
</script>

<style scoped>

</style>
