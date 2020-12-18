<template>
  <div>
    <div class="top">
      <button @click="handleAdd">新增</button>
      <button @click="handleShuffle">乱序</button>
      <button @click="handleReset">重置</button>
    </div>
    <div class="wrapper">
      <div
        class="item"
        v-for="item of cardList"
        :key="item"
        :ref="el => cardsRef.set(item, el)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { shuffle } from '@/utils'
const generateArray = num =>
  Array(num)
    .fill()
    .map((item, index) => index + 1)
    .reverse()

const cardList = ref(generateArray(3))
let count = cardList.value.length

/**
 * 新增卡片
 */
const handleAdd = async () => {
  if (count === cardList.value.length) {
    cardList.value.unshift(cardList.value.length + 1)
  }
}

/**
 * 重置数组
 */
const handleReset = () => (cardList.value = generateArray(3))

/**
 * 乱序
 */
const handleShuffle = () => {
  cardList.value = shuffle(cardList.value)
}
/**
 * FLIP 动画
 */
// 记录 DOM 节点
const cardsRef = ref(new Map())

const getRect = element => {
  const { left, top } = element.getBoundingClientRect()
  return { left, top }
}

const createRectMap = elements => {
  console.log(elements, 'ele')
  const rectMap = new Map()
  elements.forEach((cardDOM, key) => {
    if (cardDOM !== null) {
      rectMap.set(key, { ...getRect(cardDOM), dom: cardDOM })
    }
  })
  return rectMap
}

watch(
  cardList,
  async newCardList => {
    // // 旧的卡片位置信息
    const oldCardRectMap = createRectMap(cardsRef.value)
    // debugger
    console.log(oldCardRectMap, 'old')
    await nextTick()
    // 这里能拿到更新后的 DOM 结构，我们也就可以拿到最新的 DOM 位置
    const newCardRectMap = createRectMap(cardsRef.value)
    console.log(newCardRectMap, 'new')
    // 每次开始循环前先重置 count
    count = 0
    newCardRectMap.forEach(async (rect, key) => {
      const oldRect = oldCardRectMap.get(key)
      const invert = {
        left: oldRect ? oldRect.left - rect.left : 0,
        top: oldRect ? oldRect.top - rect.top : 0,
      }

      // console.log(invert, 'invert')

      const keyframes = [
        {
          transform: `translate(${invert.left}px, ${invert.top}px)`,
          opacity: oldRect ? 1 : 0,
        },
        {
          transform: `translate(0, 0)`,
          opacity: 1,
        },
      ]

      const options = {
        duration: 300,
        ease: 'ease-in',
      }

      const animation = rect.dom.animate(keyframes, options)
      await animation.finished

      count++
    })
  },
  { deep: true }
)
</script>
<style lang="scss" scoped>
.wrapper {
  margin: 10px 0;
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-auto-rows: 200px;

  gap: 15px;
  justify-content: center;
  .item {
    border: 2px solid #ffa94d;
    border-radius: 5px;
    background-color: #ffd8a8;
    color: #d9480f;
    width: 196px;
    height: 196px;
    font-size: 40px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
