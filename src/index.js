//Imports. Donde importamos las dependencias con las que vamos a trabajar
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//Crear el servidor
const server = express();

//Configurar el servidor
server.use(cors());
server.use(express.json({ limit: "25mb" }));
server.set("view engine", "ejs");

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`El servidor está ejecutándosoe en http://localhost:${PORT}`);
});

//Crear la conexión
async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
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
server.get("/plants", async (req, res) => {
  try {
    const connection = await getConnection();
    const sqlSelectPlants = "SELECT * FROM plants";
    const [results] = await connection.query(sqlSelectPlants);
    connection.end();

    if (results.length > 0) {
      res.status(200).json({
        success: true,
        info: { count: results.length },
        results: results,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No se encontraron plantas",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las plantas, inténtalo de nuevo más tarde",
    });
  }
});

//Insertar una nueva planta
server.post("/plants", async (req, res) => {
  try {
    const connection = await getConnection();
    const { name, season, leaves, color, instructions } = req.body;

    /*
        Esto es una validación para asegurarte de que todos los campos están rellenos.*/
    if (!name || !season || !leaves || !color || !instructions) {
      return res.status(400).json({
        success: false,
        message: "Se deben rellenar todos los campos",
      });
    }

    const sqlInsert =
      "INSERT INTO plants (name, season, leaves, color, instructions) VALUES (?, ?, ?, ?, ?)";
    const [result] = await connection.query(sqlInsert, [
      name,
      season,
      leaves,
      color,
      instructions,
    ]);
    connection.end();

    if (result && result.affectedRows > 0) {
      res.status(201).json({
        success: true,
        id: result.insertId, // id que generó MySQL para la nueva fila Está metido dentro de [result] y lo genera automáticamente sql
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No se pudo insertar la planta",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al insertar la planta:",
      error,
    });
  }
});

//Actualizar una entrada existente
server.put("/plants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, season, leaves, color, instructions } = req.body;
    const connection = await getConnection();

    const sqlPlantExists = "SELECT * FROM plants WHERE id_plants = ?";
    const [plantExists] = await connection.query(sqlPlantExists, [id]);
    if (plantExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "La planta no ha podido ser modificada porque no existe",
      });
    }

    const sqlUpdateReceta =
      "UPDATE plants SET leaves = ?, season = ?, color = ? WHERE id_plants = ?";
    const [result] = await connection.query(sqlUpdateReceta, [
      leaves,
      season,
      color,
      id,
    ]);
    connection.end();
    if (result.affectedRows > 0) {
      res.status(201).json({
        success: true,
        message: "La planta ha sido modificada",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Ha ocurrido un error",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al modificar la planta:",
      error,
    });
  }
});

//Eliminar una planta
server.delete("/plants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const sqlDelete = "DELETE FROM plants WHERE id_plants = ?";
    const [result] = await connection.query(sqlDelete, [id]);
    connection.end();

    if (result.affectedRows > 0) {
      res.status(201).json({
        success: true,
      });
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "Ha ocurrido un error al eliminar la planta",
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la planta:",
      error,
    });
  }
});

//Endpoint autenticación y autorización users

//Registrar un usuario
server.post("/register", async (req, res) => {
  try {
    const connection = await getConnection();
    const { userName, city, age, email, password } = req.body;

    const selectEmail = "SELECT email FROM users WHERE email = ?";
    const [emailResult] = await connection.query(selectEmail, [email]);

    if (emailResult.length > 0) {
      connection.end();
      return res
        .status(400)
        .json({ success: false, message: "El usuario ya existe" });
    } else {
      const passwordHashed = await bcrypt.hash(password, 10);
      const insertUser =
        "INSERT INTO users (userName, city, age, email, password) VALUES (?, ?, ?, ?, ?)";
      const [result] = await connection.query(insertUser, [
        userName,
        city,
        age,
        email,
        passwordHashed,
      ]);
      connection.end();
      res.status(201).json({ success: true, id: result.insertId });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario:",
      error,
    });
  }
});

//Login de un usuario
server.post("/login", async (req, res) => {
  try {
    const connection = await getConnection();
    const { email, password } = req.body;
    
    const selectEmail = "SELECT * FROM users WHERE email = ?";
    const [resultUser] = await connection.query(selectEmail, [email]);
    console.log(resultUser);

    //Si el email si existe, se comprueba que la contraseña coincide
    if (resultUser.length !== 0) {
      const passwordDB = resultUser[0].password;
      const isSamePassword = await bcrypt.compare(password, passwordDB);

      if (isSamePassword) {
        //Si las contraseñas con iguales, creo el token
        const infoToken = {
          email: resultUser[0].email,
          id: resultUser[0].id,
        };
        const token = jwt.sign(infoToken, "nectarina", { expiresIn: "1h" });
        res.status(200).json({ success: true, token: token });
      } else {
        res
          .status(200)
          .json({ success: false, message: "contraseña incorrecta" });
      }
    } else {
      res.status(200).json({ success: false, message: "email incorrecta" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "No se ha podido hacer el login"
    });
  }
});

/*
//Servidores estáticos
const urlServerStatic = "./web";
server.use(express.static(urlServerStatic));


*/
