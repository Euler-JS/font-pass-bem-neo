import React,{useEffect} from 'react';
import { AuthProvider } from './context/auth';
import "./App.css"
import Routes from "./routes/index";



function App() {

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  }, [])

  return (

    <AuthProvider>
      <Routes/>
    </AuthProvider>
    
  
  );
}

export default App;
