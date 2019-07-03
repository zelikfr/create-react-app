import React from 'react'
import { mount } from 'enzyme'
import withAPI from '../withAPI.js'
import axios from 'axios'
import { AuthContext } from 'hocs/withAuth'

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
    const component = mount(<AuthContext.Provider value={{ isAuthenticated: false, login: () => jest.fn(), logout: () => jest.fn(), renewRefreshToken: () => jest.fn() }}><HocComponent /></AuthContext.Provider>, { selector: 'WithAPI' })
    const spyCancel = spyOn(component.instance().request, 'cancel')
    component.unmount()
    // Then I should have the component to match the snapshot.
    expect(spyCancel).toHaveBeenCalled()
  })
  it('should success axios call', done => {
    // When I render the withAPI element and do a call
    const HocComponent = withAPI(Component)
    const component = mount(<AuthContext.Provider value={{ isAuthenticated: false, login: () => jest.fn(), logout: () => jest.fn(), renewRefreshToken: () => jest.fn() }}><HocComponent /></AuthContext.Provider>, { selector: 'WithAPI' })
    const succ = jest.fn()
    const err = jest.fn()
    const promise = Promise.resolve({ data: 'myData' })
    const spyCreate = spyOn(axios, 'request').and.callFake(() => promise)
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
    const component = mount(<AuthContext.Provider value={{ isAuthenticated: false, login: () => jest.fn(), logout: () => jest.fn(), renewRefreshToken: () => jest.fn() }}><HocComponent /></AuthContext.Provider>, { selector: 'WithAPI' })
    const succ = jest.fn()
    const err = jest.fn()
    const rejectValue = { error: 'error' }
    const promise = Promise.reject(rejectValue)
    const handleError = spyOn(component.instance(), 'handleError')
    const spyCreate = spyOn(axios, 'request').and.callFake(() => promise)
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
    const component = mount(<AuthContext.Provider value={{ isAuthenticated: false, login: () => jest.fn(), logout: () => jest.fn(), renewRefreshToken: () => jest.fn() }}><HocComponent /></AuthContext.Provider>, { selector: 'WithAPI' })
    const succ = jest.fn()
    const err = jest.fn()
    const promise = Promise.resolve({ data: 'myData' })
    const spyCreate = spyOn(axios, 'all').and.callFake(() => promise)
    component.instance().multipleCalls([{ method: 'GET', url: 'api/endpoint' }, { method: 'GET', url: 'api/endpoint2' }], succ, err)
    // Then spyCreate is called and success callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => {
      expect(succ).toHaveBeenCalled()
      done()
    })
  })
  it('should call axios multiplecall with Expired token', done => {
    // When I render the withAPI element and do a multiple call
    const HocComponent = withAPI(Component)
    const component = mount(<AuthContext.Provider value={{ isAuthenticated: false, login: () => jest.fn(), logout: () => jest.fn(), renewRefreshToken: () => false }}><HocComponent /></AuthContext.Provider>, { selector: 'WithAPI' })
    const succ = jest.fn()
    const err = jest.fn()
    const promise = Promise.resolve({ data: 'myData' })
    const spyCreate = spyOn(axios, 'all').and.callFake(() => promise)
    component.instance().multipleCalls([{ method: 'GET', url: 'api/endpoint' }, { method: 'GET', url: 'api/endpoint2' }], succ, err)
    // Then spyCreate is called and success callback is called too
    expect(spyCreate).not.toHaveBeenCalled()
    promise.then(() => {
      expect(succ).not.toHaveBeenCalled()
      done()
    })
  })
  it('should fail axios multiplecall', done => {
    // When I render the withAPI element and fail a multiple calls
    const HocComponent = withAPI(Component)
    const component = mount(<AuthContext.Provider value={{ isAuthenticated: false, login: () => jest.fn(), logout: () => jest.fn(), renewRefreshToken: () => jest.fn() }}><HocComponent /></AuthContext.Provider>, { selector: 'WithAPI' })
    const succ = jest.fn()
    const err = jest.fn()
    const rejectValue = { error: 'error' }
    const promise = Promise.reject(rejectValue)
    const handleError = spyOn(component.instance(), 'handleError')
    const spyCreate = spyOn(axios, 'all').and.callFake(() => promise)
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
    const component = mount(<AuthContext.Provider value={{ isAuthenticated: false, login: () => jest.fn(), logout: () => jest.fn(), renewRefreshToken: () => jest.fn() }}><HocComponent /></AuthContext.Provider>, { selector: 'WithAPI' })
    const succ = jest.fn()
    const rejectValue = { error: 'invalid_token' }
    const promise = Promise.reject(rejectValue)
    const handleError = spyOn(component.instance(), 'handleError').and.callThrough()
    const spyCreate = spyOn(axios, 'request').and.callFake(() => promise)
    component.instance().call({ method: 'GET', url: 'api/endpoint' }, succ)
    // Then spyCreate is called and error callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => { }).catch(() => {
      expect(handleError).toHaveBeenCalled()
      done()
    })
  })
  it('should test handleError method no new access_token provided', done => {
    // When I render the withAPI element
    const HocComponent = withAPI(Component)
    const login = jest.fn()
    const component = mount(<AuthContext.Provider value={{ isAuthenticated: false, login: () => jest.fn(), logout: () => jest.fn(), renewRefreshToken: () => jest.fn() }}><HocComponent /></AuthContext.Provider>, { selector: 'WithAPI' })
    const resError = { response: { data: { error: 'invalid_token' } } }
    const resSucc = { data: {} }
    const promise = Promise.resolve(resSucc)
    spyOn(axios, 'request').and.callFake(() => promise)
    const err = jest.fn()
    const spyCall = spyOn(component.instance(), 'call')
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
})
