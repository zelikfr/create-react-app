import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import withAuth, { AuthProvider } from 'hocs/withAuth'

class Routes extends Component {
  render() {
    return (
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={withAuth({ redirectUri: '/login', accessRestriction: 'logged' })(Home)} />
            <Route path="/login" component={withAuth({
              redirectUri: '/',
              accessRestriction: 'notLogged',
            })(Login)} />
          </Switch>
        </AuthProvider>
      </Router>
    )
  }
}

export default Routes
