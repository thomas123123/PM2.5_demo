import { render, screen } from '@testing-library/react';
import App from './../App';

import { shallow, mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('Testing App LifeCycle Working', () => {
  const spy = jest.spyOn(App.prototype, 'componentDidMount');
  const wrapper = shallow(<App />);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('Api Fetch Testing', async() => {
    const wrapper = mount(<App />).instance();
    await wrapper._GetPM25Data();
    expect(wrapper.state.citys.length).toBe(1000);
    expect(wrapper.state.waitFetch).toBe(false);
});
