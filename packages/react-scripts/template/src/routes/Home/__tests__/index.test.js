import React from 'react'
import { mount } from 'enzyme'
import HomePage from '../'

describe('HomePage', () => {
  it('should create a component wrapped with HomePage', () => {
    // When I render the HomePage element
    const component = mount(<HomePage call={jest.fn((opts, succ) => succ({ data: [] }))} />)
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
  it('should create a component wrapped with HomePage and data in call', () => {
    // When I render the HomePage element
    const component = mount(<HomePage call={jest.fn((opts, succ) => succ({ data: [{ id: 1, 'first_name': 'John' }] }))} />)
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
  it('should logout after click on button', () => {
    // When I render the HomePage element
    const logout = jest.fn()
    const component = mount(<HomePage logout={logout} call={jest.fn((opts, succ) => succ({ data: [{ id: 1, 'first_name': 'John' }] }))} />)
    component.find('Button').simulate('click')
    // Then I should have the component to match the snapshot.
    expect(logout).toHaveBeenCalled()
  })
})
