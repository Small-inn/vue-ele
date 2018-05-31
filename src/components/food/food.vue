<template>
  <div class="food">

  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object 
    }
  }
}
</script>

<style lang="stylus" scoped>
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30

</style>

