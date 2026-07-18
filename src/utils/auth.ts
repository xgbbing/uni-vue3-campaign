import { loginByCode } from "@/api/user"; // 你的登录接口
import { getQueryParams, isWechatBrowser } from "@/utils/index";

const TOKEN_KEY = "user_token";
const APP_ID = "wx1f80766358e451e8";
const URL_TOKEN_KEY = "token";

/**
 * 获取 Token
 */
export function getToken() {
  return uni.getStorageSync(TOKEN_KEY);
}

/**
 * 保存 Token
 */
export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token);
}

export function removeToken() {
  uni.removeStorage(TOKEN_KEY);
}

/**
 * 跳公众号 OAuth
 */
function redirectWechatOAuth() {
  // 回调到当前页面
  const redirectUri = encodeURIComponent(window?.location?.href);
  const url =
    `https://open.weixin.qq.com/connect/oauth2/authorize` +
    `?appid=${APP_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=snsapi_base` +
    `&state=STATE` +
    `#wechat_redirect`;
  window.location.replace(url);
}

/**
 * 登录检查
 */
export async function ensureLogin() {
  // ① URL 有没有 token（小程序传过来的）
  const params = getQueryParams();
  console.log(params, "====params");
  const urlToken = params?.[URL_TOKEN_KEY];
  if (urlToken) {
    setToken(urlToken);
    // 清理 URL，避免 token 一直暴露
    const url = new URL(window.location.href);
    url.searchParams.delete(URL_TOKEN_KEY);
    history.replaceState({}, "", url.toString());
    return;
  }
  // ② 本地已有 Token
  const token = getToken();
  if (token) {
    return;
  }
  // ③ OAuth 回来的 code
  if (params?.code) {
    try {
      const res = await loginByCode({
        code: params?.code,
      });
      setToken(res.token);
      // 清除 code
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      history.replaceState({}, "", url.toString());
      return;
    } catch (e) {
      console.error(e);
      return;
    }
  }
  console.log(process.env.NODE_ENV, "====env");
  if (process.env.NODE_ENV === "development") {
    console.warn("开发环境自动跳过授权登录");
    return;
  }

  // ④ 微信浏览器
  if (isWechatBrowser()) {
    redirectWechatOAuth();
    return;
  }

  // ⑤ 其它浏览器
  console.warn("非微信环境，无法自动登录");

  uni.showToast({
    title: "请在微信内打开",
    icon: "none",
  });
}
