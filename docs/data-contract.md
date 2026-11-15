# Contrato de datos de la API REST

Este contrato describe las rutas montadas actualmente en Express y las
respuestas producidas por sus controladores y modelos.

## Convenciones

- Los identificadores UUID se representan como cadenas.
- `DATE` se devuelve como una cadena `YYYY-MM-DD`.
- `TIMESTAMPTZ` se devuelve como una cadena ISO 8601.
- PostgreSQL `NUMERIC` se devuelve como cadena en las respuestas que retornan
  directamente los resultados de `pg` (por ejemplo, `"18400.00"`).
- `INTEGER` se devuelve como número.
- Los campos SQL anulables se devuelven como `null` cuando no tienen valor.
- Las rutas protegidas requieren `Authorization: Bearer <token>`.
- Las contraseñas no se incluyen en las respuestas. `users.password` contiene
  el hash generado al registrar al usuario.

## Servicio

### `GET /`

Devuelve información de la API y las URL de salud, usuarios y mangas.

### `GET /health`

**Respuesta `200 OK`:**

```json
{
  "status": "UP",
  "timestamp": "2026-11-15T12:00:00.000Z",
  "uptime": "120 seconds"
}
```

## Mangas

### `GET /api/mangas`

Devuelve el catálogo ordenado por nombre. Cada manga incluye sus categorías
temáticas y demográficas como arreglos de nombres.

**Respuesta `200 OK`:**

```json
{
  "mangas": [
    {
      "id": "uuid",
      "name": "Jujutsu Kaisen",
      "slug": "jujutsu-kaisen",
      "description": "Descripción del manga",
      "volume": "Vol. 18",
      "author": "Gege Akutami",
      "editorial": "Shueisha",
      "image_link": "https://example.com/image.jpg",
      "sku": "SKU72548",
      "origin": "Japón",
      "release_date": "2026-11-01",
      "price": "18400.00",
      "stock": 19,
      "categories": ["Acción"],
      "demographic_categories": ["Shonen"]
    }
  ]
}
```

### `GET /api/mangas/categories`

Devuelve las categorías temáticas.

**Respuesta `200 OK`:**

```json
{
  "categories": [
    { "id": "uuid", "name": "Acción" }
  ]
}
```

### `GET /api/mangas/demographic-categories`

Devuelve las categorías demográficas, separadas de las categorías temáticas.

**Respuesta `200 OK`:**

```json
{
  "categories": [
    { "id": "uuid", "name": "Shonen" }
  ]
}
```

### `GET /api/mangas/:id`

El parámetro `id` corresponde al UUID de `mangas.id`.

**Respuesta `200 OK`:**

```json
{
  "manga": {
    "id": "uuid",
    "name": "Jujutsu Kaisen",
    "slug": "jujutsu-kaisen",
    "description": "Descripción del manga",
    "volume": "Vol. 18",
    "author": "Gege Akutami",
    "editorial": "Shueisha",
    "image_link": "https://example.com/image.jpg",
    "sku": "SKU72548",
    "origin": "Japón",
    "release_date": "2026-11-01",
    "price": "18400.00",
    "stock": 19,
    "categories": ["Acción"],
    "demographic_categories": ["Shonen"]
  }
}
```

**Respuesta `404 Not Found`:** `{ "message": "Manga not found" }` si el
identificador no corresponde a un manga.

Un UUID con formato inválido produce `400 Bad Request` con
`{ "message": "Invalid params value" }`.

### `POST /api/mangas`

Crea un manga. El controlador no requiere autenticación y el modelo no asocia
automáticamente el manga con un usuario ni procesa asociaciones de categorías
en esta operación.

**Solicitud:**

```json
{
  "name": "Jujutsu Kaisen",
  "slug": "jujutsu-kaisen",
  "description": "Descripción del manga",
  "volume": "Vol. 18",
  "author": "Gege Akutami",
  "editorial": "Shueisha",
  "image_link": "https://example.com/image.jpg",
  "sku": "SKU72548",
  "origin": "Japón",
  "release_date": "2026-11-01",
  "price": "18400.00",
  "stock": 19
}
```

El modelo inserta estos campos y PostgreSQL genera `id` y `created_at`; `user_id`
queda `null`.

