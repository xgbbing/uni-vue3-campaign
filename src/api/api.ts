import request from "@/api/request";

export default {
  get(url: string, data: any) {
    return request({
      method: "GET",
      url,
      data,
    });
  },

  post(url: string, data: any) {
    return request({
      method: "POST",
      url,
      data,
    });
  },
};
