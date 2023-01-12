<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="changePwdForm">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dialog width="35%" title="修改密码" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="password" label="当前密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" type="password" placeholder="密码长度6到30位，包含数字、字母、特殊符号中任意两种" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="newPassword" label="新密码" :label-width="formLabelWidth">
            <el-input v-model="form.newPassword" type="password" placeholder="新密码不能和当前密码相同" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认密码和新密码保持一致"
              autocomplete="off"
              @blur="onConfirmPwd($event)"
            />
            <div v-if="isActive" class="error">密码格式错误</div>
            <div v-if="isActive2" class="error">确认密码和新密码不一致</div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button :loading="loading" type="primary" @click.native="changePassword">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import store from '@/store'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import md5 from 'js-md5'
import { validPassword } from '@/utils/validate'
import { changePassword } from '@/api/employee'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码格式错误'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      formLabelWidth: '80px',
      isActive: false,
      isActive2: false,
      isOpen: false,
      form: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        password: [{ trigger: 'blur', validator: validatePassword }],
        newPassword: [{ trigger: 'blur', validator: validatePassword }]
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    refRemoveClass(ref_info, class_name) {
      ref_info.forEach((element) => {
        console.log(element)
        // 区分是否为组件内，使用需要用 $el
        const class_name_arr = element.$el
          ? element.$el.className.split(' ')
          : element.className.split(' ')
        const index = class_name_arr.findIndex((item) => {
          return item === class_name
        })
        if (index !== -1) class_name_arr.splice(index, 1)
        // 区分是否为组件内，使用需要用 $el
        if (element.$el) {
          element.$el.className = class_name_arr.join(' ')
        } else {
          element.className = class_name_arr.join(' ')
        }
      })
    },
    changePwdForm() {
      this.dialogFormVisible = true
      this.loading = false
    },
    onConfirmPwd(event) {
      if (!validPassword(this.form.confirmPassword)) {
        this.isActive = true
        this.isActive2 = false
        this.isOpen = false
      } else {
        this.isActive = false
        if (this.form.confirmPassword !== this.form.newPassword) {
          this.isActive2 = true
          this.isActive = false
          this.isOpen = false
        } else {
          this.isActive2 = false
          this.isOpen = true
        }
      }
    },
    changePassword() {
      this.$refs.form.validate(valid => {
        if (valid && this.isOpen) {
          this.loading = true
          changePassword({ password: md5(this.form.password), newPassword: md5(this.form.newPassword) }).then(response => {
            this.dialogFormVisible = false
            this.isOpen = false
            this.form.password = ''
            this.form.newPassword = ''
            this.form.confirmPassword = ''
            this.loading = false
            Message({
              message: '修改密码成功',
              type: 'success',
              duration: 2 * 1000
            })
            setTimeout(() => {
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            }, 2000)
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: top;
        }

        .name {
          cursor: pointer;
          margin-left: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .el-form-item__content {
      .error {
        color: #F56C6C;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
      }
    }
  }
}
</style>
