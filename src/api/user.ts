import api from "@/api/api";

export function loginByCode(params: any) {
  return new Promise((resolve) => {
    api.post("/api/login", params).then((res: any) => {
      resolve(res?.data);
    });
  });
}
