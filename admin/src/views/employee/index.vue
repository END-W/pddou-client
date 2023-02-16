<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入用户名"
          v-model="listQuery.username"
          clearable
          @clear="getEmployeeList"
        >
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-input
          placeholder="请输入手机号码"
          v-model="listQuery.phone"
          clearable
          @clear="getEmployeeList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getEmployeeList"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="employeeList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="60px" align="center" label="ID">
      </el-table-column>

      <el-table-column width="120px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="'SUPERADMIN' === roles[0]"
        class-name="status-col"
        width="150"
        align="center"
        label="账号类型"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.type | typeFilter">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        v-if="'SUPERADMIN' === roles[0]"
        class-name="status-col"
        width="130"
        align="center"
        label="账号类型"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.userType | userTypeFilter">
            {{ row.userType }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建日期">
        <template slot-scope="scope">
          <span>{{
            scope.row.createTime
          }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.locked"
            @change="employeeStateChanged(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column min-width="140px" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            circle
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button
            v-if="'SUPERADMIN' === roles[0]"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
            @click="removeEmployee(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getEmployeeList"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  fetchEmployeeList,
  removeEmployee,
  employeeStateChanged,
} from '@/api/employee.js'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'EmployeeList',
  components: { Pagination },
  filters: {
    typeFilter(status) {
      const statusMap = {
        ADMINISTRATION: '',
        MERCHANT: 'success',
      }
      return statusMap[status]
    },
    userTypeFilter(status) {
      const statusMap = {
        ADMIN: 'danger',
        STORE: 'warning',
        STAFF: 'info',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      employeeList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        username: '',
        phone: '',
        page: 1,
        limit: 20,
      },
      addDialogVisible: false,
    }
  },
  computed: {
    ...mapGetters(['roles']),
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    getEmployeeList() {
      this.listLoading = true
      fetchEmployeeList(this.listQuery).then((response) => {
        this.employeeList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    employeeStateChanged(row) {
      employeeStateChanged({ employeeId: row.id, locked: row.locked }).then(
        (response) => {
        }
      ).catch((err) => {
				row.locked = !row.locked
			})
    },
    showEditDialog(row) {},
    async removeEmployee(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该车队, 是否继续?',
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
      removeEmployee({ employeeId: id }).then((response) => {
        this.$message.success('删除员工成功')
        this.getEmployeeList()
      })
    },
  },
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
