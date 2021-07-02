<template>
    <div>
        <el-form :model="publicityForm" :rules="publicityRules" label-width="130px" ref="publicityForm">
            <div class="userHeader">积分公示列表设置</div>
            <el-form-item class="changeNum" label="公示时间：" prop="publicDay">
                <el-input type="number" v-model="publicityForm.publicDay" style="width: 200px" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
                <span style="margin-left: 10px">天</span>
            </el-form-item>
            <div class="userHeader">积分捐赠比例设置</div>
            <el-form-item label="是否短信验证：" prop="isMessage" required>
                <el-switch v-model="publicityForm.isMessage" :active-value="0" :inactive-value="1" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
            <div class="clear">
                <el-form-item class="changeNum fl-left" label="捐赠比例：" prop="donateIntegral">
                    <el-input type="number" v-model="publicityForm.donateIntegral" placeholder="可用积分" style="width: 150px;" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
                </el-form-item>
                <div class="changePublicity">
                    <el-form-item class="fl-left">
                        <img src="../../../assets/img/scale_icon.png" class="scaleIcon">
                    </el-form-item>
                    <el-form-item class="changeNum fl-left" prop="donateHonor">
                        <el-input type="number" v-model="publicityForm.donateHonor" placeholder="积分总额" style="width: 150px" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
                    </el-form-item>
                </div>
            </div>
            <el-form-item class="changeNum" label="捐赠说明：" prop="donateComment">
                <el-input type="textarea" minlength="0" maxlength="500" style="width: 350px" placeholder="输入500字以内的捐赠说明" :rows="8" v-model="publicityForm.donateComment"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium"  @click="submitForm('publicityForm')" :disabled="submitOver">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "publicitySet",
        data(){
            const isIntegerNum = (rule, value, callback) => {
                // const reg = /^\d$|^[1][0-5]$/ig;
                const reg =  /^(?:[1-9]|1[0-5])$/;
                const rsCheck = reg.test(value);
                if (!rsCheck) {
                    callback(new Error('公示时间为1-15的整数'));
                } else {
                    callback();
                }
            };
            const ratioNum = (rule, value, callback) => {
                const reg = /^([1-9]|9)$/;
                const rsCheck = reg.test(value);
                if (!rsCheck) {
                    callback(new Error('捐赠比例为1-9整数'));
                } else {
                    callback();
                }
            };
            return{
                publicityForm:{
                    publicDay:0,
                    isMessage:0,
                    donateIntegral:0,
                    donateHonor:0,
                    donateComment:''
                },
                publicityRules:{
                    publicDay:[
                        {required: true, message: '请输入公示时间', trigger: 'blur'},
                        {validator: isIntegerNum, trigger: 'blur'}
                    ],
                    donateIntegral:[
                        {required: true, message: '请输入捐赠比例', trigger: 'blur'},
                        {validator: ratioNum, trigger: 'blur'}
                    ],
                    donateHonor:[
                        {required: true, message: '请输入捐赠比例', trigger: 'blur'},
                        {validator: ratioNum, trigger: 'blur'}
                    ],
                    donateComment:[{required: true, message: '请输入500字以内的捐赠说明', trigger: 'blur',min: 1, max: 500}]
                },
                id:'',
                submitOver:false
            }
        },
        mounted() {
            this.getInfo()
        },
        methods:{
            /*详情*/
            async getInfo(){
                let res = await this.$http.getpublicityDetail();
                if(res.status==='success'){
                    this.publicityForm = res.data[0]
                    this.id = res.data[0].id
                }
            },
            /*保存*/
            submitForm(publicityForm){
                this.$refs[publicityForm].validate(async valid => {
                    let data = {
                        id:this.id,
                        publicDay:this.publicityForm.publicDay,
                        isMessage:this.publicityForm.isMessage,
                        donateIntegral:this.publicityForm.donateIntegral,
                        donateHonor:this.publicityForm.donateHonor,
                        donateComment:this.publicityForm.donateComment
                    }
                    if (valid) {
                        this.submitOver = true
                        const res = await this.$http.editpublicityDetail(data);
                        if (res.status === "success") {
                            this.$message({
                                type: "success",
                                message: res.msg
                            });
                            setTimeout(() => {
                                this.getInfo()
                                this.submitOver = false
                            }, 1000);
                            this.$refs[publicityForm].resetFields();
                        } else {
                            this.$message({
                                type: "error",
                                message: res.msg
                            });
                            setTimeout(() => {
                                this.submitOver = false
                            }, 1000);
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .scaleIcon{
        display: inline-block;
        width: 30px;
        margin: 0 10px;
    }
</style>
