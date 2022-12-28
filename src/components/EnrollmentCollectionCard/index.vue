<template>
  <div class="student-card common-list-contain">
    <div class="student-base">
      <div class="student-header " @click="handleStudentInfo">
        <div class="SH-l">
          <div class="SH-name">{{studentData.realName}}</div>
          <div class="SH-tags">
            <div class="SH-tag SH-tag-green" v-if="findOrderStatus(studentData.type)">{{findOrderStatus(studentData.type)}}</div>
            <div class="SH-tag SH-tag-blue" v-if="studentData.verificationState == 0 || studentData.verificationState == 1 ">{{studentData.verificationState == 1 ? '已核销' : '未核销'}}</div>
          </div>
        </div>
        <div class="SH-r">
          <div class="SH-r-icon" v-if="listType == 3">
            <img class="SH-r-icon" src="@/assets/images/icons/recordEdit.png" alt="" @click="handleEdit">
          </div>
          <div class="SH-r-none" @click.stop="handleOperatShow" v-else>
            <van-popover v-model="showPopover" @select="handlePopSelect" class="demo" trigger="click" :actions="actions(studentData)" placement="bottom-end" :offset="[9,8]">
              <template #reference>
                <span>...</span>
              </template>
            </van-popover>
          </div>
        </div>
      </div>

      <div class="student-info " style="padding-top: 0; padding-bottom: 0;" @click="handleStudentInfo">
        <!-- 1. 联系方式 -->
        <div class="student-info-item">
          <div class="info-item" v-if="studentData.mobile">
            <img src="@/assets/images/icons/mobile.png" alt="" class="info-img">
            <a @click.stop="handlePhone" href="tel: 18856665654">{{studentData.mobile}}</a>
          </div>
          <span class="info-item-line" v-if="studentData.qq">|</span>
          <div class="info-item" v-if="studentData.qq">
            <img src="@/assets/images/icons/qq.png" alt="" class="info-img">
            <span>{{studentData.qq}}</span>
          </div>
          <span class="info-item-line" v-if="studentData.weChat">|</span>
          <div class="info-item" v-if="studentData.weChat">
            <img src="@/assets/images/icons/wechat.png" alt="" class="info-img">
            <span>{{studentData.weChat}}</span>
          </div>
        </div>

        <!-- 报名日期和标题 -->
        <div class="student-info-item">
          <div class="info-item" v-if="studentData.createDate">
            <img src="@/assets/images/icons/zfx.png" alt="" class="info-img">
            <span>
              <span>{{studentData.createDate}} 报名</span>
            </span>
          </div>
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span>
              <span>{{studentData.coursePackets}}</span>
            </span>
          </div>
        </div>

        <!-- 收款信息  -->
        <div class="student-info-item">
          <div class="info-item" v-if="studentData.collectedDate">
            <img src="@/assets/images/icons/money.png" alt="" class="info-img">
            <span>
              <span>{{studentData.collectedDate}} 收款</span>
            </span>
          </div>

          <!-- 收款 -->
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span>
              <span>{{studentData.orderNo}}</span>
            </span>
          </div>

          <!-- 本次收款 -->
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span class="info-item-title-bule">
              <span>本次收款 {{studentData.collectedAmount}}</span>
            </span>
          </div>
        </div>
        <!-- 所属分校和市场区域 -->

        <div class="student-info-item">
          <div class="info-item">
            <span>
              <span class="gray-title-color mt-small">所属分校:</span>{{studentData.shellName}}
            </span>
          </div>
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span class="gray-title-color mt-small">市场区域:</span>{{studentData.crmMarketAreaTitle}}
          </div>
        </div>

        <!-- 业绩区域, 经办人, 所属人 -->
        <div class="student-info-item">
          <div class="info-item">
            <span>
              <span class="gray-title-color mt-small">业绩区域:</span>{{studentData.orderArea}}
            </span>
          </div>
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span class="gray-title-color mt-small">经办人:</span>{{studentData.operateName}}
          </div>
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span class="gray-title-color mt-small">所属人:</span>{{studentData.owners}}
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
    listType: String // 
  },
  components: {
  },
  data() {
    return {
      isRotate: false,
      showPopover: false,
      stateList: [
        {
          id: 1,
          title: ''
        }
      ]
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
      console.log('dialogName..',);
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
    findOrderStatus(id) {
      const { text } = this.queryList.types.find(v => v.value == id) || {}
      return text
    },

    // type: 1 颜色 0 名称 
    findServiceStatus(id, type) {
      const { text, color } = this.queryList.serviceStateList.find(v => v.id == id) || {}
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