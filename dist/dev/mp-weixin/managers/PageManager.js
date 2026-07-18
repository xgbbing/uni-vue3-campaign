"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const managers_SceneManager = require("./SceneManager.js");
class PageManager {
  constructor() {
    __publicField(this, "routeMap", /* @__PURE__ */ new Map());
  }
  register(config) {
    Object.entries(config).forEach(([scene, item]) => {
      this.routeMap.set(item.route, scene);
    });
  }
  async notifyEnter(route) {
    const scene = this.routeMap.get(route);
    if (!scene) {
      return;
    }
    await managers_SceneManager.sceneManager.enter(scene);
  }
}
const pageManager = new PageManager();
exports.pageManager = pageManager;
//# sourceMappingURL=../../.sourcemap/mp-weixin/managers/PageManager.js.map
