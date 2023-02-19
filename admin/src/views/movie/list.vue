<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入用户名"
          v-model="listQuery.username"
          clearable
          @clear="getMovieList"
        >
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-input
          placeholder="请输入手机号码"
          v-model="listQuery.phone"
          clearable
          @clear="getMovieList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getMovieList"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="movieList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="60px" align="center" label="ID">
      </el-table-column>

      <el-table-column width="180px" align="center" label="电影名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="导演">
        <template slot-scope="scope">
          <span>{{ scope.row.director }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="主演">
        <template slot-scope="scope">
          <span>{{ scope.row.actor }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="电影片长">
        <template slot-scope="scope">
          <span>{{ scope.row.movieLong }}</span>
        </template>
      </el-table-column>

      <el-table-column width="60px" align="center" label="语言">
        <template slot-scope="scope">
          <span>{{ scope.row.language }}</span>
        </template>
      </el-table-column>

      <el-table-column width="60px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="上映时间">
        <template slot-scope="scope">
          <span>{{ scope.row.publicDate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="想看人数">
        <template slot-scope="scope">
          <span>{{ scope.row.wishNum }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="评分">
        <template slot-scope="scope">
          <span>{{ scope.row.score | scoreFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.isShow | isShowFilter">
            {{ row.isShow | parseShow }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
						style="margin-right: 10px"
            @click="movieStateChanged(scope.row)"
          >
						{{ scope.row.isShow | reverseShow }}
					</el-button>
					<router-link :to="'/movie/edit/'+scope.row.id">
            <el-button type="primary" size="small">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getMovieList"
    />
  </div>
</template>

<script>
import { fetchMovieList, movieStateChanged } from '@/api/movie'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MovieList',
  components: { Pagination },
  filters: {
    isShowFilter(isShow) {
      if (isShow) return 'success'
      return 'danger'
    },
		parseShow(isShow) {
			if (isShow) return '上映'
      return '下映'
		},
		reverseShow(isShow) {
			if (isShow) return '下映'
      return '上映'
		},
		scoreFilter(score) {
        if (score == null) {
            return '暂无'
        }
        return score
    },
  },
  data() {
    return {
      movieList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        username: '',
        phone: '',
        page: 1,
        limit: 20,
      },
    }
  },
  created() {
    this.getMovieList()
  },
  methods: {
    getMovieList() {
      this.listLoading = true
      if (this.listQuery.username !== '')
        this.listQuery.username = this.listQuery.username.trim()
      if (this.listQuery.phone !== '')
        this.listQuery.phone = this.listQuery.phone.trim()
      fetchMovieList(this.listQuery).then((response) => {
        this.movieList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    async movieStateChanged(row) {
			const confirmResult = await this.$confirm(
        '确定上映/下映?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      movieStateChanged({ movieId: row.id, isShow: !row.isShow })
        .then((response) => {
					this.getMovieList()
				})
        .catch((err) => {
          row.isShow = !row.isShow
        })
    },
  },
}
</script>

<style scoped></style>
