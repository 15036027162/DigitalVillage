<template>
    <div class="addRole_content">
        <el-form :inline="true" :model="roleForm" :rules="rulesForm" class="demo-form-inline" label-width="150px" ref="roleForm">
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
                <el-button style="margin-top: 30px;width: 150px" type="primary" @click="submitForm('roleForm')" :disabled="submitAdmin">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "addRole",
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
                submitAdmin:false
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
                    this.$forceUpdate()
                }
            },
            handleChange(){
                this.$forceUpdate()
            },
            changecCheck(){
                this.roleList.map(k=>{
                    k.twoLevelList.map(m=>{
                        if(m.checkedList.length>0){
                            m.threeLevelList.map(n=>{
                                if(n.name==='查看' && m.checkedList.indexOf(n.id)==-1){
                                    m.checkedList.push(n.id)
                                }else{
                                    return
                                }
                            })
                        }
                    })
                })
                this.$forceUpdate()
            },
            /*确定添加*/
            async submitForm(roleForm){
                this.$refs[roleForm].validate(async (valid) => {
                    if (valid) {
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
                        })
                        if(checkedList){
                            roleOneIds = checkedList.join(',')
                        }
                        if(checkedListSecond){
                            roleTwoIds = checkedListSecond.join(',')
                        }
                        if(checkedListThird){
                            roleThreeIds = checkedListThird.join(',')
                        }
                        let data = {
                            type:1,
                            member_id:this.memberId,
                            roleOneIds:roleOneIds,
                            roleTwoIds:roleTwoIds,
                            roleThreeIds:roleThreeIds,
                            roleName:this.roleForm.roleName,
                        }
                        if(this.roleForm.roleName.length>0&&this.roleForm.roleName.length<=10){
                            let res = await this.$http.roleSave(data)
                            if(res.status==='success'){
                                this.submitAdmin = true
                                this.$message({
                                    type: 'success',
                                    message: res.msg || '添加成功',
                                    duration: 1000,
                                });
                                setTimeout(() => {
                                    this.$router.push({name: 'roleManagement'});
                                    this.submitAdmin = false
                                }, 1000);
                            }else{
                                setTimeout(() => {
                                    this.submitAdmin = false;
                                }, 1000);
                                this.$message({
                                    type: 'error',
                                    message: res.msg,
                                    duration: 1000,
                                });
                            }
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '请输入10字以内角色名称',
                                duration: 1000,
                            });
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
