<template>
  <div>
    <div class="ele-contain">
      <div class="electronic-receipt-wrap" ref="receiptRef">
        <van-loading class="base-loading" color="#0094ff" v-if="loading" vertical>加载中,请稍后...</van-loading>
        <div v-else>
          <!-- eslint-disable-next-line -->
          <div v-if="receiptInfo.pay">
            <div v-for="(item, index) in receiptInfo.pay" :key="item.id" style="margin-bottom:20px;">
              <div class="title">{{receiptInfo && receiptInfo.receiptTitle && receiptInfo.receiptTitle !== null ? receiptInfo.receiptTitle : '电子收据'}}</div>
              <div class="receopt-wrap">
                <div class="flexR the-topNum">
                  <div>
                    <span class="color">学生姓名：</span>
                    <span>{{ receiptInfo.studentName }}</span>
                  </div>
                  <div>
                    <span class="color" style="padding-left:10px;">收据号：</span>
                    <span>{{ item.receiptNo }}</span>
                  </div>
                  <div>
                    <span class="color">开票日期：</span>
                    <span>{{ item.billingDate }}</span>
                  </div>
                </div>
                <div class="main">
                  <div class="kecheng-wrap">
                    <div class="kc-title">
                      <div style="flex:1;display:flex;">
                        <div class="color padding flexR borderRight" style="width:56px;">序号</div>
                        <div class="color k-t padding flexR">报名课程包</div>
                      </div>
                      <div class="kc-money color borderLeft">
                        <div class="borderBottom" style="text-align:center;">
                          <div class="padding">本次收款（小写）</div>
                        </div>
                        <ul class="unit-title color">
                          <li>十</li>
                          <li class="borderLeft">万</li>
                          <li class="borderLeft">千</li>
                          <li class="borderLeft">百</li>
                          <li class="borderLeft">十</li>
                          <li class="borderLeft">元</li>
                          <li class="borderLeft">角</li>
                          <li class="borderLeft">分</li>
                        </ul>
                      </div>
                    </div>
                    <div class="kecheng-content borderTop">
                      <div class="ke-c-l">
                        <div class="k-t" :class="{ borderTop: indexPackage !== 0 }" v-for="( itemPackage,indexPackage) in receiptInfo.coursePackage" :key="indexPackage">
                          <!-- <div v-if="!itemPackage.isChange || itemPackage.isChange !== 1"> -->
                          <div class="borderRight padding" style="width:56px;">{{ indexPackage + 1 }}</div>
                          <div class="padding">{{ itemPackage.coursePacketTitle }}<span v-if="fidldList.includes('classLocations')">({{itemPackage.classAddressTitle || '-'}})</span></div>
                        </div>
                        <!-- </div> -->
                      </div>
                      <ul class="unit-title borderLeft" v-if="item.splitMoneyObj">
                        <li>{{ item.splitMoneyObj.sw }}</li>
                        <li class="borderLeft">{{ item.splitMoneyObj.w }}</li>
                        <li class="borderLeft">{{ item.splitMoneyObj.q }}</li>
                        <li class="borderLeft">{{ item.splitMoneyObj.b }}</li>
                        <li class="borderLeft">{{ item.splitMoneyObj.s }}</li>
                        <li class="borderLeft">{{ item.splitMoneyObj.y }}</li>
                        <li class="borderLeft">{{ item.splitMoneyObj.j }}</li>
                        <li class="borderLeft">{{ item.splitMoneyObj.f }}</li>
                      </ul>
                    </div>
                  </div>
                  <div class="borderTop padding" v-if="fidldList.includes('courseDetails')">
                    <span class="color">课程明细：</span>
                    <span v-for="(itemCourses,indexCourses) in receiptInfo.courses" :key="itemCourses.id">{{itemCourses.title}}<span v-show="indexCourses !== receiptInfo.courses.length -1">、</span></span>
                  </div>
                  <div class="borderTop flex">
                    <div class="padding" style="width: 50%;">
                      <span class="color">本次收款（大写）：</span>
                      <span>{{ changeMoneyToChinese(item.collectedAmount) }}</span>
                    </div>
                    <div class="padding" style="width: 50%;border-left: 2px solid rgba(175, 95, 95, 100);">
                      <span class="color">缴费类型：</span>
                      <span>{{ item.type ? item.type === 1 ? '预交': item.type === 2 ? '全款' : '补交' : '-' }}</span>
                    </div>
                  </div>
                </div>
                <table class="dynamic">
                  <div class="line"></div>
                  <div class="selfWidth" v-if="fidldList.includes('phoneNumber')">
                    <span class="color">手机号码：</span>
                    <span>{{ receiptInfo.phoneNumber || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('actualName')">
                    <span class="color">真实姓名：</span>
                    <span>{{ receiptInfo.actualName || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('qq')">
                    <span class="color">QQ：</span>
                    <span>{{ receiptInfo.qq || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('weChat' )">
                    <span class="color">微信：</span>
                    <span>{{ receiptInfo.weChat || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('sex')">
                    <span class="color">性别：</span>
                    <span>{{ receiptInfo.sex === 1 ? '男':receiptInfo.sex === 2 ? '女' : '-'}}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('idNumber')">
                    <span class="color">身份证号码：</span>
                    <span>{{ receiptInfo.idNumber || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('yearGraduate')">
                    <span class="color">毕业年份：</span>
                    <span>{{ receiptInfo.yearGraduate || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('grade')">
                    <span class="color">所在年级：</span>
                    <span>{{ receiptInfo.gradeName || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('currentEducation')">
                    <span class="color">当前学历：</span>
                    <span>{{ receiptInfo.currentEducation || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('currentSchool')">
                    <span class="color">就读学校：</span>
                    <span>{{ receiptInfo.commonSchoolInfo | commonSchoolMajor('school')}}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('currentProfession')">
                    <span class="color">就读专业：</span>
                    <span>{{ receiptInfo.commonSchoolInfo | commonSchoolMajor('major')}}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('city')">
                    <span class="color">所在城市：</span>
                    <span>{{ receiptInfo.city || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('source')">
                    <span class="color">来源渠道：</span>
                    <span>{{ receiptInfo.source || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('examYear')">
                    <span class="color">{{studyYear}}：</span>
                    <span>{{ receiptInfo.examYear || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('examMonth')">
                    <span class="color">{{currentSystemId == 50 ? '入学月份':'考试月份'}}：</span>
                    <span>{{ receiptInfo.examMonth || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('registerUnit')">
                    <span class="color">备考地区：</span>
                    <span>{{ receiptInfo.registerUnit || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('registerJob')">
                    <span class="color">报考岗位专业：</span>
                    <span>{{ receiptInfo.registerJob || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('registrationDistrictNotice')">
                    <span class="color">报考公告：</span>
                    <span>{{ receiptInfo.registrationDistrictNotice || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('applySchool')">
                    <span class="color">报考学校：</span>
                    <span>{{ receiptInfo.otherSchoolInfo | commonSchoolMajor('school')}}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('applyMajor')">
                    <span class="color">报考专业：</span>
                    <span>{{ receiptInfo.otherSchoolInfo | commonSchoolMajor('major')}}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('applyArea')">
                    <span class="color">报考地区：</span>
                    <span>{{ receiptInfo.applyArea || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('applySuject')">
                    <span class="color">报考科目：</span>
                    <span>{{ receiptInfo.applySuject || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('applyUnit')">
                    <span class="color">报考单位：</span>
                    <span>{{ receiptInfo.applyUnit || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('applyPosition')">
                    <span class="color">报考职位：</span>
                    <span>{{ receiptInfo.applyPosition || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('intentSchool')">
                    <span class="color">意向学校：</span>
                    <span>{{ receiptInfo.intentSchool || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('intentFaculty')">
                    <span class="color">意向院系：</span>
                    <span>{{ receiptInfo.intentFaculty || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('intentMajor')">
                    <span class="color">意向专业：</span>
                    <span>{{ receiptInfo.intentMajor || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('intendedTargetInstitutions' )">
                    <span class="color">意向目标院系：</span>
                    <span>{{ receiptInfo.intendedTargetInstitutions || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('intendedTargetSpecialty' )">
                    <span class="color">意向目标专业：</span>
                    <span>{{ receiptInfo.intendedTargetSpecialty || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('writtenCertificate')">
                    <span class="color">资格证笔试是否通过：</span>
                    <span>{{ receiptInfo.writtenCertificate ? receiptInfo.writtenCertificate == 0 ? '否' : '是' : '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('interviewCertificate' )">
                    <span class="color">资格证面试是否通过：</span>
                    <span>{{ receiptInfo.interviewCertificate ? receiptInfo.interviewCertificate == 0 ? '否' : '是' : '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('recommender')">
                    <span class="color">推荐人：</span>
                    <span>{{ receiptInfo.recommender || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('remark')">
                    <span class="color">备注：</span>
                    <span>{{ receiptInfo.remark || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('mailingAddress')">
                    <span class="color">通讯地址：</span>
                    <span>{{ receiptInfo.mailingAddress || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('emergencyName')">
                    <span class="color">紧急联系人姓名：</span>
                    <span>{{ receiptInfo.emergencyName || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('emergencyPhone')">
                    <span class="color">紧急联系人电话：</span>
                    <span>{{ receiptInfo.emergencyPhone || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('emergencyAddress')">
                    <span class="color">紧急联系人地址：</span>
                    <span>{{ receiptInfo.emergencyAddress || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('emergencyRelation')">
                    <span class="color">紧急联系人与学生关系：</span>
                    <span>{{ receiptInfo.emergencyRelation || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('deliveryInfo')">
                    <span class="color">收货人：</span>
                    <span>{{ receiptInfo.deliveryInfo && receiptInfo.deliveryInfo.acceptName || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('deliveryInfo')">
                    <span class="color">收货手机：</span>
                    <span>{{ receiptInfo.deliveryInfo && receiptInfo.deliveryInfo.phone || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('deliveryInfo')">
                    <span class="color">收货地区：</span>
                    <span>{{ receiptInfo.deliveryInfo && receiptInfo.deliveryInfo.areaTitle || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('deliveryInfo')">
                    <span class="color">收货地址：</span>
                    <span>{{ receiptInfo.deliveryInfo && receiptInfo.deliveryInfo.address || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('normalStudents')">
                    <span class="color">是否师范生：</span>
                    <span>{{ receiptInfo.normalStudents === 1 ? '是' : receiptInfo.normalStudents === 0 ? '否' : '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('typeCertificate')">
                    <span class="color">资格证类型：</span>
                    <span>{{ receiptInfo.typeCertificateName || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('interviewCondition')">
                    <span class="color">面试情况：</span>
                    <span>{{ receiptInfo.interviewCondition === 1 ? '需面试' : receiptInfo.interviewCondition === 2 ? '无面试' : '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('applyDate')">
                    <span class="color">报名日期：</span>
                    <span>{{ receiptInfo.applyDate || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('orderStatus')">
                    <span class="color">订单状态：</span>
                    <span>{{ receiptInfo.orderStatus ? receiptInfo.orderStatus === 1 ? '待支付' : receiptInfo.orderStatus === 2 ? '有余款': receiptInfo.orderStatus === 3 ? '已交清': receiptInfo.orderStatus === 4 ? '已取消': receiptInfo.orderStatus === 5 ? '已退款' : '需退款' : '-'}}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('orderAmount')">
                    <span class="color">订单金额：</span>
                    <span>{{ receiptInfo.orderAmount || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('materialCost')">
                    <span class="color">材料费（应收金额中已含）：</span>
                    <span>{{ receiptInfo.materialCost || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('discountPrice')">
                    <span class="color">优惠金额：</span>
                    <span>{{ receiptInfo.discountPrice || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('otherPrice')">
                    <span class="color">其他金额：</span>
                    <span>{{ receiptInfo.otherPrice || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('receivablePrice')">
                    <span class="color">应收金额：</span>
                    <span>{{ receiptInfo.receivablePrice || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('receivedPrice')">
                    <span class="color">已收金额：</span>
                    <span>{{ receiptInfo.receivedPrice || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('refundPrice')">
                    <span class="color">退款金额：</span>
                    <span>{{ receiptInfo.refundPrice || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('actualPrice')">
                    <span class="color">实收金额：</span>
                    <span>{{ receiptInfo.actualPrice || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('balancePrice')">
                    <span class="color">余款：</span>
                    <span>{{ receiptInfo.balancePrice || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('performanceArea')">
                    <span class="color">业绩区域：</span>
                    <span>{{ receiptInfo.performanceArea || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('writtenExaminationResults')">
                    <span class="color">笔试成绩：</span>
                    <span>{{ receiptInfo.writtenExaminationResults || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('writtenExaminationRanking')">
                    <span class="color">笔试排名：</span>
                    <span>{{ receiptInfo.writtenExaminationRanking || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('jobsEnrolmentNumber')">
                    <span class="color">报考岗位招生人数：</span>
                    <span>{{ receiptInfo.jobsEnrolmentNumber || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('serviceArea' )">
                    <span class="color">学员服务区域：</span>
                    <span>{{ receiptInfo.serviceArea || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('discountLegend')">
                    <span class="color">优惠说明：</span>
                    <span>{{ receiptInfo.discountLegend || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('postInfo')">
                    <span class="color">是否需要邮寄资料：</span>
                    <span>{{ receiptInfo.postInfo === 0 ? '否': receiptInfo.postInfo === 1 ? '是':'-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('postReceive')">
                    <span class="color">资料领取：</span>
                    <div v-if="receiptInfo.postReceive.length">
                      <span v-for="(itemReceive,indexReceive) in receiptInfo.postReceive" :key="itemReceive.id">{{itemReceive.title}}{{itemReceive.state ? '-' : ''}}{{itemReceive.state ? itemReceive.state === 1 ? '未领': itemReceive.state === 2 ? '已领' : itemReceive.state === 3 ? '不领' : '未知':''}}<span v-show="indexReceive !== receiptInfo.postReceive.length - 1">、</span></span>
                    </div>
                    <span v-else>-</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('stayWhether')">
                    <span class="color">是否住宿：</span>
                    <span>{{ receiptInfo.stayWhether === 0 ? '否': receiptInfo.stayWhether === 1 ? '是':'-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('academicRemarks')">
                    <span class="color">教务备注：</span>
                    <span>{{ receiptInfo.academicRemarks || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('donatedHours')">
                    <span class="color">赠送课时：</span>
                    <span>{{ receiptInfo.donatedHours || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('majorChange')">
                    <span class="color">专业变更：</span>
                    <span>{{ receiptInfo.majorChange || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('pledge')">
                    <span class="color">服务承诺：</span>
                    <span>{{ receiptInfo.pledge || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('publicPledge')">
                    <span class="color">公共课服务承诺：</span>
                    <span>{{ receiptInfo.publicPledge || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('majorPledge')">
                    <span class="color">专业课服务承诺：</span>
                    <span>{{ receiptInfo.majorPledge || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('introduce')">
                    <span class="color">转介绍情况：</span>
                    <span>{{ receiptInfo.introduce || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('examSuject')">
                    <span class="color">考试科目：</span>
                    <span>{{ receiptInfo.examSuject || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('studentRemarks')">
                    <span class="color">学生备注：</span>
                    <span>{{ item.studentRemark || '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('manager')">
                    <span class="color">经办人：</span>
                    <span>{{ item.alias ? item.alias : item.operateName ? item.operateName : '-' }}</span>
                  </div>
                  <div class="selfWidth" v-if="fidldList.includes('changeInformation')">
                    <span class="color">变更备注：</span>
                    <span>{{ item.changeInformation || '-' }}</span>
                  </div>
                  <!-- <div class="selfWidth" v-if="selfWidthShow" style="border-left:none;">
              <span class="color" style="color:#fff0;">-</span>
            </div> -->
                </table>
                <!--  v-if="item.receiptState && item.receiptState === 0 " -->
                <img src="@/assets/images/icons/cancellation.png" class="imgState" v-if="receiptInfo.receiptState == 0" alt />
                <div class="flexR unitPay">
                  <div style="position:absolute;right:0;" v-if="fidldList.includes('payUnit')">
                    <span class="color">收款单位：</span>
                    <span>{{ item.payUnit }}</span>
                    <div class="canvas-wrap">
                      <canvas :id="`canvas_${index}`" width="160" height="160"></canvas>
                    </div>
                  </div>
                </div>
                <div class="main" :style="{'margin-top':fidldList.includes('payUnit')? '50px':'10px'}" v-if="fidldList.includes('applyNotice')">
                  <div class="padding borderBottom">
                    <span class="color">报名须知</span>
                  </div>
                  <div class="borderTop padding ql-snow ql-container" style="border:none;">
                    <div class="ql-editor" v-html="receiptInfo.applyNotice"></div>
                  </div>
                </div>
                <!-- <div class="time-wrap">
                <span>{{ time }}</span>
              </div> -->
                <div class="footer-btn">
                  <van-button @click="handleDestory(0)" class="btn-class" type="danger" plain :loading="onLoading" v-if="receiptInfo.receiptState !== 0">作废</van-button>
                  <van-button @click="handleDestory(1)" class="btn-class" type="danger" plain :loading="onLoading" v-else>撤销作废</van-button>
                  <van-button type="info" class="btn-class" @click.stop="handleSendMsg" :loading="onLoading">发送短信</van-button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="default-img">
            <img src="@/assets/images/icons/default.png" style="width:33vw;" alt />
            <div style="color:#999;margin-top:36px;">链接已失效</div>
          </div>
        </div>
      </div>
      <!-- 底部弹窗 -->
    </div>
    <CommonBottomToast :isShow="isShow" :titleList="title" type="elet" height="25%" @onConfirm="handleConfirm" @onClose="handleClose" />
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { getInformationaApi, fieldConfigDetailApi, sendMsgApi, invalidReceiptNumberApi, undoInvalidReceiptNumberApi } from "@/api/potentialGuest/order"
import dayjs from 'dayjs'
import { splitMoney, changeMoneyToChinese, resizeScreen } from '@/utils/index.js'
import { Button, Sticky, Loading, Notify, Dialog } from "vant"
import { getCascadeSelectDataApi } from "@/api/common"
import { mapState } from 'vuex'
export default {
  components: {
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Loading.name]: Loading,
    CommonBottomToast: () => import('@/components/CommonBottomToast'),
  },
  data() {
    return {
      loading: true,
      studyYear: '考试年份',
      fidldList: [], // 显示字段
      receiptInfo: {
        // 收款单位
        companyTitle: "",
        // 显示作废状态
        showReceiptState: false,
        // 开票日期
        createTime: '',
      },
      isVal: true,
      isRemark: false,
      timer: null,
      timerCanvas: null,
      time: null,
      changeMoneyToChinese,
      splitMoneyObj: {},
      onLoading: false,
      isShow: false,
      title: [],
      type: 0, // 0 发送短信标识 1作废标识
      deStoryFlag: 0, // 0 作废 1 撤销作废
    }
  },
  computed: {
    ...mapState({
      currentSystemId: state => state.common.systems.currentSystem.id
    }),
  },
  filters: {
    commonSchoolMajor(obj, tag) {
      if (obj && obj.extend) {
        let arr = []
        for (const key in obj.extend) {
          if (Object.hasOwnProperty.call(obj.extend, key)) {
            const element = obj.extend[key]
            if (tag === 'major' && [3, 4].includes(element.flag)) {
              arr.push(element.text)
            }
            if (tag === 'school' && element.flag === 2) {
              arr.push(element.text)
            }
          }
        }
        arr = arr.filter(v => v && v !== '-')
        return arr.length ? arr.join('/') : '-'
      } else return '-'
    }
  },

  async created() {
    // 获取令牌
    await this.getFieldList()
    this.getFormUserData()
  },
  mounted() {
    resizeScreen(this.$refs.receiptRef) // 横屏
    this.scrollToBottom()
    this.time = dayjs().format('YYYY-MM-DD hh:mm:ss')
    this.getCurrentTime()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 清除计时器
    }
  },
  methods: {
    handleDestory(val) {
      if (val) {
        this.title = ['撤销作废后收恢复正常状态，学生可凭借收据上课，您确定要撤销作废吗？']
      } else {
        this.title = ['作废后收据处于失效状态，学生将无法凭借收据上课，您确定要作废该收据吗？']
      }
      this.type = 1
      this.deStoryFlag = val
      this.isShow = true
    },

    async handleGetData() {
      const orderCode = this.$route.params.orderId
      this.onLoading = true
      const { status, data } = await getInformationaApi(orderCode)
      if (status === 200 && JSON.stringify(data) !== {}) {
        const { receiptState } = data.pay.find(v => v.id == this.$route.params.recordId) || {}
        this.$set(this.receiptInfo, 'receiptState', receiptState)
        this.onLoading = false
      }
    },
    handleConfirm() {
      this.onLoading = true
      if (!this.type) {
        sendMsgApi(this.$route.params.recordId, 'receipt').then(res => {
          if (res.status == 200) {
            Notify({
              type: 'success',
              message: '短信发送成功!'
            })
          } else {
            Notify({
              type: 'warning',
              message: '短信发送失败!'
            })
          }
          this.onLoading = false
        }).catch(() => {
          this.onLoading = false
        })
      } else {
        if (!this.deStoryFlag) {
          invalidReceiptNumberApi(this.$route.params.recordId).then(res => {
            if (res.status == 200) {
              Notify({
                type: 'success',
                message: '作废成功!'
              })
            } else {
              Notify({
                type: 'warning',
                message: '作废失败!'
              })
            }
            this.handleGetData()
            this.onLoading = false
          }).catch(() => {
            this.onLoading = false
          })
        } else {
          undoInvalidReceiptNumberApi(this.$route.params.recordId).then(res => {
            if (res.status == 200) {
              Notify({
                type: 'success',
                message: '撤销成功!'
              })
            } else {
              Notify({
                type: 'warning',
                message: '撤销失败!'
              })
            }
            this.handleGetData()
            this.onLoading = false
          }).catch(() => {
            this.onLoading = false
          })
        }
      }
      this.isShow = false
    },
    handleClose() {
      this.isShow = false
    },
    handleSendMsg() {
      // this.title = '添加完支付记录的同时系统已将链接发送到学生手机，您确定要再次发送吗？'
      // this.isShow = true
      this.type = 0
      this.handleConfirm()
    },

    scrollToBottom() {
      this.$nextTick(() => {
        var container = document.querySelector(".electronic-receipt-wrap");
        window.scrollTo(670, container.scrollWidth)
      })
    },

    async getFieldList() {
      /* const baseArr = baseInfoArray().map(cell => cell.callIndex)
      const enrollArr = enrollInfoArray().map(cell => cell.callIndex)
      const receiptArr = receiptInfoArray().map(cell => cell.callIndex) */
      const query = {
        sysShellId: Number(this.$route.params.branchId),//事业部id
        sysInfoId: this.currentSystemId,//系统id
        sysType: 1,//系统类型：1erp，2智能云
        types: [1, 2, 3],//字段类型：1学生基本信息，2报名订单信息，3电子收据信息
      }

      const { status, data } = await fieldConfigDetailApi(query)
      this.fidldList = []
      if (status === 200 && JSON.stringify(data) !== {}) {
        for (const key in data) {
          const element = data[key];
          if ([2, 3].includes(element.receipt)) {
            this.fidldList.push(element.callIndex)
          }
        }
        if (this.fidldList.includes('examYear')) {
          // 考试年份配置
          this.studyYear = localStorage.getItem('examYearTextStr')
        }
      }
    },
    /**
     * 初始化表单数据
     */
    async getFormUserData() {
      const orderCode = this.$route.params.orderId
      const { status, data } = await getInformationaApi(orderCode)
      if (status === 200 && JSON.stringify(data) !== {}) {
        this.receiptInfo = {
          ...data,
          sysInfoId: this.currentSystemId,
          studentBranchId: Number(this.$route.params.branchId),
          sysType: 1,
          fieldType: [1],
          extend: { ...data.studentExtend, ...data.potentialStudentExtend }
        }
        if (data.potentialStudentExtend) {
          this.receiptInfo = {
            ...this.receiptInfo,
            registerUnit: data.potentialStudentExtend.registerUnit,//备考地区
            registerJob: data.potentialStudentExtend.registerJob,//报考岗位专业
            interviewCertificate: data.potentialStudentExtend.interviewPass, //资格证面试是否通过
            writtenCertificate: data.potentialStudentExtend.writtenPass, //资格证笔试是否通过
            intentSchool: data.potentialStudentExtend.intentionSchool, //意向学校
            intentFaculty: data.potentialStudentExtend.intentionCollege,//意向院系
            intentMajor: data.potentialStudentExtend.intentionProfession//意向专业
          }
        }
        if (data.studentExtend) {
          this.receiptInfo = {
            ...this.receiptInfo,
            normalStudents: data.studentExtend.isNormal, //是否师范生：0否1是
            interviewCondition: data.studentExtend.interviewState, //面试情况：1需面试2无面试
            typeCertificate: data.studentExtend.qualificationType, // 资格证类型id
            typeCertificateName: data.studentExtend.qualificationTypeName //资格证类型名称
          }
        }
      } else this.receiptInfo = {}


      if (this.fidldList.includes('grade')) {
        this.getGradeCascadeSource() // 年级
      }
      if (this.receiptInfo.coursePackage && this.receiptInfo.coursePackage.length) {
        this.$set(this.receiptInfo, 'coursePackage', this.receiptInfo.coursePackage.filter(item => item.isNormal !== 1)) // 课程包是否正常
      }

      if (this.receiptInfo.courses && this.receiptInfo.courses.length) {
        this.$set(this.receiptInfo, 'courses', this.receiptInfo.courses.filter(item => item.state === 2)) // 课程包是否正常
      }
      if (this.receiptInfo.pay && this.receiptInfo.pay.length) {

        for (let index = 0; index < this.receiptInfo.pay.length; index++) {
          const element = this.receiptInfo.pay[index];
          this.$set(this.receiptInfo, 'companyTitle', element.payUnit)
          this.$set(this.receiptInfo, 'createTime', element.billingDate)
          // 本次收款/小写 赋值
          this.$set(element, 'splitMoneyObj', element.collectedAmount ? splitMoney(element.collectedAmount) : {})
          if (this.fidldList.includes('payUnit') && element.payUnit) {
            // 绘制公章
            this.getCanvas(index, element.payUnit, element.recordNo || '')
          }
          this.$set(element, 'imgState', element.receiptState === 0)
        }
      } else {
        this.$set(this.receiptInfo, 'companyTitle', '')
        this.$set(this.receiptInfo, 'createTime', '')
      }
      const { receiptState } = this.receiptInfo.pay.find(v => v.id == this.$route.params.recordId) || {}
      this.$set(this.receiptInfo, 'receiptState', receiptState)
      this.loading = false
    },
    /**
     * 请求所在年级
     * @request
     */
    async getGradeCascadeSource() {
      const res = await getCascadeSelectDataApi('sznj')
      if (!res) return
      const findVal = res.data.find(v => v.id === this.receiptInfo.grade)
      this.receiptInfo.gradeName = findVal ? findVal.text : null
    },
    getCurrentTime() { // 每秒获取一次当前时间
      this.timer = setInterval(_ => {
        this.time = this.getTime()
      }, 1000)
    },
    getTime() { // 获取当前时间
      return dayjs().format('YYYY-MM-DD hh:mm:ss')
    },
    getCanvas(index, companyName, internetNum) { // 绘制公章
      setTimeout(function () {
        var canvas = document.getElementById(`canvas_${index}`)
        var context = canvas.getContext('2d');
        // 绘制印章边框
        var width = canvas.width / 2;
        var height = canvas.height / 2;
        context.lineWidth = 2;
        // context.strokeStyle = 'blue';
        context.strokeStyle = 'red';
        context.beginPath();
        context.arc(width, height, 78, 0, Math.PI * 2);//宽、高、半径(半径用来跳转外圈的大小)
        context.stroke();
        //画五角星
        create5star(context, width, height, 25, 'red', 0);
        // 绘制印章名称
        context.textBaseline = 'middle';//设置文本的垂直对齐方式
        context.textAlign = 'center'; //设置文本的水平对对齐方式
        context.lineWidth = 1;
        context.translate(width, height);// 平移到此位置

        // 绘制印章单位
        var count = companyName.length;// 字数
        var angle = 4 * Math.PI / (3 * (count - 1));// 字间角度
        var chars = companyName.split("");
        var c;
        for (var i = 0; i < count; i++) {
          c = chars[i] // 需要绘制的字符
          if (i === 0) {
            context.rotate(5 * Math.PI / 6);
          } else {
            context.rotate(angle);
          }
          context.font = '18px Arial';
          context.save();
          context.translate(64, 0);// 平移到此位置,此时字和x轴垂直，公司名称和最外圈的距离
          context.fillStyle = '#FF0000'
          context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴
          context.fillText(c, 0, 0);// 此点为字的中心点
          context.restore();
        }

        // 绘制备案号
        var count = internetNum.length;// 字数
        var angle = 2 * Math.PI / (5 * (count - 1));// 字间角度
        var chars = internetNum.split("").reverse();
        var c;
        for (var i = 0; i < count; i++) {
          c = chars[i] // 需要绘制的字符
          if (i === 0) {
            context.rotate(6.8 * Math.PI / 6);
          } else {
            context.rotate(angle);
          }
          context.font = '10px Arial';
          context.save();
          context.translate(-68, 0);// 平移到此位置,此时字和x轴垂直，公司名称和最外圈的距离
          context.fillStyle = '#FF0000'
          context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴
          context.fillText(c, 0, 0);// 此点为字的中心点
          context.restore();
        }

        //绘制五角星
        function create5star(context, sx, sy, radius, color, rotato) {
          context.save();
          context.fillStyle = color;
          context.translate(sx, sy);//移动坐标原点
          context.rotate(Math.PI + rotato);//旋转
          context.beginPath();//创建路径
          var x = Math.sin(0);
          var y = Math.cos(0);
          var dig = Math.PI / 5 * 4;
          for (var i = 0; i < 5; i++) {//画五角星的五条边
            var x = Math.sin(i * dig);
            var y = Math.cos(i * dig);
            context.lineTo(x * radius, y * radius);
          }
          context.closePath();
          context.stroke();
          context.fill();
          context.restore();
        }
      }, 500)

    }

  }
}
</script>

<style lang='scss' scoped src='./index.scss'></style>
