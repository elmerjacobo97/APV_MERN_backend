import express from 'express';
const router = express.Router();
import {
    confirmar,
    perfil,
    registrar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword, actualizarPerfil, actualizarPassword,
} from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

// área pública
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

// rutas protegidas (requiere pasar por checkAuth)
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;
