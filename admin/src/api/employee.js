import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/auth/info',
    method: 'get'
  })
}

export function changePassword(data) {
  return request({
    url: '/admin/auth/changePwd',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/admin/auth/logout',
    method: 'post'
  })
}

export function fetchEmployeeList(query) {
  return request({
    url: '/admin/employee/list',
    method: 'get',
    params: query
  })
}

export function addEmployee(data) {
  return request({
    url: '/admin/employee/add',
    method: 'post',
    data
  })
}

export function editEmployee(data) {
  return request({
    url: '/admin/employee/update',
    method: 'put',
    data
  })
}

export function removeEmployee(data) {
  return request({
    url: '/admin/employee/delete',
    method: 'delete',
    params: data
  })
}

export function employeeStateChanged(data) {
  return request({
    url: '/admin/employee/changeStatus',
    method: 'post',
    data
  })
}
