import request from '@/common/utils/ajax'

// 获取个人订单信息
export function getOrderByUserId() {
  return request({
    url: '/api/order/getOrderByUserId',
    method: 'get'
  })
}

// 删除个人订单信息
export function delOrderByUserId(query) {
  return request({
    url: '/api/order/delOrderByUserId',
    method: 'delete',
    params: query
  })
}
