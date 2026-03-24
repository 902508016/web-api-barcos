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

