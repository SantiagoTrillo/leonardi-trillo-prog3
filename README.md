# Introducción

Proyecto de práctica académica colaborativo que implementa un frontend estático interactivo y un backend en Node.js, desarrollado durante la cursada de la materia Programación III de la UTN Facultad Regional Avellaneda.

## Descripción
Aplicación web de catálogo y administración de películas y series ("CineStream") estructurada en dos capas servidoras independientes: un frontend servido de forma estática que gestiona la interacción del usuario y el carrito de compras, y un backend en Express que expone APIs REST, gestiona la persistencia de datos con Sequelize y renderiza las vistas administrativas dinámicas a través de EJS.

## Tecnologías
- HTML / CSS / JavaScript
- Node.js
- Express
- EJS
- Sequelize
- MySQL
- Bootstrap & Font Awesome
- Multer
- Puppeteer

## Estructura del proyecto
- `frontend/`: aplicación servidora de recursos estáticos que maneja el flujo de cara al cliente final
  - `app.js`: servidor web minimalista en Express que sirve los archivos estáticos en el puerto `3001`
  - `bienvenida/`: pantalla de entrada y bienvenida
  - `productos/`: catálogo responsivo de series y películas con buscador y filtros
  - `carrito/`: carrito de compras interactivo con modal de confirmación
  - `ticket/`: pantalla de compra finalizada y descarga de PDF
  - `css/` & `js/`: estilos compartidos (`styles.css` con soporte para temas claro/oscuro) y scripts generales (`tema.js`)
  - `package.json`: scripts de inicio y dependencias del frontend
- `backend/`: aplicación servidora del backend y del panel administrativo
  - `app.js`: punto de entrada del servidor Express en el puerto `3000`
  - `controllers/`: lógica de control para el renderizado de vistas EJS y endpoints de API
  - `database/`: conexión a la base de datos (`db-connection.js`) y script SQL de inicialización
  - `middlewares/`: validadores de datos y middleware de carga de imágenes (Multer)
  - `models/`: modelos ORM de Sequelize (`producto.model.js`, `usuario.model.js`, etc.) y consultas
  - `public/`: recursos estáticos del backend (estilos del panel de control, imágenes subidas e iconos)
  - `routes/`: enrutadores separados para la API REST y las vistas del administrador
  - `views/`: plantillas EJS para el inicio de sesión y gestión CRUD de productos
  - `package.json`: dependencias y comandos de ejecución (Nodemon)

## Ejecución

### 1. Clonar el repositorio
Clonate el repositorio en tu máquina local y metete en el directorio raíz del mismo.

### 2. Configurar base de datos
* Asegurate de tener un servidor MySQL o MariaDB corriendo de forma local (por ejemplo, a través de XAMPP).
* Crate una base de datos que se llame `tp_seriespeliculas`.
* Importá el archivo de la base de datos que está en `backend/database/tp_seriespeliculas.sql`.

### 3. Configurar variables de entorno
* En la carpeta `backend/`, copiá el archivo `.env.example` y guardalo como `.env`. Después, definí los datos de conexión correspondientes:
  ```ini
  PORT=3000
  DB_HOST=127.0.0.1
  DB_USER=tu_usuario_de_db
  DB_NAME=tp_seriespeliculas
  DB_PASSWORD=tu_contraseña_de_db
  ```
* En la carpeta `frontend/`, copiá el archivo `.env.example` como `.env` y configurá el puerto para el servidor estático:
  ```ini
  PORT=3001
  ```

### 4. Iniciar el Backend
Metete en la carpeta del backend, instalá las dependencias e iniciá el servidor de desarrollo:
```bash
cd backend
npm install
npm start
```
El backend va a estar disponible en `http://localhost:3000`. Podés entrar directamente al login del Panel de Administración en `http://localhost:3000/admin/login` (Credenciales rápidas: `test@test.com` / `test`).

### 5. Iniciar el Frontend
En otra ventana de la terminal, metete en la carpeta del frontend, instalá las dependencias e iniciá el servidor estático:
```bash
cd frontend
npm install
npm start
```
El cliente web va a estar disponible y listo para usar en `http://localhost:3001/bienvenida/bienvenida.html`.

## Objetivos del proyecto
- Desarrollar una aplicación web fullstack modular con frontend y backend desacoplados.
- Consumir e integrar servicios REST expuestos por el backend mediante peticiones asíncronas (`Fetch API`) en el cliente.
- Implementar almacenamiento estructurado persistente utilizando un ORM (Sequelize) sobre base de datos relacional MySQL/MariaDB.
- Manejar validaciones completas a nivel servidor y carga física de archivos adjuntos (imágenes de póster).
- Implementar flujos avanzados del panel de control, como paginación dinámica, búsqueda instantánea responsiva y descarga de reportes PDF generados de forma automatizada (Puppeteer).