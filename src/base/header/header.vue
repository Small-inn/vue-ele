<template>
  <div class="header">
    <!-- 1.0 内容区块 -->
    <div class="content-wrapper">
      <!-- 1.1 头像 -->
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64" alt="">
      </div>
      <!-- 1.2 商家内容 -->
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description"></div>
      </div>
    </div>
    <!-- 2.0 公告 -->
  </div>
</template>

<script>
export default {
  props: {
    seller: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {}
  }

}
</script>

<style lang="stylus" scoped>
.header
  color #cacaca
</style>
