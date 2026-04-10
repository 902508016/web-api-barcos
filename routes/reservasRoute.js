var express = require('express');
var router = express.Router();
var { celebrate, Joi } = require('celebrate');
const ctr = require('../controllers/reservasController');

// US010 - Como Marinheiro - Reservar Barco ( Requer ID do marinheiro, ID do barco e data da reserva )

router.post('/',
  celebrate({
    body: Joi.object({
      id_marinheiro: Joi.number().integer().required(),
      id_barco: Joi.number().integer().required(),
      data: Joi.string().required() // aceita YYYY-MM-DD ou DD/MM/YYYY
    })
  }),
  ctr.createReserva
);

// US011 - Como Marinheiro - Listar Barcos por mim Registados
router.get('/marinheiro/:id_marinheiro', ctr.listReservasByMarinheiro);

// US012 - Como Marinheiro - Cancelar Reserva Futura ( Requer ID do marinheiro, ID do barco e data futura )
router.delete('/',
    celebrate({
        body: Joi.object({
            id_marinheiro: Joi.number().required(),
            id_barco: Joi.number().required(),
            data: Joi.string().isoDate().required() //iso usado para forçar o string da data
        })
    }), ctr.cancelReserva
);

module.exports = router;