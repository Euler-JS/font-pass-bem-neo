import React from 'react';
import { useHistory,} from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../Title';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}






const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
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

export default function Orders({value}) {
  const classes = useStyles();

  const history = useHistory();


  function preventDefault(event) {
    event.preventDefault();
    history.push("compras")
  }


  const [rowsT, setRows] = React.useState([])
  

  React.useEffect(()=> {
   setRows(value||[])
  },[value])


  return (
    <React.Fragment>
      <Title>Compras Recentes</Title>
      <Table size="small">
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Pacote</TableCell>
            <TableCell>Método de Pagamento</TableCell>
            <TableCell align="right">Total Pago</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsT?.slice(0,4).map((row) => (
            <TableRow key={row?._id} className={classes.tableRow}>
              <TableCell>{row?.inscricao.slice(0,10)}</TableCell>
              <TableCell>{row?.user?.numero}</TableCell>
              <TableCell>{row?.pacote}</TableCell>
              <TableCell>{'Mpesa'}</TableCell>
              <TableCell align="right">{Intl.NumberFormat("pt-BR", {style:"currency", currency: "MZN"}).format(row?.valor)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="/compras" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}