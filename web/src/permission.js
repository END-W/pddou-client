import router from './router'
import getPageTitle from '@/common/utils/get-page-title'

router.beforeEach(async(to, from, next) => {
  
    // set page title
    document.title = getPageTitle(to.meta.title)

    next()
  })