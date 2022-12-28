import request from '@/plugin/axios'

// 获取订单 - 列表
export function getOrderListApi(data) {
  return request({
    url: '/order/order',
    method: 'post',
    data
  })
}


// 头部筛选 报考科目下拉列表
export function getEnrollSubjectDropApi(data) {
  return request({
    url: `/education/enrollSubject/enrollSubjectDrop`,
    method: 'get',
    data
  })
}

// 头部筛选 获取订单列表筛选条件
export function getOrderConditionApi(data) {
  return request({
    url: `/order/order/condition`,
    method: 'POST',
    data
  })
}

//头部筛选 获取订单列表筛选课程包
export function getCoursePackeOrdertDropApi() {
  return request({
    url: `/education/coursePacket/power/coursePacket`,
    method: 'get',
  })
}


// 头部筛选 获取所属人
export function getOwnListApi() {
  return request({
    url: `/system/user/shells`,
    method: 'get',
  })
}

// 头部数据统计获取
export function getDataStatisticsApi(data) {
  return request({
    url: `/order/order/count`,
    method: 'post',
    data
  })
}

// 报名收款-列表
export function getEnrollmentOrderListApi(data) {
  return request({
    url: `/order/payment/list`,
    method: 'post',
    data
  })
}

// 报名收款-合计收款
export function getEnrollmentOrderTotalCollectionApi(data) {
  return request({
    url: `/order/payment/list/count`,
    method: 'post',
    data
  })
}

// 获取订单列表通用筛选
export function getCommonFilterConditionApi() {
  return request({
    url: `/order/payment/list/condition`,
    method: 'post',
  })
}

// 换班记录列表获取
export function getShiftRecordListApi(data) {
  return request({
    url: `/order/replace`,
    method: 'post',
    data
  })
}

// 换班记录同意或者拒绝
export function setShiftRecordListStatusApi(data) {
  return request({
    url: `order/replace/audit`,
    method: 'PATCH',
    data
  })
}


// 订单列表更新单一项
export function updateOrderSingleListApi(id, type) {
  return request({
    url: `/order/common/information/${id}/${type}`,
    method: 'get',
  })
}

// 查看是否分享弹窗
export function patchIsShareWindowApi(orderId) {
  return request({
    url: `/order/order/isShareWindow/${orderId}`,
    method: 'GET'
  })
}


// 获取订单分享信息详情
export function shareDetailApi(id) {
  return request({
    url: `/order/payment/share/${id}`,
    method: 'get'
  })
}

// 获取订单二维码
export function getOrderQrcodeApi(code, id) {
  return request({
    url: `/order/selfServiceOrder/code/${code}/${id}`,
    method: 'get'
  })
}


// 获取在线支付二维码页面信息
export function getOnlineScanMsgApi(orderId, type) {
  return request({
    url: `/order/pay/code/${orderId}/${type}`,
    method: 'get'
  })
}

// 更新分享人
export function patchSharePersonApi(orderId) {
  return request({
    url: `/order/order/sharePerson/${orderId}`,
    method: 'PATCH'
  })
}

// 获取部门顶层的分校id
export function getTopBranchIdApi(id) {
  return request({
    url: `/order/order/shell/${id}`,
    method: 'GET'
  })
}

//  获取动态详情
export function getDynamicDetailApi(data) {
  return request({
    url: `/system/fieldConfig/detail`,
    method: 'POST',
    data
  })
}

// 修改学费缴纳状态
export function changeStuPaymentStateApi(orderId, state) {
  return request({
    url: state ? `/order/order/tuitionStatus/${orderId}/${state}` : `/order/order/tuitionStatus/${orderId}`,
    method: 'patch'
  })
}

// 修改学费缴纳状态(课程包)
export function changeStuPaymentCourStateApi(orderId, state) {
  return request({
    url: state ? `/order/selfServiceOrder/tuitionStatus/${orderId}/${state}` : `/order/selfServiceOrder/tuitionStatus/${orderId}`,
    method: 'patch'
  })
}

// 获取订单链接
export function getServiceOrderLinkApi(code, id) {
  return request({
    url: `/order/selfServiceOrder/url/${code}/${id}`,
    method: 'get'
  })
}


// 获取添加收款记录经办人
export function getOperatorsApi(params) {
  return request({
    url: `/market/branch/user`,
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetailApi(orderId) {
  return request({
    url: `/order/order/${orderId}`,
    method: 'get',
  })
}

// 添加收款记录
export function addOrderRecordApi(data) {
  return request({
    url: `/order/payment`,
    method: 'PUT',
    data
  })
}

// 获取收款记录详情
export function getCollectDetailApi(id) {
  return request({
    url: `/order/payment/${id}`,
    method: 'get',
  })
}


// 编辑收款记录
export function editCollectDetailApi(data) {
  return request({
    url: `/order/payment`,
    method: 'PATCH',
    data
  })
}

// 删除收款记录
export function delCollectDetailApi(id) {
  return request({
    url: `/order/payment/${id}`,
    method: 'DELETE',
  })
}

// 查看支付记录列表
export function getPayRecordLiostApi(id) {
  return request({
    url: `/order/payment/detail/${id}`,
    method: 'get',
  })
}


// 获取支付记录详情
export function getPayRecordDetail(id) {
  return request({
    url: `/order/paymentRecord/${id}`,
    method: 'get',
  })
}

// 编辑支付记录
export function editPayRecord(data) {
  return request({
    url: `/order/paymentRecord`,
    method: 'PATCH',
    data
  })
}

// 获取空令牌
export function getNoneAuthApi() {
  return request({
    url: `/loginauth/none`,
    method: 'get'
  })
}

// 获取完善信息
export const getInformationaApi = id => {
  return request({
    method: 'GET',
    url: `/order/order/completed/information/${id}`,
  })
}

// 获取字段详情
export function fieldConfigDetailApi(data) {
  return request({
    url: `/system/fieldConfig/detail`,
    method: 'post',
    data: data
  })
}

//  发送短信
export function sendMsgApi(id,code) {
  return request({
    url: `/order/payment/sms/${id}/${code}`,
    method: 'post',
  })
}

//  收据作废
export function invalidReceiptNumberApi(id) {
  return request({
    url: `/order/payment/invalidReceiptNumber/${id}`,
    method: 'PATCH',
  })
}

//  撤销收据作废
export function undoInvalidReceiptNumberApi(id) {
  return request({
    url: `/order/payment/undoInvalidReceiptNumber/${id}`,
    method: 'PATCH',
  })
}


