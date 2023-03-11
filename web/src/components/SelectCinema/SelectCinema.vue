<template>
  <div id="select-cinema">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="name ellipsis">{{ movieInfo.name }}</span>
    </div>
    <ly-tab v-model="selectedId" :items="items" :options="options" class="ly-tab" v-if="hackReset" @change="changeLyTabItem" />
    <div class="content">
      <div class="item" v-for="(item, index) in dateCinemaSchedule" :key="index" @click="$router.push({path: '/cinema_detail', query: {movie_id: $route.query.movieId, cinema_id: item.id}})">
        <div class="left">
          <div class="name ellipsis">{{ item.cinemaName }}</div>
          <div class="address ellipsis">{{ item.specifiedAddress }}</div>
          <div class="label-block"><span>小吃</span><span>4D厅</span><span>杜比全景声厅</span><span>巨幕厅</span></div>
        </div>
        <!--<div class="right">-->
        <!--<div class="price-block"><span class="price">23</span>元起</div>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import Vue from 'vue'
import LyTab from 'ly-tab'
import { getMovieDetail, getCurrentMovieSchedule } from '../../api/index'
import { formatDate } from '@/common/utils/util'

Vue.use(LyTab)

export default {
  name: 'SelectCinema',
  data() {
    return {
      movieInfo: '',
      selectedId: 0,
      hasCinemaInfo: [],
      cinemaScheduleInfo: [],
      dateCinemaSchedule: [],
      hackReset: true,
      items: [],
      options: {
        activeColor: '#dd2727'
      }
    }
  },
  created() {
    Indicator.open('Loading...')
    this.loadInfo()
  },
  methods: {
    async loadInfo() {
      let json = await getMovieDetail(this.$route.query.movie_id)
      if (json.success_code === 200) {
        this.movieInfo = json.data[0]
      }
      json = await getCurrentMovieSchedule(this.$route.query.movie_id)
      if (json.success_code === 200) {
        this.hasCinemaInfo = json.data.hasCinemaInfo
        this.cinemaScheduleInfo = json.data.cinemaScheduleInfo
        this.cinemaScheduleInfo.forEach(value => {
          this.removeRepeat(value, 'cinema_id')
        })
        this.hasCinemaInfo.forEach(value => {
          this.items.push({ label: formatDate(new Date(value[0].show_date), true), date: value[0].show_date })
        })
        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })
        this.dateCinemaSchedule = this.cinemaScheduleInfo[0]
      }
      Indicator.close()
    },
    //切换日期
    changeLyTabItem(item) {
      this.hasCinemaInfo.forEach((value, index) => {
        if (value[0].show_date === item.date) {
          this.dateCinemaSchedule = this.cinemaScheduleInfo[index]
        }
      })
    },
    //去除重复的影院
    removeRepeat(arr, key) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i][key] === arr[j][key]) {
            arr.splice(j, 1)
            j = j - 1
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#select-cinema {
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
      font-size: 0.375rem;
      line-height: 0.375rem;
      text-align: center;
    }
  }

  .ly-tab {
    position: fixed;
    top: 1rem;
    left: 0;
  }

  .select {
    position: fixed;
    left: 0;
    top: 1.68rem;
    width: 100%;
    height: 0.8rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 0.03rem solid #f1f1f1;
    border-top: 0.03rem solid #f1f1f1;
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

  .content {
    margin-top: 2rem;
    font-size: 0.3125rem;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 0.25rem;
      width: 100%;
      margin-bottom: 0.25rem;

      .left {
        width: 100%;

        .name {
          font-size: 0.345rem;
          line-height: 0.36rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .address {
          font-size: 0.28rem;
          height: 0.3rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .label-block {
          display: flex;

          span {
            padding: 0.06rem;
            font-size: 0.1rem;
            border: 0.01rem solid #f90;
            margin-right: 0.1rem;
            border-radius: 0.04rem;
            color: #f90;
          }
        }
      }

      .right {
        width: 20%;
        text-align: center;

        .price-block {
          color: #dd2727;

          .price {
            font-size: 0.38rem;
          }
        }
      }
    }
  }
}
</style>
