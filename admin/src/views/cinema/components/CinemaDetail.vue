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
                      :disabled="isEdit"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
                    prop="phone"
                    label-width="90px"
                    label="联系电话:"
                    class="postInfo-container-item"
                    style="width: 90%"
                  >
                    <el-input
                      v-model="postForm.phone"
                      placeholder="请输入内容"
                      :disabled="isEdit"
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
                id="tipinput"
                placeholder="请输入内容"
                v-model="postForm.specifiedAddress"
                @keyup.enter.native="search"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="main">
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
import { validPhone } from '@/utils/validate'

// 设置安全密钥
window._AMapSecurityConfig = {
  securityJsCode: 'e54c7a18b8ed50190762e33196885c57',
}

const defaultForm = {
  cinemaName: '', // 影院名
  cinemaPhone: '', // 影院电话
  province: null, // 省份
  city: null, // 城市
  specifiedAddress: '', // 详细地址
  legalPerson: '', // 法定代表人
  phone: '',
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
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机格式'))
      } else {
        callback()
      }
    }
    const validateTelPhone = (rule, value, callback) => {
      if (!/^0\d{2,3}-\d{7,8}$/.test(value)) {
        callback(new Error('请输入格式如:010-22222222'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        cinemaName: [
          { required: true, message: '请输入影院名', trigger: 'blur' },
        ],
        cinemaPhone: [
          { required: true, message: '请输入影院电话', trigger: 'blur' },
          { validator: validateTelPhone, trigger: 'blur' },
        ],
        specifiedAddress: [
          { required: true, message: '请输入详情地址', trigger: 'blur' },
        ],
        legalPerson: [
          { required: true, message: '请输入法定代表人', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
        ],
      },
      status: 'draft',
      AMap: null,
      map: null,
      placeSearch: null,
      geocoder: null,
      pois: [],
    }
  },
  mounted() {
    this.initAMap()
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
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
          if (!this.isEdit) {
            this.loadAMap()
          }
        })
        .catch((e) => {
          console.log('高德地图加载错误', e)
        })
    },
    loadAMap(options) {
      this.map = new this.AMap.Map('container', {
        center: options,
        viewMode: '3D', //  是否为3D地图模式
        zoom: 13, // 初始化地图级别
        resizeEnable: true,
      })
      getLocation(this.AMap, this.map, this.isEdit)
      this.geocoder = new this.AMap.Geocoder()
      // let auto = new AMap.AutoComplete({
      //   input: 'tipinput',
      // })
      this.placeSearch = placeSearch(this.AMap, this.map)
      // 注册监听，当选中某条记录时会触发
      // auto.on('select', this.select)
      if (this.isEdit) {
        this.map.clearMap()
        let marker = new this.AMap.Marker({
          map: this.map,
          position: options,
        })
        // 设置地图层级
        this.map.setZoom(15)
        // 构建自定义信息窗体
        let infoWindow = new this.AMap.InfoWindow({
          anchor: 'top-center',
          content: '标记点',
        })
        infoWindow.open(this.map, options)
      }
    },
    select(e) {
      this.placeSearch.setCity(e.poi.adcode)
      // 关键字查询查询
      this.placeSearch.search(e.poi.name)
    },
    search() {
      if (!this.postForm.specifiedAddress) return
      this.placeSearch.search(
        this.postForm.specifiedAddress,
        (status, result) => {
          console.log(result)
          this.pois = result.poiList.pois
          if (result.info === 'OK') {
            let lis = document.querySelectorAll('#list li')
            for (let i = 0; i < lis.length; i++) {
              let that = this
              console.log(that.postForm)
              lis[i].onclick = function () {
                let j = i
                that.getAddress(j)
              }
            }
          }
        }
      )
    },
    getAddress(i) {
      let data = this.pois[i]
      this.postForm.province = data.pname
      this.postForm.city = data.cityname
      this.postForm.specifiedAddress = data.adname + data.address
      this.postForm.lng = data.location.lng
      this.postForm.lat = data.location.lat
      // let cc = this.map.getCenter()
      // return new Promise((resolve, reject) => {
      //   this.geocoder.getAddress([cc.lng, cc.lat], (status, result) => {
      //     if (result.info === 'OK') {
      //       resolve(result)
      //     } else {
      //       resolve('')
      //     }
      //   })
      // })
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
      this.$refs.postForm.validate((valid) => {
        if (valid && this.status !== 'published') {
          this.postForm.cinemaName = this.postForm.cinemaName.trim()
          this.postForm.cinemaPhone = this.postForm.cinemaPhone.trim()
          this.postForm.legalPerson = this.postForm.legalPerson.trim()
          this.postForm.phone = this.postForm.phone.trim()
          this.loading = true
          console.log(this.postForm)
          if (this.postForm.id == undefined) {
            addCinema(this.postForm)
              .then((response) => {
                this.$notify({
                  title: '成功',
                  message: '添加影院成功',
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
            let cc = this.map.getCenter()
            if (
              !(cc.lng === this.postForm.lng && cc.lat === this.postForm.lat)
            ) {
              editCinema(this.postForm)
                .then((response) => {
                  this.$notify({
                    title: '成功',
                    message: '编辑影院成功',
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
              this.loading = false
            }
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

  .list {
    position: absolute;
    top: 10px;
    right: 20px;
    height: 300px;
    width: 240px;
    z-index: 999;
    overflow-y: auto;

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
