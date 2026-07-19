import { AssetPriority as P, AssetType as T } from "@/managers/useAssetManager";

const HeaderIconsAssets = [
  // {
  //   id: "bg-music",
  //   url: "static/bg-music.wav",
  //   type: T.AUDIO,
  //   priority: P.BLOCKING,
  // },
  {
    id: "rules-btn",
    url: "static/rules-btn.jpg",
    type: T.IMAGE,
    priority: P.IMPORTANT,
  },
  {
    id: "music-play",
    url: "static/music-play.jpg",
    type: T.IMAGE,
    priority: P.IMPORTANT,
  },
  {
    id: "music-stop",
    url: "static/music-stop.jpg",
    type: T.IMAGE,
    priority: P.IMPORTANT,
  },
  {
    id: "rules-bg",
    url: "static/rules-bg.jpg",
    type: T.IMAGE,
    priority: P.IMPORTANT,
  },
];

export const scenes = [
  {
    id: "index",
    assets: [
      ...HeaderIconsAssets,
      {
        id: "index-bg",
        url: "static/index-bg.jpg",
        type: T.IMAGE,
        priority: P.BLOCKING,
      },
    ],
  },
  {
    id: "guide",
    assets: [
      ...HeaderIconsAssets,
      {
        id: "guide-bg",
        url: "static/guide-bg.jpg",
        type: T.IMAGE,
        priority: P.BLOCKING,
      },
      {
        id: "guide-next",
        url: "static/guide-next.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "guide-chat1",
        url: "static/guide-chat1.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
    ],
  },
  {
    id: "guid2",
    assets: [
      ...HeaderIconsAssets,
      {
        id: "guide-bg",
        url: "static/guide-bg.jpg",
        type: T.IMAGE,
        priority: P.BLOCKING,
      },
      {
        id: "guide-next",
        url: "static/guide-next.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "guide-chat2",
        url: "static/guide-chat2.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "guide-bgm",
        url: "static/guide-bgm.mp4",
        type: T.VIDEO,
        priority: P.IMPORTANT,
      },
      {
        id: "play-vedio-btn",
        url: "static/play-vedio-btn.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
    ],
  },
  {
    id: "guid3",
    assets: [
      ...HeaderIconsAssets,
      {
        id: "guide-bg",
        url: "static/guide-bg.jpg",
        type: T.IMAGE,
        priority: P.BLOCKING,
      },
      {
        id: "guide-next",
        url: "static/guide-next.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "guide-chat3",
        url: "static/guide-chat3.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
    ],
  },
  {
    id: "play",
    assets: [
      {
        id: "open-before",
        url: "static/open-before.jpg",
        type: T.IMAGE,
        priority: P.BLOCKING,
      },
      {
        id: "open-after",
        url: "static/open-after.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "good",
        url: "static/good.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "guide-next",
        url: "static/guide-next.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      // {
      //   id: "bg-music",
      //   url: "static/bg-music.wav",
      //   type: T.VIDEO,
      //   priority: P.IMPORTANT,
      // },
    ],
  },
  {
    id: "playSecond",
    assets: [
      {
        id: "open-before",
        url: "static/open-before.jpg",
        type: T.IMAGE,
        priority: P.BLOCKING,
      },
      {
        id: "phone",
        url: "static/phone.jpg",
        type: T.IMAGE,
        priority: P.BLOCKING,
      },
      {
        id: "good",
        url: "static/good.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
      {
        id: "guide-next",
        url: "static/guide-next.jpg",
        type: T.IMAGE,
        priority: P.IMPORTANT,
      },
    ],
  },
];
