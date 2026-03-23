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

        var result = await connection.execute(
            `INSERT INTO BARCOS (ID_BARCO, NOME, COR)
             VALUES (:1, :2, :3)`,  
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
        res.status(500).json({ error: err.message });
    }       
};
