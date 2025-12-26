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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import Title from "../Title"

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

  const handleDelete = async (material) => {
    if(window.confirm(`Tem certeza que deseja excluir o material "${material.name}"?`)) {
      if(onDelete) onDelete(material);
    }
  };


  

  return (
    <TableContainer component={Paper}>
    <Title>{Detalhes[3]}</Title>
      <Table className={classes.table} aria-label="custom pagination table">
      <TableHead>
          <TableRow>
          <TableCell/>
            <TableCell>Ficheiro</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Categorias</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row) => (
            <TableRow key={row._id} className={classes.tableRow}>
              <TableCell><AssignmentIcon /></TableCell>
              <TableCell>{row?.name}</TableCell>
              <TableCell>{row?.name}</TableCell>
              <TableCell>{row?.categoria}</TableCell>
              <TableCell align="right">
                <IconButton 
                  color="primary" 
                  onClick={() => onEdit && onEdit(row)}
                  title="Editar material"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="secondary" 
                  onClick={() => handleDelete(row)}
                  title="Excluir material"
                >
                  <DeleteIcon />
                </IconButton>
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