import request from '@/utils/request'

export function fetchScheduleList(query) {
  return request({
    url: '/admin/schedule/listByStore',
    method: 'get',
    params: query
  })
}

export function fetchMovieByStore(query) {
  return request({
    url: '/admin/schedule/getMovieByStore',
    method: 'get',
    params: query
  })
}

export function fetchHallList() {
  return request({
    url: '/admin/hall/getHallByStore',
    method: 'get'
  })
}

export function addScheduleByStore(data) {
  return request({
    url: '/admin/schedule/addByStore',
    method: 'post',
    data
  })
}

export function removeScheduleByStore(query) {
  return request({
    url: '/admin/schedule/deleteByStore',
    method: 'delete',
    params: query
  })
}
