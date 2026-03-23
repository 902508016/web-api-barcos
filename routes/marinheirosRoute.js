var express = require('express');
var router = express.Router();
var { celebrate, Joi } = require('celebrate');
const ctr = require('../controllers/marinheirosController');

// US001 - Como Gestor - Criar Marinheiro
router.post('/', ctr.createMarinheiro);
// US003 - Como Gestor - Listar Marinheiro com determinada classificação

// US004 - Como Gestor - Listar Marinheiro por ID

// US005 - Como Gestor - Atualizar classificação do marinheiro

// US006 - Como Gestor - Eliminar marinheiro se não estiver associado a nenhum barco


module.exports = router;