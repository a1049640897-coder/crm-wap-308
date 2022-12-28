<!-- 编辑支付记录 -->
<template>
  <div class="cousel-record">
    <van-form ref="submitForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
      <RePick v-model="submitForm.paymentType" label="支付类型" :list="payModeList" name="paymentType" isRequrie isCell clearable />
      <van-field type="number" v-model="submitForm.paymentAmount" :rules="[{ required: true,validator: VerifyFunc.validatorMoney, message: '支付金额格式错误' }]" required clear-trigger="always" name="paymentAmount" clearable input-align="right" label="支付金额" placeholder="请输入" />
      <van-field v-model="submitForm.payTime" :class="submitForm.payTime ? 'activity-common-act' : 'activity-common'" label="支付日期" clear-trigger="always" disabled @click="handleShowDate()" required input-align="right" placeholder="请选择" :rules="[{ required: true, message: '请选择' }]" />
      <van-field v-model="submitForm.hour" label="支付时间(小时)(24小时制)" name="hour" clear-trigger="always" required input-align="right" type="number" placeholder="请输入" :rules="[{ required: true, type:0, validator: VerifyFunc.time, message: '支付时间(小时)格式错误,并且填写时间不能大于当前时间' }]" />
      <van-field v-model="submitForm.minute" label="支付时间(分钟)(24小时制)" name="minute" clear-trigger="always" required input-align="right" type="number" placeholder="请输入" :rules="[{ required: true, type:1, hour:submitForm.hour, validator: VerifyFunc.time, message: '支付时间(分钟)格式错误,并且填写时间不能大于当前时间' }]" />
      <van-field clear-trigger="always" v-model="submitForm.remark" name="remark" clearable input-align="right" maxlength="50" label="财务备注" placeholder="请输入" />
    </van-form>
    <!-- 支付日期 -->
    <van-calendar color="#0088FE" v-model="dateIsShow" ref="calendar" :min-date="minDate" :default-date="defaultDate" @confirm="hanldeOnConfirm" />
    <div class="cousel-record-footer">
      <van-button class="record-btn" type="info" @click.stop="handleConfirm" :loading="loading">保存</van-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VerifyFunc from '@/utils/verify'
import dayjs from 'dayjs'
import { getPayRecordDetail, editPayRecord } from '@/api/potentialGuest/order'
import { Notify } from 'vant'
export default {
  name: '',
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
  },
  data() {
    return {
      submitForm: {
        paymentType: null,
        paymentAmount: null,
        payTime: dayjs().format('YYYY/MM/DD'),
        hour: null,
        minute: null,
        remark: null
      },
      VerifyFunc: VerifyFunc,
      dateIsShow: false,
      minDate: new Date('2000/01/01'),
      defaultDate: new Date(),
      loading: false
    }
  },

  computed: {
    ...mapState({
      payModeList: function (state) { return this.id ? state.common.global.payModeList : state.common.global.payModeList.filter(item => !item.extendNum) },
    }),
  },

  created() {
    this.handleInit()
  },


  methods: {
    handleInit() {
      const { id } = this.$route.params
      getPayRecordDetail(id).then(res => {
        this.submitForm = {
          ...res.data || {},
          paymentType: Number(res.data.paymentType),
          payTime: dayjs(res.data.payTime).format('YYYY/MM/DD'),
          hour: Number(dayjs(res.data.payTime).hour()) < 10 ? `0${dayjs(res.data.payTime).hour()}` : dayjs(res.data.payTime).hour(),
          minute: Number(dayjs(res.data.payTime).minute()) < 10 ? `0${dayjs(res.data.payTime).minute()}` : dayjs(res.data.payTime).minute()
        }
      })
    },
    hanldeOnConfirm(val) {
      this.$set(this.submitForm, 'payTime', dayjs(val).format('YYYY/MM/DD'))
      this.dateIsShow = false
    },
    handleShowDate() {
      this.dateIsShow = true
    },
    handleConfirm() {
      this.$refs.submitForm.validate().then(() => {
        this.loading = true
        let newParam = { ...this.submitForm }
        newParam.payTime = `${newParam.payTime} ${newParam.hour}:${newParam.minute}:00`
        editPayRecord(newParam).then(() => {
          Notify({ type: 'success', message: '编辑成功!' })
          this.handleBack()
        }).catch(() => {
          this.loading = false
        })
      }).catch(err => {
        console.log('err', err);
        let hour = err.find(v => 'hour' == v.name)
        let minute = err.find(v => 'minute' == v.name)
        let paymentAmount = err.find(v => 'paymentAmount' == v.name)
        if (paymentAmount) {
          this.$fm(`${paymentAmount.message}`)
          return
        }
        if (hour) {
          this.$fm(`${hour.message}`)
          return
        }
        if (minute) {
          this.$fm(`${minute.message}`)
          return
        }
      })
    },
    handleBack(num = -1) {
      setTimeout(() => {
        this.loading = false
        this.$router.go(num)
      }, 1000);
    }
  }
}

</script>
<style lang='scss' scoped>
@import './index.scss';
</style>