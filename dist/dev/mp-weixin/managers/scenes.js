"use strict";
const managers_AssetManager = require("./AssetManager.js");
const scenes = [
  {
    id: "home",
    assets: [
      {
        id: "index-bg",
        url: "./static/index-bg.jpg",
        type: "image",
        priority: managers_AssetManager.AssetPriority.CRITICAL
      },
      {
        id: "bg-music",
        url: "./static/bg-music.wav",
        type: "video",
        priority: managers_AssetManager.AssetPriority.HIGH
      },
      {
        id: "rules-btn",
        url: "./static/rules-btn.jpg",
        type: "image",
        priority: managers_AssetManager.AssetPriority.HIGH
      },
      {
        id: "music-play",
        url: "./static/music-play.jpg",
        type: "image",
        priority: managers_AssetManager.AssetPriority.CRITICAL
      },
      {
        id: "music-stop",
        url: "./static/music-stop.jpg",
        type: "image",
        priority: managers_AssetManager.AssetPriority.CRITICAL
      },
      {
        id: "rule-bg",
        url: "./static/rule-bg.jpg",
        type: "image",
        priority: managers_AssetManager.AssetPriority.CRITICAL
      }
    ]
  },
  {
    id: "guide",
    assets: [
      {
        id: "guide-bg",
        url: "./static/guide-bg.jpg",
        type: "image",
        priority: managers_AssetManager.AssetPriority.HIGH
      },
      {
        id: "guide-next",
        url: "./static/guide-next.jpg",
        type: "image",
        priority: managers_AssetManager.AssetPriority.HIGH
      },
      {
        id: "guide-chat1",
        url: "./static/guide-chat1.jpg",
        type: "image",
        priority: managers_AssetManager.AssetPriority.HIGH
      }
    ]
  },
  {
    id: "play",
    assets: []
  }
];
exports.scenes = scenes;
//# sourceMappingURL=../../.sourcemap/mp-weixin/managers/scenes.js.map
