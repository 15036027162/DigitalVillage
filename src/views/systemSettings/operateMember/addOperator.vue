<template>
    <div>
        <el-form :model="memberEdit" label-width="120px"  :rules="rulesEdit" ref="memberEdit">
            <el-form-item label="手机号：" prop="mobile">
                <el-input v-model="memberEdit.mobile" placeholder="请输入手机号" style="width: 300px;margin-right: 50px"></el-input>
                <el-button type="primary" size="medium" @click="searchMoblie" >查询</el-button>
            </el-form-item>
            <div v-if="showGetUser">
                <ul class="userMember" v-if="getUser.account">
                    <li>用户名：{{getUser.account}}</li>
                </ul>
            </div>
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
            <el-form-item label="联系电话：" prop="linkMobile">
                <el-input v-model="memberEdit.linkMobile" placeholder="请输入联系电话" style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>

            <el-form-item label="管理员选择：" prop="isDistrict">
                <el-select v-model="memberEdit.isDistrict" placeholder="--请选择--" clearable @change="changeRole">
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option label="角色管理员" value="1"></el-option>
                    <el-option v-if="deptLevel!=5" label="系统管理员" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色选择：" prop="roles" v-if="showArea">
                <el-checkbox-group v-model="memberEdit.roles">
                    <el-checkbox v-for="(item,index) in memberEdit.typeRole" :key="index" :label="item.id" name="type">{{item.roleName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="区域选择：" required v-if="!showArea">
                <provinces @changeTown="changeTown" :isadd="true"></provinces>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('memberEdit')" :disabled="submitOver">确定添加</el-button>
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
                    mobile:'',
                    name:'',
                    ssex:'1',
                    post:'',
                    linkMobile:'',
                    isDistrict:'',
                    roles:[],
                    typeRole:[]
                },
                rulesEdit:{
                    mobile:[
                        {required: true, message: '请输入用户名', trigger: 'blur', type: "string"}
                    ],
                    name:[
                        {required: true, message: '请输入姓名', trigger: 'blur', type: "string"}
                    ],
                    post: [
                        { required: true, message: '请输入职务名称', trigger: 'blur' },
                        { min:2, max: 12, message: '请输入2~12个字的职务名称', trigger: 'blur' }
                    ],
                    linkMobile:[
                        {required: true, message: '请输入联系方式', trigger: 'blur', type: "string"},
                        {validator: mobileSms, trigger: 'blur'}
                    ],
                    isDistrict: [{required: true, message: "请选择管理员", trigger: "change"}],
                    roles: [
                        { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
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
                showArea: false,
                submitOver: false,
                deptLevel: ''
            };
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0
            this.areaCode = session_adminInfo.areaCode
            this.areaName = session_adminInfo.areaName
            this.deptLevel = session_adminInfo.deptLevel
            if(this.deptLevel==4){
                this.streetCode = session_adminInfo.streetCode
                this.streetName = session_adminInfo.streetName
            }else if(this.deptLevel==5){
                this.streetCode = session_adminInfo.streetCode
                this.streetName = session_adminInfo.streetName
                this.villageCode = session_adminInfo.villageCode
                this.villageName = session_adminInfo.villageName
            }
            this.getUserRole()
        },
        methods: {
            async getUserRole(){
                let res = await this.$http.getSelectRoleByDistricts({memberId:this.memberId});
                let arr = []
                if(res.status==='success'){
                    res.data.map(k=>{
                        let obj = {}
                        obj.roleName = k.roleName
                        obj.id = k.id
                        arr.push(obj)
                    })
                    this.memberEdit.typeRole = arr
                }
            },
            /*手机号获取成员信息*/
            async searchMoblie(){
                let res = await this.$http.getMemberByMobile({mobile:this.memberEdit.mobile});
                if(res.status==='success'){
                    this.showGetUser = true
                    if(res.data.length>0){
                        this.getUser = res.data[0]
                        this.memberEdit.ssex = res.data[0].ssex || '1'
                        this.memberEdit.name = res.data[0].name || ''
                    }else{
                        this.memberEdit.ssex ='1'
                        this.memberEdit.name =''
                        this.getUser = {}
                        this.$message({
                            type: 'warning',
                            message: '该用户未注册',
                            duration: 1000,
                        })
                    }
                }else{
                    this.$message({
                        type: 'warning',
                        message: res.msg,
                        duration: 1000,
                    })
                }
            },
            /*添加*/
            async submitForm(memberEdit){
                let dataObj = {}
                this.$refs[memberEdit].validate(async (valid) => {
                    if (valid) {
                        if(this.showGetUser==true){
                            if(this.memberEdit.isDistrict==1){
                                dataObj = {
                                    loginMemberId:this.memberId,
                                    editMemberId:this.getUser.memberId || '',
                                    position:this.memberEdit.post,
                                    mobile:this.memberEdit.mobile,
                                    linkMobile:this.memberEdit.linkMobile,
                                    ssex:this.memberEdit.ssex,
                                    name:this.memberEdit.name,
                                    roles:this.memberEdit.roles,
                                    isDistrict:this.memberEdit.isDistrict,
                                    areaCode: this.areaCode,
                                    streetCode: this.streetCode,
                                    villageCode: this.villageCode,
                                    areaName: this.areaName,
                                    streetName: this.streetName,
                                    villageName: this.villageName
                                }
                            }else{
                                dataObj = {
                                    loginMemberId:this.memberId,
                                    editMemberId:this.getUser.memberId || '',
                                    position:this.memberEdit.post,
                                    mobile:this.memberEdit.mobile,
                                    linkMobile:this.memberEdit.linkMobile,
                                    ssex:this.memberEdit.ssex,
                                    name:this.memberEdit.name,
                                    isDistrict:this.memberEdit.isDistrict,
                                    areaCode: this.areaCode,
                                    streetCode: this.streetCode,
                                    villageCode: this.villageCode,
                                    areaName: this.areaName,
                                    streetName: this.streetName,
                                    villageName: this.villageName
                                }
                            }
                            if(this.memberEdit.isDistrict==1 && this.memberEdit.roles.length<=0){
                                this.$message({
                                    type: 'warning',
                                    message: '请选择至少一个角色',
                                    duration: 1500,
                                });
                            }else if(this.memberEdit.name.length<=0){
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
                            }else if(this.memberEdit.linkMobile.length>11 || this.memberEdit.linkMobile.length<11){
                                this.$message({
                                    type: 'warning',
                                    message: '请输入正确的联系电话',
                                    duration: 1500,
                                });
                            }else{
                                this.submitOver = true
                                let res = await this.$http.relationshipSave(dataObj);
                                if(res.status==='success'){
                                    this.$message({
                                        type: 'success',
                                        message: res.msg || '添加成功',
                                        duration: 1000,
                                    });
                                    setTimeout(() => {
                                        this.$router.push({name: 'operateMember'});
                                        this.submitOver = false
                                    }, 1000);
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: res.msg,
                                        duration: 1500,
                                    });
                                    setTimeout(() => {
                                        this.submitOver = false
                                    }, 1000);
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
                })
            },
            /*区域选择*/
            changeTown(val) {
                let _this = this
                _this.areaCode = val.cityCode
                _this.streetCode = val.townCode
                _this.villageCode = val.villageCode
                _this.areaName = val.cityName
                _this.streetName = val.townName
                _this.villageName = val.villageName
            },

            changeRole(item){
                if(item==1){
                    this.showArea = true
                }else{
                    this.showArea = false
                }
            }
        },
    }
</script>
<style lang='less'>

</style>
