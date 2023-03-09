import { setCookie } from '@/common/utils/auth'

// 获取位置
export function getLocation(AMap) {
  let geolocation = new AMap.Geolocation({
    enableHighAccuracy: true, // 是否获取高精度定位，可能影响效率，默认false
    timeout: 5000, // 定位超时时间，ms
    needAddress: true, // 是否需要将定位结果进行逆地理编码操作
    extensions: 'all', // 是否需要详细的你地理编码信息，默认'base'
  })

  // 获取精确位置
  geolocation.getCurrentPosition(function (status, result) {
    if (status == 'complete') {
      // 经度
      let lng = result.position.lng
      // 纬度
      let lat = result.position.lat
      // 城市
      let city = result.addressComponent.city
      let location = {
        lng: lng,
        lat: lat,
        city: city
      }

      setCookie('location', location, 60 * 60 * 5)
      console.log(result)
    } else {
      console.log(result)
    }
  })
}
