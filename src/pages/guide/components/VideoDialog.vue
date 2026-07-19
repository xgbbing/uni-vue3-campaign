<template>
  <view class="mask">
    <view class="dialog">
      <image class="cover" src="/static/guide-chat2.jpg" mode="aspectFill" />
      <image
        class="play"
        src="/static/play-vedio-btn.jpg"
        mode="aspectFill"
        @click="emit('play')"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits(['play'])
</script>

<style lang="scss" scoped>
.mask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  position: relative;
  width: 85%;
  aspect-ratio: 644 / 670;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.play {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 120rpx;
  height: 120rpx;
}
</style>
