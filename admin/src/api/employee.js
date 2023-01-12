import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/auth/info',
    method: 'get'
  })
}

export function changePassword(data) {
  return request({
    url: '/admin/auth/changePwd',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/admin/auth/logout',
    method: 'post'
  })
}
