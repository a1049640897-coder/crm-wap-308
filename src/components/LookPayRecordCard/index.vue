<template>
  <div class="student-card common-list-contain">
    <div class="student-base">
      <div class="student-header common-list-contain">
        <div class="SH-l">
          <div class="SH-name">支付明细{{index + 1}}</div>
        </div>
        <div class="SH-r" v-if="!studentData.verificationState">
          <div class="SH-r-icon" @click.stop="handleEdit">
            <img class="SH-r-icon" src="@/assets/images/icons/recordEdit.png" alt="">
          </div>
        </div>
      </div>

      <div class="student-info common-list-contain" style="padding-top: 0; padding-bottom: 0;">
        <!-- 报名课程包 -->
        <div class="student-info-item" v-for="(item ,index ) in dataList" :key="index">
          <div class="info-item">
            {{item.title}} <span :style="`color:${item.color}`">{{item.val}}</span>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    studentData: {
      required: true,
      default: () => { }
    },
    index: Number,
  },

  data() {
    return {

    }
  },


  computed: {
    ...mapState({
      payModeList: state => state.common.global.payModeList,
    }),
    dataList() {
      console.log('65666', this.studentData);
      return [
        { title: '支付类型:', val: (this.payModeList.find(v => v.id == this.studentData.paymentType) || {}).title },
        { title: '支付金额:', val: this.studentData.paymentAmount },
        { title: '支付时间:', val: this.studentData.payTime },
        { title: '财务备注:', val: this.studentData.remark },
        { title: '核销状态:', val: this.studentData.verificationState ? '已核销' : '未核销', color: this.studentData.verificationState ? '' : '#0088fe' },
        { title: '未核销备注:', val: this.studentData.verificationRemark },
        { title: '核销人:', val: this.studentData.verificationName },
        { title: '核销时间:', val: this.studentData.verificationTime },
      ]
    }
  },
  methods: {
    handleEdit() {
      this.$emit('onCompelete', this.studentData.id)
    },
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>