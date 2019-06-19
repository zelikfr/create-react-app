import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withAPI from 'hocs/withAPI'
import Button from 'components/Button'

class Login extends Component {
  state = {}
  handleLogin () {
    this.props.call(
      {
        method: 'post',
        url: 'login',
        data: {
          username: 'hello',
          password: 'ad',
        },
      },
      res => {
        this.props.setAuthenticated(true)
      },
      res => {
        this.setState({ alert: { type: 'error', message: res.error } })
      }
    )
  }
  render () {
    return (
      <div>
        <h1>Login</h1>
        {this.state.alert && <span>{this.state.alert.message}</span>}
        <Button onClick={() => this.handleLogin()}>Login to this website</Button>
      </div>
    )
  }
}

Login.propTypes = {
  call: PropTypes.func,
  setAuthenticated: PropTypes.func,
}

export default withAPI(Login)
