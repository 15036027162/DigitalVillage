<template>
    <div>
        <el-form :model="memberEdit" label-width="100px"  :rules="rulesEdit" ref="memberEdit">
            <el-form-item label="用户名：" prop="phone">
                <el-input v-model="memberEdit.phone" placeholder="请输入用户名" style="width: 300px;margin-right: 50px"></el-input>
                <el-button type="primary" size="medium" @click="searchMoblie" >查询</el-button>
            </el-form-item>
            <ul class="userMember" v-if="showGetUser">
                <li>姓名：{{getUser.name}}</li>
                <li>性别：{{getUser.sexName}}</li>
                <li>用户名：{{getUser.account}}</li>
            </ul>
            <el-form-item label="区域选择：" required>
                <provinces @changeTown="changeTown"></provinces>
            </el-form-item>
            <el-form-item label="部门名称：" required>
                <el-select v-model="memberEdit.organization" placeholder="--请选择--" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option v-for="(item,index) in memberEdit.organizationList" :label="item.deptName" :key="index" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职务：" prop="post">
                <el-input v-model="memberEdit.post" placeholder="请输入2~12个字的职务名称" style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="mobile">
                <el-input v-model="memberEdit.mobile" placeholder="请输入联系电话" style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="角色选择：" prop="type">
                <el-checkbox-group v-model="memberEdit.type">
                    <el-checkbox v-for="(item,index) in memberEdit.typeRole" :key="index" :label="item.id" name="type">{{item.roleName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('memberEdit')">确定添加</el-button>
                <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import provinces from "@/components/common/provinces";
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
                            new Error("请填写联系人电话(座机格式'区号-座机号码')")
                        );
                    }
                    callback();
                }
            };
            return {
                memberEdit:{
                    phone:'',
                    organization:'',
                    organizationList:[],
                    type: [],
                    mobile:'',
                    post:'',
                    typeRole:[]
                },
                rulesEdit:{
                    phone:[
                        {required: true, message: '请输入用户名', trigger: 'blur', type: "string"},
                        /*{validator: mobileSms, trigger: 'blur'}*/
                    ],
                    post: [
                        { required: true, message: '请输入职务名称', trigger: 'blur' },
                        { min:2, max: 12, message: '请输入2~12个字的职务名称', trigger: 'blur' }
                    ],
                    type: [
                        { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
                    ],
                    mobile:[
                        {required: true, message: '请输入联系方式', trigger: 'blur', type: "string"},
                        {validator: mobileSms, trigger: 'blur'}
                    ],
                },
                showGetUser:false,
                getUser:{},
                changeTips:false,
            };
        },
        mounted() {
            /*this.getUserRole()*/
            this.getUserRole()
            this.getJob()
        },
        methods: {
            /*获取角色*/
            /*async getUserRole(){
                let res = await this.$http.getRoleByDistricts();
                if(res.status==='success'){
                    this.memberEdit.typeRole = res.data
                }
            },*/
            getUserRole(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let roleList = session_adminInfo.role_list;
                /*let index = roleList.findIndex(val => {
                    return val.id == "1";
                });*/
                if(session_adminInfo.deptLevel=='5' || this.changeTips===true){
                    this.memberEdit.typeRole = [
                        {roleName:'管理员',id:2},
                        {roleName:'村民档案管理员',id:3},
                        {roleName:'信息审核员',id:4},
                        {roleName:'积分兑换物品管理员',id:5},
                        {roleName:'垃圾分类管理员',id:6},
                        {roleName:'信息发布员',id:7},
                        {roleName:'积分管理员',id:8},
                    ]
                }else{
                    this.memberEdit.typeRole = [
                        {roleName:'管理员',id:2},
                        {roleName:'村民档案管理员',id:3},
                        {roleName:'信息审核员',id:4},
                    ]
                }
            },
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

             changeTown(val){
                let code = ''
                if(val.villageCode){
                    code = val.villageCode
                    this.changeTips = true
                }else if(val.townCode){
                    code = val.townCode
                    this.changeTips = false
                }else if(val.cityCode){
                    code = val.cityCode
                    this.changeTips = false
                }
                this.getUserRole()
                this.getJob(code)
            },
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
                    this.memberEdit.organizationList = res.data
                }
            },

            /*添加*/
            async submitForm(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let dataObj = {}
                if(this.getUser.memberId){
                    dataObj = {
                        loginMemberId:memberId,
                        memberId:this.getUser.memberId,
                        deptId:this.memberEdit.organization,
                        positionName:this.memberEdit.post,
                        positionPhone:this.memberEdit.mobile,
                        roles:this.memberEdit.type,
                    }
                    /*if(this.memberEdit.organization&&2<=this.memberEdit.post<=12&&this.memberEdit.mobile&&this.memberEdit.type){
                        let res = await this.$http.relationshipSave(dataObj);
                        if(res.status==='success'){
                            this.$message({
                                type: 'success',
                                message: res.msg || '添加成功',
                                duration: 1000,
                            });
                            setTimeout(() => {
                                this.$router.push({name: 'memberManage'});
                            }, 1000);
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.msg,
                                duration: 1500,
                            });
                        }
                    }else{
                        this.$message({
                            type: 'warning',
                            message: '用户名/部门/职务/联系电话/角色不能为空',
                            duration: 1500,
                        });
                    }*/

                    if(this.memberEdit.organization.length<=0){
                        this.$message({
                            type: 'warning',
                            message: '请选择所属部门',
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
                    }else if(this.memberEdit.type.length<=0){
                        this.$message({
                            type: 'warning',
                            message: '请至少选择一个角色',
                            duration: 1500,
                        });
                    }else{
                        let res = await this.$http.relationshipSave(dataObj);
                        if(res.status==='success'){
                            this.$message({
                                type: 'success',
                                message: res.msg || '添加成功',
                                duration: 1000,
                            });
                            setTimeout(() => {
                                this.$router.push({name: 'memberManage'});
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
