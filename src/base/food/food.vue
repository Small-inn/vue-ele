<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <!-- 1.0 图片和箭头 -->
      <div class="image-header">
        <img :src="food.image">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <!-- 2.0 店内情况 -->
      <div class="content">
        <!-- 2.1 店名 -->
        <h1 class="title">{{food.name}}</h1>
        <!-- 2.2 描述 -->
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <!-- 2.3 价格 -->
        <div class="price">
          <span class="now">￥{{food.price}}</span>
          <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <!-- 2.4 cartcontrol -->
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food" @add="addFood"></cartcontrol>
        </div>
        <!-- 2.5 加入购物车 -->
        <transition name="fade">
          <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst">
            加入购物车
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import Cartcontrol from 'base/cartcontrol/cartcontrol'
export default {
  props: {
    food: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    addFood(target) {
      this.$emit('add', target)
    },
    addFirst(e) {
      this.$emit('add', e.target)
      this.$set(this.food, 'count', 1)
    }
  },
  components: {
    Cartcontrol
  }
}
</script>

<style lang="stylus" scoped>
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    width 100%
    z-index 30
    background #fff
    transform translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition all 0.4s linear
    &.move-enter, &.move-leave-active
      transform translate3d(100%, 0, 0)
    .image-header
      // 这里使用一个技巧，width给100% 然后padding-top 100%就会得出 与宽度相等的高度
      position relative
      width 100%
      heigh 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left  0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color red
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0px
        .sell-count, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right 12px
      .price
        font-weight bold
        line-height 24px
        .now
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        border-radius 12px
        font-size 10px
        background rgb(0, 160, 220)
        opacity 1
        &.fade-enter-active, &.fade-leave-active
          transition all 0.2
        &.fade-enter, &.fade-leave-active
          opacity 0
          z-index -1
</style>
