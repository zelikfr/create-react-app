import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'

class Login extends Component {
  state = { }
  render () {
    return (
      <div>
        <h1>Login</h1>
        {this.state.alert && <span>{this.state.alert.message}</span>}
        <Button onClick={() => this.props.login('Jean_F6@yopmail.com', 'Password*1')}>Login to this website</Button>
      </div>
    )
  }
}

Login.propTypes = {
  login: PropTypes.func,
}

export default Login
