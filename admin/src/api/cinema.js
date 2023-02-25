import request from '@/utils/request'

export function fetchCinemaList(query) {
  return request({
    url: '/admin/cinema/list',
    method: 'get',
    params: query
  })
}

export function examineCinema(data) {
  return request({
    url: '/admin/cinema/examineCinema',
    method: 'post',
    data
  })
}

export function blockCinema(query) {
  return request({
    url: '/admin/cinema/blockCinema',
    method: 'post',
    params: query
  })
}
