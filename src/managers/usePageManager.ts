import { ref } from "vue";
import { useSceneManager } from "./useSceneManager";

const routeMap = ref(new Map());
export function usePageManager() {
  const { enter } = useSceneManager();
  function register(config: Record<string, any>) {
    Object.entries(config).forEach(([scene, item]) => {
      routeMap.value.set(item.route, scene);
    });
  }
  async function notifyEnter(route: string) {
    const scene = routeMap.value.get(route);
    if (!scene) {
      return;
    }
    await enter(scene);
  }

  return {
    register,
    notifyEnter,
  };
}
