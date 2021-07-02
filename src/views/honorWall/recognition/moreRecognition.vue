<template>
    <ul class="moreRecognitionList">
        <li><span>发布主题：</span>{{moreRecognitionInfo.title}}</li>
        <li><span>表彰类型：</span>{{moreRecognitionInfo.typeExplain}}</li>
        <li><span>表彰人：</span>{{moreRecognitionInfo.honorName}}</li>
        <li><span>备注：</span>{{moreRecognitionInfo.remarks}}</li>
        <li><span>发布组织：</span>{{moreRecognitionInfo.publishName}}</li>
        <li><span>发布时间：</span>{{moreRecognitionInfo.createTime}}</li>
    </ul>
</template>

<script>
    export default {
        name: "moreRecognition",
        data(){
            return{
                moreRecognitionInfo:{}
            }
        },
        mounted() {
            this.getInfo()
        },
        methods:{
            /*获取列表*/
            async getInfo(){
                let res = await this.$http.commendationDetails({
                    id:this.$route.params.id,
                })
                if(res.status==='success'){
                    this.moreRecognitionInfo = res.data[0]
                    if(this.moreRecognitionInfo.type==1){
                        this.moreRecognitionInfo.typeName = '美丽庭院'
                    }else{
                        this.moreRecognitionInfo.typeName = '五好家庭'
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .moreRecognitionList li{
        font-size: 14px;
        margin-bottom: 20px;
    }
    .moreRecognitionList li span{
        width: 120px;
        display: inline-block;
        text-align: right;
        margin-right: 10px;
    }
</style>
