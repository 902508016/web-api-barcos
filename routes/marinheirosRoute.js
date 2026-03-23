var express = require('express');
var router = express.Router();
var { celebrate, Joi } = require('celebrate');
const ctr = require('../controllers/marinheirosController');

// US001 - Como Gestor - Criar Marinheiro
router.post('/',
    celebrate({
        body: Joi.object({
            id_marinheiro: Joi.number().required(),
            nome: Joi.string().min(1).required(),
            classificacao: Joi.number().required(),
            idade: Joi.number().required()
        })
    }),
    ctr.createMarinheiro
);

// US002 - Como Gestor - Listar Marinheiros
router.get('/', ctr.getAllMarinheiros);

// US003 - Como Gestor - Listar Marinheiro com determinada classificação
router.get('/classificacao',
    celebrate({
        query: Joi.object({
            classificacao: Joi.number().required()
        })
    }),
    ctr.getMarinheirosByClassificacao
);

// US004 - Como Gestor - Listar Marinheiro por ID
router.get('/:id', ctr.getMarinheiroById);

// US005 - Como Gestor - Atualizar classificação do marinheiro
router.patch('/:id',
    celebrate({
        body: Joi.object({
            classificacao: Joi.number().required()
        })
    }),
    ctr.updateMarinheiroClassificacao
);

// US006 - Como Gestor - Eliminar marinheiro se não estiver associado a nenhum barco
router.delete('/:id', ctr.deleteMarinheiro);


module.exports = router;