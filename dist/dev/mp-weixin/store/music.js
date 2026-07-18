"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
const useMusicStore = common_vendor.defineStore("music", {
  state: () => ({
    isPlaying: false,
    audioContext: null
    // 音频实例
  }),
  actions: {
    // 初始化音频（如果尚未创建）
    initAudio() {
      if (!this.audioContext) {
        common_vendor.index.__f__("log", "at store/music.ts:14", "wx");
        this.audioContext = common_vendor.index.createInnerAudioContext();
        common_vendor.index.__f__("log", "at store/music.ts:22", "default");
        this.audioContext.src = common_assets.bgMusic;
        this.audioContext.autoplay = true;
        this.audioContext.loop = true;
      }
    },
    play() {
      this.initAudio();
      if (!this.audioContext)
        return;
      const res = this.audioContext.play();
      if (res instanceof Promise) {
        res.catch((err) => {
          common_vendor.index.__f__("log", "at store/music.ts:35", "自动播放失败", err);
        });
      }
      this.isPlaying = true;
    },
    pause() {
      if (this.audioContext) {
        this.audioContext.pause();
        this.isPlaying = false;
      }
    }
    // 切换页面时保持状态（无需额外操作，因为 store 是全局的）
  }
});
exports.useMusicStore = useMusicStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/music.js.map
