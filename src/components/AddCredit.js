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
import { useAuth } from '../context/auth';

export default function AdCredi({StatusTheme,  CancelarS}) {


  const {user} = useAuth()

  const history = useHistory();

  const [numer, setnumer]=useState("")
  const [pacote, setpacote]=useState("")
  const [progress, setprogress] = useState(false)
  const [status, setstatus]=useState(false)


  console.log("user", user)

  function CancelS(){
    CancelarS(false)
    setnumer("")
    setpacote("")
  }

  async function Recaregar(){
    if(numer.trim() =="" || pacote.trim() ==""){
      alert("É obrigatório o preenchimento de todos campos")
      setstatus(true)
      return
    }

    if(numer.length <9){
      alert("O numero deve conter 9 digitos")
      return
    }

    setstatus(false)


    try{
      setprogress(true)
      const data = { numero : Number(numer), pacote, id:user?._id,
        name:user?.email}
      const response = await api.post("/manualcharge", data,{
        headers:{
          user: "60b8c16965472a2b1c2e7a32",
          // Authorization:outhor
        }
      })
      alert(response?.data?.message)
      CancelS()
      setprogress(false)
    }catch{
      setprogress(false)
      alert("Errro ao creditar conta tente mais tarde")
    }
  }

  return (
    <React.Fragment>
    <ProgressCircle Status={progress}/>
      <div>
        <Dialog open={StatusTheme}  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Adione Creditos</DialogTitle>
            
            <DialogContent>
                {/* <DialogContentText>
                    Descreva para facilitar a compreição
                </DialogContentText> */}
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Numero de usario"
                    fullWidth
                    value={numer}
                    onChange={e => setnumer(e.target.value)}
                    error={numer < 1 && status ==true}
                />

                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Pacote (Diario, Semanal ou Mensal)"
                    fullWidth
                    multiline
                    type='numeric'
                    value={pacote}
                    onChange={e => setpacote(e.target.value)}
                    error={pacote < 1 && status ==true}
                />
            </DialogContent>
            <DialogActions>
            <Button  color="primary" onClick={() => CancelS()}>
                Cancel
            </Button>
            <Button  color="primary" onClick={() => Recaregar()}>
                Creditar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}