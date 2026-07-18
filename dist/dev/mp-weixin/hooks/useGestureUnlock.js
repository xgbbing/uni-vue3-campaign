"use strict";
const common_vendor = require("../common/vendor.js");
function useGestureUnlock(options) {
  const {
    direction = "right",
    distance = 40,
    tolerance = 40,
    strictArea = true,
    onSuccess
  } = options;
  const unlocked = common_vendor.ref(false);
  const system = common_vendor.index.getSystemInfoSync();
  const area = normalizeArea(options.area);
  let startX = 0;
  let startY = 0;
  let validStart = false;
  let movedOut = false;
  function normalizeArea(area2) {
    if ("x" in area2) {
      return {
        left: area2.x * system.windowWidth,
        top: area2.y * system.windowHeight,
        right: (area2.x + area2.width) * system.windowWidth,
        bottom: (area2.y + area2.height) * system.windowHeight
      };
    }
    return area2;
  }
  function inArea(x, y) {
    return x >= area.left && x <= area.right && y >= area.top && y <= area.bottom;
  }
  function onTouchStart(e) {
    if (unlocked.value)
      return;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    validStart = inArea(startX, startY);
    movedOut = false;
  }
  function onTouchMove(e) {
    if (!validStart)
      return;
    if (!strictArea)
      return;
    const touch = e.touches[0];
    if (!inArea(touch.clientX, touch.clientY)) {
      movedOut = true;
    }
  }
  function onTouchEnd(e) {
    if (!validStart)
      return;
    if (strictArea && movedOut)
      return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    let success = false;
    switch (direction) {
      case "right":
        success = dx >= distance && Math.abs(dy) <= tolerance;
        break;
      case "left":
        success = dx <= -distance && Math.abs(dy) <= tolerance;
        break;
      case "up":
        success = dy <= -distance && Math.abs(dx) <= tolerance;
        break;
      case "down":
        success = dy >= distance && Math.abs(dx) <= tolerance;
        break;
    }
    if (!success)
      return;
    unlocked.value = true;
    onSuccess == null ? void 0 : onSuccess();
  }
  function reset() {
    unlocked.value = false;
    validStart = false;
    movedOut = false;
  }
  return {
    unlocked,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    reset
  };
}
exports.useGestureUnlock = useGestureUnlock;
//# sourceMappingURL=../../.sourcemap/mp-weixin/hooks/useGestureUnlock.js.map
