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
    acessarInfoUsuarioJwt,
    requestPasswordResetUE,
    resetPasswordUE
} from '../controllers/userEnterpriseController.js';
import { apiKeyAuthMiddleware } from '../middleware/apiKeyAuthMiddleware.js';
import { jwtAuthMiddleware } from '../middleware/jwtAuthMiddleware.js';

const router = Router();

router.post('/cadastrar', cadastrarUsuario);
router.post('/login', loginUsuario);
router.get('/acessa-info', acessarInfoUsuario);
router.get('/ver-todos', verTodosUsuarios);
router.get('/consultar', consultarUsuario);
router.get('/validarCNPJ', validarCNPJ);
router.post('/generate-api-key', generateApiKeyController);
router.get('/acessa-info-by-api-key', apiKeyAuthMiddleware, acessarInfoByApiKey);
router.get('/acessar-info-usuario-by-api-key', acessarInfoUsuarioByApiKey);
router.get('/acessar-info-usuario-jwt', jwtAuthMiddleware, acessarInfoUsuarioJwt);
router.post('/request-password-reset', requestPasswordResetUE); // Nova rota para solicitar redefinição de senha
router.post('/reset-password', resetPasswordUE); // Nova rota para redefinir a senha

export default router;
