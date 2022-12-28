<template>
  <div class="student-info-edit">
    <van-form ref="recordForm" :show-error-message="false" validate-trigger="" :submit-on-enter="false">
      <div class="student-info-edit-title">
        <span>必填信息</span>
      </div>
      <RePick v-model="listQuery.branchId" label="所属分校" v-if="$route.params.id == 'null'" :list="shellList" @change="handleSysShellId" :disabled="shellList.length == 1" isCascader name="sysShellId" childrenKey="child" isRequrie isCell clearable />
      <RePick v-if="!sId && roleFlag !== 2 && $route.params.id == 'null'" v-model="listQuery.orderDept" label="所属部门" :placeholder="!listQuery.branchId ? '请先选择所属分校':'请选择'" :disabled="!listQuery.branchId || departList.length == 1" :list="departList" idKey="value" titleKey="text" name="belongSysShellId" isRequrie isCell clearable />
      <RePick v-model="listQuery.crmMarketAreaId" label="市场区域" :placeholder="!listQuery.branchId ? '请先选择所属分校': !areaList.length ?'请先补充市场区域':'请选择'" :disabled="!listQuery.branchId || !areaList.length || areaList.length === 1" :list="areaList" isShowSearch name="crmMarketAreaId" isRequrie isCell clearable @change="handlemarketAreaSelect" />
      <van-field v-model.trim="listQuery.orderAmount" clear-trigger="always" name="orderAmount" required clearable input-align="right" label="订单金额" type="number" placeholder="请输入" :rules="[
        { required:true ,validator: VerifyFunc.validatorMoney, message: '订单金额格式错误!' }
      ]" />

      <RePick v-model="listQuery.fmCollectionCodeId" v-if="fmCollectionCodeIdList.length && $route.params.cooperationType == 1" label="账号名称" :placeholder="'请选择'" :list="fmCollectionCodeIdList" isShowSearch idKey="value" titleKey="text" name="fmCollectionCodeId" :isRequrie="fmIsRequired" isCell clearable />
      <RePick v-model="listQuery.tuitionStatus" label="学费缴纳状态" :placeholder="'请选择'" v-if="tuitionStatusObj.order == 3" :list="tuitionStatusList" isShowSearch name="tuitionStatus" isRequrie isCell clearable />

      <div class="course-detail-item" v-for="(item,index) in listQuery.coursePacketIds" :key="index">
        <div class="item-title">
          <span>课程明细{{index + 1}}</span>
          <span v-if="listQuery.coursePacketIds.length == 0" style="color:red;opacity: 0.5;" @click.stop="handleDel(index)">删除</span>
          <span v-else style="color:red" @click.stop="handleDelCourse(index)">删除</span>
        </div>
        <RePick v-model="item.omOrderCoursePacketId" label="报名课程包" @open="handleOpen(index)" :placeholder="'请选择'" @change="handleCourseId($event,index)" :list="item.coursePacketList" isShowSearch name="omOrderCoursePacketId" isRequrie isCell clearable />
        <RePick v-model="item.classAddressId" label="上课地点" :placeholder="'请选择'" :list="item.coursePacketAddressList" isShowSearch name="classAddressId" isCell clearable />
      </div>

      <div class="course-add-title" @click.stop="handleAddDetail">
        + 增加明细
      </div>

      <div class="student-info-edit-title" @click="handleExpend">
        <span>选填信息</span>
        <div style="vertical-align: middle;">
          <img src="@/assets/images/icons/expend_b.png" :class="{'rotate': isExpend}" alt="">
        </div>
      </div>
      <div v-show="isExpend">
        <RePick v-model="listQuery.tuitionStatus" label="学费缴纳状态" :placeholder="'请选择'" v-if="tuitionStatusObj.order == 2" :list="tuitionStatusList" isShowSearch name="tuitionStatus" isCell clearable />
        <RePick v-model="listQuery.orderArea" label="业绩区域" :list="achievementAreaList" isShowSearch isCascader name="orderArea" isCell clearable />
        <van-field v-model="listQuery.discountExplain" clear-trigger="always" rows="3" autosize name="discountExplain" clearable input-align="right" label="优惠说明" maxlength="50" show-word-limit placeholder="请输入" />
        <van-field label="是否需要邮寄材料" name="sex" input-align="right">
          <template #input>
            <van-radio-group v-model="listQuery.isPost" direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="0">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-model="listQuery.educationRemark" clear-trigger="always" rows="3" autosize type="textarea" name="educationRemark" clearable input-align="right" label="教务备注" maxlength="500" show-word-limit placeholder="请输入" />
        <van-field v-model="listQuery.giveClassHour" clear-trigger="always" rows="3" autosize type="textarea" name="giveClassHour" clearable input-align="right" label="赠送课时" maxlength="500" show-word-limit placeholder="请输入" />
        <van-field v-model="listQuery.serviceCommitment" clear-trigger="always" rows="3" autosize type="textarea" name="serviceCommitment" clearable input-align="right" label="服务承诺" maxlength="500" show-word-limit placeholder="请输入" />
      </div>
      <div class="student-info-edit-footer">
        <!-- <van-button class="record-btn record-btn-danger" style="margin-right: 1rem;" v-if="eId" @click="handleDel">删除</van-button> -->
        <van-button class="record-btn" type="info" :loading="loading" @click.stop="handleConfirm">保存</van-button>
        <!-- <van-button class="record-btn" type="info" :loading="loading" v-if="!sId" style="margin-left: 1rem; word-break: keep-all;" @click.stop="handleConfirmRecord">保存并添加咨询记录</van-button> -->
      </div>
    </van-form>
  </div>
