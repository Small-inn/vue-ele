<template>
  <div>
    <div class="shopcart">
      <!-- 1.0 -->
      <div class="content" @click="toggleList">
        <!-- 1.1 左边 -->
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalCount > 0}">
              <i class="icon-shopping_cart" :class="{highlight: totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price">
            ￥{{totalPrice}}
          </div>
          <div class="desc">
            另需配送费￥{{deliveryPrice}}元
          </div>
        </div>
        <!-- 2.0 右边 -->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payCheck}}</div>
        </div>
      </div>
      <!-- 2.0 小球 -->
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <!-- 3.0 购物车详情 -->
      <transition name="fold">
        <div class="shopcart-list" v-show="listshow">
          <!-- 3.1 头部 -->
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <!-- 3.2 详情 -->
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <!-- 3.2.2 cartcontrol 组件 -->
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!-- 蒙层 -->
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listshow"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Cartcontrol from 'base/cartcontrol/cartcontrol'
export default {
  props: {
    selectFoods: {
      type: Array,
      default: function() {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      // 是否折叠
      fold: true
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach((item) => {
        total += item.price * item.count
      })
      return total
    },
    totalCount() {
      let total = 0
      this.selectFoods.forEach((item) => {
        total += item.count
      })
      return total
    },
    payCheck() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        return `还差￥${this.minPrice - this.totalPrice}元`
      } else {
        return `去结算`
      }
    },
    payClass() {
      if (this.totalPrice >= this.minPrice) {
        return 'enough'
      } else {
        return 'not-enough'
      }
    },
    listshow() {
      if (!this.totalCount) {
        /* eslint-disable */
        this.fold = true
        return false
      }
      if (!this.fold) {
        this.$nextTick(() => {
          if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.listContent, {
            click: true
          })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return !this.fold
    }
  },
  methods: {
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeDrop(el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    dropping(el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
        el.addEventListener('transitionend', done)
      })
    },
    afterDrop(el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    addFood(target) {
      this.drop(target)
    },
    empty() {
      this.selectFoods.map((item) => {
        item.count = 0
      })
    },
    hideList() {
      this.fold = true
    },
    pay() {
      return
    }
  },
  components: {
    Cartcontrol
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/mixin'
  .shopcart
    position fixed
    left 0
    bottom 0
    width 100%
    height 48px
    z-index 50
    .content
      display flex
      color #80858a
      background #141d27
      .content-left
        flex 1
        .logo-wrapper
          float left
          display inline-block
          margin 0 12px
          padding 6px
          position relative
          top -10px
          width 56px
          height 56px
          background-color #141d27
          border-radius 50%
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              font-size 24px
              line-height 50px
              &.highlight
                color #fff
          .num
            position absolute
            top 0px
            right 0px
            width 24px
            height 16px
            line-height 16px
            color #fff
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            box-shadow 0 4px 8px rgba(0, 0, 0, .4)
            background-color red
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255, 255, 255, 0.1)
          font-size 16px
          font-weight 700
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex 0 0 105px
        width 105px
        background-color #2b333b
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          &.not-enough
            background-color #2b333b
          &.enough
            background-color #00b43c
            color #ffffff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0, 160, 220)
          transition all 0.4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transform translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition all 0.6s
      &.fold-enter, &.fold-leave-active
        transform translate3d(0, 0, 0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 12px
          color rab(0, 160, 220)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background-color #ffffff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 0
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    background-filter blur(10px)
    opacity 1
    background rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity 0
      background rgba(7, 17, 27, 0)
</style>
