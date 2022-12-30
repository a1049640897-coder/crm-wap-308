import lrz from 'lrz'
import store from '@/store'

export function setAccessToken(AccessToken) {
  return new Promise(resolve => {
    window.localStorage.setItem("accessToken", AccessToken);
    resolve();
  });
}

export function removeAccessToken() {
  return new Promise(resolve => {
    window.localStorage.removeItem("userInfo");
    // 这个点我修改过记得删除
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("currentSystem");
    resolve();
  });
}

export function setLocalStorage(name, value) {
  return new Promise(resolve => {
    window.localStorage.setItem(name, value);
    resolve();
  });
}

export function getLocalStorage(value) {
  return new Promise(resolve => {
    resolve(window.localStorage.getItem(value));
  });
}

export function getScrollTop() {
  // 获取滚动高度
  return new Promise(resolve => {
    let scrollTop = 0;
    let bodyScrollTop = 0;
    let documentScrollTop = 0;
    if (document.body) {
      bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop =
      bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
    resolve(scrollTop);
  });
}

export function debounceFun(func, wait = 500, immediate = true) {
  let timer = null
  return function (...args) {
    const ctx = this
    if (timer) clearTimeout(timer)
    if (immediate) {
      const isTimer = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait)
      if (isTimer) func.apply(ctx, args)
    } else {
      timer = setTimeout(() => {
        func.apply(ctx, args)
      }, wait)
    }
  }
}
export function throttle(func, wait = 1000, ctx) { // 节流
  let timer = null
  let startTime
  return function (...args) {
    const now = +new Date()
    if (startTime && now < startTime + wait) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        startTime = now
        func.apply(ctx, args)
      }, wait)
    } else {
      startTime = now
      func.apply(ctx, args)
    }
  }
}

// 院校库数据编辑处理函数
export function commonSchoolInfohandle(data, dataName) {
  // dataName = schoolListNot 为不需要拼接属性
  let obj = data || {}
  if (!data) {
    if (['schoolList', 'schoolListNot', 'facultyIdAndMajorList'].includes(dataName)) {
      return []
    } else {
      return {}
    }
  }
  if (dataName === 'education') return obj.entity || {}
  else if (dataName === 'school') return obj.extend[2] || {}
  else if (dataName === 'faculty') return obj.extend[3] || {}
  else if (dataName === 'major') return obj.extend[4] || {}
  else if (dataName === 'facultyIdAndMajor') {
    if (data.extend[4]) return data.extend[4]
    else if (data.extend[3]) return data.extend[3]
    else if (data.extend[2]) return {
      text: '未知',
      value: -1
    }
    return obj
  } else if (dataName === 'schoolList') {
    if (obj.extend[2]) return [{
      text: data.extend[2].text,
      value: data.extend[2].value
    }]
    else return []
  } else if (dataName === 'activitySchoolListNot') {
    if (obj.extend[2]) return [{
      text: data.extend[2].text,
      value: data.extend[2].value
    }]
    else return []
  } else if (dataName === 'schoolListNot') {
    if (obj.extend[2]) return [{
      text: data.extend[2].text.replace(/\(.*?\)/g, ''),
      value: data.extend[2].value
    }]
    else return []
  } else if (dataName === 'facultyIdAndMajorList') {
    if (obj.extend[4]) return [{
      text: data.extend[3].text + '/' + data.extend[4].text,
      value: data.extend[4].value
    }]
    else if (obj.extend[3]) return [{
      text: data.extend[3].text,
      value: data.extend[3].value
    }]
    else if (obj.extend[2]) return [{
      text: '未知',
      value: -1
    }]
    else return []
  }
}


export function SplicingDatahandel(data, dataName = 'schoolName') {
  if (!data) return null
  let splicingData = ''
  let obj = {}
  let arrData = Object.keys(data)
  for (let index = 0; index < arrData.length; index++) {
    const element = arrData[index]
    if (data[element] !== '-') {
      splicingData += '/' + data[element].text
    }
  }
  return obj[dataName] = arrData.length === 1 ? splicingData.slice(1) + '/未知' : splicingData.slice(1)
}

export function transform(data) {
  return new Promise(async resolve => {
    let fr = new FileReader()
    fr.onload = () => {
      resolve(JSON.parse(fr.result))
    }
    fr.readAsText(data, ['utf-8'])
  })
}


export function dayTextFormatter(day) {
  if (day.type === 'start') {
    day.bottomInfo = '起'
  } else if (day.type === 'end') {
    day.bottomInfo = '止'
  } else if (day.type === 'start-end') {
    day.bottomInfo = '起/止'
  }
  return day
}

export function dataURLtoFile(dataurl, filename) { // 将base64转换为文件
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime
  })
}

export function compressFile(file) { // 上传文件压缩
  return new Promise((resolve, reject) => {
    if (file.size / 1024 / 1024 > 10) {
      this.$fm(`图片[${file.name}] 超过10M，请压缩后上传`)
      return reject(false)
    }
    if (file.size / 1024 / 1024 <= 1) {
      resolve(file)
    } else {
      lrz(file, {
        width: 1000,
        quality: 0.8,
        fieldName: file.name
      }).then((rst) => {
        resolve(dataURLtoFile(rst.base64, file.name)) // 将base64转换为文件
      }).catch(err => {
        this.$fm('上传失败')
        reject(err)
      })
    }
  })
}

