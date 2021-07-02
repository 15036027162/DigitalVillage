<template>
    <div>
        <div class="userHeader">成员信息</div>
        <el-form v-if="memberChange" :model="memberChange" label-width="100px" :rules="rulesChange"
                 ref="memberChangeRef">
            <el-form-item label="区划组织：">{{memberChange.name}}</el-form-item>
            <el-form-item label="用户名：">{{memberChange.account}}</el-form-item>
            <el-form-item label="绑定手机号：">{{phoneNumFilterLogin(memberChange.mobile) || '暂未绑定'}}</el-form-item>
            <el-form-item label="姓名：">{{memberChange.name}}</el-form-item>
            <el-form-item label="性别：">{{memberChange.ssexName}}</el-form-item>
            <el-form-item label="职务：" prop="positionName">
                <el-input v-model="memberChange.positionName" placeholder="请输入2~12个字的职务名称"
                          style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" prop="positionPhone">
                <el-input v-model="memberChange.positionPhone" placeholder="请输入联系电话"
                          style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="角色选择：" prop="type">
                <el-checkbox-group v-model="memberChange.type">
                    <el-checkbox v-for="(item,index) in memberChange.typeRole" :key="index" :label="item.id"
                                 name="type">{{item.roleName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="changeForm('memberChangeRef')">保存修改</el-button>
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
                    positionName: '',
                    positionPhone: '',
                    type: '',
                },
                rulesChange: {
                    positionPhone: [
                        {required: true, message: '请输入联系方式', trigger: 'blur', type: "string"},
                        {validator: mobileSms, trigger: 'blur'}
                    ],
                    positionName: [
                        {required: true, message: '请输入职务名称', trigger: 'blur'},
                        {min: 2, max: 12, message: '请输入2~12个字的职务名称', trigger: 'blur'}
                    ],
                    type: [
                        {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
                    ],
                },
            }
        },
        mounted() {
            this.getInfo()
        },
        methods: {
            /*获取成员信息*/
            async getInfo() {
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let memberChange = {}
                let res = await this.$http.getByIdMember({
                    loginMemberId: memberId,
                    memberId: this.$getStore('childId'),
                });
                if (res.status === 'success') {
                    memberChange = res.data
                    /*获取角色*/
                    /*let resRole = await this.$http.getRoleByDistricts();
                    if(resRole.status==='success'){
                        memberChange.typeRole = resRole.data
                    }*/
                    if (memberChange.deptLevel == '5') {
                        memberChange.typeRole = [
                            {roleName: '管理员', id: 2},
                            {roleName: '村民档案管理员', id: 3},
                            {roleName: '信息审核员', id: 4},
                            {roleName: '积分兑换物品管理员', id: 5},
                            {roleName: '垃圾分类管理员', id: 6},
                            {roleName: '信息发布员', id: 7},
                            {roleName: '积分管理员', id: 8},
                        ]
                    } else {
                        memberChange.typeRole = [
                            {roleName: '管理员', id: 2},
                            {roleName: '村民档案管理员', id: 3},
                            {roleName: '信息审核员', id: 4},
                        ]
                    }
                    if (memberChange.ssex == '1') {
                        memberChange.ssexName = '男'
                    } else {
                        memberChange.ssexName = '女'
                    }
                    let arr = []
                    if (memberChange.roles) {
                        memberChange.roles.map(k => {
                            arr.push(parseInt(k.id))
                        })
                    }
                    memberChange.type = arr
                    this.memberChange = memberChange
                    //console.log(this.memberChange);
                }
            },

            /*修改提交*/
            async changeForm() {
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let dataObj = {}
                dataObj = {
                    id: this.memberChange.id,
                    loginMemberId: memberId,
                    memberId: this.$getStore('childId'),
                    positionName: this.memberChange.positionName,
                    positionPhone: this.memberChange.positionPhone,
                    roles: this.memberChange.type,
                }
                if (this.memberChange.positionName.length < 2 || this.memberChange.positionName.length > 12) {
                    this.$message({
                        type: 'warning',
                        message: '请输入2~12个字的职务名称',
                        duration: 1500,
                    });
                } else if (this.memberChange.positionPhone.length > 12 || this.memberChange.positionPhone.length < 11) {
                    this.$message({
                        type: 'warning',
                        message: '请输入正确的联系电话',
                        duration: 1500,
                    });
                } else if (this.memberChange.type.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请至少选择一个角色',
                        duration: 1500,
                    });
                } else {
                    let res = await this.$http.relationshipUpdate(dataObj);
                    if (res.status === 'success') {
                        this.$message({
                            type: 'success',
                            message: res.msg || '修改成功',
                            duration: 1000,
                        });
                        setTimeout(() => {
                            this.$router.push({name: 'memberManage'});
                        }, 1000);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg,
                            duration: 1500,
                        });
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>
