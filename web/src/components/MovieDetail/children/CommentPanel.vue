<template>
  <div id="comment-panel">
    <div class="top">
      <span class="icon-close" @click="$router.go(-1)"></span>
      <span class="title">看过</span>
      <span class="btn" @click="commentBtnHandle">发布</span>
    </div>
    <div class="mark">
      <span class="score"><span class="number">{{ score }}</span>分</span>
      <span class="text">{{ handleScoreText }}</span>
      <el-rate v-model="starValue" allow-half @change="changeScore" />
    </div>
    <textarea class="comment-text" placeholder="好看吗？快来写下你的感受吧!" v-model="textarea">
      </textarea>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { Rate } from 'element-ui'
import { Toast, MessageBox } from 'mint-ui'
import { updateUserComment } from '@/api/comment'

Vue.use(Rate)

export default {
  name: 'CommentPanel',
  data() {
    return {
      movieId: undefined,
      supportUser: null,
      textarea: '',
      score: 0,
      starValue: 0
    }
  },
  created() {
    this.loadUserComment()
  },
  methods: {
    // 改变分数
    changeScore(score) {
      this.score = score * 2
    },
    // 获取用户评论
    loadUserComment() {
      let comment = this.$route.query.comment
      if (comment) {
        this.movieId = comment.movieId
        this.supportUser = comment.supportUser
        this.starValue = comment.userScore * 0.5
        this.score = comment.userScore
        this.textarea = comment.content
      }
    },
    commentBtnHandle() {
      if (this.textarea) {
        let commentDate = moment().format('YYYY-MM-DD HH:mm:ss')
        updateUserComment({ movieId: this.$route.query.movieId, userScore: this.score, supportUser: this.supportUser, content: this.textarea, commentDate: commentDate }).then(response => {
          MessageBox.alert('评论成功，待管理员审核！').then(action => {
            this.$router.go(-1)
          })
        })
      } else {
        Toast({
          message: '请输入评论内容',
          position: 'bottom',
          duration: 2000
        })
      }
    }
  },
  computed: {
    // 处理分数文本
    handleScoreText() {
      if (this.score === 1 || this.score === 2) {
        return '超烂啊'
      } else if (this.score === 3 || this.score === 4) {
        return '比较差'
      } else if (this.score === 5 || this.score === 6) {
        return '一般般'
      } else if (this.score === 7 || this.score === 8) {
        return '还不错'
      } else if (this.score === 9 || this.score === 10) {
        return '棒极了'
      }
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#comment-panel {
  width: 100%;
  background-color: #fff;
  font-size: 0.3125rem;

  .top {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1rem;
    background-color: #f9f9f9;
    position: relative;

    .icon-close {
      position: absolute;
      left: 0;
      font-size: 0.6rem;
      color: #888;
      padding: 0.25rem;
      font-weight: lighter;
    }

    .title {
      font-size: 0.3rem;
      letter-spacing: 0.04rem;
    }

    .btn {
      position: absolute;
      right: 0.25rem;
      padding: 0.16rem 0.24rem;
      background-color: #dd2727;
      color: white;
      border-radius: 0.1rem;
      font-size: 0.25rem;
    }
  }

  /deep/ .mark {
    width: 100%;
    height: 100%;
    padding: 0.25rem;
    padding-bottom: 0.5rem;
    box-sizing: border-box;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    font-size: 0.25rem;
    border-bottom: 0.0125rem solid #f1f1f1;

    .score {
      color: #ffb400;
      padding: 0.25rem;

      .number {
        font-size: 0.8rem;
      }
    }

    .text {
      margin-bottom: 0.3rem;
      color: #888;
    }

    .el-rate {
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        font-size: 0.8rem;
      }
    }
  }

  .comment-text {
    font-size: 0.3125rem;
    line-height: 0.4rem;
    padding: 0.4rem;
    text-align: justify;
    width: 100%;
    height: 6rem;
    box-sizing: border-box;
    border: none;
    outline: none;
    resize: none;
  }
}
</style>
