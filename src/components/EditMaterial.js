import React, {useState, useMemo, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import AddCircleIcon  from '@material-ui/icons/AddCircle';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

import ProgressCircle from "./ProgressCircle";

import api from "../services/api";

const useStyles = makeStyles((theme) => ({

    large: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  }));



export default function EditMaterial({Status, Restart, materialData, onUpdate}) {
    
    const classes = useStyles();


    const categorias = [
        {name:"A1", numero:2, id:1}, 
        {name:"B", numero:2, id:2}, 
        {name:"C1",numero:2, id:3}, 
        {name:"C", numero:2, id:4}]

    const [modulos, setmodulos] = useState([])

    const [foto, setfoto] = React.useState(null)

    const [nome, setnome] = useState("")
    const [pages, setpages] = useState("")
    const [partilhadas, setPartilhadas] = useState([])
    const [Categoria, setCategoria] = useState([])
    const [progress, setprogress] = useState(false)

    const [statusV, setstatusV] = useState(false)

    // Preencher os dados quando o material for carregado
    useEffect(() => {
        if(materialData && Status) {
            setnome(materialData.name || "")
            setpages(materialData.pages || "")
            
            // Preencher categorias selecionadas
            if(materialData.categoria) {
                const cats = materialData.categoria.split(',').map(cat => 
                    categorias.find(c => c.name === cat.trim())
                ).filter(Boolean);
                setCategoria(cats);
            }
            
            // Preencher módulos selecionados
            if(materialData.modulos && Array.isArray(materialData.modulos)) {
                setPartilhadas(materialData.modulos);
            }
        }
    }, [materialData, Status])

    function Clear(){
        setnome("")
        setpages("")
        setfoto(null)
        setCategoria([])
        setPartilhadas([])
        Restart(false)
        setstatusV(false)
    }

  
  const previwImg = useMemo(() => {
      if(foto) return URL.createObjectURL(foto)
      if(materialData?.imagem) return materialData.imagem
      return null
  },[foto, materialData])

  useEffect(() => {
    async function GetModulos(){
        const response = await api.get("modulos",{
            headers:{
              user: "60b6aff95361df172869306b",
            }
          })
          setmodulos(response.data)
         
    }
    if(Status)GetModulos()
    
  },[Status])

 async function AtualizarMaterial(){
     
     if(nome.trim() =="" || pages.trim() ==""){
         setstatusV(true)
     }
     else{
        setstatusV(false)

        try{

            let partilha = []

            await partilhadas.map((item, index )=> {
                partilha.push(item._id)
            })

            let Categorias = []

            await Categoria.map((item, index )=> {
                Categorias.push(item.name)
            })
            const data = new FormData();

            data.append("nome", nome)
            data.append("pages", pages)
            if(foto) {
                data.append("imagem", foto)
            }
            data.append("categoria", Categorias)
            data.append('modulos', partilha)

            setprogress(true)

            const response = await api.put(`/material/${materialData._id}`, data,{
                headers:{
                    user: "60ca205793351fb15cadd10e",
                }
            })
            setprogress(false)
            alert(response.data.message || "Material atualizado com sucesso!")
            Clear()
            if(onUpdate) onUpdate()
        }catch(error){
            setprogress(false)
            alert(error?.response?.data?.message || error?.message || "Erro ao atualizar material")
        }

     }
 }

  return (
    <React.Fragment>
        <ProgressCircle Status={progress}/>
      <div>
        <Dialog open={Status }  aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" style={{alignSelf:"center"}}>Editar Material</DialogTitle>
                <Avatar style={{alignSelf:"center", opacity:1}} src={previwImg} className={classes.large}/>
                <label id="perfil" 
                    className={foto?.filename ? "temfoto": ""}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nome"
                        type="file"
                        onChange={(event) => setfoto(event.target.files[0])}
                        
                    />
                    <p> <AddCircleIcon fontSize="large" /></p>
                    
                </label>
                <DialogTitle id="form-dialog-title" style={{alignSelf:"center"}}>{foto?.name}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="material"
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
                    id="pages"
                    label="Numero de paginas"
                    fullWidth
                    value={pages}
                    onChange={e => setpages(e.target.value)}
                    error={pages.trim() < 1 && statusV==true} 
                />

                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={categorias}
                    value={Categoria}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => {setCategoria(value)}}
                    filterSelectedOptions
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        //variant="outlined"
                        label="Partilhar com Categorias"
                        placeholder="Selecione Categorias"
                    />
                    )}
                />

                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={modulos}
                    value={partilhadas}
                    getOptionLabel={(option) => option?.nome}
                    onChange={(event, value) => {setPartilhadas(value)}}
                    filterSelectedOptions
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        //variant="outlined"
                        label="Partilhar com modulos"
                        placeholder="Selecione modulos"
                    />
                    )}
                />
            
            </DialogContent>

            <DialogActions>
            <Button  color="primary" onClick={() => Clear()}>
                Cancelar
            </Button>
            <Button  color="primary" onClick={() => AtualizarMaterial()}>
                Atualizar
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    </React.Fragment>
  );
}
