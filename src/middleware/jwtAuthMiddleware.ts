import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UE from '../models/UserEnterprise.js';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_UE_ACCESS_KEY } = process.env;

interface JwtPayload {
    usuario: string;
}

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Middleware de autenticação JWT iniciado'); // Log para depuração

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Token JWT não fornecido'); // Log para depuração
        return res.status(401).send('Token JWT é necessário');
    }

    try {
        const decoded = jwt.verify(token, JWT_UE_ACCESS_KEY!) as JwtPayload;
        console.log('Token JWT decodificado:', decoded); // Log para depuração

        const user = await UE.findByPk(decoded.usuario);

        if (!user) {
            console.log('Usuário não encontrado'); // Log para depuração
            return res.status(404).send('Usuário não encontrado');
        }

        (req as any).user = user;
        next();
    } catch (err) {
        console.error('Erro na verificação do token JWT:', err);
        res.status(403).send('Token JWT inválido');
    }
};
