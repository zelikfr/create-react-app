import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import config from 'config/api'
import authActions from 'reducers/auth/actions'
import { withRouter } from 'react-router-dom'

const withAPI = ComposedComponent => {
    class WithAPI extends Component {
        constructor(props) {
            super(props)
            this.getOptions = this.getOptions.bind(this)
            this.call = this.call.bind(this)
            this.multipleCalls = this.multipleCalls.bind(this)
            const CancelToken = axios.CancelToken
            this.request = CancelToken.source()
        }
        componentWillUnmount() {
            this.request.cancel()
        }
        getOptions(opts) {
            const options = {
                ...opts,
                method: opts.method,
                url: `${config.apiUrl}/${opts.url}`,
                cancelToken: this.request.token,
                headers: {
                    ...(opts.headers || {}),
                },
            }
            if (this.props.access_token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${this.props.access_token}`,
                }
            }
            return options
        }
        handleError(err, error, prevQuery) {
            // if (err.response && err.response.data && err.response.data.error === 'invalid_token') {
            //     axios.request({
            //         method: 'POST',
            //         url: `${config.apiUrl}/oauth/token`,
            //         auth: {
            //             username: config.clientId,
            //             password: config.clientSecret,
            //         },
            //         data: {
            //             grant_type: 'refresh_token',
            //             refresh_token: this.props.refresh_token,
            //         },
            //     })
            //         .then((res) => {
            //             if (res.data.access_token) {
            //                 this.props.login(res.data)
            //                 prevQuery.type === 'call'
            //                     ? this.call(prevQuery.query, prevQuery.success, prevQuery.error)
            //                     : this.multipleCalls(prevQuery.queries, prevQuery.success, prevQuery.error)
            //             }
            //         })
            //         .catch((err) => {
            //             if (err.response && err.response.data && err.response.data.error === 'invalid_token') {
            //                 this.props.history.replace('/logout')
            //             }
            //         })
            // }
            if (!axios.isCancel(err) && error) {
                error(err)
            }
        }
        multipleCalls(queries, success, error) {
            const queriesOpts = queries.map(q => axios(this.getOptions(q)))
            axios.all(queriesOpts)
                .then(axios.spread(success))
                .catch((err) => this.handleError(err, error, { type: 'multipleCalls', queries, success, error }))
        }
        call(query, success, error) {
            axios.request(this.getOptions(query))
                .then((res) => success(res))
                .catch((err) => this.handleError(err, error, { type: 'call', query, success, error }))
        }
        render() {
            const props = { ...this.props }
            delete props.login
            return <ComposedComponent {...props} call={this.call} multipleCalls={this.multipleCalls} />
        }
    }

    WithAPI.propTypes = {
        refresh_token: PropTypes.string,
        access_token: PropTypes.string,
    }
    const mapStateToProps = ({ auth: { access_token, refresh_token } }) => ({
        access_token,
        refresh_token,
    })
    return withRouter(connect(mapStateToProps, { login: authActions.login })(WithAPI))
}

export default withAPI
