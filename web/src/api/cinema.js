import request from '@/common/utils/ajax'

// 获取影院列表
export function getCinemaList(query) {
  return request({
    url: '/api/cinema/getCinemaList',
    method: 'get',
    params: query
  })
}
