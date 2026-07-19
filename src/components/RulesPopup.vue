<template>
  <view v-if="visible" class="popup-mask" @touchmove.stop.prevent @click="close">
    <view class="popup-container" @click.stop>
      <!-- 背景图片（装饰框） -->
      <image class="popup-bg" src="/static/rules-bg.jpg" mode="aspectFit" />
      <!-- 滚动内容 -->
      <scroll-view class="popup-content" scroll-y>
        <view v-dompurify-html="rulesHtml" class="content-inner" />
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  visible: Boolean,
})
const emit = defineEmits(['update:visible'])

// 活动规则 HTML 内容（可直接从后端获取，或写死）
const rulesHtml = ref(`
  <div style="font-size: 28rpx; color: #333; line-height: 1.8;">
    <p style="font-weight: bold; text-align: center; font-size: 32rpx;">《巧扫码，趣成长》互动抽奖活动</p>
    <p>活动期间，用户可通过美素佳儿公众号、美素佳儿美妈汇小程序平台及其他推广渠道，进入【巧扫码，趣成长】互动H5，成为美素佳儿注册会员可参与游戏互动。请您仔细阅读以下活动规则，参与即视为同意本规则全部条款。</p>
    <p style="font-weight: bold;">一、活动时间</p>
    <p>北京时间2026年7月8日20:00至2026年8月31日24:00。</p>
    <p style="font-weight: bold;">二、活动机制</p>
    <p>（一）参与条件：成功注册为美素佳儿会员用户。</p>
    <p>（二）参与方式：通过美素佳儿公众号、美妈汇官方平台及其他推广渠道进入【巧扫码，趣成长】互动H5。</p>
    <p>1.互动机制说明：</p>
    <p>（1）用户进入活动界面后，根据页面提示成功完成互动挑战，即可获得一次抽奖机会。参与抽奖后，会在页面实时揭晓您的中奖结果。</p>
    <p>（2）抽奖规则说明：抽奖资格：会员用户完成【巧扫码，趣成长】1次有效互动后，即可获得【巧扫码，趣成长】抽奖机会1次。注：本活动意在让会员用户深度了解美素佳儿正确的扫码积疆规则与美素佳儿科普孕育内容与育儿服务工具，因此每位会员用户在整个活动期间最多可获得2次中奖机会。抽奖次数不限，但只有前两次中奖有效，其余抽奖仅展示感谢参与。</p>
    <p>（3）开奖方式：抽奖采用即开即奖形式，抽奖结果将于参与后实时公布。</p>
    <p>2.奖品设置：现金红包共计45000份。实物奖品共计70份：奶滴值奖品6800份。</p>
    <p>（1）第一次互动成功后可抽中红包奖。</p>
    <p>a.奖品名称：现金红包，共计45000份</p>
    <p>b.奖品规格：</p>
    <p>（a）现金红包0.3元，30000个；</p>
    <p>（b）现金红包0.5元，10000个；</p>
    <p>（c）现金红包0.8元，5000个；</p>
    <p>（2）第二次互动成功后有机会抽中全场大奖。</p>
    <p>a.特等奖：小度智能屏X9，价值599元，共10份</p>
    <p>b.一等奖：贵雪美高超大积木感官系列非洲动物盲装，价值99元，共60份</p>
    <p>c.二等奖：50奶滴值共1500份、100奶滴值共200份、200奶滴值共100份，随机发放，内含50/100/200奶滴值不等。奶滴值共计1800份，每2固限量1000份，先到先得。</p>
  </div>
`)

const close = () => {
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup-container {
  position: relative;
  width: 70%;
  /* 根据图片比例调整高度，例如使用 aspect-ratio 或固定高度 */
  aspect-ratio: 438 / 872;
  /* 假设图片宽高比，需替换为实际比例 */
  max-height: 77vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* mode="aspectFit" 保持比例，居中显示 */
}

.popup-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 23% 5% 8%;
  /* 上、左右、下，根据图片框位置调整 */
  box-sizing: border-box;
  overflow-y: auto;

  /* 隐藏滚动条（微信小程序） */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.content-inner {
  font-size: 24rpx;
  color: #333;
  line-height: 1.8;
}
</style>
