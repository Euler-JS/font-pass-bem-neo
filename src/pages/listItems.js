import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import SchoolIcon from '@material-ui/icons/School';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useHistory,useParams } from 'react-router-dom';

import {useAuth} from '../context/auth';



export default function Chart() {

  const {user} = useAuth()

  const history = useHistory();

  

  return (
    <React.Fragment>
      {user?.admin ? (
              <div>
              <ListItem button onClick={() => history.push("dasbords")}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button onClick={() => history.push("compras")}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Compras Recentes" />
              </ListItem>
              <ListItem button onClick={() => history.push("anucios")}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Anúncios" />
              </ListItem>
              <ListItem button onClick={() => history.push("estudantes")}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Estudantes" />
              </ListItem>
              <ListItem button onClick={() => history.push("escolas")}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Escolas" />
              </ListItem>
              <ListItem button onClick={() => history.push("docentes")}>
                <ListItemIcon>
                  <GroupWorkIcon />
                </ListItemIcon>
                <ListItemText primary="Docentes" />
              </ListItem>
              <ListItem button onClick={() => history.push("temas")}>
                <ListItemIcon>
                  <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Temas" />
              </ListItem>
              <ListItem button onClick={() => history.push("modulos")}>
                <ListItemIcon>
                  <OndemandVideoIcon  />
                </ListItemIcon>
                <ListItemText primary="Modulos" />
              </ListItem>
              <ListItem button onClick={() => history.push("MaterialDidatico")}>
                <ListItemIcon>
                  <OndemandVideoIcon  />
                </ListItemIcon>
                <ListItemText primary="Material Didatico" />
              </ListItem>
              <ListItem button onClick={() => history.push("upload")}>
                <ListItemIcon>
                  <CloudUploadIcon  />
                </ListItemIcon>
                <ListItemText primary="Upload Arquivos" />
              </ListItem>
            </div>
      ):(
        <React.Fragment>
          <ListItem button onClick={() => history.push("/")}>
          <ListItemIcon>
            <OndemandVideoIcon  />
          </ListItemIcon>
          <ListItemText primary="Modulos" />
        </ListItem>
        
        <ListItem button onClick={() => history.push("compras")}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Compras Recentes" />
              </ListItem>

        </React.Fragment>
        
    )}
    </React.Fragment>
  );
}