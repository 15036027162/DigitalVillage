<template>
    <div class="addRole_content">
        <el-form :inline="true" :model="roleForm" class="demo-form-inline" label-width="150px">
            <el-form-item label="角色名称：">{{roleForm.roleName}}</el-form-item>
            <el-collapse v-model="roleForm.activeNames"  @change="handleChange">
                <el-collapse-item v-for="(item,index) in roleList" :key="index" :name="item.id" :title="item.name">
                    <el-form-item :label="sItem.name" style="display: block;" v-for="(sItem,sIndex) in item.twoLevelList" :key="sIndex">
                        <el-checkbox-group v-model="sItem.checkedList" v-if="sItem.threeLevelList.length" @change="changecCheck">
                            <el-checkbox v-for="(tItem,tIndex) in sItem.threeLevelList" :label="tItem.id" :key="tIndex" disabled>{{tItem.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
            <!--<el-form-item>
                <el-button style="margin-top: 30px;width: 150px" type="primary" @click="submitForm()">确定</el-button>
            </el-form-item>-->
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "moreRole",
        data(){
            return{
                roleList:[],
                roleForm:{
                    roleName:'',
                    activeNames:[]
                },
                memberId:'',
                checkedList: [],
                checkedListSecond: [],
                checkedListThird: []
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
                    let arrList = []
                    this.roleList = res.data
                    this.roleList.map(k=>{
                        k.twoLevelList.map(m=>{
                            m.checkedList = []
                        })
                        arrList.push(k.id)
                    })
                    this.roleForm.activeNames = arrList
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
                }
            },
            handleChange(){
                this.$forceUpdate()
            },
            changecCheck(){
                this.$forceUpdate()
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
