import { Request, Response, NextFunction } from 'express';
import { verifyApiKey } from '../services/apiKeyService.js';

export const apiKeyAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;

    console.log('API Key recebida:', apiKey);  // Log da API key recebida

    if (!apiKey) {
        console.log('API Key não fornecida');
        return res.status(401).send('API Key é necessária');
    }

    const user = await verifyApiKey(apiKey);

    if (!user) {
        console.log('API Key inválida');
        return res.status(403).send('API Key inválida');
    }

    console.log('Usuário autenticado:', user);  // Log do usuário autenticado

    (req as any).user = user;

    next();
};
