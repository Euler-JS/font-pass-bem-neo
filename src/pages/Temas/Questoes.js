import React,{useState, useEffect} from 'react';
import { useHistory,useParams } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Title from '../Title';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';

import api from "../../services/api";

import EdditQuetion from "../../components/EditQuetion";


function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  tableContainer: {
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  tableHead: {
    backgroundColor: '#3f51b5',
    '& th': {
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.95rem',
    },
  },
  tableRow: {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f5f7ff',
      transform: 'scale(1.01)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
  },
  iconButton: {
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2)',
      cursor: 'pointer',
    },
  },
  editButton: {
    color: '#ff9800',
    '&:hover': {
      color: '#f57c00',
    },
  },
}));

export default function Orders({StatusTheme}) {
  const classes = useStyles();

  const history = useHistory()

  const [Questoes, setQuestoes] = useState([])

  const [data, setdata] = useState("")

  const [status, setstatus] = useState(false)

  const tema_id = localStorage.getItem("temaID")

  function EditarP(row){

    setdata(row)

    setstatus(true)
  }

  function Cancelar(props){

    setstatus(props)
  }

  useEffect(() => {
    async function GetQuestoes(){

      const response = await api.get(`questoes`,{
        headers:{
          id:tema_id
        }
      })
      setQuestoes(response.data)
    }
    GetQuestoes()
    
  }, [StatusTheme, status])


  return (
    <React.Fragment>
      <EdditQuetion datas ={data} Status={status} CancelarS={(props) => Cancelar(props)}/>

      <Title>Lista de questões disponíveis</Title>
      <Table size="small" className={classes.tableContainer}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Questão</TableCell>
            <TableCell align="right">Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Questoes.map((row) => (
            <TableRow key={row._id} className={classes.tableRow}>
              <TableCell><InsertDriveFileIcon style={{color: '#667eea'}} /></TableCell>
              <TableCell>{row.questao}</TableCell>
              <TableCell align="right">
                <EditIcon 
                  className={`${classes.iconButton} ${classes.editButton}`} 
                  onClick={() => EditarP(row)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          .
        </Link>
      </div>
    </React.Fragment>
  );
}