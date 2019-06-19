import React from 'react'
import { mount } from 'enzyme'
import withAPI from '../withAPI.js'
import axios from 'axios'

const Component = () => (
  <div></div>
)

describe('withAPI', () => {
  it('should create a withAPI instance with props', () => {
    // When I render the withAPI element
    const HocComponent = withAPI(Component)
    const component = mount(<HocComponent />)
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
  it('should unmount a withAPI instance', () => {
    // When I render the withAPI element
    const HocComponent = withAPI(Component)
    const component = mount(<HocComponent />, { selector: 'WithAPI' })
    const spyCancel = jest.spyOn(component.instance().request, 'cancel')
    component.unmount()
    // Then I should have the component to match the snapshot.
    expect(spyCancel).toHaveBeenCalled()
  })
  it('should success axios call', done => {
    // When I render the withAPI element and do a call
    const HocComponent = withAPI(Component)
    const component = mount(<HocComponent />, { selector: 'WithAPI' })
    const succ = jest.fn()
    const err = jest.fn()
    const promise = Promise.resolve({ data: 'myData' })
    const spyCreate = jest.spyOn(axios, 'request').and.callFake(() => promise)
    component.instance().call({ method: 'GET', url: 'api/endpoint' }, succ, err)
    // Then spyCreate is called and success callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => {
      expect(succ).toHaveBeenCalledWith('myData')
      done()
    })
  })
  it('should fail axios call', done => {
    // When I render the withAPI element and fail a call
    const HocComponent = withAPI(Component)
    const component = mount(<HocComponent />, { selector: 'WithAPI' })
    const succ = jest.fn()
    const err = jest.fn()
    const rejectValue = { error: 'error' }
    const promise = Promise.reject(rejectValue)
    const handleError = jest.spyOn(component.instance(), 'handleError')
    const spyCreate = jest.spyOn(axios, 'request').and.callFake(() => promise)
    component.instance().call({ method: 'GET', url: 'api/endpoint' }, succ, err)
    expect(spyCreate).toHaveBeenCalled()
    // Then spyCreate is called and error callback is called too
    promise.then(() => { }).catch(() => {
      expect(handleError).toHaveBeenCalled()
      done()
    })
  })
  it('should success axios multiplecall', done => {
    // When I render the withAPI element and do a multiple call
    const HocComponent = withAPI(Component)
    const component = mount(<HocComponent />, { selector: 'WithAPI' })
    const succ = jest.fn()
    const err = jest.fn()
    const promise = Promise.resolve({ data: 'myData' })
    const spyCreate = jest.spyOn(axios, 'all').and.callFake(() => promise)
    component.instance().multipleCalls([{ method: 'GET', url: 'api/endpoint' }, { method: 'GET', url: 'api/endpoint2' }], succ, err)
    // Then spyCreate is called and success callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => {
      expect(succ).toHaveBeenCalled()
      done()
    })
  })
  it('should fail axios multiplecall', done => {
    // When I render the withAPI element and fail a multiple calls
    const HocComponent = withAPI(Component)
    const component = mount(<HocComponent />, { selector: 'WithAPI' })
    const succ = jest.fn()
    const err = jest.fn()
    const rejectValue = { error: 'error' }
    const promise = Promise.reject(rejectValue)
    const handleError = jest.spyOn(component.instance(), 'handleError')
    const spyCreate = jest.spyOn(axios, 'all').and.callFake(() => promise)
    component.instance().multipleCalls([{ method: 'GET', url: 'api/endpoint' }, { method: 'GET', url: 'api/endpoint2' }], succ, err)
    // Then spyCreate is called and error callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => { }).catch(() => {
      expect(handleError).toHaveBeenCalled()
      done()
    })
  })
  it('should fail axios call without error cb', done => {
    // When I render the withAPI element and fail a call
    const HocComponent = withAPI(Component)
    const component = mount(<HocComponent />, { selector: 'WithAPI' })
    const succ = jest.fn()
    const rejectValue = { error: 'invalid_token' }
    const promise = Promise.reject(rejectValue)
    const handleError = jest.spyOn(component.instance(), 'handleError').and.callThrough()
    const spyCreate = jest.spyOn(axios, 'request').and.callFake(() => promise)
    component.instance().call({ method: 'GET', url: 'api/endpoint' }, succ)
    // Then spyCreate is called and error callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => { }).catch(() => {
      expect(handleError).toHaveBeenCalled()
      done()
    })
  })
  // it('should test handleError method expired token', done => {
  //     // When I render the withAPI element and given expired token
  //     const HocComponent = withAPI(Component)
  //     const replace = jest.fn()
  //     const component = mount(<HocComponent />, { selector: 'WithAPI' })
  //     const resError = { response: { data: { error: 'invalid_token' } } }
  //     const promise = Promise.reject(resError)
  //     jest.spyOn(axios, 'request').and.callFake(() => promise)
  //     const err = jest.fn()
  //     const prevQuery = { query: { method: 'GET', url: 'api/endpoint' }, type: 'call' }
  //     component.setProps({ history: { replace } })
  //     component.instance().handleError(resError, err, prevQuery)
  //     // Then replace is called
  //     promise.then(() => { }).catch(() => {
  //         expect(replace).toHaveBeenCalledWith('/logout')
  //         done()
  //     })
  // })
  // it('should test handleError method expired token no response', done => {
  //     // When I render the withAPI element error and fail call
  //     const HocComponent = withAPI(Component)
  //     const replace = jest.fn()
  //     const component = mount(<HocComponent />, { selector: 'WithAPI' })
  //     const resError = { response: { data: { error: 'invalid_token' } } }
  //     const rejectValue = { response: { data: {} } }
  //     const promise = Promise.reject(rejectValue)
  //     jest.spyOn(axios, 'request').and.callFake(() => promise)
  //     const err = jest.fn()
  //     const prevQuery = { query: { method: 'GET', url: 'api/endpoint' }, type: 'call' }
  //     component.setProps({ history: { replace } })
  //     component.instance().handleError(resError, err, prevQuery)
  //     // Then replace is not called
  //     promise.then(() => { }).catch(() => {
  //         expect(replace).not.toHaveBeenCalled()
  //         done()
  //     })
  // })
  // it('should test handleError method', done => {
  //     // When I render the withAPI element
  //     const HocComponent = withAPI(Component)
  //     const login = jest.fn()
  //     const component = mount(<HocComponent />, { selector: 'WithAPI' })
  //     const resError = { response: { data: { error: 'invalid_token' } } }
  //     const resSucc = { data: { access_token: 'myToken' } }
  //     const promise = Promise.resolve(resSucc)
  //     jest.spyOn(axios, 'request').and.callFake(() => promise)
  //     const err = jest.fn()
  //     const spyCall = jest.spyOn(component.instance(), 'call')
  //     const prevQuery = { query: { method: 'GET', url: 'api/endpoint' }, type: 'call' }
  //     component.setProps({ login })
  //     component.instance().handleError(resError, err, prevQuery)
  //     // Then login and spyCall are called
  //     promise.then(() => {
  //         expect(login).toHaveBeenCalledWith(resSucc.data)
  //         expect(spyCall).toHaveBeenCalled()
  //         done()
  //     })
  // })
  it('should test handleError method no new access_token provided', done => {
    // When I render the withAPI element
    const HocComponent = withAPI(Component)
    const login = jest.fn()
    const component = mount(<HocComponent />, { selector: 'WithAPI' })
    const resError = { response: { data: { error: 'invalid_token' } } }
    const resSucc = { data: {} }
    const promise = Promise.resolve(resSucc)
    jest.spyOn(axios, 'request').and.callFake(() => promise)
    const err = jest.fn()
    const spyCall = jest.spyOn(component.instance(), 'call')
    const prevQuery = { query: { method: 'GET', url: 'api/endpoint' }, type: 'call' }
    component.setProps({ login })
    component.instance().handleError(resError, err, prevQuery)
    // Then login and spyCall are not called
    promise.then(() => {
      expect(login).not.toHaveBeenCalled()
      expect(spyCall).not.toHaveBeenCalled()
      done()
    })
  })
  // it('should test handleError method multiple', done => {
  //     // When I render the withAPI element
  //     const HocComponent = withAPI(Component)
  //     const login = jest.fn()
  //     const component = mount(<HocComponent />, { selector: 'WithAPI' })
  //     const resError = { response: { data: { error: 'invalid_token' } } }
  //     const resSucc = { data: { access_token: 'myToken' } }
  //     const promise = Promise.resolve(resSucc)
  //     jest.spyOn(axios, 'request').and.callFake(() => promise)
  //     const err = jest.fn()
  //     const spyMultiple = jest.spyOn(component.instance(), 'multipleCalls')
  //     const prevQuery = { queries: [{ method: 'GET', url: 'api/endpoint' }], type: 'multipleCalls' }
  //     component.setProps({ login })
  //     component.instance().handleError(resError, err, prevQuery)
  //     // Then login and multiple are called
  //     promise.then(() => {
  //         expect(login).toHaveBeenCalledWith(resSucc.data)
  //         expect(spyMultiple).toHaveBeenCalled()
  //         done()
  //     })
  // })
  // it('should test getOptions', () => {
  //     const HocComponent = withAPI(Component)
  //     const component = mount(<HocComponent />, { selector: 'WithAPI' })
  //     const opts = {
  //         method: 'POST',
  //         url: 'api/endpoint',
  //     }
  //     component.setProps({ access_token: 'token' })
  //     const options = component.instance().getOptions(opts)
  //     // avoid test cancelToken
  //     delete options.cancelToken
  //     expect(options).toEqual({
  //         method: 'POST',
  //         url: config.apiUrl + '/' + opts.url,
  //         headers: {
  //             'Accept-Language': 'en-EN',
  //             Authorization: 'Bearer token',
  //         },
  //     })
  // })
})
