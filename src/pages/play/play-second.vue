<template>
  <view class="page-container">
    <!-- 背景 -->
    <image class="bg" src="/static/open-before.jpg" mode="aspectFill" />

    <!-- 调试控制按钮（仅 showDebug 为 true 时显示） -->
    <view
      class="debug-controls"
      v-if="showDebug && !isSuccess"
      @touchmove.stop.prevent
    >
      <view class="control-row">
        <view class="control-btn" @touchstart.stop="zoomIn">放大</view>
        <view class="control-btn" @touchstart.stop="zoomOut">缩小</view>
      </view>
      <view class="control-row">
        <view class="control-btn" @touchstart.stop="rotateCW">顺时针</view>
        <view class="control-btn" @touchstart.stop="rotateCCW">逆时针</view>
      </view>
    </view>

    <!-- 可拖动的手机图片 -->
    <view
      class="draggable-phone"
      :style="phoneStyle"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <image class="phone" src="/static/phone.png" mode="aspectFill" />
    </view>

    <!-- 调试信息（开发时使用，生产环境可删除） -->
    <view class="debug-panel" v-if="showDebug && !isSuccess">
      <text class="debug-text"
        >偏移: X={{ Math.round(currentOffsetX) }}px Y={{
          Math.round(currentOffsetY)
        }}px</text
      >
      <text class="debug-text">缩放: {{ currentScale.toFixed(2) }}x</text>
      <text class="debug-text">旋转: {{ currentRotation.toFixed(1) }}°</text>
      <text class="debug-text"
        >距目标: {{ distanceToTarget.toFixed(0) }}px | 角度:
        {{ angleDiff.toFixed(1) }}°</text
      >
      <text class="debug-text">状态: {{ isSuccess ? "成功" : "偏离" }}</text>
    </view>

    <!-- 成功动画 -->
    <image
      v-if="isSuccess"
      class="thumb"
      src="/static/good.jpg"
      mode="widthFix"
    />

    <!-- 下一步 -->
    <image
      v-if="isSuccess"
      class="next"
      src="/static/guide-next.jpg"
      @click="next"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from "vue";
import bgMusic from "@/static/bg-music.wav";
import { useAudio } from "@/hooks/useAudio";

// ==================== 配置参数 ====================
// 手机图片尺寸（与镂空框一致）
const PHONE_WIDTH = 200;
const PHONE_HEIGHT = 200;
const PHONE_SCALE = 1.7;

// 成功判定条件
const POSITION_TOLERANCE_MIN = 5; // 最小位置容差：px
const POSITION_TOLERANCE_MAX = 20; // 最大位置容差：px
const ANGLE_TOLERANCE_MIN = -64; // 最小角度容差：度
const ANGLE_TOLERANCE_MAX = -58; // 最大角度容差：度
const SCALE_TOLERANCE = 0.2; // 缩放容差：0.2

// 初始状态随机范围
const INITIAL_SCALE_MIN = 0.5; // 缩小50%
const INITIAL_SCALE_MAX = 1.5; // 放大150%
const INITIAL_ROTATION_MIN = 60; // 最小旋转角度（正方向）
const INITIAL_ROTATION_MAX = 90; // 最大旋转角度
const INITIAL_OFFSET_DISTANCE = 100; // 初始偏移距离（px）

// ==================== 响应式状态 ====================
const currentOffsetX = ref(0); // 当前X偏移（相对正确位置）
const currentOffsetY = ref(0); // 当前Y偏移（相对正确位置）
const currentScale = ref(1); // 当前缩放
const currentRotation = ref(0); // 当前旋转角度（度）

const isSuccess = ref(false); // 是否已成功
const showDebug = ref(true); // 是否显示调试面板（生产环境设为false）

const { playMusic, pauseMusic } = useAudio({ bgMusic });

