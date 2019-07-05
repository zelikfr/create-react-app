import React from 'react'
import { mount, shallow } from 'enzyme'
import withAuth, { AuthContext, AuthProvider } from '../withAuth.js'
import axios from 'axios'

jest.mock('react-router-dom', () => ({
  Redirect: () => 'redirect',
}))

const Component = () => (
  <div></div>
)

describe('withAuth', () => {
  it('should create a component wrapped with withAuth without options', () => {
    // When I render the withAuth element
    const HocComponent = withAuth()(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => jest.fn(),
        }}
      >
        <HocComponent />
      </AuthContext.Provider>
    )
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
  it('should create a component wrapped with withAuth with options', () => {
    // When I render the withAuth element
    const HocComponent = withAuth({ redirectUri: '/', accessRestriction: 'logged' })(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => jest.fn(),
        }}
      >
        <HocComponent />
      </AuthContext.Provider>
    )
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
  it('should redirect when not authenticated and request authenticated', () => {
    // When I render the withAuth element and do a call
    const HocComponent = withAuth({ redirectUri: '/', accessRestriction: 'logged' })(Component)
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
      { selector: 'WithAuth' }
    )
    expect(component).toMatchSnapshot()
  })
  it('should redirect when authenticated and request not authenticated', () => {
    // When I render the withAuth element and do a call
    const HocComponent = withAuth({ redirectUri: '/', accessRestriction: 'notLogged' })(Component)
    const component = mount(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          login: () => jest.fn(),
          logout: () => jest.fn(),
          renewRefreshToken: () => jest.fn(),
        }}
      >
        <HocComponent />
      </AuthContext.Provider>,
      { selector: 'WithAuth' }
    )
    expect(component).toMatchSnapshot()
  })
  it('should display when not authenticated and request not authenticated', () => {
    // When I render the withAuth element and do a call
    const HocComponent = withAuth({ redirectUri: '/', accessRestriction: 'notLogged' })(Component)
    const component = shallow(
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
      { selector: 'WithAuth' }
    )
    expect(component).toMatchSnapshot()
  })
})
describe('AuthProvider', () => {
  it('should create an AuthProvider wrapped component', () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
  it('should unmount an AuthProvider wrapped component without refreshToken', () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    component.unmount()
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
  it('should unmount an AuthProvider wrapped component with refreshToken', () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    component.instance().request.token = 'fakeToken'
    const spyCancel = jest.fn()
    component.instance().loginRequest.token = 'fakeToken'
    const spyLoginCancel = jest.fn()
    component.instance().request.cancel = spyCancel
    component.instance().loginRequest.cancel = spyLoginCancel
    component.unmount()
    // Then I should have the component to match the snapshot.
    expect(spyCancel).toHaveBeenCalled()
    expect(spyLoginCancel).toHaveBeenCalled()
  })
  it('should create an AuthProvider wrapped component with refreshToken', () => {
    // When I render the withAuth element
    jest.spyOn(window.Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case 'refreshToken':
          return 'abctoken'
        case 'expirationDate':
          return '21/06/2019'
        case 'userId':
          return '123'
        default:
      }
    })
    const spyRenewRefresh = jest.spyOn(AuthProvider.prototype, 'renewRefreshToken')
    mount(
      <AuthProvider />
    )
    // Then I should have the component to match the snapshot.
    expect(spyRenewRefresh).toHaveBeenCalled()
    spyRenewRefresh.mockRestore()
  })
  it('should authenticate user correctly', () => {
    // When I render the withAuth element
    const spyStorage = jest.spyOn(window.Storage.prototype, 'setItem')
    const component = mount(
      <AuthProvider />
    )

    component.instance().authenticateUser('abc')
    // Then I should have the component to match the snapshot.
    expect(component.state('isAuthenticated')).toBe(true)
    expect(spyStorage).toHaveBeenCalled()
  })
  it('should logout user correctly', () => {
    // When I render the withAuth element
    const spyStorage = jest.spyOn(window.Storage.prototype, 'removeItem')
    const component = mount(
      <AuthProvider />
    )

    component.instance().logout()
    // Then I should have the component to match the snapshot.
    expect(component.state('isAuthenticated')).toBe(false)
    expect(spyStorage).toHaveBeenCalled()
  })
  it('should login user correctly', done => {
    // When I render the withAuth element
    const promise = Promise.resolve({ data: { succeeded: true, refreshToken: 'abcToken' } })
    const spyRequest = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    const component = mount(
      <AuthProvider />
    )
    const spyAuth = jest.spyOn(component.instance(), 'authenticateUser').mockImplementation(() => jest.fn())
    component.instance().login('mail', 'pass')
    // Then I should have the component to match the snapshot.
    expect(spyRequest).toHaveBeenCalled()
    promise.then(() => {
      expect(spyAuth).toHaveBeenCalled()
      spyAuth.mockRestore()
      done()
    })
  })
  it('should login user badly due to the api', done => {
    // When I render the withAuth element
    const errorValue = { error: 'error' }
    const promise = Promise.reject(errorValue)
    const spyRequest = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    const component = mount(
      <AuthProvider />
    )
    const spyAuth = jest.spyOn(component.instance(), 'authenticateUser').mockImplementation(() => jest.fn())
    component.instance().login('mail', 'pass')
    // Then I should have the component to match the snapshot.
    expect(spyRequest).toHaveBeenCalled()
    promise.then(() => {}).catch(() => {
      expect(spyAuth).not.toHaveBeenCalled()
      spyAuth.mockRestore()
      done()
    })
  })
  it('should login user correctly after cancel the current request', done => {
    // When I render the withAuth element
    const promise = Promise.resolve({ data: { succeeded: true, refreshToken: 'abcToken' } })
    const spyRequest = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    const component = mount(
      <AuthProvider />
    )

    component.instance().loginRequest.token = 'fakeToken'
    const spyLoginCancel = jest.fn()
    component.instance().loginRequest.cancel = spyLoginCancel
    const spyAuth = jest.spyOn(component.instance(), 'authenticateUser').mockImplementation(() => jest.fn())
    component.instance().login('mail', 'pass')
    // Then I should have the component to match the snapshot.
    expect(spyLoginCancel).toHaveBeenCalled()
    expect(spyRequest).toHaveBeenCalled()
    promise.then(() => {
      expect(spyAuth).toHaveBeenCalled()
      spyAuth.mockRestore()
      done()
    })
  })
  it('should not login user with bad credentials', done => {
    // When I render the withAuth element
    const promise = Promise.resolve({ data: { succeeded: false } })
    const spyRequest = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    const component = mount(
      <AuthProvider />
    )
    const spyAuth = jest.spyOn(component.instance(), 'authenticateUser').mockImplementation(() => jest.fn())
    component.instance().login('mail', 'pass')
    // Then I should have the component to match the snapshot.
    expect(spyRequest).toHaveBeenCalled()
    promise.then(() => {
      expect(spyAuth).not.toHaveBeenCalled()
      spyAuth.mockRestore()
      done()
    })
  })
  it('should return false when given date is after the current date', () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    const currentDate = 1562346880373
    jest.spyOn(Date, 'now').mockImplementation(() => currentDate)
    const tokenDate = 1564346880
    // Then I should have the component to match the snapshot.
    expect(component.instance().shouldRefreshToken(tokenDate)).toBe(false)
  })
  it('should return true when given date is after the current date', () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    const currentDate = 1562346880373
    jest.spyOn(Date, 'now').mockImplementation(() => currentDate)
    const tokenDate = 1561346880
    // Then I should have the component to match the snapshot.
    expect(component.instance().shouldRefreshToken(tokenDate)).toBe(true)
  })
  it('should return false and not renew the refreshToken', async () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    const spyShould = jest.spyOn(component.instance(), 'shouldRefreshToken').mockImplementation(() => false)
    // Then I should have the component to match the snapshot.
    expect(await component.instance().renewRefreshToken()).toBe(false)
    spyShould.mockRestore()
  })
  it('should renew the refreshToken', async () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    const spyShould = jest.spyOn(component.instance(), 'shouldRefreshToken').mockImplementation(() => true)
    // Then I should have the component to match the snapshot.

    const promise = Promise.resolve({ data: { succeeded: true, refreshToken: 'abcToken' } })
    const spyRequest = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    expect(await component.instance().renewRefreshToken()).toBe(true)
    expect(spyRequest).toHaveBeenCalled()
    spyShould.mockRestore()
  })
  it('should renew the refreshToken and cancel current calls', async () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    component.instance().request.token = 'fakeToken'
    const spyCancel = jest.fn()
    component.instance().request.cancel = spyCancel
    const spyShould = jest.spyOn(component.instance(), 'shouldRefreshToken').mockImplementation(() => true)
    // Then I should have the component to match the snapshot.

    const promise = Promise.resolve({ data: { succeeded: true, refreshToken: 'abcToken' } })
    const spyRequest = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    expect(await component.instance().renewRefreshToken()).toBe(true)
    expect(spyCancel).toHaveBeenCalled()
    expect(spyRequest).toHaveBeenCalled()
    spyShould.mockRestore()
  })
  it('should not renew the refreshToken when not succeeded', async () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    const spyShould = jest.spyOn(component.instance(), 'shouldRefreshToken').mockImplementation(() => true)
    // Then I should have the component to match the snapshot.

    const promise = Promise.resolve({ data: { succeeded: false } })
    const spyRequest = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    expect(await component.instance().renewRefreshToken()).toBe(false)
    expect(spyRequest).toHaveBeenCalled()
    spyShould.mockRestore()
  })
  it('should not renew the refreshToken when API error and logout the user', async done => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    const spyLogout = jest.spyOn(component.instance(), 'logout')
    const spyShould = jest.spyOn(component.instance(), 'shouldRefreshToken').mockImplementation(() => true)
    // Then I should have the component to match the snapshot.

    const errorValue = { error: 'error' }
    const promise = Promise.reject(errorValue)
    const spyRequest = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    expect(await component.instance().renewRefreshToken()).toBe(false)
    promise.then(() => { }).catch(() => {
      expect(spyRequest).toHaveBeenCalled()
      expect(spyLogout).toHaveBeenCalled()
      spyShould.mockRestore()
      done()
    })
  })
  it('should not renew the refreshToken when API error but not logout the user', async done => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider />
    )
    const spyLogout = jest.spyOn(component.instance(), 'logout')
    const spyShould = jest.spyOn(component.instance(), 'shouldRefreshToken').mockImplementation(() => true)
    // Then I should have the component to match the snapshot.
    jest.spyOn(axios, 'isCancel').mockImplementation(() => true)
    const errorValue = { error: 'error' }
    const promise = Promise.reject(errorValue)
    const spyRequest = jest.spyOn(axios, 'request').mockImplementation(() => promise)
    expect(await component.instance().renewRefreshToken()).toBe(false)
    promise.then(() => { }).catch(() => {
      expect(spyRequest).toHaveBeenCalled()
      expect(spyLogout).not.toHaveBeenCalled()
      spyShould.mockRestore()
      done()
    })
  })
  it('should call actions from provider', () => {
    // When I render the withAuth element
    const component = mount(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ login, renewRefreshToken, logout }) => {
            return (
              <>
                <button className="login" onClick={() => login()} />
                <button className="logout" onClick={() => logout()} />
                <button className="renewRefreshToken" onClick={() => renewRefreshToken()} />
              </>
            )
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    )
    const spyLogout = jest.spyOn(component.instance(), 'logout').mockImplementation(() => jest.fn())
    const spyLogin = jest.spyOn(component.instance(), 'login').mockImplementation(() => jest.fn())
    const spyRenew = jest.spyOn(component.instance(), 'renewRefreshToken').mockImplementation(() => jest.fn())
    // Then I should have the component to match the snapshot.
    component.find('.login').simulate('click')
    expect(spyLogin).toHaveBeenCalled()
    component.find('.logout').simulate('click')
    expect(spyLogout).toHaveBeenCalled()
    component.find('.renewRefreshToken').simulate('click')
    expect(spyRenew).toHaveBeenCalled()
  })
})
