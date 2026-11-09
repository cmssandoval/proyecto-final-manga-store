SET client_encoding = 'UTF8';

-- Ejemplos de consulta para insertar datos
--* Cada dato en duro debe ser reemplazado por un parámetro en el modelo.
--* Usar consultas parametrizadas para mayor seguridad.

-- User
INSERT INTO users (email, full_name, display_name, password) VALUES
('fjimenez@email.com', 'Fernando Jiménez', 'jojostanduser', 'password hash');

-- Manga
INSERT INTO mangas (
    name, slug, description, volume, author, editorial, image_link, sku,
    origin, release_date, price, stock, user_id) VALUES 
(
    'Black Clover',
    'black-clover',
    'Asta y Yuno luchan por convertirse en el mago más poderoso del reino, enfrentando enemigos, misterios y una rivalidad intensa que define el destino del mundo.',
    'Vol. 12',
    'Yūki Tabata',
    'Shueisha',
    'https://example.com/image.jpg',
    'SKU52745',
    'Japón',
    '2024-01-01',
    14900,
    47,
    (SELECT id FROM users OFFSET 0 LIMIT 1)     -- Ejemplo de usuario, también reemplazar por parámetro en el modelo
);

-- Category
INSERT INTO categories (name) VALUES ('Comedia');

-- Demographic category
INSERT INTO demographic_categories (name) VALUES ('Shonen');

-- Manga category
INSERT INTO manga_category (manga_id, category_id) VALUES
((SELECT id FROM mangas WHERE name = 'Black Clover'),(SELECT id FROM categories WHERE name = 'Acción'));

-- Manga demographic category
INSERT INTO manga_demographic_category (manga_id, demographic_category_id) VALUES
((SELECT id FROM mangas WHERE name = 'Black Clover'),(SELECT id FROM demographic_categories WHERE name = 'Shonen'));

-- Wishlist
INSERT INTO wishlist (user_id, manga_id) VALUES
((SELECT id FROM users OFFSET 0 LIMIT 1),(SELECT id FROM mangas WHERE name = 'Dorohedoro'));

-- Purchase order
INSERT INTO purchase_orders (
    order_number, buyer_id, status, currency, net_amount,
    tax_amount, total_amount, shipping_address, notes
) VALUES (
    'PO-2026-002',
    (SELECT id FROM users OFFSET 0 LIMIT 1),
    'pendiente',
    'CLP',
    18400,
    3496,
    21896,
    'Av. Libertador 1234, Santiago, Chile',
    'Entrega estándar'
);

-- Purchase order item
INSERT INTO purchase_order_items (
    purchase_order_id, manga_id, sku, description, quantity, unit_price,
    tax_rate, subtotal
) VALUES (
    (SELECT id FROM purchase_orders WHERE order_number = 'PO-2026-002'),
    (SELECT id FROM mangas WHERE sku = 'SKU72548'),
    'SKU72548',
    'Jujutsu Kaisen - Vol. 18',
    1,
    18400,
    19.00,
    18400
);

-- Presale
INSERT INTO presales (
    presale_number, customer_id, status, currency, total_amount, expires_at
) VALUES (
    'PRE-2026-002',
    (SELECT id FROM users OFFSET 0 LIMIT 1),
    'pendiente',
    'CLP',
    14900,
    CURRENT_TIMESTAMP + INTERVAL '30 days'
);

-- Presale item
INSERT INTO presales_items (
    presale_id, manga_id, sku, quantity, unit_price, subtotal
) VALUES (
    (SELECT id FROM presales WHERE presale_number = 'PRE-2026-002'),
    (SELECT id FROM mangas WHERE sku = 'SKU52745'),
    'SKU52745',
    1,
    14900,
    14900
);
