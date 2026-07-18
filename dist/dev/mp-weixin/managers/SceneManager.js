"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const managers_AssetManager = require("./AssetManager.js");
class SceneManager {
  constructor() {
    __publicField(this, "scenes", /* @__PURE__ */ new Map());
    __publicField(this, "preloadMap", /* @__PURE__ */ new Map());
    // private initial = ''
    __publicField(this, "current", "");
  }
  register(scene) {
    this.scenes.set(scene.id, scene);
  }
  start(config) {
    Object.entries(config.preload).forEach(([scene, next]) => {
      this.preloadMap.set(scene, next);
    });
  }
  async enter(id) {
    const scene = this.scenes.get(id);
    if (!scene) {
      return;
    }
    await managers_AssetManager.assetManager.loadBlocking(scene.assets);
    this.current = id;
    requestAnimationFrame(() => {
      requestIdleCallback(() => {
        this.preloadCurrentNext();
      });
    });
  }
  preloadCurrentNext() {
    const next = this.preloadMap.get(this.current);
    if (!next) {
      return;
    }
    next.forEach((id) => {
      this.preloadNext(id);
    });
  }
  /**
   * 后台准备下一场景
   */
  preloadNext(id) {
    const scene = this.scenes.get(id);
    if (!scene) {
      return;
    }
    managers_AssetManager.assetManager.idleLoad(scene.assets);
  }
}
const sceneManager = new SceneManager();
exports.sceneManager = sceneManager;
//# sourceMappingURL=../../.sourcemap/mp-weixin/managers/SceneManager.js.map
