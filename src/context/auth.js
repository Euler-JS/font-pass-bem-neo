import React,{createContext, useState, useEffect, useContext} from 'react';

import api from '../services/api';


const AuthConteext = createContext({});

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    ///sessionStorage.clear()

    useEffect(() => {
        async function loadStorage() {

            const storageUser = await sessionStorage.getItem("@PBAuth:user")
            const storageToken =  await sessionStorage.getItem("@PBAuth:token")

            if(storageUser && storageToken){
                setUser(JSON.parse(storageUser))
                setLoading(false)

                api.defaults.headers.Authorization = storageToken;
            }
            else setLoading(false)
        }

        loadStorage()
    }, [])

    function MergeData(update){

        
        setUser(update)
        sessionStorage.mergeItem("@PBAuth:user", JSON.stringify(update))
    }

    function LogOut(){
        sessionStorage.clear().then(
            setUser(null)
        )

    }
    
    async function login({email, senha}){


        try{
            const {data} = await api.get("/usersdata", {
                headers:{
                    email:email,
                    senha:senha,
                }
            })

            setUser(data)
            await sessionStorage.setItem("@PBAuth:user", JSON.stringify(data))
            await sessionStorage.setItem("@PBAuth:token", (data._id))

            api.defaults.headers.Authorization = data._id;
            
        }catch(err ){
            alert(
           "PassBem Informa",
           `${err}`)
        console.log(err)}
    }


    return(
        <AuthConteext.Provider value={{signed:!!user ,user, login, loading, LogOut, MergeData}}>
        {children}
        </AuthConteext.Provider>
    )
    
};

export function useAuth(){
    const context = useContext(AuthConteext)

    return context;
}