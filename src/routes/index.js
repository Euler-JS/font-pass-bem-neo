import React from 'react';
import {useAuth} from '../context/auth';

import ProgressCircle from "../components/ProgressCircle";



/// rotas da App
import Authroutes from "./auth.routes"
import AppRoutes from "./routes"



const RoutesScreen = ({navigation}) => {

    const {signed, loading} = useAuth()
    

    if(loading){
        return (
 
            <ProgressCircle Status={loading}/>

        )
    }

    return signed? <AppRoutes/>:<Authroutes/>

}

export default RoutesScreen;

