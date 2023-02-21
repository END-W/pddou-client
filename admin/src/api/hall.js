import request from '@/utils/request'

export function fetchHallListByStore(query) {
  return request({
    url: '/admin/hall/listByStore',
    method: 'get',
    params: query
  })
}

export function addHallByStore(data) {
  return request({
    url: '/admin/hall/addByStore',
    method: 'post',
    data
  })
}

export function editHallByStore(data) {
  return request({
    url: '/admin/hall/updateByStore',
    method: 'put',
    data
  })
}

export function removeHallByStore(query) {
  return request({
    url: '/admin/hall/deleteByStore',
    method: 'delete',
    params: query
  })
}
