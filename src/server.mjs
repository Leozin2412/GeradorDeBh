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
/* app.use((req, res, next) => {
    // Substitua pela sua origem frontend em produção:
    const allowedOrigin=process.env.FRONTEND_URL ||"https://geradordebh.netlify.app/"
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    // Ou para qualquer origem durante o desenvolvimento (menos seguro):
    // res.setHeader('Access-Control-Allow-Origin', '*'); 

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Adicione quaisquer cabeçalhos personalizados que você usa
    next();
}); */
// --- NOVA CONFIGURAÇÃO CORS ---
const allowedFrontendUrl = process.env.FRONTEND_URL || "https://geradordebh.netlify.app"; // Remova a barra final aqui!
const localDevelopmentOrigins = [
    "http://127.0.0.1:5500", // Live Server
    "http://localhost:3000",  // Exemplo de outras origens de desenvolvimento
    "http://localhost:5173"   // Exemplo de outras origens de desenvolvimento (Vite)
];

const corsOptions = {
    origin: (origin, callback) => {
        // Se a requisição vem de uma das origens permitidas (incluindo a de produção e desenvolvimento)
        // Ou se não há origem (ex: requisições do mesmo servidor, ferramentas como Postman)
        if (
            !origin ||
            origin === allowedFrontendUrl || // Correspondência exata com a URL de produção (sem barra final)
            localDevelopmentOrigins.includes(origin)
        ) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'], // Adicione todos os cabeçalhos que seu frontend envia
    exposedHeaders: ['Content-Disposition'],
    credentials: true // Se você usa cookies, sessões ou cabeçalhos de autorização
};

app.use(cors(corsOptions));

app.use(express.json());//Ativa body pars
app.use(routes)

const PORT = process.env.PORT || 3000; // O Render injeta a variável PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});