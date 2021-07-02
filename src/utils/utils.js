/*
     * @param: fileName - 文件名称
     * @param: 数据返回 1) 无后缀匹配 - false
     * @param: 数据返回 2) 匹配图片 - image
     * @param: 数据返回 3) 匹配 txt - txt
     * @param: 数据返回 4) 匹配 excel - excel
     * @param: 数据返回 5) 匹配 word - word
     * @param: 数据返回 6) 匹配 pdf - pdf
     * @param: 数据返回 7) 匹配 ppt - ppt
     * @param: 数据返回 8) 匹配 视频 - video
     * @param: 数据返回 9) 匹配 音频 - radio
     * @param: 数据返回 10) 其他匹配项 - other
     */
function checkFileType(fileName) {
    // 后缀获取
    var suffix = '';
    // 获取类型结果
    var result = '';
    try {
        var fileArr = fileName.split('.');
        suffix = fileArr[fileArr.length - 1];
    } catch (err) {
        suffix = '';
    }
    // fileName无后缀返回 false
    if (!suffix) {
        result = false;
        return result;
    }
    // 图片格式
    var imgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
    // 进行图片匹配
    result = imgList.some(function (item) {
        return item == suffix;
    });
    if (result) {
        result = 'image';
        return result;
    }

    // 匹配txt
    var txtList = ['txt'];
    result = txtList.some(function (item) {
        return item == suffix;
    });
    if (result) {
        result = 'txt';
        return result;
    }

    // 匹配 excel
    var excelList = ['xls', 'xlsx'];
    result = excelList.some(function (item) {
        return item == suffix;
    });
    if (result) {
        result = 'excel';
        return result;
    }

    // 匹配 word
    var wordList = ['doc', 'docx'];
    result = wordList.some(function (item) {
        return item == suffix;
    });
    if (result) {
        result = 'word';
        return result;
    }

    // 匹配 pdf
    var pdfList = ['pdf'];
    result = pdfList.some(function (item) {
        return item == suffix;
    });
    if (result) {
        result = 'pdf';
        return result;
    }

    // 匹配 ppt
    var pptList = ['ppt'];
    result = pptList.some(function (item) {
        return item == suffix;
    });
    if (result) {
        result = 'ppt';
        return result;
    }

    // 匹配 视频
    var videoList = ['mp4', 'm2v', 'mkv'];
    result = videoList.some(function (item) {
        return item == suffix;
    });
    if (result) {
        result = 'video';
        return result;
    }

    // 匹配 音频
    var radioList = ['mp3', 'wav', 'wmv'];
    result = radioList.some(function (item) {
        return item == suffix;
    });
    if (result) {
        result = 'radio';
        return result;
    }

    // 其他 文件类型
    result = 'other';
    return result;
}

export {
    checkFileType
}
