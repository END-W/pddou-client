import request from '@/common/utils/ajax'

// 获取当前用户评论
export function getUserComment(query) {
  return request({
    url: '/api/comment/getUserComment',
    method: 'get',
    params: query
  })
}

// 获取所有用户通过审核的评论
export function getAllUserPassComment(query) {
  return request({
    url: '/api/comment/getAllUserPassComment',
    method: 'get',
    params: query
  })
}

// 更新当前用户评论
export function updateUserComment(data) {
  return request({
    url: '/api/comment/updateUserComment',
    method: 'post',
    data
  })
}

// 获取当前评论
export function getCommentById(query) {
  return request({
    url: '/api/comment/getCommentById',
    method: 'get',
    params: query
  })
}

// 更新当前评论的用户点赞
export function updateUserSupport(data) {
  return request({
    url: '/api/comment/updateUserSupport',
    method: 'post',
    data
  })
}
