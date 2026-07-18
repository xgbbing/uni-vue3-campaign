"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_music = require("../../store/music.js");
if (!Math) {
  (HeaderIcons + ChatDialog + VideoDialog + ResultDialog + VideoPlayer)();
}
const ChatDialog = () => "./components/ChatDialog2.js";
const VideoDialog = () => "./components/VideoDialog.js";
const ResultDialog = () => "./components/ResultDialog.js";
const VideoPlayer = () => "./components/VideoPlayer2.js";
const HeaderIcons = () => "../../components/HeaderIcons2.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "guide",
  setup(__props) {
    const musicStore = store_music.useMusicStore();
    const step = common_vendor.ref(1);
    const showVideo = common_vendor.ref(false);
    function openVideo() {
      musicStore.pause();
      showVideo.value = true;
    }
    const next = () => {
      if (step.value < 3) {
        step.value++;
      } else {
        musicStore.pause();
        common_vendor.index.navigateTo({
          url: "/pages/play/play"
        });
      }
    };
    const back = () => {
      if (step.value > 1) {
        step.value--;
      } else {
        common_vendor.index.navigateBack();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_vendor.t("<"),
        c: common_vendor.o(back),
        d: step.value === 1
      }, step.value === 1 ? {} : {}, {
        e: step.value === 2
      }, step.value === 2 ? {
        f: common_vendor.o(openVideo)
      } : {}, {
        g: step.value === 3
      }, step.value === 3 ? {} : {}, {
        h: common_assets._imports_1,
        i: common_vendor.o(next),
        j: common_vendor.o(($event) => showVideo.value = $event),
        k: common_vendor.p({
          src: "/static/guide-bgm.mp4",
          show: showVideo.value
        }),
        l: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d4bc5906"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guide/guide.js.map
