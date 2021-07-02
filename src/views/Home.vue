<!--  -->
<template>
  <div class="index_bg">
    <div class="rightBstns">
      <div class="left">首页</div>
      <provinces @changeTown="changeTown" class="right" v-show='this.deptLevel!=5'></provinces>
    </div>
    <ul class="topul">
      <li>
        <div class="divbox">
          <div class="boxleft">
            <div>
              <countTo
                :startVal="0"
                :endVal="homeData.registerCount?homeData.registerCount:0"
                :duration="3000"
              ></countTo>
            </div>
            <div>注册人数（人）</div>
          </div>
          <div class="boxright">
            <img src="../assets/zc.png" alt="" class="imgs0" />
          </div>
        </div>
      </li>
      <li>
        <div class="divbox divbox2">
          <div class="boxleft">
            <div>
              <countTo
                :startVal="0"
                :endVal="homeData.activeDoorCount?homeData.activeDoorCount:0"
                :duration="3000"
              ></countTo>
            </div>
            <div>激活家庭（户）</div>
          </div>
          <div class="boxright">
            <img src="../assets/jh.png" alt="" class="imgs1"/>
          </div>
        </div>
      </li>
      <li>
        <div class="divbox divbox3">
          <div class="boxleft">
            <div>
              <countTo
                :startVal="0"
                :endVal="homeData.ableHonorTotal?homeData.ableHonorTotal:0"
                :duration="3000"
              ></countTo>

            </div>
            <div>积分 可兑换额度</div>
          </div>
          <div class="boxright">
            <img src="../assets/ry.png" alt="" class="imgs2" />
          </div>
        </div>
      </li>

      <li>
        <div class="divbox divbox4">
          <div class="boxleft">
            <div>
              <span style="font-size:16px">￥</span>
              <countTo
                :startVal="0"
                :endVal="homeData.exchangeGoodsTotal?homeData.exchangeGoodsTotal:0"
                :duration="3000"
              ></countTo>
            </div>
            <div>可兑换物品价值</div>
          </div>
          <div class="boxright">
            <img src="../assets/du.png" alt="" class="imgs3" />
          </div>
        </div>
      </li>
    </ul>
    <!-- 基本情况 -->
    <div class="middel">
      <div class="middlewarp1">
        <div class="middlebox">
          <div class="middletit">基本概况</div>
          <ul class="jbgk">
            <li>
              <div>
                <span>{{ homeData.publicTotal }}</span
                >条
              </div>
              <div>积分公示信息</div>
            </li>
            <li>
              <div>
                <span>{{ homeData.commendationTotal }}</span
                >户
              </div>
              <div>表彰总户数</div>
            </li>
            <li>
              <div>
                <span>{{ homeData.redTotal }}</span
                >人
              </div>
              <div>好人好事名单</div>
            </li>
            <!-- <li >
              <div>
                <span>{{ homeData.blackTotal }}</span
                >人
              </div>
              <div>黑榜名单</div>
            </li> -->
               <li>
              <div>
                <span>{{ homeData.policyTotal }}</span
                >件
              </div>
              <div>信息公开</div>
            </li>
          </ul>
          <ul class="jbgk">
            <!-- <li>
              <div>
                <span>{{ homeData.policyTotal }}</span
                >件
              </div>
              <div>信息公开</div>
            </li> -->
            <li>
              <div>
                <span>{{ homeData.dynamicTotal }}</span
                >条
              </div>
              <div>村民互动信息</div>
            </li>
            <li>
              <div>
                <span>{{ homeData.ableGoodsCount }}</span>
              </div>
              <div>可兑商品数(件)</div>
            </li>
            <li>
              <div>
                
                <span>{{ homeData.honorSetTotal }}</span
                >项
              </div>
              <div>奖罚场景事项</div>
            </li>
            <li >
              <div style="color:transparent">
                <span style="color:transparent">{{ homeData.blackTotal }}</span
                >人
              </div>
              <div style="color:transparent">黑榜名单</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="middlewarp2">
        <div class="middlebox">
          <div class="middletit">待处理事件</div>
          <ul class="dcl">
            <li @click="gord">
              <div class="dclleft">
                <img src="../assets/sh.png" alt="" />
                <div>信息公开<span>待审核</span>事件</div>
              </div>
              <div class="dclright" v-if="waits.length > 0">
                {{ waits[0].policyWait }}
              </div>
            </li>
            <li @click="gocm">
              <div class="dclleft">
                <img src="../assets/sh.png" alt="" />
                <div>村民提交积分<span>待审核</span>事件</div>
              </div>
              <div class="dclright" v-if="waits.length > 0">
                {{ waits[0].villWait }}
              </div>
            </li>
            <li @click="gory">
              <div class="dclleft">
                <img src="../assets/sh.png" alt="" />
                <div>积分批量<span>待审核</span>事件</div>
              </div>
              <div class="dclright" v-if="waits.length > 0">
                {{ waits[0].batchWait }}
              </div>
            </li>
            <li @click="gosc">
              <div class="dclleft">
                <img src="../assets/sh.png" alt="" />
                <div>商城新增商品<span>待审核</span>事件</div>
              </div>
              <div class="dclright" v-if="waits.length > 0">
                {{ waits[0].goodWait }}
              </div>
            </li>
            <li @click="gorz">
              <div class="dclleft">
                <img src="../assets/sh.png" alt="" />
                <div>村民实名认证<span>待审核</span>事件</div>
              </div>
              <div class="dclright" v-if="waits.length > 0">
                {{ waits[0].realWait }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="topDiv">
      <!-- 图表 -->
      <div class="chartdiv">
        <div class="chartleft">
          <div class="chartwrap">
            <div class="middletit">各类场景发放积分占比</div>
            <div class="chart" id="piechart"></div>
            <div class="total">
              <div>{{ totalcout }}</div>
              <div>发放总额</div>
            </div>
          </div>
        </div>
        <div class="chartleft">
          <div class="chartwrap">
            <div class="middletit">家庭积分排名</div>
            <div class="chart" id="piechart2"></div>
          </div>
        </div>
      </div>
    </div>
    <div style="height:20px"></div>
    <div class="topDiv">
      <!-- 图表 -->
      <div class="chartdiv">
        <div class="chartleft">
          <div class="chartwrap">
            <div class="middletit">商城可兑换物品情况</div>
            <div class="chart" id="linechart"></div>
          </div>
        </div>
        <div class="chartleft">
          <div class="chartwrap">
            <div class="middletit">可兑积分与商品总分对比</div>
            <div class="wrapss">
              <div class="btndiv btndiv1">
                <div class="counts">{{ homeData.ableHonorTotal }}</div>
                <div class="counts">{{ homeData.goodsPointTotal }}</div>
              </div>
              <div class="btndiv">
                <div class="leftbtn">可兑积分</div>
                <div class="rightbtn">商品总分值</div>
                <div class="headerss"></div>
              </div>
              <div style="height:20px"></div>
              <div class="btndiv btndiv1">
                <div class="counts">{{ homeData.exchangeGoodsPrice }}</div>
                <div class="counts">{{ homeData.exchangeGoodsTotal?homeData.exchangeGoodsTotal:0 }}</div>
              </div>
              <div class="btndiv">
                <div class="leftbtn">可兑积分折现</div>
                <div class="rightbtn">商品总价</div>
                <div class="headerss"></div>
              </div>
              <div class="currenhonor">
                <span>当前积分</span>
                <span>1</span>
                <img src="../assets/u611.png" alt="" />
                <span>=</span>
                <span>￥</span>
                <span>{{ homeData.honorPriceUnit }}</span>
              </div>
              <div class="currenhonor">
                <span>当前商品数量</span>
                <span>{{ homeData.ableGoodsCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="compayInfo">
     美丽乡村信息技术（苏州）有限公司提供技术支持 服务热线：0512-66291001
    </p>
  </div>
</template>

<script>
import provinces from "../components/common/provinces";
import echarts from "echarts";
import countTo from "vue-count-to";
export default {
  components: {
    provinces,
    countTo
  },
  name: "home",
  data() {
    return {
      searchForm: {
        areaCode: "",
        streetCode: "",
        villageCode: ""
      },
      boxId: 0, //工单位置
      boxTime: "",
      tableData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      pieid: "",
      pieid2: "",
      lineid: "",
      homeData: "",
      typeList: [],
      typeDataList: [],
      waits: [],
      doorNameList: [],
      honorPointList: [],
      integralPointList: [],
      goodsNameList: [],
      changePointList: [],
      plusPointPointList: [],
      totalcout: 0
    };
  },
  computed: {
    top: function() {
      return -this.boxId * 50 + "px";
    }
  },
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
     this.searchForm.areaCode = this.adminUserInfo.areaCode;
    if (this.deptLevel == 4) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
    }
    if (this.deptLevel == 5) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
      this.searchForm.villageCode = this.adminUserInfo.villageCode;
    }
  },
  mounted() {
    this.getdata();
    // this.piechart1();
    // this.piechart2();
    // this.linechart();
    window.onresize = () => {
      this.pieid.resize();
      this.pieid2.resize();
      this.lineid.resize();
    };
    this.boxRun();
  },
  methods: {
    //
    gord() {
      //content:policy:view
      if (this.isAuth("content:policy:view")) {
        this.$router.push({
          name: "policyPublish"
        });
      } else {
        this.$alert("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning"
        });
      }
    },
    gocm() {
      if (this.isAuth("honor:single:view")) {
        this.$router.push({
          name: "villagerExam"
        });
      } else {
        this.$alert("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning"
        });
      }
    },
    gory() {
      if (this.isAuth("honor:batch:view")) {
        this.$router.push({
          name: "honorValueExam"
        });
      } else {
        this.$alert("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning"
        });
      }
    },
    gosc() {
      if (this.isAuth("base:goods:view")) {
        this.$router.push({
          name: "goodsManage"
        });
      } else {
        this.$alert("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning"
        });
      }
    },
    gorz() {

       if (this.isAuth("base:auth:view")) {
        this.$router.push({
          name: "authentication"
        });
      } else {
        this.$alert("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning"
        });
      }
    },
    async getdata(item, type) {
      const res = await this.$http.header({
        ...this.searchForm
      });
      if (res.code === "0") {
        this.homeData = res.data[0];
        this.waits = res.data[0].waits;
        // 饼图
this.typeDataList=[]

        if (this.homeData.distributions.length > 0) {
          this.typeList = this.homeData.distributions.map(val => {
            return val.sceneClassifyExplain;
          });
          for (var i = 0; i < this.homeData.distributions.length; i++) {
             var obj = {};
            obj.name = this.homeData.distributions[i].sceneClassifyExplain;
            obj.value = this.homeData.distributions[i].scores;
            this.typeDataList.push(obj);
          }
          this.totalcout = this.homeData.distributions[0].disScores;
          this.piechart1();
        } else {
          this.typeList = [];
          this.typeDataList = [];
          this.totalcout = 0;
          this.piechart1();
        }

        //第二个条形图
        if (this.homeData.doors.length > 0) {
          this.doorNameList = this.homeData.doors.map(val => {
            return val.doorName;
          });
          this.honorPointList = this.homeData.doors.map(val => {
            return val.honorPoint;
          });
          this.integralPointList = this.homeData.doors.map(val => {
            return val.integralPoint;
          });
          this.piechart2();
        } else {
          this.doorNameList = [];
          this.honorPointList = [];
          this.integralPointList = [];
          this.piechart2();
        }

        //第三个堆积图
        if (this.homeData.headerGoodsModels.length > 0) {
          this.goodsNameList = this.homeData.headerGoodsModels.map(val => {
            return val.goodsName;
          });
          this.changePointList = this.homeData.headerGoodsModels.map(val => {
            return val.changePoint;
          });
          this.plusPointPointList = this.homeData.headerGoodsModels.map(val => {
            return val.plusPoint;
          });
          this.linechart();
        } else {
          this.goodsNameList = [];
          this.changePointList = [];
          this.plusPointPointList = [];
          this.linechart();
        }
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },

    forstart() {
      this.boxRun();
    },
    forbidden() {
      clearInterval(this.boxTime);
    },
    /*工单滚动*/
    boxRun() {
      this.boxTime = setInterval(_ => {
        if (this.tableData.length > 4) {
          if (this.boxId <= this.tableData.length) {
            this.boxId += 1;
            this.tableData.push(this.tableData[this.boxId - 1]);
          } else {
            this.boxId = 0;
          }
        }
      }, 2000);
    },
    piechart1() {
      this.pieid = echarts.init(document.getElementById("piechart"));
      this.pieid.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%"
        },
        color: [
          "#fbd437",
          "#f2637b",
          "#975fe5",
          "#5254cf",
          "#3aa1ff",
          "#36cbcb",
          "#4fcb74",
        ],
        legend: {
          orient: "horizontal",
          bottom: -4,
          center: "center",
          data: this.typeList,
          icon: "circle"
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["40%", "60%"],
             center: ["50%", "45%"],
            avoidLabelOverlap: true,
            labelLine:{
                normal:{
                    length:4
                }
            },
            emphasis: {
              // label: {
              //   show: true,
              //   fontSize: "20",
              //   fontWeight: "bold"
              // }
            },
            label: {
              formatter: "{b}: {d}%"
            },

            data: this.typeDataList
          }
        ]
      });
    },

    piechart2() {
      this.pieid2 = echarts.init(document.getElementById("piechart2"));
      this.pieid2.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        color: ["#4ecb73", "#0099ff"],
        legend: {
          data: ["积分总额", "可兑换额度"]
          // bottom:20,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: this.doorNameList,
          axisLabel: {
            interval: 0
        }
        },
        series: [
          {
            name: "积分总额",
            type: "bar",
            data: this.honorPointList,
             barGap: '0%'
          },
          {
            name: "可兑换额度",
            type: "bar",
            data: this.integralPointList
          }
        ]
      });
    },
    linechart() {
      this.lineid = echarts.init(document.getElementById("linechart"));
      this.lineid.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ["#4ecb73", "#0099ff"],
        legend: {
          data: ["已兑商品", "剩余商品"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.goodsNameList,
            axisLabel: {
              rotate: 30,
              interval: 0
            },

          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            name: "已兑商品",
            type: "bar",
            stack: "",
            data: this.changePointList
          },
          {
            name: "剩余商品",
            type: "bar",
            stack: "",
            data: this.plusPointPointList
          }
        ]
      });
    },
    changeTown(val) {
        this.searchForm.areaCode = val.cityCode;
        this.searchForm.streetCode = val.townCode;
        this.searchForm.villageCode = val.villageCode;
      this.getdata();
    }
  }
};
</script>
<style lang='less'>
.index_bg {
  .rightBstns {
    margin-top: -20px;
    overflow: hidden;
    height: 60px;
    line-height: 60px;
    background: #fff;
    margin-bottom: 20px;
    border-bottom: 1px solid #f0f0f2;
    .left {
      float: left;
      color: #606266;
    }
    .right {
      float: right;
      margin-right: 0;
      .formItem {
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .btndiv {
    overflow: hidden;
    text-align: center;
    position: relative;
    width: 80%;
    margin: 0 auto;
  }
  .btndiv1 {
    margin-bottom: 4px;
  }
  .currenhonor {
    font-size: 14px;
    color: #606266;
    margin: 0 auto;
    width: 80%;
    img {
      height: 20px;
      width: 20px;
    }
    span {
      &:nth-child(1) {
        margin-right: 8px;
      }
      &:nth-child(2) {
        font-size: 28px;
        color: #ffa12a;
      }
      &:nth-child(4) {
        font-size: 32px;
        color: #666666;
      }
      //  &:nth-child(4) {
      //   font-size: 18px;
      //   color: #FF0000;
      // }
      &:nth-child(5) {
        font-size: 18px;
        color: #ff0000;
      }
      &:nth-child(6) {
        font-size: 28px;
        color: #ff0000;
      }
    }
  }
  .counts {
    width: 50%;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    float: left;
  }

  .leftbtn {
    width: 50%;
    height: 40px;
    line-height: 40px;
    background: #4ecb73;
    border-radius: 40px 0 0 40px;
    float: left;
    color: #fff;
    font-size: 14px;
  }

  .leftbtn1 {
    background: #0c77fb;
  }

  .rightbtn {
    width: 50%;
    height: 40px;
    line-height: 40px;
    background: #0099ff;
    border-radius: 0 40px 40px 0;
    float: left;
    color: #fff;
    font-size: 14px;
  }

  .rightbtn1 {
    background: #fb890c;
  }

  .headerss {
    width: 0px;
    height: 0px;
    border-color: #4ecb73 #0099ff #0099ff #4ecb73;
    border-width: 20px;
    border-style: solid;
    margin: 0px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .headerss1 {
    border-color: #0c77fb #fb890c #fb890c #0c77fb;
  }
  .topul {
    list-style: none;
    display: flex;
    li {
      width: 25%;
      box-sizing: border-box;
      margin-bottom: 20px;
      &:nth-child(1) {
        padding-right: 20px;
      }
      &:nth-child(2) {
        padding-right: 20px;
      }
      &:nth-child(3) {
        padding-right: 20px;
      }
      .divbox {
        width: 100%;
        height: 94px;
        padding: 0 20px;
        box-sizing: border-box;
        background: url("../assets/bg1@2x.png");
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        .boxleft {
          flex: 1;
          div {
            font-size: 24px;

            color: #fff;
            &:last-child {
              font-size: 16px;
              margin-top: 4px;
            }
          }
        }
        .boxright {
          // width: 52px;
          // height: 54px;
          .imgs0{
            width: 52px;
          height: 54px;
          }
           .imgs1{
            width: 60px;
          height: 54px;
          }
           .imgs2{
            width: 52px;
          height: 56px;
          }
           .imgs3{
            width: 72px;
          height: 54px;
          }

        }
      }
      .divbox2 {
        background: url("../assets/bg2@2x.png");
        background-size: 100% 100%;
      }
      .divbox3 {
        background: url("../assets/bg3@2x.png");
        background-size: 100% 100%;
      }
      .divbox4 {
        background: url("../assets/bg4@2x.png");
        background-size: 100% 100%;
      }
    }
  }
  .middletit {
    font-size: 16px;
    font-weight: bold;
    line-height: 50px;
    height: 50px;
  }
  .middel {
    display: flex;
    margin-bottom: 20px;
    .middlewarp1 {
      width: 60%;
      padding-right: 20px;
      box-sizing: border-box;
    }
    .middlewarp2 {
      width: 40%;
      box-sizing: border-box;
      .dcl {
        li {
          list-style: none;
          display: flex;
          line-height: 34px;
          justify-content: space-between;
          text-align: center;
          .dclleft {
            display: flex;
            align-items: center;
            cursor: pointer;
            img {
              width: 20px;
              height: 20px;
              margin-right: 8px;
            }
            div {
              font-size: 14px;
              color: #606266;
              text-decoration: underline;
              span {
                color: #409eff;
              }
            }
          }
          .dclright {
            font-size: 14px;
            color: #f56c6c;
          }
        }
      }
    }

    .middlebox {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #ebeef5;
      box-sizing: border-box;

      padding: 20px;
      padding-top: 0px;
      border-radius: 10px;
      height: 240px;

      .jbgk {
        list-style: none;
        display: flex;
        justify-content: space-around;
        text-align: center;
        &:last-child {
          margin-top: 20px;
        }
        li {
          flex: 1;
          div {
            color: #909399;
            font-size: 14px;
            span {
              font-weight: bold;
              font-size: 20px;
              color: #f18f49;
            }
            &:last-child {
              padding-top: 4px;
              font-size: 16px;
              color: #606266;
            }
          }
        }
      }
    }
  }
  .topTit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    height: 50px;
    .topTitleft {
      font-size: 16px;
      color: goldenrod;
      font-weight: bold;
      img {
        width: 30px;
        height: 30px;
        margin-right: 2px;
      }
    }
    .formItem {
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .topDiv {
    box-sizing: border-box;
    // padding: 0 10px;

    .chartdiv {
      width: 100%;
      display: flex;

      .chartleft {
        flex: 1;
        box-sizing: border-box;
        padding-right: 20px;
        &:last-child {
          padding-right: 0;
        }
        .chartwrap {
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #ebeef5;
          box-sizing: border-box;
          padding: 20px;
          padding-top: 0px;
          border-radius: 10px;
          position: relative;
          .total {
            position: absolute;
            top: 48%;
            left: 50%;
            transform: translate(-50%, -50%);
            div {
              text-align: center;
              &:first-child {
                margin-top: 20px;
                margin-bottom: 2px;
                font-weight: bold;
              }
            }
          }
        }
        #piechart,
        #piechart2,
        #linechart,
        .wrapss {
          width: 100%;
          height: 240px;
        }
        .charttit {
          height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 50%;
          float: right;
          text-align: center;
          .charttit1 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .charttit2 {
            font-size: 30px;
            font-weight: bold;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            div {
              color: red;
              span {
                font-weight: normal;
                color: red;
                font-size: 20px;
              }
            }
          }
        }
      }
    }
  }
  .bottomdiv {
    margin-top: 10px;
    display: flex;
    .leftdiv {
      flex: 1;
      padding-right: 5px;
      .leftdivs {
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 0 10px;
        box-sizing: border-box;
      }
      &:last-child {
        padding-left: 5px;
        padding-right: 0px;
      }
    }

    .rankdiv {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 30px 0;
      .rankleft {
        width: 116px;
        height: 116px;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 6px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        .rankno {
          color: red;
          font-size: 16px;
          font-weight: bold;
        }
        .rankname {
          color: red;
          font-size: 18px;
        }
        img {
          width: 50px;
        }
      }
      .rankleft2 {
        transform: scale(1.2);
      }
    }
  }
  .ranklist {
    box-sizing: border-box;
    padding-bottom: 10px;
    .rankHeader {
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      background: #ccc;
      text-align: center;
      overflow: hidden;
      div {
        float: left;
        width: 50%;
        &:first-child {
          width: 30%;
          border-right: 1px solid #fff;
        }
        &:last-child {
          border-left: 1px solid #fff;
          width: 20%;
        }
      }
    }
    .rankwrap {
      position: relative;
      height: 250px;
      overflow: hidden;
      .rankbox {
        transition: top 0.7s;
        width: 100%;
        position: absolute;
        top: 0;
      }
    }
    .rankcon {
      list-style: none;

      // height: 300px;
      // overflow: hidden;
      li {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        text-align: center;
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
        div {
          float: left;
          width: 50%;
          &:first-child {
            width: 30%;
          }
          &:last-child {
            width: 20%;
          }
        }
        .ranknumber {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 4px;
          line-height: 40px;
          text-align: center;
          background: red;
          color: #fff;
        }
      }
    }
  }
  .compayInfo {
    width: 100%;

    line-height: 40px;
    text-align: center;
    font-size: 12px;
  }
}
</style>
