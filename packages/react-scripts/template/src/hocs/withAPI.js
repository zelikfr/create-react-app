import React, { Component } from 'react'
import axios from 'axios'
import config from 'config'

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
            // if (this.props.access_token) {
            //     options.headers = {
            //         ...options.headers,
            //         Authorization: `Bearer ${this.props.access_token}`,
            //     }
            // }
            return options
        }
        handleError(err, error, prevQuery) {
            if (!axios.isCancel(err) && error) {
                error(err)
            }
        }
        multipleCalls(queries, success, error) {
            const queriesOpts = queries.map(q => axios(this.getOptions(q)))
            const customSpread = function () {
                success(...[...arguments].map(d => d.data))
            }
            axios.all(queriesOpts)
                .then(axios.spread(customSpread))
                .catch((err) => this.handleError(err, error, { type: 'multipleCalls', queries, success, error }))
        }
        call(query, success, error) {
            axios.request(this.getOptions(query))
                .then((res) => success(res.data))
                .catch((err) => this.handleError(err, error, { type: 'call', query, success, error }))
        }
        render() {
            return <ComposedComponent {...this.props} call={this.call} multipleCalls={this.multipleCalls} />
        }
    }
    return WithAPI
}

export default withAPI
