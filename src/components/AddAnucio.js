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

export default function ADDTEMA({StatusTheme, CancelarS}) {

    function Teste(){

        CancelarS(false)
        setnome("")
        setlink("")
        setvalidade("")
        setempresa("")
        setcontacto("")
        setfoto(null)
    }

  const history = useHistory();

  const tema = localStorage.getItem("temaName")
  const tema_id = localStorage.getItem("temaID")

  const [foto, setfoto] = React.useState(null)
  const [progress, setprogress] = useState(false)

  const [nome, setnome] = useState("")
  const [empresa, setempresa] = useState("")
  const [validade, setvalidade] = useState(new Date().toISOString().slice(0,10))
  const [contacto, setcontacto] = useState("")
  const [link, setlink] = useState("")

  const [statusText , setstatusText] = useState(false)


  const previwImg = useMemo(() => {
      return foto ? URL.createObjectURL(foto) : null
  },[foto])


  useEffect(() => {
    async function GetData(){
        const response = await api.get("/t",{
            headers:{
              user: "60b6aff95361df172869306b",
            }
          })
    }
    
  }, [])
  
  
  async function EnviarAnucio(){

    if(!foto){
        alert("Toda questão deve ter uma foto")
        //return
    }

    else if(nome.trim() == "" || empresa.trim() == "" || link.trim() == ""){
        setstatusText(true)
        alert("É obrigatório o preenchimento de todos campos")
        return
    }
    setstatusText(false) 

    const data = new FormData();

    data.append("imagem", foto)
    data.append("nome", nome)
    data.append("validade", validade)
    data.append("link",link)
    data.append("contacto",contacto)


    try{
        setprogress(true)
        const response = await api.post("/anucios", data,{
            headers:{
                tema_id:tema_id,
            }
        });

        setprogress(false)

        Teste()
        
    }catch{
        setprogress(false)
        alert("Anúncio nao salvo")
    }
    
  }

  return (
    <React.Fragment>
        <ProgressCircle Status={progress}/>
      <div>
        <Dialog open={StatusTheme}  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Anúncio</DialogTitle>
            <DialogContent>
            <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Nome"
                    fullWidth
                    alue={nome}
                    onChange={e => setnome(e.target.value)}
                    error={nome < 1 && statusText==true}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Link do Anúncio"
                    fullWidth
                    value={link}
                    onChange={e => setlink(e.target.value)}
                    error={link < 1 && statusText==true}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Empresa"
                    fullWidth
                    value={empresa}
                    onChange={e => setempresa(e.target.value)}
                    error={empresa < 1 && statusText==true}
                />
            </DialogContent>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Contacto"
                    fullWidth
                    value={contacto}
                    onChange={e => setcontacto(e.target.value)}
                    error={contacto < 1 && statusText==true}
                />

                <TextField
                    autoFocus
                    margin="dense"
                    type='date'
                    id="validade"
                    label="Validade do Anúncio"
                    fullWidth
                    value={validade}
                    onChange={e => setvalidade(e.target.value)}
                    error={validade < 1 && statusText==true}
                />
                
                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}> */}
     
                        {/* <MobileDatePicker
                        label="Data de validade"
                        inputFormat="MM/dd/yyyy"
                        value={validade}
                        onChange={e => setvalidade(e)}
                        renderInput={(params) => <TextField style={{width:200, height:200}} {...params} />}
                        /> */}
                        
                    {/* </Stack>
                    </LocalizationProvider> */}

                    

                <label id="foto" 
                style={{backgroundImage: `url(${previwImg})`}}
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
                
                
            </DialogContent>
            <DialogActions>
            <Button  color="primary" onClick={() => Teste()}>
                Cancel
            </Button>
            <Button  color="primary" onClick={() => EnviarAnucio()}>
                Registrar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}

