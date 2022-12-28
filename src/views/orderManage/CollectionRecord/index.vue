<template>
  <div class="cousel-record">
    <van-form ref="recordForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
      <RePick v-if="!collectDetailObj" v-model="listQuery.sysShellId" label="所属部门" :list="departList" :disabled="departList.length === 1" name="sysShellId" idKey="value" titleKey="text" isRequrie isCell clearable />
      <RePick v-if="!collectDetailObj || ( collectDetailObj && collectDetailObj.payment.payMode == 1 && !collectDetailObj.continuedLearningOrder)" v-model="listQuery.operateId" label="经办人" :list="options" isShowSearch name="operateId" isRequrie isCell clearable />
      <van-field label="收据类型" v-if="!collectDetailObj" name="receiptType" input-align="right" required>
        <template #input>
          <van-radio-group v-model="listQuery.receiptType" direction="horizontal">
            <van-radio name="0">电子收据</van-radio>
            <van-radio name="1">纸质收据</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-if="!collectDetailObj" label="缴费类型" name="type" required input-align="right">
        <template #input>
          <van-radio-group v-model="listQuery.type" direction="horizontal">
            <van-radio name="1" v-if="[1].includes(detailObj.state)">预交</van-radio>
            <van-radio name="2" v-if="[1].includes(detailObj.state)">全款</van-radio>
            <van-radio name="3" v-if="![1].includes(detailObj.state)">补交</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field @clear="handleReciptNo" @input="handleReciptNo" v-if="listQuery.receiptType == 1 || (collectDetailObj && collectDetailObj.payment.payMode == 1 && !collectDetailObj.continuedLearningOrder)" :rules="[{ required: true, message: '收据号不能为空', trigger: 'onBlur' }, {  required: receiptNoIsRequire, validator: asyncReceiptNoValidator, message: '收据号格式错误！', trigger: 'onBlur'}]" v-model.trim="listQuery.receiptNo" required clear-trigger="always" name="receiptNo" clearable input-align="right" label="收据号" placeholder="请输入" />
      <div v-if="!collectDetailObj">
        <div class="item-detail" v-for="(item,index) in listQuery.details" :key="index">
          <div class="cousel-record-title">
            <span>支付明细{{index + 1}}</span>
            <span @click.stop="handleDelDetail(index)" :style=" listQuery.details.length  &&  listQuery.details.length == 1 ?  'color:red; opacity: 0.5;' : 'color:red' ">删除</span>
          </div>
          <div class="cousel-record-body">
            <RePick v-model="item.paymentType" label="支付类型" :list="payModeList" name="paymentType" isRequrie isCell clearable />
            <van-field type="number" v-model="item.paymentAmount" @clear="handlePaymentAmountChange" @blur="handlePaymentAmount" :rules="[{ required: true,validator: VerifyFunc.validatorMoney, message: '支付金额格式错误' }]" required clear-trigger="always" name="paymentAmount" clearable input-align="right" label="支付金额" placeholder="请输入" />
            <van-field v-model="item.payTime" :class="item.payTime ? 'activity-common-act' : 'activity-common'" label="支付日期" clear-trigger="always" disabled @click="handleShowDate(index)" required input-align="right" placeholder="请选择" :rules="[{ required: true, message: '请选择' }]" />
            <van-field v-model="item.hour" label="支付时间(小时)(24小时制)" name="hour" clear-trigger="always" required input-align="right" type="number" placeholder="请输入" :rules="[{ required: true, type:0, validator: VerifyFunc.time, message: '支付时间(小时)格式错误,并且填写时间不能大于当前时间' }]" />
            <van-field v-model="item.minute" label="支付时间(分钟)(24小时制)" name="minute" clear-trigger="always" required input-align="right" type="number" placeholder="请输入" :rules="[{ required: true, type:1, hour:item.hour, validator: VerifyFunc.time, message: '支付时间(分钟)格式错误,并且填写时间不能大于当前时间' }]" />
            <van-field clear-trigger="always" v-model="item.remark" name="remark" clearable input-align="right" maxlength="50" label="财务备注" placeholder="请输入" />
          </div>
        </div>
      </div>

      <div class="add-title" v-if="!collectDetailObj">
        <span @click.stop="handleAddDetail">
          <van-icon name="plus" size="0.1rem" /> 增加支付明细
        </span>
      </div>
      <van-field v-model="listQuery.nextCollectedDate" :rules="[{ required: isNextRequire,message: '请选择' }]" :required="isNextRequire" v-if="(listQuery.type!=='2' && nextTimeIsShow) || (listQuery.type=='1' && nextTimeIsShow)" :class="listQuery.nextCollectedDate ? 'activity-common-act' : 'activity-common'" label="下次补款" clear-trigger="always" disabled @click="handleShowNextTime" input-align="right" placeholder="请选择" />
      <RePick v-model="listQuery.tuitionStatus" v-if="tuitionStatusIsShow && !collectDetailObj" label="学费缴纳状态" :list="tuitionStatusList" name="tuitionStatus" :isRequrie="isRequrie" isCell clearable />
      <van-field v-model.trim="listQuery.studentRemark" clear-trigger="always" name="studentRemark" maxlength="50" clearable input-align="right" label="学生备注" placeholder="请输入" />
      <div class="cousel-record-footer">
        <van-button class="record-btn record-btn-danger" style="margin-right: 1rem;" :loading="loading" v-if="collectDetailObj&& collectDetailObj.payment.payMode==1 && !collectDetailObj.continuedLearningOrder" @click="handleDel">删除</van-button>
        <van-button class="record-btn" type="info" @click.stop="handleConfirm" :loading="loading">保存</van-button>
      </div>
    </van-form>

    <!-- 支付日期 -->
    <van-calendar color="#0088FE" v-model="dateIsShow" ref="calendar" :min-date="minDate" :default-date="defaultDate" @confirm="hanldeOnConfirm" />
    <!-- 下次补款 -->
    <van-calendar color="#0088FE" v-model="nextIsShow" ref="calendar" :min-date="nextMinDate" :default-date="nextDefaultDate" @confirm="hanldeOnNextConfirm" />
    <!-- 底部弹窗 -->
    <van-popup v-model="isShow" position="bottom" class="order-van-popup-box" :style="{ height: '25%' }" :close-on-click-overlay="false" @close="hanleCancel" get-container="#app" closeable>
      <div class="form-header">
        温馨提示
      </div>
      <div class="form">
        <div class="form-content">
          {{title}}
        </div>
        <div :class=" collectDetailObj? 'new-form-footer' : 'form-footer'">
          <van-button class="btn" native-type="buttton" @click.stop="isShow =false">{{ collectDetailObj ? '取消' : '返回修改' }}</van-button>
          <van-button class="btn" type="info" native-type="buttton" @click.stop="handleSave" :loading="loading"> {{ collectDetailObj ? '确定' : '金额正确' }}</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { jobShellListApi } from '@/api/potentialGuest/consultation'
