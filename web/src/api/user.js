import request from '@/common/utils/ajax'

// 获取验证码
export function getPhoneCode(query) {
  return request({
    url: '/api/user/getPhoneCode',
    method: 'get',
    params: query
  })
}

// 手机登录
export function phoneLogin(data) {
  return request({
    url: '/api/user/phoneLogin',
    method: 'post',
    data
  })
}

// 账号密码登录
export function pwdLogin(data) {
  return request({
    url: '/api/user/pwdLogin',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/user/getUserInfo',
    method: 'get'
  })
}
