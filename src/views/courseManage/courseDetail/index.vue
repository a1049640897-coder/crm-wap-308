<template>
  <!-- 课程包收款 -->
  <div>
    <HeaderFilter listType="detail" @onListQuery="handleListQuery" lis :paramProp="listQuery.param" />
    <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <CourseDetailCard v-for="(item) in tableList" :stateList="stateList" :key="item.id" :studentData="item" />
      </div>
    </RMList>
  </div>
</template>

<script>
import { getScrollTop } from '@/utils'
import {
  getCourseDetailList
} from '@/api/potentialGuest/course'
import { updateOrderSingleListApi } from '@/api/potentialGuest/order'
import { mapState } from 'vuex'
export default {
  name: 'courseManage-courseDetail',
  components: {
    HeaderFilter: () => import('../components/HeaderFilter.vue'),
    RMList: () => import('@/components/ReComponents/RMList'),
    CourseDetailCard: () => import('./components')
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
          id: null,
          keyword: null,
          sortRule: { title: '添加日期', type: 1, column: 'createTime' },
          state: [],
        }
      },
      stateList: []
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize,
      queryList: state => state.order.queryList,
    })
  },
  activated() {
    this.handleScrollInit()
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    console.log('7777', this.queryList);
    this.handleInit()
    this.handleScrollInit()
    this.stateList = JSON.parse(JSON.stringify(this.queryList.stateList))
    this.stateList.push({ id: 7, text: '暂无', color: '#e6a23c' })
  },
  methods: {

    resetSingleList(id) {
      this.$loading(true, `course`)
      updateOrderSingleListApi(id, 5).then(res => {
        if (res.data) {
          if (this.tableList.find(v => v.id == res.data.id)) {
            let index = this.tableList.findIndex(v => v.id == res.data.id)
            this.$set(this.tableList, index, res.data)
          }
          // this.tableList = [{}, {}]
          this.$loading(false, `course`)
        } else {
          this.$loading(false, `course`)
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
      this.$loading(true, `course`)
      const { sortRule } = this.listQuery.param
      const query = {
        pageInfo: {
          ...this.listQuery.pageinfo,
          pageSize: this.pageSize,
          sort: Object.keys(sortRule).length ? [sortRule] : []
        },
        param: {
          ...this.listQuery.param
        }
      }
      query.param.id = this.$route.params.id
      getCourseDetailList(query)
        .then(res => {
          if (['init', 'refresh'].includes(val)) {
            this.tableList = res.data || []
          } else {
            this.tableList = this.tableList.concat(res.data || [])
          }
          if (res.data.length < this.pageSize) {
            this.finished = true
          }
          this.moreLoading = false
        })
        .finally(() => {
          this.$nextTick(() => {
            this.moreLoading = false
            this.refreshing = false
          })
          this.$loading(false, `course`)
        })
    },

    handleScroll() {
      getScrollTop().then(height => {
        this.height = height
      })
    },

    handleListQuery(paramProp) {
      console.log('7777')
      this.listQuery.pageinfo.sort = paramProp.sortRule
        ? [{ ...paramProp.sortRule }]
        : []
      this.listQuery.param = {
        ...paramProp,
        state: paramProp.state[0] == 25 ? [] : paramProp.state,
        orderDept: paramProp.orderDept ? [paramProp.orderDept] : null
      }
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
