import React from 'react'
import { mount } from 'enzyme'
import withAPI from '../withAPI.js'
import axios from 'axios'
import { AuthContext } from 'hocs/withAuth'

const Component = () => (
  <div></div>
)

describe('withAPI', () => {
  it('should create a component wrapped with withAPI', () => {
    // When I render the withAPI element
    const HocComponent = withAPI(Component)
    const component = mount(<HocComponent />)
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
  it('should unmount a component wrapped with withAPI', () => {
    const HocComponent = withAPI(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => jest.fn(),
        }}
      >
        <HocComponent />
      </AuthContext.Provider>,
      { selector: 'WithAPI' }
    )
    const spyCancel = jest.spyOn(component.instance().request, 'cancel')
    // When I unmount the withAPI element
    component.unmount()
    // Then cancel the request
    expect(spyCancel).toHaveBeenCalled()
  })
  it('should call call method with correct token and correct call', done => {
    // When I render the withAPI element and do a call
    const HocComponent = withAPI(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => jest.fn(),
        }}
      >
        <HocComponent />
      </AuthContext.Provider>,
      { selector: 'WithAPI' }
    )
    const succ = jest.fn()
    const err = jest.fn()
    const promise = Promise.resolve({ data: 'myData' })
    const spyCreate = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    component.instance().call({ method: 'GET', url: 'api/endpoint' }, succ, err)
    // Then spyCreate is called and success callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => {
      expect(succ).toHaveBeenCalledWith('myData')
      spyCreate.mockRestore()
      done()
    })
  })
  it('should call call method with correct token and bad call', done => {
    // When I render the withAPI element and do a call
    const HocComponent = withAPI(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => jest.fn(),
        }}
      >
        <HocComponent />
      </AuthContext.Provider>,
      { selector: 'WithAPI' }
    )
    const succ = jest.fn()
    const err = jest.fn()
    const rejectValue = { error: 'error' }
    const promise = Promise.reject(rejectValue)
    const spyCreate = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    component.instance().call({ method: 'GET', url: 'api/endpoint' }, succ, err)
    // Then spyCreate is called and success callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => { }).catch(() => {
      expect(err).toHaveBeenCalledWith(rejectValue)
      spyCreate.mockRestore()
      done()
    })
  })
  it('should call call method with correct token and bad call with no error callback', done => {
    // When I render the withAPI element and do a call
    const HocComponent = withAPI(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => jest.fn(),
        }}
      >
        <HocComponent />
      </AuthContext.Provider>,
      { selector: 'WithAPI' }
    )
    const succ = jest.fn()
    const rejectValue = { error: 'error' }
    const promise = Promise.reject(rejectValue)
    const spyCreate = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    component.instance().call({ method: 'GET', url: 'api/endpoint' }, succ)
    // Then spyCreate is called and success callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => { }).catch(() => {
      spyCreate.mockRestore()
      done()
    })
  })
  it('should not call call method with incorrect token', () => {
    // When I render the withAPI element and do a call
    const HocComponent = withAPI(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => false,
        }}
      >
        <HocComponent />
      </AuthContext.Provider>,
      { selector: 'WithAPI' }
    )
    const succ = jest.fn()
    const err = jest.fn()
    const spyRequest = jest.spyOn(axios, 'request')
    component.instance().call({ method: 'GET', url: 'api/endpoint' }, succ, err)
    // Then spyRequest is called and success callback is called too
    expect(spyRequest).not.toHaveBeenCalled()
  })
  it('should call multipleCalls method with correct token and correct call', done => {
    // When I render the withAPI element and do a call
    const HocComponent = withAPI(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => jest.fn(),
        }}
      >
        <HocComponent />
      </AuthContext.Provider>,
      { selector: 'WithAPI' }
    )
    const succ = jest.fn()
    const err = jest.fn()
    const promise = Promise.resolve([{ data: 'myData' }, { data: 'myData2' }])
    const spyCreate = jest.spyOn(axios, 'all').mockImplementation(() => promise)
    component.instance().multipleCalls([{ method: 'GET', url: 'api/endpoint' }, { method: 'GET', url: 'api/endpoint2' }], succ, err)
    // Then spyCreate is called and success callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(a => {
      expect(succ).toHaveBeenCalledWith('myData', 'myData2')
      spyCreate.mockRestore()
      done()
    })
  })
  it('should call multipleCalls method with correct token and bad call', done => {
    // When I render the withAPI element and do a call
    const HocComponent = withAPI(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => jest.fn(),
        }}
      >
        <HocComponent />
      </AuthContext.Provider>,
      { selector: 'WithAPI' }
    )
    const succ = jest.fn()
    const err = jest.fn()
    const rejectValue = { error: 'error' }
    const promise = Promise.reject(rejectValue)
    const spyCreate = jest.spyOn(axios, 'all').mockImplementation(() => promise)
    component.instance().multipleCalls([{ method: 'GET', url: 'api/endpoint' }, { method: 'GET', url: 'api/endpoint2' }], succ, err)
    // Then spyCreate is called and success callback is called too
    expect(spyCreate).toHaveBeenCalled()
    promise.then(() => { }).catch(() => {
      expect(err).toHaveBeenCalledWith(rejectValue)
      spyCreate.mockRestore()
      done()
    })
  })
  it('should not call multipleCalls method with incorrect token', () => {
    // When I render the withAPI element and do a call
    const HocComponent = withAPI(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => false,
        }}
      >
        <HocComponent />
      </AuthContext.Provider>,
      { selector: 'WithAPI' }
    )
    const succ = jest.fn()
    const err = jest.fn()
    const spyRequest = jest.spyOn(axios, 'all')
    component.instance().multipleCalls([{ method: 'GET', url: 'api/endpoint' }, { method: 'GET', url: 'api/endpoint2' }], succ, err)
    // Then spyRequest is called and success callback is called too
    expect(spyRequest).not.toHaveBeenCalled()
  })
})
