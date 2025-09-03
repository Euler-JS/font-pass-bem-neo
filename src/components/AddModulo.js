import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { useHistory,useParams } from 'react-router-dom'
import ProgressCircle from "./ProgressCircle";
import api from "../services/api"


export default function ADDTEMA({stuTusModulo, CancelarS}) {

  const history = useHistory();

  const [modulo, setmodulo]=useState("")
  const [descricao, setdescricao]=useState("")
  const [progress, setprogress] = useState(false)

  const [status, setstatus]=useState(false)

  function CancelAddMo(){
      CancelarS(false)
      setmodulo("")
      setdescricao("")
  }

  async function Enviarmodulo(){
        if(modulo.trim() =="" || descricao.trim() ==""){
        alert("É obrigatório o preenchimento de todos campos")
        setstatus(true)
        return
    }

    setstatus(false)

    try{
      setprogress(true)
      const data = { nome :modulo, descricao}
      const response = await api.post("modulos", data,{
        headers:{
          user: "60b6aff95361df172869306b",
        }
      })
      alert(response.data)

      CancelAddMo()
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
        <Dialog open={stuTusModulo}  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Adione o Modulo</DialogTitle>
            
            <DialogContent>
                <DialogContentText>
                    Descreva para facilitar a compreição
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Nome do Modulo"
                    fullWidth
                    value={modulo}
                    onChange={e => setmodulo(e.target.value)}
                    error={modulo.trim("") < 1 && status ==true}
                />

                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Descrição do Modulo"
                    fullWidth
                    multiline
                    value={descricao}
                    onChange={e => setdescricao(e.target.value)}
                    error={descricao < 1 && status ==true}
                />
            </DialogContent>
            <DialogActions>
            <Button  color="primary" onClick={() => CancelAddMo()}>
                Cancel
            </Button>
            <Button  color="primary" onClick={() => Enviarmodulo()}>
                Registrar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}