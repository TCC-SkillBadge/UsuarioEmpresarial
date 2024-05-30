import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import axios from 'axios'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import UE from './UsuarioEmpresarial.DAOclass.js'
import { SenhaIncorreta, ServicoIndisponivel, UsuarioEmpresarialNaoEncontrado, NenhumUsuarioEmpresarialEncontrado, ViolacaoUnique } from './ErrorList.js'

const appServer = express()
appServer.use(express.json())
appServer.use(cors())

dotenv.config()
const { JWT_UE_ACCESS_KEY, JWT_UA_ACCESS_KEY, JWT_EXPIRATION_TIME, SALT_ROUNDS } = process.env
const PORT = process.env.PORT || 6003

await UE.sync()

const verificaToken = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')
    if(!token){
        return res.status(401).send('Token não fornecido')
    }
    let chave: string | undefined
    switch(req.query.tipoUsuario){
        case 'UE':
            chave = JWT_UE_ACCESS_KEY
            break
        case 'UA':
            chave = JWT_UA_ACCESS_KEY
            break
    }
    jwt.verify(token[1], chave!, (err: any, result: any) => {
        if(err){
            return res.status(403).send('Token Inválido')
        }
        req.usuario = result.usuario
        next()
    })

}

appServer.post('/cadastrar', async (req: any, res: any) => {
    const { email_comercial, senha, razao_social, cnpj, cep, logradouro, bairro, municipio, suplemento, numero_contato } = req.body
    try{
        let senhaHash: any, sucesso = false
        while(!sucesso){
            try{
                senhaHash = await bcrypt.hash(senha, +SALT_ROUNDS!)
                sucesso = true
            }
            catch(err){
                console.error("Erro no bcrypt.hash()", err)
            }
        }
        try{
            const novoUE = await UE.create({ email_comercial, senha: senhaHash, razao_social, cnpj, cep, logradouro, bairro, municipio, suplemento, numero_contato })
            if(novoUE){
                res.status(201).send('Usuário Empresarial Cadastrado com Sucesso')
            }
            else{
                res.status(503).send(new ServicoIndisponivel())
            }
        }
        catch(err: any){
            console.error("Erro no UE.create()", err)
            switch(err.errors[0].type){
                case 'unique violation':
                    res.status(409).send(new ViolacaoUnique(err.errors[0].path))
                    break
            }
        }
    }
    catch(err){
        console.error("Erro na operação 'Cadastrar' no serviço de Usuários Empresariais", err)
        return res.send(err)
    }
})

appServer.get('/login', async (req: any, res: any) => {
    const { email_comercial, senha } = req.query
    try{
        const usuarioE = await UE.findByPk(email_comercial as string)
        if(usuarioE){
            const senhaDadaEstaCorreta = await bcrypt.compare(senha as string, usuarioE.getDataValue('senha'))
            if(senhaDadaEstaCorreta){
                const token = jwt.sign(
                    { usuario: usuarioE.getDataValue('email_comercial') },
                    JWT_UE_ACCESS_KEY!,
                    { expiresIn: JWT_EXPIRATION_TIME! }
                )
                const resposta = {
                    token,
                    tipoUsuario: 'UE'
                }
                res.status(200).json(resposta)
            }
            else{
                res.status(401).send(new SenhaIncorreta())
            }
        }
        else{
            res.status(404).send(new UsuarioEmpresarialNaoEncontrado())
        }
    }
    catch(err){
        console.error("Erro na operação 'Login' no serviço de Usuários Empresariais", err)
        res.send(err)
    }
})

appServer.get('/acessa-info', verificaToken, async (req: any, res: any) => {
    const { usuario } = req
    try {
        const infoUE = await UE.findByPk(usuario as string)
        if (infoUE) {
            res.status(200).json(infoUE)
        } else {
            res.status(404).send(new UsuarioEmpresarialNaoEncontrado())
        }
    }
    catch(err){
        console.error("Erro na operação 'AcessaInfo' no serviço de Usuários Empresariais", err)
        res.send(err)
    }
})

appServer.get('/ver-todos', verificaToken, async (_req, res: any) => {
    try{
        const todosUE = await UE.findAll()
        if(todosUE.length > 0){
            res.status(200).json(todosUE)
        }
        else{
            res.status(404).send(new NenhumUsuarioEmpresarialEncontrado())
        }
    }
    catch(err){
        console.error("Erro na operação 'VerTodos' no serviço de Usuários Empresariais", err)
        res.send(err)
    }
})

appServer.get('/consultar', verificaToken, async (req: any, res: any) => {
    const { pesquisa } = req.query
    try{
        const espUE = await UE.findOne({
            where: {
                [Op.or]: [
                    {email_comercial: {[Op.like]: '%'+ pesquisa +'%'}},
                    {razao_social: {[Op.like]: '%'+ pesquisa +'%'}}
                ]
            }
        })
        if(espUE){
            res.status(200).json(espUE)
        }
        else{
            res.status(404).send(new UsuarioEmpresarialNaoEncontrado())
        }
    }
    catch(err){
        console.error("Erro na operação 'Consultar' no serviço de Usuários Empresariais", err)
        res.send(err)
    }
})

appServer.get('/validarCNPJ', async (req: any, res: any) => {
    const { cnpj } = req.query
    try{
        const { data } = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, {
            headers: {
                Accept: 'application/json'
            }
        })
        res.status(200).json(data)
    }
    catch(err){
        console.error("Erro na operação 'ValidarCNPJ' no serviço de Usuários Empresariais", err)
        res.send(err)
    }
})

appServer.listen(PORT, () => console.log(`Usuário Empresarial. Executando Porta ${PORT}`))