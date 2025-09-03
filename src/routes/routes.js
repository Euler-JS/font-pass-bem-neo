import React from "react";
import { BrowserRouter, Route, Switch  } from "react-router-dom";


import Dasbord from "../pages/Dasbord";
import Compras from "../pages/Compras"
import Estudantes from "../pages/Estudantes";
import Docentes from "../pages/Docentes";
import Temas from "../pages/Temas";
import ModulosVideo from "../pages/ModulosVideo";
import MaterialDidatico from "../pages/MaterilaDidatico"
import Escolas from "../pages/Escolas";
import Anucios from "../pages/Anucios/index"

import {useAuth} from '../context/auth';
// Janelas secumdarias
import VerThema from "../pages/Temas/VerThema";
import VerModulo from "../pages/ModulosVideo/VerModulo";

export default function Routes(){

    const {user} = useAuth()
    
    return(
        <BrowserRouter>

            {user?.admin ? (
                <Switch>
                
                <Route path="/" exact component={Dasbord}/>
                <Route path="/dasbords" exact component={Dasbord}/>
                <Route path="/compras" exact component={Compras}/>
                <Route path="/estudantes" exact component={Estudantes}/>
                <Route path="/docentes" exact component={Docentes}/>
                <Route path="/temas" exact component={Temas}/>
                <Route path="/modulos" exact component={ModulosVideo}/>
                <Route path="/MaterialDidatico" exact component={MaterialDidatico}/>
                <Route path="/escolas" exact component={Escolas}/>
                <Route path="/anucios" exact component={Anucios}/>

                <Route path="/vertemas" exact component={VerThema}/>
                <Route path="/vermodulos" exact component={VerModulo}/>
            </Switch>
            ): (
                <Switch>
                    <Route path="/" exact component={ModulosVideo}/>
                    <Route path="/vertemas" exact component={VerThema}/>
                    <Route path="/vermodulos" exact component={VerModulo}/>
                    <Route path="/compras" exact component={Compras}/>
                </Switch>
            )}
            
        </BrowserRouter>
    )
}


