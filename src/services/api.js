import axios from "axios";

const api = axios.create({

    // baseURL: "https://api.passebem.co.mz/",

    // baseURL: "http://localhost:3333/",
    // baseURL: "https://pass-bem-api-neo.vercel.app/",
    // Usar HTTPS para evitar mixed content errors
    // baseURL: "https://server.manna.software/",
    // Em desenvolvimento, usa o proxy configurado no package.json
    // Em produção, usa a URL completa da API
    baseURL:"http://mowosocw4sgwsk84kw4ks40c.62.171.183.132.sslip.io/",

})


export default api;




