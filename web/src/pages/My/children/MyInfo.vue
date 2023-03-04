<template>
  <div id="my-info">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="name ellipsis">我的资料</span>
    </div>
    <div class="info-container">
      <div class="list">
        <div class="item" style="position:reltive;">
          头像
          <div class="right">
            <img
              :src="avatar"
              ref="previewImg"
              alt
              style="width: 1rem;height: 1rem;border-radius: 50%"
            />
            <i class="icon-more"></i>
          </div>

          <input
            type="file"
            id="file"
            name="file"
            ref="uploadImg"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;opacity:0"
            @change="changeImg"
          />
        </div>

        <div
          class="item"
          @click.prevent="$router.push({name: 'modify_username',params:{username: username}})"
        >
          <span>昵称</span>
          <span class="right">
            {{ username ? username: '未填写' }}
            <i class="icon-more"></i>
          </span>
        </div>
        <div class="item" @click.prevent="showGenderPanel = true">
          <span>性别</span>
          <span class="right">
            {{ gender ? gender: '未填写' }}
            <i class="icon-more"></i>
          </span>
        </div>
        <div class="item" @click.prevent="showDatePicker = true">
          <span>生日</span>
          <span class="right">
            {{ birthday }}
            <i class="icon-more"></i>
          </span>
        </div>
        <div
          class="item sign"
          @click.prevent="$router.push({name:'modify_userphone',params:{phone: phone}})"
        >
          <span>订单手机号</span>
          <span class="right">
            <span class="ellipsis sign">{{ phone }}</span>
            <i class="icon-more"></i>
          </span>
        </div>
      </div>
      <div class="logout">
        <span class="logout-btn" @click="logout()">退出</span>
      </div>
    </div>
    <div class="modify_sex" v-show="showGenderPanel" @click="showGenderPanel = false">
      <div class="container" @click.stop>
        <div class="content">
          <div class="title">修改性别</div>
          <div class="item" @click="modifyUserGender('男')">
            <i class="icon-male"></i>男
          </div>
          <div class="item" @click="modifyUserGender('女')">
            <i class="icon-female"></i>女
          </div>
        </div>
      </div>
    </div>
    <date-picker
      :show-picker-model="showDatePicker"
      :default-date="new Date(birthday)"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
import Vue from "vue"
import { MessageBox, Indicator, Toast } from "mint-ui"
import { Input } from "element-ui"
import DatePicker from "vuejs-mobile-datepicker"
import { getUserInfo, updateUserGender, updateUserBirthday, upLoadImg } from '@/api/user'
import { getToken, removeToken } from '@/common/utils/auth'

Vue.use(Input)

export default {
  name: "MyInfo",
  data() {
    return {
      username: "",
      password: "",
      gender: "",
      avatar: "",
      avatarSrc: "",
      birthday: null,
      phone: "",
      userInfo: {},
      showDatePicker: false,
      showGenderPanel: false
    };
  },
  components: {
    DatePicker
  },
  created() {
    Indicator.open('Loading...')
    this.loadUserInfo()
  },
  methods: {
    // 加载用户信息
    loadUserInfo() {
      if (getToken()) {
        getUserInfo()
          .then(response => {
            this.userInfo = response.data
            this.updateUserInfo()
            Indicator.close()
          })
          .catch(err => {
            Indicator.close()
          })
      }
    },
    // 更新用户信息
    updateUserInfo() {
      if (this.userInfo) {
        this.avatarSrc = this.userInfo.avatar
        this.avatar = this.avatarSrc
        this.userInfo.username
          ? (this.username = this.userInfo.username)
          : (this.username = "")
        this.userInfo.gender
          ? (this.gender = this.userInfo.gender)
          : (this.gender = "")
        this.userInfo.birthday
          ? (this.birthday = this.userInfo.birthday)
          : (this.birthday = null)
        this.phone = this.userInfo.phone
      }
    },
    async modifyUserGender(gender) {
      if (getToken() && gender) {
        updateUserGender({gender: gender}).then(response => {
          this.showGenderPanel = false
          this.gender = gender
        })
      }
    },
    changeImg(e) {
      let reader = new FileReader()
      reader.readAsDataURL(this.$refs.uploadImg.files[0]) // 发起异步请求
      let _this = this
      reader.onload = function() {
        // 读取完成后，将结果赋值给img的src
        _this.modifyUserAvatar()
        _this.$refs.previewImg.src = this.result
      }
    },
    // 修改用户头像
    async modifyUserAvatar() {
      if (!getToken()) {
        Toast({
          message: "请先登录！",
          position: "middle",
          duration: 2000
        })
        return false
      } else {
        let formData = new FormData()
        formData.append("file", this.$refs.uploadImg.files[0])
        upLoadImg(formData).then(response => {
          Toast({
            message: "修改头像成功",
            position: "middle",
            duration: 2000
          })
        })
      }
    },
    // 取消按钮
    handleCancel() {
      this.showDatePicker = false
    },
    // 确定按钮
    async handleConfirm(selectedDate) {
      if (getToken() && selectedDate) {
        updateUserBirthday({birthday: selectedDate}).then(response => {
          this.showDatePicker = false
          this.birthday = selectedDate
        })
      }
    },
    disableDate(item) {
      if (
        new Date(item) - new Date("1900-10-10") >= 0 &&
        new Date("1990-10-10") - new Date(item) >= 0
      ) {
        return true
      }
    },
    // 修改密码
    changeUserPwd() {
      MessageBox.prompt("修改密码(1-6位)").then(({ value, action }) => {
        if (value && /^[\w_-]{1,6}$/.test(value)) {
          this.password = value
        } else {
          MessageBox.alert("请输入1到6位密码！")
        }
      });
    },
    // 退出登录
    logout() {
      if (getToken()) {
        removeToken()
        this.$router.push("my")
      }
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#my-info {
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
      font-size: 0.345rem;
      text-align: center;
    }

    .save-btn {
      position: absolute;
      right: 0.3rem;
    }
  }

  .info-container {
    font-size: 0.3125rem;
    position: fixed;
    top: 1rem;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #f1f1f1;

    .list {
      background-color: #fff;
      margin-top: 0.4rem;

      /deep/ .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 0.36rem;
        border-bottom: 0.02rem solid #f1f1f1;
        position: relative;

        .right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          color: #888;
          width: 60%;

          .sign {
            display: inline-block;
            width: 100%;
            text-align: right;
          }
        }
      }
    }

    .logout {
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 0;
      line-height: 0.8rem;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.25rem;
      box-sizing: border-box;

      .logout-btn {
        width: 100%;
        height: 100%;
        background-color: #dd2727;
        color: #fff;
        border-radius: 0.1rem;
      }
    }
  }

  .modify_sex {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2040;

    .container {
      position: fixed;
      width: 5rem;
      height: 3rem;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.08rem;
      z-index: 2041;

      .content {
        width: 80%;

        .title {
          font-size: 0.345rem;
          font-weight: 700;
          margin-bottom: 0.6rem;
        }

        .item {
          margin-bottom: 0.2rem;
          height: 0.6rem;
          display: flex;
          align-items: center;

          i {
            font-size: 0.375rem;
            margin-right: 0.24rem;
          }
        }
      }
    }
  }
}
</style>
