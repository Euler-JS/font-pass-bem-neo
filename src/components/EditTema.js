import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import api from "../services/api";
import ProgressCircle from "./ProgressCircle";

export default function EditTema({open, onClose, tema, onUpdate}) {

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [progress, setProgress] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (tema) {
      setNome(tema.nome || "");
      setDescricao(tema.descricao || "");
    }
  }, [tema]);

  function handleClose() {
    onClose();
    setStatus(false);
  }

  async function handleUpdate() {
    if (nome.trim() === "" || descricao.trim() === "") {
      alert("É obrigatório o preenchimento de todos campos");
      setStatus(true);
      return;
    }

    setStatus(false);

    try {
      setProgress(true);
      const data = { nome, descricao };
      const response = await api.put(`temas/${tema._id}`, data, {
        headers: {
          user: "60b8c16965472a2b1c2e7a32",
        }
      });
      alert(response.data);
      setProgress(false);
      handleClose();
      onUpdate();
    } catch (error) {
      setProgress(false);
      alert(error.response?.data || "Erro ao atualizar tema");
    }
  }

  return (
    <React.Fragment>
      <ProgressCircle Status={progress}/>
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Editar Tema</DialogTitle>
          
          <DialogContent>
            <DialogContentText>
              Atualize o nome e descrição do tema
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="nome"
              label="Nome do Tema"
              fullWidth
              value={nome}
              onChange={e => setNome(e.target.value)}
              error={nome.length < 1 && status === true}
            />

            <TextField
              margin="dense"
              id="descricao"
              label="Descrição do Tema"
              fullWidth
              multiline
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              error={descricao.length < 1 && status === true}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button color="primary" onClick={handleUpdate}>
              Atualizar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
