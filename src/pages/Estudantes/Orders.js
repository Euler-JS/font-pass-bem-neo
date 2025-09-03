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
import ProgressCircle from "../../components/ProgressCircle";

import { Avatar } from '@material-ui/core';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Title from "../Title";

import api from '../../services/api';

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


const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function CustomPaginationActionsTable({data, change}) {
  const classes = useStyles2();
  const history = useHistory()

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [categoria, setCategoria] = React.useState()
  const [escola, setEscola] = React.useState(null)
  const [progress, setprogress] = React.useState(false)

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const FilterTable = async ()=>{
    
    try{
      setprogress(true)
      const value = await api.get(`/estudantes?categoria=${categoria}&&escola=${escola}`)

      console.log(value?.data?.value)

      change(value?.data?.value)
      setprogress(false)
    }catch{setprogress(false)}

    
  }


  React.useEffect(() => {

    if(categoria || escola)
    FilterTable()
  }, [categoria || escola])



  return (
    <TableContainer component={Paper}>
      <ProgressCircle Status={progress}/>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <Title>Lista de Estudantes</Title>
        <section style={{display:"flex", alignItems:"center"}}>
          <section style={{backgroundColor:"#f0f4fd", padding:"5px", borderRadius:4, marginRight:"10px"}}>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              displayEmpty
              //className={classes.selectEmpty}
              
              onChange={e => setCategoria(e?.target?.value)} 
              //error={VFcidade}
            >
              <MenuItem  >Seleccione a categoria</MenuItem>
              <MenuItem value={"A"}>A</MenuItem>
              <MenuItem value={"A1"}>A1</MenuItem>
              <MenuItem value={"B"}>B</MenuItem>    
              <MenuItem value={"C"}>C</MenuItem>  
              <MenuItem value={"C1"}>C1</MenuItem>         
            </Select>
            
          </section>

          <section style={{backgroundColor:"#f0f4fd", padding:"5px", borderRadius:4}}>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              displayEmpty
              //className={classes.selectEmpty}
              
              onChange={e => setEscola(e.target.value)} 
              //error={VFcidade}
            >
              <MenuItem >Seleccione a escola</MenuItem>
                 
            </Select>
            
          </section>
        </section>
      </div>
      <Table className={classes.table} aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <TableCell>Foto</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Escola</TableCell>
            <TableCell align="right">Telefone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row) => (
            <TableRow key={row._id}>
             <TableCell><Avatar src={row?.perfil_url}/></TableCell>
              <TableCell>{row?.nome}</TableCell>
              <TableCell>{row?.categoria}</TableCell>
              <TableCell>{row?.escola}</TableCell>
              <TableCell align="right">{row?.telefone}</TableCell>
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