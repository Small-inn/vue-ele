<template>
  <div>
    <div class="goods">
      <!-- 1.0 左侧菜单 -->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item" :key="index" :class="{ 'current' : currentIndex === index }" @click="selecItem(index)">
            <span class="text border-1px">
              <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <!-- 2.0 右侧食物菜单 -->
      <div class="foods-wrapper" ref="foodWrapper">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="food-list" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="(foodItem, index) in item.foods" :key="index" @click="selectFood(foodItem)" class="food-item border-1px">
                <div class="icon">
                  <img :src="foodItem.icon" alt="" width="57" height="57">
                </div>
                <div class="content">
                  <div class="name">{{foodItem.name}}</div>
                  <p class="desc">{{foodItem.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{foodItem.sellCount}}份</span>
                    <span>好评率{{foodItem.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{foodItem.price}}</span>
                    <span class="old" v-show="foodItem.oldPrice">￥{{foodItem.oldPrice}}</span>
                  </div>
                  <!-- 添加购物车组件 -->
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @add="addFood" :food="foodItem"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- 3.0 购物车组件 -->
      <shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food" @add="addFood"></food>
  </div>
</template>

<script>
import Shopcart from 'base/shopcart/shopcart'
import Cartcontrol from 'base/cartcontrol/cartcontrol'
import Food from 'base/food/food'
import { goodsData } from 'api/data'
import BScroll from 'better-scroll'

const ERR_OK = 0

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
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        const H1 = this.listHeight[i]
        const H2 = this.listHeight[i + 1]
        if (!H2 || (this.scrollY >= H1 && this.scrollY < H2)) {
          return i
        }
      }
      return 0
    },
    selectFoods() {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    this._goodsData()
  },
  methods: {
    // 触发小球动画
    addFood(target) {
      this._drop(target)
    },
    // 左侧点击，右侧滑动到相应位置
    selecItem(index) {
      let foodList = this.$refs.foodList
      let el = foodList[index]
      this.foodScroll.scrollToElement(el, 300)
    },
    // 点击商品详情
    selectFood(foodItem) {
      this.$refs.food.show()
      this.selectedFood = foodItem
    },
    // 数据获取
    _goodsData() {
      goodsData().then((res) => {
        if (res.data.errno === ERR_OK) {
          this.goods = res.data.data
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
    },
    // 初始化滚动
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })

      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
        click: true,
        probeType: 3
      })

      this.foodScroll.on('scroll', (pos) => {
        // 判滑动方向
        if (pos.y <= 0) {
          this.scrollY = Math.abs(Math.round(pos.y))
        }
      })
    },
    // 计算高度
    _calculateHeight() {
      let foodList = this.$refs.foodList
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    // 小球动画
    _drop(target) {
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    }
  },
  components: {
    Shopcart,
    Cartcontrol,
    Food
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
.goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden

    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('~common/img/goods/decrease_3')
          &.discount
            bg-image('~common/img/goods/discount_3')
          &.guarantee
            bg-image('~common/img/goods/guarantee_3')
          &.invoice
            bg-image('~common/img/goods/invoice_3')
          &.special
            bg-image('~common/img/goods/special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px

    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
