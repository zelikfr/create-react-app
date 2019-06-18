import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withAPI from '../../hocs/withAPI'

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
                this.setState({ users: res.data, loading: false})
            },
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
                            <li>{user.first_name}</li>    
                        ))}
                    </ul>
                </div>}
            </div>
        )
    }
}

Home.propTypes = {
    call: PropTypes.func,
}

export default withAPI(Home)