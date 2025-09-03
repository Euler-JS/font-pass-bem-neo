import React, {useState, useEffect} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../Title';
import { Avatar } from '@material-ui/core';
import ProgressCircle from "../../components/ProgressCircle";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import api from "../../services/api";


// Generate Order Data
const hoje = new Date();
const mes = hoje.toDateString().slice(4,7)
const ano = hoje.toDateString().slice(11)





function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders({Status}) {

  const classes = useStyles();

  const [Hoje, setHoje] = useState(ano)
  const [DataProf, setDataProf] = useState([])
  const [progress, setprogress] = React.useState(false)

  useEffect(() => {
    async function AllProfs(){

      try{
        setprogress(true)
        const response = await api.get("/escolas")
        setDataProf(response.data)
        setprogress(false)
      }catch{setprogress(false)}
    }
    if(Status === false){
      AllProfs()
    }
    
  }, [Status])


  return (
    <React.Fragment>
      <ProgressCircle Status={progress}/>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <Title>Lista de Escolas</Title>
      </div>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Província</TableCell>
            <TableCell>Distrito</TableCell>
            <TableCell align="right">Telefone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {DataProf.map((escola) => (
            <TableRow key={escola?._id}>
              <TableCell>{escola?.nome}</TableCell>
              <TableCell>{escola?.provincia}</TableCell>
              <TableCell>{escola?.distrito}</TableCell>
              <TableCell align="right">{escola?.telefone}</TableCell>
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