function menuDeep(list, code, info) {
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    if (element.attributes && element.attributes.perms === code) {
      info.element = { ...element }
      return element
    } else if (element.children && element.children.length) {
      menuDeep(element.children, code, info)
    }
  }
}

export function menuPermissionUtil(permissionCode) {
  let info = { element: null }
  menuDeep(store.state.common.setting.allMenu, permissionCode, info)
  return !!info.element
}

// 数字精度处理（保留几位小数）
export function _toFixed(num, precision = 2, symbol = '') {
  if (typeof num !== 'number') return
  if (num === 0) return `0${symbol}`
  const dividend = Math.pow(10, precision)
  const result = (Math.round(num * dividend) / dividend).toFixed(precision)
  return `${result}${symbol}`
}

export function getBase64(imgUrl) {
  return new Promise((resolve) => {
    // 一定要设置为let，不然图片不显示
    const image = new Image()
    // 解决跨域问题
    image.setAttribute('crossOrigin', 'anonymous')
    const imageUrl = imgUrl
    image.src = imageUrl
    // image.onload为异步加载
    image.onload = () => {
      var canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      var context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)
      var quality = 0.8
      // 这里的dataurl就是base64类型
      // 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
      const dataurl = canvas.toDataURL('image/jpeg', quality)
      resolve(dataurl)
    }
  })
}

export function deWeightArr(arr, key = 'id') { // 数组对象去重
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i][key] == arr[j][key]) {
        arr.splice(j, 1);
        //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
        j--;
      }
    }
  }
  return arr;
}

// 数字转大写汉字
/* eslint-disable */
export function convertCurrency(money) {
  // 汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖')
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '整';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money === '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}


export function splitMoney(v) {
  if (!v) return false
  const obj = {}
  const val = String(parseInt(v * 100))
  const len = val.length
  obj.f = val[len - 1] ? val[len - 1] : null
  obj.j = val[len - 2] ? val[len - 2] : null
  obj.y = val[len - 3] ? val[len - 3] : null
  obj.s = val[len - 4] ? val[len - 4] : null
  obj.b = val[len - 5] ? val[len - 5] : null
  obj.q = val[len - 6] ? val[len - 6] : null
  obj.w = val[len - 7] ? val[len - 7] : null
  obj.sw = val[len - 8] ? val[len - 8] : null
  return obj
}


export function changeMoneyToChinese(money) { // 转换金额为中文大写
  var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字  
  var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位  
  var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位  
  var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位  
  //var cnInteger = "整"; //整数金额时后面跟的字符  
  var cnIntLast = "元"; //整型完以后的单位  
  var maxNum = 999999999999999.9999; //最大处理的数字  

  var IntegerNum; //金额整数部分  
  var DecimalNum; //金额小数部分  
  var ChineseStr = ""; //输出的中文金额字符串  
  var parts; //分离金额后用的数组，预定义  
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    $.alert('超出最大处理数字');
    return "";
  }
  if (money == 0) {
    //ChineseStr = cnNums[0]+cnIntLast+cnInteger;  
    ChineseStr = cnNums[0] + cnIntLast
    //document.getElementById("show").value=ChineseStr;  
    return ChineseStr;
  }
  money = money.toString(); //转换为字符串  
  if (money.indexOf(".") == -1) {
    IntegerNum = money;
    DecimalNum = '';
  } else {
    parts = money.split(".");
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换  
    let zeroCount = 0;
    let IntLen = IntegerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = IntegerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零  
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
    //整型部分处理完毕  
  }
  if (DecimalNum != '') { //小数部分  
    const decLen = DecimalNum.length;
    for (let i = 0; i < decLen; i++) {
      const n = DecimalNum.substr(i, 1);
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (ChineseStr == '') {
    //ChineseStr += cnNums[0]+cnIntLast+cnInteger;  
    ChineseStr += cnNums[0] + cnIntLast;
  }
  /* else if( DecimalNum == '' ){ 
              ChineseStr += cnInteger; 
              ChineseStr += cnInteger; 
          } */
  return ChineseStr;
}


export function resizeScreen(refs) { // 移动端屏幕横屏
  const _this = this;
  // 利用 CSS3 旋转 对根容器逆时针旋转 90 度
  const detectOrient = function () {
    let width = document.documentElement.clientWidth,
      height = document.documentElement.clientHeight,
      $wrapper = refs, // 这里是页面最外层元素
      style = "";
    if (width >= height) {
      // 横屏
      style += "width:" + width + "px;"; // 注意旋转后的宽高切换
      style += "height:" + height + "px;";
      style += "-webkit-transform: rotate(0); transform: rotate(0);";
      style += "-webkit-transform-origin: 0 0;";
      style += "transform-origin: 0 0;";
    } else {
      // 竖屏
      style += "width:" + height + "px;";
      style += "height:" + width + "px;";
      style +=
        "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
      // 注意旋转中点的处理
      style +=
        "-webkit-transform-origin: " +
        width / 2 +
        "px " +
        width / 2 +
        "px;";
      style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
    }
    $wrapper.style.cssText = style;
  };
  window.onresize = detectOrient;
  detectOrient();
}

