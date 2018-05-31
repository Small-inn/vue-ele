<template>
  <div class="star" :class="starType">
    <span v-for="(item, index) in itemClasses" :key="index" class="star-item" :class="item"></span>
  </div>
</template>

<script>
const LEN = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'
export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType() {
      return 'star-' + this.size
    },
    itemClasses() {
      let result = []
      // 简单算法，实现出现1，1.5等，不会出现非.5的情况
      let score = Math.floor(this.score * 2) / 2
      // 判断是否有小数
      let hasDecimal = score % 1 !== 0
      let integer = Math.floor(score)
      for (let i = 0; i < integer; i++) {
        // 全星
        result.push(CLS_ON)
      }
      // 半星,且半星只会出现一次
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      // 没有达到5次的，之应是off
      while (result.length < LEN) {
        result.push(CLS_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
.star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('~common/img/star/star48_on')
        &.half
          bg-image('~common/img/star/star48_half')
        &.off
          bg-image('~common/img/star/star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('~common/img/star/star36_on')
        &.half
          bg-image('~common/img/star/star36_half')
        &.off
          bg-image('~common/img/star/star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('~common/img/star/star24_on')
        &.half
          bg-image('~common/img/star/star24_half')
        &.off
          bg-image('~common/img/star/star24_off')

</style>
