<template>
  <div>
    <ParticipantFilter :listType="listType" :paramProp="listConditonObj" :listQueryParam="listQuery.param" @onListQuery="handleListQuery" v-if="firstList.length" />
    <div class="count-cont" v-if="firstList.length">
      <div class="count-list">
        <van-loading v-if="cloading" size="0.6rem" style="margin-bottom:0.4rem" />
        <div v-else class="count-title" :style="listQuery.param.countFilter == 1 ? 'color:  #0088FE' : 'color:  #333' " @click.stop="handleFilterParct"><span :style="listQuery.param.countFilter == 1 ? 'background-color: #0088FE' : 'background-color: #333' "></span>参与人数：{{countObj[1] || 0}}</div>
      </div>
      <div class="count-list">
        <van-loading v-if="cloading" size="0.6rem" style="margin-bottom:0.4rem" />
        <div v-else class="count-title" :style="listQuery.param.countFilter == 5 ? 'color:  #67C23A' : 'color:  #333'" @click.stop=" handleFilterNewUser"><span :style="listQuery.param.countFilter == 5 ? 'background-color: #67C23A' : 'background-color: #333' "></span>新用户：{{countObj[5] || 0}}</div>
      </div>
      <div class="count-list">
        <van-loading v-if="cloading" size="0.6rem" style="margin-bottom:0.4rem" />
        <div v-else class="count-title" :style="listQuery.param.countFilter == 6 ? 'color:  #E6A23C' : 'color:  #333'" @click.stop="handleFilterOldUser"><span :style="listQuery.param.countFilter == 6 ? 'background-color: #E6A23C' : 'background-color: #333' "></span>老用户：{{countObj[6] || 0}}</div>
      </div>
    </div>
    <RMList v-if="tableList.length" :moreLoading.sync="moreLoading" :refreshing.sync="refreshing" :finished.sync="finished" @onLoad="handleLoad" @onRefresh="handleRefresh" isMore :tableList="tableList">
      <div>
        <StudentCard v-for="(item, index) in tableList" :key="item.id" :sId="item.id" :studentData="item" @onUpdataInfo="handleUpdataInfo($event, item, index)" :listType="'9'" />
      </div>
    </RMList>
    <div class="common-empty" v-else style="background: #ffffff;">
      <img src="@/assets/images/icons/empty.png" alt="">
      <div>暂无数据</div>
    </div>
    <div class="common-bottom-btns" v-permission="checkPermissionStatus(counselTab)">
      <div class="common-bottom-btn" @click="handleAddStudent">
        <img src="@/assets/images/icons/add.png" alt="">
        <span>添加用户</span>
      </div>
    </div>
  </div>
