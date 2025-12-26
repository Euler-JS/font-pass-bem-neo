import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import RefreshIcon from '@material-ui/icons/Refresh';
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
  title: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonGroup: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    marginTop: theme.spacing(2),
  },
  errorChip: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  brokenImageCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  imagePreview: {
    maxWidth: '100px',
    maxHeight: '60px',
    objectFit: 'contain',
    cursor: 'pointer',
  },
  stats: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
  },
  statCard: {
    padding: theme.spacing(2),
    minWidth: '150px',
  },
}));

export default function DeletePerguntas() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [perguntas, setPerguntas] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [checking, setChecking] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [importText, setImportText] = useState('');

  // Lista de IDs conhecidos com problemas (pode ser preenchida)
  const idsConhecidosComProblemas = [
    '6108cc610fa3150013d64ff0', '6108c7060fa3150013d64fc1', '6109144e0fa3150013d6518d',
    '61cc1310d6520f001337bcb6', '610909c40fa3150013d65130', '610a29b10fa3150013d6538f',
    '61d53e7dd6520f001337c95d', '610a22090fa3150013d65336', '610900f10fa3150013d650d2',
    '6108d1d50fa3150013d65006', '610913ad0fa3150013d65183', '610914d10fa3150013d65194',
    '610906990fa3150013d6510c', '610a24580fa3150013d65351', '6108dd7f0fa3150013d6506b',
    '61cb3a3bd6520f001337bb01', '610a23310fa3150013d6534a', '610953660fa3150013d652d2',
    '612624f10fa3150013d66a4f', '610a22b90fa3150013d65340', '610915b20fa3150013d6519e',
    '6108f79f0fa3150013d6507f', '610a291c0fa3150013d65385', '6108d2a80fa3150013d65010',
    '6108d8e70fa3150013d65041', '61090fad0fa3150013d65156', '6108f8710fa3150013d65089',
    '6109090c0fa3150013d65126', '61b9af2080a84b001213cbd7', '610957580fa3150013d652f0',
    '6108da370fa3150013d6504b', '610a27450fa3150013d6536f', '610a25800fa3150013d6535b',
    '6108d3bb0fa3150013d6501c', '6108f94a0fa3150013d65093', '6108d4940fa3150013d65026',
    '6109108d0fa3150013d65160', '6108fb280fa3150013d650a5', '6108fd6c0fa3150013d650b9',
    '61cafb4fd6520f001337b98c', '6109173b0fa3150013d651ad', '61090cd80fa3150013d6513a',
    '63f8ad265e1ddb0013887b7f', '61090f090fa3150013d6514c', '6109023b0fa3150013d650e4',
    '610911650fa3150013d65167', '6108d8020fa3150013d65037', '610949fb0fa3150013d65262',
    '610a26a50fa3150013d65365', '6109548c0fa3150013d652dc', '6108fc990fa3150013d650af',
    '61094e9b0fa3150013d6529a', '61e802cdd6520f001338148b', '6108dbd90fa3150013d6505f',
    '610952c60fa3150013d652cb', '61d69e29d6520f001337cdbe', '610902f30fa3150013d650ee',
    '610a41280fa3150013d653ce', '610a214b0fa3150013d6532c', '610912530fa3150013d65171',
    '610a2aa20fa3150013d65399', '610a1f360fa3150013d65318', '610a44130fa3150013d653ec',
    '610a1e900fa3150013d6530e', '6108db1c0fa3150013d65055', '6108c8090fa3150013d64fcb',
    '610905500fa3150013d65102', '644156f65e1ddb00138eb3ab'
  ];

  // Função para verificar se uma imagem pode ser carregada
  const checkImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      
      // Criar uma requisição fetch para detectar erro 404
      fetch(url, { method: 'HEAD', mode: 'no-cors' })
        .then(response => {
          if (response.status === 404) {
            resolve({ url, status: 'error', statusCode: 404 });
          } else {
            img.onload = () => resolve({ url, status: 'success' });
            img.onerror = () => resolve({ url, status: 'error', statusCode: 'unknown' });
            img.src = url;
          }
        })
        .catch(() => {
          // Se fetch falhar, tentar carregar a imagem normalmente
          img.onload = () => resolve({ url, status: 'success' });
          img.onerror = () => resolve({ url, status: 'error', statusCode: 'unknown' });
          img.src = url;
        });
      
      // Timeout de 10 segundos
      setTimeout(() => {
        if (!img.complete) {
          resolve({ url, status: 'timeout' });
        }
      }, 10000);
    });
  };

  // Carregar perguntas conhecidas com problemas
  const handleCarregarPerguntasConhecidas = async () => {
    setLoading(true);
    setMessage('Carregando perguntas conhecidas com problemas...');
    setMessageType('info');

    try {
      // Buscar todas as perguntas
      const response = await api.get('/questions');
      const todasPerguntas = response.data;

      // Filtrar apenas as perguntas com IDs conhecidos
      const perguntasProblematicas = todasPerguntas.filter(p => 
        idsConhecidosComProblemas.includes(p.id || p._id)
      );

      const perguntasComDetalhes = perguntasProblematicas.map(p => ({
        ...p,
        imagemProblema: p.image || 'Sem imagem',
        tipoErro: 'Erro 404',
        campo: 'Imagem Principal (404 conhecido)'
      }));

      setPerguntas(perguntasComDetalhes);
      setMessage(`Carregadas ${perguntasComDetalhes.length} perguntas com problemas conhecidos de 404.`);
      setMessageType(perguntasComDetalhes.length > 0 ? 'warning' : 'info');
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      setMessage('Erro ao buscar perguntas: ' + (error.response?.data?.error || error.message));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Buscar todas as perguntas e verificar suas imagens
  const handleVerificarPerguntas = async () => {
    setChecking(true);
    setLoading(true);
    setMessage('');
    setPerguntas([]);
    setSelected([]);

    try {
      // Buscar todas as perguntas do sistema
      const response = await api.get('/questions');
      const todasPerguntas = response.data;

      if (!todasPerguntas || todasPerguntas.length === 0) {
        setMessage('Nenhuma pergunta encontrada no sistema.');
        setMessageType('info');
        setLoading(false);
        setChecking(false);
        return;
      }

      setMessage(`Verificando ${todasPerguntas.length} perguntas... Por favor, aguarde.`);
      setMessageType('info');

      // Verificar cada pergunta
      const perguntasComProblemas = [];
      
      for (const pergunta of todasPerguntas) {
        // Verificar imagem principal da pergunta
        if (pergunta.image) {
          const result = await checkImage(pergunta.image);
          if (result.status !== 'success') {
            const tipoErro = result.status === 'timeout' 
              ? 'Timeout' 
              : result.statusCode === 404 
                ? 'Erro 404' 
                : 'Erro ao carregar';
            
            perguntasComProblemas.push({
              ...pergunta,
              imagemProblema: pergunta.image,
              tipoErro,
              campo: 'Imagem Principal'
            });
          }
        }

        // Verificar imagens das alternativas (se existirem)
        if (pergunta.alternativas) {
          for (let i = 0; i < pergunta.alternativas.length; i++) {
            const alt = pergunta.alternativas[i];
            if (alt.image) {
              const result = await checkImage(alt.image);
              if (result.status !== 'success') {
                const tipoErro = result.status === 'timeout' 
                  ? 'Timeout' 
                  : result.statusCode === 404 
                    ? 'Erro 404' 
                    : 'Erro ao carregar';
                
                perguntasComProblemas.push({
                  ...pergunta,
                  imagemProblema: alt.image,
                  tipoErro,
                  campo: `Alternativa ${String.fromCharCode(65 + i)}`
                });
              }
            }
          }
        }
      }

      setPerguntas(perguntasComProblemas);
      
      if (perguntasComProblemas.length === 0) {
        setMessage('✓ Todas as imagens das perguntas estão carregando corretamente!');
        setMessageType('success');
      } else {
        setMessage(`Encontradas ${perguntasComProblemas.length} imagem(s) com problemas em ${new Set(perguntasComProblemas.map(p => p.id)).size} pergunta(s).`);
        setMessageType('warning');
      }
    } catch (error) {
      console.error('Erro ao verificar perguntas:', error);
      setMessage('Erro ao buscar perguntas: ' + (error.response?.data?.error || error.message));
      setMessageType('error');
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  // Selecionar/desselecionar todas
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const uniqueIds = [...new Set(perguntas.map(p => p.id))];
      setSelected(uniqueIds);
    } else {
      setSelected([]);
    }
  };

  // Selecionar/desselecionar uma pergunta
  const handleSelectOne = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // Abrir diálogo de confirmação
  const handleOpenDialog = () => {
    if (selected.length === 0) {
      setMessage('Selecione pelo menos uma pergunta para apagar.');
      setMessageType('warning');
      return;
    }
    setOpenDialog(true);
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Apagar perguntas selecionadas
  const handleApagarPerguntas = async () => {
    setLoading(true);
    setOpenDialog(false);

    try {
      let sucessos = 0;
      let erros = 0;

      for (const id of selected) {
        try {
          await api.delete(`/questions/${id}`);
          sucessos++;
        } catch (error) {
          console.error(`Erro ao apagar pergunta ${id}:`, error);
          erros++;
        }
      }

      if (erros === 0) {
        setMessage(`✓ ${sucessos} pergunta(s) apagada(s) com sucesso!`);
        setMessageType('success');
      } else {
        setMessage(`${sucessos} apagada(s) com sucesso, ${erros} com erro.`);
        setMessageType('warning');
      }
      
      // Remover perguntas apagadas da lista
      setPerguntas(perguntas.filter(p => !selected.includes(p.id)));
      setSelected([]);
    } catch (error) {
      console.error('Erro ao apagar perguntas:', error);
      setMessage('Erro ao apagar perguntas: ' + (error.response?.data?.error || error.message));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Importar IDs manualmente
  const handleImportarIds = () => {
    try {
      // Extrair IDs do texto (suporta vários formatos)
      const regex = /[a-f0-9]{24}/gi;
      const idsEncontrados = importText.match(regex) || [];
      const idsUnicos = [...new Set(idsEncontrados)];

      if (idsUnicos.length === 0) {
        setMessage('Nenhum ID válido encontrado no texto.');
        setMessageType('warning');
        return;
      }

      // Carregar perguntas com esses IDs
      carregarPerguntasPorIds(idsUnicos);
      setOpenImportDialog(false);
      setImportText('');
    } catch (error) {
      setMessage('Erro ao processar IDs: ' + error.message);
      setMessageType('error');
    }
  };

  const carregarPerguntasPorIds = async (ids) => {
    setLoading(true);
    setMessage(`Carregando ${ids.length} perguntas...`);
    setMessageType('info');

    try {
      const response = await api.get('/questions');
      const todasPerguntas = response.data;

      const perguntasEncontradas = todasPerguntas.filter(p => 
        ids.includes(p.id || p._id)
      );

      const perguntasComDetalhes = perguntasEncontradas.map(p => ({
        ...p,
        imagemProblema: p.image || 'Sem imagem',
        tipoErro: 'Importado manualmente',
        campo: 'Imagem com problema'
      }));

      setPerguntas(perguntasComDetalhes);
      setMessage(`${perguntasEncontradas.length} de ${ids.length} perguntas encontradas.`);
      setMessageType(perguntasEncontradas.length > 0 ? 'warning' : 'info');
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      setMessage('Erro ao buscar perguntas: ' + (error.response?.data?.error || error.message));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const uniquePerguntas = perguntas.reduce((acc, curr) => {
    if (!acc.find(p => p.id === curr.id)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper className={classes.paper}>
        <Box className={classes.title}>
          <Typography variant="h4" component="h1">
            Delete Perguntas com Problemas de Imagem
          </Typography>
          <Tooltip title="Atualizar lista">
            <IconButton 
              color="primary" 
              onClick={handleVerificarPerguntas}
              disabled={checking}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {message && (
          <Alert severity={messageType} style={{ marginBottom: '16px' }}>
            {message}
          </Alert>
        )}

        <Box className={classes.stats}>
          <Paper className={classes.statCard}>
            <Typography variant="h6" color="primary">
              {uniquePerguntas.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Perguntas com Problemas
            </Typography>
          </Paper>
          <Paper className={classes.statCard}>
            <Typography variant="h6" color="secondary">
              {selected.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Selecionadas
            </Typography>
          </Paper>
          <Paper className={classes.statCard}>
            <Typography variant="h6" style={{ color: '#f44336' }}>
              {perguntas.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total de Problemas
            </Typography>
          </Paper>
        </Box>

        <Box className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            startIcon={checking ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleVerificarPerguntas}
            disabled={checking || loading}
          >
            {checking ? 'Verificando...' : 'Verificar Todas'}
          </Button>

          <Button
            variant="contained"
            style={{ backgroundColor: '#ff9800', color: 'white' }}
            startIcon={<BrokenImageIcon />}
            onClick={handleCarregarPerguntasConhecidas}
            disabled={loading}
          >
            Carregar 68 Perguntas com 404
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenImportDialog(true)}
            disabled={loading}
          >
            Importar IDs
          </Button>
          
          {perguntas.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={handleOpenDialog}
              disabled={selected.length === 0 || loading}
            >
              Apagar Selecionadas ({selected.length})
            </Button>
          )}
        </Box>

        {loading && !checking && (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        )}

        {!loading && perguntas.length > 0 && (
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < uniquePerguntas.length}
                      checked={uniquePerguntas.length > 0 && selected.length === uniquePerguntas.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Pergunta</TableCell>
                  <TableCell>Campo</TableCell>
                  <TableCell>Tipo de Erro</TableCell>
                  <TableCell>URL da Imagem</TableCell>
                  <TableCell>Tema</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uniquePerguntas.map((pergunta) => {
                  const isSelected = selected.indexOf(pergunta.id) !== -1;
                  const problemasCount = perguntas.filter(p => p.id === pergunta.id).length;
                  
                  return (
                    <TableRow 
                      key={pergunta.id}
                      hover
                      onClick={() => handleSelectOne(pergunta.id)}
                      role="checkbox"
                      selected={isSelected}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell>{pergunta.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap style={{ maxWidth: '300px' }}>
                          {pergunta.question || pergunta.texto || 'Sem texto'}
                        </Typography>
                        {problemasCount > 1 && (
                          <Chip 
                            size="small" 
                            label={`${problemasCount} problemas`}
                            color="secondary"
                            style={{ marginTop: '4px' }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {perguntas
                          .filter(p => p.id === pergunta.id)
                          .map(p => p.campo)
                          .join(', ')}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={<BrokenImageIcon />}
                          label={pergunta.tipoErro}
                          className={classes.errorChip}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="caption" 
                          style={{ 
                            maxWidth: '200px', 
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {pergunta.imagemProblema}
                        </Typography>
                      </TableCell>
                      <TableCell>{pergunta.tema_nome || pergunta.tema || 'N/A'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && !checking && perguntas.length === 0 && message && (
          <Box textAlign="center" py={5}>
            <ImageIcon style={{ fontSize: '4rem', color: '#ccc', marginBottom: '16px' }} />
            <Typography variant="body1" color="textSecondary">
              Clique em "Verificar Perguntas" para começar a análise
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja apagar {selected.length} pergunta(s)?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleApagarPerguntas} 
            color="secondary" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Apagar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de importação de IDs */}
      <Dialog 
        open={openImportDialog} 
        onClose={() => setOpenImportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Importar IDs de Perguntas</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: '16px' }}>
            Cole a lista de IDs das perguntas (pode incluir texto, serão extraídos automaticamente os IDs MongoDB válidos):
          </DialogContentText>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Cole aqui a lista com os IDs das perguntas..."
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Typography variant="caption" color="textSecondary" style={{ marginTop: '8px', display: 'block' }}>
            Exemplo: 6108cc610fa3150013d64ff0, 6108c7060fa3150013d64fc1...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImportDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleImportarIds} 
            color="primary" 
            variant="contained"
          >
            Importar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
