"use strict";
const common_vendor = require("../common/vendor.js");
const api_user = require("../api/user.js");
const utils_index = require("./index.js");
const TOKEN_KEY = "user_token";
const URL_TOKEN_KEY = "token";
function getToken() {
  return common_vendor.index.getStorageSync(TOKEN_KEY);
}
function setToken(token) {
  common_vendor.index.setStorageSync(TOKEN_KEY, token);
}
function removeToken() {
  common_vendor.index.removeStorage({ key: TOKEN_KEY });
}
async function ensureLogin() {
  const params = utils_index.getQueryParams();
  common_vendor.index.__f__("log", "at utils/auth.ts:49", params, "====params");
  const urlToken = params == null ? void 0 : params[URL_TOKEN_KEY];
  if (urlToken) {
    setToken(urlToken);
    const url = new URL(window.location.href);
    url.searchParams.delete(URL_TOKEN_KEY);
    history.replaceState({}, "", url.toString());
    return;
  }
  const token = getToken();
  if (token) {
    return;
  }
  if (params == null ? void 0 : params.code) {
    try {
      const res = await api_user.loginByCode({
        code: params == null ? void 0 : params.code
      });
      setToken(res == null ? void 0 : res.token);
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      history.replaceState({}, "", url.toString());
      return;
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/auth.ts:78", e);
      return;
    }
  }
  common_vendor.index.__f__("log", "at utils/auth.ts:82", "development", "====env");
  {
    common_vendor.index.__f__("warn", "at utils/auth.ts:84", "开发环境自动跳过授权登录");
    return;
  }
}
exports.ensureLogin = ensureLogin;
exports.getToken = getToken;
exports.removeToken = removeToken;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/auth.js.map
