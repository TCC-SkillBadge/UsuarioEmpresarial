import { Router } from 'express';
import {
    cadastrarUsuario,
    loginUsuario,
    acessarInfoUsuario,
    verTodosUsuarios,
    consultarUsuario,
    validarCNPJ,
    generateApiKeyController
} from '../controllers/userEnterpriseController.js';

const router = Router();

router.post('/cadastrar', cadastrarUsuario);
router.get('/login', loginUsuario);
router.get('/acessa-info', acessarInfoUsuario);
router.get('/ver-todos', verTodosUsuarios);
router.get('/consultar', consultarUsuario);
router.get('/validarCNPJ', validarCNPJ);
router.post('/generate-api-key', generateApiKeyController);

export default router;
