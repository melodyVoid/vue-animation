<template>
  <div>
    <div class="box"></div>
    <div class="wrapper">
      <div class="box"></div>
      <div class="box" ref="boxRef"></div>
    </div>
    <button @click="handleMove">点击</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const boxRef = ref(null)

const keyframes = [
  {
    transform: 'translate(-210px, 0)',
  },
  {
    transform: 'translate(0, 0)',
  },
  {
    transform: 'translate(0, 200px)',
  },
]
const handleMove = () => {
  boxRef.value.animate(keyframes, {
    duration: 3000,
    easing: 'ease-in',
  })
}
</script>
<style lang="scss" scoped>
.box {
  width: 200px;
  height: 200px;
  background: teal;
}
.wrapper {
  display: flex;
}
</style>
