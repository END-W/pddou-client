<template>
  <div id="cinema-detail">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="name ellipsis">{{ currentCinemaInfo.cinemaName }}</span>
    </div>
    <div class="cinema-info">
      <span class="name">{{ currentCinemaInfo.cinemaName }}</span>
      <span class="address"><span class="icon icon-address"></span>{{ currentCinemaInfo.specifiedAddress }}</span>
      <span class="tel"><span class="icon icon-tel"></span>{{ currentCinemaInfo.cinemaPhone }}</span>
    </div>
    <el-carousel :autoplay=false type="card" height="5rem" arrow="never" :loop=false :initial-index=initMovieId indicator-position="none" @change="changeCarousel" v-if="carouselReset">
      <el-carousel-item v-for="(item, index) in hasMovieInfo" :key="index">
        <a href="#" @click.prevent="$router.push({path: '/movie_detail', query:{movieId: item.id}})"><img :src="item.poster" alt=""></a>
      </el-carousel-item>
    </el-carousel>
    <div class="movie-info" v-for="(item,index) in hasMovieInfo" :key="index" v-show="movieIndex === Number(index)">
      <span class="arrow"></span>
      <span class="main"><span class="name">{{ item.name }}</span><span class="score"><span class="num" v-if="item.score">{{ item.score.toFixed(1) }}分</span><span v-else style="font-size: .28rem">暂无评分</span></span></span>
      <span class="intro">
        <span class="time">{{ item.movieLong }}</span><span class="split">|</span><span class="type">{{ item.type }}</span><span class="split">|</span><span class="actors">{{ item.actor }}</span>
      </span>
    </div>
    <ly-tab v-model="selectedId" :items="items" :options="options" class="ly-tab" v-if="hackReset" @change="changeLyTabItem" />
    <div class="ticket-container">
      <div class="item" v-for="(item, index) in movieDaySchedule" :key="index">
        <div class="left">
          <span class="start-date">{{ item.showTime }}</span>
          <span class="end-date">{{ endDate(item) }}散场</span>
        </div>
        <div class="center">
          <div class="info">
            <span class="language">{{ item.language }} 2D</span>
            <span class="hall">{{ item.hallName }}</span>
          </div>
          <div class="price">{{ item.price.toFixed(2) }}元</div>
        </div>
        <div class="right">
          <span class="buy-btn" @click="$router.push({path: '/select_seat', query: {cinemaId: item.cinemaId, movieId: item.movieId, scheduleId: item.scheduleId}})">购票</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Indicator } from 'mint-ui'
import { Carousel, CarouselItem } from 'element-ui'
import LyTab from 'ly-tab'
import { formatDate } from '@/common/utils/util'
import { getCurrentCinemaDetail, getCurrentCinemaMovieSchedule } from '@/api/cinema'

Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(LyTab)

