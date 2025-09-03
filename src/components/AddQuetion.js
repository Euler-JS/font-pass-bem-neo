import React, {useState, useMemo , useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useHistory,useParams } from 'react-router-dom'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { Grid } from '@material-ui/core';

import api from "../services/api";
import ProgressCircle from "./ProgressCircle";

export default function ADDTEMA({StatusTheme, CancelarS}) {

    function Teste(){

        CancelarS(false)
        setquestao("")
        setalternativa_correta("")
        setopcao1("")
        setopcao2("")
        setopcao3("")
        setfoto(null)
    }

  const history = useHistory();

  const tema = localStorage.getItem("temaName")
  const tema_id = localStorage.getItem("temaID")

  const [foto, setfoto] = React.useState(null)
  const [progress, setprogress] = useState(false)

  const [questao, setquestao] = useState("")
  const [alternativa_correta, setalternativa_correta] = useState("")

  const [shareds, setShareds] = useState([])

  const [partilhadas, setPartilhadas] = useState([])

  const [opcao1, setopcao1] = useState("")
  const [opcao2, setopcao2] = useState("")
  const [opcao3, setopcao3] = useState("")

  const [statusText , setstatusText] = useState(false)


  const previwImg = useMemo(() => {
      return foto ? URL.createObjectURL(foto) : null
  },[foto])


  useEffect(() => {
    async function GetModulos(){
        const response = await api.get("modulos",{
            headers:{
              user: "60b6aff95361df172869306b",
            }
          })
          setShareds(response.data)
         
    }
    GetModulos()
    
  }, [])
  
  
  async function EnviarQuestao(){
    if(!foto){
        alert("Toda questão deve ter uma foto")
        //return
    }

    else if(questao.trim() == "" || alternativa_correta.trim() == ""
        || opcao1.trim() == "" || opcao2.trim() == "" || opcao3.trim() == ""){
        setstatusText(true)
        alert("É obrigatório o preenchimento de todos campos")
        return
    }
    setstatusText(false)

    let partilha = []

    await partilhadas.map((item, index )=> {
        partilha.push(item._id)
    })

    const data = new FormData();

    data.append("tema", tema)
    data.append("imagem", foto)
    data.append("questao", questao)
    data.append("alternativa_correta", alternativa_correta)
    data.append("incorecta_alternativas", [opcao1,"1", opcao2,"1", opcao3])
    data.append("partilhada",partilha)

    try{
        setprogress(true)
        const response = await api.post("questoes", data,{
            headers:{
                temaid:tema_id,
            }
        });

        setprogress(false)

        Teste()
        
    }catch{
        setprogress(false)
        alert(1)
    }
    
  }

  return (
    <React.Fragment>
        <ProgressCircle Status={progress}/>
      <div>
        <Dialog open={StatusTheme}  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Questão</DialogTitle>
            <DialogContent>
            <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Questão aqui"
                    fullWidth
                    alue={questao}
                    onChange={e => setquestao(e.target.value)}
                    error={questao < 1 && statusText==true}
                />
                <DialogContentText>
                    Adicione  4 opções, uma delas correctas
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Opção correcta"
                    fullWidth
                    value={alternativa_correta}
                    onChange={e => setalternativa_correta(e.target.value)}
                    error={alternativa_correta < 1 && statusText==true}
                />
            </DialogContent>
            <DialogContent>
                <DialogContentText>
                    Adicione  3 opções erradas
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Opção 1"
                    fullWidth
                    value={opcao1}
                    onChange={e => setopcao1(e.target.value)}
                    error={opcao1 < 1 && statusText==true}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Opção 2"
                    fullWidth
                    value={opcao2}
                    onChange={e => setopcao2(e.target.value)}
                    error={opcao2 < 1 && statusText==true}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Opção 3"
                    fullWidth
                    required
                    value={opcao3}
                    onChange={e => setopcao3(e.target.value)}
                    error={opcao3 < 1 && statusText==true}
                />
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={shareds}
                        getOptionLabel={(option) => option.nome}
                        onChange={(event, value) => {
                            setPartilhadas(value);
                                    }}
                        filterSelectedOptions
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            //variant="outlined"
                            label="Partilhar com "
                            placeholder="Selecione modulos ou teste geral"
                        />
                        )}
                    /> 
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
            <Button  color="primary" onClick={() => EnviarQuestao()}>
                Registrar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}

