import fetch from '@/config/fetch'
import {post,get} from '../config/axios'

/**
 * ================================================================================================
 * wyl 接口相关      20200904
 * ================================================================================================
 */
export const getsignature = data => fetch('authentication/authentication/signature', data,'GET');// 签名
export const exGoodst = data => fetch('integratemall/v2/w/exGoods/exGoods', data,'GET');// 积分商城-物品列表
export const updateExGoodsStatus = data => fetch('integratemall/v2/w/exGoods/updateExGoodsStatus', data,'POST');// 积分商城-显示隐藏
export const saveExGoods = data => fetch('integratemall/v2/w/exGoods/saveExGoods', data,'POST');// 积分商城-保存商品信息
export const exGoodsInfo = data => fetch('integratemall/v2/w/exGoods/exGoodsInfo', data,'GET');// 积分商城-详情
export const policyList = data => fetch('integratemall/v1/w/policy/policyList', data,'GET');// 信息发布-政策列表
export const policyDetail = data => fetch('integratemall/v1/w/policy/policyDetail', data,'GET');// 信息发布-政策详情
export const policySave = data => fetch('integratemall/v1/w/policy/policySave', data,'POST');// 信息发布-信息发布/编辑
export const policyUpdateState = data => fetch('integratemall/v1/w/policy/updateState', data,'POST');// 信息发布-信息发布审核和删除
export const policyCheckList = data => fetch('integratemall/v1/w/policy/policyCheckList', data,'GET');// 信息发布-政策审核列表
export const getadvList = data => fetch('integratemall/v1/w/adv/advList', data,'GET');// 信息发布-广告列表
export const advPublish = data => fetch('integratemall/v1/w/adv/advPublish', data,'POST');// 信息发布-广告发布/编辑
export const advDetail = data => fetch('integratemall/v1/w/adv/advDetail', data,'GET');// 信息发布-广告详情
export const advUpdateState = data => fetch('integratemall/v1/w/adv/updateState', data,'POST');// 信息发布-广告状态变更和删除
export const advCheckList = data => fetch('integratemall/v1/w/adv/advCheckList', data,'GET');// 信息发布-广告审核列表
export const getMemberList = data => fetch('member/v1/w/memberDoor/getMemberList', data,'GET');// 村民档案-村民档案列表
export const autoGenerateUser = data => fetch('member/v1/w/memberDoor/autoGenerateUser', data,'GET');// 获取用户名
export const getMemberListByDoorNum = data => fetch('member/v1/w/memberDoor/getMemberListByDoorNum', data,'GET');// 家庭管理-家庭成员列表
export const saveMember = data => fetch('member/v1/w/memberDoor/save', data,'POST');// 添加村民/家庭成员
export const updateMember = data => fetch('member/v1/w/memberDoor/update', data,'POST');// 编辑村民/家庭成员
export const removeDoor = data => fetch('member/v1/w/memberDoor/removeDoor', data,'POST');// 家庭管理-移出家庭
export const delMember = data => fetch('member/v1/w/memberDoor/delMember', data,'POST');// 家庭管理-注销
export const memberDetails = data => fetch('member/v1/w/memberDoor/getById', data,'GET');// 家庭管理-成员详情
export const familyList = data => fetch('member/v1/w/door/list', data,'GET');// 家庭管理-家庭户列表
export const addFamily = data => fetch('member/v1/w/door/save', data,'POST');// 家庭管理-添加家庭户
export const updateFamily = data => fetch('member/v1/w/door/update', data,'POST');// 家庭管理-编辑家庭户
export const deleteFamily = data => fetch('member/v1/w/door/delete', data,'POST');// 家庭管理-删除家庭户
export const getHouseNumberByGroupCode = data => fetch('member/v1/w/memberDoor/getHouseNumberByGroupCode', data,'GET');// 村民档案管理-获取门牌号
export const groupByVillage = data => fetch('commonality/v1/division/groupByVillage', data,'GET');// 村社区获取组信息
export const honorIntegralList = data => fetch('integratemall/v1/w/integral/honorIntegralList', data,'GET');// 荣誉值管理-荣誉值积分列表
export const getHonorIntegerDetail = data => fetch('integratemall/v1/w/integral/getHonorIntegerDetail', data,'GET');// 荣誉值管理-荣誉值积分详情
export const updateDoorHonor = data => fetch('integratemall/v2/w/integral/updateDoorHonor', data,'POST');// 荣誉值管理-修改荣誉值积分
export const auditHonorIntegralList = data => fetch('integratemall/v2/w/integral/auditHonorIntegralList', data,'GET');// 荣誉值管理-荣誉值审核列表
export const updateHonorIntegralState = data => fetch('integratemall/v2/w/integral/updateHonorIntegralState', data,'POST');// 荣誉值管理-荣誉值审核列表
export const honorPublicList = data => fetch('integratemall/v2/w/integral/honorPublicList', data,'GET');// 荣誉值管理-荣誉值公示列表
export const getDetailByPublic = data => fetch('integratemall/v2/w/integral/getDetailByPublic', data,'GET');// 荣誉值管理-荣誉值公示详情
export const correctHonorIntegralPoint = data => fetch('integratemall/v2/w/integral/correctHonorIntegralPoint', data,'POST');// 荣誉值管理-荣誉值公示修正
export const getHonorIntegerByIssue = data => fetch('integratemall/v2/w/integral/getHonorIntegerByIssue', data,'GET');// 荣誉值管理-荣誉值发放详情查看
export const generateQRCodeByScene = data => fetch('member/v1/qr/generateQRCodeByScene', data, 'POST');// 户二维码
export const personalList = data => fetch('integratemall/v2/w/personal/list', data,'GET');// 荣誉值管理-村民加分审核列表
export const personalDetails = data => fetch('integratemall/v2/w/personal/getById', data,'GET');// 荣誉值管理-村民加分审核详情
export const getPersonalSceneByScene = data => fetch('integratemall/v2/w/personal/getPersonalSceneByScene', data,'GET');// 荣誉值管理-村民加分审核 事件下拉列表
export const updatePersonalHonorState = data => fetch('integratemall/v2/w/personal/updatePersonalHonorState', data,'post');// 荣誉值管理-村民加分审核操作
export const doorHonorList = data => fetch('integratemall/v2/w/integral/doorHonorList', data,'GET');// 荣誉值管理-家庭荣誉值列表
// export const getSelectDictionary = data => fetch('integratemall/v1/w/businessDept/getSelectDictionary', data,'GET');// 获取类别设置选项
export const innerSelectList = data => fetch('integratemall/v1/w/adv/innerSelectList', data,'GET');// 获取商业发布内部链接选项内
export const getDoorHonorDetail = data => fetch('integratemall/v2/w/integral/getDoorHonorDetail', data,'GET');// 家庭荣誉值详情
export const doorHonorStaticsList = data => fetch('integratemall/v2/w/integral/doorHonorStaticsList', data,'GET');// 家庭荣誉值统计
export const exportPublic = data => fetch('integratemall/v2/w/integral/exportPublic', data,'GET');// 家庭荣誉值统计
export const header = data => fetch('integratemall/v2/w/home/header', data,'GET');// 首页
export const memberList = data => fetch('member/v2/w/member/list', data,'GET');// 用户管理-列表
export const memberGetById = data => fetch('member/v2/w/member/getById', data,'GET');// 用户管理-详情
export const editMember = data => fetch('member/v2/w/member/editMember', data,'post');// 用户管理-启用禁用
export const batchSave = data => fetch('member/v1/w/door/batchSave', data,'post');// 家庭户-批量添加
export const downCode = data => fetch('member/v2/w/member/downCode', data,'post');// 家庭户-下载二维码
export const batchDownCode = data => fetch('member/v2/w/member//batchDownCode', data,'post');// 家庭户-批量下载二维码
export const getMenu = data => fetch('integratemall/v1/w/businessDept/getOneMenu', data,'GET');// 菜单
export const getCreditList = data => fetch('integratemall/v1/w/credit/getCreditList', data,'post');// 基础设置-获取授信列表
export const getFinanceList = data => fetch('integratemall/v1/w/finance/getFinanceList', data,'post');// 内容管理-普惠金融列表
export const getFinanceDetail = data => fetch('integratemall/v1/w/finance/detail', data,'get');// 内容管理-普惠金融详情
export const getFinanceInsert = data => fetch('integratemall/v1/w/finance/insert', data,'post');// 内容管理-普惠金融新增
export const getFinanceUpdate = data => fetch('integratemall/v1/w/finance/update', data,'post');// 内容管理-普惠金融更新
export const getFinanceupdateStatus = data => fetch('integratemall/v1/w/finance/updateStatus', data,'post');// 内容管理-普惠金融上下架
export const getFinanceDelete = data => fetch('integratemall/v1/w/finance/delete', data,'get');// 内容管理-普惠金融删除

