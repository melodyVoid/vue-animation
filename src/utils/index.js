/**
 * @description 洗牌算法
 * @date 2020/12/18
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
