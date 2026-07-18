import { sceneManager } from "@/managers/SceneManager";
import { scenes } from "@/managers/scenes";
import { sceneFlow } from "@/managers/sceneFlow";
import { pageManager } from "@/managers/PageManager";
import { SceneConfig } from "@/config/scene.config";
export function initScene() {
  scenes.forEach((scene) => {
    sceneManager.register(scene);
  });
  sceneManager.start(sceneFlow);
  pageManager.register(SceneConfig);
}
