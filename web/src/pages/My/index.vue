<template>
  <div id="my">
    <div class="header">
      <div class="left">
        <div class="avatar">
          <img :src="avatar" alt="">
        </div>
        <span @click="$router.push('login')" v-if="!userInfo.username" class="go-login">登录/注册</span>
        <div v-else class="user-info">
          <span class="ellipsis" style="font-size: .375rem;line-height: .6rem;margin-bottom: .12rem">{{ userInfo.username }}</span>
        </div>
      </div>
      <div class="right" v-if="userInfo.username" @click="viewUserInfo"><svg-icon icon-class="config" /></div>
    </div>
    <div class="content">
      <div class="list">
        <div class="item" @click="viewMyOrder">我的订单 <span class="icon-more"></span></div>
        <div class="item" @click="viewMyMovie(0)">想看的电影 <span class="icon-more"></span></div>
        <div class="item" @click="viewMyMovie(1)">看过的电影 <span class="icon-more"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import { getUserInfo } from '@/api/user'
import { getToken, getCookie, setCookie } from '@/common/utils/auth'

export default {
  name: 'My',
  data() {
    return {
      userInfo: {},
      avatar: 'https://pddou.oss-cn-chengdu.aliyuncs.com/userIcon.png'
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    // 用户头像
    userAvatar() {
      if (this.userInfo) {
        this.avatar = this.userInfo.avatar
      }
    },
    // 加载用户信息
    loadUserInfo() {
      if (getToken() && !getCookie('userInfo')) {
        Indicator.open('Loading...')
        getUserInfo()
          .then(response => {
            this.userInfo = response.data
            setCookie('userInfo', response.data, 60 * 60 * 3)
            this.userAvatar()
            Indicator.close()
          })
          .catch(err => {
            Indicator.close()
          })
      } else {
        let userInfo = getCookie('userInfo')
        if (userInfo) {
          this.userInfo = userInfo
          this.avatar = this.userInfo.avatar
        }
        Indicator.close()
      }
    },
    // 查看个人信息
    viewUserInfo() {
      if (getToken()) {
        this.$router.push('my_info')
      }
    },
    // 查看个人订单
    viewMyOrder() {
      if (getToken()) {
        this.$router.push('my_order')
      } else {
        this.$router.push('login')
      }
    },
    // 查看个人电影
    viewMyMovie(flag) {
      if (getToken()) {
        this.$router.push({ name: 'my_movie', params: {isWatched: flag}})
      } else {
        this.$router.push('login')
      }
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#my {
  width: 100%;
  height: 100%;

  .header {
    font-size: 0.3125rem;
    font-weight: bolder;
    height: 2.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #dd2727;
    color: #fff;
    position: relative;

    .left {
      width: 4rem;
      height: 2rem;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 0.4rem;

      .avatar {
        position: absolute;
        box-sizing: border-box;
        border: 0.08rem solid #f1f1f1;
        left: 0;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        overflow: hidden;
        font-size: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .go-login {
        position: absolute;
        left: 2rem;
      }

      .user-info {
        width: 100%;
        position: absolute;
        left: 2rem;
        display: flex;
        flex-flow: column;

        span:last-child {
          font-size: 0.25rem;
        }
      }
    }

    .right {
      display: flex;
      font-weight: lighter;
      justify-content: center;
      align-items: center;
      font-size: 0.24rem;
      width: 1.2rem;
      height: 0.4rem;
      padding: 0 0.2rem;
      border-radius: 0.2rem 0 0 0.2rem;
    }
  }

  .content {
    border-top: 0.4rem solid #f1f1f1;
    font-size: 0.3125rem;
    position: fixed;
    top: 2.8rem;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #f1f1f1;

    .list {
      background-color: #fff;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem;
        font-size: 0.3125rem;
        border-bottom: 0.12rem solid #f1f1f1;
      }

      .icon-more {
        font-weight: 700;
      }
    }
  }
}
</style>
