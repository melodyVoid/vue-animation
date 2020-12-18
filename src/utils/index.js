/**
 * @description 洗牌算法
 * @param {unknown[]} arr
 */
export function shuffle(arr) {
  const result = []

  while (arr.length > 0) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    result.push(arr[randomIndex])
    arr.splice(randomIndex, 1)
  }

  return result
}

/**
 * @description 生成长度为 num 的逆序数组
 * @param {number} num
 * @returns {number[]}
 */
export function generateArray(num) {
  return Array(num)
    .fill()
    .map((item, index) => index + 1)
    .reverse()
}

/**
 * @description 获取元素的位置信息，这里只记录 left 和 top
 * @param {HTMLElement} element
 * @returns { { left: number, top: number } }
 */
export function getElementRect(element) {
  const { left, top } = element.getBoundingClientRect()

  return { left, top }
}

/**
 * @description 创建元素组的位置信息 Map
 * @param {Map<string, HTMLElement>} elements
 * @returns {Map<string, { left: number, top: number, dom: HTMLElement }>}
 */
export function createRectMap(elements) {
  const rectMap = new Map()

  elements.forEach((element, key) => {
    if (element !== null) {
      rectMap.set(key, { ...getElementRect(element), dom: element })
    }
  })

  return rectMap
}
