<template>
  <div class="search-movie">
    <div class="header">
      <div class="search">
        <span class="icon-search"></span>
        <input type="text" placeholder="搜影片" v-model.trim="name" />
      </div>
      <span class="cancel-btn" @click="back()">取消</span>
    </div>
    <div class="content">
      <div class="movie-container" v-if="movieInfo.length">
        <!--<div class="title">影片</div>-->
        <movie-item :movie-list="movieInfo" :search-name="name"></movie-item>
      </div>
      <div class="tips" v-else-if="name">
        <span class="icon icon-empty-content"></span>
        <span class="text">暂时木有内容呀</span>
      </div>
    </div>
  </div>
</template>

<script>
import MovieItem from '@/components/MovieItem/MovieItem'
import { matchMovieByName } from '@/api/movie'

export default {
  name: 'SearchMovie',
  components: {
    MovieItem
  },
  data() {
    return {
      name: '',
      movieInfo: [],
      timer: ''
    }
  },
  watch: {
    name(newVal, oldVal) {
      this.movieInfo = []
      clearTimeout(this.timer)
      if (newVal) {
        this.timer = setTimeout(() => {
          matchMovieByName({movieName: newVal}).then(response => {
            this.movieInfo = response.data
          })
        }, 500)
      }
    }
  },
  methods: {
    back() {
      this.name = ''
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
.search-movie {
  width: 100%;
  background-color: #f5f5f5;

  .header {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    box-shadow: 0 0 0.002rem #888;

    .search {
      flex: 4;
      display: flex;
      align-items: center;
      border-radius: 0.5rem;
      margin-left: 0.25rem;
      padding: 0.125rem 0.25rem;
      background-color: #f5f5f5;

      .icon-search {
        font-size: 0.375rem;
      }

      input {
        width: 100%;
        border: none;
        outline: none;
        background-color: #f5f5f5;
        caret-color: #dd2727;
        margin-left: 0.25rem;
        font-size: 0.3rem !important;
      }
    }

    .cancel-btn {
      flex: 1;
      font-size: 0.3rem;
      color: #dd2727;
      text-align: center;
    }
  }

  .content {
    width: 100%;
    background-color: #fff;

    .movie-container {
      width: 100%;
      font-size: 0.3125rem;
      padding: 0.3rem;
      box-sizing: border-box;
      border-top: 0.04rem solid #f1f1f1;

      .title {
        font-size: 0.28rem;
        padding-bottom: 0.25rem;
        border-bottom: 0.03rem solid #f1f1f1;
      }

      .item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.25rem 0;
        border-bottom: 0.03rem solid #f1f1f1;

        img {
          display: inline-block;
          width: 20%;
          border-radius: 0.1rem;
        }

        .info {
          width: 68%;
          display: flex;
          flex-flow: column;
          padding: 0.25rem;
          font-size: 0.25rem;
          color: #9d9d9d;

          .name {
            font-weight: bolder;
            padding-bottom: 0.2rem;
            color: #333;
          }

          .type {
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
          width: 12%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          background-color: #dd2727;
          border-radius: 24%;
          font-size: 0.25rem;
          color: #fff;
        }

        .presell {
          background-color: #2d98f3;
          width: 12%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          border-radius: 20%;
          font-size: 0.25rem;
          color: #fff;
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
}
</style>
