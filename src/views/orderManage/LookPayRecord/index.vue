<template>
  <!-- 查看支付记录 -->
  <div>
    <LookPayRecordCard v-for="(item, index) in tableList" @onCompelete="handleCompelete" :key="item.id" :index="index" :studentData="item" />
  </div>
</template>

<script>
// 咨询用户
import { getScrollTop } from '@/utils'
import { getPayRecordLiostApi, updateOrderSingleListApi } from '@/api/potentialGuest/order'
import { mapState } from 'vuex'
export default {
  name: 'order-lookPayRecord',
  props: {
    listType: String // EnrollmentOrder: 报名订单 EnrollmentCollection: 报名收款  ShiftRecord: 换班记录
  },
  components: {
    // RMList: () => import('@/components/ReComponents/RMList'),
    LookPayRecordCard: () => import('@/components/LookPayRecordCard'),
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
          endDate: null,
          startDate: null,
          operators: []
        }
      },
      recordId: null
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.common.setting.pageSize,
    })
  },
  activated() {
    console.log('查看支付记录actived中...')
    this.handleScrollInit()
    this.resetSingleList()
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    this.handleInit()
    this.handleScrollInit()
  },
  methods: {
    handleCompelete(id) {
      this.recordId = id
      this.$router.push(`/payRecordEdit/${id}`)
    },
    resetSingleList() {
      if (this.recordId) {
        this.$loading(true, `look`)
        updateOrderSingleListApi(this.recordId, 4).then(res => {
          if (res.data) {
            if (this.tableList.find(v => v.id == res.data.id)) {
              let index = this.tableList.findIndex(v => v.id == res.data.id)
              this.$set(this.tableList, index, res.data)
            }
            this.$loading(false, `look`)
          } else {
            this.$loading(false, `look`)
          }
        })
      }
    },
    handleScrollInit() {
      window.addEventListener('scroll', this.handleScroll)
      window.scrollTo(0, this.height)
    },

    handleInit() {
      this.getTableList('init')
    },

    getTableList() {
      this.$loading(true, `look`)
      const { id } = this.$route.params
      getPayRecordLiostApi(id).then(res => {
        this.tableList = res.data || []
        // for (let i = 0; i < 20; i++) {
        //   this.tableList.push(res.data[0])
        // }
      }).finally(() => {
        this.$loading(false, `look`)
      })
    },
    handleScroll() {
      getScrollTop().then(height => {
        this.height = height
      })
    },

  }
}
</script>
