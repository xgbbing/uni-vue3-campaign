"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const bootstrap_initScene = require("./bootstrap/initScene.js");
const utils_auth = require("./utils/auth.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/play/play.js";
  "./pages/play/play-second.js";
  "./pages/agreement/privacy-policy.js";
  "./components/HeaderIcons.js";
  "./pages/guide/guide.js";
  "./pages/guide/components/ChatDialog.js";
  "./pages/guide/components/VideoPlayer.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(async () => {
      common_vendor.index.__f__("log", "at App.vue:7", "App Launch");
      bootstrap_initScene.initScene();
      await utils_auth.ensureLogin();
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:12", "App Show");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:15", "App Hide");
    });
    return () => {
    };
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(common_vendor.uviewPlus);
  app.use(common_vendor.createPinia());
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
