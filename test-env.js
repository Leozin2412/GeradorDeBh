import 'dotenv/config'; // Usamos import para compatibilidade com "type": "module"
import pkg from 'pg';
const { Client } = pkg;

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL not found in .env file!');
    return;
  }

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false // Use false para ambientes de desenvolvimento se necessário, mas para Neon pode precisar de true com certificado se houver problemas.
    }
  });

  try {
    await client.connect();
    console.log('✅ Conexão bem-sucedida ao banco de dados Neon DB!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados Neon DB:', error.message);
    console.error('Detalhes do erro:', error);
  } finally {
    await client.end();
  }
}

testConnection();