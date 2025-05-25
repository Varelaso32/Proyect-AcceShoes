# 👟 AcceShoes - Plataforma de Comercio Electrónico

**AcceShoes** es una aplicación web moderna desarrollada con **Angular** (frontend), **Python + FastAPI** (backend) y **SQL Server** (base de datos), enfocada en ofrecer una experiencia de compra, venta y subasta de calzado y accesorios completamente optimizada.

Este sistema busca brindar una experiencia fluida y segura para todos los usuarios, incluyendo funcionalidades como búsqueda avanzada, comunicación directa entre compradores y vendedores, promociones, gestión de productos, y subastas en línea.

---

## 🔗 Documentación Oficial

Consulta la documentación completa del proyecto en el siguiente enlace:

👉 [https://documentacion-acce-shoes.vercel.app/](https://documentacion-acce-shoes.vercel.app/)

---

## ✅ Requisitos del Sistema

Antes de instalar, asegúrate de contar con:

- Node.js y npm  
- Python 3.10 o superior  
- Angular CLI  
- FastAPI + Uvicorn  
- SQL Server (o motor de base de datos compatible)  
- Git

---

## 🚀 Instalación del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Varelaso32/Proyect-AcceShoes.git
cd Proyect-AcceShoes
```

---

## ⚙️ Backend (FastAPI)

### 2. Crear entorno virtual y activarlo

```bash
python -m venv venv
source venv/bin/activate   # En Windows: venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Api FastAPI

```bash
[uvicorn main:app --reload](https://fastacceshoes.onrender.com/docs#/)
```

---

## 💻 Frontend (Angular)

### 5. Instalar dependencias y levantar Angular

```bash
cd frontend
npm install
ng serve
```

Accede a la app desde: [http://localhost:4200](http://localhost:4200)

---

## 🗄️ Configuración de la Base de Datos

Asegúrate de tener un servidor SQL disponible y configurar tu archivo `.env` o archivo de conexión con los siguientes datos:

```env
DB_HOST=localhost
DB_PORT=1433
DB_NAME=acceshoes
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
```

---

## 🧩 Funcionalidades Principales

- Registro, inicio y recuperación de sesión
- Publicación, edición y eliminación de productos
- Subastas en línea con sistema de pujas
- Carrito de compras
- Chat integrado entre usuarios
- Sistema de promociones y puntuaciones
- Panel de administración (publicaciones, reportes, usuarios, ubicaciones, etc.)

---

## 🧪 Tecnologías Utilizadas

- **Frontend**: Angular 16, TailwindCSS, DaisyUI
- **Backend**: FastAPI, SQLAlchemy, JWT
- **Base de datos**: SQL Server
- **Herramientas de despliegue**: Vercel, Railway, Render

---

## 👥 Autores

- Cleves Rueda Daniel Felipe  
- De la Cruz Juan Manuel  
- Varela Morales Samuel  

---

## 📄 Licencia

Este proyecto fue desarrollado como parte de un trabajo de grado académico. Su uso, copia o redistribución requiere autorización previa de los autores.