// ==================== 手势中间状态 ====================
const gestureState = reactive({
  isActive: false, // 是否有活跃手势
  initialTouchCount: 0, // 初始触摸点数量
  // 单指拖拽
  lastSingleX: 0,
  lastSingleY: 0,
  dragStartOffsetX: 0,
  dragStartOffsetY: 0,
  // 双指操作
  lastPinchDistance: 0, // 上次双指距离
  lastPinchAngle: 0, // 上次双指角度（弧度）
  lastPinchCenterX: 0, // 上次双指中心X
  lastPinchCenterY: 0, // 上次双指中心Y
  pinchStartScale: 1,
  pinchStartRotation: 0,
  pinchStartOffsetX: 0,
  pinchStartOffsetY: 0,
  // 当前触摸点追踪
  currentTouchIds: new Set(),
  isMultiTouch: false,
});

// ==================== 计算属性 ====================
// 手机图片的transform样式
const phoneStyle = computed(() => {
  const tx = currentOffsetX.value;
  const ty = currentOffsetY.value;
  const s = currentScale.value;
  const r = currentRotation.value;

  return {
    transform: `translate(${tx}px, ${ty}px) scale(${s}) rotate(${r}deg)`,
    transition: gestureState.isActive
      ? "none"
      : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };
});

// 距离目标位置的像素距离
const distanceToTarget = computed(() => {
  return Math.sqrt(currentOffsetX.value ** 2 + currentOffsetY.value ** 2);
});

// 角度偏差
const angleDiff = computed(() => {
  return (currentRotation.value % 360) - ANGLE_TOLERANCE_MAX;
});

// ==================== 初始化 ====================
function generateInitialState() {
  // 随机缩放：0.5 ~ 1.5
  const scale =
    INITIAL_SCALE_MIN + Math.random() * (INITIAL_SCALE_MAX - INITIAL_SCALE_MIN);

  // 随机旋转：60~90度 或 -60~-90度
  const rotationMagnitude =
    INITIAL_ROTATION_MIN +
    Math.random() * (INITIAL_ROTATION_MAX - INITIAL_ROTATION_MIN);
  const rotationSign = Math.random() > 0.5 ? 1 : -1;
  const rotation = rotationMagnitude * rotationSign;

  // 随机偏移方向：上下左右
  const directions = [
    {
      x: 0,
      y: -INITIAL_OFFSET_DISTANCE,
    }, // 上
    {
      x: 0,
      y: INITIAL_OFFSET_DISTANCE,
    }, // 下
    {
      x: -INITIAL_OFFSET_DISTANCE,
      y: 0,
    }, // 左
    {
      x: INITIAL_OFFSET_DISTANCE,
      y: 0,
    }, // 右
  ];
  const dir = directions[Math.floor(Math.random() * directions.length)];

  // 添加一些随机性到偏移量（±20px）
  const offsetX = dir.x + (Math.random() - 0.5) * 40;
  const offsetY = dir.y + (Math.random() - 0.5) * 40;

  return {
    scale,
    rotation,
    offsetX,
    offsetY,
  };
}

function applyInitialState() {
  const state = generateInitialState();
  currentScale.value = state.scale;
  currentRotation.value = state.rotation;
  currentOffsetX.value = state.offsetX;
  currentOffsetY.value = state.offsetY;
  isSuccess.value = false;
  console.log("初始状态:", {
    scale: state.scale.toFixed(2),
    rotation: state.rotation.toFixed(1) + "°",
    offsetX: state.offsetX.toFixed(0) + "px",
    offsetY: state.offsetY.toFixed(0) + "px",
  });
}

// ==================== 调试按钮方法 ====================
function zoomIn() {
  if (isSuccess.value) return;
  currentScale.value = Math.min(2.5, currentScale.value + 0.1);
  checkSuccess();
}

function zoomOut() {
  if (isSuccess.value) return;
  currentScale.value = Math.max(0.3, currentScale.value - 0.1);
  checkSuccess();
}

function rotateCW() {
  if (isSuccess.value) return;
  currentRotation.value += 2;
  checkSuccess();
}

function rotateCCW() {
  if (isSuccess.value) return;
  currentRotation.value -= 2;
  checkSuccess();
}

