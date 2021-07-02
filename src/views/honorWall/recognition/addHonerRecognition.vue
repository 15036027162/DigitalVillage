<template>
    <div>
        <el-form :model="addHonerForm" :rules="rulesHoner" label-width="140px" ref="addHonerForm">
            <el-form-item label="发布主题：" prop="theme">
                <el-input v-model="addHonerForm.theme" placeholder="请输入20字以内的事件主题" style="width: 600px;"></el-input>
            </el-form-item>
            <el-form-item label="表彰名称：" prop="type">
                <el-select v-model="addHonerForm.type" placeholder="--请选择--" clearable @change="SelectedDrug($event)">
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="表彰说明：" prop="desc">
                <el-input type="textarea" v-model="addHonerForm.desc" placeholder="请输入30以内的表彰说明"
                          style="width: 600px;"></el-input>
            </el-form-item>
            <el-form-item label="荣誉墙显示：" required>
                <el-radio-group v-model="addHonerForm.status">
                    <el-radio :label="1">置顶显示</el-radio>
                    <el-radio :label="2">显示</el-radio>
                    <el-radio :label="3">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--红榜添加-->
            <el-form-item label="添加获得者：" required>
                <el-button size="medium" @click="addHonerUser">+ 添加</el-button>
                <span class="addBillNum">已添加 {{addHonerForm.dynamicTags.length}} 户</span>
                <!--添加审核-->
                <div class="honerRecognition">
                    <el-tag
                            :key="index"
                            v-for="(tag,index) in addHonerForm.dynamicTags"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                        {{tag.name}}
                    </el-tag>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 100px" type="primary" size="medium" @click="releaseHonerForm('addHonerForm')" :disabled="submitOver">发布</el-button>
            </el-form-item>
        </el-form>

        <!--新增-->
        <honerModel ref="honerModel" @addMember="addMember"></honerModel>
    </div>
</template>

<script>
    import honerModel from '@/components/public/honorWall/honerModelReg'

    export default {
        name: "addHonerRecognition",
        components: {honerModel},
        data() {
            return {
                addHonerForm: {
                    theme: '',
                    type: '',
                    desc: '',
                    dynamicTags: [],
                    status: 1,
                },
                rulesHoner: {
                    theme: [
                        {required: true, min: 1, message: '请输入发布主题', trigger: 'blur'},
                        {max: 20, message: '字符超过限制', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请输入表彰名称', trigger: 'blur'},
                    ],
                    desc: [
                        {required: true, message: '请输入表彰说明', trigger: 'blur'},
                        {max: 30, message: '字符超过限制', trigger: 'blur'}
                    ],
                },
                options: [],
                submitOver:false
            }
        },
        mounted() {
            this.getName()
        },
        methods: {
            /*获取名称*/
            async getName() {
                let res = await this.$http.getCommendation()
                if (res.status === 'success') {
                    this.options = res.data
                }
            },
            /*添加人员*/
            addHonerUser() {
                this.$refs.honerModel.showHoner = true
            },
            addMember(val) {
                let _this = this
                _this.addHonerForm.dynamicTags.push({memberId: val.memberId, name: val.name})
            },
            /*关闭人员*/
            handleClose(tag) {
                this.addHonerForm.dynamicTags.splice(this.addHonerForm.dynamicTags.indexOf(tag), 1);
            },

            /**/
            SelectedDrug(val) {
                console.log(val);
            },

            /*发布*/
            async releaseHonerForm(addHonerForm) {
                this.$refs[addHonerForm].validate(async (valid) => {
                    if (valid) {
                        let tagsId = ''
                        if (this.addHonerForm.dynamicTags) {
                            this.addHonerForm.dynamicTags.map(k => {
                                tagsId += k.memberId + ','
                            })
                        }
                        if (tagsId.length <= 0) {
                            this.$message({
                                type: 'warning',
                                message: '人员不能为空',
                                duration: 1000,
                            });
                        } else {
                            let res = await this.$http.commendationPublish({
                                operationType: 1,
                                id: '',
                                type: this.addHonerForm.type,
                                remarks: this.addHonerForm.desc,
                                status: this.addHonerForm.status,
                                winType: 1,
                                title: this.addHonerForm.theme,
                                memberIds: tagsId,  //用，隔开
                            })
                            if (res.status === 'success') {
                                this.submitOver = true
                                this.$message({
                                    type: 'success',
                                    message: res.msg || '发布成功',
                                    duration: 1000,
                                });
                                setTimeout(() => {
                                    this.$router.push({name: 'honerRecognition'});
                                    this.submitOver = false
                                }, 1000);
                            } else {
                                this.submitOver = false
                                this.$message({
                                    type: 'error',
                                    message: res.msg,
                                    duration: 1000,
                                });
                            }
                        }
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
