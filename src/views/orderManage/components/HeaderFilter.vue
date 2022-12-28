<template>
  <div id="orderHeader">
    <div class="hf-l-seacrch" v-if="isSearch">
      <form action="/">
        <van-search v-model="listQuery.keyword" shape="round" show-action :placeholder="placeholder" :clearable="false" @search="onKeywordSearch" @cancel="onKeywordCancel" />
      </form>
    </div>

    <div class="header-filter" :style="isActSearch ? 'padding: 0 0 0 0.5rem' : ''">
      <div class="hf-l-list" v-show="!isActSearch">
        <van-dropdown-menu class="hf-l-list-menu">
          <!-- 状态 -->
          <van-dropdown-item v-if="listType == 'EnrollmentOrder'" title="状态" :title-class="isHtab1 ? 'common-act-color' : ''" @open="handleDropOpen(1)" ref="vanDropItem1">
            <div class="hf-drop-view" v-if="queryList.stateList.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click.stop="handleState(item.id, 1)" v-for="item in queryList.stateList" :key="item.id">
                  <van-icon v-if="listQuery.states && listQuery.states.includes(item.id)" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.states && listQuery.states.includes(item.id) }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(1)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
            <div v-else class="hf-drop-contain-empty">
              暂无数据
            </div>
          </van-dropdown-item>

          <!-- 班型 -->
          <van-dropdown-item title="班型" v-if="listType == 'EnrollmentOrder'" :title-class="isHtab2 ? 'common-act-color' : ''" @open="handleDropOpen(2)" ref="vanDropItem2">
            <div class="hf-drop-view" v-if="queryList.classTypeList.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click.stop="handleClass(item.id)" v-for="item in queryList.classTypeList" :key="item.id">
                  <van-icon v-if="listQuery.attributeList && listQuery.attributeList.includes(item.id)" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.attributeList && listQuery.attributeList.includes(item.id) }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(2)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
            <div v-else class="hf-drop-contain-empty">
              暂无数据
            </div>
          </van-dropdown-item>

          <!-- 换班记录状态 -->
          <van-dropdown-item title="状态" v-if="listType == 'ShiftRecord'" :title-class="isHtab2 ? 'common-act-color' : ''" @open="handleDropOpen(2)" ref="vanDropItem2">
            <div class="hf-drop-view">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click.stop="handleShiftRecordState(item.id)" v-for="item in shiftRecordStatesList" :key="item.id">
                  <van-icon v-if="listQuery.auditStates && listQuery.auditStates.includes(item.id)" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.auditStates && listQuery.auditStates.includes(item.id) }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(5)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
          </van-dropdown-item>

          <!--  服务状态 -->
          <van-dropdown-item v-if="listType == 'EnrollmentOrder'" title="服务状态" :title-class="isHtab3 ? 'common-act-color' : ''" @open="handleDropOpen(3)" ref="vanDropItem3">
            <div class="hf-drop-view" v-if="queryList.serviceStateList.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click.stop="handleServiceState(item.id)" v-for="item in queryList.serviceStateList" :key="item.id">
                  <van-icon v-if="listQuery.isServes && listQuery.isServes.includes(item.id)" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.isServes && listQuery.isServes.includes(item.id) }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(3)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
            <div v-else class="hf-drop-contain-empty">
              暂无数据
            </div>
          </van-dropdown-item>

          <!-- 缴费类型 -->
          <van-dropdown-item v-if="listType == 'EnrollmentCollection'" title="缴费类型" :title-class="isHtab1 ? 'common-act-color' : ''" @open="handleDropOpen(1)" ref="vanDropItem1">
            <div class="hf-drop-view" v-if="queryList.types.length">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click.stop="handleState(item.value, 2)" v-for="item in queryList.types" :key="item.value">
                  <van-icon v-if="listQuery.types && listQuery.types.includes(item.value)" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.types && listQuery.types.includes(item.value) }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(6)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
            <div v-else class="hf-drop-contain-empty">
              暂无数据
            </div>
          </van-dropdown-item>

          <!-- 换班类型  -->
          <van-dropdown-item v-if="listType == 'ShiftRecord'" title="换班类型" :title-class="isHtab7 ? 'common-act-color' : ''" @open="handleDropOpen(1)" ref="vanDropItem1">
            <div class="hf-drop-view">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click.stop="handleState(item.value, 3)" v-for="item in shiftTypeList" :key="item.value">
                  <van-icon v-if="listQuery.types && listQuery.types.includes(item.value)" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.types && listQuery.types.includes(item.value) }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(7)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
          </van-dropdown-item>

          <!-- 日期类型 -->
          <van-dropdown-item :title="defaultDateTitle" title-class="common-act-color" @open="handleDropOpen(4)" ref="vanDropItem4">
            <div class="hf-drop-view">
              <div class="hf-drop-quick" style="margin-top: 0;">
                <div class="hf-drop-quick-item" style="margin-bottom: 0;">
                  <div class="hf-drop-quick-list" v-if="listType == 'EnrollmentOrder'">
                    <div class="hf-drop-quick-list-item" :class="{ 'hf-drop-quick-list-item-act': listQuery.screen === item.value }" @click="handleDateType(item.value)" v-for="item in queryList.dateTypeList" :key="item.id">{{item.text}}</div>
                  </div>
                  <ReQuickDateBtns :startData="listQuery.startDate" :endData="listQuery.endDate" @change="handleQuickDate" style="margin-top: 1rem;" />
                  <div class="hf-drop-quick-calendar">
                    <van-calendar ref="vanCalendar" :formatter="dayTextFormatter" @select="handleDateSelect" :default-date="defaultDate" :poppable="false" type="range" :show-title="false" color="#0088FE" :show-confirm="false" allow-same-day :min-date="new Date('2000/01/01')" :style="{ height: '400px' }" />
                  </div>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset(4)">重置</van-button>
                <van-button class="common-double-button-r" @click="handleConfirm">确定</van-button>
              </div>
            </div>
          </van-dropdown-item>

        </van-dropdown-menu>
      </div>
      <div class="hf-r-list">
        <div class="hf-r-list-item" @click="handleSearch">
          <div class="hf-r-icon-bg">
            <van-icon name="search" class="hf-r-icon" />
          </div>
        </div>
        <div class="hf-r-list-item" @click="handleMoreFilter" v-if="listType!=='ShiftRecord'">
          <div class="hf-r-icon-bg" :class="{'hf-r-icon-bg-act': isMoreAct }">
            <van-icon name="filter-o" class="hf-r-icon" />
          </div>
        </div>
      </div>
      <div style="width: 100%;" v-show="isActSearch">
        <van-search class="searchInput" v-model="listQuery.keyword" @search="onSearch" @clear="onSearch" placeholder="请输入学员姓名、手机号码、微信、QQ" show-action background="#ffffff">
          <template #action>
            <div style="font-size: 0.76rem;" @click.stop="handleSearchCancel">取消</div>
          </template>
        </van-search>
      </div>
      <van-popup position="bottom" safe-area-inset-bottom v-model="moreFilterShow" :lock-scroll="false" round get-container="#app" lazy-render>
        <div class="common-popup moreContain">
          <div class="common-popup-header">
            <div></div>
            <div class="common-popup-header-title">
              <span>筛选</span>
            </div>
            <div class="common-popup-header-close">
              <van-icon name="cross" @click="moreFilterShow = false" />
            </div>
          </div>
          <div class="common-popup-body moreContain-body">
            <van-form ref="filterForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
              <RePick v-model="listQuery.shellIdsLocal" label="所属分校" :list="authDepartList" isCascader isShowSearch isCell clearable childrenKey="child" />
              <RePick v-model="listQuery.achievementAreaLocal" label="业绩区域" :list="achievementAreaList" isCell clearable />
              <RePick v-model="listQuery.areaId" label="市场区域" :list="authAreaList" isShowSearch multiple isCell clearable />
              <RePick v-model="listQuery.attendSchoolIdLocal" label="就读学校" :list.sync="attendSchoolList" isCascader childrenKey="child" isShowSearch isCell clearable isOriginSchoolSearch />
              <RePick v-model="listQuery.enrollSubjectLocal" v-if=" listType === 'EnrollmentOrder'  && (currentSystemInfo[5] || [3,22,66,76,77,49,68,70,97].includes(currentSystemId))" label="报考科目" :list="enrollSubjectList" isCell clearable childrenKey="child" />
              <RePick v-model="listQuery.enrollSchoolIdLocal" v-if=" listType === 'EnrollmentOrder'" label=" 报考学校" :list.sync="collegeSchoolList" isCascader isShowSearch isCell clearable isOriginSchoolSearch />
              <RePick v-model="listQuery.lmSubjectId" v-if=" listType === 'EnrollmentOrder'" label="考试科目" isShowSearch :list="examSubjectList" isCell clearable />
              <RePick v-model="listQuery.cityId" v-if=" listType === 'EnrollmentOrder' && currentSystemInfo === 1 && currentSystemId !== 74 && systemId !== 97" label="报考地区" :list="registraAreaList" isCascader isShowSearch isCell clearable titleKey="text" childrenKey="children" />
              <RePick v-model="listQuery.coureseLocal" label="报名课程包" :list="coureseList" isShowSearch isCell clearable titleKey="text" idKey="value" />
              <RePick v-model="listQuery.graduationYears" v-if=" listType === 'EnrollmentOrder'" label="毕业年份" :list="graduationList" multiple isCell clearable />
              <RePick v-model="listQuery.years" :label="examYearText" v-if=" listType === 'EnrollmentOrder'" multiple :list="examYearList" isCell clearable />
              <RePick v-model="listQuery.operators" v-if=" listType !== 'EnrollmentOrder'" label="经办人" multiple isShowSearch :list="ownList" isCell clearable />
              <RePick v-model="listQuery.owners" label="所属人" multiple isShowSearch :list="ownList" isCell clearable />
            </van-form>
          </div>
          <div class="common-popup-footer">
            <van-button style="width: 8rem; margin-right: 1rem;" @click="handleMoreReset">重置</van-button>
            <van-button type="info" style="width: 8rem;" @click.stop="handleMoreConfirm">确认</van-button>
          </div>
        </div>
      </van-popup>
    </div>

  </div>
