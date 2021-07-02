// 可参考 https://www.cnblogs.com/lieone/p/11856330.html
// 验证邮箱
export const validateEmail = (rule, value, callback) => {
    const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (regEmail.test(value)) {
        // 合法的邮箱
        callback();
    }
    callback(new Error("请输入合法的邮箱"))
};

// 验证手机号
export const validatePhone = (rule, value, callback) => {
    const reg = /^1[3456789]\d{9}$/;
    //const reg = /^1[3-9]\d{9}$/;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的手机号码'));
        } else {
            callback();
        }
    }
};

// 验证手机号  登录页专用
export const validatePhoneForLogin = (rule, value, callback) => {
    const reg = /^1[3456789]\d{9}$/;
    //const reg = /^1[3-9]\d{9}$/;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('手机号码不正确'));
        } else {
            callback();
        }
    }
};

// 验证年限
export const validateTransferYear = (rule, value, callback) => {
    if (!value) {
        callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入有效的流转年限（正整数）'));
        } else {
            const re = /^[0-9]*[1-9][0-9]*$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
                callback(new Error('请输入有效的流转年限（正整数）'));
            } else {
                callback();
            }
        }
    }, 0);
};

// 保留2位小数
export const validateTwoNumber = (rule, value, callback) => {
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!value) {
        return callback(new Error('请填写数字'))
    } else if (!reg.test(value)) {
        return callback(new Error('请填写数字,最多2位小数'))
    } else {
        callback()
    }
};

// 两位小数验证
export const validateValidity = (rule, value, callback) => {
    if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
        callback(new Error('最多两位小数！！！'));
    } else {
        callback();
    }
};

// 验证是否整数,非必填
export const isIntegerNotMust = (rule, value, callback) => {
    if (!value) {
        callback();
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入正整数'));
        } else {
            const re = /^[0-9]*[1-9][0-9]*$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
                callback(new Error('请输入正整数'));
            } else {
                callback();
            }
        }
    }, 1000);
};

// 验证是否整数
export const isIntegerNum = (rule, value, callback) => {
    const reg = /^[0-9]*[1-9][0-9]*$/;
    const rsCheck = reg.test(value);
    if (!rsCheck) {
        callback(new Error('请输入正整数'));
    } else {
        callback();
    }
};

// 是否合法IP地址
export const validateIP = (rule, value, callback) => {
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的IP地址'));
        } else {
            callback();
        }
    }
};

// 是否手机号码或者固话
export const validatePhoneTwo = (rule, value, callback) => {
    const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的电话号码或者固话号码'));
        } else {
            callback();
        }
    }
};

// 是否固话
export const validateTelPhone = (rule, value, callback) => {
    const reg = /0\d{2,3}-\d{7,8}/;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的固定电话'));
        } else {
            callback();
        }
    }
};

// 是否身份证号码
export const validateIdCardNo = (rule, value, callback) => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的身份证号码'));
        } else {
            callback();
        }
    }
};

// 二代身份证号码校验
export const validateIdCardNoSecond = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('身份证不能为空'))
    }
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        callback(new Error('请输入正确的二代身份证号码'))
    } else {
        callback()
    }
};

// 账号校验
export const validateAccountName = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请输入账号'))
    }
    if (!/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]{6,20}$/.test(value)) {
        callback(new Error('账号必须为6-20位字母和数字组合'))
    } else {
        callback()
    }
};

// 密码校验
export const validateAccountPwdReg = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请输入密码'))
    }
    if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(value)) {
        callback(new Error('请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'))
    } else {
        callback()
    }
};

// 中文校验
export const validateContacts = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请输入中文'))
    }
    if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
        callback(new Error('不可输入特殊字符'))
    } else {
        callback()
    }
};

// 验证上传的图片数量 (el-upload 文件数量验证)
export const validateUploadFileNum = (rule, value, callback) => {
    const fileNum = parseFloat(value) || 0;
    if (!value || fileNum === 0) {
        callback(new Error('请上传附件'));
    } else if (fileNum > 0) {
        callback();
    } else {
        callback(new Error('请上传附件'));
    }
};
/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
    return JSON.parse(localStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
  }