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
    const [descricao, setdescricao] = useState("")
    const [provincia, setprovincia] = useState("")
    const [distrito, setdistrito] = useState("")
    const [lat, setlat] = useState("")
    const [long, setlong] = useState("")
    const [telefone, settelefone] = useState("")


    const [statusV, setstatusV] = useState(false)

    function Clear(){
        setnome("")
        setdescricao("")
        setprovincia("")
        setdistrito("")
        settelefone("")
        setlat("")
        setlong("")
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
     if(nome.trim() =="" || descricao.trim() =="" || distrito.trim() =="" || provincia.trim() =="" || telefone.trim() ==""){
         setstatusV(true)
     }
     else{
        setstatusV(false)

        try{
            /* const data = new FormData();

            data.append("nome", nome)
            data.append("descricao", descricao)
            data.append("provincia", provincia)
            data.append("distrito", distrito)
            data.append("imagem", foto) */

            const data = {
                nome,
                descricao,
                provincia,
                distrito,
                foto,
                telefone,
            };

            setprogress(true)

            const response = await api.post("/escolas", data,{
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
            <DialogTitle id="form-dialog-title" style={{alignSelf:"center"}}>Perfil da Escolas</DialogTitle>
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
                    id="descricao"
                    label="Descricao sobre a escola"
                    fullWidth
                    multiline
                    value={descricao}
                    onChange={e => setdescricao(e.target.value)}
                    error={descricao.trim() < 1 && statusV==true} 
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="Província"
                    label="Província"
                    fullWidth
                    multiline
                    value={provincia}
                    onChange={e => setprovincia(e.target.value)}
                    error={provincia.trim() < 1 && statusV==true} 
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="Distrito"
                    label="Distrito"
                    fullWidth
                    multiline
                    value={distrito}
                    onChange={e => setdistrito(e.target.value)}
                    error={distrito.trim() < 1 && statusV==true} 
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="telefone"
                    label="Tefefone"
                    fullWidth
                    multiline
                    value={telefone}
                    onChange={e => settelefone(e.target.value)}
                    error={telefone.trim() < 1 && statusV==true} 
                />
            
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