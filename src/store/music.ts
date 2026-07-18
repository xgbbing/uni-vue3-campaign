import { defineStore } from "pinia";
import bgMusic from "@/static/bg-music.wav";

export const useMusicStore = defineStore("music", {
  state: () => ({
    isPlaying: false as boolean,
    audioContext: null as any, // 音频实例
  }),
  actions: {
    // 初始化音频（如果尚未创建）
    initAudio() {
      if (!this.audioContext) {
        // #ifdef MP-WEIXIN
        console.log("wx");
        this.audioContext = uni.createInnerAudioContext();
        // #endif
        // #ifdef H5
        console.log("h5");
        this.audioContext = new Audio();
        // #endif
        // 可以设置音频源、循环等
        console.log("default");
        this.audioContext.src = bgMusic;
        this.audioContext.autoplay = true;
        this.audioContext.loop = true;
        // 监听播放结束、错误等事件（可选）
      }
    },
    play() {
      this.initAudio();
      if (!this.audioContext) return;
      const res = this.audioContext.play();
      if (res instanceof Promise) {
        res.catch((err) => {
          console.log("自动播放失败", err);
        });
      }
      this.isPlaying = true;
    },
    pause() {
      if (this.audioContext) {
        this.audioContext.pause();
        this.isPlaying = false;
      }
    },
    // 切换页面时保持状态（无需额外操作，因为 store 是全局的）
  },
});
