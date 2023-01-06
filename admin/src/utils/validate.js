/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return str.trim() !== '' && str.trim().length >= 3
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validPassword(password) {
  return /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{1,9}$/.test(password)
}
