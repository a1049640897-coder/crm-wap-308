<template>
  <div class="student-card common-list-contain" @click="handleCourseDetail">
    <div class="student-base">
      <div class="student-header">
        <div class="SH-l">
          <span class="SH-tag" :class=" studentData.state == 1 ? 'SH-tag-blue' : 'SH-tag-gray'" v-if="[0,1].includes(studentData.state)">{{studentData.state == 1 ? '生效中' : '已取消' }}</span>
          <span class="SH-name">{{ studentData.orderPackets | joinTitle }}</span>
        </div>
        <div class="SH-r">
          <div class="SH-r-none" @click.stop="handleOperatShow">
            <van-popover v-model="showPopover" @select="handlePopSelect" class="demo" trigger="click" :actions="actions(studentData)" placement="bottom-end" :offset="[9,8]">
              <template #reference>
                <span>...</span>
              </template>
            </van-popover>
          </div>
        </div>
      </div>
      <div class="student-subtitle subtitle-gray">
        <span>{{studentData.branchName}}</span> | <span style="margin-left:0.5rem">{{studentData.creatorName}} {{studentData.createTime}} 添加</span>
      </div>
      <div class="money-title">
        ￥{{studentData.orderAmount}}
      </div>

      <div class="student-series">
        <div>{{checkNum(studentData.orderPeopleNumVOS).scaCodeNum  || '-'}}<span>扫码人次</span></div>
        <div>{{checkNum(studentData.orderPeopleNumVOS).enrollNum  || '-'}}<span class="color-blue">报名人次</span></div>
        <div>{{checkNum(studentData.orderPeopleNumVOS).balanceNum  || '-'}}<span class="color-green">已交清</span></div>
        <div>{{checkNum(studentData.orderPeopleNumVOS).noBalanceNum  || '-'}}<span class="color-yellow">有余款</span></div>
      </div>

    </div>
    <ShareTips :deptIsShow="deptIsShow" @compelete="handleCompelete" :activityId="studentData.id" />
    <ShareCode :isOpen="shareCodeIsOpen" :counselTab="''" ref="shareCode" :sId="studentData.id" :sysShellId="''" @close="handleClose" />
    <CommonBottomToast :isShow="isShow" :titleList="titleList" :headerTitle="headerTitle" type="elet" :btnRightTitle="btnRightTitle" height="25%" @onConfirm="handleConfirm" @onClose="handleClose" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    sId: Number,
    studentData: {
      required: true,
      default: () => { }
    },
    cooperationType: Number,
  },
  components: {
    ShareTips: () => import('@/components/ShareCodeTips'),
    ShareCode: () => import('@/components/ShareCode'),
    CommonBottomToast: () => import('@/components/CommonBottomToast'),
  },
  data() {
    return {
      deptIsShow: false,
      shareCodeIsOpen: false,
      showPopover: false,
      isShow: false,
      titleList: [],
      headerTitle: '开启状态',
      btnRightTitle: '开启',
 
    }
  },
  filters: {
    joinTitle(list) {
      if (list) {
        return list.map(item => item.courseTitle).join('/')
      }
      return ''
    },
  },
  activated() {
    this.operatShow = false
  },
  mounted() {
    this.$emit('onStudentCardMounted')
  },
  computed: {
    ...mapGetters(['permission_btns']),
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id
    }),
  },
  methods: {

    handleConfirm() {
      let type = 0
      if (this.btnRightTitle === '开启') {
        type = 1
      }
      this.$emit('onUpdateStatus', this.studentData.id, type)
      this.isShow = false
    },
    handleClose() {
      this.isShow = false
    },
    checkNum(val) {
      return Array.isArray(val) && val.length ? val[0] : {}
    },
    actions(val) {
      let arr
      const { state } = val

      // state 1 :  生效中 1 0已取消
      if (state) {
        arr = [
          { text: '编辑', dialogName: 'edit', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:LECTURE_EDIT' : 'MARKET:BOOK:EDIT' },
          { text: '查看收款码', dialogName: 'look', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:INFO_RELATIONQ' : 'MARKET:ACT:INFO_RELATIONQ' },
          { text: '关闭状态', dialogName: 'close', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:INFO_SIGNCODE' : 'MARKET:ACT:INFO_SIGNCODE' }
        ]
      } else {
        arr = [
          { text: '开启状态', dialogName: 'open', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:LECTURE_EDIT' : 'MARKET:BOOK:EDIT' },
        ]
      }
      // if (questionnaireId) {
      //   arr = [
      //     { text: '编辑', dialogName: 'isConsultSubscribeShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:LECTURE_EDIT' : 'MARKET:BOOK:EDIT' },
      //     { text: '重新关联', dialogName: 'isConsultDistributeShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:INFO_RELATIONQ' : 'MARKET:ACT:INFO_RELATIONQ' },
      //     { text: '生成签到码', dialogName: 'isConsultMarketAreaShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:INFO_SIGNCODE' : 'MARKET:ACT:INFO_SIGNCODE' }
      //   ]
      // } else {
      //   arr = [
      //     { text: '编辑', dialogName: 'isConsultSubscribeShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:LECTURE_EDIT' : 'MARKET:BOOK:EDIT' },
      //     { text: '关联问卷', dialogName: 'isConsultDistributeShow', permission_btn: this.counselTab == 'LectureReg' ? 'MARKET:SCHOOL:INFO_RELATIONQ' : 'MARKET:ACT:INFO_RELATIONQ' }
      //   ]
      // }
      // arr = arr.filter(item => this.permission_btns.includes(item.permission_btn))
      return arr
    },


    handleOperatShow() {
      this.operatShow = true
    },


    handleCompelete(val) {
      if (val) {
        const { sysShellId, marketAreaId } = val
        this.sysShellId = sysShellId || marketAreaId
        this.$loading(true)
        this.$nextTick(() => {
          this.$refs.shareCode.checkCodeIsShow().then(() => {
            this.$loading(false)
            this.shareCodeIsOpen = true
          }).catch(() => {
            this.$loading(false)
          })
        })
        this.deptIsShow = false
        this.operatShow = false
      } else {
        this.deptIsShow = false
        this.operatShow = false
      }
    },


    handlePopSelect(e) {
      const { dialogName } = e
      if (dialogName === 'open') {
        this.headerTitle = '开启状态'
        this.btnRightTitle = '开启'
        this.titleList = ['开启状态后学员可以通过', '课程包包收款码购买课程,你确定要开启吗?']
        this.isShow = true
        this.handleCommonClose()
      }
      if (dialogName === 'close') {
        this.btnRightTitle = '关闭'
        this.headerTitle = '关闭状态'
        this.titleList = ['关闭状态后学员将无法通过', '课程包包收款码购买课程,你确定要关闭吗?']
        this.isShow = true
        this.handleCommonClose()
      }
      if (dialogName === 'edit') {
        this.$router.push(`/courseAddEdit/${this.studentData.id}/${this.cooperationType}`)
        this.handleCommonClose()
      }

      if (dialogName === 'look') {
        this.$emit('look', this.studentData.id)
        this.handleCommonClose()
      }

      this[e.dialogName] = true
    },

    handleCommonClose() {
      this.showPopover = false
      this.operatShow = false
    },
    handleCourseDetail() {
      this.$router.push(`/courseDetail/${this.studentData.id}`)
    },
  }
}
</script>

<style lang="scss" >
@import './index.scss';
.van-popover__action-text {
  display: flex !important;
  justify-content: flex-start !important;
}
</style>