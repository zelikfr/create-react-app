import React, { Component } from 'react'
import axios from 'axios'
import config from 'config'
import { AuthContext } from 'hocs/withAuth'

const withAPI = ComposedComponent => {
  class WithAPI extends Component {
    constructor (props) {
      super(props)
      this.getOptions = this.getOptions.bind(this)
      this.call = this.call.bind(this)
      this.multipleCalls = this.multipleCalls.bind(this)
      const CancelToken = axios.CancelToken
      this.request = CancelToken.source()
    }
    componentWillUnmount () {
      this.request.cancel()
    }
    getOptions (opts) {
      const options = {
        ...opts,
        method: opts.method,
        url: `${opts.apiUrl || config.apiUrl}/${opts.url}`,
        cancelToken: this.request.token,
      }
      return options
    }
    handleError (err, error, prevQuery) {
      if (!axios.isCancel(err) && error) {
        error(err)
      }
    }
    multipleCalls (queries, success, error) {
      const queriesOpts = queries.map(q => axios(this.getOptions(q)))
      const customSpread = function (...args) {
        success(...[...args].map(d => d.data))
      }
      const refreshToken = this.context.renewRefreshToken()
      if (refreshToken) {
        axios.all(queriesOpts)
          .then(axios.spread(customSpread))
          .catch((err) => this.handleError(err, error, { type: 'multipleCalls', queries, success, error }))
      }
    }
    call (query, success, error) {
      const refreshToken = this.context.renewRefreshToken()
      if (refreshToken) {
        axios.request(this.getOptions(query))
          .then((res) => success(res.data))
          .catch((err) => this.handleError(err, error, { type: 'call', query, success, error }))
      }
    }
    render () {
      return <ComposedComponent {...this.props} call={this.call} multipleCalls={this.multipleCalls} />
    }
  }

  WithAPI.contextType = AuthContext

  return WithAPI
}

export default withAPI