</template>
<script>
import { postPartStudentListApi, postPartStudentCountApi, postPartStudentConditonApi } from '@/api/potentialGuest/activity'
// 参与人员
export default {
  props: {
    counselTab: String
  },
  components: {
    ParticipantFilter: () => import('./ParticipantFilter'),
    RMList: () => import('@/components/ReComponents/RMList'),
    StudentCard: () => import('@/components/StudentCard')
  },
  data() {
    return {
      cloading: false,
      finished: false,
      refreshing: false,
      moreLoading: false,
      tableList: [],
      listConditonObj: {},
      listQuery: {
        pageinfo: { pageNum: 1, pageSize: 20, sort: [{ column: 'addTime', type: 1 }] },
        param: { type: 3, countFilter: 1, sysShellId: [], activityId: [], startDate: null, endDate: null, keyword: null, consultantName: [], intentionType: [], intentionClass: [], sex: [], courseAttribute: [], owner: null, schoolManager: [], followState: [], ids: [], isFresh: null, attendSchools: [], consultState: null, cityId: null }
      },
      sId: null,
      countObj: { 1: 0, 6: 0, 7: 0 },
      listType: '1',
      firstList: []
    }
  },
  created() {
    let sId = Number(this.$route.params.sid)
    if (!Number.isNaN(sId)) { this.sId = sId }
    const { listType } = this.$route.params
    this.listType = (listType == 2 ? 3 : 1).toString()
    this.listQuery.param.type = this.listType
    this.handleInit('firstRequest')
  },
  methods: {
    checkPermissionStatus(counselTab) {
      if (counselTab == 'LectureReg') {
        return 'MARKET:SCHOOL:PARTICIPANT_ENTER'
      } else {
        return 'MARKET:ACT:PARTICIPANT_ENTER'
      }
    },
    handleFilterParct() {
      this.listQuery.param.countFilter = 1
      this.handleNewInit()
    },
    handleFilterNewUser() {
      this.listQuery.param.countFilter = 5
      this.handleNewInit()
    },
    handleFilterOldUser() {
      this.listQuery.param.countFilter = 6
      this.handleNewInit()
    },
    handleAddStudent() {
      this.$router.push({
        path: `/studentinfoedit/null`
      })
    },
    handleInit(val) {
      this.getListConditon()
      this.getTableList('init', val)
    },
    handleNewInit(val) {
      this.getTableList('init', val)
    },
    handleListQuery(paramProp) {
      this.listQuery.pageinfo.sort = paramProp.sortRule ? [{ ...paramProp.sortRule }] : []
      this.listQuery.param = {
        ...this.listQuery.param,
        ...paramProp,
        type: this.listType == 1 ? 1 : 3,
        // intentionType: paramProp.intentionType ? [paramProp.intentionType] : [], // 意向类型
        result: paramProp.result ? paramProp.result == 5 ? [] : [paramProp.result] : [], // 咨询结果
        followUpState: paramProp.followUpState == 5 ? null : paramProp.followUpState, // 跟进状态
        consultState: paramProp.consultState == 5 ? null : paramProp.consultState, // 预约状态
        intentionClass: paramProp.intentionClass ? [...paramProp.intentionClass] : [], // 意向班型
        cityId: paramProp.cityId, // 所在城市
        examYear: paramProp.examYear ? [...paramProp.examYear] : [], // 市场区域
        isFresh: paramProp.isFreshLocal, // 属性
        schoolManager: paramProp.campusLocal ? [...paramProp.campusLocal] : [], // 市场区域负责人
        owner: paramProp.ownLocal ? [...paramProp.ownLocal] : [], // 所属人
        crmMarketAreaIds: paramProp.areaId ? [...paramProp.areaId] : [], // 市场区域
        years: paramProp.graduationYearLocal ? [paramProp.graduationYearLocal] : [], // 毕业年份
        examYears: paramProp.examYears ? [...paramProp.examYears] : [] // 考试年份
      }
      this.finished = false
      this.handleRefresh()
    },
    getListConditon() {
      this.listQuery.param.activityId = [this.sId]
      postPartStudentConditonApi(this.listQuery.param).then(res => {
        this.listConditonObj = res.data || { attendSchools: [], consultResults: [], consultants: [], intentionClasss: [], intentions: [], isFreshs: [], owners: [], schoolManagers: [] }
        this.listConditonObj.consultResults = (this.listConditonObj.consultResults || []).map(v => {
          return {
            id: v.value,
            text: v.text
          }
        })
        this.listConditonObj.consultResults.unshift({
          id: 5,
          text: '全部'
        })
      })
    },
    getTableList(val, type) {
      this.moreLoading = true
      this.$loading(true, 'partStudentTableLoading')
      const { shellIdsLocal } = this.listQuery.param
      const query = {
        pageinfo: {
          ...this.listQuery.pageinfo,
          pageSize: this.pageSize/* ,
          sort: [this.listQuery.pageinfo.sort] */
        },
        param: {
          ...this.listQuery.param,
          sysShellId: shellIdsLocal ? [shellIdsLocal] : [], // 部门
          activityId: [this.sId],
          /* schoolId: schoolIdLocal ? [schoolIdLocal] : [], // 就读学校
          consultType: consultTypeLocal ? [consultTypeLocal] : [], // 咨询类型
          examYear: examYearLocal ? [examYearLocal] : [], // 考试年份
          isFresh: isFreshLocal ? [isFreshLocal] : [], // 属性
          campus: campusLocal ? [campusLocal] : [], // 市场区域负责人
          own: ownLocal ? [ownLocal] : [], // 所属人
          graduationYear: graduationYearLocal ? [graduationYearLocal] : [] // 毕业年份 */
        }
      }
      postPartStudentListApi(query).then(res => {
        if (['init', 'refresh'].includes(val)) {
          this.getListCount()
          this.tableList = res.data || []
        } else {
          this.tableList = this.tableList.concat(res.data || [])
        }
        if (res.data.length < this.pageSize) {
          this.finished = true
        }
        if (type == 'firstRequest') {
          this.firstList = res.data || []
        }
      }).finally(() => {
        this.$nextTick(() => {
          this.moreLoading = false
          this.refreshing = false
        })
        this.$loading(false, 'partStudentTableLoading')
      })
    },
    handleLoad() {
      this.listQuery.pageinfo.pageNum += 1
      this.getTableList('more')
    },
    handleRefresh() {
      this.listQuery.pageinfo.pageNum = 1
      this.finished = false
      this.getTableList('refresh')
    },
    getListCount() {
      this.cloading = true
      this.listQuery.param.activityId = [this.sId]
      let newParam = JSON.parse(JSON.stringify(this.listQuery.param))
      delete newParam.countFilter
      postPartStudentCountApi(newParam).then(res => {
        this.countObj = res.data || { 1: 0, 6: 0, 7: 0 }
      }).finally(() => {
        this.cloading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.count-cont {
  background-color: white;
  padding: 0.6rem;
  display: flex;

  .count-list {
    flex: 1;
    text-align: center;

    .count-title {
      font-size: 0.8rem;
      margin-bottom: 0.3rem;

      span {
        display: inline-block;
        height: 0.72rem;
        width: 0.18rem;
        border-radius: 0.1rem;
        position: relative;
        right: 0.4rem;
        top: 0.1rem;
      }
    }
    .count-num {
      font-size: 1.4rem;
    }
  }
}
</style>