<!-- 修改学员学费缴纳弹窗 -->
<template>
  <div class="update-student-toast">
    <van-popup v-model="isShow" position="bottom" class="van-popup-box" :style="{ height: '34%' }" :close-on-click-overlay="false" @close="hanleCancel" get-container="#app" closeable>
      <div class="form-top-title">
        修改学费缴纳状态
      </div>
      <div class="form-header">
        <span>分享订单,意味着需学生付款</span>
        <br>
        可提前按和学生商量好的本次收款修改学费缴纳状态
      </div>
      <div class="form">
        <van-form ref="submitForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
          <RePick v-model="submitForm.tuitionStatus" label="学费缴纳状态" name="target" :list="tuitionStatusList" :isRequrie="isRequrie" isCell clearable />
        </van-form>
        <div class="form-footer">
          <van-button class="btn" native-type="buttton" @click.stop="hanleCancel">取消</van-button>
          <van-button class="btn" type="info" native-type="buttton" @click.stop="handleSave" :loading="loading">确定</van-button>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { changeStuPaymentStateApi, changeStuPaymentCourStateApi } from '@/api/potentialGuest/order'
export default {
  props: {
    isOpen: Boolean,
    tuitionStatusId: Number,
    isRequrie: Boolean,
    typeFlag: {
      type: String,
      default: 'order' // order 订单 course 课程包
    },
    orderId: Number
  },
  name: '',
  watch: {
    isOpen: {
      handler(val) {
        if (val) {
          if (this.tuitionStatusId) {
            this.submitForm.tuitionStatus = this.tuitionStatusId
          } else {
            this.submitForm.tuitionStatus = null
          }
        }
        this.isShow = val
      },
      deep: true
    }
  },
  data() {
    return {
      submitForm: {
        tuitionStatus: null,
      },
      loading: false,
      isShow: false
    }
  },
  computed: {
    ...mapState({
      tuitionStatusList: state => state.common.global.tuitionStatusList,
    }),
  },
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
  },
  methods: {
    hanleCancel() {
      this.$emit('onCompelete', 0)
    },
    handleSave() {
      this.$refs.submitForm.validate().then(() => {
        this.$loading(true, 'tuitionStatusShow')
        if (this.typeFlag === 'order') {
          changeStuPaymentStateApi(this.orderId, this.submitForm.tuitionStatus).then(() => {
            this.$emit('onCompelete', 1)
            this.$loading(false, 'tuitionStatusShow')
          }).catch(() => {
            this.$emit('onCompelete', 0)
            this.$loading(false, 'tuitionStatusShow')
          })
        } else {
          changeStuPaymentCourStateApi(this.orderId, this.submitForm.tuitionStatus).then(() => {
            this.$emit('onCompelete', 1)
            this.$loading(false, 'tuitionStatusShow')
          }).catch(() => {
            this.$emit('onCompelete', 0)
            this.$loading(false, 'tuitionStatusShow')
          })
        }
      })
    }
  }
}

</script>
<style lang='scss' scoped>
@import './index.scss';
</style>