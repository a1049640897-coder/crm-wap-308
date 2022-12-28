<template>
  <!-- 报名收款 -->
  <div>
    <HeaderFilter :listType="listType" @onListQuery="handleListQuery" :paramProp="listQuery.param" />
    <HeaderNum :countNum="countNum" :listType="listType" />
    <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <EnrollmentCollectionCard v-for="(item, index) in tableList" :key="item.id" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="listType" @onAllRefresh="handleAllRefresh" />
      </div>
    </RMList>

  </div>
</template>

<script>
import { getScrollTop } from '@/utils'
import { getEnrollmentOrderTotalCollectionApi, getEnrollmentOrderListApi, updateOrderSingleListApi } from '@/api/potentialGuest/order'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  props: {
    listType: String // EnrollmentOrder: 报名订单 EnrollmentCollection: 报名收款  ShiftRecord: 换班记录
  },
  components: {
    HeaderFilter: () => import('../../components/HeaderFilter.vue'),
    RMList: () => import('@/components/ReComponents/RMList'),
    EnrollmentCollectionCard: () => import('@/components/EnrollmentCollectionCard'),
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
          endDate: dayjs().format('YYYY/MM/DD'),
          startDate: dayjs().startOf('year').format('YYYY/MM/DD'),
          packets: [],
          types: [],
          sortRule: { title: '添加日期', type: 1, column: 'createTime' },
          operators: [],
          owners: []
        }
      },
      countNum: 0, // 头部统计对象
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
      updateOrderSingleListApi(id, 2).then(res => {
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
      // 删除不属于报名收款的参数
      delete query.param.attributeList
      delete query.param.isServes
      console.log('query', query);
      getEnrollmentOrderListApi(query).then(res => {
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

      getEnrollmentOrderTotalCollectionApi(query.param).then(res => {
        this.countNum = res.data || 0
      })
    },
    handleScroll() {
      getScrollTop().then(height => {
        this.height = height
      })
    },

    handleListQuery(paramProp) {
      const {
        shellIdsLocal, achievementAreaLocal, attendSchoolIdLocal,
        coureseLocal
      } = paramProp
      this.listQuery.pageinfo.sort = paramProp.sortRule ? [{ ...paramProp.sortRule }] : []
      this.listQuery.param = {
        ...paramProp,
        sysShellIds: shellIdsLocal ? [shellIdsLocal] : [],
        orderAreas: achievementAreaLocal ? [achievementAreaLocal] : [],
        attendSchools: attendSchoolIdLocal ? [attendSchoolIdLocal] : [],
        packets: coureseLocal ? [coureseLocal] : [],
      }
      delete this.listQuery.param.cityId
      delete this.listQuery.param.collegeId
      delete this.listQuery.param.areaIdLocal
      delete this.listQuery.param.cityId
      delete this.listQuery.param.collegeId
      delete this.listQuery.param.emEnrollSubjectIds
      delete this.listQuery.param.enrollSchoolIdLocal
      delete this.listQuery.param.enrollSubjectLocal
      delete this.listQuery.param.lmSubjectId


      console.log('handleListQuery', this.listQuery.param);
      this.finished = false
      this.handleRefresh()
    },

    handleLoad() {
      this.listQuery.pageinfo.pageNum += 1
      this.getTableList('more')
    },
    handleRefresh() {
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
