// 获取位置
export function getLocation(AMap, map, isEdit) {
  let geolocation = new AMap.Geolocation({
    enableHighAccuracy: true, // 是否获取高精度定位，可能影响效率，默认false
    timeout: 5000, // 定位超时时间，ms
    position: 'RB', // 定位按钮的停靠位置
    offset: [10, 20], // 定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
    zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
    needAddress: true, // 是否需要将定位结果进行逆地理编码操作
    extensions: 'all', // 是否需要详细的你地理编码信息，默认'base'
  })

  map.addControl(geolocation)

  if (!isEdit) {
    // 获取精确位置
    geolocation.getCurrentPosition(function (status, result) {
      if (status == 'complete') {
        console.log(result)
        // 经度
        let lng = result.position.lng
        // 纬度
        let lat = result.position.lat
        map.setCenter([lng, lat])
      } else {
        console.log(result)
      }
    })
  }
}

// 地址搜索
export function placeSearch(AMap, map) {
  let placeSearch = new AMap.PlaceSearch({
    citylimit: false, // 是否强制在设置的城市内搜索，默认false
    // type: '', // 兴趣点类别，用‘|’分隔，默认：'餐饮服务|商务住宅|生活服务'
    pageSize: 3, // 每页条数，默认10，范围1-50
    pageIndex: 1, // 页码
    extensions: 'all', // 默认base，返回基本地址信息；all：返回详细信息
    map: map, // 地图实例，可选
    panel: 'list', // 结果列表的id容器，可选
    autoFitView: true, // 是否自动调整地图视野到marker点都处于可见范围
  })

  return placeSearch
}
