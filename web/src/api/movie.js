import request from '@/common/utils/ajax'

// 获取电影详情
export function getMovieDetail(query) {
  return request({
    url: '/api/movie/getMovieDetail',
    method: 'get',
    params: query
  })
}

// 获取电影列表
export function getMovieList() {
  return request({
    url: '/api/movie/getMovieList',
    method: 'get'
  })
}
