import React, {useState, useEffect} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../Title';
import DescriptionIcon from '@material-ui/icons/Description';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import api from "../../services/api";


// Generate Order Data
const hoje = new Date();
const mes = hoje.toDateString().slice(4,7)
const ano = hoje.toDateString().slice(11)

function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(0, '16 Mar, 2019', 'Elvis Presley', 'A', 'VISA ⠀•••• 3719', 312.44),
  createData(1, '16 Mar, 2019', 'Paul McCartney', 'B', 'VISA ⠀•••• 2574', 866.99),
  createData(2, '16 Mar, 2019', 'Tom Scholz', 'B', 'MC ⠀•••• 1253', 100.81),
  createData(3, '16 Mar, 2019', 'Michael Jackson', 'A', 'AMEX ⠀•••• 2000', 654.39),
  createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'B', 'VISA ⠀•••• 5919', 212.79),
];

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
  const [Material, setMaterial] = useState([])
  

  useEffect(() => {
    async function AllMaterial(){

      try{
        const response = await api.get("/material")
        setMaterial(response?.data?.value)
        alert(response?.data?.message)
      }catch{}
    }

      AllMaterial()
    
  }, [Status])


  return (
    <React.Fragment>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <Title>Lista de Material didatico</Title>
        <section style={{display:"flex", alignItems:"center"}}>

          <section style={{backgroundColor:"#f0f4fd", padding:"5px", borderRadius:4}}>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              displayEmpty
              //className={classes.selectEmpty}
              
              onChange={e => setHoje(e.target.value)} 
              //error={VFcidade}
            >
              <MenuItem >Seleccione a escola</MenuItem>
              <MenuItem value={"A"}>A</MenuItem>
              <MenuItem value={"B"}>B</MenuItem>        
            </Select>
            
          </section>
        </section>
      </div>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ficheiro</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Categorias</TableCell>
            <TableCell align="right">Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Material.map((prof) => (
            <TableRow key={prof?._id}>
              <TableCell><DescriptionIcon/></TableCell>
              <TableCell>{prof?.name}</TableCell>
              <TableCell>{prof?.categoria}</TableCell>
              <TableCell align="right">{prof?.telefone}</TableCell>
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