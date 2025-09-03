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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Vídeo Aulas</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell align="right">Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videoaulas.map((row) => (
            <TableRow key={row.id}>
              <TableCell><VideocamIcon /></TableCell>
              <TableCell>{row.titulo}</TableCell>
              <TableCell button>{row.descricao}</TableCell>
              <TableCell align="right"><EditIcon id="edit" onClick={() => Edit(row)}/></TableCell>
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