/**
 * ================================================================================================
 * xj  接口相关      20200904
 * ================================================================================================
 */
export const memberLogin = data => fetch('member/v2/login/memberLoginWeb', data,'POST');// 登录
export const memberLoginOut = data => fetch('member/v1/login/memberLoginOut', data,'POST');// 退出
export const sendShortMessageCode = data => fetch('member/v1/login/sendShortMessageCode', data,'POST');// 获取短信验证码
export const retrievePassword = data => fetch('member/v1/login/retrievePassword', data,'POST');// 登录-找回密码
export const retrievePasswordNew = data => fetch('member/v2/login/retrievePassword', data,'POST');// 登录-找回密码
export const loginCheckCode = data => fetch('member/v2/login/checkCode', data,'POST');// 登录-校验验证码
export const getWebMemberBaseInfo = data => fetch('member/v1/login/getWebMemberBaseInfo', data,'GET');// 个人中心
export const changeMemberPassword = data => fetch('member/v1/login/changeMemberPassword', data,'POST');// 个人中心-修改密码
export const changeMemberPhone = data => fetch('member/v1/login/changeMemberAppPhone', data,'POST');// 个人中心-修改手机号码

export const getStreetByArea = data => fetch('commonality/v1/division/streetByArea', data, 'GET');// 根据县code 获取 镇列表数据
export const getVillageByStreet = data => fetch('commonality/v1/division/villageByStreet', data, 'GET');// 根据镇code 获取 村列表数据
export const getMemberByMobile = data => fetch('member/v1/member/getMemberByMobile', data, 'GET');// 手机号获取成员信息

