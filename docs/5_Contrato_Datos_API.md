# Contrato de Datos API Rest
```JavaScript
// GET /mangas
response:
[
    {
        id: String,
        name: String,
        slug: String,
        author: String,
        editorial: String,
        image_link: String,
        origin: String,
        release_date: String,
        price: Number,
        stock: Number,
        categories:
        [
            {
                id: String,
                name: String,
            },
        ],
    },
]

// GET /mangas/:id
request:
{
    params:
    {
        id: String,
    },
}

response:
{
    id: String,
    name: String,
    slug: String,
    description: String,
    author: String,
    editorial: String,
    image_link: String,
    sku: String,
    origin: String,
    release_date: String,
    price: Number,
    stock: Number,
    categories:
    [
        {
            id: String,
            name: String,
        },
    ],
}

// POST /mangas
request:
    headers:
    {
        Authorization: "Bearer <token>",
    }
        
    payload: 
    {
        name: String,
        description: String,
        author: String,
        editorial: String,
        image_link: String,
        sku: String,
        origin: String,
        release_date: String,
        price: Number,
        stock: Number,
        categories:
        [
            {
                name: String,
            },
        ],
    }

response:
{
    message: String,
}

// GET /users/me
request:
    headers:
    {
        Authorization: "Bearer <token>",
    }

response:
{
    id: String,
    email: String,
    full_name: String,
    display_name: String,
    image_link: String,
}

// POST /users
request:
    headers:
    {
        Authorization: "Bearer <token>",
    }

    payload:
    {
        full_name: String,
        nick_name: String,
        email: String,
        password: String,
        image_link: String,
    }

response:
{
    message: String,
}

// POST /register
request:
    payload:
    {
        email: String,
        full_name: String,
        display_name: String,
        password: String,
    }

response:
{
    message: String,
}

// POST /login
request:
    payload:
    {
        email: String,
        password: String,
    }

response:
{
    token: String,
}

// GET /orders
request:
    headers:
    {
        Authorization: "Bearer <token>",
    }

response:
[
    {
        order_number: Number,
        buyer: String,
        supplier: String,
        status: String,
        currency: String,
        net_amount: Number,
        tax_amount: Number,
        total_amount: Number,
        shipping_address: String,
        notes: String,
        created_at: String,
        items:
        [
            {
                sku: String,
                description: String,
                quantity: Number,
                unit_price: Number,
                tax_rate: Number,
                subtotal: Number,
                created_at: String,
            },
        ],
    },
]

// GET /presales
request:
    headers:
    {
        Authorization: "Bearer <token>",
    }

response:
[
    {
        presale_number: Number,
        customer: String,
        status: String,
        currency: String,
        total_amount: Number,
        created_at: String,
        items:
        [
            {
                sku: String,
                quantity: Number,
                unit_price: Number,
                subtotal: Number,
                created_at: String,
            },
        ],
    },
]
```