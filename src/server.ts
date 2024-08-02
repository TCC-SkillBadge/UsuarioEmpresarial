import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userEnterpriseRoutes from './routes/userEnterpriseRoutes.js';
import sequelize from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7003; // Certifique-se de que a porta está correta

// Middleware para habilitar CORS e JSON
app.use(cors());
app.use(express.json());

// Middleware de logging para depuração
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Definição das rotas
app.use('/api', userEnterpriseRoutes); // Certifique-se de que as rotas estão sendo usadas aqui

// Sincronização com o banco de dados e inicialização do servidor
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Usuário Empresarial. Executando na Porta ${PORT}`);
    });
}).catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
});
