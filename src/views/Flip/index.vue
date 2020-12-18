<script setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { shuffle, generateArray, createRectMap } from '@/utils'

/**
 * 卡片列表，初始化三张卡片
 */
const cardList = ref(generateArray(3))

/**
 * 用于记录动画执行次数。
 */
let count = cardList.value.length

/**
 * 新增卡片
 */
const handleAdd = async () => {
  // 在所有动画结束时才可以添加新的卡片，不然会造成卡片乱飞的 bug。
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

watch(
  cardList,
  async () => {
    // 旧的卡片位置信息
    // First
    const oldCardRectMap = createRectMap(cardsRef.value)

    await nextTick()
    // 这里能拿到更新后的 DOM 结构，我们也就可以拿到最新的 DOM 位置
    // Last
    const newCardRectMap = createRectMap(cardsRef.value)

    // 每次开始循环前先重置 count
    count = 0

    newCardRectMap.forEach(async (rect, key) => {
      const oldRect = oldCardRectMap.get(key)
      // oldRect 为 undefined 时，说明是新加的 DOM，对于新加的 DOM 我们只需让它的透明度发生变化即可

      // Invert
      const invert = {
        left: oldRect ? oldRect.left - rect.left : 0,
        top: oldRect ? oldRect.top - rect.top : 0,
      }

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

      // Play
      const animation = rect.dom.animate(keyframes, options)
      await animation.finished

      count++
    })
  },
  { deep: true }
)
</script>

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
