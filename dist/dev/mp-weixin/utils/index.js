"use strict";
function getQueryParams() {
  var _a;
  const url = (_a = window == null ? void 0 : window.location) == null ? void 0 : _a.href;
  if (!url)
    return {};
  const paramArr = url.slice(url.indexOf("?") + 1).split("&");
  const params = {};
  paramArr.map((param) => {
    const [key, val] = param.split("=");
    params[key] = decodeURIComponent(val);
  });
  return params;
}
exports.getQueryParams = getQueryParams;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/index.js.map
