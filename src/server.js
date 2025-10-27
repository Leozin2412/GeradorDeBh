import express from 'express'
import routes from './routes/TSroutes.js'
import config from './config.js'
import cors from 'cors'


const app = express()
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use((req, res, next) => {
    // Substitua pela sua origem frontend em produção:
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    // Ou para qualquer origem durante o desenvolvimento (menos seguro):
    // res.setHeader('Access-Control-Allow-Origin', '*'); 

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Adicione quaisquer cabeçalhos personalizados que você usa
    next();
});


app.use(express.json());//Ativa body pars
app.use(routes)

app.listen(config.port,()=>{
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