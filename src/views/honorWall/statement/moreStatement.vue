<template>
    <div>
        <p style="font-weight: 600;font-size: 16px;margin-bottom: 10px">{{villageName}}积分规则说明：</p>
        <div v-html="stateContent"></div>
        <!--<el-form :model="addStateForm" label-width="150px">
            <el-form-item label="说明内容详情：">
                <el-input type="textarea" v-model="addStateForm.desc" style="width: 600px;"></el-input>
            </el-form-item>
        </el-form>-->
    </div>
</template>

<script>
    export default {
        name: "moreStatement",
        data(){
            return{
                stateContent:'',
                villageName:'',
            }
        },
        mounted() {
            this.getInfo()
        },
        methods:{
            async getInfo(){
                let res = await this.$http.honorstatementDetail({
                    id:this.$route.params.id
                })
                if(res.status==='success'){
                    this.stateContent = res.data[0].details
                    this.villageName = res.data[0].villageName
                }
            }
        }
    }
</script>

<style scoped>

</style>
