// 格式化日期
export const formatDate = function (date, flag) {
  if (date instanceof Date) {
    let now = new Date()
    let today = now.getFullYear() + '-0' + (now.getMonth() + 1) + '-' + now.getDate()
    let differTime = date.getTime() - new Date(today)
    let date_day = parseInt(differTime / 24 / 60 / 60 / 1000)
    let date_hours = parseInt(Math.abs(differTime / 60 / 60 / 1000))
    let date_minutes = parseInt(Math.abs(differTime / 60 / 1000))
    let date_seconds = parseInt(Math.abs(differTime / 1000))
    let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    if (flag && date_day >= 0) {
      if (date_day == 0) return '今天' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
      if (date_day == 1) return '明天' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
      else if (date_day == 2) return '后天' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
      else if (date_day > 2) return weeks[date.getDay()] + (date.getMonth() + 1) + '月' + date.getDate() + '日'
    }
    if (!flag && date_day <= 0) {
      if (date_day == 0) {
        if (date_hours > 0) {
          return date_hours + '小时前'
        } else {
          if (date_minutes > 0) {
            return date_minutes + '分钟前'
          } else {
            return '刚刚'
          }
        }
      } else {
        return (date.getMonth() + 1 > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
      }
    }
  } else {
    return ''
  }
}

// 将m转换成km
export function kmUnit(m) {
  let v
  if (typeof m === 'number' && !isNaN(m)) {
    if (m >= 1000) {
      v = (m / 1000).toFixed(1) + 'km'
    } else {
      v = m + 'm'
    }
  } else {
    v = '0m'
  }

  return v
}
