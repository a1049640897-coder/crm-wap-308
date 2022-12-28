import dayjs from 'dayjs'

export function doubleTurnOnetimeFilter(time1, time2) {
  let str = time1 + '-' + dayjs(time2).format('HH:mm:ss')
  return str
}

export function sexFilter(val) {
  let str = '暂无'
  switch (val) {
    case '1':
      str = '男'
      break
    case 1:
      str = '男'
      break
    case '2':
      str = '女'
      break
    case 2:
      str = '女'
      break
    default:
      str = '-'
      break
  }
  return str
}
export function isFreshFilter(val) { // 过滤学生属性
  let num, str
  if (val instanceof String) {
    num = Number(val)
  } else {
    num = val
  }
  switch (num) {
    case 0:
      str = '社会考生'
      break
    case 1:
      str = '在校生'
      break
    default:
      str = '未知'
  }
  return str
}

export function nameFirstFilter(val) { // 获取学生名字的姓氏
  let str
  if (val) {
    str = val.substring(val.length - 2, val.length)
    return str
  }
}

export function dateFilter(val) { // 日期时间取日期
  let str
  if (val) {
    str = val.split(' ')[0]
    return str
  }
}

// 金额整理
export function moneyOnlyFilter(val) {
  if (typeof val === 'string' && !+val) return val
  try {
    let str = Number(val)
    if (val > 9999 || val < -9999) {
      str = (val / 10000).toFixed(2)
    }
    return str
  } catch (error) {
    console.log('数据为：' + val, error)
  }
}

// 金额数据整理
export function moneyFilter(val) {
  if (typeof val === 'string') return val
  try {
    let str = Number(val)
    if (val > 9999 || val < -9999) {
      str = (val / 10000).toFixed(2) + '万'
    }
    return str
  } catch (error) {
    console.log('数据为：' + val, error)
  }
}

// 金额单位整理
export function moneyUnitFilter(val) {
  // if (typeof val === 'string') return val
  try {
    let str = ''
    if (+val > 9999 || +val < -9999) {
      str = '万'
    }
    return str
  } catch (error) {
    console.log('数据为：' + val, error)
  }
}

export function transWeek(time) {
  let timeArr = [{
    label: '周一',
    value: 1
  }, {
    label: '周二',
    value: 2
  }, {
    label: '周三',
    value: 3
  }, {
    label: '周四',
    value: 4
  }, {
    label: '周五',
    value: 5
  }, {
    label: '周六',
    value: 6
  }, {
    label: '周日',
    value: 0
  }]
  let weekStr = timeArr.find(item => {
    return item.value === time
  })
  if (weekStr) {
    return weekStr.label
  } else {
    throw new Error('数据错误:::' + time)
  }
}

export function transDateWeekOrNoonTime(time, type) {
  // type: dateWeek 日期+周  noonTime 上下午+时间
  if (!time) return ''
  if (type === 'dateWeek') {
    return dayjs(time).format('MM/DD') + ' ' + transWeek(dayjs(time).day())
  } else if (type === 'noonTime') {
    return (dayjs(time).isBefore(dayjs(dayjs(time).format('YYYY/MM/DD' + ' ' + '12:00:00'))) ? '上午' : '下午') + ' ' + dayjs(time).format('HH:mm')
  } else if (type === 'noonTimeDateWeek') {
    return dayjs(time).format('MM/DD') + ' ' + transWeek(dayjs(time).day()) + ' ' + (dayjs(time).isBefore(dayjs(dayjs(time).format('YYYY/MM/DD' + ' ' + '12:00:00'))) ? '上午' : '下午') + ' ' + dayjs(time).format('HH:mm')
  } else if (type === 'dateWeekNoonTime') {
    return (dayjs(time).isBefore(dayjs(dayjs(time).format('YYYY/MM/DD' + ' ' + '12:00:00'))) ? '上午' : '下午') + ' ' + dayjs(time).format('HH:mm') + ' ' + dayjs(time).format('MM/DD') + ' ' + transWeek(dayjs(time).day())
  } else {
    return time
  }
}

// 数字精度处理（保留几位小数）
export function _toFixed(num, precision = 2, symbol = '') {
  if (typeof num !== 'number' || num === 0) return
  const dividend = Math.pow(10, precision)
  const result = (Math.round(num * dividend) / dividend).toFixed(precision)
  return `${result}${symbol}`
}

export function commonSchoolMajor(obj, tag) {
  if (obj && obj.extend) {
    let arr = []
    for (const key in obj.extend) {
      if (Object.hasOwnProperty.call(obj.extend, key)) {
        const element = obj.extend[key]
        if (tag === 'major' && [3, 4].includes(element.flag)) {
          arr.push(element.text)
        }
        if (tag === 'school' && element.flag === 2) {
          arr.push(element.text)
        }
      }
    }
    arr = arr.filter(v => v && v !== '-')
    return arr.length ? arr.join('/') : '-'
  } else return '-'
}


// 金额整理(万元)
export function moneyWOnlyFilter(val) {
  if (typeof val === 'string' && !+val) return val
  try {
    let str = Number(val)
    str = (val / 10000).toFixed(2)
    return str
  } catch (error) {
    console.log('数据为：' + val, error)
  }
}
