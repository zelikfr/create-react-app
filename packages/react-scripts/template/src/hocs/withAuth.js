import React, { Component, createContext } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import withAPI from './withAPI'

const AuthContext = createContext()

const withAuth = (opts) => (ComposedComponent) => {
  const options = {
    redirectUri: '/',
    accessRestriction: 'any',
    ...opts,
  }
  class WithAuth extends Component {
    render () {
      const props = { ...this.props }
      return (
        <AuthContext.Consumer>
          {({ isAuthenticated, setAuthenticated }) => {
            if ((isAuthenticated && options.accessRestriction === 'notLogged') ||
              (!isAuthenticated && options.accessRestriction === 'logged')) {
              return <Redirect to={options.redirectUri} />
            }
            return <ComposedComponent {...props} setAuthenticated={setAuthenticated} />
          }}
        </AuthContext.Consumer>
      )
    }
  }

  return WithAuth
}

class AuthProviderComponent extends Component {
  state = {
    isLoading: false,
    isAuthenticated: false,
  }
  // async componentDidMount() {
  //     this._isMounted = true
  //     this.props.call(
  //         {
  //             method: 'GET',
  //             url: 'login',
  //         },
  //         () => {
  //             if (this._isMounted) {
  //                 this.setState({ isLoading: false, isAuthenticated: true })
  //             }
  //         },
  //         () => {
  //             if (this._isMounted) {
  //                 this.setState({ isLoading: false, isAuthenticated: false })
  //             }
  //         },
  //     )
  // }
  componentWillUnmount () {
    this._isMounted = false
  }
  setAuthenticated(isAuthenticated) {
    this.setState({ isAuthenticated })
  }
  render () {
    const { isLoading, isAuthenticated } = this.state
    if (isLoading) {
      return null
    }
    const props = { ...this.props }
    delete props.call
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          setAuthenticated: (isAuth) => this.setAuthenticated(isAuth),
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

AuthProviderComponent.propTypes = {
  call: PropTypes.func,
  children: PropTypes.any,
}

export const AuthProvider = withAPI(AuthProviderComponent)

export default withAuth
