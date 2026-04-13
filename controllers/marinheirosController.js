const db = require('../database/db');
const Marinheiro = require('../models/marinheiro');

// US001 - Como Gestor - Criar Marinheiro

exports.createMarinheiro = async function (req, res) {
    try {
        const connection = await db.connect();

        const { id_marinheiro, nome, classificacao, idade } = req.body;

        // === VALIDAÇÕES ===

        // ID - inteiro obrigatório
        if (!Number.isInteger(id_marinheiro)) {
            return res.status(400).json({ error: "ID do marinheiro deve ser um inteiro." });
        }

        // Nome - string até 30 chars
        const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;

        if (typeof nome !== "string" || nome.length === 0 || nome.length > 30 || !nomeRegex.test(nome)) {
            return res.status(400).json({ error: "Nome deve conter apenas letras e espaços (máx. 30 caracteres)." });
        }

        // Classificação - inteiro entre 1 e 10
        if (!Number.isInteger(classificacao) || classificacao < 1 || classificacao > 10) {
            return res.status(400).json({ error: "Classificação deve ser um inteiro entre 1 e 10." });
        }

        // Idade - inteiro entre 1 e 100
        if (!Number.isInteger(idade) || idade < 1 || idade > 100) {
            return res.status(400).json({ error: "Idade deve ser um inteiro entre 1 e 100." });
        }

        // === INSERT ===

        await connection.execute(
            `INSERT INTO MARINHEIROS (ID_MARINHEIRO, NOME, CLASSIFICACAO, IDADE)
             VALUES (:id, :nome, :classificacao, :idade)`,
            {
                id: id_marinheiro,
                nome: nome,
                classificacao: classificacao,
                idade: idade
            },
            { autoCommit: true }
        );

        res.status(201).json({ message: "Marinheiro criado com sucesso." });

    } catch (err) {

        // === ERRO DE CHAVE DUPLICADA (Oracle) ===
        if (err.errorNum === 1) {
            return res.status(400).json({ error: "Já existe um marinheiro com esse ID." });
        }

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
            `SELECT * FROM MARINHEIROS WHERE CLASSIFICACAO = :classificacao`,    
            {classificacao: req.query.classificacao}
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
            `SELECT * FROM MARINHEIROS WHERE ID_MARINHEIRO = :id`,
            {id: req.params.id}
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

        const id = Number(req.params.id);
        const classificacao = Number(req.body.classificacao);

        // Valida ID
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                error: "ID inválido."
            });
        }

        // Valida classificação
        if (!Number.isInteger(classificacao) || classificacao < 1 || classificacao > 10) {
            return res.status(400).json({
                error: "Classificação deve ser um inteiro entre 1 e 10."
            });
        }     

        var result = await connection.execute(
            `UPDATE MARINHEIROS SET CLASSIFICACAO = :classificacao WHERE ID_MARINHEIRO = :id`,
            {classificacao: req.body.classificacao, id: req.params.id},
            { autoCommit: true }
        );
        
        if (result.rowsAffected === 0)
            return res.status(404).json({ error: 'Marinheiro não encontrado.' });   
        
        res.json({ message: 'Classificação do marinheiro atualizada com sucesso.' });
    
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

// US006 - Como Gestor - Eliminar marinheiro se não estiver associado a nenhum barco

exports.deleteMarinheiro = async function (req, res) {
    try {
        const connection = await db.connect();
        
        // 1. Verificar se tem reservas
        var reservas = await connection.execute(
            `SELECT * FROM RESERVAS WHERE ID_MARINHEIRO = :id`,
            {id: req.params.id}
        );
        
        if (reservas.rows.length > 0)
            return res.status(400).json({ error: 'Marinheiro tem reservas associadas.' });
        
        // 2. Eliminar marinheiro
        var result = await connection.execute(
            `DELETE FROM MARINHEIROS WHERE ID_MARINHEIRO = :id`,
            {id: req.params.id},
            { autoCommit: true }
        );
        
        if (result.rowsAffected !== 1)
            return res.status(404).json({ error: 'Marinheiro não encontrado.' });
        
        res.json({ message: 'Marinheiro eliminado com sucesso.' });
    
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};