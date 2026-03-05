import axios from "axios";

const api = axios.create({

    // baseURL: "https://api.passebem.co.mz/",

    // baseURL: "http://localhost:3334/",
    // baseURL: "https://pass-bem-api-neo.vercel.app/",
    // Usar HTTPS para evitar mixed content errors
    // baseURL: "https://server.manna.software/",
    // Em desenvolvimento, usa o proxy configurado no package.json
    // Em produção, usa a URL completa da API
    // baseURL:"http://wcsg0wosc88kowgc8csgwcs4.194.163.145.253.sslip.io/",
    baseURL:"http://wcsg0wosc88kowgc8csgwcs4.194.163.145.253.sslip.io/"

})


export default api;




