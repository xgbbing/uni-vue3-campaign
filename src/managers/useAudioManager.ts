import { ref } from 'vue'

const bgmMap = new Map<string, HTMLAudioElement>()
const activeBGM = ref<string | null>(null)
const effectsMap = new Map<string, HTMLAudioElement>()
let timer: any = null
const defaultUrl = `static/bg-music.wav`

export function useAudioManager() {
  /**
   * 播放背景音乐
   */
  async function playBGM(url = defaultUrl as string) {
    // 当前播放音乐与新的播放音乐不一致时，停止当前播放音乐
    if (activeBGM.value && activeBGM.value !== url) {
      pauseBGM()
    }
    if (bgmMap.has(url)) {
      const audio = bgmMap.get(url)
      if (audio) {
        audio.volume = 1
        audio?.play()
        activeBGM.value = url
      }
    } else {
      await loadBGM(url)
    }
  }

  /**
   * 加载背景音乐
   */
  async function loadBGM(url: string) {
    const audio = new Audio()
    audio.src = `${import.meta.env.BASE_URL}${url}`

    return new Promise<void>((resolve, reject) => {
      const onCanPlay = async () => {
        try {
          audio.loop = true
          audio.volume = 0
          await audio.play()
          // 淡入
          let v = 0
          timer = setInterval(() => {
            v += 0.05
            if (v > 1) {
              clearInterval(timer)
            } else {
              audio.volume = v
            }
          }, 100)
          activeBGM.value = url
          bgmMap.set(url, audio)
          resolve()
        } catch (err) {
          reject(err)
        } finally {
          audio.removeEventListener('canplaythrough', onCanPlay)
          audio.removeEventListener('error', onError)
        }
      }

      const onError = () => {
        reject(audio.error)
        audio.removeEventListener('canplaythrough', onCanPlay)
        audio.removeEventListener('error', onError)
      }

      audio.addEventListener('canplaythrough', onCanPlay)
      audio.addEventListener('error', onError)
    })
  }

  /**
   * 暂停背景音乐
   */
  function pauseBGM() {
    if (timer.value) clearInterval(timer.value)
    if (activeBGM.value) {
      const audio = bgmMap.get(activeBGM.value)
      audio?.pause()
      activeBGM.value = null
    }
  }

  function destroyBGM(url: string) {
    const audio = bgmMap.get(url)
    if (audio) {
      audio.pause()
      audio.src = '' // 释放内存
      bgmMap.delete(url)
    }
  }

  /**
   * 播放音效
   */
  function playEffect(url: string) {
    if (effectsMap.has(url)) {
      effectsMap.get(url)?.play()
    } else {
      loadEffect(url)
    }
  }

  function loadEffect(url: string) {
    const audio = new Audio()
    audio.src = `${import.meta.env.BASE_URL}${url}`
    audio.volume = 1
    audio.play()
    effectsMap.set(url, audio)
  }

  /**
   * 播放音效
   */
  function pauseEffect(url: string) {
    if (effectsMap.has(url)) {
      effectsMap.get(url)?.pause()
    }
  }

  function destroyEffect(url: string) {
    const audio = effectsMap.get(url)
    if (audio) {
      audio.pause()
      audio.src = '' // 释放内存
      effectsMap.delete(url)
    }
  }

  return {
    playBGM,
    pauseBGM,
    playEffect,
    pauseEffect,
    activeBGM,
    destroyBGM,
    destroyEffect,
  }
}
