SET client_encoding = 'UTF8';

SELECT * FROM users;
SELECT * FROM mangas;
SELECT * FROM categories;
SELECT * FROM demographic_categories;
SELECT * FROM purchase_orders;
SELECT * FROM presales;
SELECT * FROM wishlist;

-- Seleccionar todos los nombres de usuarios y sus mangas en wishlist.
SELECT users.display_name, mangas.name FROM wishlist
INNER JOIN users ON wishlist.user_id = users.id
INNER JOIN mangas ON wishlist.manga_id = mangas.id;

-- Ejemplo para un usuario epecífico,
-- reemplazar SELECT por id real enviado desde el modelo.
SELECT users.display_name, mangas.name FROM wishlist
INNER JOIN users ON wishlist.user_id = users.id
INNER JOIN mangas ON wishlist.manga_id = mangas.id
WHERE users.id = (SELECT id FROM users OFFSET 0 LIMIT 1);

-- Seleccionar un usuario por email.
SELECT * FROM users
WHERE users.email = 'usuario@email.com';

-- Seleccionar un manga por slug.
SELECT * FROM mangas
WHERE mangas.slug = 'manga-slug';

-- Seleccionar mangas disponibles en stock.
SELECT * FROM mangas
WHERE mangas.stock > 0;

-- Seleccionar los mangas asociados a una categoría.
SELECT mangas.name, mangas.slug, mangas.price, mangas.stock FROM manga_category
INNER JOIN mangas ON manga_category.manga_id = mangas.id
INNER JOIN categories ON manga_category.category_id = categories.id
WHERE categories.name = 'Acción';

-- Seleccionar un manga y sus categorías y categorías demográficas.
SELECT mangas.name, categories.name AS category, demographic_categories.name AS demographic_category
FROM mangas
LEFT JOIN manga_category ON mangas.id = manga_category.manga_id
LEFT JOIN categories ON manga_category.category_id = categories.id
LEFT JOIN manga_demographic_category ON mangas.id = manga_demographic_category.manga_id
LEFT JOIN demographic_categories ON manga_demographic_category.demographic_category_id = demographic_categories.id
WHERE mangas.slug = 'manga-slug';

-- Seleccionar los datos de una orden de compra y su comprador.
SELECT purchase_orders.order_number, purchase_orders.status, purchase_orders.currency,
purchase_orders.net_amount, purchase_orders.tax_amount, purchase_orders.total_amount,
users.display_name
FROM purchase_orders
LEFT JOIN users ON purchase_orders.buyer_id = users.id
WHERE purchase_orders.order_number = 'PO-2026-001';

-- Seleccionar los mangas y cantidades de una orden de compra.
SELECT purchase_order_items.sku, purchase_order_items.description,
purchase_order_items.quantity, purchase_order_items.unit_price,
purchase_order_items.subtotal
FROM purchase_order_items
WHERE purchase_order_items.purchase_order_id = (
    SELECT id FROM purchase_orders WHERE order_number = 'PO-2026-001'
);

-- Seleccionar las preventas de un usuario.
SELECT presales.presale_number, presales.status, presales.currency,
presales.total_amount, presales.expires_at
FROM presales
WHERE presales.customer_id = (SELECT id FROM users OFFSET 0 LIMIT 1);

-- Seleccionar los mangas y cantidades de una preventa.
SELECT presales_items.sku, mangas.name, presales_items.quantity,
presales_items.unit_price, presales_items.subtotal
FROM presales_items
LEFT JOIN mangas ON presales_items.manga_id = mangas.id
WHERE presales_items.presale_id = (
    SELECT id FROM presales WHERE presale_number = 'PRE-2026-001'
);
