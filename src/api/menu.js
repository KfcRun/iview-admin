import axios from '@/libs/api.request'

export const getMenuTree = (token) => {
  return axios.request({
    url: 'menu/tree',
    headers: {
      'token': token,
    },
    method: 'get'
  })
}
