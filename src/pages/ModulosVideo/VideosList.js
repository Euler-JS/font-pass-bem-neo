import React,{useState, useEffect} from 'react';
import { useHistory,useParams } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import VideocamIcon from '@material-ui/icons/Videocam';
import Title from '../Title';
import EditIcon from '@material-ui/icons/Edit';

import EditVideo from "../../components/EditVideo";

import api from "../../services/api";



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

export default function Orders(Status) {
  const classes = useStyles();

  const history = useHistory()

  const [videoaulas, setvideoaulas] = useState([])

  const [status, setstatus] = useState(false)

  const [data, setdata] = useState("")

  const modulo_id = localStorage.getItem("moduloID")

  function Cancel(props){
    setstatus(props)
  }

  function Edit(row){
    console.log(row)
    setdata(row)
    setstatus(true)
  }


  useEffect(() => {
    async function GetVideoAulas(){

      const response = await api.get(`videosaula`,{
        headers:{
          modulo_id:modulo_id,
        }
      })
      setvideoaulas(response.data)
    }
    GetVideoAulas()
    
  }, [Status, status])


  return (
    <React.Fragment>
    <EditVideo Status={status} CancelarS={(props) => Cancel(props)} datas ={data} />
      <Title>Lista de vídeo aulas disponíveis</Title>
      <Table size="small" className={classes.tableContainer}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Vídeo Aulas</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell align="right">Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videoaulas.map((row) => (
            <TableRow key={row.id} className={classes.tableRow}>
              <TableCell><VideocamIcon style={{color: '#667eea'}} /></TableCell>
              <TableCell>{row.titulo}</TableCell>
              <TableCell button>{row.descricao}</TableCell>
              <TableCell align="right">
                <EditIcon 
                  className={`${classes.iconButton} ${classes.editButton}`} 
                  onClick={() => Edit(row)}
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