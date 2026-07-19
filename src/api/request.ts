import { getToken, removeToken } from '@/utils/auth'

const baseUrl = 'https://xgbbing.win'
const tokenHead = 'Bearer'

interface RequestParams {
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
  url: string
  data?: any
}

const request = (params: RequestParams) => {
  const { method, url, data } = params
  return new Promise(function (resolve, reject) {
    const token = getToken()
    const header = {
      Authorization: `${tokenHead} ${token}`,
    }
    try {
      console.log(data, '=====request data', url)
      uni.request({
        url: `${baseUrl}${url}`,
        method,
        data,
        header,
        success: (res: any) => {
          console.log(res?.data, '=====sucess res', url)
          const code = res?.data?.code || null
          if (code == 200) {
            resolve(res?.data)
          } else if (code == 500) {
            uni.showToast({
              title: res?.data?.message || res?.data?.error || '服务器异常，请稍后再试',
              icon: 'none',
              duration: 3000,
            })
            reject(res?.data?.message || res?.data?.error || '服务器异常，请稍后再试')
          } else if (code == 401) {
            removeToken()
            uni.showToast({
              title: res?.data?.message || '登录token失效，请重新授权登录',
              icon: 'none',
              duration: 3000,
            })
          } else {
            //其他异常
            uni.showToast({
              title: res?.data?.message || res?.data?.error || '请求失败，请稍后再试',
              icon: 'none',
              duration: 3000,
            })
            reject(res?.data?.message || res?.data?.error || '请求失败，请稍后再试')
          }
        },
        fail: (error) => {
          console.error(error, '=====fail error', url)
          uni.showToast({
            title: error.errMsg || '网络波动，请稍后再试',
            icon: 'none',
            duration: 3000,
          })
          reject(error.errMsg || '网络波动，请稍后再试')
        },
      })
    } catch (err: any) {
      console.error(err, '=====catch error', url)
      uni.showToast({
        title: err?.errMsg || '未知异常，请稍后再试',
        icon: 'none',
        duration: 3000,
      })
      reject(err?.errMsg || '未知异常，请稍后再试')
    }
  })
}

export default request
