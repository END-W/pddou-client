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

export function getCookie(key) {
  return cookies.get(key)
}

export function setCookie(key, data, expire) {
  return cookies.set(key, data, expire)
}

export function removeCookie(key) {
  return cookies.remove(key)
}
