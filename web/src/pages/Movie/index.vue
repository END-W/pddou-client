<template>
  <div id="movie">
    <div class="tab-header">
      <span class="location">{{ city | parseLocation }}</span>
      <span :class="['normal', {'active': isHotMovie}]" @click="optionMovieType(true)">正在热映</span>
      <span :class="['normal', {'active': !isHotMovie}]" @click="optionMovieType(false)">即将上映</span>
      <span class=" icon-search" @click="$router.push('search_movie')"></span>
    </div>
    <div class="tab-content" ref='container'>
      <div class="panel" v-show="isHotMovie">
        <movie-item :movie-list="hotMovieList"></movie-item>
      </div>
      <div class="panel" v-show="!isHotMovie">
        <movie-item :movie-list="notShowMovieList"></movie-item>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import MovieItem from '@/components/MovieItem/MovieItem'
import { getMovieList } from '@/api/movie'
import { getCookie } from '@/common/utils/auth'

export default {
  name: 'Movie',
  components: {
    MovieItem
  },
  data() {
    return {
      // 切换电影选项
      isHotMovie: true,
      // 热门电影列表
      hotMovieList: [],
      // 未上映电影列表
      notShowMovieList: [],
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
    }
  },
  created() {
    Indicator.open('Loading...')
    if (this.$route.query.hotMovie == 0) {
      this.isHotMovie = false
    }
    this.loadMovieList()
  },
  methods: {
    // 加载电影列表
    loadMovieList() {
      getMovieList().then(response => {
        response.data.forEach((value, index) => {
          if (new Date() - new Date(value.publicDate) >= 0) {
            this.hotMovieList.push(value)
          } else {
            this.notShowMovieList.push(value)
          }
        })
        Indicator.close()
      }).catch(err => {
        Indicator.close()
      })
    },
    // 改变电影类型
    optionMovieType(flag) {
      this.isHotMovie = flag
      window.scroll(0, 0)
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#movie {
  width: 100%;
  height: 100%;

  .tab-header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 1rem;
    width: 100%;
    font-size: 0.3125rem;
    background-color: #dd2727;
    color: white;
    position: fixed;
    left: 0;
    top: 0;

    .normal {
      opacity: 0.6;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80%;

      &.active {
        color: #fff;
        border-bottom: 0.06rem solid #fff;
        opacity: 1;
      }
    }

    .icon-search {
      font-size: 0.48rem;
    }
  }

  .tab-content {
    margin-top: 1rem;
    font-size: 0.3125rem;
    padding: 0 0.3rem;
    padding-bottom: 1rem;

    .panel {
      width: 100%;

      .item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.2rem 0;
        border-bottom: 0.03rem solid #f1f1f1;

        img {
          display: inline-block;
          width: 20%;
        }

        .info {
          width: 68%;
          display: flex;
          flex-flow: column;
          padding: 0.25rem;
          font-size: 0.28rem;
          color: #9d9d9d;

          .name {
            font-weight: 700;
            font-size: 0.345rem;
            padding-bottom: 0.2rem;
            color: #333;
          }

          .type {
            padding-bottom: 0.12rem;
          }

          .people {
            padding-bottom: 0.12rem;

            .number {
              color: #ffb400;
              font-family: PingFangSC-Regular, Hiragino Sans GB, sans-serif;
              font-weight: 700;
              font-size: 0.315rem;
            }
          }

          .score {
            padding-bottom: 0.12rem;

            .number {
              color: #ffb400;
              font-family: PingFangSC-Regular, Hiragino Sans GB, sans-serif;
              font-weight: 700;
              font-size: 0.315rem;
            }
          }
        }

        .buy {
          width: 12%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          background-color: #dd2727;
          border-radius: 0.08rem;
          font-size: 0.25rem;
          color: #fff;
        }

        .presell {
          background-color: #2d98f3;
          width: 12%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          border-radius: 0.08rem;
          font-size: 0.25rem;
          color: #fff;
        }
      }
    }
  }
}
</style>
