import axios from '@/libs/api.request'

export const postToken = ({principal, credential, verify}) => {
  const data = {
    principal,
    credential,
    verify
  }
  return axios.request({
    url: 'token',
    data,
    method: 'post'
  })
}

export const parseToken = (token) => {
  return axios.request({
    url: 'token',
    headers: {
      'token': token,
    },
    method: 'get'
  })
}

export const deleteToken = (token) => {
  return axios.request({
    url: 'token',
    headers: {
      'token': token,
    },
    method: 'delete'
  })
}

export const verifyCode = ({principal, credential}) => {
  const data = {
    principal,
    credential
  }
  return axios.request({
    url: 'token/code',
    data,
    method: 'post'
  })
}

