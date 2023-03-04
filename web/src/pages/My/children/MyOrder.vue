<template>
  <div id="my-order">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="name ellipsis">我的订单</span>
    </div>
    <div class="order-container" v-if="myOrderInfo.length">
      <div class="item" v-for="(item, index) in myOrderInfo" :key="index">
        <div class="item-top">
          <span class="cinema-name">{{ item.cinemaName }}</span>
          <span v-if="'PAID' === item.payType" class="status">已完成</span>
          <span v-else-if="'FAILED' === item.payType" class="status">支付失败</span>
          <span v-else class="status">已退票</span>
        </div>
        <div class="item-center">
          <div class="left">
            <img :src="item.poster" alt="" width="100%" height="100%">
          </div>
          <div class="right">
            <div class="movie">{{ item.movieName }}</div>
            <div class="date"><span class="day">{{ item.showDate + ' '}}</span><span class="time">{{ item.showTime }}</span></div>
            <div class="cinema"><span class="hall">{{ item.hallName }}</span><span class="seat" v-for="(itemSeat, valueSeat) in JSON.parse(item.orderSeatInfo)" :key="valueSeat">{{ formatSeat(itemSeat) }}</span></div>
          </div>
        </div>
        <div class="item-bottom">
          <div class="price"><span class="num">{{ '共' + item.ticketNum }}张</span> 实付款￥<span class="totalPrice">{{ item.ticketTotalPrice | parsePrice }}</span></div>
        </div>
        <div class="item-bottom2">
          <div class="del"><span @click="delOrderByUserId(item.id)">删除订单</span></div>
        </div>
      </div>
    </div>
    <div class="tips" v-else>
      <span class="icon icon-empty-content"></span>
      <span class="text">暂时木有内容呀</span>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import { getToken } from '@/common/utils/auth'
import { getOrderByUserId, delOrderByUserId } from '@/api/order'

export default {
  name: 'MyOrder',
  data() {
    return {
      myOrderInfo: []
    }
  },
  filters: {
    parsePrice(price) {
      return parseFloat(price).toFixed(2)
    }
  },
  created() {
    Indicator.open('Loading...')
    this.loadInfo()
  },
  methods: {
    // 加载信息
    loadInfo() {
      if (getToken()) {
        getOrderByUserId()
          .then(response => {
            if (response.data !== undefined) {
              this.myOrderInfo = response.data
            }
            Indicator.close()
          })
          .catch(err => {
            Indicator.close()
          })
      }
    },
    // 格式座位
    formatSeat(num) {
      if (num % 10 === 0) {
        return num / 10 + '排' + 10 + '座'
      } else {
        return parseInt(num / 10) + 1 + '排' + (num % 10) + '座'
      }
    },
    delOrderByUserId(id) {
      delOrderByUserId({orderId: id}).then(response => {
        this.loadInfo()
        Toast({
          message: "删除订单成功",
          position: "middle",
          duration: 2000
        })
      }).catch(err => {
        Toast({
          message: "删除订单失败",
          position: "middle",
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#my-order {
  width: 100%;
  height: 100%;
  color: #000;
  font-size: 0.3125rem;

  .top {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #dd2727;
    color: #fff;

    .icon-back {
      font-size: 0.4rem;
      position: absolute;
      left: 0.3rem;
    }

    .name {
      width: 60%;
      text-align: center;
      font-size: 0.345rem;
    }
  }

  .order-container {
    display: flex;
    flex-flow: column;
    margin-top: 1rem;
    width: 100%;
    background: #f1f1f1;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;
      padding: 0.3rem;
      background: #fff;
      border-bottom: 0.03rem solid #f1f1f1;

      .item-top, .item-center {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.28rem;
        color: #333;
      }

      .item-center .right .date, .item-center .right .cinema {
        font-size: 0.24rem;
        color: #707070;
      }

      .item-top {
        padding-bottom: 0.12rem;

        .cinema-name {
          height: 0.4rem;
          line-height: 0.4rem;
        }

        .status {
          color: #d81e06;
          font-weight: 530;
        }
      }

      .item-center {
        width: 100%;
        justify-content: flex-start;
        padding: 0.12rem 0;

        .left {
          width: 16%;
        }

        .right {
          align-self: flex-start;

          .movie {
            font-weight: bolder;
            font-size: 0.25rem;
            margin: 0.2rem;
            margin-bottom: 0.3rem;
          }

          .date, .cinema, .price {
            margin: 0.2rem;

            span {
              margin-right: 0.12rem;
            }
          }
        }
      }

      .item-bottom {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 0.26rem;
        color: #333;
        font-weight: 600;
        margin-top: 0.12rem;

        .num {
          font-size: 0.24rem;
          font-weight: normal;
          color: #707070;
          margin-left: 0.12rem;
        }

        .totalPrice {
          font-size: 0.33rem;
        }
      }

      .item-bottom2 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.22rem;
        color: #333;
        margin-top: 0.12rem;
      }
    }
  }

  .tips {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    font-size: 0.28rem;
    padding-top: 4rem;
    border-top: 0.04rem solid #f1f1f1;

    .icon {
      font-size: 1.6rem;
      margin-bottom: 0.25rem;
    }

    .text {
      color: #ccc;
    }
  }
}
</style>
