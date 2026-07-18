/**
 * 获取 URL 参数
 */
export function getQueryParams() {
  const url = window?.location?.href;
  if (!url) return {};
  const paramArr = url.slice(url.indexOf("?") + 1).split("&");
  const params: any = {};
  paramArr.map((param) => {
    const [key, val] = param.split("=");
    params[key] = decodeURIComponent(val);
  });
  return params;
}

/**
 * 是否微信浏览器
 */
export function isWechatBrowser() {
  return /MicroMessenger/i.test(navigator?.userAgent);
}
