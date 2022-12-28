<template>
  <div class="student-card common-list-contain">
    <div class="student-base">
      <div class="student-header common-list-contain" @click="handleStudentInfo">
        <div class="SH-l">
          <div class="SH-name">{{studentData.name}}</div>
          <div class="SH-tags">
            <div class="SH-tag" v-if="studentData.state" :style="`color:${findOrderStatus(studentData.state,1)};border: 1px solid ${findOrderStatus(studentData.state,1)};`">{{findOrderStatus(studentData.state)}}</div>
            <div class="SH-tag SH-tag-blue" v-if="studentData.perfect == 0 || studentData.perfect == 1 ">{{studentData.perfect == 1 ? '已完善' : '未完善'}}</div>
            <div class="SH-tag" v-if="studentData.isServe" :style="`color:${findServiceStatus(studentData.isServe,1)};border: 1px solid ${findServiceStatus(studentData.isServe,1)};`">{{findServiceStatus(studentData.isServe)}}</div>
            <div class="SH-tag SH-tag-blue" v-if="studentData.onlineCourse == 0 || studentData.onlineCourse == 1">{{studentData.onlineCourse}}</div>
          </div>
        </div>
        <div class="SH-r">
          <div class="SH-r-icon" @click.stop="handleRotate">
            <img class="SH-r-icon" :class="{'IconRotate': isRotate}" src="@/assets/images/icons/expend.png" alt="">
          </div>
        </div>
      </div>

      <div class="student-info common-list-contain" style="padding-top: 0; padding-bottom: 0;" @click="handleStudentInfo">
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

        <!-- 2. 考试时间，报名时间 -->
        <div class="student-info-item">
          <div class="info-item" v-if="studentData.enrollDate">
            <img src="@/assets/images/icons/gwb.png" alt="" class="info-img">
            <span>
              <span>{{studentData.enrollDate}}报名</span>
            </span>
          </div>
          <span class="info-item-line" v-if="studentData.enrollDate && studentData.examYear">|</span>
          <div class="info-item" v-if="studentData.examYear">
            <img src="@/assets/images/icons/examYear.png" alt="" class="info-img">
            <span>{{studentData.examYear}}{{studentData.examMonth ? '/' :''}}{{studentData.examMonth}}考试</span>
          </div>
        </div>

        <!-- 报名课程包 -->
        <div class="student-info-item" v-if="studentData.coursePackets">
          <div class="info-item">
            <img src="@/assets/images/icons/zfx.png" alt="" class="info-img">
            <span>
              <span>{{studentData.coursePackets}}</span>
            </span>
          </div>
        </div>

        <!-- 应收,已收，余款, 下次补款 -->
        <div class="student-info-item">
          <div class="info-item" v-if="studentData.collectAmount">
            <img src="@/assets/images/icons/graduateYear.png" alt="" class="info-img">
            <span>
              <span>应收{{studentData.collectAmount}}</span>
            </span>
          </div>
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span>
              <span>已收{{studentData.receivedAmount}}</span>
            </span>
          </div>
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span>
              <span class="red-title-color">余款{{studentData.balance}}</span>
            </span>
          </div>
          <span class="info-item-line">|</span>
          <div class="info-item">
            <span>
              <span class="blue-title-color">下次补款{{studentData.nextCollectDate}}</span>
            </span>
          </div>
        </div>

        <!-- 4 就读学校 -->
        <div class="student-info-item" v-if="studentData.commonSchoolInfo">
          <div class="info-item">
            <img src="@/assets/images/icons/school.png" alt="" class="info-img">
            <span>就读学校：{{studentData.commonSchoolInfo | schoolFilter}}</span>
          </div>
        </div>

        <!-- 5 报考学校/报考科目 -->
        <div class="student-info-item">
          <div class="info-item" v-if="studentData.enrollSubjectTitle ||studentData.otherSchoolInfo ">
            <img src="@/assets/images/icons/exMore.png" alt="" class="info-img">
            <span v-if="currentSystemInfo[5] || [3,22,66,76,77,49,68,70,97].includes(currentSystemId)">
              <span v-if="studentData.enrollSubjectTitle">
                <span>报考科目</span>
                <span>{{studentData.enrollSubjectTitle}}</span>
              </span>
            </span>
            <span v-else>
              <span v-if="studentData.otherSchoolInfo">
                <span>报考学校</span>
                <span>{{studentData.otherSchoolInfo | schoolFilter}}</span>
              </span>
            </span>
          </div>
        </div>

        <div class="student-more" v-if="isRotate">
          <div class="student-line">
            <div class="line-square"></div>
          </div>
          <!-- 所属分校，市场区域 -->
          <div class="student-info-item" v-if="studentData.shellName || studentData.crmMarketAreaTitle">
            <div class="info-item" v-if="studentData.shellName">
              <span>
                <span class="gray-title-color mt-small">所属分校:</span>{{studentData.shellName}}
              </span>
            </div>
            <!-- <span class="info-item-line" v-if="studentData.crmMarketAreaTitle">|</span> -->
            <div class="info-item">
              <span class="gray-title-color mt-small">市场区域:</span>{{studentData.crmMarketAreaTitle}}
            </div>
          </div>

          <!-- 业绩区域， 学员服务区域 -->
          <div class="student-info-item" v-if="studentData.orderArea || studentData.serviceArea">
            <div class="info-item" v-if="studentData.orderArea">
              <span>
                <span class="gray-title-color mt-small">业绩区域:</span>{{studentData.orderArea}}
              </span>
            </div>
            <span class="info-item-line" v-if="studentData.serviceArea">|</span>
            <div class="info-item" v-if="studentData.serviceArea">
              <span class="gray-title-color mt-small">学员服务区域:</span>{{studentData.serviceArea}}
            </div>
          </div>

          <!-- 所属人,教务-->
          <div class="student-info-item" v-if="studentData.owners ||studentData.educationalName ">
            <div class="info-item">
              <span>
                <span class="blue-title-color">所属人：</span>
                <span>{{studentData.owners}}</span>
              </span>
            </div>
            <span class="info-item-line" v-if="studentData.educationalName">|</span>
            <div class="info-item">
              <span>
                <span class="blue-title-color">教务：</span>
                <span>{{studentData.educationalName}}</span>
              </span>
            </div>
          </div>

        </div>

      </div>

      <div>
        <div class="student-btns">
          <van-button class="student-btn-item" @click="handleShareOrder(1)">
            <img src="@/assets/images/icons/share.png" alt="">
            <span>分享订单</span>
          </van-button>
          <van-button class="student-btn-item" @click="handleAddOrderRecord" v-if="studentData.payMode == 3 && [1,2,3,6].includes(studentData.state)">
            <img src="@/assets/images/icons/addOrder.png" alt="">
            <span>添加收款记录</span>
          </van-button>
          <van-button class="student-btn-item" v-if="actions.length">
            <van-popover v-model="showPopover" @select="handlePopSelect" trigger="click" :actions="actions" placement="bottom-end">
              <template #reference>
                <van-button class="student-btn-item">
                  <img src="@/assets/images/icons/btn_moe.png" alt="">
                  <span>更多</span>
                </van-button>
              </template>
            </van-popover>
          </van-button>
        </div>
      </div>
    </div>
    <!-- 分享订单 -->
    <ShareCode :isOpen="shareCodeIsOpen" :counselTab="'order'" ref="shareCode" :sId="studentData.id" @close="handleClose" />

    <!-- 分享订单提示 -->
    <van-popup v-model="isShow" position="bottom" class="order-van-popup-box" :style="{ height: '23%' }" :close-on-click-overlay="false" @close="hanleCancel" get-container="#app" closeable>
      <div class="form-header">
        温馨提示
      </div>
      <div class="form">
        <div class="form-content">
          当前收款负责人是"{{studentData.sharePerson || studentData.creatorName}}", 点击分享订单会将收款负责人更新成你,你确定要分享订单吗?
        </div>
        <div class="form-footer">
          <van-button class="btn" native-type="buttton" @click.stop="isShow =false">取消</van-button>
          <van-button class="btn" type="info" native-type="buttton" @click.stop="handleSave" :loading="loading">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 修改学员缴纳状态 -->
    <ShareTouristToastTips :isOpen="isOpen" @onCompelete="handleCompelete" :orderId="studentData.id" :isRequrie="isRequrie" :tuitionStatusId="studentData.tuitionStatusId" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { patchIsShareWindowApi, patchSharePersonApi, getTopBranchIdApi, getDynamicDetailApi } from '@/api/potentialGuest/order'
