# Contrato de datos de la API REST

Este contrato se basa en las tablas definidas en `backend/src/database/schema.sql`
y en los datos de ejemplo de `backend/src/database/mock-data.sql`.

## Convenciones

- Los identificadores `UUID` se representan como `string`.
- Las fechas `DATE` se representan como `string` con formato `YYYY-MM-DD`.
- Las fechas `TIMESTAMPTZ` se representan como `string` ISO 8601.
- Los campos `NUMERIC` se exponen como `number` en JSON. Si el backend devuelve
  directamente el resultado de `pg`, debe convertir esos valores, ya que el
  driver normalmente los entrega como `string`.
- Los campos que permiten `NULL` en SQL se representan como `null` cuando no
  tienen valor.
- Las relaciones de muchos a muchos se devuelven como arreglos. Sus tablas
  intermedias (`manga_category`, `manga_demographic_category`,
  `purchase_order_items` y `presales_items`) no se exponen como objetos
  independientes en estas respuestas.
- Las rutas protegidas reciben el encabezado `Authorization` con esquema
  `Bearer` y el JWT emitido por el endpoint de login.
- Las contraseñas nunca se incluyen en respuestas; en la base de datos se
  almacena su hash en `users.password`.

## Mangas

### `GET /mangas`

Devuelve el catálogo. Las categorías se obtienen mediante las tablas de relación
con `categories` y `demographic_categories`.

**Respuesta `200 OK`:**

```json
[
  {
    "id": "uuid",
    "name": "Jujutsu Kaisen",
    "slug": "jujutsu-kaisen",
    "volume": "Vol. 18",
    "author": "Gege Akutami",
    "editorial": "Shueisha",
    "image_link": "https://example.com/image.jpg",
    "origin": "Japón",
    "release_date": "2026-11-01",
    "price": 18400,
    "stock": 19,
    "categories": [
      {
        "id": "uuid",
        "name": "Acción"
      }
    ],
    "demographic_categories": [
      {
        "id": "uuid",
        "name": "Shonen"
      }
    ]
  }
]
```

### `GET /mangas/:id`

El parámetro `id` es el UUID de `mangas.id`.

**Respuesta `200 OK`:**

```json
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
  "price": 18400,
  "stock": 19,
  "categories": [
    {
      "id": "uuid",
      "name": "Acción"
    }
  ],
  "demographic_categories": [
    {
      "id": "uuid",
      "name": "Shonen"
    }
  ]
}
```

**Errores:** `400 Bad Request` si el UUID no tiene formato válido;
`404 Not Found` si no existe el manga.

### `POST /mangas`

Requiere autenticación. `user_id` se obtiene del usuario autenticado, no del
payload. Los identificadores de categorías corresponden a las tablas
`categories` y `demographic_categories`; las asociaciones se guardan en sus
respectivas tablas intermedias.

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
  "price": 18400,
  "stock": 19,
  "category_ids": ["uuid"],
  "demographic_category_ids": ["uuid"]
}
```

**Respuesta `201 Created`:**

```json
{
  "id": "uuid",
  "message": "Manga creado"
}
```

**Errores:** `400 Bad Request` para datos inválidos; `401 Unauthorized` si no
se envía un token válido; `409 Conflict` si `slug` o `sku` ya existen.

## Usuarios y autenticación

### `POST /register`

Crea un usuario en `users`. `image_link` es opcional y puede ser `null`.

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
  "id": "uuid",
  "email": "persona@email.com",
  "full_name": "Nombre Apellido",
  "display_name": "NombreVisible",
  "image_link": null
}
```

**Errores:** `400 Bad Request` para datos inválidos; `409 Conflict` si el
correo ya está registrado.

### `POST /login`

**Solicitud:**

```json
{
  "email": "persona@email.com",
  "password": "contraseña"
}
```

**Respuesta `200 OK`:**

```json
{
  "token": "jwt"
}
```

**Errores:** `400 Bad Request` para datos inválidos; `401 Unauthorized` si las
credenciales no son válidas.

### `GET /users/me`

Requiere autenticación. Devuelve el usuario asociado al token.

**Respuesta `200 OK`:**

```json
{
  "id": "uuid",
  "email": "persona@email.com",
  "full_name": "Nombre Apellido",
  "display_name": "NombreVisible",
  "image_link": null
}
```

**Errores:** `401 Unauthorized` si falta el token o no es válido.

### `POST /users`

