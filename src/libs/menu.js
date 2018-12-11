import {hasChild} from "./util";
import {forEach, hasOneOf, objEqual} from '@/libs/tools'

const showThisMenu = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  }
  return true
}

/**
 * @param {Array} list 过滤菜单列表
 * @returns {Array}
 */
export const canAccessMenu = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenu(item, access)) {
        obj.children = canAccessMenu(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenu(item, access)) res.push(obj)
    }
  })
  return res
}
