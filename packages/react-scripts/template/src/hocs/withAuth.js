import React, { Component, createContext } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import jwtDecode from 'jwt-decode'
import { v4 } from 'uuid'
import axios from 'axios'
import config from 'config'

export const AuthContext = createContext()

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
          {({ isAuthenticated, login, renewRefreshToken, logout }) => {
            if ((isAuthenticated && options.accessRestriction === 'notLogged') ||
              (!isAuthenticated && options.accessRestriction === 'logged')) {
              return <Redirect to={options.redirectUri} />
            }
            return <ComposedComponent {...props} login={login} logout={logout} renewRefreshToken={renewRefreshToken} />
          }}
        </AuthContext.Consumer>
      )
    }
  }

  return WithAuth
}

class AuthProviderComponent extends Component {
  constructor (props) {
    super(props)

    const refreshToken = window.localStorage.getItem('refreshToken')
    const expirationDate = window.localStorage.getItem('expirationDate')
    const userId = window.localStorage.getItem('userId')

    this.request = {}
    this.loginRequest = {}

    this.state = {
      isAuthenticated: !!refreshToken,
      refreshToken,
      expirationDate,
      userId,
    }
  }
  componentDidMount () {
    if (this.state.refreshToken) {
      this.renewRefreshToken()
    }
  }
  componentWillUnmount () {
    this._isMounted = false
    if (this.request.token) {
      this.request.cancel()
    }
    if (this.loginRequest.token) {
      this.loginRequest.cancel()
    }
  }
  authenticateUser (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken)
    const { exp: expirationDate, global_user_id: userId } = jwtDecode(refreshToken)
    window.localStorage.setItem('refreshTokenExpirationDate', expirationDate)
    window.localStorage.setItem('userId', userId)
    this.setState({ isAuthenticated: true, expirationDate, userId })
  }
  logout () {
    window.localStorage.removeItem('refreshToken')
    window.localStorage.removeItem('refreshTokenExpirationDate')
    window.localStorage.removeItem('userId')
    this.setState({
      isAuthenticated: false,
      refreshToken: null,
      expirationDate: null,
      userId: null,
    })
  }
  async login (email, password) {
    if (this.loginRequest.token) {
      this.loginRequest.cancel()
    }
    this.loginRequest = axios.CancelToken.source()
    try {
      const { data: res } = await axios.request(
        {
          url: config.authUrl + '/api.companyusermasterdata.default/command',
          cancelToken: this.loginRequest.token,
          method: 'POST',
          data: {
            '$type': 'TraceOne.Api.CompanyUserMasterData.Default.Messages.Commands.AuthenticateUserCommand, TraceOne.Api.CompanyUserMasterData.Default.Messages',
            'messageId': v4(),
            email,
            password,
          },
        })

      if (res.succeeded) {
        this.authenticateUser(res.refreshToken)
        return true
      }
    } catch (err) {
      return err.error
    }
  }
  shouldRefreshToken (expirationDateToken) {
    return (expirationDateToken - Date.now() / 1000 < 7 * 60)
  }
  async renewRefreshToken () {
    if (this.shouldRefreshToken(this.state.expirationDate)) {
      if (this.request.token) {
        this.request.cancel()
      }
      this.request = axios.CancelToken.source()
      try {
        const { data: res } = await axios.request({
          url: config.authUrl + '/api.companyusermasterdata.default/command',
          method: 'POST',
          cancelToken: this.request.token,
          data: {
            '$type': 'TraceOne.Api.CompanyUserMasterData.Default.Messages.Commands.RenewRefreshTokenCommand, TraceOne.Api.CompanyUserMasterData.Default.Messages',
            'messageId': v4(),
            'RefreshToken': `${this.state.refreshToken}`,
            'UserId': `${this.state.userId}`,
          },
        })

        if (res.succeeded) {
          this.authenticateUser(res.refreshToken)
          return true
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          this.logout()
        }
      }
    }
    return false
  }
  render () {
    const { isAuthenticated } = this.state
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          login: (email, password) => this.login(email, password),
          renewRefreshToken: () => this.renewRefreshToken(),
          logout: () => this.logout(),
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

AuthProviderComponent.propTypes = {
  children: PropTypes.any,
}

export const AuthProvider = (AuthProviderComponent)

export default withAuth
