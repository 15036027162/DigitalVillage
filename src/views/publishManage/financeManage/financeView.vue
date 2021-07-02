
<template>
  <div class="policyView">
     
    <div class="examstatus examstatus1" >
      <div>状态：</div>
      <span>{{ details.state1}}</span>
    </div>
    <div class="viewItem">
      <label>金融主题：</label>
      <div>{{ details.title }}</div>
    </div>
    <div class="viewItem">
      <label>更新时间：</label>
      <div>{{ details.updateTime }}</div>
    </div>
    <div class="viewItem" >
      <label>发布人：</label>
      <div>{{ details.creator }}</div>
    </div>
     <div class="viewItem">
      <label>所属区划：</label>
      <div>{{ details.areaName }}{{ details.streetName }}{{details.villageName}}</div>
    </div>
    
    <div class="viewItem">
      <label>封面图片：</label>
      <div>
        <img v-if="details.picUrl" class :src="details.picUrl" alt />
      </div>
    </div>

    <div class="viewItem">
      <label>政策内容：</label>
      <div v-html="details.context"></div>
    </div>
    

    <!-- <div class="viewItem" v-if="details.state == 3">
      <label>审核未通过原因：</label>
      <div>{{ details.reason }}</div>
    </div> -->
  
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      dialogFormVisible: false,

      ruleForm: {
        desc: ""
      },
      rules: {
        desc: [
          { required: true, message: "请输入50字以内不通过的备注说明", trigger: "blur" }
        ]
      },
      listMain: {
        pageNo: 1,
        totalPage: 0,
        pageSize: 10,
        total: 100
      },
      loading: false,
      id: "",
      tableListData: [],
      searchForm: {
        rank: "-1",
        region: 0,
        userName: "",
        phone: "",
        dateBetween: ""
      },
      searchForm1: {
        //没有点击查询情况下点击分页重置参数
      },
      details: {},
      obj: {},
      type:'',
     
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    
    this.getListData();
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getFinanceDetail({
        id: this.id || 1
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData;
        if (this.details.status == 1) {
          this.details.state1 = "上架";
        } else if (this.details.status == 2) {
          this.details.state1 = "下架";
        } 
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
   
    
  
   
  }
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
