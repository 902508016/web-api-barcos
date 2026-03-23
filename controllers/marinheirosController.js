const db = require('../database/db');
const Marinheiro = require('../models/marinheiro');

// US001 - Como Gestor - Criar Marinheiro

exports.createMarinheiro = async function (req, res) {
    try {
        const connection = await db.connect();

        var novo = new Marinheiro(
            req.body.id_marinheiro,
            req.body.nome,
            req.body.classificacao,
            req.body.idade
        );

        var result = await connection.execute(
            `INSERT INTO MARINHEIROS (ID_MARINHEIRO, NOME, CLASSIFICACAO, IDADE)
             VALUES (:1, :2, :3, :4)`,
            [
                novo.id_marinheiro,
                novo.nome,
                novo.classificacao,
                novo.idade
            ],
            { autoCommit: true }
        );

        res.status(201).json({ message: "Marinheiro criado com sucesso." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// US002 - Como Gestor - Listar Marinheiro
// US003 - Como Gestor - Listar Marinheiro com determinada classificação
// US004 - Como Gestor - Listar Marinheiro por ID
// US005 - Como Gestor - Atualizar classificação do marinheiro
// US006 - Como Gestor - Eliminar marinheiro se não estiver associado a nenhum barco