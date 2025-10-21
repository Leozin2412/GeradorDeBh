const config = {
    host: process.env.HOST || 'localhost', 
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000, 
}

export default config