export const businessDeptList = data => fetch('integratemall/v1/w/businessDept/list', data, 'GET');// 组织部门-列表
export const businessDeptSave = data => fetch('integratemall/v1/w/businessDept/save', data, 'POST');// 组织部门-新增组织/子级
export const businessDeptUpdate = data => fetch('integratemall/v1/w/businessDept/update', data, 'POST');// 组织部门-编辑
export const businessDeptDelete = data => fetch('integratemall/v1/w/businessDept/delete', data, 'POST');// 组织部门-删除
export const relationshipList = data => fetch('integratemall/v1/w/relationship/list', data, 'GET');// 成员管理列表
export const relationshipSave = data => fetch('integratemall/v1/w/relationship/save', data, 'POST');// 成员管理列表-添加
export const getDeptsByDistricts = data => fetch('integratemall/v1/w/businessDept/getDeptsByDistricts', data, 'GET');// 成员管理列表-获取部门
export const relationshipUpdate = data => fetch('integratemall/v1/w/relationship/update', data, 'POST');// 成员管理列表-修改
export const relationshipDel = data => fetch('integratemall/v1/w/relationship/delete', data, 'POST');// 成员管理列表-删除
export const relationshipDisabled = data => fetch('integratemall/v1/w/relationship/disabled', data, 'POST');// 成员管理列表-禁用
export const getByIdMember = data => fetch('integratemall/v1/w/relationship/getById', data, 'GET');// 成员管理列表-获取成员信息
export const distributionSetList = data => fetch('integratemall/v2/w/distributionSet/list', data, 'GET');// 荣誉值发放-列表
export const distributionSetAdd = data => fetch('integratemall/v2/w/distributionSet/add', data, 'POST');// 荣誉值发放-新增
export const distributionSetUpdate = data => fetch('integratemall/v2/w/distributionSet/update', data, 'POST');// 荣誉值发放-更新
export const distributionSetDelete = data => fetch('integratemall/v2/w/distributionSet/delete', data, 'POST');// 荣誉值发放-删除
export const getDistributionMember= data => fetch('integratemall/v2/w/distributionSet/getById', data, 'GET');// 荣誉值发放-详情
export const getMemberByDepts = data => fetch('integratemall/v1/w/businessDept/getMemberByDepts', data, 'GET');// 荣誉值发放-获取成员
export const rankList = data => fetch('integratemall/v2/w/rank/list', data, 'GET');// 红黑榜-列表
export const rankListAdd = data => fetch('integratemall/v2/w/rank/save', data, 'POST');// 红黑榜-新增
export const getMemberByVillageCode = data => fetch('member/v1/member/getMemberByVillageCode', data, 'GET');// 红黑榜-根据姓名获取人员
export const getDoorMemberByVillageCode = data => fetch('member/v1/member/getDoorMemberByVillageCode', data, 'GET');// 荣誉表彰-根据姓名获取人员
export const rankListById = data => fetch('integratemall/v2/w/rank/getById', data, 'GET');// 红黑榜-详情
export const rankListUpdateState = data => fetch('integratemall/v2/w/rank/updateState', data, 'POST');// 红黑榜-结束撤榜
export const commendationList = data => fetch('integratemall/v2/w/honorCommendation/commendationList', data, 'GET');// 荣誉表彰-列表
export const commendationPublish = data => fetch('integratemall/v2/w/honorCommendation/commendationPublish', data, 'POST');// 荣誉表彰-发布
export const commendationDetails = data => fetch('integratemall/v2/w/honorCommendation/commendationDetails', data, 'GET');// 荣誉表彰-详情
export const updateCommendationFinish = data => fetch('integratemall/v2/w/honorCommendation/updateCommendationStatus', data, 'POST');// 荣誉表彰-状态更新
export const honorstatementList = data => fetch('integratemall/v1/w/honorstatement/list', data, 'GET');// 荣誉值规则
export const getByVillageCode = data => fetch('integratemall/v1/w/honorstatement/getByVillageCode', data, 'GET');// 荣誉值规则-获取详情
export const saveAndUpdate = data => fetch('integratemall/v1/w/honorstatement/saveAndUpdate', data, 'POST');// 荣誉值规则-发布/编辑
export const honorstatementDetail = data => fetch('integratemall/v1/w/honorstatement/detail', data, 'GET');// 荣誉值规则-详情
export const getSelectDictionary = data => fetch('integratemall/v1/w/businessDept/getSelectDictionary', data, 'GET');// 获取类别设置选项
export const getDictionaryByType = data => fetch('integratemall/v1/w/businessDept/getDictionaryByType', data, 'GET');// 类别设置-列表
export const saveDictionary = data => fetch('integratemall/v1/w/businessDept/saveDictionary', data, 'POST');// 类别设置-新增/编辑
export const delDictionary = data => fetch('integratemall/v1/w/businessDept/delDictionary', data, 'POST');// 类别设置-删除
export const listDistrict = data => fetch('integratemall/v1/w/relationship/listDistrict', data, 'GET');// 区划管理员-列表
export const saveDistricts = data => fetch('integratemall/v1/w/relationship/saveDistricts', data, 'POST');// 区划管理员-添加
export const getRoleByDistricts = data => fetch('integratemall/v1/w/businessDept/getRoleByDistricts', data, 'GET');// 角色管理-列表
export const getAllRole = data => fetch('integratemall/v1/w/businessDept/getAllRole', data, 'GET');// 角色管理-获取所有菜单权限
export const roleSave = data => fetch('integratemall/v1/w/businessDept/roleSave', data, 'POST');// 角色管理-新增/编辑
export const roleDetail = data => fetch('integratemall/v1/w/businessDept/roleDetail', data, 'GET');// 角色管理-详情
export const getSelectRoleByDistricts = data => fetch('integratemall/v1/w/businessDept/getSelectRoleByDistricts', data, 'GET');// 获取添加成员的角色选项
export const authenticationList = data => fetch('member/v2/w/authentication/list', data, 'GET');// 实名审核-列表
export const getInfoByMemberId = data => fetch('member/v2/w/authentication/getInfoByMemberId', data, 'GET');// 实名审核-查看
export const updateStatus = data => fetch('member/v2/w/authentication/updateStatus', data, 'POST');// 实名审核-审核
export const getpublicityDetail = data => fetch('integratemall/v2/honorSysSet/getDetail', data, 'GET');// 实名审核-审核
export const editpublicityDetail = data => fetch('integratemall/v2/honorSysSet/edit', data, 'POST');// 实名审核-审核
export const commendationSetList = data => fetch('integratemall/v2/w/commendationSet/list', data, 'GET');// 表彰设置-列表
export const commendationGetById = data => fetch('integratemall/v2/w/commendationSet/getById', data, 'GET');// 表彰设置-详情
export const commendationSetAdd = data => fetch('integratemall/v2/w/commendationSet/add', data, 'POST');// 表彰设置-新增
export const commendationSetEdit = data => fetch('integratemall/v2/w/commendationSet/edit', data, 'POST');// 表彰设置-编辑
export const commendationSetDelete = data => fetch('integratemall/v2/w/commendationSet/delete', data, 'POST');// 表彰设置-删除
export const getCommendation = data => fetch('integratemall/v2/w/commendationSet/getCommendation', data, 'GET');// 荣誉表彰-下拉框
export const dynamicList = data => fetch('integratemall/v2/w/dynamic/list', data, 'GET');// 圈子动态列表
export const dynamicAudit = data => fetch('integratemall/v2/w/dynamic/audit', data, 'POST');// 圈子动态-审核



export const commonalityGroup = data => fetch('commonality/v1/group/groupList', data, 'GET');// 组管理-列表
export const commonalityGroupSave = data => fetch('commonality/v1/group/save', data, 'POST');// 组管理-新增
export const commonalityGroupId = data => fetch('commonality/v1/group/getById', data, 'GET');// 组管理-详情
export const commonalityGroupUpdate = data => fetch('commonality/v1/group/update', data, 'POST');// 组管理-编辑
export const commonalityGroupDelete = data => fetch('commonality/v1/group/delete', data, 'POST');// 组管理-删除

