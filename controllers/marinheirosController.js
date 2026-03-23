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

// US002 - Como Gestor - Listar Marinheiros

exports.getAllMarinheiros = async function (req, res) {
    try {
        const connection = await db.connect();

        var result = await connection.execute(
            `SELECT * FROM MARINHEIROS`
        );

        if (!result.rows || result.rows.length === 0)
            return res.status(404).json({ error: 'Nenhum marinheiro encontrado.' });

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// US003 - Como Gestor - Listar Marinheiro com determinada classificação

exports.getMarinheirosByClassificacao = async function (req, res) {
    try {
        const connection = await db.connect();

        var result = await connection.execute(
            `SELECT * FROM MARINHEIROS WHERE CLASSIFICACAO = :5`,    
            [req.query.classificacao]
        );

        if (!result.rows || result.rows.length === 0)
            return res.status(404).json({ error: 'Nenhum marinheiro encontrado com essa classificação.' });

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// US004 - Como Gestor - Listar Marinheiro por ID

exports.getMarinheiroById = async function (req, res) {
    try {
        const connection = await db.connect();

        var result = await connection.execute(
            `SELECT * FROM MARINHEIROS WHERE ID_MARINHEIRO = :100`,
            [req.params.id]
        );

        if (!result.rows || result.rows.length === 0)
            return res.status(404).json({ error: 'Marinheiro não encontrado.' });

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// US005 - Como Gestor - Atualizar classificação do marinheiro

exports.updateMarinheiroClassificacao = async function (req, res) {
    try {
        const connection = await db.connect();

        var result = await connection.execute(
            `UPDATE MARINHEIROS SET CLASSIFICACAO = :8 WHERE ID_MARINHEIRO = :100`,
            [req.body.classificacao, req.params.id],
            { autoCommit: true }
        );

        if (result.changes === 0)
            return res.status(404).json({ error: 'Marinheiro não encontrado.' });   

        res.json({ message: 'Classificação do marinheiro atualizada com sucesso.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

// US006 - Como Gestor - Eliminar marinheiro se não estiver associado a nenhum barco