📄 Warehouse OS - Guía Rápida (Formato PDF)
Esta guía es para levantar PostgreSQL en Docker, configurar el backend de .NET y correr el frontend.

1) Requisitos
Docker Desktop corriendo.

.NET SDK 8.0 instalado.

Node.js v18+ instalado.

PowerShell.

2) Configurar Docker (Base de Datos)
Dónde ejecutarlo: Desde la carpeta raíz de tu proyecto (D:\EnterpriseWarehouseAPI).

Comando:

Bash
docker compose up -d
Datos de conexión de la Base de Datos:

Host: localhost

Puerto: 5432

DB: WarehouseDB

User: postgres_admin

Password: StrongPassword123*

3) Configurar variables de conexión en el Backend
Dónde modificarlo: En tu archivo de configuración del backend ubicado en back/WarehouseAPI/appsettings.json (o appsettings.Development.json).

Configuración: Asegúrate de que la cadena apunte al contenedor de Docker:

JSON
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=WarehouseDB;Username=postgres_admin;Password=StrongPassword123*"
}
4) Levantar API local (.NET)
Dónde ejecutarlo: Abre una terminal nueva y navega a la carpeta de tu backend.

Comandos:

Bash
cd back/WarehouseAPI
dotnet restore
dotnet run
La API se levantará en: http://localhost:5289

5) Levantar Frontend (React)
Dónde ejecutarlo: Abre una segunda ventana de terminal nueva y navega a la carpeta de tu frontend.

Comandos:

Bash
cd front/frontend
npm install
npm run dev
Abre la interfaz en tu navegador: `
