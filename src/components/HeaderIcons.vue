<template>
  <view class="top-icons">
    <view class="header-icons">
      <!-- 活动规则图标 -->
      <image class="rules-icon" src="/static/rules-btn.jpg" @click="showRules" />
      <!-- 音乐图标：根据播放状态切换图片 -->
      <image class="music-icon" :src="isPlaying ? '/static/music-play.jpg' : '/static/music-stop.jpg'" @click="toggleMusic" />
      <!-- 活动规则弹窗 -->
      <RulesPopup v-model:visible="rulesVisible" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import RulesPopup from '@/components/RulesPopup.vue' // 之前定义的弹窗组件
import { onLoad } from '@dcloudio/uni-app'
import { useAudioManager } from '@/managers/useAudioManager'

const rulesVisible = ref(false)
const { playBGM, pauseBGM, activeBGM } = useAudioManager()

const isPlaying = computed(() => !!activeBGM.value)

// 显示活动规则
const showRules = () => {
  rulesVisible.value = true
}

// 切换音乐播放/暂停
const toggleMusic = () => {
  if (isPlaying.value) {
    pauseBGM()
  } else {
    playBGM()
  }
}

onLoad(() => {
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
})
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
