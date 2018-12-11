import {
  beforeClose,
  getBreadCrumbList,
  getHomeRoute,
  getNextRoute,
  getRouteTitleHandled,
  getTagNavListFromLocalstorage,
  getToken,
  localRead,
  localSave,
  routeEqual,
  routeHasExist,
  setTagNavListInLocalstorage,
  setToken
} from '@/libs/util'

import {canAccessMenu} from '@/libs/menu'

import routers from '@/router/routers'
import router from '@/router'
import config from '@/config'

import {saveErrorLogger} from '@/api/data'

import {getMenuTree} from '@/api/menu'

const {homeName} = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    menuList: [],
    hasMenu: false,
    hasReadErrorPage: false
  },
  getters: {
    menuList: state => state.menuList,
    errorCount: state => state.errorList.length,
  },
  mutations: {
    setMenuData(state, list) {
      state.menuList = list
    },

    setHasMenu(state, status) {
      state.hasMenu = status
    },
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList(state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag(state, {route, type = 'unshift'}) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal(state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError(state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {
    addErrorLog({commit, rootState}, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const {user: {token, userId, userName}} = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    },
    // 获取菜单
    setMenuToken({commit, state, rootState}) {

      return new Promise((resolve, reject) => {
        getMenuTree(getToken()).then((res) => {
          // todo 方式一  由接口处理菜单数据
          console.log(res.data)
          //commit("setMenuData", showAccessMenu(res.data.data.rows, rootState.user.access))
          // todo 方式二  加载routers内路由信息，生成菜单数据
          commit("setMenuData", canAccessMenu(routers, rootState.user.access))
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
