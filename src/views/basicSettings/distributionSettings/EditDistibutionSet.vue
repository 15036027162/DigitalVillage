<template>
    <div>
        <el-form :model="addDistibution" label-width="140px" :rules="rulesDistibution" ref="distibutionEdit">
            <el-form-item label="场景分类：" required>
                <el-select v-model="addDistibution.sceneClassify" placeholder="--请选择--" disabled>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <!--<el-form-item label="发放方式：" prop="name" class="radioAddScore">
                <el-radio-group v-model="addDistibution.isDoorOpen" size="medium">
                    <el-radio-button :label="'1'">个人</el-radio-button>
                    <el-radio-button :label="'2'">家庭</el-radio-button>
                </el-radio-group>
            </el-form-item>-->
            <el-form-item label="事项名称：" prop="name">
                <el-input v-model="addDistibution.name" placeholder="请输入50字以内的事件名称"
                          style="width: 600px;margin-right: 50px"></el-input>
            </el-form-item>
            <div v-if="showSence">
                <el-form-item label="积分：" prop="honorValue"
                              style="width: 340px;margin-right: 50px;display: inline-block">
                    <el-input v-model="addDistibution.honorValue" placeholder="0"></el-input>
                </el-form-item>
                <el-form-item label="额外分：" prop="honorExtraPoint"
                              style="width: 340px;margin-right: 50px;display: inline-block">
                    <el-input v-model="addDistibution.honorExtraPoint" placeholder="0"></el-input>
                </el-form-item>
            </div>
            <div v-if="showSence">
                <el-form-item label="额外分人数：" prop="extraNum" style="width: 340px;margin-right: 50px;">
                    <el-input v-model="addDistibution.extraNum" placeholder="0"></el-input>
                </el-form-item>
            </div>
            <div v-if="!showSence">
                <el-form-item label="扣除积分：" prop="deductMarks" style="width: 340px;margin-right: 50px;">
                    <el-input v-model="addDistibution.deductMarks" placeholder="0"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="拍照：" required>
                <el-radio-group v-model="addDistibution.isPhotos">
                    <el-radio :label="'1'">非必选</el-radio>
                    <el-radio :label="'2'">必选</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="文字说明：" required>
                <el-radio-group v-model="addDistibution.isTextDesc">
                    <el-radio :label="'1'">非必填</el-radio>
                    <el-radio :label="'2'">必填</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('distibutionEdit')" :disabled="submitOver">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "EditDistibutionSet",
        data() {
            return {
                addDistibution: {
                    sceneClassify: '',
                    isDoorOpen: '1',
                    name: '',
                    honorValue: '',
                    honorExtraPoint: '',
                    extraNum: '',
                    deductMarks: '',
                    isPhotos: '1',
                    isTextDesc: '1',
                    areaCode: "",
                    areaName: "",
                    streetCode: "",
                    streetName: "",
                    villageCode: "",
                    villageName: ""
                },
                rulesDistibution: {
                    name: [
                        {required: true, min: 1, message: '请输入50字以内的事项名称', trigger: 'blur'},
                        {max: 50, message: '字符超过限制', trigger: 'blur'}
                    ],
                    honorValue: [
                        {required: true, message: "请输入积分", trigger: "blur"},
                        {
                            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                            message: '请输入数字类型'
                        }
                    ],
                    honorExtraPoint: [
                        {required: true, message: "请输入额外分", trigger: "blur"},
                        {
                            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                            message: '请输入数字类型'
                        }
                    ],
                    extraNum: [
                        {required: true, message: "请输入额外分人数", trigger: "blur"},
                        {
                            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                            message: '请输入数字类型'
                        }
                    ],
                    deductMarks: [
                        {required: true, message: "请输入扣除积分", trigger: "blur"},
                        {
                            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                            message: '请输入数字类型'
                        }
                    ],
                },
                tipsSub: false,
                showSence: true,
                options:[],
                submitOver:false,
            }
        },
        created() {
            this.getInfo()
            this.getName()
        },
        methods: {
            /*获取场景*/
            async getName() {
                let res = await this.$http.getSelectDictionary({type: "3"})
                if (res.status === 'success') {
                    this.options = res.data
                }
            },
            async getInfo() {
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let memberId = session_adminInfo.memberId || 0;
                let res = await this.$http.getDistributionMember({
                    id: this.$route.params.id,
                    memberId: memberId,
                });
                if (res.status === 'success') {
                    Object.assign(this.addDistibution, res.data[0]);
                    if(this.addDistibution.sceneClassify==8){
                        this.showSence = false
                        this.addDistibution.deductMarks = this.addDistibution.honorValue
                    }else{
                        this.showSence = true
                        this.addDistibution.deductMarks = ''
                    }
                }
            },

            /*提交按钮*/
            infoTips() {
                if (this.addDistibution.name.length <= 0 || this.addDistibution.name.length > 50) {
                    this.$message({
                        type: 'warning',
                        message: '请输入事项名称/字符超过限制',
                        duration: 1000,
                    });
                } else if (this.addDistibution.honorValue.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请输入积分',
                        duration: 1000,
                    });
                } else if (this.addDistibution.honorExtraPoint.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请输入积分额外分',
                        duration: 1000,
                    });
                } else if (this.addDistibution.extraNum.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请输入积分分人数',
                        duration: 1000,
                    });
                } else {
                    return this.tipsSub = true
                }
            },
            infoTips2() {
                if (this.addDistibution.name.length <= 0 || this.addDistibution.name.length > 50) {
                    this.$message({
                        type: 'warning',
                        message: '请输入事项名称/字符超过限制',
                        duration: 1000,
                    });
                } else if (this.addDistibution.deductMarks.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请输入扣除积分',
                        duration: 1000,
                    });
                } else {
                    return this.tipsSub = true
                }
            },
            async submitForm() {
                let honorValue = ''
                if (this.showSence === false) {
                    this.infoTips2()
                    honorValue = this.addDistibution.deductMarks
                } else {
                    honorValue = this.addDistibution.honorValue
                    this.infoTips()
                }
                let data = {
                    id: this.$route.params.id,
                    name: this.addDistibution.name,
                    honorValue: honorValue || '0',
                    honorExtraPoint: this.addDistibution.honorExtraPoint || '0',
                    extraNum: this.addDistibution.extraNum || '0',
                    isTextDesc: this.addDistibution.isTextDesc,
                    isPhotos: this.addDistibution.isPhotos,
                    isDoorOpen: this.addDistibution.isDoorOpen
                }
                if (this.tipsSub == true) {
                    this.submitOver = true
                    let res = await this.$http.distributionSetUpdate(data)
                    if (res.status === 'success') {
                        this.$message({
                            type: 'success',
                            message: res.msg || '修改成功',
                            duration: 1000,
                        });
                        setTimeout(() => {
                            this.$router.push({name: 'distributionSet'});
                            this.submitOver = false
                        }, 1000);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg,
                            duration: 1000,
                        });
                        setTimeout(() => {
                            this.submitOver = false
                        }, 1000);
                    }
                }else{
                    this.submitOver = false
                }
            },
        },
        watch: {
            addDistibution() {
                return this.addDistibution
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
