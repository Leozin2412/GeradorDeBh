import express from 'express'
import routes from './routes/TSroutes.js'
import config from './config.js'
import cors from 'cors'


const app = express()
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// --- CONFIGURAÇÃO CORS ATUALIZADA ---
// Pega a URL do ambiente, ou usa o fallback.
// O .replace(/\/$/, '') garante que qualquer barra final seja removida.
const allowedFrontendUrl = (process.env.FRONTEND_URL || "https://geradordebh.netlify.app").replace(/\/$/, '');

const localDevelopmentOrigins = [
    "http://127.0.0.1:5500", // Origem comum para Live Server
    "http://localhost:3000",  // Ex: React Dev Server
    "http://localhost:5173",   // Ex: Vite Dev Server
    "http://localhost:8080",  // Outras possíveis portas locais
    "http://localhost:8000"   // Outras possíveis portas locais
];

const corsOptions = {
    origin: (origin, callback) => {
        // Log para depuração:
        console.log(`Requisição Origin: ${origin}`);
        console.log(`Allowed Frontend URL: ${allowedFrontendUrl}`);
        console.log(`Local Dev Origins: ${JSON.stringify(localDevelopmentOrigins)}`);

        if (
            !origin || // Permite requisições sem Origin (ex: Postman, ferramentas backend)
            origin === allowedFrontendUrl || // Verifica a origem de produção (SEM barra final)
            localDevelopmentOrigins.includes(origin) // Verifica as origens de desenvolvimento
        ) {
            callback(null, true);
        } else {
            console.error(`CORS: Origin ${origin} not allowed.`); // Log mais específico
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'], // Adapte se usar outros cabeçalhos
    exposedHeaders: ['Content-Disposition'],
    credentials: true
};

app.use(cors(corsOptions));
// --- FIM DA CONFIGURAÇÃO CORS ATUALIZADA ---


app.use(express.json()); // Esta linha pode ser removida, pois 'app.use(express.json({ limit: '50mb' }));' já faz o papel.
app.use(routes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});