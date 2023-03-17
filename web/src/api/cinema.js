import request from '@/common/utils/ajax'

// 获取影院列表
export function getCinemaList(query) {
  return request({
    url: '/api/cinema/getCinemaList',
    method: 'get',
    params: query
  })
}

// 根据名字模糊匹配影院
export function matchCinemaByName(query) {
  return request({
    url: '/api/cinema/matchCinemaByName',
    method: 'get',
    params: query
  })
}

// 获取当前影院详情
export function getCurrentCinemaDetail(query) {
  return request({
    url: '/api/cinema/getCurrentCinemaDetail',
    method: 'get',
    params: query
  })
}

// 获取当前影院的排片
export function getCurrentCinemaMovieSchedule(query) {
  return request({
    url: '/api/cinema/getCurrentCinemaMovieSchedule',
    method: 'get',
    params: query
  })
}
