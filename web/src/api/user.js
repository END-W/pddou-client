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

// 更新用户昵称
export function updateUserName(data) {
  return request({
    url: '/api/user/updateUserName',
    method: 'post',
    data
  })
}

// 更新用户性别
export function updateUserGender(data) {
  return request({
    url: '/api/user/updateUserGender',
    method: 'post',
    data
  })
}

// 更新用户生日
export function updateUserBirthday(data) {
  return request({
    url: '/api/user/updateUserBirthday',
    method: 'post',
    data
  })
}

// 更新用户手机号
export function updateUserPhone(data) {
  return request({
    url: '/api/user/updateUserPhone',
    method: 'post',
    data
  })
}

// 上传头像
export function upLoadImg(data) {
  return request({
    url: '/api/upload/upLoadImg',
    method: 'post',
    data
  })
}
