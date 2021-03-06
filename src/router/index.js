import {canTurnTo, getToken, setTitle, setToken} from '@/libs/util'
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import config from '@/config'

const MAIN_PATH = config.homeName
const LOGIN_PATH = 'login'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({replace: true, name: 'error_401'}) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {

  iView.LoadingBar.start()
  const token = getToken()

  if (!token) {
    if (to.name === LOGIN_PATH) {
      next() // 跳转
    } else {
      next({
        name: LOGIN_PATH // 跳转到登录页
      })
    }
  } else {
    if (to.name === LOGIN_PATH) {
      // 已登录且要跳转的页面是登录页
      next({
        name: MAIN_PATH // 跳转到homeName页
      })
    } else {
      // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，
      // 如：['super_admin'] ['super_admin', 'admin']
      if (store.state.user.hasGetInfo) {
        turnTo(to, store.state.user.access, next)
      } else {
        store.dispatch('handleUserInfo').then(user => {
          turnTo(to, user.access, next)
        }).catch(() => {
          setToken('')
          next({
            name: 'login'
          })
        })
      }
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
