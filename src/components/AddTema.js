import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { useHistory,useParams } from 'react-router-dom'

import api from "../services/api"
import ProgressCircle from "./ProgressCircle";

export default function AdA({StatusTheme,  CancelarS}) {

  const history = useHistory();

  const [tema, settema]=useState("")
  const [descricao, setdescricao]=useState("")
  const [progress, setprogress] = useState(false)
  const [status, setstatus]=useState(false)

  function CancelS(){
    CancelarS(false)
    settema("")
    setdescricao("")
  }

  async function EnviarTema(){
    if(tema.trim() =="" || descricao.trim() ==""){
      alert("É obrigatório o preenchimento de todos campos")
      setstatus(true)
      return
    }

    setstatus(false)

    try{
      setprogress(true)
      const data = { nome : tema, descricao}
      const response = await api.post("temas", data,{
        headers:{
          user: "60b8c16965472a2b1c2e7a32",
        }
      })
      alert(response.data)
      CancelS()
      setprogress(false)
    }catch{
      setprogress(false)
      alert("Errro")
    }
  }

  return (
    <React.Fragment>
    <ProgressCircle Status={progress}/>
      <div>
        <Dialog open={StatusTheme}  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Adione o Tema</DialogTitle>
            
            <DialogContent>
                <DialogContentText>
                    Descreva para facilitar a compreição
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Nome do Tema"
                    fullWidth
                    value={tema}
                    onChange={e => settema(e.target.value)}
                    error={tema < 1 && status ==true}
                />

                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Descrição do Tema"
                    fullWidth
                    multiline
                    value={descricao}
                    onChange={e => setdescricao(e.target.value)}
                    error={descricao < 1 && status ==true}
                />
            </DialogContent>
            <DialogActions>
            <Button  color="primary" onClick={() => CancelS()}>
                Cancel
            </Button>
            <Button  color="primary" onClick={() => EnviarTema()}>
                Registrar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}