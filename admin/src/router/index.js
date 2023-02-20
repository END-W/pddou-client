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
      roles: ['SUPERADMIN', 'ADMIN', 'STORE'],
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
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested',
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: {
          title: 'Menu1',
        },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: {
              title: 'Menu1-1',
            },
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: {
              title: 'Menu1-2',
            },
            children: [
              {
                path: 'menu1-2-1',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: {
                  title: 'Menu1-2-1',
                },
              },
              {
                path: 'menu1-2-2',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: {
                  title: 'Menu1-2-2',
                },
              },
            ],
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: {
              title: 'Menu1-3',
            },
          },
        ],
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: {
          title: 'menu2',
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
