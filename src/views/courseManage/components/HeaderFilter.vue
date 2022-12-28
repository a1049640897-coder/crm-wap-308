<template>
  <div id="orderHeader">
    <div class="hf-l-seacrch" v-if="isSearch">
      <form action="/">
        <van-search v-model="listQuery.keyword" shape="round" show-action :placeholder=" listType !== 'detail' ? '请输入课程包名称' : '请输入学员姓名、手机号码'" :clearable="false" @search="onKeywordSearch" @cancel="onKeywordCancel" />
      </form>
    </div>
    <div class="header-filter" :style="isActSearch ? 'padding: 0 0 0 0.5rem' : ''">
      <div class="hf-l-list" v-show="!isActSearch">
        <van-dropdown-menu class="hf-l-list-menu">
          <!-- 课程包列表状态 -->
          <van-dropdown-item title="状态" :title-class="'common-act-color'" @open="handleDropOpen()" ref="vanDropItem1">
            <div class="hf-drop-view">
              <div class="hf-drop-contain">
                <div class="hr-drop-filter-item" @click.stop="handleClass(item.id)" v-for="item in stateList" :key="item.id">
                  <van-icon v-if="listQuery.state && listQuery.state.includes(item.id)" name="success" color="#0088FE" />
                  <span :class="{'hr-drop-filter-item-act': listQuery.state && listQuery.state.includes(item.id) }">{{item.text}}</span>
                </div>
              </div>
              <div class="common-double-button">
                <van-button class="common-double-button-l" @click="handleReset()">重置</van-button>
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
        <div class="hf-r-list-item" @click="handleMoreFilter" v-if="listType!=='detail'">
          <div class="hf-r-icon-bg" :class="{'hf-r-icon-bg-act': isMoreAct }">
            <van-icon name="filter-o" class="hf-r-icon" />
          </div>
        </div>
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
              <RePick v-model="listQuery.orderDept" label="所属部门" :list="authDepartList" isCascader isShowSearch isCell clearable childrenKey="child" />
              <RePick v-model="listQuery.addUser" label="添加人" :list="addUserList" isShowSearch clearable isCell />
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
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    listType: String, // 'detail' 详情
    paramProp: Object,
    addUserList: Array,
  },
  components: {
    RePick: () => import('@/components/ReComponents/RePick'),
  },
  data() {
    return {
      isActSearch: false,
      moreFilterShow: false,
      isSearch: false,
      courseStateList: [
        { text: '全部', id: 25 },
        { text: '已取消', id: 0 },
        { text: '生效中', id: 1 }
      ],
      listQuery: {},
    }
  },
  computed: {
    ...mapGetters(['currentSystemInfo']),
    isMoreAct() {
      let bol = false
      const listQuery = this.paramProp || {}
      if (listQuery.addUser || listQuery.orderDept) {
        bol = true
      }
      return bol
    },
    ...mapState({
      authDepartList: state => state.common.user.authDepartList,
      queryList: state => state.order.queryList,
    }),
    detailStateList() {
      let newArr = JSON.parse(JSON.stringify(this.queryList.stateList))
      newArr.unshift({ id: 25, text: '全部', color: '#e6a23c' })
      newArr.push({ id: 7, text: '暂无', color: '#e6a23c' })
      return newArr
    },
    stateList() {
      if (this.listType !== 'detail') {
        return this.courseStateList
      } else {
        let newArr = JSON.parse(JSON.stringify(this.queryList.stateList))
        newArr.unshift({ id: 25, text: '全部', color: '#e6a23c' })
        newArr.push({ id: 7, text: '暂无', color: '#e6a23c' })
        return newArr
      }
    },
  },


  methods: {
    handleConfirm() {
      this.$refs.vanDropItem1 && this.$refs.vanDropItem1.toggle(false)
      this.$emit('onListQuery', this.listQuery)
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


    // 处理班型
    handleClass(val) {
      this.listQuery.state = [val]
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


    },

    handleInit() {
      this.listQuery = {
        ...this.paramProp,
        state: this.paramProp.state.length ? this.paramProp.state : [25],
        orderDept: Array.isArray(this.paramProp.orderDept) ? this.paramProp.orderDept[0] : this.paramProp.orderDept
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

    // 更多重置
    handleMoreReset() {
      this.listQuery.orderDept = null
      this.listQuery.addUser = null
    },
    handleMoreConfirm() {
      this.$emit('onListQuery', this.listQuery)
      this.moreFilterShow = false
    },
    handleReset() {
      this.listQuery.state = [25]
    },


  },

}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
