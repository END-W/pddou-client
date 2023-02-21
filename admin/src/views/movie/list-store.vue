<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
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

        <el-col :span="6">
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

        <el-col :span="6">
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

        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" @click="getMovieList">查询</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="addDialogVisible = true"
              >添加</el-button
            >
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

      <el-table-column width="100px" align="center" label="票价">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
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
            type="primary"
            icon="el-icon-edit"
            size="mini"
            circle
            @click="showEditDialog(scope.row)"
          >
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
            style="margin-right: 10px"
            @click="removeMovieByStore(scope.row.id)"
          >
          </el-button>
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

    <el-dialog title="添加电影" :visible.sync="addDialogVisible" width="25%">
      <el-form
        :model="addMovieForm"
        ref="addMovieFormRef"
        :rules="addMovieFormRules"
        label-width="100px"
      >
        <el-form-item label-width="70px" label="电影名" prop="movieId">
          <el-select
            v-model="addMovieForm.movieId"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="请输入电影名"
            :remote-method="getRemoteMovieList"
            style="width: 100%"
          >
            <el-option
              v-for="item in movieListOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="70px" label="票价" prop="price">
          <el-input v-model="addMovieForm.price"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMovieByStore">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改票价" :visible.sync="editDialogVisible" width="25%">
      <el-form
        :model="editMovieForm"
        ref="editMovieFormRef"
        :rules="editMovieFormRules"
        label-width="70px"
      >
        <el-form-item label="票价" prop="price">
          <el-input v-model="editMovieForm.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMovieByStore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchMovieListByStore,
  fetchMovieByStore,
  addMovieByStore,
  editMovieByStore,
  removeMovieByStore,
} from '@/api/movie'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MovieListByStore',
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
    scoreFilter(score) {
      if (score == null) {
        return '暂无'
      }
      return score
    },
  },
  data() {
    const validatePrice = (rule, value, callback) => {
      const regex = /^\d+(\.\d{1,2})?$/
      if (!regex.test(value)) {
        callback(new Error('请输入xx.xx格式'))
      } else {
        callback()
      }
    }
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
      movieListOptions: [],
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
      addDialogVisible: false,
      addMovieForm: {
        movieId: undefined,
        price: 0,
      },
      addMovieFormRules: {
        movieId: [{ required: true, message: '请输入电影名', trigger: 'blur' }],
        price: [
          { required: true, message: '请输入票价', trigger: 'blur' },
          { validator: validatePrice, trigger: 'blur' },
        ],
      },
      editDialogVisible: false,
      editMovieForm: {
        id: '',
        price: 0,
      },
      editMovieFormRules: {
        price: [
          { required: true, message: '请输入票价', trigger: 'blur' },
          { validator: validatePrice, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getMovieList()
  },
  methods: {
    getMovieList() {
      this.listLoading = true
      if (this.listQuery.name != null && this.listQuery.name !== '')
        this.listQuery.name = this.listQuery.name.trim()
      fetchMovieListByStore(this.listQuery).then((response) => {
        this.movieList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    addMovieByStore() {
      this.$refs.addMovieFormRef.validate(async (valid) => {
        if (!valid) return
        addMovieByStore(this.addMovieForm)
          .then((response) => {
            this.$message.success('添加电影成功')
            this.addDialogVisible = false
            this.addMovieForm.movieId = undefined
            this.addMovieForm.price = 0
            this.getMovieList()
          })
          .catch((err) => {
            this.$message.error('添加电影失败')
            this.addDialogVisible = false
          })
      })
    },
    showEditDialog(row) {
      this.editMovieForm.id = row.id
      this.editMovieForm.price = row.price
      this.editDialogVisible = true
    },
    editMovieByStore() {
      this.$refs.editMovieFormRef.validate(async (valid) => {
        if (!valid) return
        editMovieByStore(this.editMovieForm)
          .then((response) => {
            this.$message.success('更新票价成功')
            this.editDialogVisible = false
            this.getMovieList()
          })
          .catch((err) => {
            this.$message.error('更新票价失败')
            this.editDialogVisible = false
          })
      })
    },
    async removeMovieByStore(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该电影, 是否继续?',
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
      removeMovieByStore({ id: id })
        .then((response) => {
          this.$message.success('删除电影成功')
          this.getMovieList()
        })
        .catch((err) => {
          this.$message.success('删除电影成功')
        })
    },
    getRemoteMovieList(query) {
      fetchMovieByStore({ name: query }).then((response) => {
        if (!response.data) return
        this.movieListOptions = response.data
      })
    },
  },
}
</script>

<style scoped></style>
