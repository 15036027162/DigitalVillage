<template>
    <div>
        <el-form :model="addDistibution" label-width="140px"  :rules="rulesDistibution" ref="distibutionEdit">
            <el-form-item label="区域选择：" required>
                <provinces @changeTown="changeTown" :isadd="true"></provinces>
            </el-form-item>
            <el-form-item label="场景分类：" prop="sceneClassify">
                <el-select v-model="addDistibution.sceneClassify" placeholder="--请选择--" clearable @change="scenceChange($event)">
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    <!--<el-option label="遵纪守法类" value="1"></el-option>
                    <el-option label="热心公益类" value="2"></el-option>
                    <el-option label="乡村建设类" value="3"></el-option>
                    <el-option label="环境治理类" value="4"></el-option>
                    <el-option label="奖励荣誉类" value="5"></el-option>
                    <el-option label="文明建设类" value="6"></el-option>
                    <el-option label="孝老爱亲类" value="7"></el-option>
                    <el-option label="综合扣分类" value="8"></el-option>-->
                </el-select>
            </el-form-item>
            <!--<el-form-item label="发放方式：" required class="radioAddScore">
                <el-radio-group v-model="addDistibution.isDoorOpen" size="medium">
                    <el-radio-button :label="'0'">个人</el-radio-button>
                    <el-radio-button :label="'1'">家庭</el-radio-button>
                </el-radio-group>
            </el-form-item>-->
            <el-form-item label="事项名称：" prop="name">
                <el-input v-model="addDistibution.name" placeholder="请输入50字以内的事件名称" style="width: 600px;margin-right: 50px"></el-input>
            </el-form-item>
            <div v-if="showSence">
                <el-form-item label="积分：" prop="honorValue" style="width: 340px;margin-right: 50px;display: inline-block">
                    <el-input v-model="addDistibution.honorValue" placeholder="0"></el-input>
                </el-form-item>
                <el-form-item label="额外分：" prop="honorExtraPoint" style="width: 340px;margin-right: 50px;display: inline-block">
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
    import provinces from "@/components/common/provinces1";
    export default {
        name: "addDistibutionSet",
        components:{provinces},
        data(){
            return{
                addDistibution:{
                    sceneClassify:'',
                    isDoorOpen:'1',
                    name:'',
                    honorValue:'',
                    honorExtraPoint:'',
                    extraNum:'',
                    deductMarks:'',
                    isPhotos:'1',
                    isTextDesc:'1',
                    areaCode: "",
                    areaName: "",
                    streetCode: "",
                    streetName: "",
                    villageCode: "",
                    villageName: ""
                },
                rulesDistibution:{
                    sceneClassify: [{required: true, message: "请选择场景分类", trigger: "change"}],
                    name: [
                        { required: true,min: 1, message: '请输入50字以内的事项名称', trigger: 'blur' },
                        { max: 50, message: '字符超过限制', trigger: 'blur' }
                    ],
                    honorValue:[
                        {required: true, message: "请输入积分", trigger: "blur"},
                        { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字类型' }
                    ],
                    honorExtraPoint:[
                        {required: false, message: "请输入额外分", trigger: "blur"},
                        { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字类型' }
                    ],
                    extraNum:[
                        {required: false, message: "请输入额外分人数", trigger: "blur"},
                        { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字类型' }
                    ],
                    deductMarks:[
                        {required: true, message: "请输入扣除积分", trigger: "blur"},
                        { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字类型' }
                    ],
                },
                tipsSub:false,
                showSence:true,
                options:[],
                submitOver:false
            }
        },
        mounted() {
            this.getName()
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.addDistibution.areaCode = session_adminInfo.areaCode
            this.addDistibution.areaName = session_adminInfo.areaName
            if(session_adminInfo.deptLevel==5){
                this.addDistibution.streetCode = session_adminInfo.streetCode
                this.addDistibution.streetName = session_adminInfo.streetName
                this.addDistibution.villageCode = session_adminInfo.villageCode
                this.addDistibution.villageName = session_adminInfo.villageName
            }else if(session_adminInfo.deptLevel==4){
                this.addDistibution.streetCode = session_adminInfo.streetCode
                this.addDistibution.streetName = session_adminInfo.streetName
            }
        },
        methods:{
            /*获取场景*/
            async getName() {
                let res = await this.$http.getSelectDictionary({type: "3"})
                if (res.status === 'success') {
                    this.options = res.data
                }
            },
            /*改变扣分*/
            scenceChange(val){
                if (val == 8) {
                    this.showSence = false
                } else {
                    this.showSence = true
                }
            },

            /*提交按钮*/
            infoTips(){
               /* if(this.addDistibution.villageName.length<=0){
                    this.$message({
                        type: 'warning',
                        message: '请选择区域到村',
                        duration: 1000,
                    });
                }
                else */
                if(this.addDistibution.sceneClassify.length<=0){
                    this.$message({
                        type: 'warning',
                        message: '请选择场景分类',
                        duration: 1000,
                    });
                }
                else if(this.addDistibution.name.length<=0 || this.addDistibution.name.length>50){
                    this.$message({
                        type: 'warning',
                        message: '请输入事项名称/字符超过限制',
                        duration: 1000,
                    });
                }
                else if(this.addDistibution.honorValue.length<=0){
                    this.$message({
                        type: 'warning',
                        message: '请输入积分',
                        duration: 1000,
                    });
                }
                // else if(this.addDistibution.honorExtraPoint.length<=0){
                //     this.$message({
                //         type: 'warning',
                //         message: '请输入积分额外分',
                //         duration: 1000,
                //     });
                // }
                // else if(this.addDistibution.extraNum.length<=0){
                //     this.$message({
                //         type: 'warning',
                //         message: '请输入积分分人数',
                //         duration: 1000,
                //     });
                // }
                else{
                    return this.tipsSub = true
                }
            },
            infoTips2(){
                if(this.addDistibution.sceneClassify.length<=0){
                    this.$message({
                        type: 'warning',
                        message: '请选择场景分类',
                        duration: 1000,
                    });
                }
                else if(this.addDistibution.name.length<=0 || this.addDistibution.name.length>50){
                    this.$message({
                        type: 'warning',
                        message: '请输入事项名称/字符超过限制',
                        duration: 1000,
                    });
                }
                else if(this.addDistibution.deductMarks.length<=0){
                    this.$message({
                        type: 'warning',
                        message: '请输入扣除积分',
                        duration: 1000,
                    });
                }else{
                    return this.tipsSub = true
                }
            },
            async submitForm(distibutionEdit){
                let honorValue = ''
                this.$refs[distibutionEdit].validate(async (valid) => {
                    if (valid) {
                        if(this.showSence===false){
                            this.infoTips2()
                            honorValue = this.addDistibution.deductMarks
                        }else{
                            honorValue = this.addDistibution.honorValue
                            this.infoTips()
                        }
                        let data = {
                            sceneClassify:this.addDistibution.sceneClassify,
                            name:this.addDistibution.name,
                            honorValue:honorValue || '0',
                            honorExtraPoint:this.addDistibution.honorExtraPoint || '0',
                            extraNum:this.addDistibution.extraNum || '0',
                            isTextDesc:this.addDistibution.isTextDesc,
                            isPhotos:this.addDistibution.isPhotos,
                            isDoorOpen:this.addDistibution.isDoorOpen,
                            areaCode: this.addDistibution.areaCode,
                            areaName: this.addDistibution.areaName,
                            streetCode: this.addDistibution.streetCode,
                            streetName: this.addDistibution.streetName,
                            villageCode: this.addDistibution.villageCode,
                            villageName: this.addDistibution.villageName
                        }
                        if(this.tipsSub==true){
                            this.submitOver = true
                            let res = await this.$http.distributionSetAdd(data)
                            if(res.status==='success'){
                                this.$message({
                                    type: 'success',
                                    message: res.msg || '添加成功',
                                    duration: 1000,
                                });
                                setTimeout(() => {
                                    this.$router.push({name: 'distributionSet'});
                                    this.submitOver = false
                                }, 1000);
                            }else{
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
                    }
                })
            },

            /*区域选择*/
            changeTown(val) {
                this.addDistibution.areaCode = val.cityCode;
                this.addDistibution.areaName = val.cityName;
                this.addDistibution.streetCode = val.townCode;
                this.addDistibution.streetName = val.townName;
                this.addDistibution.villageCode = val.villageCode;
                this.addDistibution.villageName = val.villageName;
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
