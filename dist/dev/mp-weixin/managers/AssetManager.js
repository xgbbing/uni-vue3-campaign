"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../common/vendor.js");
var AssetPriority = /* @__PURE__ */ ((AssetPriority2) => {
  AssetPriority2[AssetPriority2["CRITICAL"] = 0] = "CRITICAL";
  AssetPriority2[AssetPriority2["HIGH"] = 1] = "HIGH";
  AssetPriority2[AssetPriority2["NORMAL"] = 2] = "NORMAL";
  AssetPriority2[AssetPriority2["LOW"] = 3] = "LOW";
  return AssetPriority2;
})(AssetPriority || {});
class AssetManager {
  constructor() {
    __publicField(this, "cache", /* @__PURE__ */ new Map());
    __publicField(this, "queue", []);
    __publicField(this, "running", 0);
    __publicField(this, "concurrency", 4);
  }
  /**
   * 是否已经缓存
   */
  has(url) {
    return this.cache.has(url);
  }
  /**
   * 获取缓存
   */
  get(url) {
    return this.cache.get(url);
  }
  /**
   * 加载资源
   */
  async load(asset) {
    if (this.cache.has(asset.url)) {
      return this.cache.get(asset.url);
    }
    switch (asset.type) {
      case "image":
        return this.loadImage(asset);
      case "video":
        return this.loadVideo(asset);
    }
  }
  loadImage(asset) {
    return new Promise((resolve) => {
      const img = new Image();
      img.fetchPriority = asset.priority === 0 ? "high" : "low";
      img.onload = () => {
        this.cache.set(asset.url, img);
        resolve(img);
      };
      common_vendor.index.__f__("log", "at managers/AssetManager.ts:60", asset.url, "====asset.url");
      img.src = asset.url;
    });
  }
  loadVideo(asset) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        this.cache.set(asset.url, video);
        resolve(video);
      };
      video.src = asset.url;
      video.load();
    });
  }
  /**
   * 批量加载
   */
  async loadBlocking(assets) {
    const list = [...assets].sort(
      (a, b) => (a.priority ?? 2) - (b.priority ?? 2)
    );
    return Promise.all(list.map((item) => this.load(item)));
  }
  /**
   * idle加载
   */
  idleLoad(assets) {
    let index = 0;
    const run = (deadline) => {
      while (deadline.timeRemaining() > 5 && index < assets.length) {
        this.load(assets[index++]);
      }
      if (index < assets.length) {
        requestIdleCallback(run);
      }
    };
    requestIdleCallback(run);
  }
}
const assetManager = new AssetManager();
exports.AssetPriority = AssetPriority;
exports.assetManager = assetManager;
//# sourceMappingURL=../../.sourcemap/mp-weixin/managers/AssetManager.js.map
