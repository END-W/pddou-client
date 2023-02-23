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
      <el-col :span="4" v-if="'ADMIN' !== roles[0]">
        <el-button type="primary" @click="addDialogVisible = true"
          >添加员工</el-button
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
          <span>{{ scope.row.gender | parseGender }}</span>
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
        label="角色类型"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.userType | userTypeFilter">
            {{ row.userType }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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

    <!-- 添加员工的对话框 -->
    <el-dialog title="添加员工" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-form
        :model="addEmployeeForm"
        ref="addEmployeeFormRef"
        :rules="addEmployeeFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addEmployeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addEmployeeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addEmployeeForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addEmployeeForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="addEmployeeForm.gender"
            placeholder="请选择性别"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>默认密码：123456</span>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEmployee">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改员工的对话框 -->
    <el-dialog
      title="修改员工信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editEmployeeForm"
        ref="editEmployeeFormRef"
        :rules="editEmployeeFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editEmployeeForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editEmployeeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editEmployeeForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editEmployeeForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="editEmployeeForm.gender"
            placeholder="请选择性别"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEmployee">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  fetchEmployeeList,
  addEmployee,
  editEmployee,
  removeEmployee,
  employeeStateChanged,
} from '@/api/employee'
import { filterEmpty } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import md5 from 'js-md5'
import { validEmail, validPhone } from '@/utils/validate'

export default {
  name: 'EmployeeList',
  components: { Pagination },
  filters: {
    parseGender(gender) {
      const genderMap = {
        MALE: '男',
        FEMALE: '女',
        SECRET: '保密'
      }
      return genderMap[gender]
    },
    typeFilter(status) {
      const statusMap = {
        ADMINISTRATION: '',
        MERCHANT: 'success'
      }
      return statusMap[status]
    },
    userTypeFilter(status) {
      const statusMap = {
        ADMIN: 'danger',
        STORE: 'warning',
        STAFF: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机格式'))
      } else {
        callback()
      }
    }
    return {
      options: [
        {
          value: 'MALE',
          label: '男',
        },
        {
          value: 'FEMALE',
          label: '女',
        },
        {
          value: 'SECRET',
          label: '保密'
        }
      ],
      employeeList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        username: '',
        phone: '',
        page: 1,
        limit: 20
      },
      addDialogVisible: false,
      addEmployeeForm: {
        username: '',
        password: '123456',
        name: '',
        email: '',
        phone: '',
        gender: 'SECRET',
        userType: ''
      },
      addEmployeeFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '用户名的长度在3～12个字',
            trigger: 'blur'
          }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editEmployeeForm: {
        id: '',
        userName: '',
        name: '',
        email: '',
        phone: '',
        gender: ''
      },
      editEmployeeFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    getEmployeeList() {
      this.listLoading = true
      if (this.listQuery.username !== '') this.listQuery.username = this.listQuery.username.trim()
      if (this.listQuery.phone !== '') this.listQuery.phone = this.listQuery.phone.trim()
      fetchEmployeeList(filterEmpty(this.listQuery)).then((response) => {
        this.employeeList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    employeeStateChanged(row) {
      employeeStateChanged({ employeeId: row.id, locked: row.locked })
        .then((response) => {})
        .catch((err) => {
          row.locked = !row.locked
        })
    },
    addEmployee() {
      this.$refs.addEmployeeFormRef.validate(async (valid) => {
        if (!valid) return
        this.addEmployeeForm.password = md5(this.addEmployeeForm.password)
        this.addEmployeeForm.userType = this.roles[0]
        addEmployee(this.addEmployeeForm).then((response) => {
          this.$message.success('添加员工成功')
          this.addDialogVisible = false
          this.getEmployeeList()
        }).catch((err) => {
          this.$message.error('添加员工失败')
          this.addDialogVisible = false
        })
      })
    },
    showEditDialog(row) {
      this.editEmployeeForm.id = row.id
      this.editEmployeeForm.userName = row.username
      this.editEmployeeForm.name = row.name
      this.editEmployeeForm.email = row.email
      this.editEmployeeForm.phone = row.phone
      this.editEmployeeForm.gender = row.gender
      this.editDialogVisible  = true
    },
    editEmployee() {
      this.$refs.editEmployeeFormRef.validate(async (valid) => {
        if (!valid) return
        editEmployee(this.editEmployeeForm).then((response) => {
          this.$message.success('更新员工信息成功')
          this.editDialogVisible = false
          this.getEmployeeList()
        }).catch((err) => {
          this.$message.error('更新员工信息失败')
          this.editDialogVisible = false
        })
      })
    },
    async removeEmployee(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该员工, 是否继续?',
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
      removeEmployee({ employeeId: id }).then((response) => {
        this.$message.success('删除员工成功')
        this.getEmployeeList()
      }).catch((err) => {
        this.$message.success('删除员工失败')
      })
    }
  }
}
</script>

<style scoped>
</style>