</template>

<script>
import { branchUnitTree, getSchoolMarketAreaApi, getRoleMarketAreaApi } from '@/api/potentialGuest/studentInfoEdit'
import { departmentSeaApi } from '@/api/potentialGuest/consultation'
import { getFmCollectionCodeIdListApi, addCourseApi, getCoursePacketApi, getCoursePacketAddressApi, editCourseApi, getCoursePacketDetailApi } from '@/api/potentialGuest/course'
import { commonCaspasgeApi, commonCascadeApi } from '@/api/common'
import { getTopBranchIdApi, getDynamicDetailApi } from '@/api/potentialGuest/order'

import VerifyFunc from '@/utils/verify'
import { mapState, mapMutations } from 'vuex'
import dayjs from 'dayjs'
import { Notify } from 'vant'
export default {
  name: 'StudentInfoEdit',
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
  },
  data() {
    return {
      marketRoleFlag: true, // 是否-权限下的市场区域列表
      originalMarketAreaId: null, // 原市场区域选择id
      loading: false,
      // 活动，讲座的
      isExpend: true,
      repetitionName: '',
      sId: null,
      // eId: null,
      shellList: [], // 所属分校
      departList: [], // 所属部门
      areaList: [], // 市场区域
      VerifyFunc: VerifyFunc,
      listQuery: {
        branchId: null,
        cooperationType: 0,
        crmMarketAreaId: null,
        coursePacketIds: [{
          classAddressId: null,
          omOrderCoursePacketId: null,
          coursePacketList: [],
          coursePacketAddressList: []
        }],
        dormitory: null,
        fmCollectionCodeId: null,
        isPost: '1',
        orderAmount: null,
        orderDept: null,
        selfServiceOrderMaterials: null,
        studentConfirm: null,
        tuitionStatus: null,
        orderArea: null,
        educationRemark: null,
        discountExplain: null,
        giveClassHour: null,
        serviceCommitment: null
      },
      coursePacketIds: [],
      fmIsRequired: true,
      achievementAreaList: [],
      fmCollectionCodeIdList: [],
      tuitionStatusList: [],
      tuitionStatusObj: {},
      param: {
        sysShellId: 1, // 事业部id
        sysInfoId: this.currentSystemId, // 系统id
        sysType: 1, // 系统类型：1erp，2智能云
        types: [1, 2, 3]
      }, // 字段类型：1学生基本信息，2报名订单信息，3电子收据信息
    }
  },
  async created() {
    this.handleInitApi()
    this.handleDetail()
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  watch: {
    loading(val) {
      this.$loading(val, 'StudentInfoEdit')
    }
  },
  computed: {
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id,
      schoolTypeList: state => state.common.setting.schoolTypeList,
      isRequireStudent: state => state.common.setting.isRequireStudent,
      allProvicesAndCitys: state => state.common.setting.allProvicesAndCitys,
      examYearText: state => state.common.setting.examYearText,
      isRequireYear: state => state.common.setting.isRequireYear,
      consultTypeList: state => state.consultation.registerJobList,
      roleFlag: state => state.common.user.info.roleFlag,
    }),

  },
  methods: {
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
    ...mapMutations('course/', ['SET_UPDATEFLAG', 'SET_COURSEID']),
    handleOpen() {
      this.handleResetCoursePacketId()
    },
    // 过滤数组 type: id 数组id
    handleFilterList(id) {
      return new Promise((resolve) => {
        let arr = this.listQuery.coursePacketIds.map(v => v.omOrderCoursePacketId)
        if (!id) {
          resolve(this.coursePacketIds.filter(v => !arr.includes(v.id)) || [])
        } else {
          resolve(this.coursePacketIds.filter(v => !arr.includes(v.id) || v.id == id) || [])
        }
      })
    },

    handleResetCoursePacketId() {
      this.listQuery.coursePacketIds.forEach((v => {
        this.handleFilterList(v.omOrderCoursePacketId).then(res => {
          this.$set(v, 'coursePacketList', res)
        })
      }))
    },

    handleAddDetail() {
      this.handleFilterList().then(res => {
        this.listQuery.coursePacketIds.push({
          classAddressId: null,
          omOrderCoursePacketId: null,
          coursePacketList: res,
          coursePacketAddressList: []
        })
      })
    },

    handleDel(index) {
      console.log('删除中...', index);
    },

    handleDelCourse(index) {
      this.listQuery.coursePacketIds.splice(index, 1)
      this.handleResetCoursePacketId()
    },



    handleCourseId(e, index) {
      if (e) {
        // 获取对应课程包下面的上课地点
        getCoursePacketAddressApi(e).then(res => {
          this.$set(this.listQuery.coursePacketIds[index], 'coursePacketAddressList', res.data || [])
          this.$set(this.listQuery.coursePacketIds[index], 'classAddressId', null)
        })
      } else {
        // 清空上课地点
        this.$set(this.listQuery.coursePacketIds[index], 'coursePacketAddressList', [])
        this.$set(this.listQuery.coursePacketIds[index], 'classAddressId', null)
      }
      this.handleResetCoursePacketId()
    },


    handleCrmMarketAreaChange(val) {
      this.handleResetFmCollectionCodeId()
      val && this.handleGetFmCollectionCodeIdList(val)
    },
    handleResetFmCollectionCodeId() {
      this.$set(this.listQuery, 'fmCollectionCodeId', null)
      this.fmCollectionCodeIdList = []
    },

    //  获取账号名称列表
    handleGetFmCollectionCodeIdList(id) {
      getFmCollectionCodeIdListApi(id).then(res => {
        this.fmCollectionCodeIdList = res.data || []
      })
    },

    handlemarketAreaSelect(val) {
      if (this.marketRoleFlag) this.originalMarketAreaId = val
    },

    getSchoolMarketArea(schoolId) {
      this.marketRoleFlag = false
      let branchId = null
      if (this.roleFlag !== 2) {
        if (this.listQuery.branchId) {
          branchId = this.listQuery.branchId
        } else { this.$fm('请先选择所属分校!'); return }
      }
      getSchoolMarketAreaApi(schoolId, branchId).then(res => {
        if (res.data && res.data.length) {
          this.areaList = res.data || []
          const find = this.areaList.find(v => v.id === this.originalMarketAreaId)
          if (find) {
            this.$set(this.listQuery, 'crmMarketAreaId', find.id)
            this.$set(this.listQuery, 'crmMarketAreaText', find.title)
          } else {
            const findMarketAreaId = this.areaList.find(v => v.id === this.listQuery.crmMarketAreaId)
            if (findMarketAreaId) return
            if (res.data.length === 1) {
              this.$nextTick(() => {
                this.$set(this.listQuery, 'crmMarketAreaId', res.data[0].id)
                this.$set(this.listQuery, 'crmMarketAreaText', res.data[0].title)
              })
            } else {
              this.$set(this.listQuery, 'crmMarketAreaId', null)
              this.$set(this.listQuery, 'crmMarketAreaText', '')
            }
          }
        } else {
          if (this.listQuery.goSchoolId !== schoolId) {
            this.getSchoolMarketArea(this.listQuery.goSchoolId)
          } else this.useGetRoleMarketAreaOption()
        }
      })
    },

    // 根据当前用户角色获取市场区域列表(非市场表示需要传所属分校)
    useGetRoleMarketAreaOption() {
      this.marketRoleFlag = true
      const sysShellId = ['Active', 'Register'].includes(this.potentialType) ? this.dataLists ? this.dataLists.shellids : null : this.listQuery.branchId ? this.listQuery.branchId : null
      if (sysShellId) {
        getRoleMarketAreaApi(sysShellId).then(res => {
          this.areaList = res.data || []
          if (!this.areaList.length) {
            this.$fm('请联系校长助理为你分配市场区域才能正常使用系统相关功能!', 5000)
          }
          if (this.originalMarketAreaId) {
            const index = this.areaList.findIndex(v => v.id === this.originalMarketAreaId)
            if (index !== -1) {
              this.$set(this.listQuery, 'crmMarketAreaId', this.originalMarketAreaId)
            } else {
              this.originalMarketAreaId = null
              this.$set(this.listQuery, 'crmMarketAreaId', null)
              this.$set(this.listQuery, 'crmMarketAreaText', null)
            }
          } else if (res.data.length === 1) {
            this.$nextTick(() => {
              this.$set(this.listQuery, 'crmMarketAreaId', res.data[0].id)
              this.$set(this.listQuery, 'crmMarketAreaText', res.data[0].title)
            })
          } else {
            this.$set(this.listQuery, 'crmMarketAreaId', null)
            this.$set(this.listQuery, 'crmMarketAreaText', null)
          }
        })
      }
    },

    handleDetail() {
      const { id } = this.$route.params
      if (id !== 'null') {
        this.$loading(true, 'courseDetail')
        getCoursePacketDetailApi(id).then(res => {
          if (res.data) {
            const { branchId, crmMarketAreaId, dormitory, fmCollectionCodeId,
              isPost, orderAmount, orderDept, orderArea, selfServiceOrderMaterials,
              studentConfirm, tuitionStatus, educationRemark, discountExplain, giveClassHour, serviceCommitment,
              orderPackets
            } = res.data
            let coursePacketIds = []
            let obj = { shellId: branchId }
            getCoursePacketApi(obj).then(res => {
              this.coursePacketIds = res.data || []
              if (orderPackets && orderPackets.length) {
                // 循环获取上课地点
                for (let i = 0; i < orderPackets.length; i++) {
                  getCoursePacketAddressApi(orderPackets[i].omOrderCoursePacketId).then(newRes => {
                    coursePacketIds.push({
                      classAddressId: orderPackets[i].classAddressId,
                      omOrderCoursePacketId: orderPackets[i].omOrderCoursePacketId,
                      coursePacketList: res.data || [],
                      coursePacketAddressList: newRes.data || []
                    })
                  })
                }
              }
              this.listQuery = {
                branchId,
                crmMarketAreaId,
                dormitory,
                fmCollectionCodeId,
                isPost: [0, 1].includes(isPost) ? isPost.toString() : null,
                orderAmount,
                orderDept,
                orderArea,
                selfServiceOrderMaterials,
                studentConfirm,
                tuitionStatus,
                coursePacketIds,
                id,
                educationRemark,
                discountExplain,
                giveClassHour,
                serviceCommitment
              }
            })

            // 获取所属部门下拉列表
            departmentSeaApi(branchId).then(res => {
              this.departList = res.data || []
              if (res.data.length === 1) {
                this.listQuery.orderDept = res.data[0].value
              }
            })

            // 获取市场区域下拉列表
            getRoleMarketAreaApi(branchId).then(res => {
              this.areaList = res.data || []
            })
            this.$loading(false, 'courseDetail')
          }
        })
      }
    },

    handleInitApi() {

      // 所属分校
      branchUnitTree().then(res => {
        this.shellList = res.data || []
        if (this.shellList.length === 1 && !this.shellList[0].hasChildren) {
          this.listQuery.branchId = this.shellList[0].id
          if (this.roleFlag !== 2) this.handleSysShellId(this.shellList[0].id)
        }
      })

      // 业绩区域
      commonCaspasgeApi('orderArea').then(res => {
        if (!res || !res.data || !res.data.length) return
        this.achievementAreaList = res.data.map(item => {
          return { title: item.text, id: item.id }
        })
      })

      // 学费缴纳状态
      commonCascadeApi('xfjnzt').then(res => {
        let newArr = (res.data || []).map(element => {
          return {
            id: element.id,
            title: element.text
          }
        });
        this.tuitionStatusList = newArr
      })
    },




    handleSysShellId(e) {
      this.listQuery.orderDept = null
      this.departList = []
      this.listQuery.crmMarketAreaId = null
      this.areaList = []
      if (e) {
        this.listQuery.orderDept = ''
        if (this.listQuery.branchId) {
          departmentSeaApi(this.listQuery.branchId).then(res => {
            this.departList = res.data || []
            if (res.data.length === 1) {
              this.listQuery.orderDept = res.data[0].value
            }
          })
        }
        this.useGetRoleMarketAreaOption()

        // 获取对应的课程包
        let obj = { shellId: e }
        getCoursePacketApi(obj).then(res => {
          this.listQuery.coursePacketIds = [{
            classAddressId: null,
            omOrderCoursePacketId: null,
            coursePacketList: [...res.data] || [],
            coursePacketAddressList: []
          }]
          this.coursePacketIds = res.data || []
        })

        // 获取动态信息判断学费缴纳状态
        this.initDyColumn(e).then((res) => {
          this.tuitionStatusObj = res && res.data && res.data.tuitionStatus || {}

        })
      } else {
        this.departList = []
        this.listQuery.orderDept = null
        this.areaList = []
      }
    },

    handleSetCoursePacket() {

    },

    handleExpend() {
      this.isExpend = !this.isExpend
    },
    handleConfirm() {
      this.$refs.recordForm.validate().then(() => {
        const { id } = this.$route.params
        //  添加
        if (id === 'null') {
          this.loading = true
          addCourseApi(this.listQuery).then(res => {
            this['SET_UPDATEFLAG']({ isAddUpdate: true, addUpdateId: res.data })
            Notify({ type: 'success', message: '添加成功!' })
            this.handleBack()
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = true
          editCourseApi(this.listQuery).then(res => {
            this['SET_COURSEID']({ courseId: id })
            console.log('id', id);
            Notify({ type: 'success', message: '编辑成功!' })
            this.handleBack()
          }).catch(() => {
            this.loading = false
          })
        }

      }).catch(err => {
        let orderAmount = err.find(item => item.name === 'orderAmount')
        if (orderAmount) this.$fm(`${orderAmount.message}`)
      })
    },

    handleBack() {
      setTimeout(() => {
        this.loading = false
        this.$router.go(-1)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>