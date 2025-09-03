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

import api from "../../services/api";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders({StatusTheme}) {

  const history = useHistory()

  const [temas, settemas] = useState([])

  useEffect(() => {
    async function GetTemas(){

      const response = await api.get("temas",{
        headers:{
          user: "60b8c16965472a2b1c2e7a32",

        }
      })
      settemas(response.data)
    }
    GetTemas()
    
  }, [StatusTheme])

  function Navigate({_id, tema}){
    localStorage.setItem("temaID", _id)
    localStorage.setItem("temaName", tema)
    history.push("vertemas")
  }


  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Compras Recentes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Tema</TableCell>
            <TableCell>Nᵒ Questões</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell align="right">Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {temas.map((row) => (
            <TableRow key={row._id}>
              <TableCell><AssignmentIcon /></TableCell>
              <TableCell>{row.tema}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell button>{row.descricao}</TableCell>
              <TableCell align="right"><SendIcon id="edit" onClick={() => Navigate(row)}/></TableCell>
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