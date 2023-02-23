<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入用户名"
          v-model="listQuery.username"
          clearable
          @clear="getUserList"
        >
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-input
          placeholder="请输入手机号码"
          v-model="listQuery.phone"
          clearable
          @clear="getUserList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="userList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="60px" align="center" label="ID">
      </el-table-column>

      <el-table-column width="180px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="生日">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday | parseBirthday }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" align="center" label="个性签名">
        <template slot-scope="scope">
          <span>{{ scope.row.sign | parseSign }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="注册日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.locked"
            @change="userStateChanged(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column v-if="'SUPERADMIN' === roles[0]" width="140px" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
            @click="removeUser(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getUserList"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  fetchUserList,
  removeUser,
  userStateChanged,
} from '@/api/user'
import { filterEmpty } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'UserList',
  components: { Pagination },
  filters: {
    parseBirthday(birthday) {
        if (birthday == null || birthday === '') {
            return '暂无'
        }
        return birthday
    },
    parseSign(sign) {
        if (sign == null || sign === '') {
            return '暂无'
        }
        return sign
    }
  },
  data() {
    return {
      userList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        username: '',
        phone: '',
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      if (this.listQuery.username !== '') this.listQuery.username = this.listQuery.username.trim()
      if (this.listQuery.phone !== '') this.listQuery.phone = this.listQuery.phone.trim()
      fetchUserList(filterEmpty(this.listQuery)).then((response) => {
        this.userList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    userStateChanged(row) {
      userStateChanged({ userId: row.id, locked: row.locked })
        .then((response) => {})
        .catch((err) => {
          row.locked = !row.locked
        })
    },
    async removeUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      removeUser({ userId: id }).then((response) => {
        this.$message.success('删除用户成功')
        this.getUserList()
      }).catch((err) => {
        this.$message.success('删除用户失败')
      })
    }
  }
}
</script>

<style scoped>
</style>
