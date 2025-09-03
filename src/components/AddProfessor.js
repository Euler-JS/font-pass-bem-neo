import React, {useState, useMemo, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { useHistory,useParams } from 'react-router-dom'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { Avatar } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';

import api from "../services/api";
import ProgressCircle from "./ProgressCircle";

const useStyles = makeStyles((theme) => ({

    large: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  }));



export default function ADDTEMA({Status, Restart}) {

    
    const classes = useStyles();

    const history = useHistory();

    const [escolas, setescolas] = useState([])

    const [foto, setfoto] = React.useState(null)
    const [progress, setprogress] = useState(false)

    const [nome, setnome] = useState("")
    const [telefone, settelefone] = useState("")
    const [escola_id, setescola_id] = useState("")
    const [senha, setSenha] = useState("")
    const [email, setemail] = useState("")

    const [statusV, setstatusV] = useState(false)

    function Clear(){
        setnome("")
        settelefone("")
        setescola_id("")
        setSenha("")
        setemail("")
        Restart(false)
        setstatusV(false)
    }

  
  const previwImg = useMemo(() => {
      return foto ? URL.createObjectURL(foto) : null
  },[foto])

  useEffect(() => {
      async function Escolas(){
          
          const res = await api.get("/escolas")
          setescolas(res.data)
      }    
      Escolas()
 },[])

 async function EnaviarProf(){
     if(nome.trim() =="" || telefone.trim() =="" || escola_id.trim() =="" || email.trim() =="" || senha.trim() ==""){
         setstatusV(true)
     }
     else{
        setstatusV(false)

        try{
            const data = new FormData();

            data.append("nome", nome)
            data.append("telefone", telefone)
            data.append("escola_id", escola_id)
            data.append("imagem", foto)
            data.append("senha", senha)
            data.append("email", email)

            setprogress(true)

            const response = await api.post("/professor", data,{
                headers:{
                    user: "",
                }
            })
            setprogress(false)
            alert(response.data)
            Clear()
        }catch{setprogress(false)}

     }
 }


  return (
    <React.Fragment>
        <ProgressCircle Status={progress}/>
      <div>
        <Dialog open={Status }  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" style={{alignSelf:"center"}}>Perfil do Professor</DialogTitle>
                <Avatar style={{alignSelf:"center"}} src={previwImg} className={classes.large}/>
                <label id="perfil" 
                    className={foto ? "temfoto": ""}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nome"
                        type="file"
                        onChange={(event) => setfoto(event.target.files[0])}
                    />
                    <p> <PhotoCameraIcon/></p>
                    
                </label>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="professor"
                    label="Nome"
                    fullWidth
                    autoComplete="nome"
                    value={nome}
                    onChange={e => setnome(e.target.value)}
                    error={nome.trim() < 1 && statusV==true}  
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="telefone"
                    label="Telefone"
                    fullWidth
                    multiline
                    value={telefone}
                    onChange={e => settelefone(e.target.value)}
                    error={telefone.trim() < 1 && statusV==true} 
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email de Acesso"
                    fullWidth
                    multiline
                    value={email}
                    onChange={e => setemail(e.target.value)}
                    error={email.trim() < 1 && statusV==true} 
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="senha"
                    label="Difina uma senha"
                    fullWidth
                    multiline
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    error={senha.trim() < 1 && statusV==true} 
                />
            <FormControl >
                <InputLabel id="demo-simple-select-label">Escola</InputLabel>
                <Select style={{minWidth:100}} error={escola_id.trim() < 1 && statusV==true} 
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={escola_id}
                onChange={(event) => setescola_id(event.target.value)}
                >
                {escolas.map((escola) => (
                    <MenuItem value={escola._id}>{escola.nome}</MenuItem>
                ))}
                </Select>
            </FormControl>
            
            </DialogContent>

            <DialogActions>
            <Button  color="primary" onClick={() => Clear()}>
                Cancel
            </Button>
            <Button  color="primary" onClick={() => EnaviarProf()}>
                Registrar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}