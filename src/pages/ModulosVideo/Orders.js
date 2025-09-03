import React,{useState, useEffect} from 'react';
import { useHistory,useParams } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Title from '../Title';
import SendIcon from '@material-ui/icons/Send';
import InfoIcon from '@material-ui/icons/Info';

import {useAuth} from '../../context/auth';

import api from "../../services/api";


function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders({}) {

  const {user} = useAuth()

  const classes = useStyles();

  const history = useHistory()

  const [modulos, setmodulos] = useState([])

  useEffect(() => {
    async function GetModulos(){

      const response = await api.get("/modulos",{
        headers:{
          user: user?._id,
        }
      })
      setmodulos(response.data)
    }
    GetModulos()
    
  }, [])

  function Navigate({_id, modulo}){
    localStorage.setItem("moduloID", _id)
    localStorage.setItem("moduloName", modulo)
    history.push("vermodulos")
  }


  return (
    <React.Fragment>
      <Title>Módulos Presentes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Módulo</TableCell>
            <TableCell>Nᵒ Videos</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell align="right">Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {modulos.map((row) => (
            <TableRow key={row._id}>
              <TableCell><AssignmentIcon /></TableCell>
              <TableCell>{row.titulo}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell button>{row.descricao}</TableCell>
              <TableCell align="right"><SendIcon onClick={() => Navigate(row)}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}