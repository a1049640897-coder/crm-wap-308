<!-- 头部统计 -->
<template>
  <div class="header-total-box">
    <div class="header-top">
      <div class="header-title" v-if="listType == 'EnrollmentOrder'">
        <div class="title-lf">数据统计</div>
        <div class="title-rt">单位/万元</div>
      </div>
      <div class="header-title title-color-bule" v-if="listType == 'EnrollmentCollection'">
        <div>
          合计收款： {{countNum | moneyWOnlyFilter}}万元
        </div>
      </div>
    </div>
    <div class="header-bottom" v-if="listType == 'EnrollmentOrder' ">
      <div class="header-num">
        <div class="item-num" v-for="(item,index) in totalList" :key="index">
          <div class="num-top">
            {{filterData(item.key) | moneyWOnlyFilter}}
          </div>
          <div class="num-bottom" :style="`color:${item.color}`">
            {{item.title}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    countObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    listType: String,
    countNum: Number
  },
  name: 'HeaderNum',
  data() {
    return {
      totalList: [
        {
          title: '订单',
          key: 'orderTotal',
          color: '#D7D7D7'
        },
        {
          title: '应收',
          key: 'totalOrderAmount',
          color: '#D7D7D7'
        },
        {
          title: '已收',
          key: 'totalAmountReceived',
          color: '#D7D7D7'
        },
        {
          title: '余款',
          key: 'totalBalance',
          color: '#F56C6C'
        },
        {
          title: '退款',
          key: 'refundPrice',
          color: '#E6A23C'
        }
      ]
    }
  },

  watch: {

  },

  methods: {
    // 头部数据统计处理
    filterData(val) {
      if (this.countObj[val]) {
        return this.countObj[val]
      } else {
        return 0
      }
    },
  }
}

</script>
<style lang='scss' scoped>
@import './index.scss';
</style>