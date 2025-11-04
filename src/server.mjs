import express from 'express'
import routes from './routes/TSroutes.js'
import config from './config.js'
import cors from 'cors'


const app = express()
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors({
    exposedHeaders: ['Content-Disposition'] // <--- Adicione esta linha!
}));
app.use((req, res, next) => {
    // Substitua pela sua origem frontend em produção:
    const allowedOrigin=process.env.FRONTEND_URL ||"http://127.0.0.1:5500"
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    // Ou para qualquer origem durante o desenvolvimento (menos seguro):
    // res.setHeader('Access-Control-Allow-Origin', '*'); 

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Adicione quaisquer cabeçalhos personalizados que você usa
    next();
});


app.use(express.json());//Ativa body pars
app.use(routes)
 export default app