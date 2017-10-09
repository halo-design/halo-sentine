import React from 'react'
import { inject } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import { routeLoginPath, routeIndexPath } from '~/constants/config'

@inject(stores => {
  const {login: { isLogin }} = stores
  return {
    isLogin
  }
})

export default class MismatchView extends React.Component {
  render () {
    const { isLogin } = this.props
    return <Redirect to={isLogin ? routeIndexPath : routeLoginPath} />
  }
}
