"use strict";
const api_api = require("./api.js");
function loginByCode(params) {
  return new Promise((resolve) => {
    api_api.api.post("/api/login", params).then((res) => {
      resolve(res == null ? void 0 : res.data);
    });
  });
}
exports.loginByCode = loginByCode;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
