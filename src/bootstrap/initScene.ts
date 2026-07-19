import { useSceneManager } from '@/managers/useSceneManager'
import type { SceneConfig } from '@/managers/useSceneManager'
import { scenes } from '@/config/scenes.config'
import { sceneFlow } from '@/config/sceneFlow.config'
export function initScene() {
  const { register, start } = useSceneManager()
  scenes.forEach((scene: SceneConfig) => {
    register(scene)
  })
  start(sceneFlow)
}
