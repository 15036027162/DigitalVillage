<template>
    <div>
        <div class="userHeader">成员信息</div>
        <el-form v-if="memberChange" v-model="memberChange" label-width="100px" :rules="rulesChange"
                 ref="memberChangeRef">
            <el-form-item label="区划组织：">{{memberChange.district||'--'}}</el-form-item>
            <el-form-item label="用户名：">{{memberChange.account}}</el-form-item>
            <el-form-item label="绑定手机号：">{{phoneNumFilterLogin(memberChange.mobile) || '暂未绑定'}}</el-form-item>
            <el-form-item label="姓名：">{{memberChange.name}}</el-form-item>
            <el-form-item label="性别：">{{memberChange.ssexName}}</el-form-item>
            <el-form-item label="职务：" prop="position">
                <el-input v-model="memberChange.position" placeholder="请输入2~12个字的职务名称"
                          style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" prop="linkMobile">
                <el-input v-model="memberChange.linkMobile" placeholder="请输入联系电话"
                          style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="角色选择：" prop="roleIds" v-if="memberChange.districtType==0">
                <el-checkbox-group v-model="memberChange.roleIds">
                    <el-checkbox v-for="(item,index) in typeRole" :key="index" :label="item.id"
                                 name="type">{{item.roleName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="changeForm('memberChangeRef')" :disabled="changeOver">保存修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "changeMember",
        data() {
            /*验证手机号   修改手机号专用*/
            const mobileSms = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入联系人电话'));
                } else {
                    let regPone = null;
                    let mobile = /^1[3456789]\d{9}$/; //11位手机正则
                    let tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\\-[0-9]{1,4})?$/; //座机
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
                memberChange: {
                    name:'',
                    account:'',
                    mobile:'',
                    position: '',
                    linkMobile:'',
                    roleIds:[],
                },
                typeRole:[],
                rulesChange: {
                    // linkMobile: [
                    //     {required: true, message: '请输入联系方式', trigger: 'blur'},
                    //     {validator: mobileSms, message: '请输入正确的联系方式', trigger: 'blur'}
                    // ],
                    // position: [
                    //     {required: true, message: '请输入职务名称', trigger: 'blur'},
                    //     {min: 2, max: 12, message: '请输入2~12个字的职务名称', trigger: 'blur'}
                    // ],
                    // roleIds: [
                    //     {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
                    // ]
                },
                memberId:'',
                changeOver:false
            }
        },
        created() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0;
            this.getUserRole()
            this.getInfo()
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
                    this.typeRole = arr
                    this.$forceUpdate()
                }
            },
            /*获取成员信息*/
            async getInfo() {
                let res = await this.$http.getByIdMember({
                    loginMemberId: this.memberId,
                    editMemberId: this.$route.params.id,
                });
                if (res.status === 'success') {
                    this.memberChange = res.data
                    if (this.memberChange.ssex == '1') {
                        this.memberChange.ssexName = '男'
                    } else {
                        this.memberChange.ssexName = '女'
                    }
                    this.$forceUpdate()
                }
            },

            /*修改提交*/
            async changeForm() {
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let dataObj = {}
                dataObj = {
                    loginMemberId: memberId,
                    editMemberId: this.$route.params.id,
                    position: this.memberChange.position,
                    linkMobile: this.memberChange.linkMobile,
                    roles: this.memberChange.roleIds,
                }
                if (this.memberChange.position.length < 2 || this.memberChange.position.length > 12) {
                    this.$message({
                        type: 'warning',
                        message: '请输入2~12个字的职务名称',
                        duration: 1500,
                    });
                } else if (this.memberChange.linkMobile.length > 12 || this.memberChange.linkMobile.length < 11) {
                    this.$message({
                        type: 'warning',
                        message: '请输入正确的联系电话',
                        duration: 1500,
                    });
                } else if (this.memberChange.districtType==0 && this.memberChange.roleIds.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请至少选择一个角色',
                        duration: 1500,
                    });
                } else {
                    this.changeOver = true
                    let res = await this.$http.relationshipUpdate(dataObj);
                    if (res.status === 'success') {
                        this.$message({
                            type: 'success',
                            message: res.msg || '修改成功',
                            duration: 1000,
                        });
                        setTimeout(() => {
                            this.$router.push({name: 'operateMember'});
                            this.changeOver = false
                        }, 1000);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg,
                            duration: 1500,
                        });
                        setTimeout(() => {
                            this.changeOver = false
                        }, 1000);
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>
