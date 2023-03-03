import axios from 'axios'
import { Toast, MessageBox } from 'mint-ui'
import { getToken } from '@/common/utils/auth'

// 封装ajax
// export default function ajax(url = '', params = {}, type = 'GET') {
//   let promise
//   return new Promise(((resolve, reject) => {
//     // 1.判断请求方式
//     if ('GET' === type) {
//       // 1.1拼接字符串
//       let str = ''
//       Object.keys(params).forEach((value, index) => {
//         if (index + 1 === Object.keys(params).length) {
//           str += value + '=' + params[value]
//         } else {
//           str += value + '=' + params[value] + '&'
//         }
//       })
//       // 1.2完整路径
//       url += '?' + str
//       // 1.3发送get请求
//       promise = axios.get(url)
//     } else if ('POST' === type) {
//       // 1.3发送post请求
//       promise = axios.post(url, params)
//     }
//     // 2.返回请求结果
//     promise.then((response) => {
//       resolve(response.data)
//     }).catch((error) => {
//       reject(error)
//     })
//   }))
// }

// create an axios instance
const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Toast({
        message: res.message || 'Error',
        position: 'top',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.alert('您已经注销，请重新登录')
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Toast({
      message: error.message,
      position: 'top',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
