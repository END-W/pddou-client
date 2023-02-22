import request from '@/utils/request'

export function fetchCommentList(query) {
  return request({
    url: '/admin/comment/list',
    method: 'get',
    params: query
  })
}

export function removeComment(query) {
  return request({
    url: '/admin/comment/delete',
    method: 'delete',
    params: query
  })
}

export function commentStateChanged(data) {
  return request({
    url: '/admin/comment/changeStatus',
    method: 'post',
    data
  })
}
