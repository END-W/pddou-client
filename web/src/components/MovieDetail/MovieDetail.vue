<template>
  <div id="movie-detail">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="name">{{ jsonData.name }}</span>
    </div>
    <div class="info">
      <img :src="jsonData.poster" alt="">
      <div class="describe">
        <div class="name">{{ jsonData.name }}</div>
        <div class="small type">类型：{{ jsonData.type }}</div>
        <div class="small ellipsis">主演：{{ jsonData.actor }}</div>
        <div class="small play-time">片长：{{ jsonData.movieLong }}</div>
        <div class="small show-time">上映：{{ jsonData.publicDate }}上映</div>
      </div>
    </div>
    <div class="action">
      <div class="btn" :class="{'active': !notWishMovie}" @click="wishBtnHandle"><span class="icon-like-fill"></span><span class="font">想看</span></div>
      <div class="btn" :class="{'active': isWatched}" @click="watchedBtnHandle"><span class="icon-star-fill"></span><span class="font">看过</span></div>
    </div>
    <div class="public-praise">
      <div class="header">
        <div class="title">口碑</div>
        <div class="wish" v-if="isShowMovie">
          <span v-if="jsonData.wishNum">{{ jsonData.wishNum }}人想看</span>
          <span v-else>暂无想看</span>
        </div>
      </div>
      <div class="mark">
        <div class="left">
          <el-rate v-if="isShowMovie" v-model="starValue" allow-half :disabled="true" />
          <span class="noShow" v-else>尚未上映</span>
        </div>
        <div class="right" v-if="isShowMovie">
          <div class="score">{{ this.averageScore ? this.averageScore : 0 }}<span class="small">分</span></div>
          <div class="score-people">{{ commentNum ? commentNum : '暂无' }}人评</div>
        </div>
        <div class="wish" v-else>
          <span class="wish-number"><span v-if="jsonData.wishNum" style="font-family: PingFangSC-Regular, Hiragino Sans GB, sans-serif;font-size: .6rem">{{ jsonData.wishNum }}</span><span v-else>暂无</span></span>人想看
        </div>
      </div>
    </div>
    <div class="intro">
      <div class="title">简介</div>
      <div class="content">
        {{ jsonData.intro }}
      </div>
    </div>
    <div class="comment">
      <div class="header">
        <span class="title">评论</span><span class="join" @click="watchedBtnHandle">参与评论</span>
      </div>
      <div class="content">
        <div class="comment-container" v-if="currentUserCommentData.length">
          <span class="title">我的讨论</span>
          <div class="comment-item">
            <div class="left"><img :src="currentUserCommentData[0].avatar" alt=""></div>
            <div class="right">
              <div class="user-name">{{ currentUserCommentData[0].username }}</div>
              <div class="scored">给这部作品打了{{ currentUserCommentData[0].userScore }}分</div>
              <div class="comment-content">{{ currentUserCommentData[0].content }}</div>
              <div class="bottom">
                <span class="comment-date">{{ formatCommentDate(currentUserCommentData[0].commentDate) }}</span>
                <span class="support" :class="{'active': userIsSupportComment(currentUserCommentData[0].supportUser)}" @click="supportBtnHandle(currentUserCommentData[0])"><span class="icon-support"></span><span class="number">{{ currentUserCommentData[0].supportNum === 0 ? '' : currentUserCommentData[0].supportNum }}</span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="comment-container comment-list-container" v-if="otherUserCommentData.length">
          <span class="title">精选评论</span>
          <div class="comment-item" v-for="(item, index) in otherUserCommentData" :key="index">
            <div class="left"><img :src="item.avatar" alt=""></div>
            <div class="right">
              <div class="user-name">{{ item.username }}</div>
              <div class="scored">给这部作品打了{{ item.userScore }}分</div>
              <div class="comment-content">{{ item.content }}</div>
              <div class="bottom">
                <span class="comment-date">{{ formatCommentDate(item.commentDate) }}</span>
                <span class="support" :class="{'active': userIsSupportComment(item.supportUser)}" @click="supportBtnHandle(item)"><span class="icon-support"></span><span class="number">{{ item.supportNum === 0 ? '' : item.supportNum }}</span></span>
              </div>
            </div>
          </div>
        </div>
        <span class="tips" v-if="!currentUserCommentData.length && !otherUserCommentData.length">暂无评论！</span>
      </div>
    </div>
    <div class="buy" v-if="jsonData.isShow">
      <div 
        class="btn" 
        :class="{pre_sell: new Date(jsonData.publicDate) - new Date() > 0}" 
        @click="$router.push({path: '/select_cinema', query: {movieId: $route.query.movieId}})"
      >
        {{ new Date(jsonData.publicDate) - new Date() > 0 ? '预售购票' : '特惠购票' }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Indicator } from 'mint-ui'
import { Rate } from 'element-ui'
import moment from 'moment'
import { formatDate } from '@/common/utils/util'
import { getToken, getCookie } from '@/common/utils/auth'
import { getMovieDetail } from '@/api/movie'
import { getUserComment, getAllUserPassComment, updateUserSupport } from '@/api/comment'
import { isWishMovie, wishMovie, cancelWishMovie } from '@/api/wish_movie'

