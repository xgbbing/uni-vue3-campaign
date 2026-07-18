"use strict";
const api_request = require("./request.js");
const api = {
  get(url, data) {
    return api_request.request({
      method: "GET",
      url,
      data
    });
  },
  post(url, data) {
    return api_request.request({
      method: "POST",
      url,
      data
    });
  }
};
exports.api = api;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/api.js.map