</template>

<script>
import { getEnrollSubjectDropApi, getOrderConditionApi, getCoursePackeOrdertDropApi, getOwnListApi } from '@/api/potentialGuest/order'
import { commonCaspasgeApi } from '@/api/common'
import { dayTextFormatter } from '@/utils'
import { mapState, mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  props: {
    listType: String, // EnrollmentOrder: 报名订单 EnrollmentCollection: 报名收款  ShiftRecord: 换班记录
    paramProp: Object
  },
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
    ReQuickDateBtns: () => import('@/components/ReComponents/ReQuickDateBtns')
  },
  data() {
    return {
      isActSearch: false,
      title: '请选择',
      moreFilterShow: false,
      defaultDate: null,
      defaultDisAndOverDate: null,
      listQuery: {},
      attendSchoolList: [], // 就读学校
      collegeSchoolList: [], // 报考学校
      yyzxActiveList: [],
      defaultDateTitle: this.listType === 'EnrollmentOrder' ? '报名日期' : '日期类型',
      isSearch: false,
      achievementAreaList: [], // 业绩区域
      enrollSubjectList: [], // 报考科目
      examSubjectList: [], // 考试科目
      registraAreaList: [], //报考地区
      coureseList: [],//报名课程包
      dayTextFormatter: dayTextFormatter,
      graduationList: [], // 毕业年份列表
      examYearList: new Array(10).fill(1).map((item, index) => {
        return {
          text: dayjs().year() - 3 + index,
          value: dayjs().year() - 3 + index
        }
      }),// 考试年份列表
      ownList: [],
      shiftRecordStatesList: [
        { text: '全部', id: 25 },
        { text: '待审核', id: 1 },
        { text: '审核通过', id: 2 },
        { text: '审核失败', id: 3 }
      ], // 换班记录状态筛选列表
      shiftTypeList: [
        { text: '换课程', value: 1 },
        { text: '换课程包', value: 2 },
      ]
    }
  },
  computed: {
    ...mapState({
      queryList: state => state.order.queryList,
      authDepartList: state => state.common.user.authDepartList,
      authAreaList: state => state.common.user.authAreaList,
      currentSystemId: state => state.common.systems.currentSystem.id,
      isFreshList: state => state.consultation.queryList.isFreshList,
      consultTypeList: state => state.consultation.queryList.consultTypeList,
      classList: state => state.consultation.queryList.classList,
      sourceList: state => state.consultation.queryList.sourceList,
      // ownList: state => state.consultation.queryList.ownList,
      cityTreeList: state => state.consultation.queryList.cityTreeList,
      yyzxDepartList: state => state.consultation.yyzxDepartList,
      resultList: state => state.consultation.yyzxQueryList.resultList,
      consultantList: state => state.consultation.yyzxQueryList.consultantList,
      examYearText: state => state.common.setting.examYearText,
    }),
    ...mapGetters(['currentSystemInfo']),
    placeholder() {
      let title = ''
      if (this.listType === 'EnrollmentOrder') {
        title = '请输入学员姓名、手机号码、订单号'
      }
      if (this.listType === 'EnrollmentCollection') {
        title = '请输入学员姓名、手机号码、收据号'
      }
      if (this.listType === 'ShiftRecord') {
        title = '请输入学员姓名、手机号码'
      }
      return title
    },
    isMoreAct() {
      let bol = false
      const listQuery = this.paramProp || {}
      if (listQuery.shellIdsLocal || (listQuery.achievementAreaLocal) || (listQuery.areaId && listQuery.areaId.length) || listQuery.attendSchoolIdLocal
        || listQuery.enrollSubjectLocal || listQuery.enrollSchoolIdLocal || listQuery.lmSubjectId ||
        listQuery.cityId || listQuery.coureseLocal || (listQuery.graduationYearLocal && listQuery.graduationYearLocal.length) ||
        (listQuery.examYearLocal && listQuery.examYearLocal.length)
        || (listQuery.owners && listQuery.owners.length) || (listQuery.operators && listQuery.operators.length)
      ) {
        bol = true
      }
      return bol
    },
    isHtab1() {
      let isShow = false
      if (this.listType === 'EnrollmentOrder') {
        if (this.paramProp.states && this.paramProp.states.length) isShow = true
      }
      if (this.listType === 'EnrollmentCollection') {
        if (this.paramProp.types && this.paramProp.types.length) isShow = true
      }
      return isShow
    },
    isHtab2() {
      return true
    },
    isHtab3() {
      let isShow = true
      return isShow
    },
    isHtab7() {
      let isShow = false
      if (this.paramProp.types.length) {
        isShow = true
      }
      return isShow
    },
    isHtab8() {
      let isShow = false
      if (this.paramProp.distributeType) {
        isShow = true
      }
      return isShow
    },
    isHtab9() {
      let isShow = false
      if (this.paramProp.distributeStartDate && this.paramProp.distributeEndDate) {
        isShow = true
      }
      return isShow
    },
  },
  methods: {
    handleShiftRecordState(val) {
      this.listQuery.auditStates = val ? [val] : []
    },
    onKeywordCancel() {
      this.listQuery.keyword = null
      this.isActSearch = false
      this.isSearch = false
      this.onKeywordSearch()
    },
    onKeywordSearch() {
      this.$emit('onListQuery', this.listQuery)
    },
    // 处理服务状态
    handleServiceState(val) {
      this.listQuery.isServes = val ? [val] : [25]
    },

    // 处理班型
    handleClass(val) {
      this.listQuery.attributeList = val ? [val] : []
      this.listQuery.attribute = val
    },
    // 处理状态 type : 1 状态  2 缴费类型  3 换班类型
    handleState(val, type) {
      if (type == 1) {
        const i = this.listQuery.states.findIndex(item => item === val)
        if (i > -1) {
          this.listQuery.states.splice(i, 1)
        } else {
          this.listQuery.states.push(val)
        }
      }

      if (type == 2 || type == 3) {
        const i = this.listQuery.types.findIndex(item => item === val)
        if (i > -1) {
          this.listQuery.types.splice(i, 1)
        } else {
          this.listQuery.types.push(val)
        }
      }


      // if (type == 3) {
      //   const i = this.listQuery.types.findIndex(item => item === val)
      //   if (i > -1) {
      //     this.listQuery.types.splice(i, 1)
      //   } else {
      //     this.listQuery.types.push(val)
      //   }
      //   console.log(' this.listQuery.type', this.listQuery.types);
      // }

    },

    handleWaitFollowType(e) {
      this.listQuery.distributeType = e
    },
    handleInit() {

      // 换班记录 
      if (this.listType === 'ShiftRecord') {
        this.listQuery = {
          ...this.paramProp,
          types: [...this.paramProp.types],
          auditStates: this.paramProp.auditStates.length ? this.paramProp.auditStates : [25]
        }
      }

      // 报名订单
      if (this.listType === 'EnrollmentOrder') {
        this.listQuery = {
          ...this.paramProp,
          states: [...this.paramProp.states],
          areaId: [...this.paramProp.areaId],
          attributeList: [this.paramProp.attribute ? this.paramProp.attribute : 25],
          isServes: this.paramProp.isServes && this.paramProp.isServes.length ? [...this.paramProp.isServes] : [25],
        }
      }

      // 报名收款 
      if (this.listType === 'EnrollmentCollection') {
        this.listQuery = {
          ...this.paramProp,
          types: [...this.paramProp.types],
          areaId: [...this.paramProp.areaId],
          attributeList: [this.paramProp.attribute ? this.paramProp.attribute : 25],
          isServes: this.paramProp.isServes && this.paramProp.isServes.length ? [...this.paramProp.isServes] : [25],
        }
      }


      if (this.listQuery.startDate && this.listQuery.endDate) {
        this.defaultDate = [dayjs(this.listQuery.startDate).toDate(), dayjs(this.listQuery.endDate).toDate()]
      } else if (this.listQuery.distributeStartDate && this.listQuery.distributeEndDate) {
        this.defaultDisAndOverDate = [dayjs(this.listQuery.distributeStartDate).toDate(), dayjs(this.listQuery.distributeEndDate).toDate()]
      } else {
        this.handleDateReset()
      }
    },
    handleDropOpen() {
      this.handleInit()
    },
    onSearch() {
      this.handleConfirm()
    },
    // 搜索    
    handleSearch() {
      this.handleInit()
      this.listQuery.keyword = this.paramProp.keyword
      this.isSearch = true
    },

    handleSearchCancel() {
      this.listQuery.keyword = null
      this.isActSearch = false
      this.onKeywordSearch()
    },
    // 更多筛选
    handleMoreFilter() {
      this.handleInit()
      this.moreFilterShow = true
    },
    // 状态
    handleType(val) {
      this.listQuery.currentState = val ? [val] : []
    },
    // 意向类型
    handleIntention(val) {
      const i = this.listQuery.intentionIds.findIndex(item => item === val)
      if (i > -1) {
        this.listQuery.intentionIds.splice(i, 1)
      } else {
        this.listQuery.intentionIds.push(val)
      }
    },
    // 快捷筛选
    handleStatics(id) {
      if (this.listQuery.statisticsType === id) {
        this.listQuery.statisticsType = null
      } else {
        this.listQuery.statisticsType = id
      }
    },

    handleDateType(id) {
      this.listQuery.screen = id
    },

    handleDateSelect(val) {
      if (val.filter(item => item).length === 2) {
        this.listQuery.startDate = dayjs(val[0]).format('YYYY/MM/DD')
        this.listQuery.endDate = dayjs(val[1]).format('YYYY/MM/DD')
      }
    },

    // 日历重置
    handleDateReset() {
      this.defaultDate = [dayjs(this.listQuery.startDate).toDate(), dayjs(this.listQuery.endDate).toDate()]
      this.$refs.vanCalendar && this.$refs.vanCalendar.reset()
    },


    handleReset(num) {
      if (num === 1) {
        this.listQuery.states = []
      }
      else if (num === 2) {
        this.listQuery.attributeList = [25]
        this.listQuery.attribute = null
      }
      else if (num === 3) {
        this.listQuery.isServes = [25]
      }
      else if (num === 4) {
        this.listQuery.startDate = dayjs().startOf('year').format('YYYY/MM/DD')
        this.listQuery.endDate = dayjs().format('YYYY/MM/DD')
        this.defaultDateTitle = this.listType === 'EnrollmentOrder' ? '报名日期' : '日期类型'
        this.listQuery.screen = 1
        this.handleDateReset()
      } else if (num === 5) {
        this.listQuery.auditStates = [25]
      } else if (num === 6 || num === 7) {
        this.listQuery.types = []
      }
    },
    handleConfirm() {
      this.$emit('onListQuery', this.listQuery)
      // 设置日期类型title
      let dateObj = this.queryList.dateTypeList.find(v => v.value == this.listQuery.screen)
      if (dateObj && this.listType === 'EnrollmentOrder') {
        this.defaultDateTitle = dateObj.text
      } else {
        this.defaultDateTitle = this.listType === 'EnrollmentOrder' ? '报名日期' : '日期类型'
      }
      this.$refs.vanDropItem1 && this.$refs.vanDropItem1.toggle(false)
      this.$refs.vanDropItem2 && this.$refs.vanDropItem2.toggle(false)
      this.$refs.vanDropItem3 && this.$refs.vanDropItem3.toggle(false)
      this.$refs.vanDropItem4 && this.$refs.vanDropItem4.toggle(false)
    },

    handleQuickDate(e) {
      this.defaultDate = [dayjs(e.time[0]).toDate(), dayjs(e.time[1]).toDate()]
      this.listQuery.startDate = e.time[0]
      this.listQuery.endDate = e.time[1]
    },

    handleDisAndOverQuickDate(e) {
      this.defaultDisAndOverDate = [dayjs(e.time[0]).toDate(), dayjs(e.time[1]).toDate()]
      this.listQuery.distributeStartDate = e.time[0]
      this.listQuery.distributeEndDate = e.time[1]
    },
    // 更多重置
    handleMoreReset() {
      this.listQuery.sysShellIds = []
      this.listQuery.shellIdsLocal = null
      this.listQuery.orderAreas = []
      this.listQuery.achievementAreaLocal = null
      this.listQuery.areaIdLocal = null
      this.listQuery.areaId = []
      this.listQuery.attendSchoolIdLocal = null
      this.listQuery.attendSchools = []
      this.listQuery.enrollSubjectLocal = null
      this.listQuery.emEnrollSubjectIds = []
      this.listQuery.enrollSchoolIdLocal = null
      this.listQuery.collegeId = null
      this.listQuery.lmSubjectId = null
      this.listQuery.cityId = null
      this.listQuery.coureseLocal = null
      this.listQuery.packets = []
      this.listQuery.graduationYears = []
      this.listQuery.years = []
      this.listQuery.owners = []
      this.listQuery.operators = []

    },
    handleMoreConfirm() {
      this.$emit('onListQuery', this.listQuery)
      this.moreFilterShow = false
    },
    onSubmit(e) {
      console.log(e)
    },

    initAchievementAreaList() {
      commonCaspasgeApi('orderArea').then(res => {
        if (!res || !res.data || !res.data.length) return
        this.achievementAreaList = res.data.map(item => {
          return { title: item.text, id: item.id }
        })
      })
    },

    handleInitEnrollSubject() {
      getEnrollSubjectDropApi().then(res => {
        this.enrollSubjectList = res.data
      })
    },

    // 初始化考试科目, 报考地区, 毕业年份
    handleInitCommonList(attribute) {
      getOrderConditionApi({ attribute }).then(res => {
        const { subjects = [], provinces = {}, graduationYears = [] } = res.data || {}
        this.examSubjectList = subjects.map(v => {
          return {
            id: v.value,
            title: v.text
          }
        })
        this.graduationList = graduationYears.map(v => {
          return {
            id: v,
            title: v
          }
        })
        this.registraAreaList = provinces
      })
    },

    handleInitCourseList() {
      getCoursePackeOrdertDropApi().then(res => {
        let newArr = []
        Object.keys(res.data.packetMap || {}).forEach((key) => {
          (res.data.packetMap[key] || []).forEach((v) => {
            newArr.push(v)
          })
        })
        this.coureseList = newArr
      })
    },

    handleGetOwnList() {
      getOwnListApi().then(res => {
        this.ownList = res.data || []
      })
    }

  },
  created() {

    // 获取业绩区域
    this.initAchievementAreaList()

    // 初始化报考科目
    this.handleInitEnrollSubject()

    // 初始化课程包
    this.handleInitCourseList()

    // 初始化报名地区，考试科目
    this.handleInitCommonList()

    // 初始化所属人
    this.handleGetOwnList()

  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
