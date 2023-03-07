import Vue from 'vue'
import Router from 'vue-router'


const Login = () => import('@/pages/login/index');
import Home from '@/pages/Home/Home'
import SearchAll from '@/pages/Home/children/SearchAll'
import Movie from '@/pages/movie/index'
import SearchMovie from '@/pages/Movie/children/SearchMovie'
import MovieDetail from '@/components/MovieDetail/MovieDetail'
import CommentPanel from '@/components/MovieDetail/children/CommentPanel'
import Cinema from '@/pages/Cinema/Cinema'
import CinemaDetail from '@/components/CinemaDetail/CinemaDetail'
import SearchCinema from '@/pages/Cinema/children/SearchCinema'
import SelectCinema from '@/components/SelectCinema/SelectCinema'
import SelectSeat from '@/components/SelectSeat/SelectSeat'
import SubmitOrder from '@/components/SubmitOrder/SubmitOrder'
import Pay from '@/components/Pay/Pay'
import My from '@/pages/my/index'
import MyInfo from '@/pages/my/children/MyInfo'
import MyOrder from '@/pages/my/children/MyOrder'
import MyMovie from '@/pages/my/children/MyMovie'
import ModifyUserName from '@/pages/my/children/ModifyUserName'
import ModifyUserPhone from '@/pages/my/children/ModifyUserPhone'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: '首页',
        showTabBar: true,
      }
    },
    {
      path: '/movie',
      name: 'movie',
      component: Movie,
      meta: {
        title: '电影',
        showTabBar: true
      }
    },
    {
      path: '/cinema',
      name: 'cinema',
      component: Cinema,
      meta: {
        title: '影院',
        showTabBar: true
      }
    },
    {
      path: '/my',
      name: 'my',
      component: My,
      meta: {
        title: '我的',
        showTabBar: true
      }
    },
    {
      path: '/my_info',
      name: 'my_info',
      component: MyInfo,
      meta: {
        title: '个人信息'
      }
    },
    {
      path: '/my_order',
      name: 'my_order',
      component: MyOrder,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/my_movie',
      name: 'my_movie',
      component: MyMovie,
      meta: {
        title: '我的电影'
      }
    },
    {
      path: '/modify_username',
      name: 'modify_username',
      component: ModifyUserName
    },
    {
      path: '/modify_userphone',
      name: 'modify_userphone',
      component: ModifyUserPhone
    },
    {
      path: '/search_all',
      component: SearchAll
    },
    {
      path: '/search_movie',
      component: SearchMovie
    },
    {
      path: '/movie_detail',
      name: 'movie_detail',
      component: MovieDetail
    },
    {
      path: '/cinema_detail',
      component: CinemaDetail
    },
    {
      path: '/select_cinema',
      component: SelectCinema
    },
    {
      path: '/select_seat',
      component: SelectSeat
    },
    {
      path: '/comment_panel',
      component: CommentPanel
    },
    {
      path: '/search_cinema',
      component: SearchCinema
    },
    {
      path: '/submit_order',
      component: SubmitOrder
    },
    {
      path: '/pay',
      component: Pay
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
  ]
})
