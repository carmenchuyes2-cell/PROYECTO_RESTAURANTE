INSERT INTO metodos_pago VALUES
 (0,'Efectivo'),(1,'Tarjeta'),(2,'Yape'),(3,'Tarjeta de crédito');

INSERT INTO productos VALUES
 (1,'Hamburguesa Clasica','🍔',1290,50),
 (2,'Pollo Crispy','🍗',1450,40),
 (3,'Papas Fritas Grandes','🍟',750,80),
 (4,'Combo Familiar','🧺',3990,20),
 (5,'Hot Dog Especial','🌭',990,45),
 (6,'Gaseosa 500ml','🥤',450,100),
 (7,'Nuggets x10','🍖',1190,35),
 (8,'Helado Sundae','🍨',650,30);

INSERT INTO empleados VALUES
 ('admin','10000001','Administrador',crypt('123456',gen_salt('bf')),'admin'),
 ('empleado','10000002','Cajero',crypt('123456789',gen_salt('bf')),'empleado');

INSERT INTO clientes VALUES
 ('12345678','Cliente Demo','demo@restaurantelatina.com',crypt('12345678',gen_salt('bf')));