import { infoSetApi } from '@/api/common'
import { mapState, mapMutations } from 'vuex'
import dayjs from 'dayjs'
import { deWeightArr, convertCurrency } from '@/utils'
import VerifyFunc from '@/utils/verify'
import {
  getTopBranchIdApi, getDynamicDetailApi, addOrderRecordApi, editCollectDetailApi,
  getOperatorsApi, getOrderDetailApi, getCollectDetailApi, delCollectDetailApi
} from '@/api/potentialGuest/order'
import { Notify } from 'vant'
export default {
  name: 'CounselRecord',
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
  },
  data() {
    return {
      loading: false,
      isExpend: true,
      imgTypeArr: ['image/jpeg', 'image/jpg', 'image/png'],
      isHasUser: false,
      showCalendar: false,
      showGraduateCalendar: false,
      isBelong: false,
      dateLocal: null,
      sId: null,
      eId: null,
      reserveId: null,
      studentInfo: {
        graduationYear: null,
        getExamYearStr: null,
        cityClassList: null,
        attributeId: null,
        schoolValue: null,
        majorValue: null
      },
      departList: [], // 所属部门
      intentionTypeList: [], // 意向类型
      intentionClassList: [], // 意向班型
      consultTypeList: [], // 咨询方式
      listQuery: {
        sysShellId: null,
        operateId: null,
        receiptType: '1',
        type: '1',
        nextCollectedDate: null,
        tuitionStatus: null,
        studentRemark: '',
        payMode: null,
        collectedAmount: 0,
        omOrderId: null,
        collectedDate: dayjs().format('YYYY/MM/DD'),
        details: [{
          paymentType: null,
          paymentAmount: null,
          payTime: dayjs().format('YYYY/MM/DD'),
          hour: '',
          minute: '',
          remark: '',
        }],
      },
      options: [],
      VerifyFunc: VerifyFunc,
      dateIsShow: false,
      minDate: new Date('2000/01/01'),
      defaultDate: new Date(),
      index: 0, // 支付类型日期的数组下标
      timeIsShow: false,
      timeType: 0, // 0 小时 1 分钟
      nextIsShow: false,
      nextTimeIsShow: true, // 下次补款日期选择是否展示
      detailObj: {},  // 订单详情对象
      isNextRequire: false,
      param: {
        sysShellId: 1, // 事业部id
        sysInfoId: this.currentSystemId, // 系统id
        sysType: 1, // 系统类型：1erp，2智能云
        types: [1, 2, 3]
      }, // 字段类型：1学生基本信息，2报名订单信息，3电子收据信息
      isRequrie: false, // 学员缴纳状态是否必填
      tuitionStatusIsShow: false,
      isShow: false,
      title: '',
      collectDetailObj: null, //收款记录详情对象
      nextMinDate: new Date(`${dayjs().add(1, 'day').format('YYYY/MM/DD')}`),
      nextDefaultDate: null,
      receiptNoIsRequire: true
    }
  },
  computed: {
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id,
      highIntention: state => state.common.setting.highIntention,
      roleFlag: state => state.common.user.info.roleFlag,
      graduationList: state => state.consultation.queryList.graduationList,
      allProvicesAndCitys: state => state.common.setting.allProvicesAndCitys,
      schoolTypeList: state => state.common.setting.schoolTypeList,
      examYearText: state => state.common.setting.examYearText,
      isRequireStudent: state => state.common.setting.isRequireStudent,
      isRequireYear: state => state.common.setting.isRequireYear,
      regExps: state => state.order.regExps,
      regExpsFound: state => state.order.regExpsFound,
      payModeList: function (state) {
        return this.id ? state.common.global.payModeList : state.common.global.payModeList.filter(item => !item.extendNum)
        // return state.common.global.payModeList
      },
      tuitionStatusList: state => state.common.global.tuitionStatusList,
      isShowDel() {
        return (!this.isMoneyShow && this.form.id) || this.form.state == 1
      }
    }),
    cnName() {
      let sum = this.listQuery.details.reduce((total, item) => total + item.paymentAmount * 100, 0)
      sum = sum / 100
      return convertCurrency(sum)
    },
  },
  watch: {
    loading(val) {
      this.$loading(val, 'CounselRecord')
    }
  },
  created() {
    this.handleInit()
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  methods: {
    handleReciptNo() {
      this.receiptNoIsRequire = true
    },
    ...mapMutations('order', ['SET_ORDERID']),
    handleDel() {
      this.title = '本次操作同时删除对应的支付记录，且不可恢复，你确定要删除这条收款记录吗?'
      this.isShow = true
    },
    handleSave() {
      // 添加
      if (!this.collectDetailObj) {
        const { sysShellId, operateId, receiptType, type, nextCollectedDate,
          tuitionStatus, studentRemark, payMode, collectedAmount, omOrderId, collectedDate
        } = this.listQuery
        let param = JSON.parse(JSON.stringify(this.listQuery))
        param.payment = {
          sysShellId, operateId, receiptType, type, nextCollectedDate,
          tuitionStatus, studentRemark, payMode, collectedAmount, omOrderId, collectedDate
        }
        param.details.forEach(v => {
          this.$set(v, 'payTime', `${v.payTime} ${v.hour}:${v.minute}:00`)
        });
        this.loading = true
        addOrderRecordApi(param).then(res => {
          // 设置列表返回刷新
          this['SET_ORDERID']({ commonId: this.$route.params.orderId })
          this.isShow = false
          Notify({ type: 'success', message: '添加成功！' })
          this.handleBack()
        }).catch(err => {
          this.loading = false
          console.log('err', err);
        })
      } else {
        // 删除
        const { collectionId } = this.$route.params
        this.loading = true
        delCollectDetailApi(collectionId).then(() => {
          this.isShow = false
          this['SET_ORDERID']({ commonId: collectionId })
          Notify({ type: 'success', message: '删除成功！' })
          this.handleBack()
        }).catch(() => {
          this.loading = false
        })
      }

    },
    hanleCancel() {
      this.isShow = false
    },
    checkIsSuccess(res) {
      if (res && res.data && res.data.tuitionStatus && ((res.data.tuitionStatus.order == 2) || (res.data.tuitionStatus.order == 3))) {
        if (res.data.tuitionStatus.order == 3) {
          this.isRequrie = true
        } else {
          this.isRequrie = false
        }
        return true
      } else {
        return false
      }
    },
    // 授权动态获取中
    initDyColumn(branchId = this.detailObj.branchId) {
      return new Promise((resolve) => {
        this.$loading(true, 'shareOrder')
        getTopBranchIdApi(branchId).then(newRes => {
          let newParam = {
            ...this.param,
            sysShellId: newRes.data,
            sysInfoId: this.currentSystemId
          }

          getDynamicDetailApi(newParam).then(res => {
            resolve(res)
            this.$loading(false, 'shareOrder')
          })
        }).catch(() => {
          this.$loading(false, 'shareOrder')
        })
      })
    },

    handlePaymentAmountChange() {
      this.handlePaymentAmount()
    },

    handlePaymentAmount() {
      if (this.listQuery.type !== '1') {
        let sum = (this.listQuery.details.reduce((total, item) => total + item.paymentAmount * 100, 0)) / 100
        if (sum < this.detailObj.balance) {
          this.nextTimeIsShow = true
        } else {
          this.nextTimeIsShow = false
        }
      }
    },
    hanldeOnNextConfirm(val) {
      this.listQuery.nextCollectedDate = dayjs(val).format('YYYY/MM/DD')
      this.nextIsShow = false
    },
    handleShowNextTime() {
      this.nextDefaultDate = new Date(`${dayjs(this.listQuery.nextCollectedDate).format('YYYY/MM/DD')}`)
      this.nextIsShow = true
    },
    handleTimeCancel() {
      this.timeIsShow = false
    },
    handleCommonShow(index, type) {
      this.index = index
      this.timeType = type
      this.timeIsShow = true
    },
    hanldeOnConfirm(val) {
      this.$set(this.listQuery.details[this.index], 'payTime', dayjs(val).format('YYYY/MM/DD'))
      this.dateIsShow = false
    },
    handleShowDate(index) {
      this.index = index
      this.dateIsShow = true
    },
    asyncReceiptNoValidator(val, rule) {
      return new Promise(resolve => {
        const { required } = rule
        if (required) {
          let pattern = val && val.replace(/\D/g, '').length === 9 ? this.regExpsFound[this.currentSystemId] : this.regExps[this.currentSystemId]
          if (val && pattern.test(val)) {
            resolve(true)
          } else {
            return resolve(false)
          }
        } else {
          resolve(true)
        }
      })
    },
    handleDelDetail(index) {
      if (this.listQuery.details.length > 1) {
        this.listQuery.details.splice(index, 1)
      }
    },
    handleAddDetail() {
      this.listQuery.details.push({
        paymentType: null,
        paymentAmount: null,
        payTime: dayjs().format('YYYY/MM/DD'),
        hour: '',
        minute: '',
        remark: '',
      })
    },
    handleInit() {
      // payMode  1 线下 2 线上
      // collectionId  null ：编辑收款记录 其他 添加收记录
      const { collectionId } = this.$route.params
      if (collectionId !== 'null') {
        this.handleGetOrderDetail().then(() => {
          this.handleGetCollectDetail(collectionId)
          this.handleInitNextIsRequired()
          this.handleInitOp()
        })
      } else {
        this.handleGetOrderDetail().then(() => {
          this.listQuery.type = this.detailObj.state == 1 ? '2' : '3'
          this.listQuery.payMode = this.detailObj.payMode == 3 ? 1 : this.detailObj.payMode
          this.listQuery.omOrderId = this.detailObj.id
          this.handleInitDept()
          this.handleInitOp()
          this.handleInitNextIsRequired()
          this.handleInitTurtis()
        })
      }

    },

    // 获取报名收款列表详情
    handleGetCollectDetail(collectionId) {
      getCollectDetailApi(collectionId).then(res => {
        this.collectDetailObj = res.data || {}
        const { sysShellId, operateId, receiptType, type, nextCollectedDate,
          tuitionStatus, studentRemark, payMode, collectedAmount, omOrderId, collectedDate, receiptNo } = res.data.payment || {}
        this.listQuery = {
          ...res.data,
          sysShellId, operateId, receiptType, type, nextCollectedDate,
          tuitionStatus, studentRemark, payMode, collectedAmount, omOrderId, collectedDate,
          receiptNo
        }
        this.receiptNoIsRequire = false
        // 判断下次收款是否显示
        this.handlePaymentAmount()
      })
      // return new Promise(resolve => {

      // })
    },

    // 下次补款是否必填
    handleInitNextIsRequired() {
      infoSetApi('NECESSARY_TO_FILL_IN_THE_NEXT_PAYMENT').then(res => {
        const { value } = res.data || {}
        this.isNextRequire = value == 1 ? true : false
      })
    },

    handleInitTurtis() {
      this.initDyColumn().then(res => {
        if (this.checkIsSuccess(res)) {
          this.tuitionStatusIsShow = true
        } else {
          this.tuitionStatusIsShow = false
        }
      })
    },

    handleGetOrderDetail() {
      const { orderId } = this.$route.params
      return new Promise(resolve => {
        getOrderDetailApi(orderId).then(res => {
          this.detailObj = res.data || {}
          resolve(res)
        })
      })
    },


    // 初始化获取所属部门
    async handleInitDept() {
      // 读取本地缓存信息
      let userId
      const localData = JSON.parse(localStorage.getItem('userInfo'))
      typeof localData === 'object' && (userId = localData.userId)
      // 请求参数
      const { data, status } = await jobShellListApi(this.detailObj.branchId, userId)
      if (status == 200) {
        this.departList = data || []
        if (this.departList.length == 1) {
          this.listQuery.sysShellId = this.departList[0].value
        }
      } else {
        this.departList = []
      }
    },

    // 初始化经办人
    handleInitOp() {
      getOperatorsApi({ shellId: this.detailObj.branchId }).then(res => {
        this.options = deWeightArr(res.data)
        // 默认选中当前经办人
        const data = JSON.parse(localStorage.getItem('userInfo'))
        typeof data === 'object' && (this.$set(this.listQuery, 'operateId', data.userId))
      })
    },


    handleDateConfirm(e) {
      this.showCalendar = false
      this.listQuery.nextConsultTime = dayjs(e).format('YYYY/MM/DD')
    },

    // 比较本次收款和订单余款的大小
    checkNum() {
      let sum = (this.listQuery.details.reduce((total, item) => total + item.paymentAmount * 100, 0)) / 100
      if (sum < this.detailObj.balance || sum == this.detailObj.balance) {
        this.title = `本次收款共计${this.cnName}元，请确认本次收款金额正确`
      } else {
        this.title = `系统检测到您填写的本次收款＞余款，保存成功后订单状态为“需退款”，需申请退款，请确认本次收款金额正确`
      }
      this.isShow = true
    },

    handleConfirm() {
      this.$refs.recordForm.validate().then(() => {
        const { collectionId } = this.$route.params
        // 编辑收款记录
        if (collectionId !== 'null') {
          const { id, payment, details } = JSON.parse(JSON.stringify(this.listQuery))
          payment.nextCollectedDate = this.listQuery.nextCollectedDate
          payment.studentRemark = this.listQuery.studentRemark
          payment.receiptNo = this.listQuery.receiptNo
          payment.operateId = this.listQuery.operateId
          payment.receiptType = 1
          let newParam = {
            id,
            payment,
            details
          }
          this.loading = true
          // newParam.payment.receiptType = 1
          editCollectDetailApi(newParam).then(res => {
            // 设置列表返回刷新
            this['SET_ORDERID']({ commonId: collectionId })
            Notify({ type: 'success', message: '编辑成功！' })
            this.handleBack()
          }).catch(() => {
            this.loading = false
          })
        } else {
          // 添加收款记录
          let sum = (this.listQuery.details.reduce((total, item) => total + item.paymentAmount * 100, 0)) / 100
          this.listQuery.collectedAmount = sum
          // if(sum)
          if (this.listQuery.type == 1) {
            if (sum > this.detailObj.orderAmount) {
              Notify({ type: 'warning', message: '您填写的实际收款金额大于订单金额，请重新输入' })
            } else {
              this.checkNum()
            }
          } else {
            this.checkNum()
          }
        }
      }).catch((err) => {
        let receiptNo = err.find(v => 'receiptNo' == v.name)
        let hour = err.find(v => 'hour' == v.name)
        let minute = err.find(v => 'minute' == v.name)
        let paymentAmount = err.find(v => 'paymentAmount' == v.name)
        if (paymentAmount) {
          this.$fm(`${paymentAmount.message}`)
          return
        }
        if (receiptNo) {
          this.$fm(`${receiptNo.message}`)
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

<style lang="scss" scoped>
@import './index.scss';
</style>
