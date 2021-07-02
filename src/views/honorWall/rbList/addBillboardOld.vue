<template>
    <div>
        <el-form :model="addBillboardForm" :rules="rulesBill" label-width="100px">
            <el-form-item label="发布主题：" prop="theme">
                <el-input v-model="addBillboardForm.theme" placeholder="请输入18字以内的事件主题" style="width: 600px;margin-right: 50px"></el-input>
                <el-radio-group v-model="addBillboardForm.bill" size="medium">
                    <el-radio-button :label="1">红榜</el-radio-button>
                    <el-radio-button :label="2">黑榜</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <!--红榜添加-->
            <el-form-item label="红榜名单：" required v-if="addBillboardForm.bill==1">
                <el-button size="medium" @click="addBill">+ 添加</el-button><span class="addBillNum">已添加 {{addBillboardForm.billListRed.length}} 户</span>
                <!--添加审核-->
                <ul class="distibutionSetList">
                    <li v-for="(item,index) in addBillboardForm.billListRed" :key="index">
                        <el-form-item style="display: inline-block">
                            <p class="billName">姓名：{{item.name}}</p>
                            <el-input v-model="item.remarks" placeholder="请输入50字以内的上榜理由" style="width: 500px;margin-right: 50px"></el-input>
                        </el-form-item>
                        <span class="disClose el-icon-error disCloseBill" @click="clearBillRed(index)"></span>
                    </li>
                </ul>
            </el-form-item>
            <!--黑榜添加-->
            <el-form-item label="黑榜名单：" required v-if="addBillboardForm.bill==2">
                <el-button size="medium" @click="addBill">+ 添加</el-button><span class="addBillNum">已添加 {{addBillboardForm.billListBlack.length}} 户</span>
                <!--添加审核-->
                <ul class="distibutionSetList">
                    <li v-for="(item,index) in addBillboardForm.billListBlack" :key="index">
                        <el-form-item style="display: inline-block">
                            <p class="billName">姓名：{{item.name}}</p>
                            <el-input v-model="item.remarks" placeholder="请输入50字以内的上榜理由" style="width: 500px;margin-right: 50px"></el-input>
                        </el-form-item>
                        <span class="disClose el-icon-error disCloseBill" @click="clearBillBlack(index)"></span>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 100px" type="primary" size="medium"  @click="releaseBillboard">发布</el-button>
            </el-form-item>
        </el-form>

        <!--新增-->
        <honerModel ref="honerModel" @addMember="addMember"></honerModel>
    </div>
</template>

<script>
    import honerModel from '@/components/public/honorWall/honerModel'
    export default {
        name: "addBillboard",
        components:{honerModel},
        data(){
            return{
                addBillboardForm:{
                    theme:'',
                    bill:1,
                    billListRed:[],
                    billListBlack:[]
                },
                rulesBill:{
                    theme: [
                        { required: true,min: 1, message: '请输入发布主题', trigger: 'blur' },
                        { max: 18, message: '字符超过限制', trigger: 'blur' }
                    ],
                },
            }
        },
        methods:{
            /*添加人员*/
            addBill(){
                this.$refs.honerModel.showHoner = true
            },
            addMember(val){
                let _this = this
                if(_this.addBillboardForm.bill==1){
                    _this.addBillboardForm.billListRed.push({memberId:val.memberId,name:val.name,remarks:''})
                }else{
                    _this.addBillboardForm.billListBlack.push({memberId:val.memberId,name:val.name,remarks:''})
                }
            },

            /*删除人员*/
            clearBillRed(index){
                this.addBillboardForm.billListRed.splice(index,1)
            },
            clearBillBlack(index){
                this.addBillboardForm.billListBlack.splice(index,1)
            },

            /*发布*/
            async releaseBillboard(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let creatorName = session_adminInfo.name || 0;
                let deptLevel = session_adminInfo.deptLevel || 0;
                let deptDistrictsCode = session_adminInfo.deptDistrictsCode || 0;
                let deptDistrictsName = session_adminInfo.deptDistrictsName || 0;
                let data ={}
                if(this.addBillboardForm.bill==1){
                    data = {
                        memberId:memberId,
                        creatorName:creatorName,
                        type:this.addBillboardForm.bill,
                        title:this.addBillboardForm.theme,
                        rankLevel:deptLevel,
                        rankDistrictsCode:deptDistrictsCode,
                        rankDistrictsName:deptDistrictsName,
                        list:this.addBillboardForm.billListRed,
                    }
                }else{
                    data = {
                        memberId:memberId,
                        creatorName:creatorName,
                        type:this.addBillboardForm.bill,
                        title:this.addBillboardForm.theme,
                        rankLevel:deptLevel,
                        rankDistrictsCode:deptDistrictsCode,
                        rankDistrictsName:deptDistrictsName,
                        list:this.addBillboardForm.billListBlack,
                    }
                }

                if(this.addBillboardForm.theme.length<=0 || this.addBillboardForm.theme.length>18){
                    this.$message({
                        type: 'warning',
                        message: '发布主题不能为空/字符超过限制',
                        duration: 1000,
                    });
                }else{
                    if(this.addBillboardForm.billListRed || this.addBillboardForm.billListBlack){
                        let showTips = false
                        if(this.addBillboardForm.billListRed){
                            this.addBillboardForm.billListRed.map(k=>{
                                if(k.remarks.length<=0 || k.remarks.length>50){
                                    showTips = true
                                }
                            })
                        }
                        if(this.addBillboardForm.billListBlack){
                            this.addBillboardForm.billListBlack.map(k=>{
                                if(k.remarks.length<=0 || k.remarks.length>50){
                                    showTips = true
                                }
                            })
                        }
                        if(showTips == false){
                            let res = await this.$http.rankListAdd(data)
                            if(res.status==='success'){
                                this.$message({
                                    type: 'success',
                                    message: res.msg || '发布成功',
                                    duration: 1000,
                                });
                                setTimeout(() => {
                                    this.$router.push({name: 'billboard'});
                                }, 1000);
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.msg,
                                    duration: 1000,
                                });
                            }
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '上榜理由不能为空/字符超过限制',
                                duration: 1000,
                            });
                        }
                    }else{
                        this.$message({
                            type: 'warning',
                            message: '名单不能为空',
                            duration: 1000,
                        });
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
