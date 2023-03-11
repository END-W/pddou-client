<template>
  <div id="cinema">
    <div class="header">
      <div class="nav">
        <span class="location">{{ city | parseLocation }}</span>
        <span class="title">影院</span>
        <span class=" icon-search" @click="$router.push('search_cinema')"></span>
      </div>
    </div>
    <div class="content">
      <div class="item" v-for="(item, index) in jsonData" :key="index" @click="$router.push({path:'/cinema_detail', query: {cinema_id: item.id}})">
        <div class="left">
          <div class="name ellipsis">{{ item.cinemaName }}</div>
          <div class="address ellipsis">{{ item.specifiedAddress }}</div>
          <div class="label-block"><span>小吃</span><span>4D厅</span><span>巨幕厅</span><span>杜比全景声厅</span></div>
        </div>
        <div class="right">
          <div class="price-block"><span class="price">{{ item.distance | parseToKm }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import { getCinemaList } from '@/api/cinema'
import { getCookie } from '@/common/utils/auth'
import { getWalking } from '@/common/utils/map'
import { kmUnit } from '@/common/utils/util'

export default {
  name: 'Cinema',
  data() {
    return {
      jsonData: [],
      city: '北京'
    }
  },
  filters: {
    // 解析地址
    parseLocation(city) {
      let location = getCookie('location')
      if (location) {
        return location.city.replace('市', '')
      }
      return city
    },
    parseToKm(m) {
      return kmUnit(m)
    }
  },
  created() {
    Indicator.open('Loading...')
    this.loadCinemaList()
  },
  methods: {
    // 加载电影列表
    loadCinemaList() {
      getCinemaList({city: getCookie('location').city})
        .then(response => {
          this.jsonData = response.data
          this.jsonData.forEach(v => {
            // 根据起终点坐标规划步行路线
            getWalking().search([getCookie('location').lng, getCookie('location').lat], [v.lng, v.lat], (status, result) => {
              if (status === 'complete') {
                v.distance = result.routes[0].distance
              } else {
                v.distance = 0
              }
            })
          })
          setTimeout(() => {
            this.jsonData.sort((a, b) => {
              return a.distance - b.distance
            })
          }, 300)
          Indicator.close()
        })
        .catch(err => {
          Indicator.close()
        })
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#cinema {
  width: 100%;
  height: 100%;

  .header {
    font-size: 0.3125rem;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1rem;
      background-color: #dd2727;
      color: white;
      position: relative;

      .location {
        width: 20%;
        text-indent: 0.49rem;
      }

      .title {
        width: 60%;
        text-align: center;
        font-size: 0.375rem;
        line-height: 0.38rem;
      }

      .icon-search {
        width: 20%;
        font-size: 0.48rem;
        text-align: center;
      }
    }

    .select {
      width: 100%;
      height: 0.8rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 0.03rem solid #f1f1f1;
      box-sizing: border-box;
      background-color: #fff;

      .option {
        width: 33.33%;
        box-sizing: border-box;
        padding: 0.1rem 0.6rem;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        font-size: 0.28rem;
        border-right: 0.02rem solid #f1f1f1;

        &:last-child {
          border-right: none;
        }

        .arrow {
          margin-left: 0.1rem;
          padding-bottom: 0.05rem;

          &::after {
            content: '';
            width: 0;
            height: 0;
            overflow: hidden;
            font-size: 0;
            line-height: 0;
            border-width: 0.1rem;
            border-style: solid;
            border-color: #888 transparent transparent transparent;
          }
        }
      }
    }
  }

  .content {
    font-size: 0.3125rem;
    margin-top: 1rem;
    padding-bottom: 0.8rem;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 0.25rem 0.3rem;
      width: 100%;
      margin-bottom: 0.25rem;

      .left {
        width: 80%;

        .name {
          font-size: 0.345rem;
          line-height: 0.36rem;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .address {
          font-size: 0.28rem;
          line-height: 0.3rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .label-block {
          display: flex;

          span {
            padding: 0.06rem;
            font-size: 0.2rem;
            border: 0.01rem solid #f90;
            margin-right: 0.1rem;
            border-radius: 0.04rem;
            color: #f90;
          }
        }
      }

      .right {
        width: 20%;
        text-align: right;

        .price-block {
          color: #dd2727;

          .price {
            font-size: 0.23rem;
          }
        }
      }
    }
  }
}
</style>
