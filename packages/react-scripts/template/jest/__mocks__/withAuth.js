import React, { Component, createContext } from 'react'

const withAuth = () => (ComposedComponent) => {
  class WithAuth extends Component {
    render () {
      return <ComposedComponent {...this.props} />
    }
  }
  return WithAuth
}
export const AuthContext = createContext()

export default withAuth
