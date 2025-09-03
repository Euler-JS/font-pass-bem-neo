import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from '../Title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
    fontSize:17
  },
});

export default function Deposits({value}) {

  const data = new Date()  

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Depósitos Recentes</Title>
      <Typography component="p" variant="h4">
        {Intl.NumberFormat("pt-BR", {style:"currency", currency: "MZN"}).format( value||0)}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`${data}`}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Ver balaço geral
        </Link>
      </div>
    </React.Fragment>
  );
}
