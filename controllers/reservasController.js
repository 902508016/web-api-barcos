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
       
        const params = {
            id_marinheiro: nova.id_marinheiro,
            id_barco: nova.id_barco,
            data: new Date(nova.data)
        };

        // Validar Reserva para data futura

        if (params.data <= new Date()) {
            return res.status(400).json({ error: 'Só é possível reservar para datas futuras.' });
        }

        // Verificar se o barco já está reservado nessa data

        const checkBarco = await connection.execute( 
            `SELECT * FROM RESERVAS WHERE ID_MARINHEIRO = :id_marinheiro
            AND ID_BARCO: id_barco
            AND TRUNC(DATA) = TRUNC(:data)`, 
            params
        );

        if (checkDuplicado.rows.length > 0) {
            return res.status(400).json({ error: 'Já reservaste este barco para essa data.' });
        };

        var result = await connection.execute(
            `INSERT INTO RESERVAS (ID_MARINHEIRO, ID_BARCO, DATA)
             VALUES (:id_marinheiro, :id_barco, :data)`, 
            params,
            { autoCommit: true }
        );      
        
        if (result.rowsAffected === 0) {
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
            {id_marinheiro: req.params.id_marinheiro}
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
        const params = {
            id_marinheiro: req.body.id_marinheiro,
            id_barco: req.body.id_barco,
            data: new Date(req.body.data)
        };

         // 1. Verificar se a reserva existe e é futura
        var reserva = await connection.execute(
            `SELECT * FROM RESERVAS 
             WHERE ID_MARINHEIRO = id_marinheiro
             AND ID_BARCO = id_barco
             AND TRUNC(DATA) = TRUNC(:data)
             AND DATA > SYSDATE`, 
             params
        );

        if (!reserva.rows || reserva.rows.length === 0)
            return res.status(404).json({ error: 'Reserva não encontrada ou não é futura.' });

        // 2. Eliminar reserva
        var result = await connection.execute(
            `DELETE FROM RESERVAS 
             WHERE ID_MARINHEIRO = :id_marinheiro
             AND ID_BARCO = :id_barco
             AND TRUNC(DATA) = TRUNC(:data)
             AND DATA > SYSDATE`,
             params,
            
            { autoCommit: true }
        );

        if (result.rowsAffected !== 1)
            return res.status(404).json({ error: 'Erro ao eliminar reserva.' });

        res.json({ message: 'Reserva cancelada com sucesso.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};