<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar ' + status">
        <el-button
          v-loading="loading"
          style="margin-left: 10px"
          type="success"
          @click="submitForm"
        >
          发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item
              style="margin-bottom: 40px"
              prop="cinemaName"
              label-width="70px"
              label="影院名:"
            >
              <el-input
                v-model="postForm.cinemaName"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="请输入内容"
              />
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    prop="legalPerson"
                    label-width="100px"
                    label="法定代表人:"
                    class="postInfo-container-item"
                    style="width: 90%"
                  >
                    <el-input
                      v-model="postForm.legalPerson"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
                    prop="cinemaPhone"
                    label-width="90px"
                    label="影院电话:"
                    class="postInfo-container-item"
                    style="width: 90%"
                  >
                    <el-input
                      v-model="postForm.cinemaPhone"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="specifiedAddress"
              label-width="90px"
              style="margin-bottom: 30px"
              label="详细地址:"
            >
              <el-input
                placeholder="请输入内容"
                v-model="postForm.specifiedAddress"
                @input="search"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="main">
      <div class="form">
        <!-- 搜索框 -->
        <input
          id="tipinput"
          class="input"
          type="text"
          v-model="postForm.specifiedAddress"
          @input="search"
        />
      </div>
      <!-- 查询列表，高德地图api绑定id -->
      <div class="list" id="list"></div>
      <!-- 地图，需设置宽高 -->
      <div id="container"></div>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchCinema, addCinema, editCinema } from '@/api/cinema'
import AMapLoader from '@amap/amap-jsapi-loader'
import { getLocation, placeSearch } from '@/utils/map'

// 设置安全密钥
window._AMapSecurityConfig = {
  securityJsCode: 'e54c7a18b8ed50190762e33196885c57',
}

const defaultForm = {
  cinemaName: '', // 影院名
  cinemaPhone: '', // 影院电话
  province: '', // 省份
  city: '', // 城市
  specifiedAddress: '', // 详细地址
  legalPerson: '', // 法定代表人
  lng: null, // 经度
  lat: null, // 纬度
  id: undefined,
}

export default {
  name: 'CinemaDetail',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        cinemaName: [
          { required: true, message: '请输入影院名', trigger: 'blur' },
        ],
        cinemaPhone: [
          { required: true, message: '请输入影院电话', trigger: 'blur' },
        ],
        specifiedAddress: [
          { required: true, message: '请输入详情地址', trigger: 'blur' },
        ],
        legalPerson: [
          { required: true, message: '请输入法定代表人', trigger: 'blur' },
        ],
      },
      status: 'draft',
      AMap: null,
      map: null,
      placeSearch: null,
      geocoder: null,
    }
  },
  mounted() {
    this.initAMap()
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.loadAMap()
    }
  },
  methods: {
    initAMap() {
      AMapLoader.load({
        key: '890e60b02e97f9681d403bbb577284c7',
        version: '2.0',
        plugins: [
          'AMap.PlaceSearch',
          'AMap.Geolocation',
          'AMap.AutoComplete',
          'AMap.Geocoder',
          'AMap.InfoWindow',
          'AMap.Marker',
        ],
      })
        .then((AMap) => {
          this.AMap = AMap
        })
        .catch((e) => {
          console.log('高德地图加载错误', e)
        })
    },
    loadAMap(options) {
      this.map = new AMap.Map('container', {
        center: options,
        viewMode: '3D', //  是否为3D地图模式
        zoom: 13, // 初始化地图级别
        resizeEnable: true,
      })
      this.geocoder = new AMap.Geocoder()
      let auto = new AMap.AutoComplete({
        input: 'tipinput',
      })
      getLocation(AMap, this.map, this.isEdit)
      this.placeSearch = placeSearch(AMap, this.map)
      if (this.isEdit) {
        this.map.clearMap()
        var marker = new AMap.Marker({
          map: this.map,
          position: options,
        })
        // 设置地图层级
        this.map.setZoom(14)
        // 构建自定义信息窗体
        let infoWindow = new this.AMap.InfoWindow({
          anchor: 'top-center',
          content: '标记点',
        })
        console.log(this.map.getCenter())
        infoWindow.open(this.map, options)
      }
    },
    search() {
      if (!this.postForm.specifiedAddress) return
      this.placeSearch.search(
        this.postForm.specifiedAddress,
        (status, result) => {
          console.log(result)
        }
      )
    },
    getAddress() {
      let cc = this.map.getCenter()
      return new Promise((resolve, reject) => {
        this.geocoder.getAddress([cc.lng, cc.lat], (status, result) => {
          if (result.regeocode.formattedAddress) {
            resolve(result.regeocode.formattedAddress)
          } else {
            resolve('')
          }
        })
      })
    },
    fetchData(id) {
      fetchCinema({ cinemaId: id })
        .then((response) => {
          this.postForm = response.data
          let options = [this.postForm.lng, this.postForm.lat]
          this.loadAMap(options)
          // set page title
          this.setPageTitle()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    setPageTitle() {
      const title = '编辑影院'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.getAddress().then((result) => {
        console.log(result)
      })
      return
      this.$refs.postForm.validate((valid) => {
        if (valid && this.status !== 'published') {
          this.loading = true
          if (this.postForm.id == undefined) {
            addCinema(this.postForm)
              .then((response) => {
                this.$notify({
                  title: '成功',
                  message: '添加电影成功',
                  type: 'success',
                  duration: 2000,
                })
                this.status = 'published'
                this.loading = false
              })
              .catch((err) => {
                this.loading = false
              })
          } else {
            editCinema(this.postForm)
              .then((response) => {
                this.$notify({
                  title: '成功',
                  message: '编辑电影成功',
                  type: 'success',
                  duration: 2000,
                })
                this.status = 'published'
                this.loading = false
              })
              .catch((err) => {
                this.loading = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }
}

::v-deep .article-textarea {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.main {
  width: 55%;
  height: 500px;
  margin-left: 50px;
  margin-bottom: 20px;
  position: relative;

  #container {
    width: 100%;
    height: 100%;
  }

  .form {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 999;

    .input {
      width: 240px;
      line-height: 30px;
      padding-left: 5px;
      box-shadow: 0 2px 6px 0 rgb(114 124 245 / 50%);
      outline: none;
      border-radius: 5px;
      border: none;
    }
  }

  .list {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 300px;
    width: 220px;
    z-index: 999;

    .li {
      line-height: 25px;
    }
  }
}

::v-deep .amap_lib_placeSearch {
  min-width: 240px;
  width: 220px;
}
</style>
