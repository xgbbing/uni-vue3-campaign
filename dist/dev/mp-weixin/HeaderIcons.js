"use strict";
const common_vendor = require("./common/vendor.js");
const common_assets = require("./common/assets.js");
const store_music = require("./store/music.js");
if (!Math) {
  RulesPopup();
}
const RulesPopup = () => "./components/RulesPopup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "HeaderIcons",
  setup(__props) {
    const musicStore = store_music.useMusicStore();
    const rulesVisible = common_vendor.ref(false);
    const isPlaying = common_vendor.computed(() => musicStore.isPlaying);
    const showRules = () => {
      rulesVisible.value = true;
    };
    const toggleMusic = () => {
      if (musicStore.isPlaying) {
        musicStore.pause();
      } else {
        musicStore.play();
      }
    };
    common_vendor.onLoad(() => {
      common_vendor.index.__f__("log", "at components/HeaderIcons.vue:49", "play====");
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$4,
        b: common_vendor.o(showRules),
        c: isPlaying.value ? "/static/music-play.jpg" : "/static/music-stop.jpg",
        d: common_vendor.o(toggleMusic),
        e: common_vendor.o(($event) => rulesVisible.value = $event),
        f: common_vendor.p({
          visible: rulesVisible.value
        }),
        g: common_vendor.gei(_ctx, "")
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3f0c1396"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/HeaderIcons.js.map
