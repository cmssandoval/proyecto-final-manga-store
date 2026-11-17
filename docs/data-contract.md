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
`(user_id, manga_id)`. Todas sus rutas requieren autenticación.

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

### `DELETE /api/users/me/wishlist/:mangaId`

Quita el manga indicado de la wishlist del usuario autenticado. La operación
es idempotente: devuelve `204 No Content` aunque el manga no estuviera en la
wishlist.

**Errores:**

- `400 Bad Request` con `{ "message": "Invalid params value" }` si `mangaId`
  tiene formato UUID inválido.
- `401 Unauthorized` si falta el token o es inválido.

## Carrito

Todas las rutas de `/api/cart` requieren autenticación. Cada usuario tiene un
carrito persistido. Sus elementos incluyen `cart_item_id` (identificador de la
fila del carrito), `id` (identificador del manga), los datos del manga y
`quantity`.

### `GET /api/cart`

**Respuesta `200 OK`:**

```json
{
  "cart": {
    "id": "uuid",
    "items": [
      {
        "cart_item_id": "uuid",
        "id": "uuid",
        "name": "Jujutsu Kaisen",
        "price": "18400.00",
        "stock": 19,
        "quantity": 1
      }
    ]
  }
}
```

Si el usuario todavía no tiene un carrito, se devuelve
`{ "cart": { "id": null, "items": [] } }`.

### `POST /api/cart`

Agrega unidades al carrito. Si el manga ya existe, suma la cantidad solicitada.

**Solicitud:** `{ "mangaId": "uuid", "quantity": 1 }`; `quantity` es opcional
y por defecto vale `1`.

**Respuesta `201 Created`:** `{ "cart": { "id": "uuid", "items": [] } }`,
con el carrito actualizado.

**Errores `400 Bad Request`:** `mangaId` debe ser un UUID válido y `quantity`,
si se envía, debe ser un entero positivo.

### `POST /api/cart/sync`

Fusiona los elementos de un carrito invitado en el carrito del usuario
autenticado. Si un manga ya estaba guardado, suma sus cantidades. La operación
es atómica: si algún elemento no puede agregarse, no se aplica ninguno.

**Solicitud:**

```json
{
  "items": [
    { "mangaId": "uuid", "quantity": 2 }
  ]
}
```

**Respuesta `200 OK`:** `{ "cart": { "id": "uuid", "items": [] } }`,
con el carrito fusionado.

**Error `400 Bad Request`:** `items` debe ser un arreglo de elementos con
`mangaId` UUID y `quantity` entero positivo.

### `PUT /api/cart/:id`

Actualiza la cantidad de un elemento. `:id` corresponde a `cart_item_id`.

**Solicitud:** `{ "quantity": 2 }`.

**Respuesta `200 OK`:** `{ "cart": { "id": "uuid", "items": [] } }`.

**Errores:** `404 Not Found` si el elemento no pertenece al usuario o no
existe; `400 Bad Request` si el `id` no es UUID válido, `quantity` no es un
entero positivo o la cantidad es superior al stock.

### `DELETE /api/cart/:id`

Elimina el elemento identificado por `cart_item_id`.

**Respuesta `204 No Content`** si se eliminó.

**Respuesta `404 Not Found`** si el elemento no pertenece al usuario o no
existe.

**Error `400 Bad Request`** si `:id` no es un UUID válido.

### `DELETE /api/cart`

Elimina el carrito del usuario autenticado. La fila de `carts` se elimina y
PostgreSQL elimina en cascada sus elementos de `cart_items`. La operación es
idempotente.

**Respuesta `204 No Content`**, incluso si el usuario no tenía un carrito.

Las operaciones que agregarían una cantidad superior al stock disponible
responden `400 Bad Request`; un manga inexistente responde `404 Not Found`.
Los errores de UUID inválido responden `400 Bad Request`.

## Órdenes

Todas las rutas requieren autenticación y solo exponen órdenes del usuario
autenticado. Los importes se calculan con los precios de `mangas`; no se
aceptan importes enviados por el cliente. Crear una orden descuenta el stock,
guarda la orden y sus ítems, y elimina el carrito autenticado en una misma
transacción. Se aplica el 19 % de impuesto configurado en
`purchase_order_items`, redondeado por ítem.

