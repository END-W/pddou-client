import router from './router'
import getPageTitle from '@/common/utils/get-page-title'

router.beforeEach((to, from, next) => {

  // set page title
  document.title = getPageTitle(to.meta.title)

  next()
})

router.afterEach((to,from,next) => {
  window.scrollTo(0,0)
})
