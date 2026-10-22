# Gestor de Eventos — Frontend

Interfaz web académica para administrar eventos mediante una API REST. Desarrollada con **React, TypeScript, Vite, React Bootstrap, React Router, Axios, Formik y Yup**.

## Funcionalidades
- Consultar y buscar eventos, con filtro de eventos que tienen cupos disponibles.
- Crear, editar y eliminar eventos.
- Inscribir participantes y actualizar los cupos a través de la API.
- Formularios con validación y mensajes de carga/error.
- Navegación responsive y modales de confirmación.

## Requisitos
- Node.js y npm.
- El backend `gestor_eventos` funcionando en `http://localhost:4000`, con MongoDB configurado.

## Instalación y ejecución
1. Cloná el repositorio: `git clone https://github.com/jazmintsakoumagkos/gestor_eventos_frontend.git`
2. Entrá a la carpeta: `cd gestor_eventos_frontend`
3. Instalá dependencias: `npm install`
4. Si la API usa otra dirección, copiá `.env.example` a `.env` y ajustá `VITE_API_URL`. Por defecto es `http://localhost:4000`.
5. Iniciá Vite con `npm run dev` y abrí la URL local que indique (normalmente `http://localhost:5173`).

Para generar la versión de producción: `npm run build`.

## Endpoints utilizados
- `GET /eventos`
- `GET /eventos/disponibles`
- `POST /eventos`
- `PUT /eventos/:id`
- `DELETE /eventos/:id`
- `POST /eventos/:id/registrar`

El backend se mantiene en su repositorio independiente: [gestor_eventos](https://github.com/jazmintsakoumagkos/gestor_eventos).