### `GET /api/orders`

Devuelve las órdenes del usuario, de más reciente a más antigua, junto con sus
ítems.

**Respuesta `200 OK`:** `{ "orders": [ ... ] }`.

### `GET /api/orders/:id`

Devuelve una orden perteneciente al usuario autenticado.

**Respuesta `200 OK`:** `{ "order": { ... } }`. Si no existe o pertenece a
otro usuario, responde `404 Not Found`.

### `POST /api/orders`

Crea una orden pendiente con moneda `CLP`. El número se genera en el backend.

**Solicitud:**

```json
{
  "shippingAddress": "Av. Libertador 1234, Santiago, Chile",
  "notes": "Entrega estándar",
  "items": [
    { "mangaId": "uuid", "quantity": 1 }
  ]
}
```

`notes` es opcional; `items` debe contener al menos un manga y una
cantidad entera positiva por manga. El precio y los datos descriptivos se
obtienen de la base de datos.

**Respuesta `201 Created`:** `{ "order": { ... } }`.

**Errores:** `400 Bad Request` para solicitudes inválidas; `404 Not Found` si
algún manga no existe; `409 Conflict` si no hay stock suficiente. Si falla la
operación, no se guarda la orden ni se descuentan unidades.

### `POST /api/orders/sync`

Importa de forma atómica las órdenes que un invitado guardó en `localStorage`
al historial del usuario autenticado. Cada `guestOrderId` se conserva como
`orderNumber`, lo que permite reintentar la solicitud sin crear órdenes ni
descontar stock nuevamente. Los precios se recalculan con los valores actuales
de `mangas`; no se aceptan importes ni descripciones del cliente.

**Solicitud:**

```json
{
  "orders": [
    {
      "guestOrderId": "GUEST-1731842034123-a1b2c3",
      "shippingAddress": "Av. Libertador 1234, Santiago, Chile",
      "items": [
        { "mangaId": "uuid", "quantity": 1 }
      ]
    }
  ]
}
```

Cada orden debe tener un identificador `GUEST-*` generado localmente y al
menos un ítem. Si el mismo identificador ya pertenece al usuario autenticado,
se considera sincronizado. Si pertenece a otra cuenta, la solicitud falla con
`409 Conflict`.

**Respuesta `200 OK`:** `{ "orders": [ ... ] }`, con el historial actualizado
del usuario. El cliente debe eliminar sus órdenes locales solo después de
recibir una respuesta exitosa.

**Errores:** `400 Bad Request` para solicitudes inválidas; `404 Not Found` si
algún manga no existe; `409 Conflict` si no hay stock suficiente o si el
identificador ya pertenece a otra cuenta. El lote completo se revierte ante
cualquier error, por lo que las órdenes locales pueden conservarse y
reenviarse.

## Preventas

Todas las rutas requieren autenticación y se limitan a las preventas del
usuario autenticado. Cada ítem debe referenciar un manga existente; sus datos
descriptivos, SKU y precio se toman de la base de datos. El total es la suma de
los subtotales (sin impuesto), la moneda es `CLP` y la preventa vence en 30
días. Solo se admiten mangas cuya `release_date` sea posterior a la fecha
actual de la base de datos.

### `GET /api/presales`

Devuelve las preventas del usuario, de más reciente a más antigua, con sus
ítems.

**Respuesta `200 OK`:** `{ "presales": [ ... ] }`.

### `GET /api/presales/:id`

Devuelve una preventa perteneciente al usuario autenticado. Si no existe o
pertenece a otro usuario, responde `404 Not Found`.

**Respuesta `200 OK`:** `{ "presale": { ... } }`.

### `POST /api/presales`

Crea una preventa pendiente. Su encabezado y sus ítems se guardan en una
transacción.

**Solicitud:**

```json
{
  "items": [
    { "mangaId": "uuid", "quantity": 1 }
  ]
}
```

`items` debe contener al menos un manga y una cantidad entera
positiva por manga.

**Respuesta `201 Created`:** `{ "presale": { ... } }`.

**Errores:** `400 Bad Request` para solicitudes inválidas; `404 Not Found` si
algún manga no existe; `409 Conflict` si algún manga ya fue lanzado.
