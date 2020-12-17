<script setup>
const randomImgURL = 'http://placeskull.com/200/200'
const newImg = 'http://placeskull.com/200/200'
const preload = imgURL => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = imgURL
    img.onload = () => resolve()
    img.onerror = () => reject()
  })
}

const preloadImgs = async imgs => {
  await Promise.all(imgs.map(imgURL => preload(imgURL)))
}

const createImgRectMap = imgs => {
  return imgs.reduce((prev, img) => {
    const rect = img.getBoundingClientRect()
    const { left, top } = rect
    prev[img.src] = { left, top, img }
    return prev
  }, {})
}

import { nextTick, onMounted, ref } from 'vue'

const loading = ref(false)
const imgs = ref(
  Array(3)
    .fill(randomImgURL)
    .map((item, index) => `${item}?s=${index}`)
)
const imgsRef = ref([])

onMounted(async () => {
  loading.value = true
  await preloadImgs(imgs.value)
  loading.value = false
})

/**
 * 添加图片
 */
const adding = ref(false)
const handleAddImg = async () => {
  if (adding.value) {
    return
  }

  adding.value = true
  const current = `${newImg}?s=${Date.now()}`
  await preload(current)

  scheduleAnimation(() => {
    imgs.value.unshift(current)
    adding.value = false
  })
}

const scheduleAnimation = async update => {
  // 获取旧图片的位置
  const prevImgs = imgsRef.value
  const prevImgRectMap = createImgRectMap(prevImgs)
  console.log(prevImgRectMap)
  // 更新数据
  update()

  // DOM更新后
  await nextTick()

  const currentImgRectMap = createImgRectMap(prevImgs)
  console.log(currentImgRectMap, 'current')
  Object.keys(prevImgRectMap).forEach(key => {
    const currentRect = currentImgRectMap[key]
    const prevRect = prevImgRectMap[key]

    const invert = {
      left: prevRect.left - currentRect.left,
      top: prevRect.top - currentRect.top,
    }
    console.log(invert, 'invert')

    const keyframes = [
      {
        transform: `translate(${invert.left}px, ${invert.top}px)`,
        opacity: 0,
      },
      {
        transform: 'translate(0, 0)',
        opacity: 1,
      },
    ]

    const options = {
      duration: 3000,
      easing: 'cubic-bezier(0,0,0.32,1)',
    }

    const animation = currentRect.img.animate(keyframes, options)
  })
}
</script>

<template>
  <div>
    <div class="button-group">
      <button @click="handleAddImg">
        {{ adding ? '下载中...' : '添加图片' }}
      </button>
      <button>乱序</button>
      <button>重置</button>
    </div>
    <div v-if="loading">加载中...</div>
    <div class="wrapper" v-else>
      <img
        :ref="el => (imgsRef[index] = el)"
        :src="img"
        alt="图片"
        v-for="(img, index) of imgs"
        :key="index"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  margin: 10px 0;
  display: grid;
  grid-template-columns: repeat(3, 200px);
  justify-content: center;
  gap: 10px;
}
</style>
