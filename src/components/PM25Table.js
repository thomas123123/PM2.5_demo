import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

import './../PM25Table.css';

export function createData(SiteName, Concentration) {
  return { SiteName, Concentration };
}

export function descendingComparator(a, b, orderBy) {
  if (Number(a[orderBy]) > Number(b[orderBy])) {
    return 1;
  } else if (Number(a[orderBy]) < Number(b[orderBy])) {
    return -1;
  } else {
    return 0;
  }
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return 1;
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'SiteName', numeric: true, disablePadding: false, label: '城市' },
  { id: 'Concentration', numeric: true, disablePadding: false, label: '濃度 (μg/m3)' },
];

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead className={"tableHeader"}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              className={"cell"}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default class EnhancedTable extends Component{
  constructor(props){
    super(props);
    this.state = {
      order: 'desc',
      page: 0,
      selected: [],
      rowsPerPage: 5
    };
  }

  _handleRequestSort = (event, property) => {
    const { order } = this.state;
    const isAsc = `Concentration` === property && order === 'asc';
    this.setState({ order: isAsc ? 'desc' : 'asc' });
  };

  _handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  };

  _handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
    this.setState({ page: 0 })
  };

  render() {
    const { order, page, selected, rowsPerPage } = this.state;
    const { citys } = this.props;
    let rows = citys
    .filter(city => city.MonitorDate === '20201229')
    .map(city => createData(`${city.SiteName}`, `${city.Concentration}`))

    const isSelected = (name) => selected.indexOf(name) !== -1;

    return (
      <div className={'root'}>
        <Paper className={'paper'}>
          <TableContainer>
            <Table
              className={'table'}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={`Concentration`}
                onRequestSort={this._handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, `Concentration`))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell className={'cell'} align="right">{row.SiteName}</TableCell>
                        <TableCell className={'cell'} align="right">{row.Concentration}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className={'table'}
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this._handleChangePage}
            onChangeRowsPerPage={this._handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    );
  }
}