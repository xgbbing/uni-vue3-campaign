"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const hooks_useAudio = require("../../hooks/useAudio.js");
const PHONE_SCALE = 1.7;
const POSITION_TOLERANCE_MIN = 5;
const POSITION_TOLERANCE_MAX = 20;
const ANGLE_TOLERANCE_MIN = -64;
const ANGLE_TOLERANCE_MAX = -58;
const SCALE_TOLERANCE = 0.2;
const INITIAL_SCALE_MIN = 0.5;
const INITIAL_SCALE_MAX = 1.5;
const INITIAL_ROTATION_MIN = 60;
const INITIAL_ROTATION_MAX = 90;
const INITIAL_OFFSET_DISTANCE = 100;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "play-second",
  setup(__props) {
    const currentOffsetX = common_vendor.ref(0);
    const currentOffsetY = common_vendor.ref(0);
    const currentScale = common_vendor.ref(1);
    const currentRotation = common_vendor.ref(0);
    const isSuccess = common_vendor.ref(false);
    const showDebug = common_vendor.ref(true);
    const { playMusic, pauseMusic } = hooks_useAudio.useAudio({ bgMusic: common_assets.bgMusic });
    const gestureState = common_vendor.reactive({
      isActive: false,
      // 是否有活跃手势
      initialTouchCount: 0,
      // 初始触摸点数量
      // 单指拖拽
      lastSingleX: 0,
      lastSingleY: 0,
      dragStartOffsetX: 0,
      dragStartOffsetY: 0,
      // 双指操作
      lastPinchDistance: 0,
      // 上次双指距离
      lastPinchAngle: 0,
      // 上次双指角度（弧度）
      lastPinchCenterX: 0,
      // 上次双指中心X
      lastPinchCenterY: 0,
      // 上次双指中心Y
      pinchStartScale: 1,
      pinchStartRotation: 0,
      pinchStartOffsetX: 0,
      pinchStartOffsetY: 0,
      // 当前触摸点追踪
      currentTouchIds: /* @__PURE__ */ new Set(),
      isMultiTouch: false
    });
    const phoneStyle = common_vendor.computed(() => {
      const tx = currentOffsetX.value;
      const ty = currentOffsetY.value;
      const s = currentScale.value;
      const r = currentRotation.value;
      return {
        transform: `translate(${tx}px, ${ty}px) scale(${s}) rotate(${r}deg)`,
        transition: gestureState.isActive ? "none" : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      };
    });
    const distanceToTarget = common_vendor.computed(() => {
      return Math.sqrt(currentOffsetX.value ** 2 + currentOffsetY.value ** 2);
    });
    const angleDiff = common_vendor.computed(() => {
      return currentRotation.value % 360 - ANGLE_TOLERANCE_MAX;
    });
    function generateInitialState() {
      const scale = INITIAL_SCALE_MIN + Math.random() * (INITIAL_SCALE_MAX - INITIAL_SCALE_MIN);
      const rotationMagnitude = INITIAL_ROTATION_MIN + Math.random() * (INITIAL_ROTATION_MAX - INITIAL_ROTATION_MIN);
      const rotationSign = Math.random() > 0.5 ? 1 : -1;
      const rotation = rotationMagnitude * rotationSign;
      const directions = [
        {
          x: 0,
          y: -INITIAL_OFFSET_DISTANCE
        },
        // 上
        {
          x: 0,
          y: INITIAL_OFFSET_DISTANCE
        },
        // 下
        {
          x: -INITIAL_OFFSET_DISTANCE,
          y: 0
        },
        // 左
        {
          x: INITIAL_OFFSET_DISTANCE,
          y: 0
        }
        // 右
      ];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const offsetX = dir.x + (Math.random() - 0.5) * 40;
      const offsetY = dir.y + (Math.random() - 0.5) * 40;
      return {
        scale,
        rotation,
        offsetX,
        offsetY
      };
    }
    function applyInitialState() {
      const state = generateInitialState();
      currentScale.value = state.scale;
      currentRotation.value = state.rotation;
      currentOffsetX.value = state.offsetX;
      currentOffsetY.value = state.offsetY;
      isSuccess.value = false;
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:184", "初始状态:", {
        scale: state.scale.toFixed(2),
        rotation: state.rotation.toFixed(1) + "°",
        offsetX: state.offsetX.toFixed(0) + "px",
        offsetY: state.offsetY.toFixed(0) + "px"
      });
    }
    function zoomIn() {
      if (isSuccess.value)
        return;
      currentScale.value = Math.min(2.5, currentScale.value + 0.1);
      checkSuccess();
    }
    function zoomOut() {
      if (isSuccess.value)
        return;
      currentScale.value = Math.max(0.3, currentScale.value - 0.1);
      checkSuccess();
    }
    function rotateCW() {
      if (isSuccess.value)
        return;
      currentRotation.value += 2;
      checkSuccess();
    }
    function rotateCCW() {
      if (isSuccess.value)
        return;
      currentRotation.value -= 2;
      checkSuccess();
    }
    function checkSuccess() {
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:219", distanceToTarget.value, "===distanceToTarget.value");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:220", currentRotation.value, "===currentRotation.value");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:221", currentScale.value % 360, "===currentScale.value");
      const distOk = distanceToTarget.value <= POSITION_TOLERANCE_MAX && distanceToTarget.value >= POSITION_TOLERANCE_MIN;
      const angleOk = currentRotation.value % 360 <= ANGLE_TOLERANCE_MAX && currentRotation.value % 360 >= ANGLE_TOLERANCE_MIN;
      const scaleOk = Math.abs(currentScale.value - PHONE_SCALE) <= SCALE_TOLERANCE;
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:226", distOk, "===distOk");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:227", angleOk, "===angleOk");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:228", scaleOk, "===scaleOk");
      if (distOk && angleOk && scaleOk) {
        triggerSuccess();
        return true;
      }
      return false;
    }
    function triggerSuccess() {
      if (isSuccess.value)
        return;
      isSuccess.value = true;
      if (common_vendor.index.vibrateShort) {
        try {
          common_vendor.index.vibrateShort({
            type: "medium"
          });
        } catch (e) {
        }
      }
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:257", "✅ 成功！图片已归位");
      playMusic();
    }
    function getTouchPosition(touch) {
      return {
        x: touch.clientX || touch.x || 0,
        y: touch.clientY || touch.y || 0
      };
    }
    function getTouchDistance(touch1, touch2) {
      const dx = touch1.x - touch2.x;
      const dy = touch1.y - touch2.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    function getTouchAngle(touch1, touch2) {
      return Math.atan2(touch2.y - touch1.y, touch2.x - touch1.x);
    }
    function getTouchCenter(touch1, touch2) {
      return {
        x: (touch1.x + touch2.x) / 2,
        y: (touch1.y + touch2.y) / 2
      };
    }
    function onTouchStart(e) {
      if (isSuccess.value) {
        return;
      }
      const touches = e.touches || [];
      gestureState.isActive = true;
      gestureState.initialTouchCount = touches.length;
      gestureState.currentTouchIds.clear();
      for (const t of touches) {
        gestureState.currentTouchIds.add(t.identifier || 0);
      }
      if (touches.length === 1) {
        const pos = getTouchPosition(touches[0]);
        gestureState.lastSingleX = pos.x;
        gestureState.lastSingleY = pos.y;
        gestureState.dragStartOffsetX = currentOffsetX.value;
        gestureState.dragStartOffsetY = currentOffsetY.value;
        gestureState.isMultiTouch = false;
      } else if (touches.length >= 2) {
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
      if (!gestureState.isActive || isSuccess.value)
        return;
      const touches = e.touches || [];
      const newTouchIds = /* @__PURE__ */ new Set();
      for (const t of touches) {
        newTouchIds.add(t.identifier || 0);
      }
      if (touches.length >= 2 && !gestureState.isMultiTouch) {
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
        const pos = getTouchPosition(touches[0]);
        const deltaX = pos.x - gestureState.lastSingleX;
        const deltaY = pos.y - gestureState.lastSingleY;
        currentOffsetX.value += deltaX;
        currentOffsetY.value += deltaY;
        gestureState.lastSingleX = pos.x;
        gestureState.lastSingleY = pos.y;
      } else if (touches.length >= 2) {
        const t1 = getTouchPosition(touches[0]);
        const t2 = getTouchPosition(touches[1]);
        const currentDistance = getTouchDistance(t1, t2);
        if (gestureState.lastPinchDistance > 0) {
          const scaleDelta = currentDistance / gestureState.lastPinchDistance;
          const newScale = currentScale.value * scaleDelta;
          currentScale.value = Math.max(0.3, Math.min(2.5, newScale));
        }
        const currentAngle = getTouchAngle(t1, t2);
        if (gestureState.lastPinchAngle !== void 0 && gestureState.lastPinchDistance > 10) {
          let angleDelta = (currentAngle - gestureState.lastPinchAngle) * (180 / Math.PI);
          if (angleDelta > 180)
            angleDelta -= 360;
          if (angleDelta < -180)
            angleDelta += 360;
          currentRotation.value += angleDelta;
        }
        const currentCenter = getTouchCenter(t1, t2);
        if (gestureState.lastPinchCenterX !== void 0) {
          const centerDeltaX = currentCenter.x - gestureState.lastPinchCenterX;
          const centerDeltaY = currentCenter.y - gestureState.lastPinchCenterY;
          currentOffsetX.value += centerDeltaX;
          currentOffsetY.value += centerDeltaY;
        }
        gestureState.lastPinchDistance = currentDistance;
        gestureState.lastPinchAngle = currentAngle;
        gestureState.lastPinchCenterX = currentCenter.x;
        gestureState.lastPinchCenterY = currentCenter.y;
      }
    }
    function onTouchEnd(e) {
      if (!gestureState.isActive)
        return;
      const touches = e.touches || [];
      if (touches.length === 0) {
        gestureState.isActive = false;
        gestureState.isMultiTouch = false;
        gestureState.lastPinchDistance = 0;
        gestureState.lastPinchAngle = void 0;
        gestureState.lastPinchCenterX = void 0;
        gestureState.lastPinchCenterY = void 0;
        gestureState.currentTouchIds.clear();
        if (!isSuccess.value) {
          setTimeout(() => {
            checkSuccess();
          }, 100);
        }
      } else if (touches.length === 1 && gestureState.isMultiTouch) {
        const pos = getTouchPosition(touches[0]);
        gestureState.lastSingleX = pos.x;
        gestureState.lastSingleY = pos.y;
        gestureState.dragStartOffsetX = currentOffsetX.value;
        gestureState.dragStartOffsetY = currentOffsetY.value;
        gestureState.isMultiTouch = false;
        gestureState.lastPinchDistance = 0;
        gestureState.lastPinchAngle = void 0;
      }
    }
    function next() {
      pauseMusic();
    }
    common_vendor.onMounted(() => {
      applyInitialState();
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:474", "📱 手机图片校准页面已就绪");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:475", "  - 单指拖拽移动图片");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:476", "  - 双指缩放旋转图片");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:477", "  - 将图片对准镂空框即可");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:478", "  - 位置容差:", POSITION_TOLERANCE_MAX, "px");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:479", "  - 角度容差:", ANGLE_TOLERANCE_MAX, "°");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:480", "  - 角度容差:", ANGLE_TOLERANCE_MIN, "°");
      common_vendor.index.__f__("log", "at pages/play/play-second.vue:481", "  - 缩放容差: ±", SCALE_TOLERANCE);
    });
    common_vendor.onUnmounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$1,
        b: showDebug.value && !isSuccess.value
      }, showDebug.value && !isSuccess.value ? {
        c: common_vendor.o(zoomIn),
        d: common_vendor.o(zoomOut),
        e: common_vendor.o(rotateCW),
        f: common_vendor.o(rotateCCW),
        g: common_vendor.o(() => {
        })
      } : {}, {
        h: common_assets._imports_1$1,
        i: common_vendor.s(phoneStyle.value),
        j: common_vendor.o(onTouchStart),
        k: common_vendor.o(onTouchMove),
        l: common_vendor.o(onTouchEnd),
        m: showDebug.value && !isSuccess.value
      }, showDebug.value && !isSuccess.value ? {
        n: common_vendor.t(Math.round(currentOffsetX.value)),
        o: common_vendor.t(Math.round(currentOffsetY.value)),
        p: common_vendor.t(currentScale.value.toFixed(2)),
        q: common_vendor.t(currentRotation.value.toFixed(1)),
        r: common_vendor.t(distanceToTarget.value.toFixed(0)),
        s: common_vendor.t(angleDiff.value.toFixed(1)),
        t: common_vendor.t(isSuccess.value ? "成功" : "偏离")
      } : {}, {
        v: isSuccess.value
      }, isSuccess.value ? {
        w: common_assets._imports_2
      } : {}, {
        x: isSuccess.value
      }, isSuccess.value ? {
        y: common_assets._imports_1,
        z: common_vendor.o(next)
      } : {}, {
        A: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fa30be6b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/play/play-second.js.map
