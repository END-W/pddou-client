<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item>
            <el-input
              placeholder="请输入用户名"
              v-model="listQuery.username"
              clearable
              @clear="getCommentList"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-input
              placeholder="请输入电影名"
              v-model="listQuery.movieName"
              clearable
              @clear="getCommentList"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-select
              v-model="listQuery.isPass"
              clearable
              @clear="getCommentList"
              placeholder="请选择通过/未通过"
            >
              <el-option
                v-for="item in pass"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="getCommentList">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="commentList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="60px" align="center" label="ID">
      </el-table-column>

      <el-table-column width="140px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="电影名">
        <template slot-scope="scope">
          <span>{{ scope.row.movieName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="用户评分">
        <template slot-scope="scope">
          <span>{{ scope.row.userScore }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="评论时间">
        <template slot-scope="scope">
          <span>{{ scope.row.commentDate }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" align="center" label="评论内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="点赞数">
        <template slot-scope="scope">
          <span>{{ scope.row.supportNum }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.isPass | isPassFilter">
            {{ row.isPass | parsePass }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="commentStateChanged(scope.row)"
          >
            审核
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="removeComment(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getCommentList"
    />
  </div>
</template>

<script>
import { fetchCommentList, removeComment, commentStateChanged } from '@/api/comment'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'CommentList',
  components: { Pagination },
  filters: {
    isPassFilter(isPass) {
      if (isPass) return 'success'
      return 'danger'
    },
    parsePass(isPass) {
      if (isPass) return '通过'
      return '未通过'
    },
  },
  data() {
    return {
      pass: [
        {
          value: '0',
          label: '未通过',
        },
        {
          value: '1',
          label: '通过',
        },
      ],
      commentList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        username: '',
        movieName: '',
        isPass: undefined,
        page: 1,
        limit: 20,
      },
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    getCommentList() {
      this.listLoading = true
      if (this.listQuery.username !== '')
        this.listQuery.username = this.listQuery.username.trim()
      if (this.listQuery.movieName !== '')
        this.listQuery.movieName = this.listQuery.movieName.trim()
      fetchCommentList(this.listQuery).then((response) => {
        this.commentList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    async removeComment(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该评论, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      removeComment({commentId: id}).then(response => {
        this.$message.success('删除评论成功')
        this.getCommentList()
      }).catch(err => {
        this.$message.error('删除评论失败')
      })
    },
    async commentStateChanged(row) {
      let pass = ['通过', '不通过']
      const confirmResult = await this.$confirm(pass[row.isPass ? 1: 0] + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      commentStateChanged({ commentId: row.id, isPass: !row.isPass })
        .then((response) => {
          this.$message.success('审核成功')
          this.getCommentList()
        })
        .catch((err) => {
          this.$message.error('审核失败')
        })
    },
  },
}
</script>

<style scoped></style>
