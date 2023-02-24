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
              @clear="getOrdertList"
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
              @clear="getOrdertList"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="4"
          v-if="'SUPERADMIN' === roles[0] || 'ADMIN' === roles[0]"
        >
          <el-form-item>
            <el-input
              placeholder="请输入影院"
              v-model="listQuery.cinemaName"
              clearable
              @clear="getOrdertList"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-input
              placeholder="请输入订单号"
              v-model="listQuery.orderNum"
              clearable
              @clear="getOrdertList"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-select
              v-model="listQuery.payType"
              clearable
              @clear="getOrdertList"
              placeholder="请选择支付类型"
            >
              <el-option
                v-for="item in payTypes"
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
            <el-button type="primary" @click="getOrdertList">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="orderList"
      border
      fit
      style="width: 100%"
    >
      <el-table-column type="index" width="60px" align="center" label="ID">
      </el-table-column>

      <el-table-column min-width="140px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="电影名">
        <template slot-scope="scope">
          <span>{{ scope.row.movieName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="'SUPERADMIN' === roles[0] || 'ADMIN' === roles[0]"
        min-width="200px"
        align="center"
        label="影院"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.cinemaName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="影厅">
        <template slot-scope="scope">
          <span>{{ scope.row.hallName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="订单号">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNum }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="下单日期">
        <template slot-scope="scope">
          <span>{{ scope.row.orderDate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="票数">
        <template slot-scope="scope">
          <span>{{ scope.row.ticketNum }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="总票价">
        <template slot-scope="scope">
          <span>{{ scope.row.ticketTotalPrice | parseFloat }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="取票码">
        <template slot-scope="scope">
          <span>{{ scope.row.ticketCode }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="支付类型">
        <template slot-scope="{ row }">
          <el-tag :type="row.payType | payTypeFilter">
            {{ row.payType | parsepayType }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        v-if="'STORE' === roles[0] || 'STAFF' === roles[0]"
        min-width="160px"
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="'NO_PAID' !== scope.row.payType"
            type="danger"
            size="mini"
            @click.stop.prevent="removeOrderByStore(scope.row.id)"
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
      @pagination="getOrdertList"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchOrderList, removeOrderByStore } from '@/api/order'
import { filterEmpty } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'OrderList',
  components: { Pagination },
  filters: {
    payTypeFilter(payType) {
      const payTypeMap = {
        NO_PAID: 'warning',
        PAID: 'success',
        FAILED: 'danger',
        RETURN: '',
      }
      return payTypeMap[payType]
    },
    parsepayType(payType) {
      const payTypeMap = {
        NO_PAID: '未支付',
        PAID: '已支付',
        FAILED: '支付失败',
        RETURN: '退票',
      }
      return payTypeMap[payType]
    },
    parseFloat(price) {
      return parseFloat(price).toFixed(2)
    },
  },
  data() {
    return {
      payTypes: [
        {
          value: 'NO_PAID',
          label: '未支付',
        },
        {
          value: 'PAID',
          label: '已支付',
        },
        {
          value: 'FAILED',
          label: '支付失败',
        },
        {
          value: 'RETURN',
          label: '退票',
        },
      ],
      orderList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        username: '',
        movieName: '',
        cinemaName: '',
        orderNum: '',
        userType: '',
        payType: undefined,
        page: 1,
        limit: 20,
      },
    }
  },
  computed: {
    ...mapGetters(['roles']),
  },
  created() {
    this.getOrdertList()
  },
  methods: {
    getOrdertList() {
      this.listLoading = true
      if (this.listQuery.username !== '')
        this.listQuery.username = this.listQuery.username.trim()
      if (this.listQuery.movieName !== '')
        this.listQuery.movieName = this.listQuery.movieName.trim()
      if (this.listQuery.cinemaName !== '')
        this.listQuery.cinemaName = this.listQuery.cinemaName.trim()
      if (this.listQuery.orderNum !== '')
        this.listQuery.orderNum = this.listQuery.orderNum.trim()
      this.listQuery.userType = this.roles[0]
      fetchOrderList(filterEmpty(this.listQuery)).then((response) => {
        this.orderList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    async removeOrderByStore(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该订单, 是否继续?',
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
      removeOrderByStore({ orderId: id })
        .then((response) => {
          this.$message.success('删除订单成功')
          this.getOrdertList()
        })
        .catch((err) => {
          this.$message.error('删除订单失败')
        })
    },
  },
}
</script>

<style scoped></style>
