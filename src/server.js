import express from 'express'
import routes from './routes/TSroutes.js'
import config from './config.js'
import cors from 'cors'


const app = express()

app.use(cors({
    origin:"*",
    exposedHeaders: ['Content-Disposition']
}))

app.use(express.json());//Ativa body pars
app.use(routes)

app.listen(config.port,config.host,()=>{
    console.log(`Servidor rodando em ${config.host}`)
})






/**CREATE TABLE TimeSheet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    NTradsul VARCHAR(50) NOT NULL,
    DtInicial DATETIME NOT NULL,
    DtFinal DATETIME NOT NULL, -- Adicionei DtFinal aqui
    Descricao TEXT,
    TpIncidencia VARCHAR(50) NOT NULL,
    Executante VARCHAR(50) NOT NULL
); */