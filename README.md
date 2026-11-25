# Warehouse OS — Sistema Full-Stack de Gestión de Almacén e Inventarios

**Warehouse OS** es una aplicación web cliente-servidor desarrollada para la gestión operativa de almacenes, control de existencias en tiempo real, administración de proveedores, registro transaccional de entradas de mercancía y trazabilidad de órdenes de salida con soporte para **SKU interno y lectura de código de barras (EAN/UPC)**.

Desarrollado por **Chris David Cruz García** — *Ingeniero en Software*  
Repositorio: [https://github.com/UserDAVIDGAR03/WAREHOUSE](https://github.com/UserDAVIDGAR03/WAREHOUSE)

---

## Tabla de Contenidos

1. [¿Cómo funciona el sistema? (Arquitectura y flujo)](#1-cómo-funciona-el-sistema-arquitectura-y-flujo)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Requisitos Previos](#4-requisitos-previos)
5. [Paso 1: Levantar PostgreSQL en Docker](#5-paso-1-levantar-postgresql-en-docker)
6. [Paso 2: Configurar y levantar el Backend (.NET)](#6-paso-2-configurar-y-levantar-el-backend-net)
7. [Paso 3: Configurar y levantar el Frontend (React + Vite)](#7-paso-3-configurar-y-levantar-el-frontend-react--vite)
8. [Guía de Primer Uso (Flujo de Prueba Inicial)](#8-guía-de-primer-uso-flujo-de-prueba-inicial)
9. [Referencia Rápida de Endpoints de la API](#9-referencia-rápida-de-endpoints-de-la-api)
10. [Solución de Problemas Frecuentes](#10-solución-de-problemas-frecuentes)

---

## 1. ¿Cómo funciona el sistema? (Arquitectura y flujo)

El sistema opera bajo una arquitectura desacoplada de **tres capas** comunicadas mediante peticiones HTTP/JSON y aseguradas mediante autenticación **JWT (Bearer Token)**:

1. **Capa de Presentación (`frontend/client` — `http://127.0.0.1:8080`):**
   - Construida con **React + Vite + Tailwind CSS**.
   - Al iniciar sesión (`POST /api/auth/login`), almacena el token JWT en `localStorage` y lo adjunta automáticamente en cada solicitud HTTP mediante el interceptor de **Axios** (`warehouseApi.js`). Si el servidor responde `401 Unauthorized`, limpia la sesión y redirige al acceso.
   - Permite operar inventario general, filtrar stock crítico o agotado, exportar reportes a **CSV**, registrar entradas de almacén y crear órdenes de salida escaneando códigos mediante **pistola USB/teclado** o **cámara web/móvil** (`html5-qrcode`).

2. **Capa de Lógica de Negocio y API (`backend/WarehouseAPI` — `http://localhost:5289`):**
   - Implementada en **C# y ASP.NET Core Minimal APIs** con **Entity Framework Core**.
   - Valida reglas de negocio críticas: unicidad de `SKU` y `Barcode`, existencia de inventario suficiente antes de confirmar una orden de salida y cálculo automático de totales y métricas KPI.
   - Ejecuta **transacciones ACID (`BeginTransactionAsync`)** en las operaciones de entrada (`POST /api/stock-entries`) y salida (`POST /api/orders`) de mercancía para garantizar que no existan descuentos parciales o inconsistencias de inventario.

3. **Capa de Persistencia (PostgreSQL en Docker — `localhost:5432`):**
   - Base de datos relacional `warehouseDB` ejecutándose en el contenedor Docker (`warehouse_pg_container`), persistiendo las tablas `Users`, `Suppliers`, `Products`, `Orders` y `OrderItems`.

---

## 2. Stack Tecnológico

| Capa | Tecnologías | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS | Interfaz reactiva, diseño oscuro (`zinc`), responsiva y compilación rápida. |
| **Cliente HTTP & UI** | Axios, Lucide React, React Hot Toast | Peticiones REST con interceptor JWT, iconografía y notificaciones en vivo. |
| **Escaneo de Códigos** | `html5-qrcode` + entrada USB/teclado | Lectura dual de códigos de barras (EAN/UPC) y SKU por cámara o pistola. |
| **Backend** | C#, ASP.NET Core Minimal APIs, Swagger | Endpoints RESTful, validación de negocio y documentación OpenAPI. |
| **Acceso a Datos** | Entity Framework Core, Npgsql | Migraciones, consultas LINQ/EF, índices únicos y transacciones ACID. |
| **Seguridad** | JWT Bearer Authentication, BCrypt.Net | Hash seguro de contraseñas y protección de rutas privadas. |
| **Base de Datos** | PostgreSQL (Docker) | Persistencia relacional transaccional. |

---

## 3. Estructura del Proyecto

```text
EnterpriseWarehouseAPI/
├── docker-compose.yml                      # Orquestación del contenedor PostgreSQL
├── backend/
│   └── WarehouseAPI/
│       ├── Data/
│       │   └── WarehouseContext.cs         # DbContext de Entity Framework Core e índices únicos
│       ├── Migrations/                     # Migraciones de esquema (incluyendo AddProductBarcode)
│       ├── Models/
│       │   ├── User.cs                     # Usuarios, credenciales hash BCrypt y rol
│       │   ├── Supplier.cs                 # Proveedores y relación con productos
│       │   ├── Product.cs                  # Catálogo, SKU, Barcode, precio y stock
│       │   ├── Order.cs                    # Órdenes de salida, folio ORD-YYYYMMDD-XXXXXX y total
│       │   └── OrderItem.cs                # Detalle de artículos despachados por orden
│       ├── appsettings.json                # Cadena de conexión y parámetros JWT
│       └── Program.cs                      # Configuración DI, JWT, CORS y Minimal APIs
└── frontend/
    └── client/
        ├── package.json                    # Dependencias y scripts de Vite
        ├── vite.config.js                  # Configuración de host/puerto local (127.0.0.1:8080)
        └── src/
            ├── api/
            │   └── warehouseApi.js         # Instancia Axios, interceptor JWT y servicios REST
            ├── components/
            │   ├── dashboard/
            │   │   ├── KpiCards.jsx        # Tarjetas métricas de inventario en tiempo real
            │   │   ├── NewOrderModal.jsx   # Modal de creación de órdenes de salida
            │   │   └── StockEntryModal.jsx # Modal de entrada de stock / reabastecimiento
            │   └── layout/
            │       ├── Header.jsx          # Barra superior y cierre de sesión
            │       └── Sidebar.jsx         # Navegación lateral y contadores dinámicos
            ├── pages/
            │   ├── auth/
            │   │   ├── WelcomeView.jsx     # Vista de bienvenida
            │   │   └── AuthFormView.jsx    # Formularios de inicio de sesión y registro
            │   └── dashboard/
            │       ├── ProductsTab.jsx     # Inventario, filtros, búsqueda, CSV y entrada
            │       ├── SuppliersTab.jsx    # Listado y alta de proveedores
            │       ├── AlertsTab.jsx       # Vista dedicada de stock crítico
            │       ├── OrdersTab.jsx       # Historial y desglose de órdenes
            │       ├── AddProductTab.jsx   # Alta de productos con SKU y código de barras
            │       └── BarcodeScannerModal.jsx # Escáner óptico por cámara (html5-qrcode)
            └── App.jsx                     # Orquestación de sesión, pestañas y estado global
```

---

## 4. Requisitos Previos

Antes de comenzar, verifica que tu entorno cuente con las siguientes herramientas instaladas y activas:

- **Docker Desktop:** Corriendo y activo en el sistema.
- **.NET SDK (.NET 8.0 / .NET 10.0):** Instalado correctamente para compilar y ejecutar `WarehouseAPI.csproj`.
- **Node.js (v18 o superior) y npm:** Instalados para gestionar dependencias y levantar Vite.
- **Terminal:** PowerShell (recomendada en Windows) o Bash.

---

## 5. Paso 1: Levantar PostgreSQL en Docker

**Dónde ejecutarlo:** En una terminal ubicada en la **carpeta raíz del proyecto**.

### Opción A: Usando `docker compose` (si tienes `docker-compose.yml` en la raíz)

```bash
docker compose up -d
```

### Opción B: Comando directo `docker run` (si levantas el contenedor manualmente)

```bash
docker run -d --name warehouse_pg_container -e POSTGRES_USER=postgres_admin -e POSTGRES_PASSWORD=StrongPassword123* -e POSTGRES_DB=warehouseDB -p 5432:5432 postgres:16
```

### Verificar que el contenedor esté activo

```bash
docker ps
```

La base de datos queda publicada localmente con las siguientes credenciales:

- **Host:** `localhost`
- **Puerto:** `5432`
- **Base de datos:** `warehouseDB`
- **Usuario:** `postgres_admin`
- **Contraseña:** `StrongPassword123*`

---

## 6. Paso 2: Configurar y levantar el Backend (.NET)

### 6.1 Verificar la cadena de conexión

**Dónde modificarlo:** En `backend/WarehouseAPI/appsettings.json` (o `appsettings.Development.json`).  
Asegúrate de que `ConnectionStrings:DefaultConnection` apunte al contenedor de PostgreSQL:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=warehouseDB;Username=postgres_admin;Password=StrongPassword123*"
  },
  "Jwt": {
    "Key": "WarehouseOS_SuperSecretKey_2026_ChangeInProduction!",
    "Issuer": "WarehouseAPI",
    "Audience": "WarehouseClient"
  }
}
```

### 6.2 Aplicar migraciones y ejecutar la API local

**Dónde ejecutarlo:** Abre una terminal y navega a la carpeta `backend/WarehouseAPI`.

```bash
cd backend/WarehouseAPI
dotnet restore
dotnet ef database update
dotnet run
```

> **Nota:** Si aún no tienes instalada la herramienta de migraciones de Entity Framework Core, instálala una sola vez con:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

La API quedará escuchando en:
- **Backend API:** [http://localhost:5289](http://localhost:5289)
- **Health Check:** [http://localhost:5289/api/health](http://localhost:5289/api/health)
- **Swagger UI (entorno Development):** [http://localhost:5289/swagger](http://localhost:5289/swagger)

---

## 7. Paso 3: Configurar y levantar el Frontend (React + Vite)

### 7.1 Verificar la URL de la API

Confirma que `frontend/client/src/api/warehouseApi.js` apunte al puerto del backend:

```javascript
const API_BASE = 'http://localhost:5289/api';
```

### 7.2 Verificar puerto local `127.0.0.1:8080` en `vite.config.js`

Para evitar bloqueos de permisos (`EACCES`) en puertos por defecto o IPv6 en Windows, asegúrate de que `frontend/client/vite.config.js` tenga configurado el host y puerto local:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 8080,
  },
});
```

### 7.3 Instalar dependencias y arrancar el cliente web

**Dónde ejecutarlo:** Abre una **segunda ventana de terminal** y navega a `frontend/client`.

```bash
cd frontend/client
npm install
npm run dev
```

Abre la aplicación en tu navegador en:
- **Frontend Web:** [http://127.0.0.1:8080](http://127.0.0.1:8080)

---

## 8. Guía de Primer Uso (Flujo de Prueba Inicial)

Al levantar el sistema por primera vez con una base de datos limpia (`warehouseDB`), sigue este orden lógico para probar todas las funciones sin errores de dependencia:

1. **Crear una cuenta operativa:** En la pantalla principal (`http://127.0.0.1:8080`), haz clic en **Crear cuenta** (o **Registrar operador**), registra tu usuario y correo, e inicia sesión para obtener tu token JWT.
2. **Registrar al menos un proveedor:** Ve a la pestaña **Proveedores** en el menú lateral y da de alta un proveedor (por ejemplo, *Coca Cola*, *Sabritas* o *Ricolino*). Este paso es obligatorio porque cada producto requiere un proveedor asignado (`SupplierId`).
3. **Registrar productos en el catálogo:** Haz clic en **Registrar producto**, asigna un `SKU` único (ej. `SKU-6060`), opcionalmente un código de barras `EAN/UPC`, selecciona el proveedor creado, define precio unitario, stock inicial y stock mínimo de alerta.
4. **Probar entradas y órdenes de salida:**
   - Usa **Entrada de stock** desde *Inventario general* para sumar unidades mediante captura manual, lector USB o cámara.
   - Ve a **Órdenes de salida** → **Nueva orden de salida** para despachar mercancía y verificar el descuento automático en tiempo real y la actualización de los KPIs.

---

## 9. Referencia Rápida de Endpoints de la API

Base URL en desarrollo local: `http://localhost:5289/api`

| Método | Ruta | Auth | Descripción |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | No | Comprueba el estado de la API y la conexión con PostgreSQL. |
| `POST` | `/api/auth/register` | No | Registra un usuario nuevo (`Username`, `Email`, `Password`) con hash BCrypt. |
| `POST` | `/api/auth/login` | No | Valida credenciales y retorna `{ token, username, role }`. |
| `GET` | `/api/suppliers` | Sí | Obtiene todos los proveedores incluyendo sus productos asociados. |
| `POST` | `/api/suppliers` | Sí | Crea un nuevo proveedor en el catálogo. |
| `GET` | `/api/products` | Sí | Obtiene todos los productos con información de `Supplier`. |
| `GET` | `/api/products/by-sku/{code}` | Sí | Busca un producto por `SKU` o `Barcode` (sin distinguir mayúsculas). |
| `GET` | `/api/products/low-stock` | Sí | Devuelve artículos donde `StockQuantity <= MinimumStockAlert`. |
| `POST` | `/api/products` | Sí | Registra un producto validando unicidad de `SKU` y `Barcode`. |
| `PUT` | `/api/products/{id}/stock` | Sí | Modifica directamente el stock de un producto (`quantityChange`). |
| `POST` | `/api/stock-entries` | Sí | Registra una entrada de stock sumando unidades en transacción ACID. |
| `POST` | `/api/orders` | Sí | Crea una orden de salida, valida stock, descuenta unidades y calcula total. |
| `GET` | `/api/orders` | Sí | Consulta el historial de órdenes registradas con sus `Items` y `Product`. |

---

## 10. Solución de Problemas Frecuentes

- **Error `EACCES: permission denied` o bloqueo de puerto al ejecutar `npm run dev`:**  
  Windows bloquea en ocasiones el enlace IPv6 (`::1`) o puertos por defecto como `5173`. Verifica que `frontend/client/vite.config.js` tenga configurado `host: '127.0.0.1'` y `port: 8080`, o fuerza el arranque manualmente con:
  ```bash
  npx vite --host 127.0.0.1 --port 8080
  ```

- **Error de conexión a PostgreSQL al ejecutar `dotnet run`:**  
  Confirma que Docker Desktop esté abierto y que el contenedor `warehouse_pg_container` esté corriendo (`docker ps`). Si el contenedor ya existía detenido, inícialo con:
  ```bash
  docker start warehouse_pg_container
  ```

- **Error `401 Unauthorized` al navegar en el frontend:**  
  El token JWT almacenado expiró o la base de datos se reinició. Haz clic en **Cerrar sesión** (o borra `localStorage` en DevTools con `F12` → `Application` → `Local Storage`) y vuelve a iniciar sesión.