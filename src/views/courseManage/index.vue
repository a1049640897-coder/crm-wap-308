<template>
  <!-- 课程包收款 -->
  <div>
    <HeaderFilter :listType="listType" @onListQuery="handleListQuery" :addUserList="addUserList" :paramProp="listQuery.param" />
    <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <CourseRecordCard v-for="(item, index) in tableList" :cooperationType="cooperationType" :key="item.id" @look="handleLookCode" @onUpdateStatus="handleUpdateStatus" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="listType" @onAllRefresh="handleAllRefresh" />
      </div>
    </RMList>
    <ShareCode :isOpen="shareCodeIsOpen" ref="shareCode" counselTab="course" :sId="sId" @close="handleClose" />
    <div class="common-bottom-btns">
      <div class="common-bottom-btn" @click="handleCommonAdd">
        <img src="@/assets/images/icons/add.png" alt="">
        <span>添加收款</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getScrollTop } from '@/utils'
import {
  getCourseListApi,
  getCourseAddUserListApi,
  updateCourseStatusApi
} from '@/api/potentialGuest/course'
import { updateOrderSingleListApi } from '@/api/potentialGuest/order'
import { mapState, mapMutations } from 'vuex'
import { Notify } from 'vant'
export default {
  name: 'courseManage-index',
  props: {
    listType: String // EnrollmentOrder: 报名订单 EnrollmentCollection: 报名收款  ShiftRecord: 换班记录
  },
  components: {
    HeaderFilter: () => import('./components/HeaderFilter.vue'),
    RMList: () => import('@/components/ReComponents/RMList'),
    CourseRecordCard: () => import('@/components/CourseRecordCard'),
    ShareCode: () => import('@/components/ShareCode')
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
          addUser: null,
          areaId: [],
          cooperationType: 0,
          keyword: null,
          sortRule: { title: '添加日期', type: 1, column: 'createTime' },
          state: [],
          orderDept: null
        }
      },
      shareCodeIsOpen: false,
      countNum: 0, // 头部统计对象
      addUserList: [],
      sId: null,
      cooperationType: 0, // 0 非合作院校 1合作院校
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize,
      isAddUpdate: state => state.course.isAddUpdate, // 课程包添加刷新
      addUpdateId: state => state.course.addUpdateId, // 课程包添加刷新
      courseId: state => state.course.courseId, // 课程包添加刷新
    })
  },
  activated() {
    this.handleScrollInit()
    this.handleCheckRefresh()
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    this.handleInitAddUserList().then(() => {
      this.handleInit()
      // 设置学费缴纳状态
      this.setTourtionList()
    })
    this.handleScrollInit()
  },
  methods: {
    handleLookCode(id) {
      this.sId = id
      this.shareCodeIsOpen = true
    },
    handleClose() {
      this.shareCodeIsOpen = false
    },
    handleCheckRefresh() {
      if (this.isAddUpdate) {
        this.handleRefresh()
        this.sId = this.addUpdateId
        this.shareCodeIsOpen = true
        this['SET_UPDATEFLAG']({ isAddUpdate: false, addUpdateId: null })
      }
      if (this.courseId) {
        this.resetSingleList(this.courseId)
        this.sId = this.courseId
        this.shareCodeIsOpen = true
        this['SET_COURSEID']({ courseId: null })
      }
    },
    ...mapMutations('course/', ['SET_UPDATEFLAG', 'SET_COURSEID']),
    handleCommonAdd() {
      this.$router.push(`/courseAddEdit/null/${this.cooperationType}`)
    },
    // id: 课程包id type: 1 开启 0关闭
    handleUpdateStatus(id, type) {
      updateCourseStatusApi(id, type).then(() => {
        if (type) {
          Notify({ type: 'success', message: '开启成功!' })
        } else {
          Notify({ type: 'success', message: '关闭成功!' })
        }
        this.resetSingleList(id)
      })
    },
    handleInitAddUserList() {
      const { userId } = JSON.parse(localStorage.getItem('userInfo'))
      return new Promise(resolve => {
        getCourseAddUserListApi().then(res => {
          this.addUserList = res.data || []
          this.listQuery.param.addUser = this.addUserList.find(
            v => v.id == userId
          )
            ? userId
            : null
          resolve()
        })
      })
    },

    resetSingleList(id) {
      this.$loading(true, `course`)
      updateOrderSingleListApi(id, 5).then(res => {
        if (res.data) {
          if (this.tableList.find(v => v.id == res.data.id)) {
            let index = this.tableList.findIndex(v => v.id == res.data.id)
            this.$set(this.tableList, index, res.data)
          }
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

    getTableList(val) {
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
      this.cooperationType = Number(this.$route.params.cooperationType)
      query.param.cooperationType = this.$route.params.cooperationType

      getCourseListApi(query)
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
