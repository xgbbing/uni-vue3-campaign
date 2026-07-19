<template>
  <view class="page">
    <!-- loading -->
    <up-loading-page
      v-if="loading"
      :loading="loading"
      loading-text=""
    ></up-loading-page>

    <view v-else>
      <!-- 背景 -->
      <image
        class="bg"
        :src="success ? '/static/open-after.jpg' : '/static/open-before.jpg'"
        mode="aspectFill"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      />

      <!-- 成功动画 -->
      <image
        v-if="success"
        class="thumb"
        src="/static/good.jpg"
        mode="widthFix"
      />

      <image
        v-if="success"
        class="next"
        src="/static/guide-next.jpg"
        @click="next"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGestureUnlock } from "@/hooks/useGestureUnlock";
import { useAudioManager } from "@/managers/useAudioManager";
import { useSceneManager } from "@/managers/useSceneManager";
import { onLoad } from "@dcloudio/uni-app";

const success = ref(false);

const { playEffect, pauseEffect } = useAudioManager();

const { onTouchStart, onTouchMove, onTouchEnd } = useGestureUnlock({
  area: {
    x: 0,
    y: 1 / 3,
    width: 1 / 3,
    height: 1 / 3,
  },
  direction: "right",
  distance: 40,
  tolerance: 40,
  strictArea: true,
  onSuccess() {
    success.value = true;
    playEffect("static/bg-music.wav");
  },
});

const { enter } = useSceneManager();
const loading = ref(true);

// 页面初始化
onLoad(async () => {
  await enter("play");
  loading.value = false;
});

const next = () => {
  pauseEffect("static/bg-music.wav");
  uni.navigateTo({
    url: "/pages/play/play-second",
  });
};
</script>

<style scoped lang="scss">
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
}

.thumb {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 220rpx;
  transform: translate(-50%, -50%);
  animation: thumbScale 0.45s ease-out forwards;
}

@keyframes thumbScale {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }

  80% {
    transform: translate(-50%, -50%) scale(1.15);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
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
