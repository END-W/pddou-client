import request from '@/utils/request'

export function fetchMovieList(query) {
  return request({
    url: '/admin/movie/list',
    method: 'get',
    params: query
  })
}

export function fetchMovie(query) {
  return request({
    url: '/admin/movie/getMovie',
    method: 'get',
    params: query
  })
}

export function addMovie(data) {
  return request({
    url: '/admin/movie/add',
    method: 'post',
    data
  })
}

export function editMovie(data) {
  return request({
    url: '/admin/movie/update',
    method: 'put',
    data
  })
}

export function movieStateChanged(data) {
  return request({
    url: '/admin/movie/changeStatus',
    method: 'post',
    data
  })
}
