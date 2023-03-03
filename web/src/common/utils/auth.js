import cookies from 'vue-cookies'

export function getToken() {
  return cookies.get('token')
}

export function setToken(token, expire) {
  return cookies.set('token', token, expire)
}

export function removeToken() {
  return cookies.remove('token')
}
