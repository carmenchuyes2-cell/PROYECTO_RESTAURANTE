-- demo.sql: consultas para la exposición (solo lectura)
-- Ejecutar con: docker exec -i restaurante-pg psql -U admin -d restaurante < demo.sql

\echo '=== 1. Tablas de la base de datos ==='
\dt

\echo '=== 2. Productos y stock ==='
SELECT id, nombre, emoji, ROUND(precio/100.0, 2) AS precio_soles, stock FROM productos ORDER BY id;

\echo '=== 3. Inicio de sesion del cliente demo (DNI 12345678) ==='
SELECT nombre FROM clientes
WHERE dni = '12345678' AND clave = crypt('12345678', clave);

\echo '=== 4. Pedidos y su estado ==='
SELECT id, dni_cliente, estado, cantidad, ROUND(total/100.0, 2) AS soles, atendio
FROM pedidos ORDER BY id;

\echo '=== 5. Detalle de productos del pedido 1 ==='
SELECT pi.pedido_id, p.nombre, pi.cantidad, ROUND(pi.precio/100.0, 2) AS precio_soles
FROM pedido_items pi
JOIN productos p ON p.id = pi.producto_id
WHERE pi.pedido_id = 1;

\echo '=== 6. Cola de caja (pendientes) ==='
SELECT id, dni_cliente, ROUND(total/100.0, 2) AS soles
FROM pedidos WHERE estado = 'PENDIENTE' ORDER BY id;

\echo '=== 7. Boletas emitidas ==='
SELECT 'B001-' || lpad(v.num::text, 6, '0') AS boleta,
       v.pedido_id, ROUND(p.total/100.0, 2) AS total_soles,
       ROUND(v.recibido/100.0, 2) AS recibido_soles,
       ROUND(v.vuelto/100.0, 2) AS vuelto_soles, v.vendedor
FROM ventas v JOIN pedidos p ON p.id = v.pedido_id
ORDER BY v.num;

\echo '=== 8. Resumen del dia ==='
SELECT estado, count(*) AS cantidad, ROUND(sum(total)/100.0, 2) AS soles
FROM pedidos
WHERE fecha::date = current_date AND estado <> 'PENDIENTE'
GROUP BY estado;

\echo '=== 9. Ventas por metodo de pago ==='
SELECT m.nombre AS metodo, count(*) AS boletas, ROUND(sum(p.total)/100.0, 2) AS soles
FROM ventas v
JOIN pedidos p ON p.id = v.pedido_id
JOIN metodos_pago m ON m.id = v.metodo
GROUP BY m.nombre;
