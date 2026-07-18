<template>
  <view class="page">
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGestureUnlock } from "@/hooks/useGestureUnlock";
import bgMusic from "@/static/bg-music.wav";
import { useAudio } from "@/hooks/useAudio";

const success = ref(false);

const { playMusic, pauseMusic } = useAudio({ bgMusic });

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
    playMusic();
  },
});

const next = () => {
  pauseMusic();
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
