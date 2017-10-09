import qs from 'qs'
import axios from 'axios'
import { getCookie, setCookie } from './cookie'
import { serverRootPath, routeRootPath, routeLoginPath } from '~/constants/config'

const Axios = axios.create({
  baseURL: '/' + serverRootPath,
  timeout: 10000,
  responseType: 'json',
  withCredentials: true
})

Axios.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    config.data = qs.stringify(config.data)
  }
  const date = new Date()
  const channelDate = date.getFullYear() + (date.getMonth() + 1) + date.getDate()
  const channelTime = date.getHours() + date.getMinutes() + date.getSeconds()
  const transId = `AT${Date.now()}`
  let headers = {
    type: 'K',
    encry: '0',
    channel: 'AT',
    transId: transId,
    channelFlow: transId,
    transCode: config.url.replace(/(.*\/)*([^.]+).*/ig, '$2'),
    channelDate: channelDate,
    channelTime: channelTime,
    iCIFID: getCookie('iCIFID') || '',
    eCIFID: getCookie('eCIFID') || '',
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
  config.headers = headers
  return config
}, err => {
  alert(err)
  return Promise.reject(err)
})

Axios.interceptors.response.use(res => {
  const { status, data } = res
  const { header, body } = data
  const { errorCode } = body
  header.iCIFID ? setCookie('iCIFID', header.iCIFID) : setCookie('iCIFID', body.iCIFID)
  if (errorCode !== '0') {
    alert(`请求失败！[${errorCode}]`)
    window.location.replace(routeRootPath + routeLoginPath)
  }
  switch (status) {
    case 403:
      alert('错误403')
      return null

    case 404:
      alert('错误404')
      return null

    case 500:
      alert('错误500')
      return null

    case 502:
      alert('错误502')
      return null

    default:
      return res
  }
}, err => {
  alert('数据请求发生错误，请检查网络！')
  return Promise.reject(err)
})

export default Axios
