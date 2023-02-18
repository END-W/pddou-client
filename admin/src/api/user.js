import request from '@/utils/request'

export function fetchUserList(query) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: query
  })
}

export function removeUser(data) {
  return request({
    url: '/admin/user/delete',
    method: 'delete',
    params: data
  })
}

export function userStateChanged(data) {
  return request({
    url: '/admin/user/changeStatus',
    method: 'post',
    data
  })
}
