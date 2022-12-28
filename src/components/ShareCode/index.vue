<template>
  <van-overlay class="share-box" :show="isOpen" @click.stop="handleStopClose" z-index="99999">
    <van-icon class="close-btn" name="close" @click.stop="handleClose" />
    <div class="container" v-if="isOpen">
      <div v-show="imageCanvas" v-if="canvasShow" class="canvas_img" id="imgCanvas"></div>
      <div v-if="!imageCanvas" ref="saveToImage" class="box">
        <div class="header">
          <div class="hd-lf">
            <img src="~@/assets/images/avatar_02.png" alt="">
          </div>
          <!-- 活动模块 -->
          <div class="hd-rt" v-if="!['order','course'].includes(counselTab)">
            让您学有所成, 让教育成就梦想
          </div>
          <!-- 订单模块 -->
          <div class="hd-rt" v-else>
            嗨,请打开【支付宝】或【微信】扫码支付~
          </div>
        </div>

        <!-- 订单模块, 课程包模块 -->
        <div class="content" v-if="['order','course'].includes(counselTab)">
          <span class="round" style="left:-12px;"></span>
          <span class="round" style="right:-12px;"></span>
          <div class="ct-hd">
            <div class="hd-lf"><span>订单详情</span>
              <img :src="require('@/assets/images/tpLtBg.png')" />
            </div>
            <div class="hd-rt">
              <span class="color-blue" style="margin-right:1rem">{{filterState(resultObj.state, 2)}}</span>
            </div>
          </div>
          <div class="ct-box">
            <div class="ct-box-in" id="order-box">
              <div class="bx-tt">
                <span class="vertical_icon"></span>
                {{resultObj.coursePackets}}
              </div>
              <div class="bx-nb" v-if="['order'].includes(counselTab)">
                学生姓名: <span>{{resultObj.name}}</span>
              </div>
              <div class="bx-nb" v-if="['order'].includes(counselTab)">
                手机号码: <span>{{resultObj.mobile}}</span>
              </div>
              <div class="bx-nb" v-if="['course'].includes(counselTab)">
                编号: <span>{{resultObj.serialNumber}}</span>
              </div>
              <div class="bx-nb color-red">
                订单应收: ￥ <span>{{ resultObj.orderAmount }}</span>
              </div>
            </div>

            <div class="qr-wrapper" ref="ref_wrapper" v-if="!loading" :style="{'background': 'url('+ imgurl +')'}">
              <img :src="require('@/assets/jy.png')" height="20%" />
            </div>

            <div class="ft-tt" v-if="!loading">
              长按识别二维码
            </div>
          </div>
        </div>

        <!-- 活动模块 -->
        <div class="content" v-else>
          <span class="round" style="left:-12px;"></span>
          <span class="round" style="right:-12px;"></span>
          <div class="ct-hd">
            <div class="hd-lf"><span> {{counselTab == 'MarketAct' ? '营销活动' : '讲座登记'}}</span>
              <img :src="require('@/assets/images/tpLtBg.png')" />
            </div>
            <div class="hd-rt">
              <span :class="setColor(resultObj.state)" style="margin-right:1rem">{{filterState(resultObj.state, 1)}}</span>
            </div>
          </div>
          <div class="ct-box">
            <div class="ct-box-in" id="order-box">
              <div class="bx-tt">
                <span class="vertical_icon"></span>
                <!-- <span v-for="(item, index) in list.orderPackets" :key="index">{{item}}<span v-show="index + 1 !== list.orderPackets.length">+</span> -->
                <!-- </span> -->
                {{resultObj.title}}
              </div>
              <div class="bx-nb color-blue">
                {{counselTab == 'MarketAct' ? '活动时间' : '讲座时间'}} :
                <span>
                  <span v-if="counselTab == 'MarketAct'">{{resultObj.startTime}} ~ {{resultObj.endTime}}</span>
                  <span v-else>{{resultObj.dateStr}}</span>
                </span>
              </div>
              <div class="bx-nb" v-if="counselTab !== 'MarketAct'">
                讲座姓名: <span>{{resultObj.teachers}}</span>
              </div>
              <div class="bx-nb">
                {{counselTab == 'MarketAct' ? '活动地点' : '讲座地点'}}: <span>{{resultObj.address}}</span>
              </div>
            </div>

            <div class="qr-wrapper" ref="ref_wrapper" v-if="!loading" :style="{'background': 'url('+ imgurl +')'}">
              <img :src="require('@/assets/jy.png')" height="20%" />
            </div>

            <div class="ft-tt" v-if="!loading">
              长按识别二维码
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="share_btn">长按上方海报分享给好友</div>
    <div class="share_btn" style="margin-top:0.8rem" v-if="['order'].includes(counselTab)" v-clipboard:copy="orderLink" v-clipboard:success="handleCopy" v-clipboard:error="hadnleErr">复制链接</div>
  </van-overlay>
