<template>
  <div class="student-card common-list-contain">
    <div class="student-base">
      <div class="student-header" @click="handleStudentInfo">
        <div class="SH-l">
          <div class="SH-name">{{studentData.name }}</div>
          <div class="info-item" v-if="studentData.mobile">
            <img src="@/assets/images/icons/mobile.png" alt="" class="info-img">
            <a @click.stop="handlePhone" href="tel: 18856665654">{{studentData.mobile}}</a>
          </div>
        </div>
      </div>

      <!-- 原课程包/课程包  -->
      <div class="course-title">
        {{ studentData.productNames | titleFilter  }}
        <span>换</span> {{ studentData.newProductNames | titleFilter  }}
      </div>

      <div class="student-info " style="padding-top: 0; padding-bottom: 0;" @click="handleStudentInfo">

        <!-- 课程包类型、换班价差 -->
        <div class="student-info-item">
          <div class="info-item">
            <span>
              <span class="gray-title-color mt-small">{{studentData.type == 1 ? '换课程' : '换课程包'}}</span>
            </span>
          </div>
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span class="gray-title-color mt-small">换班差价:</span> <span :style="checkPrice(studentData.price)">{{filterPrice(studentData.price)}}</span>
          </div>
        </div>

        <!-- 换班说明 -->
        <div class="student-info-item">
          <div class="info-item">
            <span>
              <span class="gray-title-color mt-small">换班说明:</span>{{studentData.remark}}
            </span>
          </div>
        </div>

        <!-- 拒绝理由 -->
        <div class="student-info-item" v-if="studentData.state == 3">
          <div class="info-item">
            <span>
              <span class="red-title-color mt-small">拒绝理由:</span>{{studentData.failureReason}}
            </span>
          </div>
        </div>

        <!-- 申请 -->
        <div class="student-info-item">
          <div class="info-item">
            <span class="gray-title-color mt-small">
              <span>申请:</span> <span class="mt-x-small">{{studentData.creatorName}}</span> <span>{{studentData.createTime}}</span>
            </span>
            <span class="info-item-line" v-if="studentData.examinerName || studentData.examineTime">|</span>
            <span class="gray-title-color mt-small" v-if="studentData.examinerName || studentData.examineTime">
              <span>审核:</span> <span class="mt-x-small">{{studentData.examinerName}}</span> <span>{{studentData.examineTime}}</span>
            </span>
          </div>
        </div>

        <!-- 所属分校 -->
        <div class="student-info-item">
          <div class="info-item">
            <span>
              <span class="gray-title-color mt-small">所属分校:</span>{{studentData.sysShellName}}
            </span>
          </div>
        </div>

        <div class="btn-box" v-if="studentData.state == 1">
          <div class="btn-lf cm-btn" @click.stop="handleAgree(studentData.id,studentData.state)">
            <img src="@/assets/images/icons/agree.png" alt="" class="info-img"> 同意
          </div>
          <div class="btn-rt cm-btn" @click.stop="handleDisAgree(studentData.id,studentData.state)">
            <img src="@/assets/images/icons/disagree.png" alt="" class="info-img"> 拒绝
          </div>
        </div>
        <div class="round-flag-box">
          <img src="@/assets/images/icons/2.png" v-if="studentData.state == 1" alt="">
          <img src="@/assets/images/icons/6.png" v-if="studentData.state == 2" alt="">
          <img src="@/assets/images/icons/5.png" v-if="studentData.state == 3" alt="">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Dialog } from 'vant'
import { setShiftRecordListStatusApi } from '@/api/potentialGuest/order'

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
          title: '待审核',
        },
        {
          id: 2,
          title: '已通过',
        },
        {
          id: 3,
          title: '已拒绝',
        }
      ],
    }
  },
  filters: {

    titleFilter(val) {
      if (val) {
        if (val.indexOf('、') > -1) {
          return val.split('、').join('/')
        } else {
          return val
        }
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
    handleAgree(id, state) {
      const { title } = this.stateList.find((v) => v.id == state) || {}
      let obj = {
        id,
        state: 2,
        title: `该课程处于“${title}”状态，同意换班后，无法享受原课程服务，你确定要同意换班吗？`
      }
      this.$emit('onAgree', obj)
    },
    handleDisAgree(id, state) {
      const { title } = this.stateList.find((v) => v.id == state) || {}
      let obj = {
        id,
        state: 3,
        title: `该课程处于“${title}”状态，拒绝换班后，无法享受新课程服务，你确定要拒绝吗？`
      }
      this.$emit('onAgree', obj)
    },
    checkPrice(val) {
      if (val == 0) {
        return 'color:#333'
      } else {
        if (val > 0) {
          return 'color:red'
        } else {
          return 'color:#67C23A'
        }
      }
    },

    filterPrice(val) {
      if (val > 0) {
        return `+${val}`
      } else {
        return val
      }
    },
    actions() {
      let arr
      arr = [
        { text: '编辑', dialogName: 'editShow', permission_btn: '' },
        { text: '查看支付记录', dialogName: 'paymentShow', permission_btn: '' },
        { text: '查看电子收据', dialogName: 'receiptShow', permission_btn: '' }
      ]
      // arr = arr.filter(item => this.permission_btns.includes(item.permission_btn))
      return arr
    },
    handlePopSelect(e) {

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