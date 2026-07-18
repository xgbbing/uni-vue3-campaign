<template>
  <view class="container">
    <!-- loading -->
    <view v-if="loading" class="loading">加载中...</view>

    <view>
      <image class="bg-image" src="/static/index-bg.jpg"></image>
      <HeaderIcons />

      <view class="footer">
        <up-button class="start-btn" type="primary" @click="goPlay">
          开始游戏
        </up-button>

        <!-- 勾选协议 -->
        <view class="checkbox-item">
          <up-checkbox-group v-model="checkedList">
            <up-checkbox name="agree"></up-checkbox>
          </up-checkbox-group>
          <text class="custom-label">
            <text>我已阅读并同意</text>
            <text class="link" @click="showRulesPopup()">《活动规则》</text>
            <text>和</text>
            <text class="link" @click="goToPage('agreement/privacy-policy')">
              《隐私条款》
            </text>
          </text>
        </view>
      </view>

      <!-- 活动规则弹窗 -->
      <RulesPopup v-model:visible="rulesPopupVisible" />
    </view>
  </view>
</template>

<script setup>
import { ref, markRaw } from "vue";
import { onLoad, onShow, onLaunch } from "@dcloudio/uni-app";
import RulesPopup from "@/components/RulesPopup";
import HeaderIcons from "@/components/HeaderIcons";
import { isWechatBrowser } from "@/utils/index";
// import { useAssetLoader } from "@/hooks/useAssetLoader";
// import { useIdleLoader } from "@/hooks/useIdleLoader";
// import { usePreloadManager } from "@/hooks/usePreloadManager";
import { sceneManager } from "@/managers/SceneManager";
import { scenes } from "@/managers/scenes";

defineOptions({
  options: {
    styleIsolation: "shared",
  },
});

// const { idleLoad } = useIdleLoader();

// const {progress,preloadScene } = usePreloadManager();

// const { progress, loading, loadAssets } = useAssetLoader();

// const ready = ref(false);

const loading = ref(true);

// await preloadScene(homeScene, true);

// loading.value = false;

// 弹窗部分
const rulesPopupVisible = ref(false);
const showRulesPopup = () => {
  rulesPopupVisible.value = true;
};

// 勾选协议
const checkedList = ref([]);
const goPlay = async () => {
  if (!checkedList.value.includes("agree")) {
    uni.showToast({
      title: "请先勾选协议",
      icon: "none",
    });
    return;
  }
  // 	await preloadScene(
  //  page2Scene,
  //  true
  // )
  await sceneManager.enter("guide");
  uni.navigateTo({
    url: "/pages/guide/guide",
  });
};

// 跳转页面
const goToPage = (page) => {
  uni.navigateTo({
    url: `/pages/${page}`,
  });
};

// 页面初始化
onLoad(async () => {
  await sceneManager.enter("home");
  loading.value = false;
});

onShow(() => {
  // await loadAssets(firstScreen);
  // ready.value = true;
  // // 后台加载
  // idleLoad(() => {
  //   loadAssets(lazyAssets);
  // });
  // preloadScene(page2Scene, false);
  // sceneManager.preloadNext("guide");
});
</script>

<style lang="scss" scoped>
.container {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;

  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .footer {
    position: absolute;
    bottom: 60rpx;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 40rpx;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
  }

  .custom-label {
    font-size: 28rpx;
    margin-left: 5rpx;
    display: inline-block;
    line-height: 1.4;
    color: #2979ff;
  }

  .link {
    text-decoration: underline;
    font-weight: bold;
  }

  // 选中状态的勾选框
  :deep(.u-checkbox__icon-wrap--checked) {
    // 修改背景色为蓝色
    background-color: #2979ff !important;
    border-color: #2979ff !important;
    // 添加蓝色阴影
    box-shadow: 0 0 0 4rpx rgba(41, 121, 255, 0.3) !important;
  }

  // 可选：修改未选中状态的边框颜色
  :deep(.u-checkbox__icon-wrap) {
    border-color: #2979ff !important;
    box-shadow: 0 0 6rpx #2979ff !important;
    margin: 6rpx !important;
    width: 28rpx !important;
    height: 28rpx !important;
  }

  // 可选：修改勾选图标 (对号) 的颜色
  :deep(.u-checkbox__icon-wrap--checked .u-icon__icon) {
    color: #ffffff !important;
  }
}
</style>
