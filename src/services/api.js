import axios from "axios";

const api = axios.create({

    // baseURL: "https://api.passebem.co.mz/",

    // baseURL: "http://localhost:3333/",
    // baseURL: "https://pass-bem-api-neo.vercel.app/",
    baseURL: "http://server.manna.software:3333/",

})


export default api;




