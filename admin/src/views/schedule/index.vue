<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item>
            <el-input
              placeholder="请输入电影名"
              v-model="listQuery.movieName"
              clearable
              @clear="getScheduletList"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-input
              placeholder="请输入影厅名"
              v-model="listQuery.hallName"
              clearable
              @clear="getScheduletList"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-select
              v-model="listQuery.isShelf"
              clearable
              @clear="getScheduletList"
              placeholder="请选择上架/下架"
            >
              <el-option
                v-for="item in shelf"
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
            <el-button type="primary" @click="getScheduletList">查询</el-button>
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
      :data="scheduleList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="60px" align="center" label="ID">
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="电影名">
        <template slot-scope="scope">
          <span>{{ scope.row.movieName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" align="center" label="放映大厅">
        <template slot-scope="scope">
          <span>{{ scope.row.hallName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="放映日期">
        <template slot-scope="scope">
          <span>{{ scope.row.showDate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="放映时间">
        <template slot-scope="scope">
          <span>{{ scope.row.showTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="票价">
        <template slot-scope="scope">
          <span>{{ scope.row.price | parseFloat }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row | isShelfFilter">
            {{ row | parseIsShelf }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="removeScheduleByStore(scope.row.id)"
          >
            撤销
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getScheduletList"
    />

    <el-dialog title="添加场次" :visible.sync="addDialogVisible" width="25%">
      <el-form
        :model="addScheduleForm"
        ref="addScheduleFormRef"
        :rules="addScheduleFormRules"
        label-width="100px"
      >
        <el-form-item label-width="80px" label="电影名" prop="movieId">
          <el-select
            v-model="addScheduleForm.movieId"
            @change="changeMovie($event)"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="请输入电影名"
            :remote-method="getRemoteScheduleList"
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
        <el-form-item label-width="80px" label="影厅名" prop="hallName">
          <el-select
            v-model="addScheduleForm.hallName"
            clearable
            placeholder="请选择影厅"
            style="width: 100%"
          >
            <el-option
              v-for="item in hallListOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="80px" label="上映日期">
          <el-input v-model="addScheduleForm.publicDate" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="80px" label="放映日期" prop="showDate">
          <el-date-picker
            v-model="addScheduleForm.showDate"
            clearable
            type="date"
            placeholder="选择日期"
            :picker-options="datePickerOptions"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="80px" label="放映时间" prop="showTime">
          <el-time-select
            v-model="addScheduleForm.showTime"
            clearable
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:55',
            }"
            placeholder="选择时间"
            style="width: 100%"
          >
          </el-time-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addScheduleByStore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchScheduleList,
  fetchHallList,
  addScheduleByStore,
  removeScheduleByStore,
  fetchMovieByStore,
} from '@/api/schedule'
import { filterEmpty } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ScheduleListByStore',
  components: { Pagination },
  filters: {
    isShelfFilter(row) {
      const map = {
        YES: 'success',
        NO: 'danger',
      }
      let dateTime = row.showDate + ' ' + row.showTime
      let date = new Date(dateTime).getTime()
      let now = new Date().getTime()
      if (date > now) {
        return map['YES']
      }
      return map['NO']
    },
    parseIsShelf(row) {
      const map = {
        YES: '上架',
        NO: '下架',
      }
      let dateTime = row.showDate + ' ' + row.showTime
      let date = new Date(dateTime).getTime()
      let now = new Date().getTime()
      if (date > now) {
        return map['YES']
      }
      return map['NO']
    },
    parseFloat(price) {
      return parseFloat(price).toFixed(2)
    },
  },
  data() {
    return {
      shelf: [
        {
          value: 1,
          label: '上架',
        },
        {
          value: 0,
          label: '下架',
        },
      ],
      movieListOptions: [],
      hallListOptions: [],
      scheduleList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        movieName: '',
        hallName: '',
        isShelf: undefined,
        page: 1,
        limit: 20,
      },
      addDialogVisible: false,
      addScheduleForm: {
        movieId: undefined,
        hallName: '',
        publicDate: '',
        showDate: '',
        showTime: '',
      },
      addScheduleFormRules: {
        movieId: [{ required: true, message: '请输入电影名', trigger: 'blur' }],
        hallName: [
          { required: true, message: '请输入影厅名', trigger: 'blur' },
        ],
        showDate: [
          { required: true, message: '请输入放映日期', trigger: 'blur' },
        ],
        showTime: [
          { required: true, message: '请输入放映时间', trigger: 'blur' },
        ],
      },
      datePickerOptions: {
        disabledDate: this.disabledDate,
      },
    }
  },
  created() {
    this.getScheduletList()
    this.getHallList()
  },
  methods: {
    disabledDate(time) {
      if (this.addScheduleForm.movieId) {
        if (new Date(this.addScheduleForm.publicDate) - new Date() > 0) {
          return time.getTime() < (new Date(this.addScheduleForm.publicDate).getTime() - 24 * 60 * 60 * 1000)
        } else {
          return time.getTime() < new Date()
        }
      } else {
        return time.getTime() > 0
      }
    },
    getScheduletList() {
      this.listLoading = true
      if (this.listQuery.movieName !== '')
        this.listQuery.movieName = this.listQuery.movieName.trim()
      if (this.listQuery.hallName !== '')
        this.listQuery.hallName = this.listQuery.hallName.trim()
      fetchScheduleList(filterEmpty(this.listQuery)).then((response) => {
        this.scheduleList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getHallList() {
      fetchHallList().then((response) => {
        if (!response.data) return
        this.hallListOptions = response.data
      })
    },
    addScheduleByStore() {
      this.$refs.addScheduleFormRef.validate(async (valid) => {
        if (!valid) return
        addScheduleByStore(this.addScheduleForm)
          .then((response) => {
            this.$message.success('添加场次成功')
            this.addDialogVisible = false
            this.addScheduleForm.movieId = undefined
            this.addScheduleForm.hallName = ''
            this.addScheduleForm.publicDate = ''
            this.addScheduleForm.showDate = ''
            this.addScheduleForm.showTime = ''
            this.getScheduletList()
          })
          .catch((err) => {
            this.$message.error('添加场次失败')
            this.addDialogVisible = false
          })
      })
    },
    async removeScheduleByStore(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该场次, 是否继续?',
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
      removeScheduleByStore({ scheduleId: id })
        .then((response) => {
          this.$message.success('删除场次成功')
          this.getScheduletList()
        })
        .catch((err) => {
          this.$message.error('删除场次失败')
        })
    },
    changeMovie(id) {
      this.movieListOptions.forEach((v) => {
        if (v.id === id) this.addScheduleForm.publicDate = v.publicDate
      })
    },
    getRemoteScheduleList(query) {
      fetchMovieByStore({ name: query }).then((response) => {
        if (!response.data) return
        this.movieListOptions = response.data
      })
    },
  },
}
</script>

<style scoped></style>
