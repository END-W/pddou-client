import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: {
          title: '首页',
          icon: 'dashboard',
        },
      },
    ],
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    alwaysShow: true,
    name: 'User',
    meta: {
      title: '用户管理',
      icon: 'user',
      roles: ['SUPERADMIN', 'ADMIN'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'UserList',
        meta: {
          title: '用户列表',
          icon: 'list',
        },
      },
    ],
  },

  {
    path: '/employee',
    component: Layout,
    redirect: '/employee/index',
    alwaysShow: true,
    name: 'Employee',
    meta: {
      title: '员工管理',
      icon: 'employee',
      roles: ['ADMIN', 'STORE'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/employee/index'),
        name: 'EmployeeList',
        meta: {
          title: '员工列表',
          icon: 'list',
        },
      },
    ],
  },

  {
    path: '/movie',
    component: Layout,
    redirect: '/movie/list',
    alwaysShow: true,
    name: 'Movie',
    meta: {
      title: '电影管理',
      icon: 'movie',
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/movie/create'),
        name: 'CreateMovie',
        meta: {
          title: '添加电影',
          icon: 'edit',
          roles: ['SUPERADMIN', 'ADMIN'],
        },
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/movie/edit'),
        name: 'EditMovie',
        meta: {
          title: '编辑电影',
          roles: ['SUPERADMIN', 'ADMIN'],
          noCache: true,
          activeMenu: '/movie/list',
        },
        hidden: true,
      },
      {
        path: 'list',
        component: () => import('@/views/movie/list'),
        name: 'MovieList',
        meta: {
          title: '电影列表',
          icon: 'list',
          roles: ['SUPERADMIN', 'ADMIN'],
        },
      },
      {
        path: 'list-store',
        component: () => import('@/views/movie/list-store'),
        name: 'MovieListByStore',
        meta: {
          title: '电影列表',
          icon: 'list',
          roles: ['STORE', 'STAFF'],
        },
      },
    ],
  },

  {
    path: '/cinema',
    component: Layout,
    redirect: '/cinema/list',
    alwaysShow: true,
    name: 'Cinema',
    meta: {
      title: '影院管理',
      icon: 'cinema',
      roles: ['SUPERADMIN', 'ADMIN'],
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/cinema/create'),
        name: 'CreateCinema',
        meta: {
          title: '添加影院',
          icon: 'edit',
        },
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/cinema/edit'),
        name: 'EditCinema',
        meta: {
          title: '编辑影院',
          noCache: true,
          activeMenu: '/cinema/list',
        },
        hidden: true,
      },
      {
        path: 'list',
        component: () => import('@/views/cinema/list'),
        name: 'CinemaList',
        meta: {
          title: '影院列表',
          icon: 'list',
        },
      },
    ],
  },

  {
    path: '/hall',
    component: Layout,
    redirect: '/hall/index',
    alwaysShow: true,
    name: 'Hall',
    meta: {
      title: '影厅管理',
      icon: 'hall',
      roles: ['STORE', 'STAFF'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/hall/index'),
        name: 'HallListByStore',
        meta: {
          title: '影厅列表',
          icon: 'list',
        },
      },
    ],
  },

  {
    path: '/schedule',
    component: Layout,
    redirect: '/schedule/index',
    alwaysShow: true,
    name: 'Schedule',
    meta: {
      title: '场次管理',
      icon: 'schedule',
      roles: ['STORE', 'STAFF'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/schedule/index'),
        name: 'ScheduleListByStore',
        meta: {
          title: '场次列表',
          icon: 'list',
        },
      },
    ],
  },

  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/index',
    alwaysShow: true,
    name: 'Comment',
    meta: {
      title: '评论管理',
      icon: 'comment',
      roles: ['SUPERADMIN', 'ADMIN'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/comment/index'),
        name: 'CommentList',
        meta: {
          title: '评论列表',
          icon: 'list',
        },
      },
    ],
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    alwaysShow: true,
    name: 'Order',
    meta: {
      title: '订单管理',
      icon: 'order',
      roles: ['SUPERADMIN', 'ADMIN', 'STORE', 'STAFF'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: 'OrderList',
        meta: {
          title: '订单列表',
          icon: 'list',
        },
      },
    ],
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
    alwaysShow: true,
    name: 'System',
    meta: {
      title: '系统设置',
      icon: 'system',
      roles: ['SUPERADMIN'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/employee/index'),
        name: 'EmployeeList',
        meta: {
          title: '员工列表',
          icon: 'list',
        },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
