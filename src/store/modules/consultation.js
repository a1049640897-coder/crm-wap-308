import { stuFilterOptionsApi, yuYueZixunDepartApi, yuYueZixunFilterApi, seaPutUserApi } from '@/api/potentialGuest/consultation'

export default {
  namespaced: true,
  state: {
    // isRefreshTable: false,
    queryList: {
      stateList: [], // 状态
      yuYueZiXunstateList: [
        { value: 2, id: 2, text: '未安排' },
        { value: 3, id: 3, text: '已安排' },
        { value: 8, id: 8, text: '未完成' },
        { value: 9, id: 9, text: '已完成' },
        { value: 4, id: 4, text: '今日可跟进' },
        { value: 5, id: 5, text: '超期未跟进' }
      ], // 预约咨询状态
      reserveList: [], // 预约咨询
      consultTypeList: [], // 咨询类型
      yearList: [], // 考试年份、考试届别
      campusLis: [], // 市场区域负责人
      ownList: [], // 所属人
      isFreshList: [], // 属性
      graduationList: [], // 毕业年份
      cityTreeList: [], // 所在城市
      dateTypeList: [], // 日期类型
      intentionList: [], // 意向类型
      sourceList: [], // 来源渠道
      filterDateRange: [{ title: '今日需回访', id: 6 }, { title: '近3天需回访', id: 7 }, { title: '近7天需回访', id: 8 }],
      statisticsTypeList: [{ title: '超期未回访', id: 2 }, { title: '高意向类型', id: 3 }, { title: '高端班意向', id: 4 }],
      consultMobilesList: [{ title: '未预约', id: 1 }, { title: '未完成', id: 2 }, { title: '已完成', id: 3 }],
      sortRuleList: [
        {
          title: '添加日期',
          column: 'addTime'
        },
        {
          title: '咨询日期',
          column: 'consultTime'
        },
        {
          title: '最后回访',
          column: 'lastConsultTime'
        },
        {
          title: '下次回访',
          column: 'nextConsultTIme'
        }
      ],
      waitFollowTypeList: [{ title: '分配', id: 1 }, { title: '转交', id: 2 }],

      // 投放人
      setPutList: []
    },
    yyzxDepartList: [],
    yyzxQueryList: {
      resultList: [],
      consultantList: []
    },
    registerJobList: [
      { id: 1, title: '临床', registerJob: '临床' },
      { id: 2, title: '护理', registerJob: '护理' },
      { id: 3, title: '药学', registerJob: '药学' },
      { id: 4, title: '中医', registerJob: '中医' },
      { id: 5, title: '检验', registerJob: '检验' },
      { id: 6, title: '康复', registerJob: '康复' },
      { id: 7, title: '公卫', registerJob: '公卫' },
      { id: 8, title: '影像', registerJob: '影像' },
      { id: 9, title: '其他', registerJob: '其他' }
    ]
  },
  mutations: {
    SET_ISREFRESHTABLE(state, value) {
      state.isRefreshTable = value
    },
    SET_QUERYLIST(state, queryList) {
      state.queryList = {
        ...state.queryList,
        ...queryList,
        stateList: queryList.stateList ? queryList.stateList.map(item => {
          item.value = item.value.toString()
          return item
        }) : [],
        isFreshList: queryList.isFreshList ? queryList.isFreshList.map(item => {
          item.value = item.value.toString()
          return item
        }) : [],
        classList: queryList.classList || []
      }
    },
    SET_QUERYLIST_YYZX(state, yyzxDepartList) {
      state.yyzxDepartList = yyzxDepartList
    },
    SET_QUERYLIST_YYZXQUERYLIST(state, yyzxQueryList) {
      state.yyzxQueryList = {
        ...state.yyzxQueryList,
        resultList: (yyzxQueryList.result || []).map(item => {
          return {
            id: item.value,
            title: item.text
          }
        }),
        consultantList: (yyzxQueryList.consultantList || []).map(item => {
          return {
            id: item.value,
            title: item.text
          }
        })
      }
    },
    SET_SEAPUTUSET(state, list) {
      state.queryList.setPutList = list
    }
  },
  actions: {
    queryListAct({ commit }) {
      stuFilterOptionsApi(1).then(res => {
        if (res.data.consultTypeList) {
          res.data.consultTypeList.unshift({ value: -1, text: '全部' })
        }
        commit('SET_QUERYLIST', res.data)
      })
      yuYueZixunDepartApi().then(res => {
        let arr = res.data || []
        commit('SET_QUERYLIST_YYZX', arr.map(item => {
          return {
            id: item.value,
            title: item.text
          }
        }))
      })
      yuYueZixunFilterApi().then(res => {
        commit('SET_QUERYLIST_YYZXQUERYLIST', res.data || [])
      })
      seaPutUserApi().then(res => {
        commit('SET_SEAPUTUSET', res.data || [])
      })
    },
    isRefreshTableAct({ commit }, value) {
      commit('SET_ISREFRESHTABLE', value)
    }
  }
}