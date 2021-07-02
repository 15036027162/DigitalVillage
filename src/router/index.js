import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
/*商品管理*/
import goodsManage from "@/views/pointSmall/goodsManage";//商品管理列表
import addGoods from "@/views/pointSmall/addGoods";//商品管理添加
import editGoods from "@/views/pointSmall/editGoods";//商品管理编辑
import examGoods from "@/views/pointSmall/examGoods";//商品管理审核
import goodsIndex from "@/views/pointSmall/index";//商品管理

/*积分管理*/
import honorValuePonit from "@/views/honorValueManage/honorValuePonit/honorValuePonit";//积分管理 积分积分列表
import honorValueIndex from "@/views/honorValueManage/honorValuePonit/index";//积分管理
import honorValuePonitView from "@/views/honorValueManage/honorValuePonit/honorValuePonitView";//积分管理 积分积分查看
import honorValueExam from "@/views/honorValueManage/honorValueExam/honorValueExam";//积分管理 积分积分审核
import examIndex from "@/views/honorValueManage/honorValueExam/index";//积分审核
import honorValueExamView from "@/views/honorValueManage/honorValueExam/honorValueExamView";//积分管理  积分积分审核查看
import honorValuePublicity from "@/views/honorValueManage/honorValuePublicity/honorValuePublicity";//积分管理  积分积分公示
import honorValuePublicityIndex from "@/views/honorValueManage/honorValuePublicity/index";//积分管理  积分积分公示
import honorValuePublicityView from "@/views/honorValueManage/honorValuePublicity/honorValuePublicityView";//积分管理  积分积分公示
import villagerExam from "@/views/honorValueManage/villagerExam/villagerExam";//积分管理  村民加分审核
import villagerExamView from "@/views/honorValueManage/villagerExam/villagerExamView";//积分管理  村民加分审核详情
import villagerExamIndex from "@/views/honorValueManage/villagerExam/index";//积分管理  村民加分审核详情
import villagerExamOther from "@/views/honorValueManage/villagerExam/villagerExamOther";//积分管理  村民加分审核其他
import villagerStatistics from "@/views/honorValueManage/villagerStatistics";//积分管理  积分各村统计

import familyhonorValue from "@/views/honorValueManage/familyhonorValue/familyhonorValue";//家庭积分管理 积分积分列表
import familyHonorIndex from "@/views/honorValueManage/familyhonorValue/index";//家庭积分管理
import familyHonorView from "@/views/honorValueManage/familyhonorValue/familyHonorView";//家庭积分管理 积分积分查看
/*信息发布管理*/
import policyPublish from "@/views/publishManage/policyPublish/policyPublish";//信息发布管理  政策发布列表
import addPolicy from "@/views/publishManage/policyPublish/addPolicy";//信息发布管理  政策发布
import policyView from "@/views/publishManage/policyPublish/policyView";//信息发布管理  政策详情
import policyIndex from "@/views/publishManage/policyPublish/index";//信息发布管理  政策发布

import policyExam from "@/views/publishManage/policyExam/policyExam";//信息发布管理  政策审核列表
import policyExamView from "@/views/publishManage/policyExam/policyExamView";//信息发布管理  政策审核详情页
import policyExamIndex from "@/views/publishManage/policyExam/index";//信息发布管理 政策审核

import advertisementPublish from "@/views/publishManage/advertisementPublish/advertisementPublish";//信息发布管理  广告发布列表
import addAdvertisement from "@/views/publishManage/advertisementPublish/addAdvertisement";//信息发布管理  广告发布
import advertisementView from "@/views/publishManage/advertisementPublish/advertisementView";//信息发布管理  广告详情
import advertisementIndex from "@/views/publishManage/advertisementPublish/index";//信息发布管理  广告发布

import advertisementExam from "@/views/publishManage/advertisementExam/advertisementExam";//信息发布管理  广告审核列表
import advertisementExamView from "@/views/publishManage/advertisementExam/advertisementExamView";//信息发布管理  广告审核详情
import advertisementExamIndex from "@/views/publishManage/advertisementExam/index";//信息发布管理  广告审核详情


import financeList from "@/views/publishManage/financeManage/financeList";//信息发布管理  普惠金融列表
import addFinance from "@/views/publishManage/financeManage/addFinance";//信息发布管理   普惠金融
import financeView from "@/views/publishManage/financeManage/financeView";//信息发布管理   普惠金融
import financeManageIndex from "@/views/publishManage/financeManage/index";//信息发布管理   普惠金融

import index from "@/views/index";//主入口

