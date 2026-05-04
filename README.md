# NutriChef (Sistema de Recetas)

NutriChef es una aplicación Full-Stack para la gestión de recetas e inventario. Está compuesta por un backend desarrollado en Java con Spring Boot y un frontend desarrollado en React usando Vite.

## Requisitos Previos

Asegúrate de tener instalado el siguiente software en tu equipo antes de continuar:
- **Java 17 o superior** (para el backend)
- **Node.js (v18+) y npm** (para el frontend)
- **PostgreSQL** (para la base de datos)

## 1. Configuración de la Base de Datos

Antes de ejecutar la aplicación, es indispensable configurar la base de datos localmente.

1. Abre **pgAdmin** (o psql) y crea una nueva base de datos llamada `nutrichef`.
2. Asegúrate de que las credenciales de tu servidor PostgreSQL coincidan con las del proyecto. Por defecto, en el archivo `nutrichef-backend/src/main/resources/application.properties` se espera lo siguiente:
   - **Puerto**: `5432`
   - **Usuario**: `postgres`
   - **Contraseña**: `Juanpablobd05#`

> **Nota:** Si tu contraseña de PostgreSQL es diferente, deberás actualizar el archivo `application.properties`. Hibernate está configurado para crear y actualizar las tablas automáticamente (`ddl-auto=update`), por lo que no es necesario ejecutar scripts SQL manualmente para la estructura.

## 2. Ejecución del Backend (Spring Boot)

El backend proporciona la API REST necesaria para que la aplicación funcione y se ejecutará en el puerto **8081**.

1. Abre una terminal y navega al directorio del backend:
   ```bash
   cd nutrichef-backend
   ```
2. Ejecuta la aplicación utilizando el Wrapper de Maven incluido:
   - **En Windows:**
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - **En Mac/Linux:**
     ```bash
     ./mvnw spring-boot:run
     ```
   
Si la conexión a la base de datos es exitosa, verás en la consola un mensaje indicando que la aplicación ha iniciado en el puerto 8081.

## 3. Ejecución del Frontend (React + Vite)

El frontend se encarga de la interfaz de usuario y requiere conectarse al backend que iniciamos en el paso anterior.

1. Abre **otra terminal** y navega al directorio del frontend:
   ```bash
   cd nutrichef-frontend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador web y accede a la URL que aparezca en la consola (usualmente `http://localhost:5173`).

## Estructura Principal

- `/nutrichef-backend`: Código fuente de la API REST (Controladores, Modelos, Repositorios, Servicios y Configuración de seguridad/datos).
- `/nutrichef-frontend`: Aplicación SPA en React con ruteo y componentes interactivos.
