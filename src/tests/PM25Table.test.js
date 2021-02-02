import { render, screen } from '@testing-library/react';
import PM25Table,
{
  createData,
  descendingComparator,
  getComparator,
  stableSort,
  EnhancedTableHead
} from './../components/PM25Table';

import { shallow, mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

Enzyme.configure({ adapter: new Adapter() });

import MockPM25Data from './../../seeds/PM25Data.json';

test('testing createData function', () => {
  const expectData = { SiteName: '恆春', Concentration: 5 };
  expect(createData('恆春', 5)).toEqual(expectData);
});

test('testing descendingComparator by Concentration', () => {
  const dataA = { SiteName: '臺北', Concentration: 5 };
  const dataB = { SiteName: '臺中', Concentration: 7 };
  const dataC = { SiteName: '高雄', Concentration: 7 };
  expect(descendingComparator(dataA, dataB, 'Concentration')).toBe(-1);
  expect(descendingComparator(dataB, dataA, 'Concentration')).toBe(1);
  expect(descendingComparator(dataB, dataC, 'Concentration')).toBe(0);
});

// 這要重新檢查 有問題
test('testing getComparator', () => {
  expect(getComparator('desc', 'Concentration')).toBeTruthy();
  expect(getComparator('asc', 'Concentration')).toBeTruthy();
});

test('testing stableSort', () => {
  let MockRows = MockPM25Data
  .filter(city => city.MonitorDate === '20201229')
  .map(city => createData(`${city.SiteName}`, `${city.Concentration}`))
  const expectRowsByDesc = MockRows.sort((a, b) => a.Concentration - b.Concentration);
  expect(stableSort(MockRows, getComparator('desc', `Concentration`))).toEqual(expectRowsByDesc);
  const expectRowsByAsc = MockRows.sort((a, b) => b.Concentration - a.Concentration);
  expect(stableSort(MockRows, getComparator('asc', `Concentration`))).toEqual(expectRowsByAsc);
});

test('testing render EnhancedTableHead', () => {
  const onRequestSort = jest.fn();
  const wrapper = shallow(EnhancedTableHead({ classes: {}, onRequestSort }));
  expect(wrapper.find('.tableHeader')).toHaveLength(1)
  expect(wrapper.find('.cell')).toHaveLength(2)
  wrapper.find('.cell').at(1).simulate('click');
  expect(onRequestSort).toHaveBeenCalledTimes(1);
});

test('testing render EnhancedTable', () => {
  const wrapper = mount(<PM25Table citys={MockPM25Data}/>).instance();
  wrapper._handleRequestSort({}, 'asc');
  expect(wrapper.state.order).toBe('asc');
  wrapper._handleChangePage({}, 2);
  expect(wrapper.state.page).toBe(2);
  wrapper._handleChangeRowsPerPage({ target: { value: 10 } });
  expect(wrapper.state.rowsPerPage).toBe(10);
});
