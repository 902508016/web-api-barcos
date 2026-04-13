var express = require('express');
var router = express.Router();
var { celebrate, Joi } = require('celebrate');
const ctr = require('../controllers/barcosController');


// US007 - Como Gestor - Registar Barco ( Requer ID do barco, nome e cor )
router.post('/',
    celebrate({
        body: Joi.object({
            id_barco: Joi.number().required(),
            nome: Joi.string().min(1).required(),
            cor: Joi.string().min(1).required() 
        })
    }),
    ctr.createBarco
);

// US008 - Como Gestor - Listar Barcos Registados no Sistema
router.get('/', ctr.getAllBarcos);

// US009 - Como Marinheiro - Listar Barcos Disponiveis para Reserva
router.get('/disponiveis', ctr.getBarcosDisponiveis);

//Eliminar
router.delete('/:id', ctr.deleteBarco)

module.exports = router;