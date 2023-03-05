import request from '@/common/utils/ajax'

// 获取个人想看电影
export function getWishMovieByUserId() {
  return request({
    url: '/api/wishMovie/getWishMovieByUserId',
    method: 'get'
  })
}

// 获取个人评论的电影
export function getIsWatchedMovieByUserId() {
  return request({
    url: '/api/comment/getIsWatchedMovieByUserId',
    method: 'get'
  })
}
