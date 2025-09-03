import React, {useState, useMemo , useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useHistory,useParams } from 'react-router-dom'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { Grid } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import api from "../services/api";
import ProgressCircle from "./ProgressCircle";

export default function ADDNotification({StatusTheme, CancelarS, listPushTokens}) {


  const [foto, setfoto] = React.useState(null)
  const [progress, setprogress] = useState(false)

  const [title, settitle] = useState("")
  const [message, setmessage] = useState("")

  const [statusText , setstatusText] = useState(false)

  const previwImg = useMemo(() => {
      return foto ? URL.createObjectURL(foto) : null
  },[foto])
  
  async function Clear(){
    settitle('')
    setmessage('')
    setstatusText(false)

    CancelarS(false)
  }
  
  async function SendNotif(){

    if(title.length < 1 || message.length < 1){
        setstatusText(true)
        return
    }
    setstatusText(false)

    // const data = new FormData();
    // data.append("imagem", foto)
    // data.append("title", title)
    // data.append("message", message)
    // data.append("listPushTokens", ["ExponentPushToken[MPq-3ZD3RKM_YA62peA5Zm]"])


    const data = {
        title: title,
        message: message,
        listPushTokens: listPushTokens,
        body:message
    }

    try{
        const response = await api.post('/Sendnotifications',data)

        alert(response.data?.message)
    }catch(err){
        alert("Ocorreu um erro ao  enviar a notificação.")
    }
    
  }

  
  return (
    <React.Fragment>
        <ProgressCircle Status={progress}/>
      <div>
        <Dialog open={StatusTheme}  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Notificação</DialogTitle>
            <DialogContent>
            <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Título"
                    fullWidth
                    alue={title}
                    onChange={e => settitle(e.target.value)}
                    error={title < 1 && statusText==true}
                    required
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Mensagen"
                    fullWidth
                    value={message}
                    onChange={e => setmessage(e.target.value)}
                    error={message < 1 && statusText==true}
                    multiline
                    rows={4}
                    required
                />
            </DialogContent>
            <DialogContent>

                <label id="foto" 
                style={{backgroundImage: `url(${previwImg})`}}
                className={foto ? "temfoto": ""}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        type="file"
                        onChange={(event) => setfoto(event.target.files[0])}
                        
                    />
                    <p> <PhotoCameraIcon/></p>
                    
                </label>
                
            </DialogContent>
            <DialogActions>
            <Button  color="primary" onClick={() => Clear()}>
                Cancel
            </Button>
            <Button  color="primary" onClick={() => SendNotif()}>
                Notificar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}