// ==================== 成功检测 ====================
function checkSuccess() {
  console.log(distanceToTarget.value, "===distanceToTarget.value");
  console.log(currentRotation.value, "===currentRotation.value");
  console.log(currentScale.value % 360, "===currentScale.value");
  const distOk =
    distanceToTarget.value <= POSITION_TOLERANCE_MAX &&
    distanceToTarget.value >= POSITION_TOLERANCE_MIN;
  const angleOk =
    currentRotation.value % 360 <= ANGLE_TOLERANCE_MAX &&
    currentRotation.value % 360 >= ANGLE_TOLERANCE_MIN;
  const scaleOk = Math.abs(currentScale.value - PHONE_SCALE) <= SCALE_TOLERANCE;

  console.log(distOk, "===distOk");
  console.log(angleOk, "===angleOk");
  console.log(scaleOk, "===scaleOk");
  if (distOk && angleOk && scaleOk) {
    triggerSuccess();
    return true;
  }
  return false;
}

function triggerSuccess() {
  if (isSuccess.value) return;
  isSuccess.value = true;

  // 吸附到正确位置
  // currentOffsetX.value = 0
  // currentOffsetY.value = 0
  // currentScale.value = 1.7
  // currentRotation.value = 60

  // 震动反馈（如果设备支持）
  if (uni.vibrateShort) {
    try {
      uni.vibrateShort({
        type: "medium",
      });
    } catch (e) {
      // 忽略不支持的情况
    }
  }

  console.log("✅ 成功！图片已归位");
  playMusic();
}

// ==================== 手势处理 ====================
function getTouchPosition(touch) {
  return {
    x: touch.clientX || touch.x || 0,
    y: touch.clientY || touch.y || 0,
  };
}