Vue.use(Rate)

export default {
  name: 'MovieDetail',
  data() {
    return {
      starValue: 0,
      averageScore: 0,
      commentNum: 0,
      jsonData: [],
      isShowMovie: false,
      notWishMovie: true,
      isWatched: false,
      currentUserCommentData: [],
      tempUserComment: null,
      otherUserCommentData: []
    }
  },
  created() {
    Indicator.open('Loading...')
    this.loadMovieDetail()
  },
  methods: {
    // 加载电影详细信息
    loadMovieDetail() {
      if (this.$route.query.movieId) {
        getMovieDetail({ movieId: this.$route.query.movieId })
          .then(response => {
            this.jsonData = response.data
            // 判断电影是否上映
            new Date() - new Date(this.jsonData.publicDate) >= 0 ? (this.isShowMovie = true) : (this.isShowMovie = false)
            if (this.jsonData.score) {
              this.averageScore = this.jsonData.score.toFixed(1)
              this.starValue = this.averageScore * 0.5
            }

            if (getToken()) {
              // 判断用户是否喜欢该电影
              isWishMovie({ movieId: this.$route.query.movieId }).then(response => {
                if (response.data) {
                  this.notWishMovie = false
                } else {
                  this.notWishMovie = true
                }
              })
            }

            if (getToken()) {
              // 获取当前用户评论
              getUserComment({ movieId: this.$route.query.movieId }).then(response => {
                if (response.data !== undefined) {
                  if (response.data.isPass) {
                    this.currentUserCommentData[0] = response.data
                    this.isWatched = true
                    this.commentNum += 1
                  } else {
                    this.tempUserComment = response.data
                  }
                }
              })
            }

            // 获取所有用户通过审核的评论
            getAllUserPassComment({ movieId: this.$route.query.movieId }).then(response => {
              if (response.data !== undefined) {
                this.commentNum += response.data.length
                this.otherUserCommentData = response.data
              }
            })

            Indicator.close()
          })
          .catch(err => {
            Indicator.close()
          })
      }
    },
    // 想看按钮处理
    wishBtnHandle() {
      if (getToken()) {
        // 不想看
        if (this.notWishMovie) {
          wishMovie({ movieId: this.$route.query.movieId }).then(response => {
            this.notWishMovie = false
          })
        } else {
          cancelWishMovie({ movieId: this.$route.query.movieId }).then(response => {
            this.notWishMovie = true
          })
        }
      } else {
        this.$router.push('/login')
      }
    },
    // 看过按钮处理
    watchedBtnHandle() {
      // 用户已登录
      if (getToken()) {
        this.$router.push({ path: '/comment_panel', query: { comment: this.currentUserCommentData[0] ? this.currentUserCommentData[0] : this.tempUserComment, movieId: this.$route.query.movieId } })
      } else {
        this.$router.push('/login')
      }
    },
    // 点赞按钮处理
    supportBtnHandle(comment) {
      if (getToken()) {
        let supportUser, supportNum
        // 有点赞数据
        if (comment.supportNum !== 0) {
          supportUser = JSON.parse(comment.supportUser)
          // 当前用户已点赞
          if (supportUser.indexOf(Number(getCookie('userInfo').id)) > -1) {
            // 取消点赞
            supportUser.splice(supportUser.indexOf(Number(getCookie('userInfo').id)), 1)
            supportNum = supportUser.length
            if (!supportUser.length) {
              supportUser = undefined
            }
          } else {
            // 点赞
            supportUser.push(Number(getCookie('userInfo').id))
            supportNum = supportUser.length
          }
        } else {
          // 无点赞数据
          supportUser = []
          supportUser.push(Number(getCookie('userInfo').id))
          supportNum = supportUser.length
        }
        updateUserSupport({ id: comment.id, supportNum: supportNum, supportUser: JSON.stringify(supportUser) }).then(response => {
          comment.supportUser = JSON.stringify(supportUser)
          comment.supportNum = supportNum
          if (this.currentUserCommentData[0].id === comment.id) {
            this.currentUserCommentData.splice(0, 1, comment)
            console.log(this.currentUserCommentData[0])
          }
        })
      } else {
        this.$router.push('/login')
      }
    },
    // 判断用户是否点赞
    userIsSupportComment(supportStrArr) {
      if (supportStrArr && JSON.parse(supportStrArr).indexOf(Number(getCookie('userInfo').id)) > -1) {
        return true
      } else {
        return false
      }
    },
    // 处理评论日期
    formatCommentDate(date) {
      return formatDate(new Date(moment(date).format('YYYY-MM-DD HH:mm:ss')), false)
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#movie-detail {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #242342 0%, #11182B 100%);
  color: #fff;
  font-size: 0.3125rem;

  .top {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.2rem;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #242342;
    z-index: 999;

    .icon-back {
      font-size: 0.4rem;
      position: absolute;
      left: 0.3rem;
    }
  }

  .info {
    width: 90%;
    padding: 0.2rem;
    box-sizing: border-box;
    height: 3rem;
    margin: 1rem auto 0;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #333;
    border-radius: 0.2rem;

    img {
      width: 28%;
      box-sizing: border-box;
      border-radius: 0.05rem;
    }

    .describe {
      width: 62%;

      .name {
        font-size: 0.345rem;
        font-weight: 700;
        margin-bottom: 0.12rem;
      }

      .small {
        font-size: 0.28rem;
        margin-bottom: 0.12rem;
      }
    }
  }

  .action {
    width: 90%;
    height: 1rem;
    margin: 0 auto;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 0.2rem;

    .btn {
      font-size: 0.4rem;
      width: 36%;
      height: 0.6rem;
      border-radius: 0.3rem;
      // background-color: #ffb400;
      color: #8a8a8a;
      background-color: #dbdbdb;
      display: flex;
      justify-content: center;
      align-items: center;

      .font {
        color: #2c2c2c;
      }

      &.active {
        background-color: #fff1d4;
        color: #fe9a02;

        .font {
          color: #fe9a02;
        }
      }

      span:last-child {
        font-size: 0.25rem;
        margin-left: 0.1rem;
      }
    }
  }

  .public-praise {
    width: 90%;
    height: auto;
    margin: 0.2rem auto;
    box-sizing: border-box;
    padding: 0.3rem;
    background-color: #3a3a52;
    border-radius: 0.2rem;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;

      .title {
        font-weight: bolder;
      }

      .wish {
        font-size: 0.25rem;
        padding: 0.04rem 0;
      }
    }

    /deep/ .mark {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .score {
          font-size: 0.68rem;
          font-weight: bolder;
          color: #ffb400;
          margin-bottom: 0.1rem;

          .small {
            font-size: 0.25rem;
          }
        }

        .score-people {
          font-size: 0.2rem;
          color: #ffb400;
        }
      }

      .left {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffb400;

        .noShow {
          font-size: 0.17rem;
          line-height: 0.9rem;
        }

        i {
          font-size: 0.6rem;
        }
      }
    }

    .wish {
      font-size: 0.3rem;
      padding: 0.2rem 0;
      vertical-align: text-bottom;
      line-height: 0.48rem;
      letter-spacing: 0.04rem;

      .wish-number {
        font-size: 0.48rem;
        color: #ffb400;
        font-weight: bolder;
      }
    }
  }

  .intro {
    width: 90%;
    height: auto;
    margin: 0.2rem auto;
    box-sizing: border-box;
    padding: 0.25rem;
    background-color: #3a3a52;
    border-radius: 0.2rem;

    .title {
      font-weight: bolder;
      color: #fff;
      margin-bottom: 0.25rem;
    }

    .content {
      text-align: justify;
      font-size: 0.28rem;
      line-height: 0.4rem;
    }
  }

  .comment {
    width: 100%;
    box-sizing: border-box;
    padding: 0.25rem;
    height: auto;
    margin: 0 auto;
    background-color: #fff;
    color: #333;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1rem;

      .title {
        font-weight: bolder;
        padding: 0.25rem;
      }

      .join {
        padding: 0.14rem;
        background-color: #dd2727;
        margin-right: 0.25rem;
        color: #fff;
        border-radius: 0.12rem;
        font-size: 0.24rem;
      }
    }

    .content {
      width: 100%;
      padding: 0.25rem;
      padding-bottom: 0;
      box-sizing: border-box;
      margin-bottom: 1rem;

      .comment-container {
        width: 100%;

        .title {
          font-weight: lighter;
          font-size: 0.25rem;
          padding-bottom: 0.25rem;
        }

        .comment-item {
          display: flex;
          padding-top: 0.25rem;

          .left {
            width: 10%;
            height: 10%;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .right {
            margin: 0 0.25rem 0.25rem;
            font-size: 0.3125rem;
            width: 100%;

            .user-name {
              font-size: 0.25rem;
              font-weight: bolder;
              margin-bottom: 0.1rem;
            }

            .scored {
              font-size: 0.2rem;
              font-weight: lighter;
              margin-bottom: 0.1rem;
            }

            .comment-content {
              font-size: 0.28rem;
              line-height: 0.4rem;
              margin-bottom: 0.1rem;
              text-align: justify;
              white-space: pre-line;
            }

            .bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 0.28rem;

              .comment-date {
                font-size: 0.24rem;
              }

              .support {
                padding: 0.1rem;
                border: 0.01rem solid #ccc;
                border-radius: 0.24rem;

                &.active {
                  color: #dd2727;
                  border: 0.01rem solid #dd2727;
                }

                .number {
                  font-weight: lighter;
                  margin-left: 0.1rem;
                  font-size: 0.25rem;
                }
              }
            }
          }
        }
      }

      .tips {
        font-size: 0.25rem;
      }
    }
  }

  .buy {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1rem;
    // background-color: #fff;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      width: 90%;
      height: 0.8rem;
      background-color: #dd2727;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.4rem;
      font-weight: light;
    }

    .pre_sell {
      background-color: #2d98f3;
    }
  }
}
</style>
