import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
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
  LinearProgress,
  Chip,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
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
    flexWrap: 'wrap',
  },
  uploadStats: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
  const [uploadProgress, setUploadProgress] = useState({});

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

      const response = await api.post('upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress({ total: progress });
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
        setMessage(`✓ ${files.length} arquivo(s) enviado(s) com sucesso!`);
        setMessageType('success');
        setFiles([]);
        setUploadProgress({});
      }
    } catch (error) {
      setMessage('❌ Erro ao enviar arquivo. Tente novamente.');
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Arquivos Selecionados ({files.length})
                </Typography>
                <Chip
                  label={`${(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              {uploading && (
                <Box mb={2}>
                  <LinearProgress variant="determinate" value={uploadProgress.total || 0} />
                  <Typography variant="caption" align="center" display="block" mt={1}>
                    Progresso: {uploadProgress.total || 0}%
                  </Typography>
                </Box>
              )}

              <List>
                {files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CloudUploadIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(2)} KB`}
                    />
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                      size="small"
                    >
                      <ClearIcon />
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
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  size="large"
                >
                  {uploading ? `Enviando... ${uploadProgress.total || 0}%` : 'Enviar Arquivos'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => document.getElementById('file-input-add').click()}
                  disabled={uploading}
                  startIcon={<AddIcon />}
                  size="large"
                >
                  Adicionar Mais
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setFiles([])}
                  disabled={uploading}
                  startIcon={<ClearIcon />}
                  size="large"
                >
                  Limpar Todos
                </Button>
              </Box>
              <input
                type="file"
                multiple
                onChange={handleChange}
                className={classes.input}
                id="file-input-add"
              />
            </Box>
          </Paper>
        )}

        {uploadedFiles.length > 0 && (
          <Paper className={classes.fileList}>
            <Box p={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Arquivos Enviados ({uploadedFiles.length})
                </Typography>
                <Chip
                  label="Concluído"
                  icon={<CheckCircleIcon />}
                  color="primary"
                  variant="outlined"
                />
              </Box>
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
