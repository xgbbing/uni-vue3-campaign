"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const managers_SceneManager = require("../../managers/SceneManager.js");
if (!Array) {
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  const _easycom_up_checkbox2 = common_vendor.resolveComponent("up-checkbox");
  const _easycom_up_checkbox_group2 = common_vendor.resolveComponent("up-checkbox-group");
  (_easycom_up_button2 + _easycom_up_checkbox2 + _easycom_up_checkbox_group2)();
}
const _easycom_up_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_up_checkbox = () => "../../node-modules/uview-plus/components/u-checkbox/u-checkbox.js";
const _easycom_up_checkbox_group = () => "../../node-modules/uview-plus/components/u-checkbox-group/u-checkbox-group.js";
if (!Math) {
  (HeaderIcons + _easycom_up_button + _easycom_up_checkbox + _easycom_up_checkbox_group + RulesPopup)();
}
const RulesPopup = () => "../../components/RulesPopup.js";
const HeaderIcons = () => "../../components/HeaderIcons2.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...{
    options: {
      styleIsolation: "shared"
    }
  },
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(true);
    const rulesPopupVisible = common_vendor.ref(false);
    const showRulesPopup = () => {
      rulesPopupVisible.value = true;
    };
    const checkedList = common_vendor.ref([]);
    const goPlay = async () => {
      if (!checkedList.value.includes("agree")) {
        common_vendor.index.showToast({
          title: "请先勾选协议",
          icon: "none"
        });
        return;
      }
      await managers_SceneManager.sceneManager.enter("guide");
      common_vendor.index.navigateTo({
        url: "/pages/guide/guide"
      });
    };
    const goToPage = (page) => {
      common_vendor.index.navigateTo({
        url: `/pages/${page}`
      });
    };
    common_vendor.onLoad(async () => {
      await managers_SceneManager.sceneManager.enter("home");
      loading.value = false;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : {}, {
        b: common_assets._imports_0,
        c: common_vendor.o(goPlay),
        d: common_vendor.p({
          type: "primary"
        }),
        e: common_vendor.p({
          name: "agree"
        }),
        f: common_vendor.o(($event) => checkedList.value = $event),
        g: common_vendor.p({
          modelValue: checkedList.value
        }),
        h: common_vendor.o(($event) => showRulesPopup()),
        i: common_vendor.o(($event) => goToPage("agreement/privacy-policy")),
        j: common_vendor.o(($event) => rulesPopupVisible.value = $event),
        k: common_vendor.p({
          visible: rulesPopupVisible.value
        }),
        l: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
