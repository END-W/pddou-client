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

// 判断用户是否想看电影
export function isWishMovie(query) {
  return request({
    url: '/api/wishMovie/isWishMovie',
    method: 'get',
    params: query
  })
}

// 想看电影
export function wishMovie(query) {
  return request({
    url: '/api/wishMovie/wishMovie',
    method: 'post',
    params: query
  })
}

// 取消想看电影
export function cancelWishMovie(query) {
  return request({
    url: '/api/wishMovie/cancelWishMovie',
    method: 'put',
    params: query
  })
}
