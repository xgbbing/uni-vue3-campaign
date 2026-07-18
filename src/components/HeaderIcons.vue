<template>
  <view class="top-icons">
    <view class="header-icons">
      <!-- 活动规则图标 -->
      <image
        class="rules-icon"
        src="/static/rules-btn.jpg"
        @click="showRules"
      />
      <!-- 音乐图标：根据播放状态切换图片 -->
      <image
        class="music-icon"
        :src="isPlaying ? '/static/music-play.jpg' : '/static/music-stop.jpg'"
        @click="toggleMusic"
      />
      <!-- 活动规则弹窗 -->
      <RulesPopup v-model:visible="rulesVisible" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useMusicStore } from "@/store/music"; // Pinia store
import RulesPopup from "./RulesPopup.vue"; // 之前定义的弹窗组件
import { onLoad } from "@dcloudio/uni-app";

const musicStore = useMusicStore();
const rulesVisible = ref(false);

// 音乐播放状态（从 store 获取）
const isPlaying = computed(() => musicStore.isPlaying);

// 显示活动规则
const showRules = () => {
  rulesVisible.value = true;
};

// 切换音乐播放/暂停
const toggleMusic = () => {
  if (musicStore.isPlaying) {
    musicStore.pause();
  } else {
    musicStore.play();
  }
};

onLoad(() => {
  console.log("play====");
  // TODO: 自动播放
  // musicStore.play();
  // #ifdef H5
  // TODO: 备用方案，hasPlayed需要放全局管理
  // let hasPlayed = false;
  // const handlePlay = () => {
  // 	if (hasPlayed) return;
  // 	hasPlayed = true;
  // 	musicStore.play();
  // 	removeListeners();
  // };
  // const removeListeners = () => {
  // 	document.removeEventListener("WeixinJSBridgeReady", handlePlay);
  // 	document.removeEventListener("touchstart", handlePlay);
  // 	document.removeEventListener("click", handlePlay);
  // };
  // document.addEventListener("WeixinJSBridgeReady", handlePlay, false);
  // document.addEventListener("touchstart", handlePlay, {
  // 	passive: true
  // });
  // document.addEventListener("click", handlePlay);
  // onUnload(() => {
  // 	removeListeners();
  // });
  // #endif
});
</script>

<style lang="scss" scoped>
.top-icons {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  display: flex;
  column-gap: 10rpx;
  z-index: 100;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 20rpx; // 两个图标间距
  padding-right: 20rpx;

  .rules-icon {
    width: 200rpx;
    height: 100rpx;
  }

  .music-icon {
    width: 100rpx;
    height: 100rpx;
  }
}
</style>