/*荣誉墙管理*/
import honorRanking from "@/views/honorWall/honorRanking/ranking";//荣誉墙管理  积分排行
import addRanking from "@/views/honorWall/honorRanking/addRanking";//荣誉墙管理  积分排行新增
import billboard from "@/views/honorWall/rbList/billboard";//荣誉墙管理  红黑榜
import addBillboard from "@/views/honorWall/rbList/addBillboard";//荣誉墙管理  红黑榜新增
import moreBillboard from "@/views/honorWall/rbList/moreBillboard";//荣誉墙管理  详情
import moreBillRed from "@/views/honorWall/rbList/moreBillRed";//荣誉墙管理  红榜详情
import moreBillBlack from "@/views/honorWall/rbList/moreBillBlack";//荣誉墙管理  黑榜详情
import honerRecognition from "@/views/honorWall/recognition/honerRecognition";//荣誉墙管理  荣誉表彰
import addHonerRecognition from "@/views/honorWall/recognition/addHonerRecognition";//荣誉墙管理  荣誉表彰新增
import moreRecognition from "@/views/honorWall/recognition/moreRecognition";//荣誉墙管理  荣誉表彰详情
import statement from "@/views/honorWall/statement/statement";//荣誉墙管理  积分规则
import moreStatement from "@/views/honorWall/statement/moreStatement";//荣誉墙管理  积分规则-详情
import addStatement from "@/views/honorWall/statement/addStatement";//荣誉墙管理  积分规则-发布
import editStatement from "@/views/honorWall/statement/editStatement";//荣誉墙管理  积分规则-编辑
/*统一身份认证管理*/
import familyList from "@/views/authenticationManage/familyManage/familyList";//家庭管理  家庭列表
import familyIndex from "@/views/authenticationManage/familyManage/index";//家庭管理  家庭管理
import familyView from "@/views/authenticationManage/familyManage/familyView";//家庭管理  家庭详情
import addMember from "@/views/authenticationManage/familyManage/familyView/addMember";//家庭管理  添加成员
import editMember from "@/views/authenticationManage/familyManage/familyView/editMember";//家庭管理  编辑成员
import familyViewIndex from "@/views/authenticationManage/familyManage/familyView/index";//家庭管理  家庭管理
import groupManage from "@/views/authenticationManage/groupManage";//家庭管理  组管理
import villagersRecordList from "@/views/authenticationManage/villagersRecord/villagersRecordList";//村民档案  村民档案列表
import addVillager from "@/views/authenticationManage/villagersRecord/addVillager";//村民档案  添加村民
import villagersRecordView from "@/views/authenticationManage/villagersRecord/villagersRecordView";//村民档案  查看村民
import villagerIndex from "@/views/authenticationManage/villagersRecord/index";//村民档案  村民档案
import userView from "@/views/authenticationManage/familyManage/familyView/userView";//家庭管理家庭详情 查看用户信息
/*基本设置*/
import userManage from "@/views/basicSettings/userManage/userManage";//用户管理  列表
import userManageIndex from "@/views/basicSettings/userManage/index";//用户管理  列表
import userViews from "@/views/basicSettings/userManage/userView";//用户管理  列表
import index1 from "@/views/index1";//主入口

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import(/* webpackChunkName: "about" */ "../views/login.vue"),
    meta: { title: '登录' }
  },
  //首页
  {
    path: '/index',
    component: () => import('@/views/index'),
    name: 'index',
    redirect: { name: 'home' },
    children: [
      {
        path: "/home",
        name: "home",
        component: Home,
        meta: { title: '首页', noCache: true }
      },
      {
        path: "/userInfo",
        name: "userInfo",
        component: () => import('@/views/userInfo'),
        meta: { title: '个人中心' }
      },
    ]
  },

  //基础设置管理
  {
    path: '/index',
    redirect: '/basicSettings/userManage',
    meta: { title: '基础设置' },
    component: () => import('@/views/index'),
    name: 'index',
    children: [
      {
        path: "/basicSettings/organizationManage",
        name: "organizationManage",
        component: () =>
          import(/* webpackChunkName: "about" */ "@/views/basicSettings/organizationManage/organizationManage"),
        meta: { title: '组织管理' },
      },
      {
        path: "/basicSettings/organizationManage",
        name: "organizationManage",
        component: () =>
          import("@/views/basicSettings/organizationManage/index"),
        meta: { title: '组织管理' },
        children: [
          {
            path: "/organizationManage/moreOrganization",
            name: "moreOrganization",
            component: () =>
              import("@/views/basicSettings/organizationManage/moreOrganization"),
            meta: {
              title: '组织成员',
              activeMenu: 'organizationManage'
            },
          },
        ]
      },
      {
        path: "/basicSettings/organizationManage",
        name: "organizationManage",
        component: () =>
          import("@/views/basicSettings/organizationManage/index"),
        meta: { title: '组织管理' },
        children: [
          {
            path: "/organizationManage/moreOrganization",
            name: "moreOrganization",
            component: () =>
              import("@/views/basicSettings/organizationManage/moreAddOrganization/index"),
            meta: { title: '组织成员', },
            children: [
              {
                path: "/organizationManage/moreOrganization/addMoreMember",
                name: "addMoreMember",
                component: () =>
                  import("@/views/basicSettings/organizationManage/moreAddOrganization/addMoreMember"),
                meta: {
                  title: '添加',
                  activeMenu: 'organizationManage'
                },
              },
              {
                path: "/organizationManage/moreOrganization/editMoreMember",
                name: "editMoreMember",
                component: () =>
                  import("@/views/basicSettings/organizationManage/moreAddOrganization/editMoreMember"),
                meta: {
                  title: '修改',
                  activeMenu: 'organizationManage'
                },
              },
            ]
          },
        ]
      },
      {
        path: "/basicSettings/memberManage",
        name: "memberManage",
        component: () =>
          import(/* webpackChunkName: "about" */ "@/views/basicSettings/memberManage/memberManage"),
        meta: { title: '成员管理' },
      },
      {
        path: "/basicSettings/memberManage",
        name: "memberManage",
        component: () =>
          import(/* webpackChunkName: "about" */ "@/views/basicSettings/memberManage/index"),
        meta: { title: '成员管理' },
        children: [
          {
            path: "/memberManage/editMember",
            name: "editMember",
            component: () =>
              import("../views/basicSettings/memberManage/editMember"),
            meta: {
              title: '添加成员',
              activeMenu: 'memberManage'
            },
          },
          {
            path: "/memberManage/changeMember",
            name: "changeMember",
            component: () =>
              import("../views/basicSettings/memberManage/changeMember"),
            meta: {
              title: '修改成员',
              activeMenu: 'memberManage'
            },
          },
        ]
      },
      // 积分发放设置
      {
        path: "/basicSettings/distributionSet",
        name: "distributionSet",
        component: () =>
          import("@/views/basicSettings/distributionSettings/distributionSet"),
        meta: { title: '积分发放设置' },
      },
      {
        path: "/basicSettings/distributionSet",
        name: "distributionSet",
        component: () =>
          import("@/views/basicSettings/distributionSettings/index"),
        meta: { title: '积分发放设置' },
        children: [
          {
            path: "/distributionSet/addDistibutionSet",
            name: "addDistibutionSet",
            component: () =>
              import("@/views/basicSettings/distributionSettings/addDistibutionSet"),
            meta: {
              title: '添加',
              activeMenu: 'distributionSet'
            },
          },
          {
            path: "/distributionSet/EditDistibutionSet/:id",
            name: "EditDistibutionSet",
            component: () =>
              import("@/views/basicSettings/distributionSettings/EditDistibutionSet"),
            meta: {
              title: '编辑',
              activeMenu: 'distributionSet'
            },
          }
        ]
      },
      //组管理
      {
        path: "/basicSettings/groupManage",
        name: "groupManage",
        component: groupManage,
        meta: { title: '村级分组管理' }
      },
      //家庭管理
      {
        path: "/basicSettings/familyList",
        name: "familyList",
        component: familyList,
        meta: { title: '家庭管理' },
      },
      {
        path: "/basicSettings/familyList",
        name: "familyList",
        component: familyIndex,
        meta: { title: '家庭管理' },
        children: [

          {
            path: "/familyList/familyView",
            name: "familyView",
            component: familyView,
            meta: {
              title: '查看',
              activeMenu: 'familyList'
            },
          },
          {
            path: "/familyList/familyView",
            name: "familyView",
            component: familyViewIndex,
            meta: {
              title: '查看',
              activeMenu: 'familyList'
            },
            children: [
              {
                path: "/familyList/addMember",
                name: "addMember",
                component: addMember,
                meta: {
                  title: '添加家庭成员',
                  activeMenu: 'familyList'
                },
              },
              {
                path: "/familyList/editMember",
                name: "editMember",
                component: editMember,
                meta: {
                  title: '编辑家庭成员',
                  activeMenu: 'familyList'
                },
              },
              {
                path: "/familyList/userView",
                name: "userView",
                component: userView,
                meta: {
                  title: '查看用户',
                  activeMenu: 'familyList'
                },
              },
            ]
          },

        ]
      },
      // 用户管理
      {
        path: "/basicSettings/userManage",
        name: "userManage",
        component: userManage,
        meta: { title: '用户管理' },
      },
      {
        path: "/basicSettings/userManage",
        name: "userManage",
        component: userManageIndex,
        meta: { title: '用户管理' },
        children: [
          {
            path: "/basicSettings/userViews",
            name: "userViews",
            component: userViews,
            meta: {
              title: '查看用户',
              activeMenu: 'userManage'
            },
          },
        ]
      },
      // 用户实名审核
      {
        path: "/basicSettings/authentication",
        name: "authentication",
        component: () => import("@/views/basicSettings/authentication/authentication"),
        meta: { title: '用户实名审核' },
      },
      {
        path: "/basicSettings/authentication",
        name: "authentication",
        component: () => import("@/views/basicSettings/authentication/index"),
        meta: { title: '用户实名审核' },
        children: [
          {
            path: "/authentication/moreAuthentication/:id",
            name: "moreAuthentication",
            component: () => import("@/views/basicSettings/authentication/moreAuthentication"),
            meta: {
              title: '查看用户',
              activeMenu: 'authentication'
            },
          },
          {
            path: "/authentication/passAuthentication/:id",
            name: "passAuthentication",
            component: () => import("@/views/basicSettings/authentication/passAuthentication"),
            meta: {
              title: '审核用户',
              activeMenu: 'authentication'
            },
          }
        ]
      },
      //积分商城

      {
        path: "goodsManage",
        name: "goodsManage",
        component: goodsManage,
        meta: { title: '商品管理', }
      },
      {
        path: "goodsManage",
        name: "goodsManage",
        component: goodsIndex,
        meta: { title: '商品管理', },
        children: [
          {
            path: "addGoods",
            name: "addGoods",
            component: addGoods,
            meta: {
              title: '添加',
              activeMenu: 'goodsManage'
            }
          },
          {
            path: "editGoods",
            name: "editGoods",
            component: editGoods,
            meta: {
              title: '编辑',
              activeMenu: 'goodsManage'
            }
          },
          {
            path: "examGoods",
            name: "examGoods",
            component: examGoods,
            meta: {
              title: '审核',
              activeMenu: 'goodsManage'
            }
          },
        ]

      },
      {
        path: "creditList",
        name: "creditList",
       component: () => import("@/views/basicSettings/creditClassify/creditList"),
        meta: { title: '评级授信管理', }
      },
    ]
  },

  //积分管理
  {
    path: '/index',
    redirect: '/honorValueManage/honorValueExam',
    meta: { title: '积分管理' },
    component: index,
    name: 'index',
    children: [
      {
        path: "/honorValueManage/honorValuePonit",
        name: "honorValuePonit",
        component: honorValuePonit,
        meta: { title: '积分积分列表' },
      },

      {
        path: "/honorValueManage/honorValuePonit",
        name: "honorValuePonit",
        component: honorValueIndex,
        meta: { title: '积分积分列表' },
        children: [
          {
            path: "/honorValueManage/honorValuePonitView",
            name: "honorValuePonitView",
            component: honorValuePonitView,
            meta: {
              title: '查看',
              activeMenu: 'honorValuePonit'
            },
          },
        ]

      },

      {
        path: "/honorValueManage/familyhonorValue",
        name: "familyhonorValue",
        component: familyhonorValue,
        meta: { title: '家庭积分列表' },
      },

      {
        path: "/honorValueManage/familyhonorValue",
        name: "familyhonorValue",
        component: familyHonorIndex,
        meta: { title: '家庭积分列表' },
        children: [
          {
            path: "/honorValueManage/familyHonorView",
            name: "familyHonorView",
            component: familyHonorView,
            meta: {
              title: '查看',
              activeMenu: 'familyhonorValue'
            },
          },
        ]

      },

      {
        path: "/honorValueManage/honorValueExam",
        name: "honorValueExam",
        component: honorValueExam,
        meta: { title: '积分审核' },
      },

      {
        path: "/honorValueManage/honorValueExam",
        name: "honorValueExam",
        component: examIndex,
        meta: { title: '积分审核' },
        children: [
          {
            path: "/honorValueManage/honorValueExamView",
            name: "honorValueExamView",
            component: honorValueExamView,
            meta: {
              title: '查看',
              activeMenu: 'honorValueExam'
            },
          },
        ]

      },
      {
        path: "/honorValueManage/honorValuePublicity",
        name: "honorValuePublicity",
        component: honorValuePublicity,
        meta: { title: '积分公示列表' },
      },
      {
        path: "/honorValueManage/honorValuePublicity",
        name: "honorValuePublicity",
        component: honorValuePublicityIndex,
        meta: { title: '积分公示列表' },
        children: [
          {
            path: "/honorValueManage/honorValuePublicityView",
            name: "honorValuePublicityView",
            component: honorValuePublicityView,
            meta: {
              title: '查看',
              activeMenu: 'honorValuePublicity'
            },
          },
        ]
      },
      {
        path: "/honorValueManage/villagerExam",
        name: "villagerExam",
        component: villagerExam,
        meta: { title: '村民加分审核' },
      },
      {
        path: "/honorValueManage/villagerExam",
        name: "villagerExam",
        component: villagerExamIndex,
        meta: { title: '村民加分审核' },
        children: [
          {
            path: "/honorValueManage/villagerExamView",
            name: "villagerExamView",
            component: villagerExamView,
            meta: {
              title: '查看',
              activeMenu: 'villagerExam'
            },
          },
          {
            path: "/honorValueManage/villagerExamOther",
            name: "villagerExamOther",
            component: villagerExamOther,
            meta: {
              title: '审核',
              activeMenu: 'villagerExam'
            },
          },
        ]
      },
      {
        path: "/honorValueManage/villagerStatistics",
        name: "villagerStatistics",
        component: villagerStatistics,
        meta: { title: '各村积分统计' },
      },

    ]
  },

  // //积分商城
  // {
  //   path: '/pointSmall',
  //   component: index,
  //   name: 'index',
  //   redirect: { name: 'goodsManage' },
  //   children: [
  //     {
  //       path: "goodsManage",
  //       name: "goodsManage",
  //       component: goodsManage,
  //       meta: { title: '商品管理', }
  //     },
  //     {
  //       path: "goodsManage",
  //       name: "goodsManage",
  //       component: goodsIndex,
  //       meta: { title: '商品管理', },
  //       children: [
  //         {
  //           path: "addGoods",
  //           name: "addGoods",
  //           component: addGoods,
  //           meta: {
  //             title: '添加',
  //             activeMenu: 'goodsManage'
  //           }
  //         },
  //         {
  //           path: "editGoods",
  //           name: "editGoods",
  //           component: editGoods,
  //           meta: {
  //             title: '编辑',
  //             activeMenu: 'goodsManage'
  //           }
  //         },
  //         {
  //           path: "examGoods",
  //           name: "examGoods",
  //           component: examGoods,
  //           meta: {
  //             title: '审核',
  //             activeMenu: 'goodsManage'
  //           }
  //         },
  //       ]

  //     },
  //   ]
  // },

  //荣誉墙内容管理
  {
    path: '/index',
    component: index,
    name: 'honorWall',
    //redirect: "/honorWall/honorRanking",
    redirect: "/honorWall/billboard",
    meta: { title: '荣誉墙内容管理' },
    children: [
      /*{
        path: "/honorWall/honorRanking",
        name: "honorRanking",
        component: honorRanking,
        meta: { title: '积分排行'}
      },{
        path: "/honorWall/honorRanking",
        name: "honorRanking",
        component: () => import("@/views/honorWall/honorRanking/index"),
        meta: { title: '积分排行'},
        children: [
          {
            path: "/honorRanking/addRanking",
            name: "addRanking",
            component: addRanking,
            meta: { title: '添加'},
          }
        ]
      },*/
      {
        path: "/honorWall/billboard",
        name: "billboard",
        component: billboard,
        meta: { title: '好人好事' }
      }, {
        path: "/honorWall/billboard",
        name: "billboard",
        component: () => import("@/views/honorWall/rbList/index"),
        meta: { title: '好人好事' },
        children: [
          {
            path: "/billboard/addBillboard",
            name: "addBillboard",
            component: addBillboard,
            meta: { title: '发布', activeMenu: 'billboard' },
          },
          {
            path: "/billboard/moreBillboard/:id",
            name: "moreBillboard",
            component: moreBillboard,
            meta: { title: '详情',activeMenu: 'billboard'},
          },
          /*{
            path: "/billboard/moreBillRed/:id",
            name: "moreBillRed",
            component: moreBillRed,
            meta: { title: '红榜详情', activeMenu: 'billboard' },
          },
          {
            path: "/billboard/moreBillBlack/:id",
            name: "moreBillBlack",
            component: moreBillBlack,
            meta: { title: '黑榜详情',activeMenu: 'billboard'},
          }*/
        ]
      },
      {
        path: "/honorWall/honerRecognition",
        name: "honerRecognition",
        component: honerRecognition,
        meta: { title: '荣誉表彰' }
      }, {
        path: "/honorWall/honerRecognition",
        name: "honerRecognition",
        component: () => import("@/views/honorWall/recognition/index"),
        meta: { title: '荣誉表彰' },
        children: [
          {
            path: "/honerRecognition/addHonerRecognition",
            name: "addHonerRecognition",
            component: addHonerRecognition,
            meta: { title: '荣誉表彰发布', activeMenu: 'honerRecognition' },
          },
          {
            path: "/honerRecognition/moreRecognition/:id",
            name: "moreRecognition",
            component: moreRecognition,
            meta: { title: '荣誉表彰详情', activeMenu: 'honerRecognition' },
          }
        ]
      },
      {
        path: "/honorWall/statement",
        name: "statement",
        component: statement,
        meta: { title: '积分规则' }
      }, {
        path: "/honorWall/statement",
        name: "statement",
        component: () => import("@/views/honorWall/statement/index"),
        meta: { title: '积分规则' },
        children: [
          {
            path: "/statement/moreStatement/:id",
            name: "moreStatement",
            component: moreStatement,
            meta: { title: '积分规则详情', activeMenu: 'statement' },
          },
          {
            path: "/statement/addStatement",
            name: "addStatement",
            component: addStatement,
            meta: { title: '发布', activeMenu: 'statement' },
          },
          {
            path: "/statement/editStatement/:id",
            name: "editStatement",
            component: editStatement,
            meta: { title: '编辑', activeMenu: 'statement' },
          }
        ]
      },
      {
        path: "/publishManage/policyPublish",
        name: "policyPublish",
        component: policyPublish,
        meta: { title: '信息公开' },
      },
      {
        path: "/publishManage/policyPublish",
        name: "policyPublish",
        component: policyIndex,
        meta: { title: '信息公开' },
        children: [
          {
            path: "/publishManage/policyView",
            name: "policyView",
            component: policyView,
            meta: {
              title: '查看',
              activeMenu: 'policyPublish'
            },
          },
          {
            path: "/publishManage/addPolicy",
            name: "addPolicy",
            component: addPolicy,
            meta: {
              title: '发布',
              activeMenu: 'policyPublish'
            },
          },
        ]

      },
      {
        path: "/publishManage/advertisementPublish",
        name: "advertisementPublish",
        component: advertisementPublish,
        meta: { title: '首页轮播图管理' },
      },

      {
        path: "/publishManage/advertisementPublish",
        name: "advertisementPublish",
        component: advertisementIndex,
        meta: { title: '首页轮播图管理' },
        children: [
          {
            path: "/publishManage/advertisementView",
            name: "advertisementView",
            component: advertisementView,
            meta: {
              title: '查看',
              activeMenu: 'advertisementPublish'
            },
          },
          {
            path: "/publishManage/addAdvertisement",
            name: "addAdvertisement",
            component: addAdvertisement,
            meta: {
              title: '发布',
              activeMenu: 'advertisementPublish'
            },
          },
        ]

      },


//       import financeList from "@/views/publishManage/financeManage/financeList";//信息发布管理  普惠金融列表
// import addFinance from "@/views/publishManage/financeManage/addFinance";//信息发布管理   普惠金融
// import financeView from "@/views/publishManage/financeManage/financeView";//信息发布管理   普惠金融
// import financeManageIndex from "@/views/publishManage/financeManage/index";//信息发布管理   普惠金融

      {
        path: "/publishManage/financeList",
        name: "financeList",
        component: financeList,
        meta: { title: '普惠金融管理' },
      },

      {
        path: "/publishManage/financeList",
        name: "financeList",
        component: advertisementIndex,
        meta: { title: '普惠金融管理' },
        children: [
          {
            path: "/publishManage/financeView",
            name: "financeView",
            component: financeView,
            meta: {
              title: '查看',
              activeMenu: 'financeView'
            },
          },
          {
            path: "/publishManage/addFinance",
            name: "addFinance",
            component: addFinance,
            meta: {
              title: '发布',
              activeMenu: 'financeList'
            },
          },
        ]

      },


    ]
  },

  //信息发布管理
  // {
  //   path: '/index',
  //   redirect: "/publishManage/policyPublish",
  //   meta: { title: '信息发布' },
  //   component: index,
  //   name: 'index',
  //   children: [
  //     {
  //       path: "/publishManage/policyPublish",
  //       name: "policyPublish",
  //       component: policyPublish,
  //       meta: { title: '市场动向热点信息' },
  //     },
  //     {
  //       path: "/publishManage/policyPublish",
  //       name: "policyPublish",
  //       component: policyIndex,
  //       meta: { title: '市场动向热点信息' },
  //       children: [
  //         {
  //           path: "/publishManage/policyView",
  //           name: "policyView",
  //           component: policyView,
  //           meta: {
  //             title: '政策详情',
  //             activeMenu: 'policyPublish'
  //           },
  //         },
  //         {
  //           path: "/publishManage/addPolicy",
  //           name: "addPolicy",
  //           component: addPolicy,
  //           meta: {
  //             title: '发布',
  //             activeMenu: 'policyPublish'
  //           },
  //         },
  //       ]

  //     },
  //     {
  //       path: "/publishManage/policyExam",
  //       name: "policyExam",
  //       component: policyExam,
  //       meta: { title: '政策审核' },
  //     },

  //     {
  //       path: "/publishManage/policyExam",
  //       name: "policyExam",
  //       component: policyExamIndex,
  //       meta: { title: '政策审核' },
  //       children: [
  //         {
  //           path: "/publishManage/policyExamView",
  //           name: "policyExamView",
  //           component: policyExamView,
  //           meta: {
  //             title: '政策详情',
  //             activeMenu: 'policyExam'
  //           },
  //         },
  //       ]
  //     },
  //     {
  //       path: "/publishManage/advertisementPublish",
  //       name: "advertisementPublish",
  //       component: advertisementPublish,
  //       meta: { title: '首页轮播图管理' },
  //     },

  //     {
  //       path: "/publishManage/advertisementPublish",
  //       name: "advertisementPublish",
  //       component: advertisementIndex,
  //       meta: { title: '首页轮播图管理' },
  //       children: [
  //         {
  //           path: "/publishManage/advertisementView",
  //           name: "advertisementView",
  //           component: advertisementView,
  //           meta: {
  //             title: '广告详情',
  //             activeMenu: 'advertisementPublish'
  //           },
  //         },
  //         {
  //           path: "/publishManage/addAdvertisement",
  //           name: "addAdvertisement",
  //           component: addAdvertisement,
  //           meta: {
  //             title: '发布',
  //             activeMenu: 'advertisementPublish'
  //           },
  //         },
  //       ]

  //     },
  //     {
  //       path: "/publishManage/advertisementExam",
  //       name: "advertisementExam",
  //       component: advertisementExam,
  //       meta: { title: '广告审核' },
  //     },

  //     {
  //       path: "/publishManage/advertisementExam",
  //       name: "advertisementExam",
  //       component: advertisementExamIndex,
  //       meta: { title: '广告审核' },
  //       children: [
  //         {
  //           path: "/publishManage/advertisementExamView",
  //           name: "advertisementExamView",
  //           component: advertisementExamView,
  //           meta: {
  //             title: '广告详情',
  //             activeMenu: 'advertisementExam'
  //           },
  //         },
  //       ]
  //     },

  //   ]
  // },
  //系统设置
  {
    path: '/index',
    redirect: "/systemSettings/categorySetting",
    meta: { title: '系统设置' },
    component: index,
    name: 'index',
    children: [
      {
        path: "/systemSettings/roleManagement",
        name: "roleManagement",
        component: () => import('@/views/systemSettings/roleManagement/roleManagement'),
        meta: { title: '角色管理' }
      },
      {
        path: "/systemSettings/roleManagement",
        name: "roleManagement",
        component: () => import('@/views/systemSettings/roleManagement/index'),
        meta: { title: '角色管理' },
        children: [
          {
            path: "/roleManagement/addRole",
            name: "addRole",
            component: () => import('@/views/systemSettings/roleManagement/addRole'),
            meta: {
              title: '添加角色',
              activeMenu: 'roleManagement'
            },
          },
          {
            path: "/roleManagement/editRole/:id",
            name: "editRole",
            component:() => import('@/views/systemSettings/roleManagement/editRole'),
            meta: {
              title: '编辑角色',
              activeMenu: 'roleManagement'
            },
          },
          {
            path: "/roleManagement/moreRole/:id",
            name: "moreRole",
            component:() => import('@/views/systemSettings/roleManagement/moreRole'),
            meta: {
              title: '查看',
              activeMenu: 'roleManagement'
            },
          }
        ]
      },
      {
        path: "/systemSettings/operateMember",
        name: "operateMember",
        component: () => import('@/views/systemSettings/operateMember/operateMember'),
        meta: { title: '操作成员管理' }
      },
      {
        path: "/systemSettings/operateMember",
        name: "operateMember",
        component: () => import('@/views/systemSettings/operateMember/index'),
        meta: { title: '操作成员管理' },
        children: [
          {
            path: "/operateMember/addOperator",
            name: "addOperator",
            component: () => import('@/views/systemSettings/operateMember/addOperator'),
            meta: {
              title: '添加或注册',
              activeMenu: 'operateMember'
            }
          },
          {
            path: "/operateMember/editOperator/:id",
            name: "editOperator",
            component: () => import('@/views/systemSettings/operateMember/editOperator'),
            meta: {
              title: '编辑',
              activeMenu: 'operateMember'
            }
          },
          {
            path: "/operateMember/moreOperator/:id",
            name: "moreOperator",
            component:() => import('@/views/systemSettings/operateMember/moreOperator'),
            meta: {
              title: '查看',
              activeMenu: 'operateMember'
            }
          }
        ]
      },
      {
        path: "/systemSettings/districtMember",
        name: "districtMember",
        component: () => import('@/views/systemSettings/districtMember/districtMember'),
        meta: { title: '操作成员管理' }
      },
      {
        path: "/systemSettings/districtMember",
        name: "districtMember",
        component: () => import('@/views/systemSettings/districtMember/index'),
        meta: { title: '区划管理员设置' },
        children: [
          {
            path: "/districtMember/addDistrictor",
            name: "addDistrictor",
            component: () => import('@/views/systemSettings/districtMember/addDistrictor'),
            meta: {
              title: '添加或注册',
              activeMenu: 'districtMember'
            }
          },
          {
            path: "/districtMember/editDistrictor",
            name: "editDistrictor",
            component: () => import('@/views/systemSettings/districtMember/editDistrictor'),
            meta: {
              title: '编辑',
              activeMenu: 'districtMember'
            }
          }
        ]
      },
      {
        path: "/systemSettings/categorySetting",
        name: "categorySetting",
        component: () => import('@/views/systemSettings/categorySetting/categorySetting'),
        meta: { title: '类别设置' }
      },
      {
        path: "/systemSettings/publicitySet",
        name: "publicitySet",
        component: () => import('@/views/systemSettings/publicitySet/publicitySet'),
        meta: { title: '系统设置' }
      },
      {
        path: "/systemSettings/honorSetting",
        name: "honorSetting",
        component: () => import('@/views/systemSettings/honorSetting/honorSetting'),
        meta: { title: '荣誉表彰设置' }
      },
      {
        path: "/systemSettings/honorSetting",
        name: "honorSetting",
        component: () => import('@/views/systemSettings/honorSetting/index'),
        meta: { title: '荣誉表彰设置' },
        children: [
          {
            path: "/honorSetting/addHonor",
            name: "addHonor",
            component: () => import('@/views/systemSettings/honorSetting/addHonor'),
            meta: {
              title: '添加',
              activeMenu: 'honorSetting'
            }
          },
          {
            path: "/districtMember/editHonor/:id",
            name: "editHonor",
            component: () => import('@/views/systemSettings/honorSetting/editHonor'),
            meta: {
              title: '编辑',
              activeMenu: 'honorSetting'
            }
          }
        ]
      },
      {
        path: "/systemSettings/dynamicSet",
        name: "dynamicSet",
        component: () => import('@/views/systemSettings/dynamicSet/dynamicSet'),
        meta: { title: '圈子管理' }
      },
    ]
  },
  // 统一身份认证
  //组管理
  {
    path: '/index1',
    component: index,
    name: 'index1',
    redirect: { name: 'groupManage' },
    children: [
      {
        path: "/groupManage",
        name: "groupManage",
        component: groupManage,
        meta: { title: '村级分组管理', }
      },]
  },
  //家庭管理
  {
    path: '/index1',
    redirect: { name: 'familyList' },
    // meta: { title: '家庭管理' },
    component: index,
    name: 'index1',
    children: [
      {
        path: "/familyManage/familyList",
        name: "familyList",
        component: familyList,
        meta: { title: '家庭管理' },
      },

      {
        path: "/familyManage/familyList",
        name: "familyList",
        component: familyIndex,
        meta: { title: '家庭管理' },
        children: [

          {
            path: "/familyManage/familyView",
            name: "familyView",
            component: familyView,
            meta: {
              title: '查看',
              activeMenu: 'familyList'
            },
          },
          {
            path: "/familyManage/familyView",
            name: "familyView",
            component: familyViewIndex,
            meta: {
              title: '查看',
              activeMenu: 'familyList'
            },
            children: [
              {
                path: "/familyManage/addMember",
                name: "addMember",
                component: addMember,
                meta: {
                  title: '添加家庭成员',
                  activeMenu: 'familyList'
                },
              },
              {
                path: "/familyManage/editMember",
                name: "editMember",
                component: editMember,
                meta: {
                  title: '编辑家庭成员',
                  activeMenu: 'familyList'
                },
              },
              {
                path: "/familyManage/userView",
                name: "userView",
                component: userView,
                meta: {
                  title: '查看用户',
                  activeMenu: 'familyList'
                },
              },
            ]
          },

        ]
      },
    ]
  },
  //村民档案
  {
    path: '/index1',
    redirect: { name: 'villagersRecordList' },
    // meta: { title: '家庭管理' },
    component: index,
    name: 'index1',
    children: [
      {
        path: "/villagersRecord/villagersRecordList",
        name: "villagersRecordList",
        component: villagersRecordList,
        meta: { title: '村民档案' },
      },

      {
        path: "/villagersRecord/villagersRecordList",
        name: "villagersRecordList",
        component: villagerIndex,
        meta: { title: '村民档案' },
        children: [
          {
            path: "/villagersRecord/addVillager",
            name: "addVillager",
            component: addVillager,
            meta: {
              title: '添加村民',
              activeMenu: 'villagersRecordList'
            },
          },
          {
            path: "/villagersRecord/villagersRecordView",
            name: "villagersRecordView",
            component: villagersRecordView,
            meta: {
              title: '查看',
              activeMenu: 'villagersRecordList'
            },
          },
        ]
      },
    ]
  },

];

const router = new VueRouter({
  routes
});
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router;
