import request from '@/plugin/axios'

// 获取课程包收款 - 列表
export function getCourseListApi(data) {
  return request({
    url: '/order/selfServiceOrder',
    method: 'post',
    data
  })
}

// 获取课程包添加人 
export function getCourseAddUserListApi(params) {
  return request({
    url: `market/potentialStudentReal/sea/userBox`,
    params,
    method: 'post'
  })
}

// 课程包状态更改 
export function updateCourseStatusApi(courseId, state) {
  return request({
    url: `/order/selfServiceOrder/${courseId}/${state}`,
    method: 'PATCH'
  })
}


// 课程包详情列表 
export function getCourseDetailList(data) {
  return request({
    url: `/order/selfServiceOrder/scanCode`,
    data,
    method: 'post'
  })
}

// 获取学费缴纳状态列表
export function getFmCollectionCodeIdListApi(id) {
  return request({
    url: `/order/fmCollectionCode/MarketArea/${id}`,
    method: 'GET'
  })
}

// 课程包添加
export function addCourseApi(data) {
  return request({
    url: `/order/selfServiceOrder`,
    method: 'PUT',
    data
  })
}
//  课程包编辑
export function editCourseApi(data) {
  return request({
    url: `/order/selfServiceOrder`,
    method: 'PATCH',
    data
  })
}

// 获取报名课程包
export function getCoursePacketApi(data) {
  return request({
    url: `/order/order/shellPacket`,
    method: 'POST',
    data
  })
}

// 获取课程包上课地点
export function getCoursePacketAddressApi(id) {
  return request({
    url: `/education/address/addressCoursePacket/${id}`,
    method: 'GET'
  })
}

// 获取课程包详情
export function getCoursePacketDetailApi(id) {
  return request({
    url: `/order/selfServiceOrder/${id}`,
    method: 'GET'
  })
}
