export function useIdleLoader() {
  function idleLoad(callback: () => void) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        () => {
          callback()
        },
        {
          timeout: 2000,
        }
      )
    } else {
      // Safari fallback

      setTimeout(callback, 1000)
    }
  }
  return {
    idleLoad,
  }
}
