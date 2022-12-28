<template>
  <div class="student-card common-list-contain">
    <div class="student-base">
      <div class="student-header ">
        <div class="SH-l">
          <div class="SH-name">{{studentData.studentName}}</div>
          <div class="SH-tags">
            <div class="SH-tag" v-if="studentData.state" :style="`color:${findOrderStatus(studentData.state,1)};border: 1px solid ${findOrderStatus(studentData.state,1)};`">{{findOrderStatus(studentData.state)}}</div>
            <div class="SH-tag SH-tag-blue" v-if="studentData.verificationState == 0 || studentData.verificationState == 1 ">{{studentData.verificationState == 1 ? '已核销' : '未核销'}}</div>
          </div>
        </div>

      </div>

      <div class="student-info " style="padding-top: 0; padding-bottom: 0;">
        <!-- 1. 联系方式 -->
        <div class="student-info-item">
          <div class="info-item">
            <img src="@/assets/images/icons/mobile.png" alt="" class="info-img">
            <a @click.stop="handlePhone" href="tel: 18856665654">{{studentData.mobile}}</a>
          </div>
        </div>

        <!-- 报名日期和标题 -->
        <div class="student-info-item" v-if="studentData.state !== 7">
          <div class="info-item" v-if="studentData.createTime">
            <img src="@/assets/images/icons/zfx.png" alt="" class="info-img">
            <span>
              <span>{{studentData.createTime}} 报名</span>
            </span>
          </div>
          <span class="info-item-line">|</span>
          <div class="info-item" v-if="studentData.coursePackets">
            <span>
              <span>{{studentData.coursePackets}}</span>
            </span>
          </div>
        </div>

        <!-- 收款信息  -->
        <div class="student-info-item" v-if="studentData.state !== 7">
          <div class="info-item">
            <img src="@/assets/images/icons/money.png" alt="" class="info-img">
            <span>
              <span>应收{{studentData.collectAmount}}</span>
            </span>
          </div>

          <!-- 收款 -->
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span>
              <span>已收{{studentData.receivedAmount}}</span>
            </span>
          </div>

          <!-- 本次收款 -->
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span class="info-item-title-red">
              <span>余款 {{studentData.balance}}</span>
            </span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getTopBranchIdApi } from '@/api/potentialGuest/order'
export default {
  props: {
    sId: Number,
    studentData: {
      required: true,
      default: () => { }
    },
    isCloseBtn: Boolean, // 关闭按钮
    stateList: Array,
  },
  components: {
  },
  data() {
    return {
      isRotate: false,
      showPopover: false,
    }
  },
  filters: {
    schoolFilter(val) {
      if (val) {
        return Object.keys(val).map(item => val[item]).join('/')
      }
      return ''
    }
  },
  activated() {
    if (this.jumoStudentId) {
      this.handleUpdataInfo()
    }
  },
  created() {

  },
  mounted() {
    this.$emit('onStudentCardMounted')
  },
  computed: {
    ...mapState({
      queryList: state => state.order.queryList,
      currentSystemId: state => state.common.systems.currentSystem.id,
    }),
    ...mapGetters(['currentSystemInfo']),
  },
  methods: {
    handleOperatShow(val) {
      console.log('val...', val);
    },
    actions() {
      let arr
      arr = [
        { text: '编辑', dialogName: 'editShow', permission_btn: '', isShow: !(this.studentData.payMode == 1 && !this.studentData.studentData) },
        { text: '查看支付记录', dialogName: 'paymentShow', permission_btn: '', isShow: true },
        { text: '查看电子收据', dialogName: 'receiptShow', permission_btn: '', isShow: true }
      ]
      // arr = arr.filter(item => this.permission_btns.includes(item.permission_btn))
      // if(arr)
      arr = arr.filter(item => item.isShow)
      return arr
    },
    handlePopSelect(e) {
      const { dialogName } = e
      // 编辑收款记录
      if (dialogName === 'editShow') {
        this.$router.push(`/updateCollectionRecord/${this.studentData.omOrderId}/${this.studentData.id}`)
        return
      }

      //  查看支付记录
      if (dialogName === 'paymentShow') {
        this.$router.push(`/lookPayRecord/${this.studentData.id}`)
        return
      }

      // 查看电子收据
      if (dialogName === 'receiptShow') {
        const { omOrderId, branchId, id } = this.studentData
        getTopBranchIdApi(branchId).then(res => {
          this.$router.push(`/electronicReceipt/${omOrderId}/${res.data}/${id}`)
        })
        return
      }

    },
    // type: 1 颜色 0 名称 
    findOrderStatus(id, type) {
      const { text, color } = this.stateList.find(v => v.id == id) || {}
      if (type) {
        return color
      } else {
        return text
      }
    },

    handleRotate() {
      this.isRotate = !this.isRotate
    },

    handlePhone() {
      console.log('拨打电话')
    },

    handleStudentInfo() {
      console.log('查看订单信息中...')
    },


  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>