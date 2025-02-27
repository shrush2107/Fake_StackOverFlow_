const MONGO_URL: string = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/fake_so';  
const CLIENT_URL: string = process.env.CLIENT_URL || 'http://localhost:3000';  
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000; 

export {
    MONGO_URL,
    CLIENT_URL,
    port
};