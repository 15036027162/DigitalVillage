/**
 * 生成签名并组成新和请求参数
 */
import {mAppId, mAppKey, mChannel, mPlatform, mVersion} from "./env";
import {getStore} from "./mUtils";


function sign(data, token_id) {
    const md5 = require('js-md5');

    const wWidth = getStore('windowWidth') || '***';// 屏宽
    const wHeight = getStore('windowHeight') || '***';// 屏高

    var str = '';
    var m_sign = '';

    // 相关参数
    var m_nonce = createNonceStr(8);
    var m_timestamp = createTimeStamp();
    var m_version = mVersion;
    var m_screen = wWidth + "x" + wHeight;
    var m_channel = mChannel;
    var m_device_id = 'device-' + getBrowserModel();//设备ID
    var m_model = 'model-' + getBrowserModel();// 设备型号
    var m_platform = data.m_platform ? data.m_platform : mPlatform;
    var m_token_id = data.m_token_id ? data.m_token_id : token_id;
    var m_app_name = 'shaoshan';

    // 基参数组
    let baseData = {
        'm_app_id': mAppId,
        'm_app_key': mAppKey,
        'm_device_id': m_device_id,
        'm_nonce': m_nonce,
        'm_timestamp': m_timestamp,
        'm_token_id': m_token_id,
        'm_version': m_version,
        //'NO_SIGN':'N'
    };
    /*if(signature){
        baseData = {
            'm_app_id': mAppId,
            'm_app_key': mAppKey,
            'm_device_id': m_device_id,
            'm_nonce': nonce,
            'm_timestamp': timestamp,
            'm_token_id': m_token_id,
            'm_version': m_version,
            'NO_SIGN':'N'
        };
    }else{
        baseData = {
            'm_app_id': mAppId,
            'm_app_key': mAppKey,
            'm_device_id': m_device_id,
            'm_nonce': m_nonce,
            'm_timestamp': m_timestamp,
            'm_token_id': m_token_id,
            'm_version': m_version,
            'NO_SIGN':'N'
        };
    }*/
    // 合并基础参数和业务参数

    baseData = extendObj(baseData, data);
    var allData = objKeySort(baseData);
    for (var p in allData) {
        str += p + '_' + allData[p] + '&';
    }

    //去掉最后一位
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    m_sign = md5(str);
    //m_sign = md5(str).toLowerCase();

    // 删除APPKEY
    delete baseData.m_app_key;

    // 加签名参数
    baseData = extendObj(baseData, {
        'm_signature':m_sign,
        'm_os_version': m_version,
        'm_screen': m_screen,
        'm_channel': m_channel,
        'm_model': m_model,
        'm_platform': m_platform,
        'm_app_name':m_app_name,
        'm_latitude':'',
        'm_longitude':'',
        'm_format':'',
    });
    return baseData;
}

/**
 * 数组排序
 * @param {*} arys
 */
function objKeySort(arys) {
    var newkey = Object.keys(arys).sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = arys[newkey[i]];
    }
    return newObj;
}

/**
 * 合并对象
 * @param {*} data
 * @param {*} dataExtend
 */
function extendObj(data, dataExtend) {
    var res={};
    for (var key in data) {
        res[key] = data[key];
    }
    for (var key in dataExtend) {
        res[key] = dataExtend[key];
    }
    return res;
}

/* 随机函数的产生 */
function createNonceStr(n) {
    const charts = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = '';
    for(var i = 0; i <n; i++){
        var id = Math.ceil(Math.random()*35);
        res += charts[id];
    }
    return res;
}

/* 时间戳产生的函数 */
function createTimeStamp() {
    //const moment = require('moment');
    //return  moment(Date.now()).format('YYYYMMDDHHmmss');
    const moment = new Date().getTime();
    return  moment.toString();
}

/* 获取设备型号*/
function getBrowserModel() {
    return 'PC-Browser';
}

export {
    sign
}