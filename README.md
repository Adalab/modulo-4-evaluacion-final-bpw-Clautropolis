# 🌱 API Tienda de Plantas

Esta API permite gestionar una tienda de plantas, incluyendo la gestión de usuarios y sus plantas favoritas.

## ✨ Tecnologías Utilizadas
- **Node.js** con **Express.js** para el servidor
- **MySQL** como base de datos relacional
- **Jest** para pruebas (opcional)

## 📝 Instalación y Configuración
### 1. Clonar el repositorio
```sh
  git clone https://github.com/tuusuario/tu-repo.git
  cd tu-repo
```

### 2. Instalar dependencias
```sh
  npm install
```

### 3. Configurar variables de entorno (`.env`)
Crea un archivo **`.env`** en la raíz con los siguientes valores:
```env
PORT=4000
HOST=localhost
USER=tu_usuario_mysql
PASSWORD=tu_contraseña_mysql
DATABASE=flowerShop
```

### 4. Ejecutar el servidor
```sh
  npm run dev
```
El servidor se ejecutará en `http://localhost:4000`.

---
## 🛠️ Endpoints Disponibles

### 🌳 **Plantas**

#### 1. Obtener todas las plantas
- **Método:** `GET`
- **URL:** `/plants`
##### 📂 Respuesta Ejemplo:
```json
[
  {
    "id_plants": 1,
    "name": "Lavanda",
    "season": "Primavera",
    "leaves": "Alargadas y estrechas",
    "color": "Violeta",
    "instructions": "Plantar en un lugar soleado y regar moderadamente."
  }
]
```

#### 2. Insertar una nueva planta
- **Método:** `POST`
- **URL:** `/plants`
- **Body (JSON):**
```json
{
  "name": "Orquídea",
  "season": "Todo el año",
  "leaves": "Verde oscuro y carnosas",
  "color": "Morado",
  "instructions": "Riego moderado y humedad constante."
}
```
##### 📂 Respuesta Ejemplo:
```json
{
  "success": true,
  "message": "Planta agregada correctamente"
}
```

#### 3. Eliminar una planta
- **Método:** `DELETE`
- **URL:** `/plants/:id`
##### 📂 Ejemplo:
```sh
DELETE /plants/2
```
##### 📂 Respuesta Ejemplo:
```json
{
  "success": true
}
```

---

### 👨‍🌿 **Usuarios**

#### 4. Obtener todos los usuarios
- **Método:** `GET`
- **URL:** `/users`
##### 📂 Respuesta Ejemplo:
```json
[
  {
    "id_user": 1,
    "userName": "María López",
    "city": "Madrid",
    "age": 29,
    "email": "maria.lopez@email.com"
  }
]
```

#### 5. Registrar un usuario
- **Método:** `POST`
- **URL:** `/users`
- **Body (JSON):**
```json
{
  "userName": "Carlos Fernández",
  "city": "Barcelona",
  "age": 35,
  "email": "carlos.fernandez@email.com",
  "password": "abcdef"
}
```
##### 📂 Respuesta Ejemplo:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente"
}
```

---

### 🌟 **Plantas Favoritas (Relación Usuarios-Plantas)**

#### 6. Obtener las plantas favoritas de un usuario
- **Método:** `GET`
- **URL:** `/users/:id/favorites`
##### 📂 Ejemplo:
```sh
GET /users/1/favorites
```
##### 📂 Respuesta Ejemplo:
```json
[
  {
    "id_plants": 1,
    "name": "Lavanda"
  },
  {
    "id_plants": 2,
    "name": "Monstera Deliciosa"
  }
]
```

#### 7. Añadir una planta a favoritos
- **Método:** `POST`
- **URL:** `/users/:id/favorites`
- **Body (JSON):**
```json
{
  "plant_id": 3
}
```
##### 📂 Respuesta Ejemplo:
```json
{
  "success": true,
  "message": "Planta agregada a favoritos"
}
```

#### 8. Eliminar una planta de favoritos
- **Método:** `DELETE`
- **URL:** `/users/:id/favorites/:plantId`
##### 📂 Ejemplo:
```sh
DELETE /users/1/favorites/3
```
##### 📂 Respuesta Ejemplo:
```json
{
  "success": true,
  "message": "Planta eliminada de favoritos"
}
```

---
## 🔧 Mejoras Futuras
- Implementar **JWT** para autenticación de usuarios.
- Agregar paginación en las consultas.
- Permitir filtrar plantas por temporada o características.

## 🌟 Contribuciones
Si quieres contribuir, ¡abre un PR en GitHub!

## 💌 Contacto
Si tienes dudas, contáctame en: [claurodher2@gmail.com](mailto:claurodher2@gmail.com)

---
✨ **Gracias por usar la API Tienda de Plantas!** 🌱

