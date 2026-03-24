const db = require('../database/db');
const Reserva = require('../models/reserva');

// US010 - Como Marinheiro - Reservar Barco ( Requer ID do marinheiro, ID do barco e data da reserva )

exports.createReserva = async function (req, res) {
    try {
        const connection = await db.connect();  

        var nova = new Reserva(
            req.body.id_marinheiro,
            req.body.id_barco,
            req.body.data
        );
        var result = await connection.execute(
            `INSERT INTO RESERVAS (ID_MARINHEIRO, ID_BARCO, DATA)
             VALUES (:1, :2, :3)`,
            [
                nova.id_marinheiro,
                nova.id_barco,  
                new Date(nova.data)
            ],
            { autoCommit: true }
        );      
        if (result.changes === 0) {
            return res.status(400).json({ error: "Não foi possível criar a reserva." });
        }

        res.status(201).json({ message: "Reserva criada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

// US011 - Como Marinheiro - Listar Barcos por mim Registados

exports.listReservasByMarinheiro = async function (req, res) {
    try {   
        const connection = await db.connect();
        
        var result = await connection.execute(
            `SELECT * FROM RESERVAS WHERE ID_MARINHEIRO = :id_marinheiro`,
            [req.params.id_marinheiro]
        );

        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ error: "Nenhuma reserva encontrada para este marinheiro." });
        }
        res.status(200).json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

// US012 - Como Marinheiro - Cancelar Reserva Futura ( Requer ID do marinheiro, ID do barco e data futura )

exports.cancelReserva = async function (req, res) {
    try {
        const connection = await db.connect();

         // 1. Verificar se a reserva existe e é futura
        var reserva = await connection.execute(
            `SELECT * FROM RESERVAS 
             WHERE ID_MARINHEIRO = :1 
             AND ID_BARCO = :2 
             AND TRUNC(DATA) = TRUNC(:3)
             AND DATA > SYSDATE`,

            [   req.body.id_marinheiro, 
                req.body.id_barco, 
                new Date(req.body.data)
            ]
        );

        if (!reserva.rows || reserva.rows.length === 0)
            return res.status(404).json({ error: 'Reserva não encontrada ou não é futura.' });

        // 2. Eliminar reserva
        var result = await connection.execute(
            `DELETE FROM RESERVAS 
             WHERE ID_MARINHEIRO = :1 
             AND ID_BARCO = :2
             AND TRUNC(DATA) = TRUNC(:3)
             AND DATA > SYSDATE`,

            [   req.body.id_marinheiro, 
                req.body.id_barco, 
                new Date(req.body.data)
            ],
            
            { autoCommit: true }
        );

        if (result.rowsAffected !== 1)
            return res.status(404).json({ error: 'Erro ao eliminar reserva.' });

        res.json({ message: 'Reserva cancelada com sucesso.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};