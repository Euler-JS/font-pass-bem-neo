import React ,{useState} from 'react';
import { useHistory, } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useAuth } from '../../context/auth';


import api from "../../services/api";

import ProgressCircle from "../../components/ProgressCircle";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {

  const { login} = useAuth()
  const classes = useStyles();

  const history = useHistory()

  const [email, setemail] = useState("")
  const [senha, setsenha] = useState("")
  const [status, setstatus] = useState(false)

  const [progress, setprogress] = useState(false)

  async function Login(){

    if(email.trim("") === "" || senha.trim("") === ""){
      alert("Por favor preencha os compos correctamente")
      setstatus(true)

      return
    }

    else login({email, senha})

    /* try{
      setprogress(true)
      const res = await api.get("/usersdata",{
        headers:{
          email: email,
          senha: senha
        }
      })
      
      if(res.data._id){
        setprogress(false)
        sessionStorage.setItem("user_id", res.data._id)
        history.push("dasbords")
      }
    }catch(err){ 
      setprogress(false) 
      alert(err)} */
  }

  return (
    <Container component="main" maxWidth="xs">

      <ProgressCircle Status={progress}/>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setemail(e.target.value)}
            error={email.trim() < 1 && status===true} 
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            type="password"
            value={senha}
            onChange={e => setsenha(e.target.value)}
            error={senha.trim("") < 1 && status===true} 
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            onClick={() => Login()}

            fullWidth
            variant="contained"
            color="primary"
            
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