Si se conserva esta ruta protegida del contrato anterior, utiliza los mismos
campos de usuario que `POST /register` (incluyendo `display_name`, no
`nick_name`). El esquema SQL no define roles, por lo que no permite distinguir
por sí solo a un administrador autorizado para crear otros usuarios. Para el
registro público, se recomienda usar `POST /register`.

## Órdenes de compra

### `GET /orders`

Requiere autenticación y devuelve las órdenes del usuario autenticado. `buyer`
puede ser `null` si la cuenta asociada fue eliminada. `order_number` es
`string`, tal como está definido en SQL; no es un número.

**Respuesta `200 OK`:**

```json
[
  {
    "id": "uuid",
    "order_number": "PO-2026-001",
    "buyer_id": "uuid",
    "buyer": "Mangalover",
    "status": "pendiente",
    "currency": "CLP",
    "net_amount": 36800,
    "tax_amount": 6992,
    "total_amount": 43792,
    "shipping_address": "Av. Libertador 1234, Santiago, Chile",
    "notes": "Entrega estándar",
    "created_at": "2026-11-10T12:00:00.000Z",
    "updated_at": "2026-11-10T12:00:00.000Z",
    "items": [
      {
        "id": "uuid",
        "manga_id": "uuid",
        "sku": "SKU72548",
        "description": "Jujutsu Kaisen - Vol. 18",
        "quantity": 2,
        "unit_price": 18400,
        "tax_rate": 19,
        "subtotal": 36800,
        "created_at": "2026-11-10T12:00:00.000Z"
      }
    ]
  }
]
```

`buyer_id` y `buyer` son `null` si la orden no tiene un usuario asociado.
`manga_id` es `null` en un ítem si el manga relacionado fue eliminado. La tabla
no contiene un campo `supplier`; por eso no se incluye en la respuesta.

## Preventas

### `GET /presales`

Requiere autenticación y devuelve las preventas del usuario autenticado.

**Respuesta `200 OK`:**

```json
[
  {
    "id": "uuid",
    "presale_number": "PRE-2026-001",
    "customer_id": "uuid",
    "customer": "chessy",
    "status": "pendiente",
    "currency": "CLP",
    "total_amount": 12500,
    "expires_at": "2026-12-10T12:00:00.000Z",
    "converted_order_id": null,
    "created_at": "2026-11-10T12:00:00.000Z",
    "updated_at": "2026-11-10T12:00:00.000Z",
    "items": [
      {
        "id": "uuid",
        "manga_id": "uuid",
        "sku": "SKU54327",
        "quantity": 1,
        "unit_price": 12500,
        "subtotal": 12500,
        "created_at": "2026-11-10T12:00:00.000Z"
      }
    ]
  }
]
```

`customer_id`, `customer`, `expires_at`, `converted_order_id` y el `manga_id`
de un ítem pueden ser `null`, según las relaciones y restricciones del esquema.

## Wishlist

La tabla `wishlist` relaciona usuarios y mangas mediante la clave compuesta
`(user_id, manga_id)`. No tiene un identificador propio ni columnas de fecha.
Estas rutas describen el acceso a esa relación y requieren autenticación.

### `GET /wishlist`

Devuelve los mangas guardados por el usuario autenticado. Cada elemento puede
usar la misma representación que `GET /mangas/:id`.

### `POST /wishlist`

**Solicitud:**

```json
{
  "manga_id": "uuid"
}
```

**Respuesta `201 Created`:**

```json
{
  "message": "Manga agregado a wishlist"
}
```

### `DELETE /wishlist/:mangaId`

Elimina de la wishlist del usuario autenticado la relación con el manga
indicado. Responde `204 No Content` si se eliminó.

## Correspondencia con el esquema SQL

| Tabla SQL | Datos expuestos en el contrato |
|---|---|
| `users` | Registro, login y perfil; nunca se devuelve `password` |
| `mangas` | Catálogo y detalle; incluye `volume`, `slug` y los campos requeridos |
| `categories` / `manga_category` | `categories` de cada manga |
| `demographic_categories` / `manga_demographic_category` | `demographic_categories` de cada manga |
| `wishlist` | Relación entre el usuario autenticado y sus mangas guardados |
| `purchase_orders` / `purchase_order_items` | Órdenes con sus ítems |
| `presales` / `presales_items` | Preventas con sus ítems |

Este documento describe el contrato esperado; no implica que todas estas rutas
estén implementadas o montadas actualmente en Express.
