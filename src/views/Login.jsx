import React from 'react'
// import { withRouter } from 'react-router-dom'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import logo from '#/images/logo.png'

@inject(stores => {
  const {login: { checkCodeSrc }} = stores
  return {
    vcodeSrc: checkCodeSrc,
    getSession: title => stores.login.getSession(),
    loginHandle: (name, pswd, code) => stores.login.validateLogin(name, pswd, code)
  }
})

@observer
// @withRouter
export default class LoginView extends React.Component {
  @observable userName = 'admin'
  @observable pswd = '123456'
  @observable vcode = ''

  reloadCode () {
    this.props.getSession()
  }

  componentWillMount () {
    this.reloadCode()
  }

  @action
  handlePswdChange = e => {
    this.pswd = e.target.value.trim()
  }

  @action
  handleNameChange = e => {
    this.userName = e.target.value.trim()
  }

  @action
  handleCodeChange = e => {
    this.vcode = e.target.value.trim()
  }

  handleSubmit () {
    if (!this.userName) {
      alert('请输入用户名！')
    } else if (!this.pswd) {
      alert('请输入登录密码！')
    } else if (!this.vcode) {
      alert('请输入验证码！')
    } else {
      this.props.loginHandle(this.userName, this.pswd, this.vcode)
    }
  }

  render () {
    return (
      <div className='page-login'>
        <img alt='logo' src={logo} />
        <input
          placeholder='请输入用户名'
          name='userName'
          defaultValue={this.userName}
          onChange={this.handleNameChange}
          ref={node => { this.userNameInput = node }}
        />
        <input
          placeholder='请输入密码'
          type='password'
          name='pswd'
          defaultValue={this.pswd}
          onChange={this.handlePswdChange}
          ref={node => { this.pswdInput = node }}
        />
        <input
          placeholder='请输入验证码'
          name='vcode'
          onChange={this.handleCodeChange}
        />
        <div style={{ width: '86px', height: '28px', backgroundColor: '#ccc' }} onClick={e => this.reloadCode()}>
          <img src={this.props.vcodeSrc} />
        </div>
        <button onClick={e => this.handleSubmit()}>立即登录</button>
      </div>
    )
  }
}
