import React from 'react'
import { shallow } from 'enzyme'
import Routes from '../'

describe('Routes', () => {
  it('should create a component wrapped with Routes', () => {
    // When I render the Routes element
    const component = shallow(<Routes />)
    // Then I should have the component to match the snapshot.
    expect(component).toMatchSnapshot()
  })
})
