"use strict";
const common_vendor = require("../common/vendor.js");
const utils_auth = require("../utils/auth.js");
const baseUrl = "https://xgbbing.win";
const tokenHead = "Bearer";
const request = (params) => {
  const { method, url, data } = params;
  return new Promise(function(resolve, reject) {
    let token = utils_auth.getToken();
    let header = {
      Authorization: `${tokenHead} ${token}`
    };
    try {
      common_vendor.index.__f__("log", "at api/request.ts:28", data, "=====request data", url);
      common_vendor.index.request({
        url: `${baseUrl}${url}`,
        method,
        data,
        header,
        success: (res) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          common_vendor.index.__f__("log", "at api/request.ts:35", res == null ? void 0 : res.data, "=====sucess res", url);
          const code = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.code) || null;
          if (code == 200) {
            resolve(res == null ? void 0 : res.data);
          } else if (code == 500) {
            common_vendor.index.showToast({
              title: ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.message) || ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.error) || "服务器异常，请稍后再试",
              icon: "none",
              duration: 3e3
            });
            reject(
              ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.message) || ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.error) || "服务器异常，请稍后再试"
            );
          } else if (code == 401) {
            utils_auth.removeToken();
            common_vendor.index.showToast({
              title: ((_f = res == null ? void 0 : res.data) == null ? void 0 : _f.message) || "登录token失效，请重新授权登录",
              icon: "none",
              duration: 3e3
            });
          } else {
            common_vendor.index.showToast({
              title: ((_g = res == null ? void 0 : res.data) == null ? void 0 : _g.message) || ((_h = res == null ? void 0 : res.data) == null ? void 0 : _h.error) || "请求失败，请稍后再试",
              icon: "none",
              duration: 3e3
            });
            reject(
              ((_i = res == null ? void 0 : res.data) == null ? void 0 : _i.message) || ((_j = res == null ? void 0 : res.data) == null ? void 0 : _j.error) || "请求失败，请稍后再试"
            );
          }
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at api/request.ts:76", error, "=====fail error", url);
          common_vendor.index.showToast({
            title: error.errMsg || "网络波动，请稍后再试",
            icon: "none",
            duration: 3e3
          });
          reject(error.errMsg || "网络波动，请稍后再试");
        }
      });
    } catch (err) {
      common_vendor.index.__f__("error", "at api/request.ts:86", err, "=====catch error", url);
      common_vendor.index.showToast({
        title: (err == null ? void 0 : err.errMsg) || "未知异常，请稍后再试",
        icon: "none",
        duration: 3e3
      });
      reject((err == null ? void 0 : err.errMsg) || "未知异常，请稍后再试");
    }
  });
};
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/request.js.map
