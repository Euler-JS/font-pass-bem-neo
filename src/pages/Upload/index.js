import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  uploadArea: {
    border: '2px dashed #1976d2',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5',
      borderColor: '#1565c0',
    },
  },
  uploadAreaDragActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1565c0',
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    fontSize: '4rem',
    color: '#1976d2',
    marginBottom: theme.spacing(2),
  },
  fileList: {
    marginTop: theme.spacing(3),
  },
  successIcon: {
    color: '#4caf50',
  },
  errorIcon: {
    color: '#f44336',
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'center',
  },
}));

export default function Upload() {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage('Selecione pelo menos um arquivo');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          ...files.map((file) => ({
            name: file.name,
            size: file.size,
            date: new Date().toLocaleString('pt-BR'),
            status: 'success',
          })),
        ]);
        setMessage(`${files.length} arquivo(s) enviado(s) com sucesso!`);
        setMessageType('success');
        setFiles([]);
      }
    } catch (error) {
      setMessage('Erro ao enviar arquivo. Tente novamente.');
      setMessageType('error');
      console.error('Erro ao fazer upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (index) => {
    setSelectedFile(index);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (selectedFile !== null) {
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((_, i) => i !== selectedFile)
      );
    }
    setOpenDialog(false);
    setSelectedFile(null);
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>
          Upload de Arquivos
        </Typography>

        {message && (
          <Alert severity={messageType} style={{ marginBottom: 16 }}>
            {message}
          </Alert>
        )}

        <Box
          className={`${classes.uploadArea} ${
            dragActive ? classes.uploadAreaDragActive : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleChange}
            className={classes.input}
            id="file-input"
          />
          <label
            htmlFor="file-input"
            style={{
              cursor: 'pointer',
              display: 'block',
            }}
          >
            <CloudUploadIcon className={classes.uploadIcon} />
            <Typography variant="h6" gutterBottom>
              Arraste arquivos aqui ou clique para selecionar
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, etc.
            </Typography>
          </label>
        </Box>

        {files.length > 0 && (
          <Paper className={classes.fileList}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Arquivos Selecionados ({files.length})
              </Typography>
              <List>
                {files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(2)} KB`}
                    />
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>

              <Box className={classes.buttonGroup}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                  startIcon={uploading ? <CircularProgress size={20} /> : null}
                >
                  {uploading ? 'Enviando...' : 'Enviar Arquivos'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setFiles([])}
                  disabled={uploading}
                >
                  Limpar
                </Button>
              </Box>
            </Box>
          </Paper>
        )}

        {uploadedFiles.length > 0 && (
          <Paper className={classes.fileList}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Arquivos Enviados
              </Typography>
              <List>
                {uploadedFiles.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {file.status === 'success' ? (
                        <CheckCircleIcon className={classes.successIcon} />
                      ) : (
                        <ErrorIcon className={classes.errorIcon} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(2)} KB - ${file.date}`}
                    />
                    <IconButton edge="end" onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este arquivo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="primary" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
