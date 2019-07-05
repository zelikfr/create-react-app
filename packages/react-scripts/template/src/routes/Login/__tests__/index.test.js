import React from 'react'
import { mount } from 'enzyme'
import LoginPage from '../'

describe('LoginPage', () => {
  it('should create a component wrapped with LoginPage', () => {
    // When I render the LoginPage element
    const component = mount(<LoginPage />)
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
  it('should Login after click on button', () => {
    // When I render the LoginPage element
    const login = jest.fn()
    const component = mount(<LoginPage login={login} />)
    component.find('Button').simulate('click')
    // Then I should have the component to match the snapshot.
    expect(login).toHaveBeenCalled()
  })
})
