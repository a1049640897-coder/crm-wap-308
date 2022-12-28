<!-- 底部弹窗 -->
<template>
  <div>
    <van-popup v-model="cIsShow" ref="popup" position="bottom" :class="'order-van-popup-box'" :closeable="isShowClose" :style="{ height: height }" :close-on-click-overlay="false" @close="handleCancel" get-container="#app">
      <div>
        <div :class="'form-header'">
          {{headerTitle}}
        </div>
        <div class="form">
          <div :class="'form-content'">
            <!-- {{title}} -->
            <div v-for="(item,index) in titleList " :key="index">
              {{item}}
            </div>
          </div>
          <div :class="'form-footer'">
            <van-button class="btn" native-type="buttton" @click.stop="handleCancel">{{btnLeftTitle}}</van-button>
            <van-button class="btn" type="info" native-type="buttton" @click.stop="handleSave" :loading="loading">{{btnRightTitle}}</van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    isShow: Boolean,
    height: {
      type: String,
      default: '25%'
    },
    titleList: Array,
    type: String, // type: 'elet' 电子收据
    headerTitle: {
      type: String,
      default: '温馨提示'
    },
    btnLeftTitle: {
      type: String,
      default: '取消'
    },
    btnRightTitle: {
      type: String,
      default: '确定'
    },
    isShowClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cIsShow: false,
      loading: false
    }
  },
  watch: {
    isShow: {
      handler(val) {
        this.cIsShow = val
        if (val) {
          if (this.type === 'elet') {
            this.$nextTick(() => {
              // setTimeout(() => {
              //   resizeScreen(this.$refs.commonBt)
              //   this.$refs.popup.$el.scrollLeft = 1000
              // })
            })
          }
        }
      }
    }
  },

  methods: {
    handleSave() {
      this.$emit('onConfirm')
    },
    handleCancel() {
      console.log('4544');
      this.$emit('onClose')
    }
  },
}

</script>
<style lang='scss' scoped>
@import './index.scss';
</style>