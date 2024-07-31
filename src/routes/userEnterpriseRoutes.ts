import { Router } from 'express';
import {
    cadastrarUsuario,
    loginUsuario,
    acessarInfoUsuario,
    verTodosUsuarios,
    consultarUsuario,
    validarCNPJ,
    generateApiKeyController,
    acessarInfoByApiKey,
    acessarInfoUsuarioByApiKey,
    acessarInfoUsuarioJwt
} from '../controllers/userEnterpriseController.js';
import { apiKeyAuthMiddleware } from '../middleware/apiKeyAuthMiddleware.js';
import { jwtAuthMiddleware } from '../middleware/jwtAuthMiddleware.js';

const router = Router();

router.post('/cadastrar', (req, res, next) => { console.log('Rota /cadastrar chamada'); next(); }, cadastrarUsuario);
router.post('/login', (req, res, next) => { console.log('Rota /login chamada'); next(); }, loginUsuario);
router.get('/acessa-info', (req, res, next) => { console.log('Rota /acessa-info chamada'); next(); }, acessarInfoUsuario);
router.get('/ver-todos', (req, res, next) => { console.log('Rota /ver-todos chamada'); next(); }, verTodosUsuarios);
router.get('/consultar', (req, res, next) => { console.log('Rota /consultar chamada'); next(); }, consultarUsuario);
router.get('/validarCNPJ', (req, res, next) => { console.log('Rota /validarCNPJ chamada'); next(); }, validarCNPJ);
router.post('/generate-api-key', (req, res, next) => { console.log('Rota /generate-api-key chamada'); next(); }, generateApiKeyController);
router.get('/acessa-info-by-api-key', (req, res, next) => { console.log('Rota /acessa-info-by-api-key chamada'); next(); }, apiKeyAuthMiddleware, acessarInfoByApiKey);
router.get('/acessar-info-usuario-by-api-key', (req, res, next) => { console.log('Rota /acessar-info-usuario-by-api-key chamada'); next(); }, acessarInfoUsuarioByApiKey);
router.get('/acessar-info-usuario-jwt', jwtAuthMiddleware, acessarInfoUsuarioJwt); // Adicionando a nova rota

export default router;
