<template>
  <div v-if="movieList.length">
    <div class="movie-item" v-for="(item,index) in movieList" :key="index">
      <img :src="item.poster" alt="" @click="$router.push({path:'/movie_detail', query: {movieId: item.id}})">
      <div class="info">
        <div class="name" @click="$router.push({path:'/movie_detail', query: {movieId: item.id}})" v-html="ruleName(item.name)"></div>
        <div>
          <div class="descInfo" v-if="item.score">评分：<span class="number">{{ item.score.toFixed(1) }}</span></div>
          <div class="descInfo" v-else>暂无评分</div>
        </div>
        <div>
          <div class="descInfo" v-if="item.wishNum">想看：<span class="number">{{ item.wishNum }}</span>人想看</div>
          <div class="descInfo" v-else>暂无想看</div>
        </div>
        <div class="descInfo">类型：{{ item.type }}</div>
        <div class="descInfo ellipsis">主演：<span>{{ item.actor }}</span></div>
      </div>
      <span 
        class="buy" 
        v-if="item.isShow && ((new Date(item.publicDate).getTime() - 3 * 24 * 60 * 60 * 1000) < new Date().getTime())" 
        :class="{pre_sell: new Date(item.publicDate) - new Date() > 0}" 
        @click="$router.push({path: '/select_cinema', query: {movieId: item.id, name: item.name}})
      ">
        {{ new Date(item.publicDate) - new Date() > 0 ? '预售': '购票' }}
      </span>
      <span 
        class="buy wish" 
        v-else-if="item.isShow"
        @click="$router.push({path: '/movie_detail', query: {movieId: item.id}})
      ">
        想看
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieItem',
  data() {
    return {}
  },
  props: {
    movieList: {
      type: Array,
      require: true,
      default: []
    },
    searchName: {
      type: String,
      default: ''
    }
  },
  computed: {
    ruleName() {
      return nameString => {
        if (this.searchName) {
          let replaceReg = new RegExp(this.searchName, 'g')
          let replaceString = `<span style="color:#dd2727">${this.searchName}</span>`
          return nameString.replace(replaceReg, replaceString)
        }
        return nameString
      }
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
.movie-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.2rem 0;

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

    .descInfo {
      width: 3.7rem;
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
    background-color: #dd2727;
    border-radius: 0.08rem;
    font-size: 0.25rem;
    color: #fff;
    width: 12%;
    padding: 0.16rem 0.12rem;
    text-align: center;
  }

  .wish {
    background-color: orange;
  }

  .pre_sell {
    background-color: #2d98f3;
  }
}
</style>