function getTouchDistance(touch1, touch2) {
  const dx = touch1.x - touch2.x;
  const dy = touch1.y - touch2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getTouchAngle(touch1, touch2) {
  // 计算两指连线的角度（弧度），范围[-π, π]
  return Math.atan2(touch2.y - touch1.y, touch2.x - touch1.x);
}

function getTouchCenter(touch1, touch2) {
  return {
    x: (touch1.x + touch2.x) / 2,
    y: (touch1.y + touch2.y) / 2,
  };
}

function onTouchStart(e) {
  if (isSuccess.value) {
    return;
  }

  const touches = e.touches || [];
  gestureState.isActive = true;
  gestureState.initialTouchCount = touches.length;

  // 更新触摸点追踪
  gestureState.currentTouchIds.clear();
  for (const t of touches) {
    gestureState.currentTouchIds.add(t.identifier || 0);
  }

  if (touches.length === 1) {
    // 单指拖拽开始
    const pos = getTouchPosition(touches[0]);
    gestureState.lastSingleX = pos.x;
    gestureState.lastSingleY = pos.y;
    gestureState.dragStartOffsetX = currentOffsetX.value;
    gestureState.dragStartOffsetY = currentOffsetY.value;
    gestureState.isMultiTouch = false;
  } else if (touches.length >= 2) {
    // 双指操作开始
    const t1 = getTouchPosition(touches[0]);
    const t2 = getTouchPosition(touches[1]);
    gestureState.lastPinchDistance = getTouchDistance(t1, t2);
    gestureState.lastPinchAngle = getTouchAngle(t1, t2);
    const center = getTouchCenter(t1, t2);
    gestureState.lastPinchCenterX = center.x;
    gestureState.lastPinchCenterY = center.y;
    gestureState.pinchStartScale = currentScale.value;
    gestureState.pinchStartRotation = currentRotation.value;
    gestureState.pinchStartOffsetX = currentOffsetX.value;
    gestureState.pinchStartOffsetY = currentOffsetY.value;
    gestureState.isMultiTouch = true;
  }
}

function onTouchMove(e) {
  if (!gestureState.isActive || isSuccess.value) return;

  const touches = e.touches || [];

  // 更新触摸点追踪
  const newTouchIds = new Set();
  for (const t of touches) {
    newTouchIds.add(t.identifier || 0);
  }

  // 检测是否从单指变为双指（或反之）
  if (touches.length >= 2 && !gestureState.isMultiTouch) {
    // 从单指切换到双指，重新初始化双指状态
    const t1 = getTouchPosition(touches[0]);
    const t2 = getTouchPosition(touches[1]);
    gestureState.lastPinchDistance = getTouchDistance(t1, t2);
    gestureState.lastPinchAngle = getTouchAngle(t1, t2);
    const center = getTouchCenter(t1, t2);
    gestureState.lastPinchCenterX = center.x;
    gestureState.lastPinchCenterY = center.y;
    gestureState.pinchStartScale = currentScale.value;
    gestureState.pinchStartRotation = currentRotation.value;
    gestureState.pinchStartOffsetX = currentOffsetX.value;
    gestureState.pinchStartOffsetY = currentOffsetY.value;
    gestureState.isMultiTouch = true;
    gestureState.currentTouchIds = newTouchIds;
    return;
  }

  if (touches.length === 1 && gestureState.isMultiTouch) {
    // 从双指变为单指，切换到单指拖拽模式
    const pos = getTouchPosition(touches[0]);
    gestureState.lastSingleX = pos.x;
    gestureState.lastSingleY = pos.y;
    gestureState.dragStartOffsetX = currentOffsetX.value;
    gestureState.dragStartOffsetY = currentOffsetY.value;
    gestureState.isMultiTouch = false;
    gestureState.currentTouchIds = newTouchIds;
    return;
  }

  gestureState.currentTouchIds = newTouchIds;

  if (touches.length === 1 && !gestureState.isMultiTouch) {
    // 单指拖拽
    const pos = getTouchPosition(touches[0]);
    const deltaX = pos.x - gestureState.lastSingleX;
    const deltaY = pos.y - gestureState.lastSingleY;

    currentOffsetX.value += deltaX;
    currentOffsetY.value += deltaY;

    gestureState.lastSingleX = pos.x;
    gestureState.lastSingleY = pos.y;
  } else if (touches.length >= 2) {
    // 双指操作：缩放 + 旋转 + 平移
    const t1 = getTouchPosition(touches[0]);
    const t2 = getTouchPosition(touches[1]);

    // 计算缩放变化
    const currentDistance = getTouchDistance(t1, t2);
    if (gestureState.lastPinchDistance > 0) {
      const scaleDelta = currentDistance / gestureState.lastPinchDistance;
      const newScale = currentScale.value * scaleDelta;
      // 限制缩放范围
      currentScale.value = Math.max(0.3, Math.min(2.5, newScale));
    }

    // 计算旋转变化
    const currentAngle = getTouchAngle(t1, t2);
    if (
      gestureState.lastPinchAngle !== undefined &&
      gestureState.lastPinchDistance > 10
    ) {
      let angleDelta =
        (currentAngle - gestureState.lastPinchAngle) * (180 / Math.PI);
      // 处理角度跨越±π的情况
      if (angleDelta > 180) angleDelta -= 360;
      if (angleDelta < -180) angleDelta += 360;
      currentRotation.value += angleDelta;
    }

    // 计算双指中心移动（平移）
    const currentCenter = getTouchCenter(t1, t2);
    if (gestureState.lastPinchCenterX !== undefined) {
      const centerDeltaX = currentCenter.x - gestureState.lastPinchCenterX;
      const centerDeltaY = currentCenter.y - gestureState.lastPinchCenterY;
      currentOffsetX.value += centerDeltaX;
      currentOffsetY.value += centerDeltaY;
    }

    // 更新双指记录
    gestureState.lastPinchDistance = currentDistance;
    gestureState.lastPinchAngle = currentAngle;
    gestureState.lastPinchCenterX = currentCenter.x;
    gestureState.lastPinchCenterY = currentCenter.y;
  }
}

function onTouchEnd(e) {
  if (!gestureState.isActive) return;

  const touches = e.touches || [];

  if (touches.length === 0) {
    // 所有手指都离开了
    gestureState.isActive = false;
    gestureState.isMultiTouch = false;
    gestureState.lastPinchDistance = 0;
    gestureState.lastPinchAngle = undefined;
    gestureState.lastPinchCenterX = undefined;
    gestureState.lastPinchCenterY = undefined;
    gestureState.currentTouchIds.clear();

    // 检查是否成功
    if (!isSuccess.value) {
      // 添加小延迟，等待过渡动画完成后再检测
      setTimeout(() => {
        checkSuccess();
      }, 100);
    }
  } else if (touches.length === 1 && gestureState.isMultiTouch) {
    // 从双指变为单指
    const pos = getTouchPosition(touches[0]);
    gestureState.lastSingleX = pos.x;
    gestureState.lastSingleY = pos.y;
    gestureState.dragStartOffsetX = currentOffsetX.value;
    gestureState.dragStartOffsetY = currentOffsetY.value;
    gestureState.isMultiTouch = false;
    gestureState.lastPinchDistance = 0;
    gestureState.lastPinchAngle = undefined;
  }
}

function next() {
  pauseMusic();
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 应用初始随机状态
  applyInitialState();

  // H5端禁用页面滚动
  // #ifdef H5
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";
  // #endif

  console.log("📱 手机图片校准页面已就绪");
  console.log("  - 单指拖拽移动图片");
  console.log("  - 双指缩放旋转图片");
  console.log("  - 将图片对准镂空框即可");
  console.log("  - 位置容差:", POSITION_TOLERANCE_MAX, "px");
  console.log("  - 角度容差:", ANGLE_TOLERANCE_MAX, "°");
  console.log("  - 角度容差:", ANGLE_TOLERANCE_MIN, "°");
  console.log("  - 缩放容差: ±", SCALE_TOLERANCE);
});

