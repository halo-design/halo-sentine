import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

@observer
export default class LazyLoader extends React.Component {
  @observable model = null

  componentWillMount () {
    this.load(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  @action
  load (props) {
    this.model = null
    props.load(comp => {
      this.model = comp.default ? comp.default : comp
    })
  }

  render () {
    return this.props.children(this.model)
  }
}
