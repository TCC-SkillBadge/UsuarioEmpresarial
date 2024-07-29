import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import axios from 'axios'; 
import UE from '../models/UserEnterprise.js';
import { generateApiKey, sendApiKeyEmail } from '../services/apiKeyService.js';
import { 
    SenhaIncorreta,
    ServicoIndisponivel,
    UsuarioEmpresarialNaoEncontrado,
    NenhumUsuarioEmpresarialEncontrado,
    ViolacaoUnique
} from '../utils/errorList.js';

const { JWT_UE_ACCESS_KEY, JWT_EXPIRATION_TIME, SALT_ROUNDS } = process.env;

export const cadastrarUsuario = async (req: Request, res: Response) => {
    console.log('Recebida requisição para cadastrar usuário:', req.body);
    const { email_comercial, senha, razao_social, cnpj, cep, logradouro, bairro, municipio, suplemento, numero_contato } = req.body;
    let senhaHash, sucesso = false;
    while (!sucesso) {
        try {
            senhaHash = await bcrypt.hash(senha, +SALT_ROUNDS!);
            sucesso = true;
        } catch (err) {
            console.error("Erro no bcrypt.hash()", err);
        }
    }
    try {
        const novoUE = await UE.create({ email_comercial, senha: senhaHash, razao_social, cnpj, cep, logradouro, bairro, municipio, suplemento, numero_contato });
        if (novoUE) {
            res.status(201).send('Usuário Empresarial Cadastrado com Sucesso');
        } else {
            res.status(503).send(new ServicoIndisponivel(''));
        }
    } catch (err: any) {
        console.error("Erro no UE.create()", err);
        switch (err.errors[0].type) {
            case 'unique violation':
                res.status(409).send(new ViolacaoUnique(err.errors[0].path));
                break;
            default:
                res.status(503).send(new ServicoIndisponivel(''));
        }
    }
};

export const loginUsuario = async (req: Request, res: Response) => {
    const { email_comercial, senha } = req.query;
    try {
        const usuarioE = await UE.findByPk(email_comercial as string);
        if (usuarioE) {
            const senhaDadaEstaCorreta = await bcrypt.compare(senha as string, usuarioE.getDataValue('senha'));
            if (senhaDadaEstaCorreta) {
                const token = jwt.sign(
                    { usuario: usuarioE.getDataValue('email_comercial') },
                    JWT_UE_ACCESS_KEY!,
                    { expiresIn: JWT_EXPIRATION_TIME! }
                );
                const resposta = {
                    token,
                    tipoUsuario: 'UE'
                };
                res.status(200).json(resposta);
            } else {
                res.status(401).send(new SenhaIncorreta());
            }
        } else {
            res.status(404).send(new UsuarioEmpresarialNaoEncontrado());
        }
    } catch (err) {
        console.error("Erro na operação 'Login' no serviço de Usuários Empresariais", err);
        res.status(503).send(new ServicoIndisponivel(''));
    }
};

export const acessarInfoUsuario = async (req: Request, res: Response) => {
    console.log('Requisição recebida para acessarInfoUsuario:', req.query);
    const { email_comercial } = req.query;
    try {
        const infoUE = await UE.findByPk(email_comercial as string);
        if (infoUE) {
            console.log('Usuário encontrado:', infoUE);
            res.status(200).json(infoUE);
        } else {
            console.log('Usuário não encontrado');
            res.status(404).send(new UsuarioEmpresarialNaoEncontrado());
        }
    } catch (err) {
        console.error("Erro na operação 'AcessaInfo' no serviço de Usuários Empresariais", err);
        res.status(503).send(new ServicoIndisponivel(''));
    }
};

export const verTodosUsuarios = async (req: Request, res: Response) => {
    try {
        const todosUE = await UE.findAll();
        if (todosUE.length > 0) {
            res.status(200).json(todosUE);
        } else {
            res.status(404).send(new NenhumUsuarioEmpresarialEncontrado());
        }
    } catch (err) {
        console.error("Erro na operação 'VerTodos' no serviço de Usuários Empresariais", err);
        res.status(503).send(new ServicoIndisponivel(''));
    }
};

export const consultarUsuario = async (req: Request, res: Response) => {
    const { pesquisa } = req.query;
    try {
        const espUE = await UE.findOne({
            where: {
                [Op.or]: [
                    { email_comercial: { [Op.like]: '%' + pesquisa + '%' } },
                    { razao_social: { [Op.like]: '%' + pesquisa + '%' } }
                ]
            }
        });
        if (espUE) {
            res.status(200).json(espUE);
        } else {
            res.status(404).send(new UsuarioEmpresarialNaoEncontrado());
        }
    } catch (err) {
        console.error("Erro na operação 'Consultar' no serviço de Usuários Empresariais", err);
        res.status(503).send(new ServicoIndisponivel(''));
    }
};

export const validarCNPJ = async (req: Request, res: Response) => {
    const { cnpj } = req.query;
    try {
        const { data } = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, {
            headers: {
                Accept: 'application/json'
            }
        });
        res.status(200).json(data);
    } catch (err) {
        console.error("Erro na operação 'ValidarCNPJ' no serviço de Usuários Empresariais", err);
        res.status(503).send(new ServicoIndisponivel('pesquisaCNPJ'));
    }
};

export const generateApiKeyController = async (req: Request, res: Response) => {
    const { email_comercial } = req.body;
    try {
        const userEnterprise = await UE.findByPk(email_comercial);
        if (!userEnterprise) {
            return res.status(404).send('Usuário empresarial não encontrado');
        }

        const apiKey = await generateApiKey(email_comercial);
        await sendApiKeyEmail(email_comercial, apiKey);

        res.status(200).send('API Key gerada e enviada por email');
    } catch (error) {
        console.error('Erro no generateApiKeyController:', error);
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Erro desconhecido');
        }
    }
};
