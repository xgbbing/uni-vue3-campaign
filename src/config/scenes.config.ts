import {
  AssetPriority as P,
  AssetType as T,
} from "../managers/useAssetManager";

export const scenes = [
  {
    id: "home",
    assets: [
      {
        id: "index-bg",
        url: "./static/index-bg.jpg",
        type: T.IMAGE,
        priority: P.BLOCKING,
      },
      {
        id: "bg-music",
        url: "./static/bg-music.wav",
        type: T.VIDEO,
        priority: P.BLOCKING,
      },
      {
        id: "rules-btn",
        url: "./static/rules-btn.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "music-play",
        url: "./static/music-play.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "music-stop",
        url: "./static/music-stop.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "rules-bg",
        url: "./static/rules-bg.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
    ],
  },
  {
    id: "guide",
    assets: [
      {
        id: "guide-bg",
        url: "./static/guide-bg.jpg",
        type: T.IMAGE,
        priority: P.BLOCKING,
      },
      {
        id: "guide-next",
        url: "./static/guide-next.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "guide-chat1",
        url: "./static/guide-chat1.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
    ],
  },
  {
    id: "play",
    assets: [],
  },
];
