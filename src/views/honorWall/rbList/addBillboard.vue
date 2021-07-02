<template>
    <div>
        <el-form :model="addBillboardForm" :rules="rulesBill" label-width="100px" ref="billboardForm">
            <!--<el-form-item label="红黑榜：" required>
                <el-radio-group v-model="addBillboardForm.bill" size="medium">
                    <el-radio-button :label="1">红榜</el-radio-button>
                    <el-radio-button :label="2">黑榜</el-radio-button>
                </el-radio-group>
            </el-form-item>-->
            <el-form-item label="上榜理由：" prop="theme">
                <el-input type="textarea" v-model="addBillboardForm.theme" placeholder="请输入30字以内的上榜理由" style="width: 600px"></el-input>
            </el-form-item>
            <el-form-item label="人员选择：" required>
                <el-button size="medium" @click="addBill">+ 添加</el-button>
                <span class="addBillNum">已添加 {{addBillboardForm.billList.length}} 人</span>
                <!--添加审核-->
                <div class="honerRecognition">
                    <el-tag
                            :key="index"
                            v-for="(tag,index) in addBillboardForm.billList"
                            closable
                            :disable-transitions="false"
                            @close="clearBillRed(tag)">
                        {{tag.name}}
                    </el-tag>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 100px" type="primary" size="medium" @click="releaseBillboard('billboardForm')" :disabled="releaseShow">发布</el-button>
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
        components: {honerModel},
        data() {
            return {
                addBillboardForm: {
                    theme: '',
                    bill: 1,
                    billList: []
                },
                rulesBill: {
                    theme: [
                        {required: true, min: 1, message: '请输入发布主题', trigger: 'blur'},
                        {max: 30, message: '字符超过限制', trigger: 'blur'}
                    ],
                },
                releaseShow:false
            }
        },
        methods: {
            /*添加人员*/
            addBill() {
                this.$refs.honerModel.showHoner = true
            },
            addMember(val) {
                let _this = this
                _this.addBillboardForm.billList.push({memberId: val.memberId, name: val.name})
            },

            /*删除人员*/
            clearBillRed(tag) {
                this.addBillboardForm.billList.splice(this.addBillboardForm.billList.indexOf(tag), 1);
            },

            /*发布*/
            async releaseBillboard(billboardForm) {
                this.$refs[billboardForm].validate(async (valid) => {
                    if (valid) {
                        let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                        let areaCode = session_adminInfo.areaCode
                        let areaName = session_adminInfo.areaName
                        let streetCode = session_adminInfo.streetCode
                        let streetName = session_adminInfo.streetName
                        let villageCode = session_adminInfo.villageCode
                        let villageName = session_adminInfo.villageName
                        let data = {}
                        data = {
                            type: this.addBillboardForm.bill,
                            title: this.addBillboardForm.theme,
                            areaCode: areaCode,
                            streetCode: streetCode,
                            villageCode: villageCode,
                            areaName: areaName,
                            streetName: streetName,
                            villageName: villageName,
                            list: this.addBillboardForm.billList,
                        }
                        let tagsId = ''
                        if (this.addBillboardForm.billList) {
                            this.addBillboardForm.billList.map(k => {
                                tagsId += k.memberId + ','
                            })
                        }
                        if (this.addBillboardForm.theme.length <= 0 || this.addBillboardForm.theme.length > 30) {
                            this.$message({
                                type: 'warning',
                                message: '发布主题不能为空/字符超过限制',
                                duration: 1000,
                            });
                        } else if (tagsId.length <= 0) {
                            this.$message({
                                type: 'warning',
                                message: '人员不能为空',
                                duration: 1000,
                            });
                        } else {
                            this.releaseShow = true
                            let res = await this.$http.rankListAdd(data)
                            if (res.status === 'success') {
                                this.$message({
                                    type: 'success',
                                    message: res.msg || '发布成功',
                                    duration: 1000,
                                });
                                setTimeout(() => {
                                    this.$router.push({name: 'billboard'});
                                    this.releaseShow = false
                                }, 1000);
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg,
                                    duration: 1000,
                                });
                                setTimeout(() => {
                                    this.releaseShow = false
                                }, 1000);
                            }
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
