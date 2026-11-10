CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- para guardar contraseñas cifradas

CREATE TABLE productos (
  id      SMALLINT PRIMARY KEY,
  nombre  VARCHAR(40) NOT NULL UNIQUE,
  emoji   VARCHAR(8),
  precio  INTEGER NOT NULL CHECK (precio > 0),   -- céntimos
  stock   INTEGER NOT NULL CHECK (stock >= 0)    -- nunca negativo
);

CREATE TABLE clientes (
  dni     CHAR(8) PRIMARY KEY CHECK (dni ~ '^[0-9]{8}$'),
  nombre  VARCHAR(60) NOT NULL CHECK (length(trim(nombre)) >= 3),
  correo  VARCHAR(80) NOT NULL UNIQUE CHECK (correo ~ '^[^@ ]+@[^@ ]+\.[^@ ]+$'),
  clave   TEXT NOT NULL                          -- hash, no texto plano
);

CREATE TABLE empleados (
  usuario VARCHAR(20) PRIMARY KEY,
  dni     CHAR(8) NOT NULL UNIQUE,
  nombre  VARCHAR(60) NOT NULL,
  clave   TEXT NOT NULL,
  rol     VARCHAR(10) NOT NULL CHECK (rol IN ('empleado','admin'))
);

CREATE TABLE metodos_pago (
  id      SMALLINT PRIMARY KEY,
  nombre  VARCHAR(30) NOT NULL
);

CREATE TABLE pedidos (
  id          SERIAL PRIMARY KEY,                -- P-0001
  dni_cliente CHAR(8) NOT NULL REFERENCES clientes(dni),
  fecha       TIMESTAMP NOT NULL DEFAULT now(),
  metodo      SMALLINT NOT NULL REFERENCES metodos_pago(id),
  estado      VARCHAR(10) NOT NULL DEFAULT 'PENDIENTE'
              CHECK (estado IN ('PENDIENTE','COBRADO','ANULADO')),
  atendio     VARCHAR(20),                       -- cajero o 'cliente'
  cantidad    INTEGER NOT NULL DEFAULT 0,
  subtotal    INTEGER NOT NULL DEFAULT 0,
  igv         INTEGER NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE pedido_items (
  pedido_id   INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id SMALLINT REFERENCES productos(id),
  cantidad    INTEGER NOT NULL CHECK (cantidad > 0),
  precio      INTEGER NOT NULL,                  -- precio al momento de comprar
  PRIMARY KEY (pedido_id, producto_id)
);

CREATE TABLE ventas (
  num       SERIAL PRIMARY KEY,                  -- B001-000001
  pedido_id INTEGER NOT NULL UNIQUE REFERENCES pedidos(id),
  fecha     TIMESTAMP NOT NULL DEFAULT now(),
  metodo    SMALLINT NOT NULL REFERENCES metodos_pago(id),
  recibido  INTEGER NOT NULL DEFAULT 0,
  vuelto    INTEGER NOT NULL DEFAULT 0,
  vendedor  VARCHAR(20) NOT NULL REFERENCES empleados(usuario)
);
