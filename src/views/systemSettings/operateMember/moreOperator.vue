<template>
    <div>
        <div class="userHeader">成员信息</div>
        <el-form v-if="memberChangeShow" v-model="memberChange" label-width="100px"
                 ref="memberChangeRef">
            <el-form-item label="用户名：">{{memberChange.account}}</el-form-item>
            <el-form-item label="绑定手机号：">{{memberChange.mobile || '暂未绑定'}}</el-form-item>
            <el-form-item label="姓名：">{{memberChange.name}}</el-form-item>
            <el-form-item label="性别：">{{memberChange.ssexName}}</el-form-item>
            <el-form-item label="联系方式：">{{memberChange.linkMobile}}</el-form-item>
            <el-form-item label="职务：">{{memberChange.position}}</el-form-item>
            <el-form-item label="角色选择：" prop="roleIds" v-if="memberChange.districtType==0">
                <el-checkbox-group v-model="memberChange.roleIds">
                    <el-checkbox v-for="(item,index) in typeRole" :key="index" :label="item.id"
                                 name="type" disabled>{{item.roleName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="区划组织：" v-if="memberChange.districtType==1">{{memberChange.district ||'--'}}</el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                memberChange: {
                    name:'',
                    account:'',
                    mobile:'',
                    positionName: '',
                    positionPhone: '',
                    roles:[],
                },
                typeRole:[],
                memberId:'',
                memberChangeShow:false
            }
        },
        mounted() {
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
                    this.memberChangeShow = true
                    this.$forceUpdate()
                }
            }
        }
    }
</script>

<style scoped>

</style>
