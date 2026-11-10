SET client_encoding = 'UTF8';

-- Users
INSERT INTO users (email, full_name, display_name, password) VALUES
('jretamales15@email.com', 'Juan Retamales', 'JohnDistructor', 'password hash'),
('pbaeza543@email.com', 'Pedro Baeza', 'Mangalover', 'password hash'),
('s.flores.12@email.com', 'Steve Flores', 'papelucho', 'password hash'),
('m.plaza64@email.com', 'Michael Plaza', 'chessy', 'password hash'),
('a.rodriguez21@email.com', 'Alberto Rodriguez', 'MagicalSponge912', 'password hash');

-- Mangas
INSERT INTO mangas (
   name, slug, description, volume, author, editorial, image_link, sku,
    origin, release_date, price, stock, user_id) VALUES 
(
    'Black Clover', 'black-clover', 'Asta y Yuno luchan por convertirse en el mago más poderoso del reino, enfrentando enemigos, misterios y una rivalidad intensa que define el destino del mundo.', 'Vol. 12', 'Yūki Tabata',
    'Shueisha', 'https://example.com/image.jpg', 'SKU52745',
    'Japón', '2024-01-01', 14900, 47, (SELECT id FROM users ORDER BY email OFFSET 1 LIMIT 1)
),
(
    'Dorohedoro', 'dorohedoro', 'Un mundo extraño y brutal donde la magia, el caos y la supervivencia se mezclan en una historia salvaje, original y repleta de personajes inolvidables.', 'Vol. 7', 'Q Hayashida',
    'Nippon', 'https://example.com/image.jpg', 'SKU54327',
    'Japón', '2026-10-18', 12500, 82, (SELECT id FROM users ORDER BY email OFFSET 3 LIMIT 1)
),
(
    'Nagatoro-san', 'nagatoro-san', 'Una historia ligera y encantadora con momentos cómicos, química juvenil y un tono muy agradable para quienes disfrutan del romance casual y lleno de personalidad.', 'Vol. 16', 'Nanashi',
    'Kodansha', 'https://example.com/image.jpg', 'SKU2463',
    'Japón', '2026-09-20', 16200, 54, (SELECT id FROM users ORDER BY email OFFSET 4 LIMIT 1)
),
(
    'Kase-San & Yamada', 'kase-san-and-samada', 'Un romance contemporáneo lleno de sensibilidad, cercanía y detalle, donde la conexión entre dos personajes se desarrolla con autenticidad y ternura.', 'Vol. 4', 'Hiromi Takashima',
    'Manga City', 'https://example.com/image.jpg', 'SKU97365',
    'Japón', '2026-08-15', 15000, 103, (SELECT id FROM users ORDER BY email OFFSET 2 LIMIT 1)
),
(
    'Jujutsu Kaisen', 'jujutsu-kaisen', 'Un joven con un poder sobrenatural se ve arrastrado a una batalla intensa contra maldiciones, con acción rápida, tensión emocional y una gran dosis de estilo visual.', 'Vol. 18', 'Gege Akutami',
    'Shueisha', 'https://example.com/image.jpg', 'SKU72548',
    'Japón', '2026-11-01', 18400, 19, (SELECT id FROM users ORDER BY email OFFSET 0 LIMIT 1)
);

-- Categories
INSERT INTO categories (name) VALUES
('Rom-com'),
('Romance'),
('Comedia'),
('Acción'),
('Terror'),
('Drama'),
('Yuri'),
('Slice of life'),
('Fantasía'),
('Fantasía mágica'),
('Fantasía oscura');

-- Demographic categories
INSERT INTO demographic_categories (name) VALUES
('Shonen'),
('Shojo'),
('Seinen'),
('Josei'),
('Kodomo');

-- Manga category
INSERT INTO manga_category (manga_id, category_id) VALUES
((SELECT id FROM mangas WHERE name = 'Black Clover'),(SELECT id FROM categories WHERE name = 'Acción')),
((SELECT id FROM mangas WHERE name = 'Black Clover'),(SELECT id FROM categories WHERE name = 'Fantasía mágica')),
((SELECT id FROM mangas WHERE name = 'Black Clover'),(SELECT id FROM categories WHERE name = 'Comedia')),

((SELECT id FROM mangas WHERE name = 'Dorohedoro'),(SELECT id FROM categories WHERE name = 'Acción')),
((SELECT id FROM mangas WHERE name = 'Dorohedoro'),(SELECT id FROM categories WHERE name = 'Fantasía oscura')),
((SELECT id FROM mangas WHERE name = 'Dorohedoro'),(SELECT id FROM categories WHERE name = 'Comedia')),

