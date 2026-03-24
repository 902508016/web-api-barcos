var express = require('express');
var router = express.Router();
var { celebrate, Joi } = require('celebrate');
const ctr = require('../controllers/reservasController');

// US010 - Como Marinheiro - Reservar Barco ( Requer ID do marinheiro, ID do barco e data da reserva )

router.post('/',
    celebrate({
        body: Joi.object({
            id_marinheiro: Joi.number().required(),
            id_barco: Joi.number().required(),
            data: Joi.date().required()
        })
    }), ctr.createReserva
);

module.exports = router;