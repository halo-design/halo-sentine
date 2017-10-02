import React from 'react'

export default class LazyLoader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      model: null
    }
  }

  componentWillMount () {
    this.load(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load (props) {
    this.setState({
      model: null
    })
    props.load(model => {
      this.setState({
        model: model.default ? model.default : model
      })
    })
  }

  render () {
    return this.props.children(this.state.model)
  }
}
