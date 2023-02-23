<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item>
            <el-input
              placeholder="请输入电影名"
              v-model="listQuery.name"
              clearable
              @clear="getMovieList"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-select
              v-model="listQuery.language"
              clearable
              @clear="getMovieList"
              placeholder="请选择语言"
            >
              <el-option
                v-for="item in languages"
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
            <el-select
              v-model="listQuery.isShow"
              clearable
              @clear="getMovieList"
              placeholder="请选择上映/下映"
            >
              <el-option
                v-for="item in show"
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
            <el-button type="primary" @click="getMovieList">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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

      <el-table-column width="70px" align="center" label="评分">
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
          <router-link :to="'/movie/edit/' + scope.row.id">
            <el-button type="primary" size="small"> 编辑 </el-button>
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
import { filterEmpty } from '@/utils/index'
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
      languages: [
        {
          value: '粤语',
          label: '粤语',
        },
        {
          value: '国语',
          label: '国语',
        },
        {
          value: '英语',
          label: '英语',
        },
        {
          value: '日语',
          label: '日语',
        },
        {
          value: '韩语',
          label: '韩语',
        },
        {
          value: '其它',
          label: '其它',
        },
      ],
      show: [
        {
          value: '0',
          label: '下映',
        },
        {
          value: '1',
          label: '上映',
        },
      ],
      movieList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        language: '',
        isShow: undefined,
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
      if (this.listQuery.name !== '')
        this.listQuery.name = this.listQuery.name.trim()
      fetchMovieList(filterEmpty(this.listQuery)).then((response) => {
        this.movieList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    async movieStateChanged(row) {
      const confirmResult = await this.$confirm('确定上映/下映?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      let tempShow = ['上映', '下映']
      movieStateChanged({ movieId: row.id, isShow: !row.isShow })
        .then((response) => {
          this.$message.success(tempShow[row.isShow ? 1 : 0] + '成功')
          this.getMovieList()
        })
        .catch((err) => {
          this.$message.error(tempShow[row.isShow ? 1 : 0] + '失败')
        })
    },
  },
}
</script>

<style scoped></style>
