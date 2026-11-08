# MoonShelf — Tienda de manga

Marketplace de manga creado como proyecto final de Desafío Latam. Incluye una interfaz web para explorar un catálogo, consultar productos y gestionar el carrito, junto con un backend en desarrollo.

## Funcionalidades

- Inicio y catálogo con búsqueda, filtros por género y ordenamiento.
- Vista de detalle de productos.
- Carrito de compras.
- Vistas de inicio de sesión, registro, perfil y órdenes.
- Diseño adaptable con React.

> El catálogo del frontend utiliza datos locales a modo de demo. La API aún está en una etapa de desarrollo inicial y no está implementada.

> Para la sesión de usuario no hay validaciones respecto al usuario de prueba. Puedes introducir cualquier correo y contraseña (8 o más caracteres) válidos para iniciar sesión.

## Tecnologías y dependencias

- **Frontend:** React, Vite, React Router, Tailwind CSS, Axios y Zod.
- **Backend:** Node.js, Express, PostgreSQL (`pg`), JWT, Argon2 y Zod.
- **Pruebas del backend:** Jest y Supertest.

## Requisitos

- Node.js y npm.
- PostgreSQL para conectar el backend a una base de datos.

## Instalación y ejecución

Instala las dependencias de cada aplicación desde su propio directorio:

```bash
cd backend
npm install
```

En otra terminal, instala las del frontend:

```bash
cd frontend
npm install
```

### Backend

Crea `backend/.env` con la configuración correspondiente a tu entorno:

```env
PORT=5000
JWT_SECRET=reemplaza-por-un-secreto-local
PGHOST=localhost
PGPORT=5432
PGDATABASE=manga_store
PGUSER=postgres
PGPASSWORD=reemplaza-por-tu-clave
```

Inicia el servidor desde `backend/`:

```bash
npm run dev
```

La API estará disponible en `http://localhost:5000`. Puedes comprobar su estado en `http://localhost:5000/`.

> Aún no disponemos un script SQL para la creación de las relaciones en la base de datos PostgreSQL debido a la etapa de desarrollo del backend, este script será incluido al repostorio una vez sea definido y probado.

### Frontend

Crea `frontend/.env` y configura la URL de la API:

```env
VITE_API_URL=http://localhost:5000
```

Inicia Vite desde `frontend/`:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local de la aplicación, por defecto `http://localhost:5173`.

## Pruebas y validaciones

Para ejecutar las pruebas del backend:

```bash
cd backend
npm test
```

Para compilar y revisar el frontend:

```bash
cd frontend
npm run build
npm run lint
```

## Documentación del proyecto

- [Contrato de datos de la API](./docs/5_Contrato_Datos_API.md)
- [Diseño de la base de datos](./docs/4_Diseño_Base_de_Datos.jpg)
- [Diseño de interfaz](./docs/1_Diseño_Interfaz_Gráfica.pdf)
- [Navegación y vistas](./docs/2_Navegación%20_Vistas.png)
- [Listado de dependencias](./docs/3_Listado_Dependencias.md)

## Estado de la Licencia

Proyecto académico en desarrollo. No se ha definido una licencia para el repositorio.
