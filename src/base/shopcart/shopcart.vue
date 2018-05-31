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
        <transition name="drop">
          <div class="ball" v-show="ball.show">
            <div class="inner"></div>
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
      ]
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
</style>
