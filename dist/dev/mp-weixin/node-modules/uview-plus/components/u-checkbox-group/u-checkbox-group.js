"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-checkbox-group",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$2],
  computed: {
    // 这里computed的变量，都是子组件u-checkbox需要用到的，由于头条小程序的兼容性差异，子组件无法实时监听父组件参数的变化
    // 所以需要手动通知子组件，这里返回一个parentData变量，供watch监听，在其中去通知每一个子组件重新从父组件(u-checkbox-group)
    // 拉取父组件新的变化后的参数
    parentData() {
      return [
        this.modelValue,
        this.disabled,
        this.inactiveColor,
        this.activeColor,
        this.size,
        this.labelDisabled,
        this.shape,
        this.iconSize,
        this.borderBottom,
        this.placement
      ];
    },
    bemClass() {
      return this.bem("checkbox-group", ["placement"]);
    }
  },
  watch: {
    // 当父组件需要子组件需要共享的参数发生了变化，手动通知子组件
    parentData: {
      handler() {
        if (this.children.length) {
          this.children.map((child) => {
            typeof child.init === "function" && child.init();
          });
        }
      },
      deep: true
    }
  },
  data() {
    return {};
  },
  created() {
    this.children = [];
  },
  emits: ["update:modelValue", "change"],
  methods: {
    // 将其他的checkbox设置为未选中的状态
    unCheckedOther(childInstance) {
      const values = [];
      this.children.map((child) => {
        if (child.isChecked) {
          values.push(child.name);
        }
      });
      this.$emit("update:modelValue", values);
      this.$emit("change", values, {
        isChecked: childInstance.$data["isChecked"],
        name: childInstance.$props["name"]
        // 当前变动的checkbox的name值
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n($options.bemClass),
    b: common_vendor.gei(_ctx, "")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-504cd728"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/uview-plus/components/u-checkbox-group/u-checkbox-group.js.map