export default {
  name: 'CinemaDetail',
  data() {
    return {
      initMovieId: 0,
      // 当前影院信息
      currentCinemaInfo: {},
      // 影院的电影信息
      hasMovieInfo: [],
      // 所有的电影安排
      allMovieSchedule: [],
      // 电影某天的安排
      movieDaySchedule: [],
      hackReset: false,
      carouselReset: true,
      movieIndex: 0,
      selectedId: 0,
      items: [],
      options: {
        activeColor: '#dd2727'
      }
    }
  },
  created() {
    Indicator.open('Loading...')
    this.loadCinemaDetail()
  },
  methods: {
    loadCinemaDetail() {
      if (this.$route.query.cinemaId) {
        getCurrentCinemaDetail({ cinemaId: this.$route.query.cinemaId })
          .then(response => {
            this.currentCinemaInfo = response.data

            getCurrentCinemaMovieSchedule({ cinemaId: this.$route.query.cinemaId })
              .then(response => {
                response.data.hasMovieInfo.sort((a, b) => {
                  return a.id - b.id
                })
                this.hasMovieInfo = response.data.hasMovieInfo
                if (this.$route.query.movieId) {
                  this.hasMovieInfo.forEach((val, index) => {
                    if (this.$route.query.movieId == val.id) {
                      this.initMovieId = index
                      this.movieIndex = index
                      this.carouselReset = false
                      this.$nextTick(() => {
                        this.carouselReset = true
                      })
                    }
                  })
                }
                let movieScheduleInfo = response.data.movieScheduleInfo
                movieScheduleInfo.forEach((value, index) => {
                  let movieDate = []
                  let movieInfo = []
                  value.forEach(val => {
                    let flag = true
                    movieDate.forEach(value => {
                      if (value.date === val.showDate) {
                        flag = false
                      }
                    })
                    if (flag) {
                      movieDate.push({ label: formatDate(new Date(val.showDate), true), date: val.showDate })
                    }
                    movieInfo.push({
                      cinemaId: val.cinemaId,
                      movieId: val.movieId,
                      scheduleId: val.scheduleId,
                      showDate: val.showDate,
                      showTime: val.showTime,
                      language: val.language,
                      movieLong: val.movieLong,
                      hallName: val.hallName,
                      price: val.price
                    })
                  })
                  movieDate.sort((a, b) => {
                    return a.date - b.date
                  })
                  this.allMovieSchedule[index] = { movieDate, movieInfo }
                })
                this.allMovieSchedule.sort((a, b) => {
                  return a.movieInfo[0].movieId - b.movieInfo[0].movieId
                })

                if (this.initMovieId !== 0) {
                  this.items = this.allMovieSchedule[this.initMovieId].movieDate
                  this.hackReset = false
                  this.$nextTick(() => {
                    this.hackReset = true
                  })
                  this.allMovieSchedule[this.initMovieId].movieInfo.forEach(value => {
                    if (value.showDate === this.allMovieSchedule[this.initMovieId].movieDate[0].date) {
                      this.movieDaySchedule.push(value)
                    }
                  })
                } else {
                  this.items = this.allMovieSchedule[0].movieDate
                  this.hackReset = false
                  this.$nextTick(() => {
                    this.hackReset = true
                  })
                  this.allMovieSchedule[0].movieInfo.forEach(value => {
                    if (value.showDate === this.allMovieSchedule[0].movieDate[0].date) {
                      this.movieDaySchedule.push(value)
                    }
                  })
                }

                this.movieDaySchedule.sort((a, b) => {
                  return new Date(a.showDate + ',' + a.showTime) - new Date(b.showDate + ',' + b.showTime)
                })
                Indicator.close()
              })
              .catch(err => {
                Indicator.close()
              })
          })
          .catch(err => {
            Indicator.close()
          })
      }
    },
    // 切换轮播图
    changeCarousel(index) {
      this.movieIndex = index
      this.items = this.allMovieSchedule[index].movieDate
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
      this.selectedId = 0
      this.movieDaySchedule = []
      this.allMovieSchedule[index].movieInfo.forEach(value => {
        if (value.showDate === this.allMovieSchedule[index].movieDate[0].date) {
          this.movieDaySchedule.push(value)
        }
      })
      this.movieDaySchedule.sort((a, b) => {
        return new Date(a.showDate + ',' + a.showTime) - new Date(b.showDate + ',' + b.showTime)
      })
    },
    // 切换日期
    changeLyTabItem(item) {
      this.movieDaySchedule = []
      this.allMovieSchedule[this.movieIndex].movieInfo.forEach(value => {
        if (value.showDate === item.date) {
          this.movieDaySchedule.push(value)
        }
      })
      this.movieDaySchedule.sort((a, b) => {
        return new Date(a.showDate + ',' + a.showTime) - new Date(b.showDate + ',' + b.showTime)
      })
    },
    // 影片结束时间
    endDate(item) {
      let h = parseInt(Number(item.showTime.split(':')[0]) + parseInt(item.movieLong) / 60)
      let m = Number(item.showTime.split(':')[1]) + (parseInt(item.movieLong) % 60)
      if (m > 59) {
        return (h + parseInt(m / 60) < 10 ? '0' + (h + parseInt(m / 60)) : h + parseInt(m / 60)) + ':' + (m % 60 < 10 ? '0' + (m % 60) : m % 60)
      } else {
        return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m)
      }
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#cinema-detail {
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
    z-index: 999;

    .icon-back {
      font-size: 0.4rem;
      position: absolute;
      left: 0.3rem;
    }

    .name {
      width: 60%;
      font-size: 0.375rem;
      text-align: center;
      line-height: 0.375rem;
    }
  }

  .cinema-info {
    margin-top: 1rem;
    color: #888;
    display: flex;
    flex-flow: column;
    padding: 0.25rem;

    .name {
      color: #000;
      font-size: 0.345rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .address, .tel {
      margin-bottom: 0.12rem;
      font-size: 0.28rem;
      line-height: 0.375rem;
      display: flex;
      letter-spacing: 0.02rem;
      align-items: flex-start;

      .icon {
        font-size: 0.375rem;
        margin-right: 0.08rem;
      }
    }
  }

  .movie-info {
    height: 1.4rem;
    display: flex;
    flex-flow: column;
    align-items: center;

    .arrow {
      border: 0.2rem solid transparent;
      border-bottom: 0.2rem solid #fff;
      margin-top: -0.38rem;
      z-index: 999;
    }

    .main {
      font-size: 0.345rem;

      .name {
        line-height: 0.8rem;
        font-weight: 700;
      }

      .score {
        color: #ffb400;
        margin-left: 0.25rem;
        font-size: 0.1rem;

        .num {
          font-size: 0.3125rem;
          font-weight: 700;
          font-family: PingFangSC-Regular, Hiragino Sans GB, sans-serif;
        }
      }
    }

    .intro {
      font-size: 0.25rem;
      color: #888;

      .split {
        margin: 0 0.08rem;
      }
    }
  }

  .el-carousel {
    background: linear-gradient(to bottom, #242342 0%, #11182B 100%);

    .el-carousel__item {
      margin-top: 0.25rem;
      height: 90%;

      a {
        font-size: 0.3125rem;
        padding-top: 0.04rem;

        img {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: 0.06rem solid #fff;
        }
      }
    }
  }

  .ly-tab {
    color: #000;
    border: none;
  }

  .ticket-container {
    padding: 0.25rem;

    .item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 0.02rem solid #f1f1f1;
      padding: 0.25rem 0;

      .left {
        flex: 1;
        display: flex;
        flex-flow: column;
        justify-content: center;

        .start-date {
          font-weight: bolder;
          font-size: 0.375rem;
          margin-bottom: 0.12rem;
        }

        .end-date {
          color: #888;
          font-size: 0.1rem;
        }
      }

      .center {
        flex: 3;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0.25rem;

        .info {
          display: flex;
          flex-flow: column;
          justify-content: center;
          margin-left: 0.25rem;

          .language {
            font-size: 0.1rem;
            margin-bottom: 0.12rem;
          }

          .hall {
            color: #888;
            font-size: 0.1rem;
          }
        }

        .price {
          color: #dd2727;
          margin-right: 0.25rem;
        }
      }

      .right {
        flex: 1;
        text-align: center;
        border: 0.0125rem solid #dd2727;
        padding: 0.12rem 0;
        border-radius: 0.25rem;
        color: #dd2727;
        font-size: 0.25rem;
      }
    }
  }
}
</style>
