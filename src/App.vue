<template>
  <div id="app">
    <!-- 1.0 -->
    <v-header :seller="seller"></v-header>
    <!-- 2.0 -->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link tag="div" to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link tag="div" to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link tag="div" to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 3.0 -->
    <!-- <div class="content">content</div> -->
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import Header from 'base/header/header'
import { sellerData } from 'api/data'
const ERR_OK = 0
export default {
  props: {

  },
  data() {
    return {
      seller: {}
    }
  },
  created() {
    this._sellerData()
  },
  methods: {
    _sellerData() {
      sellerData().then(res => {
        if (res.data.errno === ERR_OK) {
          console.log(res.data.data)
          this.seller = res.data.data
        }
      })
    }
  },
  components: {
    'v-header': Header
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl';

#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-1px(rgba(7, 17, 27, 0.1));

    .tab-item {
      flex: 1;
      text-align: center;

      .router-link-active {
        color: rgb(240, 20, 20);
        border-1px(rgba(240, 20, 20, 0.3));
      }
    }
  }
}
</style>
