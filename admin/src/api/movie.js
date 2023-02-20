import request from '@/utils/request'

export function fetchMovieList(query) {
  return request({
    url: '/admin/movie/list',
    method: 'get',
    params: query
  })
}

export function fetchMovieListByStore(query) {
  return request({
    url: '/admin/movie/listByStore',
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

export function fetchMovieByStore(query) {
  return request({
    url: '/admin/movie/getMovieByStore',
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

export function addMovieByStore(data) {
  return request({
    url: '/admin/movie/addByStore',
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

export function editMovieByStore(data) {
  return request({
    url: '/admin/movie/updateByStore',
    method: 'put',
    data
  })
}

export function removeMovieByStore(query) {
  return request({
    url: '/admin/movie/deleteByStore',
    method: 'delete',
    params: query
  })
}

export function movieStateChanged(data) {
  return request({
    url: '/admin/movie/changeStatus',
    method: 'post',
    data
  })
}
