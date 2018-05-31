<template>
  <div class="shopcart">
    <!-- 1.0 -->
    <div class="content">
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
      <div class="content-right">
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
  </div>
</template>

<script>
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
      dropBalls: []
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
    }
  }
}
</script>

<style lang="stylus" scoped>
  .shopcart
    position fixed
    bottom 0
    width 100%
    height 48px
    background-color #141d27
    .content
      display flex
      color #80858a
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
</style>
