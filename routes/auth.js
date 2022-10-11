// path: api/login

const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renovarToken } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.post('/new',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email','El correo es obligatorio').isEmail(),
    validarCampos

] ,crearUsuario);

router.post('/',[
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email','El correo es obligatorio').isEmail(),
], login)

//validarJWT,
router.get('/renovar', validarJWT ,renovarToken);


module.exports = router;