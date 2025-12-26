import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory,useParams } from 'react-router-dom'

import api from "../services/api"
import ProgressCircle from "./ProgressCircle";

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 16,
      padding: theme.spacing(1),
    },
  },
  dialogTitle: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '12px 12px 0 0',
    marginTop: -8,
    marginLeft: -8,
    marginRight: -8,
    padding: theme.spacing(2.5),
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
      '&:hover fieldset': {
        borderColor: '#667eea',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#667eea',
      },
    },
  },
  cancelButton: {
    borderRadius: 8,
    padding: '8px 24px',
    textTransform: 'none',
    fontWeight: 600,
  },
  submitButton: {
    borderRadius: 8,
    padding: '8px 24px',
    textTransform: 'none',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
    },
  },
}));

export default function AdA({StatusTheme,  CancelarS}) {

  const classes = useStyles();
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
        <Dialog open={StatusTheme} className={classes.dialog} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Adicionar Tema</DialogTitle>
            
            <DialogContent style={{paddingTop: 24}}>
                <DialogContentText style={{marginBottom: 16, color: '#666'}}>
                    Descreva para facilitar a compreensão
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Nome do Tema"
                    fullWidth
                    variant="outlined"
                    value={tema}
                    onChange={e => settema(e.target.value)}
                    error={tema < 1 && status ==true}
                    className={classes.textField}
                />

                <TextField
                    margin="dense"
                    id="descricao"
                    label="Descrição do Tema"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={descricao}
                    onChange={e => setdescricao(e.target.value)}
                    error={descricao < 1 && status ==true}
                    className={classes.textField}
                />
            </DialogContent>
            <DialogActions style={{padding: '16px 24px'}}>
            <Button className={classes.cancelButton} onClick={() => CancelS()}>
                Cancelar
            </Button>
            <Button className={classes.submitButton} onClick={() => EnviarTema()}>
                Registrar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}