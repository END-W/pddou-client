<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item>
            <el-input
              placeholder="请输入影厅名称"
              v-model="listQuery.name"
              clearable
              @clear="getHallList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getHallList"
              ></el-button>
            </el-input>
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
      :data="hallList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="80px" align="center" label="ID">
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="影厅名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
            @click="removeHallByStore(scope.row.id)"
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

    <el-dialog title="添加影厅" :visible.sync="addDialogVisible" width="25%">
      <el-form
        :model="addHallForm"
        ref="addHallFormRef"
        :rules="addHallFormRules"
        label-width="100px"
      >
        <el-form-item label-width="80px" label="影厅名称" prop="name">
          <el-input v-model="addHallForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addHallByStore">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改影厅信息" :visible.sync="editDialogVisible" width="25%">
      <el-form
        :model="editHallForm"
        ref="editHallFormRef"
        :rules="editHallFormRules"
        label-width="80px"
      >
        <el-form-item label="影厅名称" prop="name">
          <el-input v-model="editHallForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editHallByStore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchHallListByStore,
  addHallByStore,
  editHallByStore,
  removeHallByStore,
} from '@/api/hall'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'HallListByStore',
  components: { Pagination },
  data() {
    return {
      hallList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        page: 1,
        limit: 20,
      },
      addDialogVisible: false,
      addHallForm: {
        name: ''
      },
      addHallFormRules: {
        name: [{ required: true, message: '请输入影厅名称', trigger: 'blur' }],
      },
      editDialogVisible: false,
      editHallForm: {
        id: '',
        name: 0,
      },
      editHallFormRules: {
        name: [{ required: true, message: '请输入影厅名称', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getHallList()
  },
  methods: {
    getHallList() {
      this.listLoading = true
      if (this.listQuery.name != null && this.listQuery.name !== '')
        this.listQuery.name = this.listQuery.name.trim()
      fetchHallListByStore(this.listQuery).then((response) => {
        this.hallList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    addHallByStore() {
      this.$refs.addHallFormRef.validate(async (valid) => {
        if (!valid) return
        this.addHallForm.name = this.addHallForm.name.trim()
        addHallByStore(this.addHallForm)
          .then((response) => {
            this.$message.success('添加影厅成功')
            this.addDialogVisible = false
            this.addHallForm.name = ''
            this.getHallList()
          })
          .catch((err) => {
            this.$message.error('添加影厅失败')
            this.addDialogVisible = false
          })
      })
    },
    showEditDialog(row) {
      this.editHallForm.id = row.id
      this.editHallForm.name = row.name
      this.editDialogVisible = true
    },
    editHallByStore() {
      this.$refs.editHallFormRef.validate(async (valid) => {
        if (!valid) return
        this.editHallForm.name = this.editHallForm.name.trim()
        editHallByStore(this.editHallForm)
          .then((response) => {
            this.$message.success('更新影厅信息成功')
            this.editDialogVisible = false
            this.getHallList()
          })
          .catch((err) => {
            this.$message.error('更新影厅信息失败')
            this.editDialogVisible = false
          })
      })
    },
    async removeHallByStore(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该影厅, 是否继续?',
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
      removeHallByStore({ id: id })
        .then((response) => {
          this.$message.success('删除影厅成功')
          this.getHallList()
        })
        .catch((err) => {
          this.$message.success('删除影厅成功')
        })
    },
  },
}
</script>

<style scoped></style>
