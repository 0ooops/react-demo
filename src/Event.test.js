import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer'
import EventPage from './Event';

configure({ adapter: new Adapter() });

it('event page renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EventPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('event page snapshot test', () => {
  const component = renderer.create(<EventPage />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

it('event page title renders properly', () => {
  const title = 'Recent Events'
  const pageWrapper = shallow(<EventPage />);
  expect(pageWrapper.find('h1').text()).toEqual(title);
});

/* more to added for testing each component */