</template>
<script>
import { Overlay, Icon, Loading, Notify } from 'vant'
import { getCodeActiveListApi, getCodeActiveMarketListApi } from '@/api/potentialGuest/activity'
import { shareDetailApi, getOrderQrcodeApi, getOnlineScanMsgApi, getServiceOrderLinkApi } from '@/api/potentialGuest/order'
import html2canvas from 'html2canvas'
import { mapState, mapMutations } from 'vuex'
import { getBase64 } from '@/utils'
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: true
    },
    sysShellId: [String, Number], //分校的id
    sId: [String, Number], // 活动的id/订单的id/课程包id
    counselTab: {
      type: String,
      default: 'LectureReg'
    },
    isAddOrder: {
      type: Boolean,
      default: false
    }, // 是否新增订单
    isRemian: {
      type: Boolean,
      default: false
    }, // 是否是完善信息

  },
  components: {
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [Icon.name]: Icon,
  },
  computed: {
    ...mapState({
      roleFlag: state => state.common.user.info.roleFlag
    }),
  },
  watch: {
    isOpen(val) {
      if (val) this.ininForm()
    },
    showForm(val) {
      this.$emit('update:isOpen', val)
    }
  },
  filters: {
    // 加密姓名
    filterName(val) {
      if (val) {
        return '*' + (val.substring(1))
      }
    },
    // 加密手机号
    filterTel(val) {
      if (val) {
        return (val.substring(3, 0)) + '****' + (val.substring(7))
      }
    }
  },
  data() {
    return {
      canvasShow: false,
      imageCanvas: false,
      wechatConfig: null,
      thisPayment: localStorage.getItem('this-payment'),
      showForm: false,
      loading: false,
      imgurl: null,
      count: 0,
      list: {
        studentName: '',
        mobile: '',
        orderPackets: [],
        instructions: '',
        amountMoney: '',
        balance: '',
        isSecond: false
      },
      resultObj: {},
      states: [
        { text: '待支付', value: 1, color: '#409eff' },
        { text: '有余款', value: 2, color: '#F56C6C' },
        { text: '已交清', value: 3, color: '#333333' },
        { text: '已取消', value: 4, color: '#999999' },
        { text: '已退款', value: 5, color: '#999999' },
        { text: '需退款', value: 6, color: '#E6A23C' }
      ],
      orderLink: null
    }
  },
  methods: {
    handleCopy() {
      Notify({ type: 'success', message: '链接复制成功!' })
    },
    hadnleErr() {
      Notify({ type: 'warning', message: '链接复制失败!' })
    },
    ...mapMutations('activity/', ['SET_QUESOBJ']),
    setColor(val) {
      if (val == 1) {
        return 'color-green'
      } else if (val == 2) {
        return 'color-blue'
      } else {
        return 'color-gray'
      }
    },

    // type : 1 活动模块 2 订单模块
    filterState(val, type) {
      if (type == 1) {
        if (val == 1) {
          return '未开始'
        } else if (val == 2) {
          return '进行中'
        } else {
          return '已结束'
        }
      }

      if (type == 2) {
        let obj = this.states.find(item => item.value == val)
        if (obj) {
          return obj.text
        } else {
          return '未知'
        }
      }

    },

    handleStopClose() {
    },
    handleClose() {
      this.canvasShow = false
      this.imageCanvas = false
      this.count = 0
      // 清楚关联问卷弹窗
      this['SET_QUESOBJ']({ quesConnectObjIsUpdate: false })
      this.$emit('close')
    },
    checkCodeIsShow() {
      let api = this.roleFlag == 2 ? getCodeActiveMarketListApi : getCodeActiveListApi
      return new Promise((resolve, reject) => {
        api(this.sId, this.sysShellId).then(res => {
          if (res && res.data) {
            resolve(res)
          } else {
            reject('err')
          }
        }).catch(() => {
          reject('err')
        })
      })
    },
    async ininForm() {
      this.resultObj = {}
      this.$loading(true, 'shareCode')
      // 订单模块,课程包模块
      if (['order', 'course'].includes(this.counselTab)) {
        // 新增订单二维码弹窗
        if (this.isAddOrder) {
          this.handleGetDetail().then(() => {
            getOnlineScanMsgApi(this.sId, 2).then(res => {
              if (res.data.fmCode) {
                getBase64(res.data.fmCode).then(base64 => {
                  this.imgurl = base64
                  this.$loading(false, 'shareCode')
                  if (!this.canvasShow) this.initCanvas()
                })
              } else {
                this.imgurl = `data:image/png;base64,${res.data.body}`
                this.$loading(false, 'shareCode')
                if (!this.canvasShow) this.initCanvas()
              }
            }).catch(err => {
              console.log('err', err);
              this.$loading(false, 'shareCode')
            })
          }).catch(err => {
            this.$loading(false, 'shareCode')
            console.log('err', err);
          })
        } else {

          //  订单模块分享订单
          if (['order'].includes(this.counselTab)) {
            this.handleGetDetail().then(() => {
              this.handleGetQrcode().then(() => {
                this.$loading(false, 'shareCode')
                if (!this.canvasShow) this.initCanvas()
              }).catch(err => {
                console.log('err', err);
                this.$loading(false, 'shareCode')
              })
            }).catch(err => {
              this.$loading(false, 'shareCode')
              console.log('err', err);
            })
            return;
          }

          // 课程包查看收款码
          if (['course'].includes(this.counselTab)) {
            getOnlineScanMsgApi(this.sId, 3).then(res => {
              this.resultObj = res.data || {}
              this.$set(this.resultObj, 'coursePackets', this.resultObj.coursePacket && this.resultObj.coursePacket.split(',').join('/'))
              this.imgurl = `data:image/png;base64,${res.data.qrCode.body}`
              this.$loading(false, 'shareCode')
              if (!this.canvasShow) this.initCanvas()
            }).catch(err => {
              console.log('err', err);
              this.$loading(false, 'shareCode')
            })
            return
          }

        }

      } else {
        // 活动模块
        let api = this.roleFlag == 2 ? getCodeActiveMarketListApi : getCodeActiveListApi
        api(this.sId, this.sysShellId).then(res => {
          this.resultObj = res.data || {}
          this.imgurl = `data:image/png;base64,${this.resultObj.checkCode}`
          this.$loading(false, 'shareCode')
          if (!this.canvasShow) this.initCanvas()
        }).catch(() => {
          this.$loading(false, 'shareCode')
        })
      }
    },

    // 获取二维码信息
    async handleGetQrcode() {
      let monunt = this.isRemian ? 'perfect' : 'payQuick'
      return new Promise((resolve, reject) => {
        getOrderQrcodeApi(monunt, this.sId).then(res => {
          if (res.data.body) {
            this.imgurl = `data:image/png;base64,${res.data.body}`
            resolve(true)
          } else {
            reject('获取二维码图片失败')
          }
        }).catch((err) => {
          reject(err)
        })
        getServiceOrderLinkApi(monunt, this.sId).then(res => {
          this.orderLink = res.data || null
        })
      })
    },

    // 获取订单详情
    async handleGetDetail() {
      return new Promise((resolve, reject) => {
        shareDetailApi(this.sId).then(res => {
          this.resultObj = res.data || {}
          this.$set(this.resultObj, 'coursePackets', this.resultObj.coursePackets && this.resultObj.coursePackets.split('、').join('、'))
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },



    initCanvas() {
      this.count += 1
      this.canvasShow = true
      if (this.$refs.saveToImage || this.count > 10) {
        this.$nextTick(() => {
          if (!this.$refs.saveToImage) return
          html2canvas(this.$refs.saveToImage, { backgroundColor: "#2438e7" }).then(canvas => {
            const canvseParent = document.getElementById('imgCanvas')
            const img = document.createElement("img");
            img.src = canvas.toDataURL(`image/png`)
            img.style.cssText = 'width: 100% !important;height: 100% !important;border-radius: 16px !important;'
            canvseParent.appendChild(img)
            this.imageCanvas = true
          })
        })
      } else this.initCanvas()
    }
  }
}
</script>

<style lang="scss" scoped>
.share-box {
  z-index: 999999;
  .color-green {
    color: #67c23a;
  }
  .color-blue {
    color: #0088fe !important;
  }
  .color-gray {
    color: #999999;
  }
  .close-btn {
    position: absolute;
    right: 1%;
    top: 3rem;
    font-size: 30px;
    color: white;
  }
  .container {
    width: 100%;
    padding-top: 5rem;
    padding-bottom: 12px;
    justify-content: center;
    .canvas_img {
      height: 62vh;
      width: 92%;
      margin-left: 4%;
      font-size: 28px;
    }
    .box {
      border-radius: 16px;
      background-image: url('~@/assets/images/buleBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 62vh;
      width: 92%;
      margin-left: 4%;
      // box-sizing: border-box;
      padding: 16px;
      .header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .hd-lf {
          letter-spacing: 5px;
          img {
            width: 25px;
            height: 25px;
            vertical-align: middle;
          }
        }
        .hd-rt {
          height: 100%;
          vertical-align: middle;
          font-size: 12px;
          color: #fff;
          margin-left: 10px;
        }
      }
      .share-loading {
        display: flex;
        top: 40%;
        left: 50%;
        transform: translateX(-50%);
      }
      .content {
        border-radius: 16px;
        border-top-left-radius: 20px;
        background-color: white;
        margin-top: 16px;
        height: calc(100% - 50px);
        z-index: 10;
        position: relative;
        .ct-hd {
          height: 60px;
          width: 100%;
          z-index: 5;
          .hd-lf {
            float: left;
            height: 100%;
            object-fit: cover;
            width: 45%;
            border-top-left-radius: 16px;
            text-align: center;
            span {
              position: absolute;
              left: 16px;
              top: 0;
              line-height: 44px;
              font-size: 16px;
              color: #1f22a8;
              z-index: 100;
            }
            img {
              position: absolute;
              left: 0;
              top: 0;
              height: 60px;
              z-index: 10;
            }
          }
          .hd-rt {
            float: right;
            width: 55%;
            height: 100%;
            line-height: 44px;
            font-size: 14px;
            color: #1f22a8;
            text-align: right;
            text-indent: 1em;
          }
        }
        .ct-box {
          display: flex;
          flex-direction: column;
          position: absolute;
          left: 0;
          top: 42px;
          width: 100%;
          padding: 20px;
          height: calc(100% - 20px);
          font-size: 14px;
          line-height: 24px;
          flex: 1;

          .ct-box-in {
            .bx-tt {
              font-size: 18px;
              // font-weight: 600;
              margin-bottom: 12px;
              word-wrap: break-word;
              word-break: normal;

              .vertical_icon {
                height: 20px;
                background: #4148f4;
                display: inline-block;
                border: 2px solid #4148f4;
                vertical-align: text-top;
                margin-right: 6px;
              }
            }

            .bx-nb {
              color: gray;
              margin-left: 10px;
              // font-weight: 600;
            }

            .bx-rg {
              color: red;
              margin-left: 10px;
            }
          }

          .qr-wrapper {
            flex-grow: 1;
            text-align: center;
            flex: 1;
            height: 100%;
            margin-top: 10px;
            background-size: auto 100% !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            position: relative;
            img {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translateX(-50%) translateY(-50%);
            }
          }

          .ft-tt {
            color: gray;
            text-align: center;
            // font-weight: 600;
            font-size: 15px;
            line-height: 36px;
          }
        }
        .round {
          position: absolute;
          bottom: 30%;
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #3a44f0;
        }
      }
    }
  }
  .share_btn {
    z-index: 1000;
    border-radius: 10px;
    width: 92%;
    margin-left: 4%;
    height: 50px;
    font-size: 18px;
    line-height: 50px;
    color: white;
    background-color: #4148f3;
    text-align: center;
  }

  .color-red {
    color: red !important;
  }
}
</style>