**Respuesta `201 Created`:** `{ "manga": { ... } }`, donde `manga` es la fila
insertada e incluye los campos de la tabla `mangas`.

### `PUT /api/mangas/:id`

Actualiza los campos de manga aceptados por `POST /api/mangas`.

**Respuesta `200 OK`:** `{ "manga": { ... } }`, donde `manga` es la fila
actualizada.

**Respuesta `404 Not Found`:** `{ "message": "Manga not found" }` si no existe
el identificador.

Un UUID con formato inválido produce `400 Bad Request` con
`{ "message": "Invalid params value" }`.

### `DELETE /api/mangas/:id`

**Respuesta `200 OK`:** `{ "message": "Manga deleted successfully" }`.

**Respuesta `404 Not Found`:** `{ "message": "Manga not found" }` si no existe
el identificador.

## Usuarios y autenticación

### `POST /api/users/register`

Crea un usuario. `image_link` no se solicita; la base de datos lo deja `null`
por defecto.

**Solicitud:**

```json
{
  "email": "persona@email.com",
  "full_name": "Nombre Apellido",
  "display_name": "NombreVisible",
  "password": "contraseña"
}
```

**Respuesta `201 Created`:**

```json
{
  "message": "User created successfully!",
  "user": {
    "id": "uuid",
    "email": "persona@email.com",
    "full_name": "Nombre Apellido",
    "display_name": "NombreVisible",
    "image_link": null
  }
}
```

Una colisión con el correo único se convierte actualmente en `400 Bad Request`
con `{ "message": "User already exists" }`.

### `POST /api/users/login`

**Solicitud:**

```json
{
  "email": "persona@email.com",
  "password": "contraseña"
}
```

**Respuesta `200 OK`:** `{ "token": "jwt" }`.

**Respuesta `401 Unauthorized`:** `{ "message": "Invalid credentials" }` si el
correo no existe o la contraseña no coincide.

### `GET /api/users/me`

Si se envía un token válido, devuelve el perfil público. Esta ruta no exige
autenticación: sin token, responde con `user: null`.

**Respuesta `200 OK` autenticada:**

```json
{
  "user": {
    "full_name": "Nombre Apellido",
    "display_name": "NombreVisible",
    "email": "persona@email.com"
  }
}
```

**Respuesta `200 OK` sin token:** `{ "user": null }`.

Un token inválido o expirado produce `401 Unauthorized`.

## Wishlist

La wishlist relaciona usuarios y mangas con la clave compuesta
`(user_id, manga_id)`. Ambas rutas requieren autenticación.

### `GET /api/users/me/wishlist`

Devuelve los mangas guardados por el usuario del token. Cada elemento usa la
misma representación de producto que `GET /api/mangas`.

**Respuesta `200 OK`:**

```json
{
  "wishlist": [
    {
      "id": "uuid",
      "name": "Jujutsu Kaisen",
      "slug": "jujutsu-kaisen",
      "description": "Descripción del manga",
      "volume": "Vol. 18",
      "author": "Gege Akutami",
      "editorial": "Shueisha",
      "image_link": "https://example.com/image.jpg",
      "sku": "SKU72548",
      "origin": "Japón",
      "release_date": "2026-11-01",
      "price": "18400.00",
      "stock": 19,
      "categories": ["Acción"],
      "demographic_categories": ["Shonen"]
    }
  ]
}
```

### `POST /api/users/me/wishlist`

Agrega un manga a la wishlist del usuario autenticado. La operación es
idempotente: repetirla para el mismo manga no crea otra relación.

**Solicitud:**

```json
{
  "mangaId": "uuid"
}
```

**Respuesta `201 Created` al agregar:**  
`{ "message": "Manga added to wishlist" }`.

**Respuesta `200 OK` si ya estaba en la wishlist:**  
`{ "message": "Manga added to wishlist" }`.

**Errores:**

- `400 Bad Request` si falta `mangaId` o no es una cadena.
- `400 Bad Request` con `{ "message": "Invalid params value" }` si `mangaId`
  tiene formato UUID inválido.
- `404 Not Found` con `{ "message": "Manga not found" }` si el UUID no
  corresponde a un manga.
- `401 Unauthorized` si falta el token o es inválido.
