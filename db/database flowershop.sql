CREATE DATABASE flowerShop;
USE flowerShop;

CREATE TABLE plants (
id_plants INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR (45) NOT NULL,
season VARCHAR (45) NOT NULL,
leaves VARCHAR (45) NOT NULL,
color VARCHAR (45) NOT NULL,
instructions TEXT NOT NULL
);

CREATE TABLE users (
id_user INT AUTO_INCREMENT PRIMARY KEY,
userName VARCHAR (45) NOT NULL,
city VARCHAR (45) NOT NULL,
age INT NOT NULL,
email VARCHAR (45) NOT NULL,
password VARCHAR (45) NOT NULL
);

CREATE TABLE favorite_plants (
id_fav_plants INT AUTO_INCREMENT PRIMARY KEY,
fk_plants INT NOT NULL,
fk_users INT NOT NULL
);

ALTER TABLE favorite_plants 
ADD CONSTRAINT fk_plants FOREIGN KEY (fk_plants) REFERENCES plants(id_plants);

ALTER TABLE favorite_plants 
ADD CONSTRAINT fk_users FOREIGN KEY (fk_users) REFERENCES users(id_user);

INSERT INTO plants (name, season, leaves, color, instructions) VALUES
('Lavanda', 'Primavera', 'Alargadas y estrechas', 'Violeta', 'Plantar en un lugar soleado y regar moderadamente. Prefiere suelos bien drenados.'),
('Monstera Deliciosa', 'Verano', 'Grandes y perforadas', 'Verde', 'Colocar en luz indirecta brillante y regar cuando la tierra esté seca en la superficie.'),
('Cactus de San Pedro', 'Todo el año', 'Sin hojas', 'Verde con espinas', 'Regar solo cuando el sustrato esté completamente seco. Prefiere climas cálidos y secos.'),
('Jazmín', 'Primavera - Verano', 'Pequeñas y ovaladas', 'Blanco', 'Ubicar en un lugar con luz solar directa y regar regularmente sin encharcar.'),
('Helecho de Boston', 'Otoño - Invierno', 'Finamente divididas', 'Verde intenso', 'Mantener en un ambiente húmedo y regar con frecuencia. No exponer a luz solar directa.');

INSERT INTO users (userName, city, age, email, password) VALUES
('María López', 'Madrid', 29, 'maria.lopez@email.com', '12345'),
('Carlos Fernández', 'Barcelona', 35, 'carlos.fernandez@email.com', 'abcdef'),
('Elena Martínez', 'Sevilla', 24, 'elena.martinez@email.com', 'qwerty'),
('Raúl Gómez', 'Valencia', 40, 'raul.gomez@email.com', 'password123'),
('Laura Sánchez', 'Bilbao', 31, 'laura.sanchez@email.com', 'plantlover');

INSERT INTO favorite_plants (fk_plants, fk_users) VALUES
(1, 1),  -- María López (ID 1) → Lavanda (ID 1)
(2, 1),  -- María López (ID 1) → Monstera Deliciosa (ID 2)
(3, 2),  -- Carlos Fernández (ID 2) → Cactus de San Pedro (ID 3)
(4, 3),  -- Elena Martínez (ID 3) → Jazmín (ID 4)
(5, 4),  -- Raúl Gómez (ID 4) → Helecho de Boston (ID 5)
(1, 5),  -- Laura Sánchez (ID 5) → Lavanda (ID 1)
(3, 5);  -- Laura Sánchez (ID 5) → Cactus de San Pedro (ID 3)