onUnmounted(() => {
  // #ifdef H5
  document.body.style.overflow = "";
  document.body.style.touchAction = "";
  // #endif
});
</script>

<style scoped lang="scss">
/* ==================== 页面容器 ==================== */
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  /* 防止页面滚动 */
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}

.bg {
  width: 100%;
  height: 100%;
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
}

/* ==================== 调试控制按钮 ==================== */
.debug-controls {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 80;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: auto;
}

.control-row {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.control-btn {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  padding: 10px 22px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  text-align: center;
  min-width: 90rpx;
  user-select: none;
}

/* 边框脉冲动画 */
@keyframes pulse-border {
  0%,
  100% {
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow:
      0 0 20px rgba(255, 255, 255, 0.2),
      inset 0 0 20px rgba(255, 255, 255, 0.05);
  }

  50% {
    border-color: rgba(255, 255, 255, 0.95);
    box-shadow:
      0 0 35px rgba(255, 255, 255, 0.45),
      inset 0 0 35px rgba(255, 255, 255, 0.2);
  }
}

/* ==================== 可拖动的手机图片 ==================== */
.draggable-phone {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 400px;
  margin-left: -100px;
  /* 宽度的一半，用于居中 */
  margin-top: -200px;
  /* 高度的一半，用于居中 */
  z-index: 10;
  cursor: grab;
  /* transform-origin 默认center center */
  transform-origin: center center;
  /* 添加阴影增加立体感 */
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
}

.draggable-phone:active {
  cursor: grabbing;
}

.phone {
  width: 100%;
  height: 100%;
  z-index: 10;
}

/* ==================== 调试面板 ==================== */
.debug-panel {
  position: absolute;
  top: 16px;
  right: 10px;
  background: rgba(0, 0, 0, 0.75);
  padding: 10px 14px;
  border-radius: 10px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 200px;
}

.debug-text {
  color: #0f0;
  font-size: 10px;
  font-family: "Courier New", monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thumb {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 220rpx;
  transform: translate(-50%, -50%);
  animation: thumbScale 0.45s ease-out forwards;
  z-index: 20;
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
