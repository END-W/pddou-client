<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <el-button
          v-loading="loading"
          style="margin-left: 10px"
          type="success"
          @click="submitForm"
        >
          添加电影
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item
              style="margin-bottom: 40px"
              prop="name"
              label-width="70px"
              label="电影名:"
            >
              <el-input
                v-model="postForm.name"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="请输入内容"
              />
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
										prop="director"
                    label-width="60px"
                    label="导演:"
                    class="postInfo-container-item"
                  >
                    <el-input
                      v-model="postForm.director"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item
										prop="publicDate"
                    label-width="120px"
                    label="上映时间:"
                    class="postInfo-container-item"
                  >
                    <el-date-picker
                      v-model="postForm.publicDate"
                      type="date"
                      format="yyyy 年 MM 月 dd 日"
											value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
										prop="actor"
                    label-width="90px"
                    label="主演:"
                    class="postInfo-container-item"
                  >
                    <el-input
                      v-model="postForm.actor"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="9">
                  <el-form-item
										prop="language"
                    label-width="60px"
                    label="语言:"
                    class="postInfo-container-item"
                  >
                    <el-select
                      v-model="postForm.language"
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

                <el-col :span="9">
                  <el-form-item
										prop="type"
                    label-width="75px"
                    label="类型:"
                    class="postInfo-container-item"
                  >
                    <el-select v-model="postForm.type" placeholder="请选择类型">
                      <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
										prop="movieLong"
                    label-width="90px"
                    label="片长:"
                    class="postInfo-container-item"
                  >
                    <el-input
                      v-model="postForm.movieLong"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item prop="intro" style="margin-bottom: 30px" label="简介">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 10 }"
            placeholder="请输入内容"
            v-model="postForm.intro"
          >
          </el-input>
        </el-form-item>

        <el-form-item prop="poster" style="margin-bottom: 30px"> </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
// import Upload from '@/components/Upload/SingleImage3'
import Sticky from '@/components/Sticky' // 粘性header组件

const defaultForm = {
  name: '', // 电影名
  poster: '', // 电影海报
  director: '', // 导演
  actor: '', // 主演
  movieLong: '', // 电影片长
  language: '', // 电影语言版本
  intro: '', // 电影简介
  type: '', // 电影类型
  publicDate: '', // 电影上映时间
  status: 'draft',
  id: undefined,
}

export default {
  name: 'MovieDetail',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error',
        })
        callback(new Error(rule.field + '为必传项'))
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
      types: [
        {
          value: '动漫',
          label: '动漫',
        },
        {
          value: '言情',
          label: '言情',
        },
        {
          value: '科幻',
          label: '科幻',
        },
        {
          value: '喜剧',
          label: '喜剧',
        },
        {
          value: '爱情',
          label: '爱情',
        },
        {
          value: '剧情',
          label: '剧情',
        },
        {
          value: '动作',
          label: '动作',
        },
        {
          value: '冒险',
          label: '冒险',
        },
        {
          value: '青春',
          label: '青春',
        },
        {
          value: '悬疑',
          label: '悬疑',
        },
        {
          value: '恐怖',
          label: '恐怖',
        },
        {
          value: '其它',
          label: '其它',
        },
      ],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        poster: [{ validator: validateRequire }],
        name: [{ validator: validateRequire }],
        director: [{ validator: validateRequire }],
        actor: [{ validator: validateRequire }],
        movieLong: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }],
        intro: [{ validator: validateRequire }],
        type: [{ validator: validateRequire }],
        publicDate: [{ validator: validateRequire }]
      },
      tempRoute: {},
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
        // fetchArticle(id).then(response => {
        //   this.postForm = response.data
        //   // just for test
        //   this.postForm.title += `   Article Id:${this.postForm.id}`
        //   this.postForm.content_short += `   Article Id:${this.postForm.id}`
        //   // set tagsview title
        //   this.setTagsViewTitle()
        //   // set page title
        //   this.setPageTitle()
        // }).catch(err => {
        //   console.log(err)
        // })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`,
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '添加电影成功',
            type: 'success',
            duration: 2000,
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
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

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
