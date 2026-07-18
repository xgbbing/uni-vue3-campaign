import { ref } from "vue";

const bgmSet = ref(new Map<string, any>());
const currentBGM = ref<string | null>(null);
const effectsSet = ref(new Map<string, any>());
export function useAudioManager() {
  /**
   * 播放背景音乐
   */
  function playBGM(url: string) {
    // 当前播放音乐与新的播放音乐不一致时，停止当前播放音乐
    if (currentBGM.value && currentBGM.value !== url) {
      if (bgmSet.value.has(currentBGM.value)) {
        bgmSet.value.get(currentBGM.value)?.pause();
      }
    }
    // 当前播放音乐与新的播放音乐一致时，直接播放
    if (currentBGM.value === url && bgmSet.value.has(url)) {
      bgmSet.value.get(url)?.play();
    } else {
      loadBGM(url);
    }
  }

  function loadBGM(url: string) {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0;
    audio.play();
    // 淡入
    let v = 0;
    const timer = setInterval(() => {
      v += 0.05;
      audio.volume = v;
      if (v >= 1) {
        clearInterval(timer);
      }
    }, 500);
    currentBGM.value = url;
    bgmSet.value.set(url, audio);
  }

  /**
   * 播放音效
   */
  function playEffect(url: string) {
    if (effectsSet.value.has(url)) {
      effectsSet.value.get(url)?.play();
    } else {
      loadEffect(url);
    }
  }

  function loadEffect(url: string) {
    const audio = new Audio(url);
    audio.volume = 1;
    audio.play();
    effectsSet.value.set(url, audio);
  }

  /**
   * 暂停背景音乐
   */
  function pauseBGM() {
    if (currentBGM.value) {
      bgmSet.value.get(currentBGM.value)?.pause();
    }
  }

  return {
    playBGM,
    pauseBGM,
    playEffect,
  };
}
