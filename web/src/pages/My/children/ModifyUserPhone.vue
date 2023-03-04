<template>
  <div id="modify_userphone">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="name ellipsis">修改手机号</span>
      <span class="sure-btn" @click="modifyUserPhone">确定</span>
    </div>
    <div class="container">
      <el-input class="input" v-model="input" spellcheck="false" clearable>
      </el-input>
      <p>改手机号仅用于生成订单</p>
    </div>
  </div>
</template>

<script>
import { Input } from 'element-ui'
import { Toast } from 'mint-ui'
import { validPhone } from '@/common/utils/validate'
import { getToken } from '@/common/utils/auth'
import { updateUserPhone } from '@/api/user'

export default {
  name: 'ModifyUserPhone',
  components: {
    Input
  },
  data() {
    return {
      input: null
    }
  },
  created() {
    this.input = this.$route.params.phone
  },
  methods: {
    modifyUserPhone() {
      if (getToken() && validPhone(this.input)) {
        updateUserPhone({ phone: this.input }).then(response => {
          this.$router.go(-1)
        })
      } else {
        Toast({
          message: '手机格式错误',
          position: 'middle',
          duration: 2000
        })
      }
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#modify_userphone {
  width: 100%;
  height: 100%;
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

    .sure-btn {
      position: absolute;
      right: 0.3rem;
      font-size: 0.3125rem;
    }
  }

  .container {
    font-size: 0.3125rem;
    position: fixed;
    top: 1rem;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #f1f1f1;

    /deep/ .el-input {
      margin-top: 0.4rem;

      input {
        border: none;
        outline: none;
        font-size: 0.3125rem;
      }
    }

    p {
      font-size: 0.24rem;
      color: #888;
      margin: 0.2rem;
    }
  }
}
</style>
