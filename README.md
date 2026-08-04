# Warehouse OS — Guía Rápida

Levantamiento de infraestructura local, backend de .NET y frontend en React.

Esta guía detalla el procedimiento para levantar PostgreSQL en Docker, configurar las cadenas de conexión del backend en .NET y poner en marcha la interfaz de usuario.

## 1. Requisitos

- Docker Desktop: Corriendo y activo en el sistema.
- .NET SDK 8.0: Instalado correctamente.
- Node.js v18+: Instalado para la gestión de dependencias del frontend.
- PowerShell: Terminal recomendada.

## 2. Configurar Docker (Base de Datos)

**Dónde ejecutarlo:** Desde la carpeta raíz de tu proyecto.
**Comando:**

```bash
docker compose up -d
```

La base de datos queda publicada con los siguientes datos:

- **Host:** localhost
- **Puerto:** 5432
- **DB:** warehouseDB
- **User:** postgres_admin
- **Password:** StrongPassword123*

## 3. Configurar variables de conexión en el Backend

**Dónde modificarlo:** En tu archivo de configuración del backend ubicado en:(o `appsettings.Development.json`)

**Configuración:** Asegúrate de que la cadena apunte al contenedor de Docker:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=warehouseDB;Username=postgres_admin;Password=StrongPassword123*"
  }
}
```

## 4. Levantar API local (.NET)

**Dónde ejecutarlo:** Abre una terminal nueva y navega a la carpeta de tu backend.

**Comandos:**

```bash
cd back/warehouseAPI
dotnet restore
dotnet run
```

La API se levantará en: [http://localhost:5289](http://localhost:5289)

## 5. Levantar Frontend (React)

**Dónde ejecutarlo:** Abre una segunda ventana de terminal nueva y navega a la carpeta de tu frontend.

**Comandos:**

```bash
cd front/frontend
npm install
npm run dev
```

Abre la interfaz en tu navegador mediante la URL provista por el servidor de desarrollo (por ejemplo, [http://localhost:5173](http://localhost:5173)).
