<template>
  <div class="home-tab-view">
    <van-tabs v-model="counselTab" title-inactive-color='#999999' title-active-color='#333333' color='#333333' lazy-render>
      <van-tab title="报名订单" name="EnrollmentOrder">
        <EnrollmentOrder ref="EnrollmentOrder" />
      </van-tab>
      <van-tab title="报名收款" name="EnrollmentCollection">
        <EnrollmentCollection ref="EnrollmentCollection" />
      </van-tab>
      <van-tab title="换班记录" name="ShiftRecord">
        <ShiftRecord ref="ShiftRecord" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'home-consultation',
  components: {
    EnrollmentOrder: () => import('./EnrollmentOrder'), // 报名订单
    EnrollmentCollection: () => import('./EnrollmentCollection'), // 报名收款
    ShiftRecord: () => import('./ShiftRecord'), // 换班记录
  },
  data() {
    return {
      counselTab: 'EnrollmentOrder' // 先默认选中, 后期订单列表处理好了以后在处理
    }
  },
  created() {
    this.handleInit()
  },
  activated() {
    this.handleTabInit()
    this.handleResetList()
  },
  computed: {
    ...mapState({
      commonId: state => state.order.commonId
    })
  },
  methods: {
    ...mapActions('order', ['queryListOrder']),
    ...mapActions('common/global', ['setTourtionList', 'setPayModeList']),
    ...mapMutations('order', ['SET_ORDERID']),
    handleInit() {
      this.queryListOrder()
      this.setTourtionList()
      this.setPayModeList()
    },
    handleTabInit() {
      let tab = this.$route.params.tab
      if (tab) {
        console.log('初始化中...', tab);
        // this.counselTab = Number(tab)
        // this.$nextTick(() => {
        //   window.scrollTo(0, 0)
        // })
      }
    },
    handleResetList() {
      this.$nextTick(() => {
        let ref = this.counselTab == 'EnrollmentOrder' ? this.$refs.EnrollmentOrder : this.counselTab == 'EnrollmentCollection' ? this.$refs.EnrollmentCollection : this.$refs.ShiftRecord
        if (this.commonId) {
          ref.$refs.userList && ref.$refs.userList.resetSingleList(this.commonId)
          // this['SET_ORDERID']({ commonId: null })
        }
      })
    }
  }
}
</script>
