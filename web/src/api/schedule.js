import request from '@/common/utils/ajax'

// 获取排片详情
export function getScheduleById(query) {
  return request({
    url: '/api/schedule/getScheduleById',
    method: 'get',
    params: query
  })
}

// 更新排片座位信息
export function updateScheduleSeat(data) {
    return request({
      url: '/api/schedule/updateScheduleSeat',
      method: 'put',
      data
    })
  }