import { observable, action } from 'mobx'
import Axios from '~/utils/requester'
import api from '~/constants/api'
import { serverRootPath } from '~/constants/config'
import { delCookies, setCookie } from '~/utils/cookie'
import md5 from 'md5'

export default class LoginModel {
  @observable isLogin = false
  @observable iCIFID = ''
  @observable cstname = ''
  @observable failedTime = ''
  @observable checkCodeSrc = ''

  @action
  loginHandle (cstname) {
    this.isLogin = true
    this.cstname = cstname
    this.failedTime = ''
  }

  @action
  logoutHandle () {
    this.isLogin = false
  }

  @action
  loginFailHandle () {
    this.isLogin = false
    this.failedTime = Date.now()
  }

  @action
  setSession (iCIFID) {
    this.iCIFID = iCIFID
    this.checkCodeSrc = `/${serverRootPath}/${api.GET_CHECKCODE_URL}?nocache=${Date.now()}&iCIFID=${iCIFID}`
  }

  @action
  async getSession () {
    delCookies(['cstName', 'iCIFID', 'eCIFID'])
    const res = await Axios({
      method: 'post',
      url: api.GET_SESSION
    })
    const { data: { header, body } } = res
    const id = header.iCIFID ? header.iCIFID : body.iCIFID
    setCookie('iCIFID', id)
    this.setSession(id)
  }

  @action
  async validateLogin (name, pswd, code) {
    const res = await Axios({
      method: 'post',
      url: api.SET_LOGIN,
      data: {
        loginName: name,
        loginPassword: md5(pswd.toString()),
        validateCodeText: code
      }
    })
    const { data: { body: { result, cstNo, cstName, errorMsg } } } = res
    if (result === '1') {
      setCookie('eCIFID', cstNo)
      setCookie('cstName', cstName)
      this.loginHandle(cstName)
      alert('登录成功！')
    } else {
      errorMsg ? alert(errorMsg) : alert('登录信息有误！')
      this.loginFailHandle()
      this.getSession()
    }
  }
}
