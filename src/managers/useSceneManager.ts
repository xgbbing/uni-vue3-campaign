import { ref } from 'vue'
import { useAssetManager } from './useAssetManager'
import type { AssetConfig } from './useAssetManager'

export interface SceneConfig {
  id: string
  assets: AssetConfig[]
}

const scenesMap = ref(new Map<string, SceneConfig>())
const preloadMap = ref(new Map())
const current = ref<string>('')

export function useSceneManager() {
  const { loadBlocking, idleLoad } = useAssetManager()
  function getScene(id: string) {
    return scenesMap.value.get(id)
  }
  function setScene(id: string, scene: SceneConfig) {
    return scenesMap.value.set(id, scene)
  }
  function register(scene: SceneConfig) {
    setScene(scene.id, scene)
  }

  function start(config: any) {
    Object.entries(config?.preload).forEach(([scene, next]) => {
      preloadMap.value.set(scene, next)
    })
  }

  async function enter(id: string) {
    const scene = getScene(id)
    if (!scene) {
      return
    }
    await loadBlocking(scene.assets)
    current.value = id
    requestAnimationFrame(() => {
      requestIdleCallback(() => {
        preloadCurrentNext()
      })
    })
  }

  function preloadCurrentNext() {
    const next = preloadMap.value.get(current.value)
    if (!next) {
      return
    }
    next.forEach((id: string) => {
      preloadNext(id)
    })
  }

  /**
   * 后台准备下一场景
   */
  function preloadNext(id: string) {
    const scene = getScene(id)
    if (!scene) {
      return
    }
    idleLoad(scene.assets)
  }

  return {
    start,
    register,
    enter,
  }
}
