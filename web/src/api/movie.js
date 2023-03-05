import request from '@/common/utils/ajax'

// 获取电影详情
export function getMovieDetail(query) {
  return request({
    url: '/api/movie/getMovieDetail',
    method: 'get',
    params: query
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

// 获取所有用户通过审核的评论
export function getAllUserPassComment(query) {
  return request({
    url: '/api/comment/getAllUserPassComment',
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
