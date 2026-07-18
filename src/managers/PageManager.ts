import { sceneManager } from "./SceneManager";

class PageManager {
  private routeMap = new Map();
  register(config: Record<string, any>) {
    Object.entries(config).forEach(([scene, item]) => {
      this.routeMap.set(item.route, scene);
    });
  }

  async notifyEnter(route: string) {
    const scene = this.routeMap.get(route);
    if (!scene) {
      return;
    }
    await sceneManager.enter(scene);
  }
}

export const pageManager = new PageManager();
