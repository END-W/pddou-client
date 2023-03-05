import request from '@/common/utils/ajax'

// 获取当前用户评论
export function getUserComment(query) {
  return request({
    url: '/api/comment/getUserComment',
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
