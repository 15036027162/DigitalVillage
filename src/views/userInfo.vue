<template>
    <div>
       <div v-if="userInfo">
           <div class="userHeader">成员信息</div>
           <ul class="userList">
               <li><label>姓名：</label><span>{{userInfo.name}}</span></li>
               <li><label>性别：</label><span>{{sexCare}}</span></li>
               <li><label>职务：</label><span>{{userInfo.positionName}}</span></li>
               <li><label>电话：</label><span>{{userInfo.positionPhone}}</span></li>
           </ul>

           <div class="userHeader">账号信息</div>
           <ul class="userList">
               <li><label>用户名：</label><span>{{userInfo.account}}</span><el-button type="text" class="changeBtn" @click="changePwdModel">修改密码</el-button></li>
               <!-- <li><label>用户ID：</label><span>{{userName}}</span></li>-->
               <li v-if="userInfo.mobile"><label>绑定手机号：</label><span>{{phoneNumFilterLogin(userInfo.mobile)}}</span><el-button type="text" class="changeBtn" @click="changePhoneModel">修改手机号</el-button></li>
               <li v-else><label>绑定手机号：</label><span>暂未绑定</span><el-button type="text" class="changeBtn" @click="changePhoneModel">去绑定</el-button></li>
               <li><label>帐号状态：</label><span>{{userStatus}}</span></li>
               <li><label>注册时间：</label><span>{{userInfo.createTime}}</span></li>
           </ul>
           <!--修改手机号-->
           <phoneModel v-if="changePhone" :phone="userInfo.mobile"></phoneModel>
           <!--修改密码-->
           <pwdModel v-if="changePwd" :phone="userInfo.mobile"></pwdModel>
       </div>
        <div v-else>暂未实名</div>
    </div>
</template>

<script>
    import phoneModel from '.././components/public/phoneModel'
    import pwdModel from '.././components/public/pwdModel'
    import {getWebMemberBaseInfo} from "../api/getData";
    export default {
        name: "userInfo",
        components:{phoneModel,pwdModel},
        data(){
            return{
                userName:'独对偶家',
                changePhone:false,
                changePwd:false,
                userInfo:{},
                sexCare:'',  //男女
                userStatus:'',  //状态
            }
        },
        mounted() {
            let _this = this;

            // 检查是否登录
            let token = _this.$getStore('tokenId') || '';
            let hasLogin = _this.$cookies.get('hasLogin') || false;
            let session_adminInfo = JSON.parse(_this.$getStore('adminUserInfo')) || '';
            let session_admin_id = session_adminInfo.memberId || 0
            if(!hasLogin || token.length === 0){
                _this.$router.push({name: "login"});
            } else {
                _this.getUserInfo(session_admin_id);
            }
        },
        methods:{
            /*获取用户信息*/
            async getUserInfo(session_admin_id) {
                let _this = this;
                //const res = await getWebMemberBaseInfo({memberId: session_admin_id});
                const res = await getWebMemberBaseInfo({memberId: session_admin_id});
                if(res.status === 'success'){
                    _this.userInfo = res.data[0]
                    if(_this.userInfo.ssex ==1){
                        _this.sexCare = '男'
                    }else if(_this.userInfo.ssex ==0){
                        _this.sexCare = '女'
                    }
                    if(_this.userInfo.status ==0){
                        _this.userStatus = '冻结'
                    }else if(_this.userInfo.status ==1){
                        _this.userStatus = '已实名'
                    }else if(_this.userInfo.status ==2){
                        _this.userStatus = '未实名'
                    }else if(_this.userInfo.status ==3){
                        _this.userStatus = '已提交实名申请'
                    }else if(_this.userInfo.status ==4){
                        _this.userStatus = '实名已驳回'
                    }
                }
            },

            changePhoneModel(){
                this.changePhone = true
            },
            changePwdModel(){
                this.changePwd = true
            },
        }
    }
</script>

<style scoped>

</style>
