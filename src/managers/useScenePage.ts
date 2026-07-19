import { usePageManager } from '@/managers/usePageManager'
import { onLoad } from '@dcloudio/uni-app'
export function useScenePage() {
  onLoad(() => {
    const { notifyEnter } = usePageManager()
    const pages = getCurrentPages()
    const current: any = pages[pages.length - 1]
    notifyEnter(current?.route)
  })
}
