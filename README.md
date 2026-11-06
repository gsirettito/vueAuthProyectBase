# Vue 3 + PocketBase Intranet Boilerplate

Proyecto base para aplicaciones web con autenticación, roles y panel de administración.

## Tecnologías
- Vue 3 (Composition API)
- Vite
- Vue Router
- PocketBase (Backend as a Service)
- MailDev (Servidor SMTP local para pruebas)

## Requisitos previos
- Node.js instalado.
- PocketBase descargado (no incluido en este repo).

## Instalación

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` basado en `.env.example`.
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Configuración del Backend (PocketBase)
1. Inicia PocketBase en el puerto 8090.
2. Importa el esquema de colecciones (ver archivo `pb_schema.json` en la carpeta `/docs`).
3. Crea un usuario administrador en el panel de PocketBase.