((SELECT id FROM mangas WHERE name = 'Nagatoro-san'),(SELECT id FROM categories WHERE name = 'Rom-com')),

((SELECT id FROM mangas WHERE name = 'Kase-San & Yamada'),(SELECT id FROM categories WHERE name = 'Yuri')),
((SELECT id FROM mangas WHERE name = 'Kase-San & Yamada'),(SELECT id FROM categories WHERE name = 'Slice of life')),

((SELECT id FROM mangas WHERE name = 'Jujutsu Kaisen'),(SELECT id FROM categories WHERE name = 'Acción')),
((SELECT id FROM mangas WHERE name = 'Jujutsu Kaisen'),(SELECT id FROM categories WHERE name = 'Fantasía oscura')),
((SELECT id FROM mangas WHERE name = 'Jujutsu Kaisen'),(SELECT id FROM categories WHERE name = 'Terror'));

-- Manga demographic category
INSERT INTO manga_demographic_category (manga_id, demographic_category_id) VALUES
((SELECT id FROM mangas WHERE name = 'Black Clover'),(SELECT id FROM demographic_categories WHERE name = 'Shonen')),
((SELECT id FROM mangas WHERE name = 'Dorohedoro'),(SELECT id FROM demographic_categories WHERE name = 'Seinen')),
((SELECT id FROM mangas WHERE name = 'Nagatoro-san'),(SELECT id FROM demographic_categories WHERE name = 'Shonen')),
((SELECT id FROM mangas WHERE name = 'Kase-San & Yamada'),(SELECT id FROM demographic_categories WHERE name = 'Shojo')),
((SELECT id FROM mangas WHERE name = 'Jujutsu Kaisen'),(SELECT id FROM demographic_categories WHERE name = 'Shonen'));


-- Wishlist
INSERT INTO wishlist (user_id, manga_id) VALUES
((SELECT id FROM users ORDER BY email OFFSET 1 LIMIT 1),(SELECT id FROM mangas WHERE name = 'Dorohedoro')),
((SELECT id FROM users ORDER BY email OFFSET 1 LIMIT 1),(SELECT id FROM mangas WHERE name = 'Jujutsu Kaisen')),
((SELECT id FROM users ORDER BY email OFFSET 3 LIMIT 1),(SELECT id FROM mangas WHERE name = 'Dorohedoro')),
((SELECT id FROM users ORDER BY email OFFSET 4 LIMIT 1),(SELECT id FROM mangas WHERE name = 'Nagatoro-san')),
((SELECT id FROM users ORDER BY email OFFSET 0 LIMIT 1),(SELECT id FROM mangas WHERE name = 'Kase-San & Yamada')),
((SELECT id FROM users ORDER BY email OFFSET 0 LIMIT 1),(SELECT id FROM mangas WHERE name = 'Jujutsu Kaisen'));

-- Purchase orders
INSERT INTO purchase_orders (
    order_number, buyer_id, status, currency, net_amount,
    tax_amount, total_amount, shipping_address, notes
) VALUES (
    'PO-2026-001',
    (SELECT id FROM users ORDER BY email OFFSET 1 LIMIT 1),
    'pendiente',
    'CLP',
    36800,
    6992,
    43792,
    'Av. Libertador 1234, Santiago, Chile',
    'Entrega estándar'
);

-- Purchase order items
INSERT INTO purchase_order_items (
    purchase_order_id, manga_id, sku, description, quantity, unit_price,
    tax_rate, subtotal
) VALUES
(
    (SELECT id FROM purchase_orders WHERE order_number = 'PO-2026-001'),
    (SELECT id FROM mangas WHERE sku = 'SKU72548'),
    'SKU72548',
    'Jujutsu Kaisen - Vol. 18',
    2,
    18400,
    19.00,
    36800
);

-- Presales
INSERT INTO presales (
    presale_number, customer_id, status, currency, total_amount, expires_at
) VALUES (
    'PRE-2026-001',
    (SELECT id FROM users ORDER BY email OFFSET 3 LIMIT 1),
    'pendiente',
    'CLP',
    12500,
    CURRENT_TIMESTAMP + INTERVAL '30 days'
);

-- Presales items
INSERT INTO presales_items (
    presale_id, manga_id, sku, quantity, unit_price, subtotal
) VALUES (
    (SELECT id FROM presales WHERE presale_number = 'PRE-2026-001'),
    (SELECT id FROM mangas WHERE sku = 'SKU54327'),
    'SKU54327',
    1,
    12500,
    12500
);