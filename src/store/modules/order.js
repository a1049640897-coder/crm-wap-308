import {
  getCommonFilterConditionApi,
} from '@/api/potentialGuest/order'

// 订单存在全部的选项的唯一标识都是id25
export default {
  namespaced: true,
  state: {
    queryList: {
      stateList: [
        {
          id: 1,
          text: '待支付',
          color: '#409eff'
        },
        {
          id: 2,
          text: '有余款',
          color: '#f56c6c'
        },
        {
          id: 3,
          text: '已交清',
          color: '#333333'
        },
        {
          id: 4,
          text: '已取消',
          color: '#999999'
        },
        {
          id: 5,
          text: '已退款',
          color: '#999999'
        },
        {
          id: 6,
          text: '需退款',
          color: '#e6a23c'
        }
      ], //状态
      classTypeList: [
        {
          id: 25,
          text: '全部'
        },
        {
          id: 4,
          text: '高端班'
        },
        {
          id: 3,
          text: '中端班'
        },
        {
          id: 2,
          text: '低端班'
        },
      ], //班型
      serviceStateList: [
        {
          id: 25,
          text: '全部'
        },
        {
          id: 1,
          text: '服务未开始',
          color: '#f56c6c'
        },
        {
          id: 2,
          text: '服务进行中',
          color: '#409eff'
        },
        {
          id: 3,
          text: '服务已终止',
          color: '#333333'
        },
        {
          id: 4,
          text: '暂停服务',
          color: '#03dfa1'
        },
        {
          id: 5,
          text: '无需服务',
          color: '#03dfa1'
        }
      ], // 服务状态

      // 报名订单日期
      dateTypeList: [
        {
          value: 1,
          text: '报名日期'
        },
        {
          value: 2,
          text: '添加日期'
        },
        {
          value: 3,
          text: '下次补款'
        },
      ],
      yearList: [], // 考试年份、考试届别
    },
    regExps: { // 收据号规则
      1: /^(XM|JK|FZ|G|CQ|ZJ)\d{7}$/,
      3: /^(JZ|ZG|MS|GM|XJ)\d{7}$/,
      47: /^W\d{7}$/,
      22: /^Y\d{7}$/,
      62: /^GH\d{7}$/,
      93: /^GH\d{7}$/,
      49: /^B\d{7}$/,
      50: /^(C|GJ|CX|CF|CJ|CG)\d{7}$/,
      48: /^Z\d{7}$/,
      66: /^(JZ|ZG|MS|GM|XJ)\d{7}$/,
      74: /^(JZ|ZG|MS|GM|XJ)\d{7}$/,
      68: /^ZC\d{7}$/,
      76: /^GB\d{7}$/,
      77: /^JB\d{7}$/,
      97: /^(JZ|XK)\d{7}$/
    },
    regExpsFound: {
      1: /^(XM|JK|FZ|G|CQ|ZJ|HN)\d{9}\D$/,
      3: /^(JZ|ZG|MS|GM|XJ|MJZ)\d{9}\D$/,
      47: /^W\d{9}\D$/,
      22: /^Y\d{9}\D$/,
      62: /^GH\d{9}\D$/,
      93: /^GH\d{9}\D$/,
      49: /^B\d{9}\D$/,
      50: /^(C|GJ)\d{9}\D$/,
      48: /^(Z|GZ)\d{9}\D$/,
      66: /^(JZ|ZG|MS|GM|XJ|MZG)\d{9}\D$/,
      74: /^(JZ|ZG|MS|GM|XJ|FJZ)\d{9}\D$/,
      68: /^ZC\d{9}\D$/,
      76: /^GB\d{9}\D$/,
      77: /^JB\d{9}\D$/
    },
    commonId: null, //列表是否刷新
  },
  mutations: {
    SET_QUERYLIST(state, queryList) {
      state.queryList = {
        ...state.queryList,
        ...queryList
      }
    },
    SET_ORDERID(state, payLoad) {
      const { commonId } = payLoad
      state.commonId = commonId
    },
  },
  actions: {
    queryListOrder({
      commit
    }) {
      getCommonFilterConditionApi().then(res => {
        commit('SET_QUERYLIST', res.data)
      })
    },


  }
}