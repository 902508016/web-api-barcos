const db = require('../database/db');
const Reserva = require('../models/reserva');

// US010 - Como Marinheiro - Reservar Barco ( Requer ID do marinheiro, ID do barco e data da reserva )

exports.createReserva = async function (req, res) {
  try {
    const connection = await db.connect();

    // Converter data para Date 
    let dataJS;

    // Se vier "YYYY-MM-DD"
    if (req.body.data.includes('-')) {
      dataJS = new Date(req.body.data);
    } 
    // Se vier "DD/MM/YYYY"
    else if (req.body.data.includes('/')) {
      const [dia, mes, ano] = req.body.data.split('/');
      dataJS = new Date(`${ano}-${mes}-${dia}`);
    }

    const params = {
      id_marinheiro: req.body.id_marinheiro,
      id_barco: req.body.id_barco,
      data: dataJS
    };

    // Validar data futura
    if (dataJS <= new Date()) {
      return res.status(400).json({ error: 'Só é possível reservar para datas futuras.' });
    }

    // Validar o ID do Marinheiro
     const checkMarinheiro = await connection.execute(
      `SELECT 1 FROM MARINHEIROS WHERE ID_MARINHEIRO = :id`,
      { id: params.id_marinheiro }
    );

    if (checkMarinheiro.rows.length === 0) {
      return res.status(400).json({ error: 'Marinheiro não existe.' });
    }

    // Verificar o ID do Barco
     const checkBarcoExiste = await connection.execute(
      `SELECT 1 FROM BARCOS WHERE ID_BARCO = :id`,
      { id: params.id_barco }
    );

    if (checkBarcoExiste.rows.length === 0) {
      return res.status(400).json({ error: 'Barco não existe.' });
    }

    // Verificar se o barco já está reservado nessa data
    const checkBarco = await connection.execute(
      `SELECT 1 FROM RESERVAS 
       WHERE ID_BARCO = :id_barco
       AND TRUNC(DATA) = TRUNC(:data)`,
      {
        id_barco: params.id_barco,
        data: params.data
      }
    );

    if (checkBarco.rows.length > 0) {
      return res.status(400).json({ error: 'Este barco já está reservado para essa data.' });
    }

    // Inserir reserva
    const result = await connection.execute(
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
    console.log('ERRO BACKEND:', err.message); //para ver onde está o erro 

    if (err.message.includes('ORA-02291')) {
      return res.status(400).json({ error: 'Marinheiro ou barco não existe.' });
    }

    if (err.message.includes('ORA-00001')) {
      return res.status(400).json({ error: 'Reserva duplicada.' });
    }

    res.status(500).json({ error: err.message });
  }
};

// US011 - Como Marinheiro - Listar Barcos por mim Registados

exports.listReservasByMarinheiro = async function (req, res) {
    try {   
        const connection = await db.connect();
        
        const id = req.params.id_marinheiro;

    const result = await connection.execute(
       `SELECT 
      r.ID_MARINHEIRO,
      m.NOME AS NOME_MARINHEIRO,
      r.ID_BARCO,
      b.NOME AS NOME_BARCO,
      b.COR,
      r.DATA
   FROM RESERVAS r
   JOIN BARCOS b ON r.ID_BARCO = b.ID_BARCO
   JOIN MARINHEIROS m ON r.ID_MARINHEIRO = m.ID_MARINHEIRO
   WHERE r.ID_MARINHEIRO = :id
   ORDER BY r.DATA`,
      { id },
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT}
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhuma reserva encontrada.' });
    }

    res.status(200).json(result.rows);

  } catch (err) {
    console.log('ERRO BACKEND:', err.message);
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