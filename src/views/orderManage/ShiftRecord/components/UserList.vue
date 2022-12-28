<template>
  <!-- 换班记录 -->
  <div>
    <HeaderFilter :listType="listType" @onListQuery="handleListQuery" :paramProp="listQuery.param" />
    <RMList :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <ShiftRecordCard v-for="(item, index) in tableList" :key="item.id" @onAgree="handleAgree" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="listType" @onAllRefresh="handleAllRefresh" />
      </div>
    </RMList>

    <!-- 同意/拒绝弹窗 -->
    <van-popup v-model="isShow" position="bottom" class="van-popup-box" :style="{ height: '32%' }" :close-on-click-overlay="false" @close="hanleCancel" get-container="#app" closeable>
      <div class="det-form-header">
        {{submitForm.title}}
      </div>
      <div class="det-form">
        <van-form ref="submitForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
          <van-field v-model="submitForm.failureReason" label="" v-if="submitForm.state == 3" autosize type="textarea" clear-trigger="always" placeholder="请输入拒绝理由" clearable input-align="left" maxlength="500" />
        </van-form>
        <div class="dept-form-footer">
          <van-button class="btn" type="info" native-type="buttton" @click.stop="handleSave" :loading="loading">保存</van-button>
          <van-button class="btn" type="info" native-type="buttton" @click.stop="hanleCancel">取消</van-button>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
// 咨询用户
import { getScrollTop } from '@/utils'
import { getShiftRecordListApi, setShiftRecordListStatusApi, updateOrderSingleListApi } from '@/api/potentialGuest/order'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import { Notify } from 'vant'
export default {
  props: {
    listType: String // EnrollmentOrder: 报名订单 EnrollmentCollection: 报名收款  ShiftRecord: 换班记录
  },
  components: {
    HeaderFilter: () => import('../../components/HeaderFilter.vue'),
    RMList: () => import('@/components/ReComponents/RMList'),
    ShiftRecordCard: () => import('@/components/ShiftRecordCard')
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
          auditStates: [],
          reason: null,
          endDate: dayjs().format('YYYY/MM/DD'),
          startDate: dayjs().startOf('year').format('YYYY/MM/DD'),
          sortRule: { title: '添加日期', type: 1, column: 'createTime' },
          types: []
        }
      },
      countObj: {}, // 头部统计对象
      isShow: false,
      submitForm: {
        failureReason: null,
        title: ''
      },
      loading: false
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
      updateOrderSingleListApi(id, 3).then(res => {
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

    handleAgree(obj) {
      this.submitForm = {
        ...this.submitForm,
        ...obj,
        failureReason: null
      }
      this.isShow = true

    },


    handleSave() {
      this.$refs.submitForm.validate().then(() => {
        this.loading = true
        setShiftRecordListStatusApi(this.submitForm).then(() => {
          if (this.submitForm.state == 2) {
            Notify({ type: 'success', message: '审核通过!' });
          } else {
            Notify({ type: 'success', message: '审核失败!' });
          }
          this.loading = false
          this.isShow = false
          this.resetSingleList(this.submitForm.id)
        })
      })
    },
    hanleCancel() {
      this.isShow = false
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
      let api = getShiftRecordListApi
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
    },
    handleScroll() {
      getScrollTop().then(height => {
        this.height = height
      })
    },

    handleListQuery(paramProp) {
      this.listQuery.pageinfo.sort = paramProp.sortRule ? [{ ...paramProp.sortRule }] : []
      this.listQuery.param = {
        ...paramProp,
        auditStates: paramProp.auditStates[0] == 25 ? [] : paramProp.auditStates
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

<style lang="scss" scoped>
.van-popup-box {
  padding: 0.5rem;
}
.det-form {
  margin-top: 1rem;
}

.det-form-header {
  font-size: 1rem;
  // position: absolute;
  font-size: bold;
  top: 3rem;
  // left: 0.6rem;
  // padding: 0.2rem;
  margin-top: 3rem;
  box-sizing: border-box;
}

.dept-form-footer {
  width: 38%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  .btn {
    border-radius: 0.5rem;
  }
  margin-top: 1rem;
}
</style>