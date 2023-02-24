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
