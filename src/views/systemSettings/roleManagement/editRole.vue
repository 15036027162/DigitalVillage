<template>
    <div class="addRole_content">
        <el-form :inline="true" :model="roleForm" :rules="rulesForm" class="demo-form-inline" label-width="150px">
            <el-form-item label="角色名称：" prop="roleName">
                <el-input v-model="roleForm.roleName" placeholder="输入10字以内角色名称" clearable></el-input>
            </el-form-item>
            <el-collapse v-model="roleForm.activeNames"  @change="handleChange">
                <el-collapse-item v-for="(item,index) in roleList" :key="index" :name="item.id" :title="item.name">
                    <el-form-item :label="sItem.name" style="display: block;" v-for="(sItem,sIndex) in item.twoLevelList" :key="sIndex">
                        <el-checkbox-group v-model="sItem.checkedList" v-if="sItem.threeLevelList.length" @change="changecCheck">
                            <el-checkbox v-for="(tItem,tIndex) in sItem.threeLevelList" :label="tItem.id" :key="tIndex">{{tItem.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
            <el-form-item>
                <el-button style="margin-top: 30px;width: 150px" type="primary" @click="submitForm()" :disabled="submitOver">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "editRole",
        data(){
            return{
                roleList:[],
                roleForm:{
                    roleName:'',
                    activeNames:[]
                },
                rulesForm:{
                    roleName: [
                        { required: true,min: 1, message: '请输入10字以内角色名称', trigger: 'blur' },
                        { max: 10, message: '字符超过限制', trigger: 'blur' }
                    ],
                },
                memberId:'',
                checkedList: [],
                checkedListSecond: [],
                checkedListThird: [],
                submitOver:false
            }
        },
        mounted() {
            const session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0;
            this.getRoleList()
        },
        methods: {
            async getRoleList(){
                let res = await this.$http.getAllRole({type:5})
                if(res.status==='success'){
                    this.roleList = res.data
                    this.roleList.map(k=>{
                        k.twoLevelList.map(m=>{
                            m.checkedList = []
                        })
                    })
                    this.getRoleInfo()
                    this.$forceUpdate()
                }
            },
            async getRoleInfo(){
                let res = await this.$http.roleDetail({id:this.$route.params.id})
                if(res.status==='success'){
                    let data = res.data[0]
                    this.roleForm.roleName = data.roleName
                    this.checkedList = data.roleOneIds.split(',')
                    this.checkedListSecond = data.roleTwoIds.split(',')
                    this.checkedListThird = (data.roleThreeIds.split(',')).map(Number)
                    this.roleList.map(k=>{
                        k.twoLevelList.map(m=>{
                            let checkedDone = []
                            m.threeLevelList.map(n=>{
                                if(this.checkedListThird.indexOf(n.id)>-1){
                                    checkedDone.push(n.id)
                                    m.checkedList = checkedDone
                                    this.$forceUpdate()
                                }
                            })
                        })
                    })
                    console.log(this.roleList);
                }
            },
            handleChange(){
                this.$forceUpdate()
            },
            changecCheck(){
                this.$forceUpdate()
            },
            /*确定添加*/
            async submitForm(){
                let roleOneIds = ''
                let roleTwoIds = ''
                let roleThreeIds = ''
                let checkedList = []
                let checkedListSecond = []
                let checkedListThird = []
                this.roleList.map(k=>{
                    let checked = []
                    let checkedSecond = []
                    let checkedThird = []
                    k.twoLevelList.map(m=>{
                        if(m.checkedList.length>0){
                            checked = checked.concat(k.id)
                            checkedSecond.push(m.id)
                            checkedThird = checkedThird.concat(m.checkedList)
                        }
                    })
                    checked = [...new Set(checked)];
                    checkedSecond = [...new Set(checkedSecond)];
                    checkedThird = [...new Set(checkedThird)];
                    checkedList = checkedList.concat(checked)
                    checkedListSecond = checkedListSecond.concat(checkedSecond)
                    checkedListThird = checkedListThird.concat(checkedThird)
                    this.checkedList = checkedList
                    this.checkedListSecond = checkedListSecond
                    this.checkedListThird = checkedListThird
                })
                if(this.checkedList){
                    roleOneIds = this.checkedList.join(',')
                }
                if(this.checkedListSecond){
                    roleTwoIds = this.checkedListSecond.join(',')
                }
                if(this.checkedListThird){
                    roleThreeIds = this.checkedListThird.join(',')
                }
                let data = {
                    type:2,
                    id:this.$route.params.id,
                    member_id:this.memberId,
                    roleOneIds:roleOneIds,
                    roleTwoIds:roleTwoIds,
                    roleThreeIds:roleThreeIds,
                    roleName:this.roleForm.roleName,
                }
                if(this.roleForm.roleName.length>0&&this.roleForm.roleName.length<=10){
                    this.submitOver = true
                    let res = await this.$http.roleSave(data)
                    if(res.status==='success'){
                        this.$message({
                            type: 'success',
                            message: res.msg || '添加成功',
                            duration: 1000,
                        });
                        setTimeout(() => {
                            this.$router.push({name: 'roleManagement'});
                            this.submitOver = false
                        }, 1000);
                    }else{
                        this.submitOver = false
                        this.$message({
                            type: 'error',
                            message: res.msg,
                            duration: 1000,
                        });
                    }
                }else{
                    setTimeout(() => {
                        this.submitOver = false;
                    }, 1000);
                    this.$message({
                        type: 'warning',
                        message: '请输入10字以内角色名称',
                        duration: 1000,
                    });
                }
            }
        },
        watch:{
            roleList(){
                return this.roleList
            }
        }
    }
</script>

<style scoped>

</style>
