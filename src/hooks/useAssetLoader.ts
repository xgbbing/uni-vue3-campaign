import { ref, computed } from 'vue'

type AssetType = 'image' | 'audio' | 'video'
export interface AssetItem {
  url: string
  type: AssetType
  priority?: 'high' | 'normal' | 'low'
  /**
   * 重试次数
   */
  retry?: number
}

export function useAssetLoader(options?: {
  /**
   * 最大并发数
   */
  concurrency?: number
}) {
  const concurrency = options?.concurrency ?? 4

  // 总资源数量
  const total = ref(0)
  // 已完成数量
  const loaded = ref(0)
  // 是否加载完成
  const loading = ref(false)
  const errors = ref<string[]>([])

  const cache = new Set<string>()

  /**
   * 加载进度
   */
  const progress = computed(() => {
    if (!total.value) {
      return 100
    }
    return Math.floor((loaded.value / total.value) * 100)
  })

  /**
   * 图片加载
   */
  function loadImage(url: string) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve()
      }
      img.onerror = () => {
        reject(new Error(`图片加载失败:${url}`))
      }
      img.src = url
    })
  }

  /**
   * 音频加载
   */
  function loadAudio(url: string) {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.oncanplaythrough = () => {
        resolve()
      }
      audio.onerror = () => {
        reject(new Error(`音频加载失败:${url}`))
      }
      audio.src = url
      audio.load()
    })
  }

  /**
   * 视频加载
   */
  function loadVideo(url: string) {
    return new Promise<void>((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        resolve()
      }
      video.onerror = () => {
        reject(new Error(`视频加载失败:${url}`))
      }
      video.src = url
      video.load()
    })
  }

  /**
   * ===========================
   * 单个资源加载
   * ===========================
   */

  async function loadOne(asset: AssetItem) {
    /**
     * 已缓存
     */
    if (cache.has(asset.url)) {
      return
    }
    let retry = asset.retry ?? 2
    while (retry >= 0) {
      try {
        switch (asset.type) {
          case 'image':
            await loadImage(asset.url)
            break
          case 'audio':
            await loadAudio(asset.url)
            break
          case 'video':
            await loadVideo(asset.url)
            break
        }
        cache.add(asset.url)
        return
      } catch (e) {
        retry--
        if (retry < 0) {
          throw e
        }
      }
    }
  }

  /**
   * ===========================
   * 队列控制
   * ===========================
   */

  async function runQueue(assets: AssetItem[]) {
    let index = 0

    async function worker() {
      while (index < assets.length) {
        const current = assets[index++]

        try {
          await loadOne(current)
        } catch {
          errors.value.push(current.url)
        } finally {
          loaded.value++
        }
      }
    }

    const workers = Array.from(
      {
        length: concurrency,
      },
      worker
    )

    await Promise.all(workers)
  }

  /**
   * ===========================
   * 加载资源
   * ===========================
   */

  async function preload(assets: AssetItem[]) {
    loading.value = true

    const list = [...assets].sort((a, b) => {
      const map = {
        high: 0,
        normal: 1,
        low: 2,
      }

      return map[a.priority ?? 'normal'] - map[b.priority ?? 'normal']
    })

    total.value += list.length

    await runQueue(list)

    loading.value = false
  }

  /**
   * ===========================
   * 分阶段加载
   * ===========================
   */

  async function preloadStages(stages: AssetItem[][]) {
    for (const stage of stages) {
      await preload(stage)
    }
  }

  /**
   * 根据类型加载
   */
  function loadAsset(asset: AssetItem) {
    switch (asset.type) {
      case 'image':
        return loadImage(asset.url)
      case 'audio':
        return loadAudio(asset.url)
      case 'video':
        return loadVideo(asset.url)
    }
  }

  /**
   * 加载资源列表
   */
  async function loadAssets(assets: AssetItem[]) {
    if (!assets.length) {
      return
    }
    loading.value = true
    total.value = assets.length
    loaded.value = 0
    errors.value = []
    const tasks = assets.map(async (asset) => {
      try {
        await loadAsset(asset)
      } catch (e) {
        console.error(e)
        errors.value.push(asset.url)
      } finally {
        loaded.value++
      }
    })
    await Promise.all(tasks)
    loading.value = false
  }

  /**
   * 分批加载
   *
   * 首屏加载完成后
   * 再加载后续资源
   */
  async function loadGroups(groups: AssetItem[][]) {
    for (const group of groups) {
      await loadAssets(group)
    }
  }
  return {
    total,
    loaded,
    progress,
    loading,
    errors,
    loadAssets,
    loadGroups,
    preloadStages,
  }
}
