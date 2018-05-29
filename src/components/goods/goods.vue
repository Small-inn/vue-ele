<template>
  <div class="goods">
    goods
  </div>
</template>

<script>
import { goodsData } from 'api/data'

const ERR_OK = 0
export default {
  props: {},
  data() {
    return {
      goods: []
    }
  },
  created() {
    this._goodsData()
  },
  methods: {
    _goodsData() {
      goodsData().then((res) => {
        console.log(res.data.data)
        if (res.errno === ERR_OK) {
          this.goods = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
