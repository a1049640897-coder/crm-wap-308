<template>
  <!-- 报名订单 -->
  <div>
    <HeaderFilter :listType="listType" @onListQuery="handleListQuery" :paramProp="listQuery.param" />
    <HeaderNum :countObj="countObj" :listType="listType" />
    <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <EnrollmentOrderCard v-for="(item, index) in tableList" @onCompelete="resetSingleList" :key="item.id" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="listType" @onAllRefresh="handleAllRefresh" />
      </div>
    </RMList>
  </div>
</template>

<script>
// 咨询用户
import { getScrollTop } from '@/utils'
import { getOrderListApi, getDataStatisticsApi, updateOrderSingleListApi } from '@/api/potentialGuest/order'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  props: {
    listType: String // EnrollmentOrder: 报名订单 EnrollmentCollection: 报名收款  ShiftRecord: 换班记录
  },
  components: {
    HeaderFilter: () => import('../../components/HeaderFilter.vue'),
    RMList: () => import('@/components/ReComponents/RMList'),
    EnrollmentOrderCard: () => import('@/components/EnrollmentOrderCard'),
    HeaderNum: () => import('@/components/HeaderNum')
  },
  data() {
    return {
      height: 0,
      moreLoading: false,
      refreshing: false,
      finished: false,
      counselTab: 1,
      tableList: [],
      listQuery: {
        pageinfo: {
          pageNum: 1,
          pageSize: this.pageSize,
          count: false,
          sort: []
        },
        param: {
          areaId: [],
          attribute: null, // 班型
          isServes: [], // 服务状态
          contractAttestationState: null,
          contractInitiateState: null,
          contractState: null,
          endDate: dayjs().format('YYYY/MM/DD'),
          packets: [],
          screen: 1,
          startDate: dayjs().startOf('year').format('YYYY/MM/DD'),
          sortRule: { title: '添加日期', type: 1, column: 'createTime' },
          states: [1, 2, 3, 5, 6],
          keyword: '',
          graduationYears: [],
          years: [],
          owners: []
        }
      },
      countObj: {}, // 头部统计对象
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize,

    })
  },
  activated() {
    this.handleScrollInit()
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    this.handleInit()
    this.handleScrollInit()
  },
  methods: {
    resetSingleList(id) {
      this.$loading(true, `cTableLoading_${this.listType}`)
      updateOrderSingleListApi(id, 1).then(res => {
        if (res.data) {
          if (this.tableList.find(v => v.id == res.data.id)) {
            let index = this.tableList.findIndex(v => v.id == res.data.id)
            this.$set(this.tableList, index, res.data)
          }
          this.$loading(false, `cTableLoading_${this.listType}`)
        } else {
          this.$loading(false, `cTableLoading_${this.listType}`)
          this.handleRefresh()
        }
      })
    },
    handleScrollInit() {
      window.addEventListener('scroll', this.handleScroll)
      window.scrollTo(0, this.height)
    },

    handleInit() {
      this.getTableList('init')
    },

    getTableList(val, propPage) {
      this.moreLoading = true
      this.$loading(true, `cTableLoading_${this.listType}`)
      const { sortRule } = this.listQuery.param
      const query = {
        pageinfo: {
          ...this.listQuery.pageinfo,
          pageSize: this.pageSize,
          sort: Object.keys(sortRule).length ? [sortRule] : []
        },
        param: {
          ...this.listQuery.param,
        }
      }
      if (propPage) {
        query.pageinfo = {
          ...query.pageinfo,
          ...propPage
        }
      }
      let api = getOrderListApi
      api(query).then(res => {
        if (['init', 'refresh'].includes(val)) {
          this.tableList = res.data || []
        } else {
          this.tableList = this.tableList.concat(res.data || [])
        }
        if (res.data.length < this.pageSize) {
          this.finished = true
        }
      }).finally(() => {
        this.$nextTick(() => {
          this.moreLoading = false
          this.refreshing = false
        })
        this.$loading(false, `cTableLoading_${this.listType}`)
      })

      getDataStatisticsApi(query.param).then(res => {
        this.countObj = res.data || {}
      })
    },
    handleScroll() {
      getScrollTop().then(height => {
        this.height = height
      })
    },

    handleListQuery(paramProp) {
      this.listQuery.pageinfo.sort = paramProp.sortRule ? [{ ...paramProp.sortRule }] : []
      let newService = Array.isArray(paramProp.isServes) && paramProp.isServes[0] == 25 ? [] : paramProp.isServes ? [...paramProp.isServes] : []
      const {
        shellIdsLocal, achievementAreaLocal, attendSchoolIdLocal, enrollSchoolIdLocal, enrollSubjectLocal,
        coureseLocal, attribute
      } = paramProp
      this.listQuery.param = {
        ...paramProp,
        isServes: newService,
        sysShellIds: shellIdsLocal ? [shellIdsLocal] : [],
        orderAreas: achievementAreaLocal ? [achievementAreaLocal] : [],
        attendSchools: attendSchoolIdLocal ? [attendSchoolIdLocal] : [],
        collegeId: enrollSchoolIdLocal ? [enrollSchoolIdLocal] : [],
        emEnrollSubjectIds: enrollSubjectLocal,
        packets: coureseLocal ? [coureseLocal] : [],
        attribute: attribute == 25 ? null : attribute
      }
      this.finished = false
      this.handleRefresh()
    },

    handleLoad() {
      this.listQuery.pageinfo.pageNum += 1
      this.getTableList('more')
    },
    handleRefresh() {
      console.log('重新加载...');
      this.listQuery.pageinfo.pageNum = 1
      this.finished = false
      this.getTableList('refresh')
    },
    handleStudent() {
      if (this.refreshing || this.moreLoading) return
      // getScrollTop().then(height => {
      //   this.height = height
      // })
      this.$router.push('/studentinfo')
    },
    handleUpdataInfo(obj, item, index) {
      this.tableList.splice(index, 1, obj)
    },
    handleAddStudent() {
      this.$router.push({
        path: `/studentinfoedit/null`
      })
    },

    handleAllRefresh() {
      const propPage = {
        pageNum: 1,
        pageSize: this.listQuery.pageinfo.pageNum * this.pageSize
      }
      this.getTableList('refresh', propPage)
    }
  }
}
</script>
