import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'

class Login extends Component {
  render () {
    return (
      <div>
        <h1>Login</h1>
        <Button onClick={() => this.props.login('Jean_F6@yopmail.com', 'Password*1')}>Login to this website</Button>
      </div>
    )
  }
}

Login.propTypes = {
  login: PropTypes.func,
}

export default Login
