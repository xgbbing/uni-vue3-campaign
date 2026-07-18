import { assetManager } from "./AssetManager";

export interface Scene {
  id: string;
  assets: any[];
}

class SceneManager {
  private scenes = new Map<string, Scene>();
  private preloadMap = new Map();
  // private initial = ''
  private current = "";

  register(scene: Scene) {
    this.scenes.set(scene.id, scene);
  }

  start(config: any) {
    // this.initial = config.initial
    Object.entries(config.preload).forEach(([scene, next]) => {
      this.preloadMap.set(scene, next);
    });
  }

  async enter(id: string) {
    const scene = this.scenes.get(id);
    if (!scene) {
      return;
    }
    await assetManager.loadBlocking(scene.assets);
    this.current = id;
    requestAnimationFrame(() => {
      requestIdleCallback(() => {
        this.preloadCurrentNext();
      });
    });
  }

  private preloadCurrentNext() {
    const next = this.preloadMap.get(this.current);
    if (!next) {
      return;
    }
    next.forEach((id: string) => {
      this.preloadNext(id);
    });
  }

  /**
   * 后台准备下一场景
   */
  preloadNext(id: string) {
    const scene = this.scenes.get(id);
    if (!scene) {
      return;
    }
    assetManager.idleLoad(scene.assets);
  }
}

export const sceneManager = new SceneManager();
