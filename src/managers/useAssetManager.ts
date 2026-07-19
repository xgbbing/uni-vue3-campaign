import { ref } from 'vue'

export enum AssetPriority {
  BLOCKING = 0,
  IMPORTANT = 1,
  PREFETCH = 2,
  IDLE = 3,
}
export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}
export interface AssetConfig {
  id: string
  url: string
  type: AssetType
  priority?: AssetPriority
}
const cache = ref(new Map<string, any>())
export function useAssetManager() {
  function hasCache(id: string) {
    return cache.value.has(id)
  }

  function getCache(id: string) {
    return cache.value.get(id)
  }

  function setCache(id: string, resource: any) {
    return cache.value.set(id, resource)
  }
  /**
   * 加载资源
   */
  async function load(asset: AssetConfig) {
    if (hasCache(asset.url)) {
      return getCache(asset.url)
    }
    switch (asset.type) {
      case AssetType.IMAGE:
        return loadImage(asset)
      case AssetType.VIDEO:
        return loadVideo(asset)
    }
  }

  function loadImage(asset: AssetConfig) {
    return new Promise((resolve) => {
      const img = new Image()
      img.fetchPriority =
        asset.priority === AssetPriority.BLOCKING || asset.priority === AssetPriority.IMPORTANT
          ? 'high'
          : 'low'
      img.onload = () => {
        setCache(asset.url, img)
        resolve(img)
      }
      img.onerror = (error) => {
        console.error('图片资源错误:', asset.url, error)
        resolve(null)
      }
      img.src = `${import.meta.env.BASE_URL}${asset.url}`
    })
  }

  function loadVideo(asset: AssetConfig) {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        setCache(asset.url, video)
        resolve(video)
      }
      video.onerror = (error) => {
        console.error('视频资源错误:', asset.url, error)
        resolve(null)
      }
      video.src = `${import.meta.env.BASE_URL}${asset.url}`
      video.load()
    })
  }

  /**
   * blocking加载
   */
  async function loadBlocking(assets: AssetConfig[]) {
    const list = [...assets].sort(
      (a, b) => (a.priority ?? AssetPriority.PREFETCH) - (b.priority ?? AssetPriority.PREFETCH)
    )
    return Promise.all(list.map((item) => load(item)))
  }

  /**
   * idle加载
   */
  function idleLoad(assets: AssetConfig[]) {
    let index = 0
    const run = (deadline: IdleDeadline) => {
      while (deadline.timeRemaining() > 5 && index < assets.length) {
        load(assets[index++])
      }
      if (index < assets.length) {
        requestIdleCallback(run)
      }
    }
    requestIdleCallback(run)
  }

  return {
    loadBlocking,
    idleLoad,
  }
}
