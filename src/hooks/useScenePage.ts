import { pageManager } from "@/managers/PageManager";
import { onLoad } from "@dcloudio/uni-app";
export function useScenePage() {
  onLoad(() => {
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    pageManager.notifyEnter(current?.route);
  });
}
