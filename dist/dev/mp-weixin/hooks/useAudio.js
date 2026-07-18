"use strict";
const common_vendor = require("../common/vendor.js");
function useAudio(options) {
  const {
    bgMusic
  } = options;
  let audioContext;
  audioContext = common_vendor.index.createInnerAudioContext();
  audioContext.src = bgMusic;
  function playMusic() {
    const res = audioContext.play();
    if (res instanceof Promise) {
      res.catch((err) => {
        common_vendor.index.__f__("log", "at hooks/useAudio.ts:25", "自动播放失败:", err);
      });
    }
  }
  function pauseMusic() {
    audioContext.pause();
  }
  return {
    playMusic,
    pauseMusic
  };
}
exports.useAudio = useAudio;
//# sourceMappingURL=../../.sourcemap/mp-weixin/hooks/useAudio.js.map
