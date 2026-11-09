SET client_encoding = 'UTF8';

DROP TABLE IF EXISTS purchase_order_items;
DROP TABLE IF EXISTS presales_items;
DROP TABLE IF EXISTS presales;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS wishlist;
DROP TABLE IF EXISTS manga_demographic_category;
DROP TABLE IF EXISTS manga_category;
DROP TABLE IF EXISTS mangas;
DROP TABLE IF EXISTS demographic_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(50) NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    image_link VARCHAR(2048),
    CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE TABLE mangas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description VARCHAR NOT NULL,
    volume VARCHAR(50) NOT NULL,
    author VARCHAR(150) NOT NULL,
    editorial VARCHAR(150) NOT NULL,
    image_link VARCHAR(2048) NOT NULL,
    sku VARCHAR(64) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    release_date DATE NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    stock INTEGER NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT mangas_slug_unique UNIQUE (slug),
    CONSTRAINT mangas_sku_unique UNIQUE (sku),
    CONSTRAINT mangas_price_nonnegative CHECK (price >= 0),
    CONSTRAINT mangas_stock_nonnegative CHECK (stock >= 0)
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    CONSTRAINT categories_name_unique UNIQUE (name)
);

CREATE TABLE demographic_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    CONSTRAINT demographic_categories_name_unique UNIQUE (name)
);

CREATE TABLE wishlist (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, manga_id)
);

CREATE TABLE manga_category (
    manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, category_id)
);

CREATE TABLE manga_demographic_category (
    manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    demographic_category_id UUID NOT NULL REFERENCES demographic_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, demographic_category_id)
);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL,
    buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    net_amount NUMERIC(12, 2) NOT NULL,
    tax_amount NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    shipping_address VARCHAR NOT NULL,
    notes VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT purchase_orders_order_number_unique UNIQUE (order_number),
    CONSTRAINT purchase_orders_amounts_nonnegative CHECK (
        net_amount >= 0 AND tax_amount >= 0 AND total_amount >= 0
    ),
    CONSTRAINT purchase_orders_total_matches_amounts CHECK (
        total_amount = net_amount + tax_amount
    )
);

CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    manga_id UUID REFERENCES mangas(id) ON DELETE SET NULL,
    sku VARCHAR(64) NOT NULL,
    description VARCHAR NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 19.00,
    subtotal NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT purchase_order_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT purchase_order_items_prices_nonnegative CHECK (
        unit_price >= 0 AND subtotal >= 0
    ),
    CONSTRAINT purchase_order_items_tax_rate_range CHECK (
        tax_rate >= 0 AND tax_rate <= 100
    ),
    CONSTRAINT purchase_order_items_subtotal_matches_quantity CHECK (
        subtotal = quantity * unit_price
    )
);

CREATE TABLE presales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presale_number VARCHAR(50) NOT NULL,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    expires_at TIMESTAMPTZ,
    converted_order_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT presales_presale_number_unique UNIQUE (presale_number),
    CONSTRAINT presales_converted_order_unique UNIQUE (converted_order_id),
    CONSTRAINT presales_total_amount_nonnegative CHECK (total_amount >= 0)
);

CREATE TABLE presales_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presale_id UUID NOT NULL REFERENCES presales(id) ON DELETE CASCADE,
    manga_id UUID REFERENCES mangas(id) ON DELETE SET NULL,
    sku VARCHAR(64) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT presales_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT presales_items_prices_nonnegative CHECK (
        unit_price >= 0 AND subtotal >= 0
    ),
    CONSTRAINT presales_items_subtotal_matches_quantity CHECK (
        subtotal = quantity * unit_price
    )
);

CREATE INDEX wishlist_manga_id_idx ON wishlist (manga_id);
CREATE INDEX manga_category_category_id_idx ON manga_category (category_id);
CREATE INDEX manga_demographic_category_demographic_category_id_idx
    ON manga_demographic_category (demographic_category_id);
CREATE INDEX mangas_user_id_idx ON mangas (user_id);
CREATE INDEX purchase_orders_buyer_id_idx ON purchase_orders (buyer_id);
CREATE INDEX purchase_order_items_order_id_idx ON purchase_order_items (purchase_order_id);
CREATE INDEX purchase_order_items_manga_id_idx ON purchase_order_items (manga_id);
CREATE INDEX presales_customer_id_idx ON presales (customer_id);
CREATE INDEX presales_items_presale_id_idx ON presales_items (presale_id);
CREATE INDEX presales_items_manga_id_idx ON presales_items (manga_id);
