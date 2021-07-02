<template>
    <div>
        <el-form :model="BillboardForm" label-width="120px">
            <el-form-item label="姓名："><span>{{BillboardForm.name}}</span></el-form-item>
            <el-form-item label="所属村组："><span>{{BillboardForm.memberIdRegion || '--'}}</span></el-form-item>
           <!-- <el-form-item label="红黑榜："><span>{{BillboardForm.typeName}}</span></el-form-item>-->
            <el-form-item label="上榜理由："><span>{{BillboardForm.title}}</span></el-form-item>
            <el-form-item label="状态："><span>{{BillboardForm.statusName}}</span></el-form-item>
            <el-form-item label="发布组织："><span>{{BillboardForm.creatorRegion}}</span></el-form-item>
            <el-form-item label="发布时间："><span>{{BillboardForm.createTime}}</span></el-form-item>
            <el-form-item label="撤榜时间："><span>{{BillboardForm.endTime}}</span></el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "moreBillboard",
        data(){
            return{
                BillboardForm:{}
            }
        },
        mounted() {
            this.getInfo()
        },
        methods:{
            async getInfo(){
                let res = await this.$http.rankListById({
                    id:this.$route.params.id
                })
                if(res.status==='success'){
                    this.BillboardForm = res.data[0]
                    if(res.data[0].type==1){
                        res.data[0].typeName = '红榜'
                    }else{
                        res.data[0].typeName = '黑榜'
                    }
                    if(res.data[0].status==0){
                        res.data[0].statusName = '公示中'
                    }else{
                        res.data[0].statusName = '已撤榜'
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
