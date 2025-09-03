import React, {useState, useMemo} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { useHistory,useParams } from 'react-router-dom'
import PhotoCameraIcon from '@material-ui/icons/VideoCall';
import { Grid } from '@material-ui/core';

import api from "../services/api";

import ProgressCircle from "./ProgressCircle";

export default function ADDTEMA({StatusVideo, CancelarS}) {

  const history = useHistory();

  const modulo_id = localStorage.getItem("moduloID")
  const Modulonome = localStorage.getItem("moduloName")

  const [foto, setfoto] = React.useState(null)

  const [titulo, settitulo] = React.useState("")

  const [descricao, setdescricao] = React.useState("")
  
  const [statusV, setSatusV] = useState(false)

  const [progress, setprogress] = useState(false)
  
  const previwImg = useMemo(() => {
      return foto ? URL.createObjectURL(foto) : null
  },[foto])

  function Cancels(){
    CancelarS(false)
    setdescricao("")
    setfoto(null)
    settitulo("")
    return
  }

  async function EnviarVideo(){
    const data = new FormData();

    data.append("imagem", foto)
    data.append("titulo", titulo)
    data.append("descricao", descricao)
    data.append("modulo", Modulonome)

    if(!foto){
        alert("Por favor adicione um vídeo ou áudio")
        return
    }
    else if(titulo.trim() == "" || descricao.trim() ==""){
        setSatusV(true)
        alert("É obrigatório o preenchimento de todos campos")
        return
    }

    try{
        setprogress(true)
        const response = await api.post("videosaula",data,{
            headers:{
                modulo_id : modulo_id,
            }
        })
        setprogress(false)
        alert(response.data)
        Cancels()
    }catch{
        setprogress(false)
        alert("Errro")
    }

  }

  return (
    <React.Fragment>
      <div>
        <ProgressCircle Status={progress}/>
        <Dialog open={StatusVideo}  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Videos</DialogTitle>
            <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            id="nome"
            label="Título da vídeo aula"
            fullWidth
            autoComplete="nome"
            value={titulo}
            onChange={e => settitulo(e.target.value)}
            error={titulo.trim() < 1 && statusV==true} 
            />
                <DialogContentText>
                    Adicione  descrição para ajudar na compreição
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Descrição"
                    fullWidth
                    multiline
                    value={descricao}
                    onChange={e => setdescricao(e.target.value)}
                    error={descricao.trim() < 1 && statusV==true}
                />
            </DialogContent>
                <label id="videos" 
                style={{backgroundClip: `url(${previwImg})`}}
                className={foto ? "temfoto": ""}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nome"
                        type="file"
                        onChange={(event) => setfoto(event.target.files[0])}
                        /* value={dadosprod}
                        onChange={e => setdadosprod(e.target.value)}
                        error={VFdadosprod} */
                    />
                    <video width="100%" height="100%" controls src={previwImg}  autoPlay/>
                    <PhotoCameraIcon/>
                    

                </label>

            <DialogActions>
            <Button  color="primary" onClick={() => Cancels()}>
                Cancel
            </Button>
            <Button  color="primary" onClick={() => EnviarVideo()}>
                Registrar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}