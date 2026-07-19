<template>
  <view class="page">
    <!-- loading -->
    <up-loading-page v-if="loading" :loading="loading" loading-text="" />

    <view v-else>
      <!-- 背景 -->
      <image class="bg" src="/static/guide-bg.jpg" mode="aspectFill" />
      <HeaderIcons />

      <!-- 返回 -->
      <view class="back" @click="back"> {{ '<' }}返回 </view>

      <!-- 中间弹窗 -->
      <ChatDialog v-if="step === 1" />
      <VideoDialog v-if="step === 2" @play="openVideo" />
      <ResultDialog v-if="step === 3" />

      <!-- 下一步 -->
      <image class="next" src="/static/guide-next.jpg" @click="next" />

      <!-- 视频 -->
      <VideoPlayer v-model:show="showVideo" src="/static/guide-bgm.mp4" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatDialog from './components/ChatDialog.vue'
import VideoDialog from './components/VideoDialog.vue'
import ResultDialog from './components/ResultDialog.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import HeaderIcons from '@/components/HeaderIcons.vue'
import { useAudioManager } from '@/managers/useAudioManager'
import { onLoad } from '@dcloudio/uni-app'
import { useSceneManager } from '@/managers/useSceneManager'

const step = ref(1)
const showVideo = ref(false)
const { pauseBGM } = useAudioManager()
const { enter } = useSceneManager()
const loading = ref(true)

// 页面初始化
onLoad(async () => {
  await enter('guide')
  loading.value = false
})
function openVideo() {
  pauseBGM()
  showVideo.value = true
}

const next = async () => {
  if (step.value === 1) {
    loading.value = true
    await enter('guide2')
    loading.value = false
  }
  if (step.value === 2) {
    loading.value = true
    await enter('guide3')
    loading.value = false
  }
  if (step.value < 3) {
    step.value++
  } else {
    pauseBGM()
    uni.navigateTo({
      url: '/pages/play/play',
    })
  }
}

const back = () => {
  if (step.value > 1) {
    step.value--
  } else {
    uni.navigateBack()
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.back {
  position: absolute;
  left: 30rpx;
  top: 80rpx;
  z-index: 10;
}

.next {
  position: absolute;
  left: 50%;
  bottom: 60rpx;
  transform: translateX(-50%);
  width: 260rpx;
  height: 100rpx;
  z-index: 10;
}
</style>
