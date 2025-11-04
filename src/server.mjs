import express from 'express'
import routes from './routes/TSroutes.js'
// import config from './config.js' // Se não estiver sendo usado, pode remover
import cors from 'cors'


const app = express()

// Certifique-se de que o express.json esteja antes de qualquer rota ou CORS, se suas rotas usarem body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// --- CONFIGURAÇÃO CORS ÚNICA E CORRETA ---

// Importante: O navegador envia o header 'Origin' SEM a barra final para o domínio raiz.
// Certifique-se de que `allowedFrontendUrl` NÃO tenha uma barra final.
// Se process.env.FRONTEND_URL for definido no Render, ele terá precedência.
// Se não for definido, usará o valor padrão.
const allowedFrontendUrl = process.env.FRONTEND_URL || "https://geradordebh.netlify.app"; // <-- REMOVIDA A BARRA FINAL

const localDevelopmentOrigins = [
    "http://127.0.0.1:5500", // Live Server
    "http://localhost:3000",  // Exemplo de outras origens de desenvolvimento
    "http://localhost:5173",   // Exemplo de outras origens de desenvolvimento (Vite)
    "http://localhost:4000" // Adicione qualquer outra porta que você use localmente
];

const corsOptions = {
    origin: (origin, callback) => {
        // Log para debug: veja qual 'origin' o navegador está enviando
        console.log('Origin da requisição:', origin);
        console.log('Allowed Frontend URL:', allowedFrontendUrl);

        // Se a requisição vem de uma das origens permitidas (produção ou desenvolvimento)
        // ou se não há origem (ex: requisições do mesmo servidor, ferramentas como Postman)
        if (
            !origin ||
            origin === allowedFrontendUrl || // Correspondência exata com a URL de produção
            localDevelopmentOrigins.includes(origin)
        ) {
            callback(null, true);
        } else {
            console.error('CORS Error: Not allowed by origin:', origin); // Log mais detalhado
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    // Certifique-se de listar *todos* os cabeçalhos personalizados que seu frontend envia.
    // 'Content-Type', 'Authorization' são os mais comuns.
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'], // Se você estiver enviando cabeçalhos personalizados do backend para o frontend
    credentials: true // Se você usa cookies, sessões ou precisa enviar cabeçalhos de autorização
};

// Aplique o middleware CORS UMA ÚNICA VEZ com as opções corretas.
app.use(cors(corsOptions));

// As rotas devem vir DEPOIS do middleware CORS
app.use(routes)

const PORT = process.env.PORT || 3000; // O Render injeta a variável PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});