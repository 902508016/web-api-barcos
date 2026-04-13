const db = require('../database/db');
const Barco = require('../models/barco');

// US007 - Como Gestor - Registar Barco ( Requer ID do barco, nome e cor )

exports.createBarco = async function (req, res) {
    try {
        const connection = await db.connect();

        var novo = new Barco(
            req.body.id_barco,
            req.body.nome,
            req.body.cor
        );

        // === VALIDAÇÕES ===

        // ID - inteiro
        const idNum = Number(novo.id_barco);
        if (!Number.isInteger(idNum)) {
            return res.status(400).json({ error: "ID do barco deve ser um inteiro." });
        }

        // Nome - varchar(20)
        if (
            typeof novo.nome !== "string" ||
            novo.nome.length === 0 ||
            novo.nome.length > 20
        ) {
            return res.status(400).json({ error: "Nome deve ter no máximo 20 caracteres." });
        }

        // Cor - varchar(10)
        if (
            typeof novo.cor !== "string" ||
            novo.cor.length === 0 ||
            novo.cor.length > 10
        ) {
            return res.status(400).json({ error: "Cor deve ter no máximo 10 caracteres." });
        }

        var result = await connection.execute(
            `INSERT INTO BARCOS (ID_BARCO, NOME, COR)
             VALUES (:id, :nome, :cor)`,  
            [
                novo.id_barco,
                novo.nome,
                novo.cor
            ],
            { autoCommit: true }
        );

        if (result.changes === 0) {
            return res.status(400).json({ error: "Não foi possível criar o barco." });
        }

        res.status(201).json({ message: "Barco criado com sucesso." });

    } catch (err) {

        if (err.errorNum === 1) {
            return res.status(400).json({ error: "Já existe um barco com esse ID." });
        }

        res.status(500).json({ error: err.message });
    }       
};

// US008 - Como Gestor - Listar Barcos Registados no Sistema

exports.getAllBarcos = async function (req, res) {
    try {
        const connection = await db.connect();

        var result = await connection.execute(
            `SELECT * FROM BARCOS`
        );
        
        if (!result.rows || result.rows.length === 0)
            return res.status(404).json({ error: 'Nenhum barco encontrado.' });
        
        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// US009 - Como Marinheiro - Listar Barcos Disponiveis para Reserva

exports.getBarcosDisponiveis = async function (req, res) {
    try {
        const connection = await db.connect();
        
        var result = await connection.execute(
            `SELECT * FROM BARCOS WHERE ID_BARCO NOT IN (SELECT ID_BARCO FROM RESERVAS)`
        );
        
        if (!result.rows || result.rows.length === 0)
            return res.status(404).json({ error: 'Nenhum barco disponível encontrado.' });
        
        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
