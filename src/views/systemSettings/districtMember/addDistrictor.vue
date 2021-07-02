<template>
    <div>
        <el-form :model="memberEdit" label-width="100px"  :rules="rulesEdit" ref="memberEdit">
            <el-form-item label="用户名：" prop="phone">
                <el-input v-model="memberEdit.phone" placeholder="请输入用户名" style="width: 300px;margin-right: 50px"></el-input>
                <el-button type="primary" size="medium" @click="searchMoblie" >查询</el-button>
            </el-form-item>
            <ul class="userMember" v-if="showGetUser">
                <li>用户名：{{getUser.account}}</li>
            </ul>
            <el-form-item label="姓名：" prop="name">
                <el-input v-model="memberEdit.name" placeholder="请输入姓名" style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="ssex" class="formItems" required>
                <el-radio-group v-model="memberEdit.ssex">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="0">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="职务：" prop="post">
                <el-input v-model="memberEdit.post" placeholder="请输入2~12个字的职务名称" style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="mobile">
                <el-input v-model="memberEdit.mobile" placeholder="请输入联系电话" style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="区域选择：" required>
                <provinces @changeTown="changeTown" :isadd="true"></provinces>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('memberEdit')">确定添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import provinces from '@/components/common/provinces1'
    export default {
        components: {provinces},
        data() {
            /*验证手机号   修改手机号专用*/
            const mobileSms = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入联系人电话'));
                } else {
                    let regPone = null;
                    let mobile = /^1[3456789]\d{9}$/; //11位手机正则
                    let tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机
                    if (value.charAt(0) == 0) {    // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
                        regPone = tel;
                    } else {
                        regPone = mobile;
                    }
                    if (!regPone.test(value)) {
                        return callback(
                            // new Error("请填写联系人电话(座机格式'区号-座机号码')")
                            new Error("请填写正确的联系人电话")
                        );
                    }
                    callback();
                }
            };
            return {
                memberEdit:{
                    phone:'',
                    name:'',
                    ssex:'1',
                    post:'',
                    mobile:'',
                },
                rulesEdit:{
                    phone:[
                        {required: true, message: '请输入用户名', trigger: 'blur', type: "string"}
                    ],
                    name:[
                        {required: true, message: '请输入姓名', trigger: 'blur', type: "string"}
                    ],
                    post: [
                        { required: true, message: '请输入职务名称', trigger: 'blur' },
                        { min:2, max: 12, message: '请输入2~12个字的职务名称', trigger: 'blur' }
                    ],
                    mobile:[
                        {required: true, message: '请输入联系方式', trigger: 'blur', type: "string"},
                        {validator: mobileSms, trigger: 'blur'}
                    ],
                },
                showGetUser:false,
                getUser:{},
                changeTips:false,
                memberId: '',
                areaCode: '',
                streetCode: '',
                villageCode: '',
                areaName: '',
                streetName: '',
                villageName: '',
            };
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.areaCode = session_adminInfo.areaCode
            this.areaName = session_adminInfo.areaName
            this.streetCode = session_adminInfo.streetCode
            this.streetName = session_adminInfo.streetName
            this.villageCode = session_adminInfo.villageCode
            this.villageName = session_adminInfo.villageName
            this.memberId = session_adminInfo.memberId || 0;
            this.getJob()
        },
        methods: {
            /*手机号获取成员信息*/
            async searchMoblie(){
                let res = await this.$http.getMemberByMobile({mobile:this.memberEdit.phone});
                if(res.status==='success'){
                    if(res.data.length>0){
                        this.showGetUser = true
                        this.getUser = res.data[0]
                        if(this.getUser.ssex==1){
                            this.getUser.sexName = '男'
                        }else{
                            this.getUser.sexName = '女'
                        }
                    }else{
                        this.$message({
                            type: 'warning',
                            message: res.msg,
                            duration: 1000,
                        });
                    }
                }
            },
            /*区域选择*/
            changeTown(val) {
                let _this = this
                _this.areaCode = val.cityCode
                _this.streetCode = val.streetCode
                _this.villageCode = val.villageCode
                _this.areaName = val.cityName
                _this.streetName = val.streetName
                _this.villageName = val.villageName
            },
            /*添加*/
            async submitForm(){
                let dataObj = {}
                if(this.getUser.memberId){
                    dataObj = {
                        loginMemberId:this.memberId,
                        editMemberId:this.getUser.memberId,
                        position:this.memberEdit.post,
                        linkMobile:this.memberEdit.mobile,
                        ssex:this.memberEdit.ssex,
                        name:this.memberEdit.name,
                        areaCode: this.areaCode,
                        streetCode: this.streetCode,
                        villageCode: this.villageCode,
                        areaName: this.areaName,
                        streetName: this.streetName,
                        villageName: this.villageName,
                    }
                    if(this.memberEdit.name.length<=0){
                        this.$message({
                            type: 'warning',
                            message: '请输入姓名',
                            duration: 1500,
                        });
                    }else if(this.memberEdit.post.length<2 || this.memberEdit.post.length>12){
                        this.$message({
                            type: 'warning',
                            message: '请输入2~12个字的职务名称',
                            duration: 1500,
                        });
                    }else if(this.memberEdit.mobile.length>12 || this.memberEdit.mobile.length<11){
                        this.$message({
                            type: 'warning',
                            message: '请输入正确的联系电话',
                            duration: 1500,
                        });
                    }else{
                        let res = await this.$http.saveDistricts(dataObj);
                        if(res.status==='success'){
                            this.$message({
                                type: 'success',
                                message: res.msg || '添加成功',
                                duration: 1000,
                            });
                            setTimeout(() => {
                                this.$router.push({name: 'districtMember'});
                            }, 1000);
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.msg,
                                duration: 1500,
                            });
                        }
                    }
                }else{
                    this.$message({
                        type: 'warning',
                        message: '请先根据用户名查询用户是否注册！',
                        duration: 1500,
                    });
                }
            }
        },
    }
</script>
<style lang='less'>

</style>
