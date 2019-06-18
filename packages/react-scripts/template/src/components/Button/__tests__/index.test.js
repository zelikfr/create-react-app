import React from 'react'
import { shallow } from 'enzyme'
import Button from '../'

describe('Button', () => {
    it('should create a Button instance', () => {
        // When I render the Button element
        const component = shallow(<Button />)

        // Then I should have the component to match the snapshot.
        expect(component).toMatchSnapshot()
    })
})
