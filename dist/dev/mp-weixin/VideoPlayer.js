"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "VideoPlayer",
  props: {
    show: Boolean,
    src: String
  },
  emits: ["update:show"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function close() {
      emit("update:show", false);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.show
      }, props.show ? {
        b: props.src,
        c: common_vendor.o(close),
        d: common_vendor.o(close),
        e: common_vendor.o(close),
        f: common_vendor.gei(_ctx, "")
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-76da40b3"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/VideoPlayer.js.map
