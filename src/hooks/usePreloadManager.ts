import { ref, computed } from 'vue'

/**
 * 资源类型
 */
export type AssetType = 'image' | 'audio' | 'video'

/**
 * 优先级
 */
export enum Priority {
  CRITICAL = 0,
  HIGH = 1,
  NORMAL = 2,
  LOW = 3,
}

// export enum Priority {
//   /**
//    * 阻塞首屏
//    */
//   BLOCKING = 0,

//   /**
//    * 首屏展示后立即需要
//    */
//   IMPORTANT = 1,

//   /**
//    * 下一场景预加载
//    */
//   PREFETCH = 2,

//   /**
//    * 空闲加载
//    */
//   IDLE = 3,
// }

export interface AssetItem {
  id?: string

  url: string

  type: AssetType

  priority?: Priority

  retry?: number
}

export interface Scene {
  id: string

  assets: AssetItem[]
}

export function usePreloadManager() {
  /**
   * =========================
   * 状态
   * =========================
   */

  const total = ref(0)

  const loaded = ref(0)

  const loading = ref(false)

  const errors = ref<string[]>([])

  const progress = computed(() => {
    if (!total.value) {
      return 100
    }

    return Math.floor((loaded.value / total.value) * 100)
  })

  /**
   * =========================
   * 缓存
   * =========================
   */

  const cache = new Map<string, any>()

  /**
   * =========================
   * 队列
   * =========================
   */

  const queue: AssetItem[] = []

  let running = 0

  const concurrency = 4

  /**
   * =========================
   * idle任务
   * =========================
   */

  // let idleId: number | null = null

  /**
   * =========================
   * 图片
   * =========================
   */

  function loadImage(asset: AssetItem) {
    return new Promise((resolve) => {
      const img = new Image()

      // 浏览器优先级

      try {
        img.fetchPriority = asset.priority === Priority.CRITICAL ? 'high' : 'low'
      } catch (e) {
        console.error('图片资源加载失败:', e)
      }

      img.onload = () => {
        cache.set(asset.url, img)

        resolve(true)
      }

      img.onerror = () => {
        resolve(false)
      }

      img.src = asset.url
    })
  }

  /**
   * =========================
   * 音频
   * =========================
   */

  async function loadAudio(asset: AssetItem) {
    try {
      const res = await fetch(asset.url)

      const blob = await res.blob()

      const url = URL.createObjectURL(blob)

      cache.set(asset.url, url)

      return true
    } catch {
      return false
    }
  }

  /**
   * =========================
   * 视频
   * =========================
   */

  function loadVideo(asset: AssetItem) {
    return new Promise((resolve) => {
      const video = document.createElement('video')

      video.preload = 'metadata'

      video.onloadedmetadata = () => {
        cache.set(asset.url, video)

        resolve(true)
      }

      video.onerror = () => {
        resolve(false)
      }

      video.src = asset.url

      video.load()
    })
  }

  /**
   * =========================
   * 单资源加载
   * =========================
   */

  async function loadAsset(asset: AssetItem) {
    if (cache.has(asset.url)) {
      return true
    }

    switch (asset.type) {
      case 'image':
        return loadImage(asset)

      case 'audio':
        return loadAudio(asset)

      case 'video':
        return loadVideo(asset)
    }
  }

  /**
   * =========================
   * worker
   * =========================
   */

  async function worker() {
    while (queue.length) {
      const asset = queue.shift()!

      running++

      const success = await loadAsset(asset)

      running--

      loaded.value++

      if (!success) {
        errors.value.push(asset.url)
      }
    }
  }

  async function runQueue() {
    while (running < concurrency && queue.length) {
      worker()
    }
  }

  /**
   * =========================
   * 核心加载
   * =========================
   */

  async function preload(assets: AssetItem[]) {
    queue.push(...assets.sort((a, b) => (a.priority ?? 2) - (b.priority ?? 2)))

    total.value += assets.length

    await runQueue()
  }

  /**
   * =========================
   * idle后台加载
   * =========================
   */

  function idlePreload(assets: AssetItem[]) {
    let index = 0

    function idle(deadline: IdleDeadline) {
      while (deadline.timeRemaining() > 5 && index < assets.length) {
        preload([assets[index++]])
      }

      if (index < assets.length) {
        requestIdleCallback(idle)
      }
    }

    requestIdleCallback(idle)
  }

  /**
   * =========================
   * 页面进入提升优先级
   * =========================
   */

  async function preloadScene(scene: Scene, immediate = false) {
    if (immediate) {
      await preload(
        scene.assets.map((item) => ({
          ...item,
          priority: Priority.CRITICAL,
        }))
      )
    } else {
      idlePreload(scene.assets)
    }
  }

  return {
    progress,
    loaded,
    total,
    loading,
    errors,
    preload,
    preloadScene,
    cache,
  }
}
