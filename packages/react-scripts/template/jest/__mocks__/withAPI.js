import React, { Component } from 'react'

const withAPI = ComposedComponent => {
  class WithAPI extends Component {
    render () {
      return <ComposedComponent {...this.props} />
    }
  }
  return WithAPI
}

export default withAPI
