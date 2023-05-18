import request from '@/utils/request'

export function fetchOrderList(query) {
  return request({
    url: '/admin/order/list',
    method: 'get',
    params: query
  })
}

export function removeOrderByStore(query) {
  return request({
    url: '/admin/order/deleteByStore',
    method: 'delete',
    params: query
  })
}

export function fetchBoxOffice(query) {
  return request({
    url: '/admin/boxOffice/getBoxOfficeData',
    method: 'get',
    params: query
  })
}

export function fetchBoxOfficeDataByMovieType(query) {
  return request({
    url: '/admin/boxOffice/getBoxOfficeDataByMovieType',
    method: 'get',
    params: query
  })
}

export function fetchBoxOfficeTop10(query) {
  return request({
    url: '/admin/boxOffice/getBoxOfficeTop10',
    method: 'get',
    params: query
  })
}
