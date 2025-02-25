//Imports. Donde importamos las dependencias con las que vamos a trabajar
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//Crear el servidor
const server = express();

//Configurar el servidor
server.use(cors());
server.use(express.json({limit: '25mb'}));
server.set('view engine', 'ejs');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=> {
    console.log(`El servidor está ejecutándosoe en http://localhost:${PORT}`)
});

//Crear la conexión
async function getConnection() {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.USER,
        password: process.env.PASSWORD
        // host: 'localhost',
        // database: 'flowerShop',
        // user: 'root',
        // password: '#Claugala2024'

    });
    await connection.connect();

    console.log(`Conexión establecita (identificador=${connection.threadId})`);

    return connection;
}

//Endpoints CRUD plants

//Listas todas las plantas existentes
server.get('/plants', async (req, res) => {
    try {
        const connection = await getConnection();
        const sqlSelectPlants = 'SELECT * FROM plants';
        const [results] = await connection.query(sqlSelectPlants);
        connection.end();

        if (results.length > 0) {
            res.status(200).json({
                success: true,
                info: {count: results.length},
                results: results
            });
        } else {
            res.status(400).json({
                success: false, 
                message: "No se encontraron plantas"
            })
        };  
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, 
            message: "Error al obtener las plantas, inténtalo de nuevo más tarde"});
    };
});

//Insertar una nueva planta
server.post('/plants', async(req, res)=>{

    try {
        const connection = await getConnection();
        const {name, season, leaves, color, instructions} = req.body; 

        /*
        Esto es una validación para asegurarte de que todos los campos están rellenos.*/
        if(!name || !season || !leaves || !color || !instructions){
            return res.status(400).json({
                success: false,
                message: "Se deben rellenar todos los campos"
              })}
        
        const sqlInsert = 'INSERT INTO plants (name, season, leaves, color, instructions) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.query(sqlInsert, [name, season, leaves, color, instructions]);
        connection.end();

        if(result && result.affectedRows > 0) {
            res.status(201).json( {
                success: true,
                id: result.insertId // id que generó MySQL para la nueva fila Está metido dentro de [result] y lo genera automáticamente sql
             })
        } else {
            res.status(400).json({
                success: false,
                message: "No se pudo insertar la planta"
              })
        }

    } catch (error) {
        res.status(500).json({
            success: false, 
            message: "Error al insertar la planta:", error});
    }
});

//Actualizar una entrada existente
server.put('/plants/:id', async (req, res)=>{
    try {
        const {id} = req.params;
        const {name, season, leaves, color, instructions} = req.body; 
        const connection = await getConnection();

        const sqlPlantExists = 'SELECT * FROM plants WHERE id_plants = ?';
        const [plantExists] = await connection.query(sqlPlantExists, [id]);
        if(plantExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: "La planta no ha podido ser modificada porque no existe"
            });
        };

        const sqlUpdateReceta = 'UPDATE plants SET leaves = ?, season = ?, color = ? WHERE id_plants = ?';
        const [result] = await connection.query(sqlUpdateReceta, [leaves, season, color, id]);
        connection.end();
        if(result.affectedRows > 0){ 
            res.status(201).json({
                success: true,
                message: "La planta ha sido modificada"});
        } else {
            res.status(400).json({
                success: false, 
                message: "Ha ocurrido un error"});
        }
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: "Error al modificar la planta:", error});
    }    
});

//Eliminar una planta
server.delete('/plants/:id', async (req, res)=>{
    try {
        const {id} = req.params;
        const connection = await getConnection();
        const sqlDelete = "DELETE FROM plants WHERE id_plants = ?";
        const [result] = await connection.query(sqlDelete, [id]);

        if(result.affectedRows > 0) {
            res.status(201).json({
                success: true});
        } else {
            res.status(400).json({success: false, message: "Ha ocurrido un error al eliminar la planta"});
        }
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: "Error al eliminar la planta:", error});
    }
});

//Endpoint autenticación y autorización users

//Registrar un usuario
server.post('/register', async (req, res)=>{

    /*
    1. Conectarse a la base de datos
    2. Recibir los datos del usuario a registrar por req.body
    3. Comprobar si el email existe -> con un SELECT buscamos en la base de datos. EL SELECT nos devuelve un array
    4. Hago un condicional para añadir el usuario si no existe -> array.length === 0 entonces lo añado.
    5. Antes de añadir el usuario con el INSERT debo encriptar la contraseña con bcrypt.
    6. Si el usuario existe, ponemos un mensaje de que el usuario ya existe (mensaje de error).
    */
  
    const connection = await getConnection();
    const {userName, city, age, email, password} = req.body;
  
    const selectEmail = "SELECT email FROM users WHERE email = ?";
    const [emailResult] = await connection.query(selectEmail, [email]);
  
    if(emailResult.length === 0) {
      const passwordHashed = await bcrypt.hash(pass, 10);
      const insertUser = "INSERT INTO users (email, hashed_password) VALUES (?, ?)";
      const [result] = await conex.query(insertUser, [email, passwordHashed]);
      res.status(201).json({success:true, id: result.insertId});
  
    } else {
      res.status(200).json({success: false, message: "El usuario ya existe"})
    }
  })
  





/*
//Servidores estáticos
const urlServerStatic = "./web";
server.use(express.static(urlServerStatic));


*/