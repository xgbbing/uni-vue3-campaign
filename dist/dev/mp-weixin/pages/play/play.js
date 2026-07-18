"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const hooks_useGestureUnlock = require("../../hooks/useGestureUnlock.js");
const hooks_useAudio = require("../../hooks/useAudio.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "play",
  setup(__props) {
    const success = common_vendor.ref(false);
    const { playMusic, pauseMusic } = hooks_useAudio.useAudio({ bgMusic: common_assets.bgMusic });
    const {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    } = hooks_useGestureUnlock.useGestureUnlock({
      area: {
        x: 0,
        y: 1 / 3,
        width: 1 / 3,
        height: 1 / 3
      },
      direction: "right",
      distance: 40,
      tolerance: 40,
      strictArea: true,
      onSuccess() {
        success.value = true;
        playMusic();
      }
    });
    const next = () => {
      pauseMusic();
      common_vendor.index.navigateTo({
        url: "/pages/play/play-second"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: success.value ? "/static/open-after.jpg" : "/static/open-before.jpg",
        b: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(onTouchStart) && common_vendor.unref(onTouchStart)(...args)
        ),
        c: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(onTouchMove) && common_vendor.unref(onTouchMove)(...args)
        ),
        d: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(onTouchEnd) && common_vendor.unref(onTouchEnd)(...args)
        ),
        e: success.value
      }, success.value ? {
        f: common_assets._imports_2
      } : {}, {
        g: success.value
      }, success.value ? {
        h: common_assets._imports_1,
        i: common_vendor.o(next)
      } : {}, {
        j: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-df92647c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/play/play.js.map
