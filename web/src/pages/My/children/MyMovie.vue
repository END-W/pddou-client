<template>
  <div id="my-movie">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="name ellipsis">我的电影</span>
    </div>
    <div class="movie">
      <div class="option">
        <span :class="{ active: !isWatched }" @click="isWatched = false">想看</span>
        <span :class="{ active: isWatched }" @click="isWatched = true">看过</span>
      </div>
      <div v-show="!isWatched" class="want">
        <movie-item :movie-list="wishMovie"></movie-item>
        <div class="tips" v-if="wishMovie.length === 0">
          <span class="icon icon-empty-content"></span>
          <span class="text">暂时木有内容呀</span>
        </div>
      </div>
      <div v-show="isWatched" class="watched">
        <div class="item" v-for="(item,index) in isWatchedMovie" :key="index" @click="$router.push({path: 'movie_detail', query: {movieId: item.id}})">
          <img :src="item.poster" alt="">
          <div class="info">
            <div class="name">{{ item.name }}</div>
            <div class="my-score">
              <span>我评：</span>
              <el-rate v-model="item.userScore" allow-half :disabled="true" />
            </div>
            <div class="my-comment ellipsis">{{ item.content }}</div>
          </div>
        </div>
        <div class="tips" v-if="isWatchedMovie.length === 0">
          <span class="icon icon-empty-content"></span>
          <span class="text">暂时木有内容呀</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Rate } from 'element-ui'
import { Indicator } from 'mint-ui'
import MovieItem from '@/components/MovieItem/MovieItem'
import { getToken } from '@/common/utils/auth'
import { getWishMovieByUserId, getIsWatchedMovieByUserId } from '@/api/wish_movie'

Vue.use(Rate)

export default {
  name: 'MyMovie',
  components: {
    MovieItem
  },
  data() {
    return {
      isWatched: false,
      wishMovie: [],
      isWatchedMovie: []
    }
  },
  created() {
    Indicator.open('Loading...')
    this.loadInfo()
  },
  methods: {
    loadInfo() {
      this.isWatched = this.$route.params.isWatched
      if (getToken()) {
        getWishMovieByUserId()
          .then(response => {
            if (response.data !== undefined) {
              this.wishMovie = response.data
            }
            Indicator.close()
          })
          .catch(err => {
            Indicator.close()
          })
        getIsWatchedMovieByUserId()
          .then(response => {
            if (response.data !== undefined) {
              this.isWatchedMovie = response.data
            }
            Indicator.close()
          })
          .catch(err => {
            Indicator.close()
          })
      }
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#my-movie {
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
    z-index: 99;

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

  .movie {
    margin-top: 1rem;

    .option {
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 0.12rem solid #f1f1f1;
      position: fixed;
      left: 0;
      width: 100%;
      background-color: #fff;
      height: 0.8rem;
      z-index: 99;

      span {
        padding: 0.25rem;
        box-sizing: border-box;
        font-size: 0.3rem;
        border-bottom: 0.04rem solid transparent;
      }

      .active {
        color: #dd2727;
        border-bottom: 0.04rem solid #dd2727;
      }
    }

    .want, .watched {
      padding: 0 0.3rem;
      padding-top: 1rem;

      .item {
        display: flex;
        align-items: center;
        padding: 0.2rem 0;

        img {
          display: inline-block;
          width: 20%;
        }

        .info {
          width: 70%;
          display: flex;
          flex-flow: column;
          padding: 0.25rem;
          font-size: 0.25rem;
          color: #9d9d9d;
          overflow: hidden;

          .name {
            font-weight: 700;
            font-size: 0.345rem;
            padding-bottom: 0.2rem;
            color: #333;
          }

          .my-score {
            display: flex;
            align-items: center;
            color: #ffb400;
            padding-bottom: 0.2rem;
            font-size: 0.28rem;

            span {
              margin-right: 0.12rem;
            }
          }

          .my-comment {
            padding-bottom: 0.3rem;
          }

          .actors {
            padding-bottom: 0.2rem;
          }

          .people {
            padding-bottom: 0.2rem;

            .number {
              color: #ffb400;
            }
          }

          .score {
            padding-bottom: 0.2rem;

            .number {
              color: #ffb400;
            }
          }
        }

        .buy {
          width: 10%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          background-color: #dd2727;
          border-radius: 20%;
          font-size: 0.25rem;
          color: #fff;
        }

        .presell {
          background-color: #2d98f3;
          width: 10%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          border-radius: 20%;
          font-size: 0.25rem;
          color: #fff;
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
  }
}
</style>
