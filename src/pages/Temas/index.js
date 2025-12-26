import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PeopleIcon from '@material-ui/icons/People';
import SchoolIcon from '@material-ui/icons/School';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import api from "../../services/api";

import LlistItems from '../listItems';

import Title from '../Title';
import Chart from './Chart';

import Orders from '../../components/OrdersTM';

import ADDTEMA from "../../components/AddTema";
import EDITTEMA from "../../components/EditTema";

import { Avatar } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    '& .MuiListItemIcon-root': {
      color: 'white',
    },
    '& .MuiListItem-button:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#f5f7ff',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-2px)',
    },
  },
  fixedHeight: {
    height: 240,
  },
  addButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: 12,
    padding: theme.spacing(2),
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
    },
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const Detalhes = ['Tema', 'Nᵒ Questões', 'Descrição', 'Temas Presentes', 'temaID', 'temaName', 'vertemas'];

  const [StatusTheme, setStatusTheme] = useState(false)
  const [temas, settemas] = useState([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTema, setSelectedTema] = useState(null)

  function Cancelar(status){

    setStatusTheme(status)
  }

  function handleEditTema(tema) {
    setSelectedTema(tema);
    setEditDialogOpen(true);
  }

  async function handleDeleteTema(tema) {
    if (window.confirm(`Tem certeza que deseja excluir o tema "${tema.nome}"?`)) {
      try {
        await api.delete(`temas/${tema._id}`, {
          headers: {
            user: "60b8c16965472a2b1c2e7a32",
          }
        });
        alert("Tema excluído com sucesso!");
        // Atualizar lista de temas
        const response = await api.get("temas", {
          headers: {
            user: "60b8c16965472a2b1c2e7a32",
          }
        });
        settemas(response.data);
      } catch (error) {
        alert(error.response?.data || "Erro ao excluir tema");
      }
    }
  }

  async function handleUpdateTemas() {
    // Recarregar a lista de temas após edição
    const response = await api.get("temas", {
      headers: {
        user: "60b8c16965472a2b1c2e7a32",
      }
    });
    settemas(response.data);
  }

  

  
  useEffect(() => {
    async function GetTemas(){

      const response = await api.get("temas",{
        headers:{
          user: "60b8c16965472a2b1c2e7a32",

        }
      })
      settemas(response.data)
    }
    GetTemas()
    
  }, [StatusTheme])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List><LlistItems /></List>
        <Divider />

      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        <ADDTEMA StatusTheme={StatusTheme} CancelarS={ (props) => Cancelar(props)}/>
        <EDITTEMA 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)} 
          tema={selectedTema}
          onUpdate={handleUpdateTemas}
        />
        <Container maxWidth="lg" className={classes.container}>

          
           <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={classes.addButton} elevation={0}>
                        <ListItem button onClick={() => setStatusTheme(true)}>
                            <ListItemIcon>
                                <PostAddIcon style={{color: 'white', fontSize: 28}}/>
                            </ListItemIcon>
                            <ListItemText 
                              primary="Novo Tema" 
                              primaryTypographyProps={{
                                style: { fontWeight: 600, fontSize: '1.1rem' }
                              }}
                            />
                        </ListItem>
                    </Paper>
                </Grid> 
            </Grid>

          <Grid container spacing={3}>
              
            {/* Recent Orders */}
            <Grid item xs={12}>
              
                <Orders 
                  StatusTheme={StatusTheme} 
                  data={temas} 
                  Detalhes={Detalhes}
                  onEdit={handleEditTema}
                  onDelete={handleDeleteTema}
                />
              
            </Grid>
            {/* Recent Students*/}
            <Grid item xs={12} md={6} lg={4}>
              <Paper className={classes.paper}>
                <Title>Acessos por Tema</Title>
                <Chart/>                
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}