import React,{useState} from 'react';
import { useHistory,useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import SendIcon from '@material-ui/icons/RemoveRedEye';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import Title from "../pages/Title"

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props,{data}) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  
const [rows, setrows]= useState(data)

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}


const useStyles2 = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },
  descricaoCell: {
    maxWidth: 300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'help',
  },
  tableContainer: {
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  tableHead: {
    backgroundColor: '#3f51b5',
    '& .MuiTableCell-head': {
      color: '#ffffff',
      fontWeight: 600,
      fontSize: '0.95rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
  tableRow: {
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f5f7ff',
      transform: 'scale(1.001)',
      boxShadow: '0 2px 8px rgba(63, 81, 181, 0.1)',
    },
  },
  iconButton: {
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.15)',
    },
  },
  viewButton: {
    color: '#3f51b5',
  },
  editButton: {
    color: '#4caf50',
  },
  deleteButton: {
    color: '#f44336',
  },
}));

export default function CustomPaginationActionsTable({data, Detalhes, onEdit, onDelete}) {
  const classes = useStyles2();
  const history = useHistory()


  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  function Navigate({_id, nome}){
    localStorage.setItem(Detalhes[4], _id)
    localStorage.setItem(Detalhes[5], nome)
    history.push(Detalhes[6])
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
    <Title>{Detalhes[3]}</Title>
      <Table className={classes.table} aria-label="custom pagination table">
      <TableHead className={classes.tableHead}>
          <TableRow>
          <TableCell/>
            <TableCell>{Detalhes[0]}</TableCell>
            <TableCell>{Detalhes[1]}</TableCell>
            <TableCell>{Detalhes[2]}</TableCell>
            <TableCell align="right">Ver</TableCell>
            <TableCell align="right">Editar</TableCell>
            <TableCell align="right">Excluir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row) => (
            <TableRow key={row._id} className={classes.tableRow}>
              <TableCell><AssignmentIcon style={{color: '#3f51b5'}}/></TableCell>
              <TableCell style={{fontWeight: 500}}>{row.nome}</TableCell>
              <TableCell><span style={{backgroundColor: '#e3f2fd', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#1976d2'}}>{row.numero}</span></TableCell>
              <TableCell className={classes.descricaoCell}>
                <Tooltip title={row.descricao || ''} placement="top" arrow>
                  <span>{truncateText(row.descricao)}</span>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => Navigate(row)} size="small" className={`${classes.iconButton} ${classes.viewButton}`}>
                  <SendIcon />
                </IconButton>
              </TableCell>
              <TableCell align="right">
                {onEdit && (
                  <IconButton onClick={() => onEdit(row)} size="small" className={`${classes.iconButton} ${classes.editButton}`}>
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
              <TableCell align="right">
                {onDelete && (
                  <IconButton onClick={() => onDelete(row)} size="small" className={`${classes.iconButton} ${classes.deleteButton}`}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per pages' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}