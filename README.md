# NutriChef (Sistema de Recetas)

NutriChef es una aplicación Full-Stack para la gestión de recetas e inventario. Está compuesta por un backend desarrollado en Java con Spring Boot y un frontend desarrollado en React usando Vite.

## Requisitos Previos

Asegúrate de tener instalado el siguiente software en tu equipo antes de continuar:
- **Java 17 o superior** (para el backend)
- **Node.js (v18+) y npm** (para el frontend)
- **PostgreSQL** (para la base de datos)

## 1. Configuración de la Base de Datos

Antes de ejecutar la aplicación, es indispensable configurar la b# NutriChef 🍳  
### Sistema Inteligente de Gestión de Recetas e Inventario

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

# 📌 Descripción

NutriChef es una aplicación Full-Stack orientada a la gestión de recetas, ingredientes e inventario de cocina.

La plataforma permite:

- Gestionar recetas de cocina
- Administrar ingredientes
- Controlar inventario
- Consumir una API REST segura
- Visualizar información desde una interfaz moderna e interactiva

El proyecto está dividido en:

- **Backend** desarrollado con Java y Spring Boot
- **Frontend** desarrollado con React + Vite
- **Base de datos PostgreSQL**

---

# 🛠️ Tecnologías Utilizadas

## Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security
- Hibernate
- Maven

## Frontend
- React
- Vite
- React Router DOM
- Axios
- CSS3

## Base de Datos
- PostgreSQL

---

# 📂 Estructura del Proyecto

```bash
nutrichef/
│
├── nutrichef-backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
├── nutrichef-frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Java 17 o superior
- Node.js v18 o superior
- npm
- PostgreSQL
- Git

---

# 🗄️ Configuración de la Base de Datos

## 1. Crear la Base de Datos

Abre PostgreSQL desde pgAdmin o psql y crea una base de datos llamada:

```sql
CREATE DATABASE nutrichef;
```

---

## 2. Configurar Credenciales

Ubica el archivo:

```bash
nutrichef-backend/src/main/resources/application.properties
```

y configura:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nutrichef
spring.datasource.username=postgres
spring.datasource.password=tu_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

>  Nunca subas contraseñas reales al repositorio. 

---

#  Variables de Entorno (Recomendado) 

Para mayor seguridad se recomienda utilizar variables de entorno.

## application.properties

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nutrichef
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
```

## Variables de entorno

### Windows (CMD)

```cmd
set DB_USER=postgres
set DB_PASSWORD=tu_password
```

### Windows (PowerShell)

```powershell
$env:DB_USER="postgres"
$env:DB_PASSWORD="tu_password"
```

### Linux / Mac

```bash
export DB_USER=postgres
export DB_PASSWORD=tu_password
```

---

# Ejecución del Backend 

El backend expone la API REST y se ejecutará en el puerto:

```bash
8081
```

## 1. Entrar al backend

```bash
cd nutrichef-backend
```

---

## 2. Ejecutar Spring Boot

### Windows

```cmd
mvnw.cmd spring-boot:run
```

### Linux / Mac

```bash
./mvnw spring-boot:run
```

---

## 3. Verificar ejecución

Si todo funciona correctamente, verás un mensaje similar a:

```bash
Started NutriChefApplication in X seconds
```

---

#  Ejecución del Frontend 

## 1. Entrar al frontend

```bash
cd nutrichef-frontend
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Iniciar aplicación

```bash
npm run dev
```

---

## 4. Abrir en navegador

Vite mostrará una URL similar a:

```bash
http://localhost:5173
```

---

#  API REST 

## Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /recipes | Obtener recetas |
| GET | /recipes/{id} | Obtener receta por ID |
| POST | /recipes | Crear receta |
| PUT | /recipes/{id} | Actualizar receta |
| DELETE | /recipes/{id} | Eliminar receta |
| GET | /ingredients | Obtener ingredientes |
| POST | /ingredients | Crear ingrediente |

---

#  Capturas de Pantalla 

## Dashboard

```md
Agregar imagen aquí:
docs/dashboard.png
```

## Gestión de recetas

```md
Agregar imagen aquí:
docs/recipes.png
```

## Inventario

```md
Agregar imagen aquí:
docs/inventory.png
```

---

# Scripts Disponibles 

## Frontend

| Comando | Descripción |
|---|---|
| npm run dev | Inicia servidor de desarrollo |
| npm run build | Genera build de producción |
| npm run preview | Visualiza build |

---

# 🧪 Posibles Mejoras Futuras

- Autenticación JWT
- Dockerización
- Swagger/OpenAPI
- Panel administrativo
- Sistema de favoritos
- Upload de imágenes
- Deploy en la nube
- CI/CD
- Tests automatizados

---

#  Docker (Futuro) 

Próximamente el proyecto incluirá:

- Dockerfile
- Docker Compose
- Contenedores para Backend, Frontend y PostgreSQL

---

# Deploy 

Tecnologías recomendadas para despliegue:

| Servicio | Uso |
|---|---|
| Vercel | Frontend |
| Render / Railway | Backend |
| Supabase / Neon | PostgreSQL |

---

# 👨‍💻 Autor

Desarrollado por:

- Juan Pablo Berrio
- Sara Moncada Correa

---

# 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

# Recomendaciones 

- No subir archivos `.env`
- Usar `.gitignore`
- Mantener credenciales protegidas
- Documentar endpoints nuevos
- Agregar pruebas automatizadas

---

#  Estado del Proyecto 

🚧 Proyecto en desarrollo activo.ase de datos localmente.

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
