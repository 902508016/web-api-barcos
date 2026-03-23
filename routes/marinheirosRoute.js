var express = require('express');
var router = express.Router();
var { celebrate, Joi } = require('celebrate');
const ctr = require('../controllers/marinheirosController');

// US001 - Como Gestor - Criar Marinheiro
router.post('/', ctr.createMarinheiro);
// US002 - Como Gestor - Listar Marinheiros
router.get('/', ctr.getAllMarinheiros);
// US003 - Como Gestor - Listar Marinheiro com determinada classificação
router.get('/classificacao', ctr.getMarinheirosByClassificacao);
// US004 - Como Gestor - Listar Marinheiro por ID
router.get('/:id', ctr.getMarinheiroById);
// US005 - Como Gestor - Atualizar classificação do marinheiro

// US006 - Como Gestor - Eliminar marinheiro se não estiver associado a nenhum barco


module.exports = router;