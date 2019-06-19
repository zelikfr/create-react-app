import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withAPI from '../../hocs/withAPI'
import Button from 'components/Button'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      users: [],
    }
  }
  componentDidMount () {
    this.props.call(
      {
        method: 'get',
        url: 'users',
      },
      res => {
        this.setState({ users: res.data, loading: false })
      }
    )
  }
  render () {
    const { loading, users } = this.state
    return (
      <div>
        <h1>Hello world</h1>
        {loading && <span>Loading...</span>}
        {!loading && <div>
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.first_name}</li>
            ))}
          </ul>
        </div>}
        <Button onClick={() => this.props.setAuthenticated(false)}>Logout</Button>
      </div>
    )
  }
}

Home.propTypes = {
  call: PropTypes.func,
  setAuthenticated: PropTypes.func,
}

export default withAPI(Home)