import { Notify } from 'vant'

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
    // ShareTouristToastTips
    ShareCode: () => import('@/components/ShareCode'),
    ShareTouristToastTips: () => import('@/components/ShareTouristToastTips')

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
      ],
      shareCodeIsOpen: false,
      isShow: false,
      loading: false,
      param: {
        sysShellId: 1, // 事业部id
        sysInfoId: this.currentSystemId, // 系统id
        sysType: 1, // 系统类型：1erp，2智能云
        types: [1, 2, 3]
      }, // 字段类型：1学生基本信息，2报名订单信息，3电子收据信息
      isOpen: false,
      isRequrie: false
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
      currentSystemId: state => state.common.systems.currentSystem.id,
      queryList: state => state.order.queryList
    }),
    ...mapGetters(['currentSystemInfo']),
    actions() {
      let arr = [
        { text: '预约咨询', dialogName: 'isConsultSubscribeShow' },
        { text: '分配咨询', dialogName: 'isConsultDistributeShow' },
        { text: '修改市场区域', dialogName: 'isConsultMarketAreaShow' },
        { text: '移交', dialogName: 'isConsultHandOverShow' },
        { text: '转交', dialogName: 'isConsultDeliverShow' },
        { text: '放入公海', dialogName: 'isConsultSeaShow' },
        { text: '新增订单', dialogName: '' }
      ]
      if (this.listType === '4') {
        return arr.slice(1)
      } else if (this.listType === '5') {
        return [{ text: '编辑', dialogName: 'editStudent' }, { text: '添加咨询记录', dialogName: 'addCounselRecord' }].concat(arr.slice(2))
      }
      return arr
    }
  },
  methods: {

    // 添加收款记录
    handleAddOrderRecord() {
      this.$router.push(`/updateCollectionRecord/${this.studentData.id}/null`)
    },
    // 0 是取消 1 是确定
    handleCompelete(type) {
      this.isOpen = false
      if (type) {
        this.shareCodeIsOpen = true
        this.$emit('onCompelete', this.studentData.id)
      }
    },

    // 授权动态获取中
    initDyColumn(branchId = this.studentData.branchId) {
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

    async handleSave() {
      this.loading = true
      const isShareShow = patchSharePersonApi(this.studentData.id).then(res => { return res.data === 1 })
      if (isShareShow) {
        this.loading = false
        this.isShow = false
        this.shareCodeIsOpen = true
      } else {
        Notify({ type: 'warning', message: '更新收款负责人失败' })
        this.loading = false
      }
    },
    hanleCancel() {
      this.isShow = false
      this.loading = false
    },
    handleClose() {
      this.shareCodeIsOpen = false
    },
    // type : 0 请求原来的接口 1 判断修改学费缴纳状态参数
    handleShareOrder(type) {
      if (type) {
        this.initDyColumn().then((res) => {
          if (this.checkIsSuccess(res)) {
            this.isOpen = true
          } else {
            this.handleShareOrder()
          }
        })
      } else {
        this.handleCheckRequest()
      }
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

    async handleCheckRequest() {
      this.$loading(true, 'shareOrder')
      const isConfirmShow = await patchIsShareWindowApi(this.studentData.id).then(res => { return res.data })
      if (isConfirmShow) {
        this.shareCodeIsOpen = true
      } else {
        this.isShow = true
      }
      this.$loading(false, 'shareOrder')
    },
    handlePopSelect(e) {

    },
    // type: 1 颜色 0 名称 
    findOrderStatus(id, type) {
      const { text, color } = this.queryList.stateList.find(v => v.id == id) || {}
      if (type) {
        return color
      } else {
        return text
      }
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