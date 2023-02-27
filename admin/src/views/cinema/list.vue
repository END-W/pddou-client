<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item>
            <el-input
              placeholder="请输入影院名"
              v-model="listQuery.cinemaName"
              clearable
              @clear="getCinematList"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-select
              v-model="listQuery.isExamine"
              clearable
              @clear="getCinematList"
              placeholder="请选择审核状态"
            >
              <el-option
                v-for="item in examine"
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
              v-model="listQuery.isBlock"
              clearable
              @clear="getCinematList"
              placeholder="请选择拉黑/未拉黑"
            >
              <el-option
                v-for="item in block"
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
            <el-button type="primary" @click="getCinematList">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="cinemaList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="60px" align="center" label="ID">
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="影院名">
        <template slot-scope="scope">
          <span>{{ scope.row.cinemaName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="影院电话">
        <template slot-scope="scope">
          <span>{{ scope.row.cinemaPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="市级">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="详细地址">
        <template slot-scope="scope">
          <span>{{ scope.row.specifiedAddress }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="法定代表人">
        <template slot-scope="scope">
          <span>{{ scope.row.legalPerson }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="审核状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.isExamine | isExamineFilter">
            {{ row.isExamine | parseIsExamine }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="70px" align="center" label="拉黑">
        <template slot-scope="{ row }">
          <el-tag :type="row.isBlock | isBlockFilter">
            {{ row.isBlock | parseIsBlock }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="审核人">
        <template slot-scope="scope">
          <span>{{ scope.row.checkPerson | parseCheckPerson }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="审核时间">
        <template slot-scope="scope">
          <span>{{ scope.row.checkTime | parseCheckTime }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" fixed="right" label="操作">
        <template slot-scope="scope">
          <router-link :to="'/cinema/edit/' + scope.row.id">
            <el-button type="primary" size="mini" style="margin-right: 10px"> 编辑 </el-button>
          </router-link>
          <el-button
            v-if="'ON_ACTIVITY' !== scope.row.isExamine"
            type="danger"
            size="mini"
            @click="showExamine(scope.row.id)"
          >
            审核
          </el-button>
          <el-button
            v-if="!scope.row.isBlock"
            type="danger"
            size="mini"
            @click="blockCinema(scope.row.id)"
          >
            拉黑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getCinematList"
    />

    <el-dialog title="审核" :visible.sync="examineDialogVisible" width="25%">
      <el-form
        :model="examineForm"
        ref="examineFormRef"
        :rules="examineFormRules"
        label-width="100px"
      >
        <el-form-item label-width="70px" label="审核" prop="isExamine">
          <el-select
            v-model="examineForm.isExamine"
            placeholder="请选择审核状态"
          >
            <el-option
              v-for="item in examineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="examineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="examineCinema">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCinemaList, examineCinema, blockCinema } from '@/api/cinema'
import { filterEmpty } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'CinemaList',
  components: { Pagination },
  filters: {
    isExamineFilter(isExamine) {
      const examineMap = {
        HAVING_APPLY: 'warning',
        FAIL: 'danger',
        ON_ACTIVITY: 'success',
      }
      return examineMap[isExamine]
    },
    parseIsExamine(isExamine) {
      const examineMap = {
        HAVING_APPLY: '审核中',
        FAIL: '失败',
        ON_ACTIVITY: '通过',
      }
      return examineMap[isExamine]
    },
    isBlockFilter(isBlock) {
      const blockMap = {
        YES: 'danger',
        NO: 'success',
      }
      if (isBlock) {
        return blockMap['YES']
      }
      return blockMap['NO']
    },
    parseIsBlock(isBlock) {
      const blockMap = {
        YES: '是',
        NO: '否',
      }
      if (isBlock) {
        return blockMap['YES']
      }
      return blockMap['NO']
    },
    parseCheckPerson(checkPerson) {
      if (checkPerson === null || checkPerson === '') {
        return '暂无'
      }
      return checkPerson
    },
    parseCheckTime(checkTime) {
      if (checkTime === null || checkTime === '') {
        return '暂无'
      }
      return checkTime
    },
  },
  data() {
    return {
      examine: [
        {
          value: 'HAVING_APPLY',
          label: '审核中',
        },
        {
          value: 'FAIL',
          label: '失败',
        },
        {
          value: 'ON_ACTIVITY',
          label: '通过',
        },
      ],
      block: [
        {
          value: 1,
          label: '拉黑',
        },
        {
          value: 0,
          label: '未拉黑',
        },
      ],
      examineOptions: [
        {
          value: 'ON_ACTIVITY',
          label: '通过',
        },
        {
          value: 'FAIL',
          label: '失败',
        },
      ],
      map: null,
      cinemaList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        cinemaName: '',
        isExamine: undefined,
        isBlock: undefined,
        page: 1,
        limit: 20,
      },
      examineDialogVisible: false,
      examineForm: {
        id: undefined,
        isExamine: '',
      },
      examineFormRules: {
        isExamine: [
          { required: true, message: '请选择审核状态', trigger: 'blur' },
        ],
      },
      datePickerOptions: {
        disabledDate: this.disabledDate,
      },
    }
  },
  created() {
    this.getCinematList()
  },
  methods: {
    getCinematList() {
      this.listLoading = true
      if (this.listQuery.cinemaName !== '')
        this.listQuery.cinemaName = this.listQuery.cinemaName.trim()
      fetchCinemaList(filterEmpty(this.listQuery)).then((response) => {
        this.cinemaList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    showExamine(id) {
      this.examineForm.id = id
      this.examineDialogVisible = true
    },
    examineCinema() {
      this.$refs.examineFormRef.validate(async (valid) => {
        if (!valid) return
        examineCinema(this.examineForm)
          .then((response) => {
            this.examineDialogVisible = false
            this.$message.success('审核成功')
            this.getCinematList()
          })
          .catch((err) => {
            this.$message.error('审核失败')
          })
      })
    },
    async blockCinema(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久拉黑该影院, 是否继续?',
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
      blockCinema({ cinemaId: id })
        .then((response) => {
          this.$message.success('拉黑影院成功')
          this.getCinematList()
        })
        .catch((err) => {
          this.$message.error('拉黑影院失败')
        })
    },
  },
}
</script>

<style scoped></style>
