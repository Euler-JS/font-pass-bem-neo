import React ,{useState}from 'react';
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

import PersonAddAlt1Icon from '@material-ui/icons/PersonAdd';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Orders from './Orders';

import AddMaterial from "../../components/AddMaterial";
import EditMaterial from "../../components/EditMaterial";

import Chart from './Chart';

import ListItems from '../listItems';

import Title from '../Title';


import api from "../../services/api";

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
const COLORS = ['#8884d8', '#00C49F',];


const Detalhes = ['Material', 'Categoria', 'Módulo', 'Matererias Cadastrados', 'temaID', 'temaName', 'vermateril'];



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
  },
  fixedHeight: {
    height: 240,
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

  const [Statusnew, setStatusnew] = useState(false);
  const [StatusEdit, setStatusEdit] = useState(false);
  const [StatusTheme, setStatusTheme] = useState(false)
  const [materil, setMaterial] = useState([])
  const [selectedMaterial, setSelectedMaterial] = useState(null)


  React.useEffect(() => {
    async function AllMaterial(){

      try{
        const response = await api.get("/material")
        setMaterial(response?.data?.value)
      }catch{}
    }

      if(!Statusnew && !StatusEdit)AllMaterial()
    
  }, [Statusnew, StatusEdit])

  const handleEdit = (material) => {
    console.log("Editando material:", material);
    setSelectedMaterial(material);
    setStatusEdit(true);
  }

  const handleDelete = async (material) => {
    try {
      const response = await api.delete(`/material/${material._id}`, {
        headers:{
          user: "60ca205793351fb15cadd10e",
        }
      });
      alert(response.data.message || "Material excluído com sucesso!");
      // Recarregar a lista
      const materialsResponse = await api.get("/material");
      setMaterial(materialsResponse?.data?.value);
    } catch(error) {
      alert(error?.response?.data?.message || error?.message || "Erro ao excluir material");
    }
  }

  const handleUpdate = async () => {
    // Recarregar a lista após atualização
    try {
      const response = await api.get("/material");
      setMaterial(response?.data?.value);
    } catch(error) {
      console.error("Erro ao recarregar materiais:", error);
    }
  }

  

  
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
        <List><ListItems/></List>
        <Divider />
        
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        <AddMaterial Status={Statusnew}  Restart={(props) => setStatusnew(props)}/>
        <EditMaterial 
          Status={StatusEdit} 
          Restart={(props) => setStatusEdit(props)} 
          materialData={selectedMaterial}
          onUpdate={handleUpdate}
        />

        <Container maxWidth="lg" className={classes.container}>

        <Grid container spacing={3}>
                <Grid item xs={12} md={2} lg={3}>
                    <Paper  style={{ display:"flex", justifyContent:"center"}}>
                        <ListItem button onClick={() => setStatusnew(true)}>
                            <ListItemIcon>
                                <PersonAddAlt1Icon />
                            </ListItemIcon>
                            <ListItemText primary="Adicionar Arquivo de Apoio" />
                        </ListItem>
                    </Paper>
                </Grid> 
            </Grid>
          
          <Grid container spacing={2}>

            {/* Recent Orders */}
            <Grid item xs={12}>
              
                <Orders 
                  StatusTheme={StatusTheme} 
                  data={materil} 
                  Detalhes={Detalhes}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              
            </Grid>
            {/* Chart */}
            <Grid item xs={12} md={6} lg={4}>
              <Paper className={classes.paper}>
                <Title>Escolas</Title>
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