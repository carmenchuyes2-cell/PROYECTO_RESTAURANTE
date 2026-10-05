/*
 * RestauranteLatina - LOGICA DEL SISTEMA EN C
 * ------------------------------------------------------------------
 * Este archivo contiene TODA la logica de como funciona el sistema.
 * El diseno de la pagina (diseno.js, en JavaScript) solo dibuja las
 * pantallas y los botones, le pasa a C lo que el usuario escribe o pulsa
 * y muestra lo que C responde. JavaScript no calcula ni decide nada.
 *
 * Se compila a WebAssembly para que el navegador lo ejecute:
 *
 *   zig cc --target=wasm32-freestanding -Oz -nostdlib \
 *          -Wl,--no-entry -Wl,--export-dynamic -o logica.wasm logica.c
 *
 * (luego logica.wasm se guarda en base64 al final de diseno.js, PARTE 4)
 *
 * Que hace este archivo:
 *   1. Catalogo de productos (nombre, emoji, precio)
 *   2. Base de datos: clientes, pedidos, ventas, stock y contadores
 *   3. Carrito: agregar, cambiar cantidad, quitar, validar stock
 *   4. Calculos: subtotal, IGV 18%, total y vuelto
 *   5. Registro e inicio de sesion (clientes y empleados)
 *   6. Pedidos: crear, cobrar (genera la boleta) y anular
 *   7. Listas y reportes: pedidos por cobrar, mis pedidos, ventas
 *
 * Todos los montos se manejan en CENTIMOS (enteros) para no tener
 * errores de redondeo: S/ 12.90 = 1290.
 * Las fechas llegan como numeros: dia = AAAAMMDD, hora = HHMMSS.
 */

#define EXPORT __attribute__((visibility("default")))

/* ============ Utilidades de texto (sin librerias) ============ */
static int largo(const char *s) { int n = 0; while (s[n]) n++; return n; }
static int iguales(const char *a, const char *b) {
    while (*a && *a == *b) { a++; b++; }
    return *a == *b;
}
static void copiar(char *destino, const char *origen, int tam) {
    int i = 0;
    for (; i < tam - 1 && origen[i]; i++) destino[i] = origen[i];
    destino[i] = '\0';
}
static int esDigito(char c) { return c >= '0' && c <= '9'; }
static int soloDigitos(const char *s, int cuantos) {
    if (largo(s) != cuantos) return 0;
    for (int i = 0; s[i]; i++) if (!esDigito(s[i])) return 0;
    return 1;
}
/* Largo sin contar espacios al inicio y al final */
static int largoSinEspacios(const char *s) {
    int ini = 0, fin = largo(s);
    while (ini < fin && s[ini] == ' ') ini++;
    while (fin > ini && s[fin - 1] == ' ') fin--;
    return fin - ini;
}
/* Pone en cero un bloque de memoria */
static void limpiar(void *p, int tam) {
    volatile char *b = (volatile char *)p;
    for (int i = 0; i < tam; i++) b[i] = 0;
}

/* Casillas de texto: la pagina escribe aqui lo que el usuario teclea */
#define N_CASILLAS 5
#define TAM_CASILLA 128
static char casillas[N_CASILLAS][TAM_CASILLA];
EXPORT char *casilla(int n) { return (n >= 0 && n < N_CASILLAS) ? casillas[n] : 0; }
EXPORT int casilla_tam(void) { return TAM_CASILLA; }

/* ============ 1. Catalogo ============ */
#define N_PRODUCTOS 8
#define IGV_PORCENTAJE 18

typedef struct {
    int id;
    const char *nombre;
    const char *emoji;
    int precio;       /* en centimos */
    int stockBase;    /* stock inicial */
} Producto;

static const Producto CATALOGO[N_PRODUCTOS] = {
    {1, "Hamburguesa Clasica",  "🍔", 1290,  50},
    {2, "Pollo Crispy",         "🍗", 1450,  40},
    {3, "Papas Fritas Grandes", "🍟",  750,  80},
    {4, "Combo Familiar",       "🧺", 3990,  20},
    {5, "Hot Dog Especial",     "🌭",  990,  45},
    {6, "Gaseosa 500ml",        "🥤",  450, 100},
    {7, "Nuggets x10",          "🍖", 1190,  35},
    {8, "Helado Sundae",        "🍨",  650,  30}
};

/* Posicion del producto en el catalogo, o -1 si no existe */
static int indice(int id) {
    for (int i = 0; i < N_PRODUCTOS; i++)
        if (CATALOGO[i].id == id) return i;
    return -1;
}

EXPORT int prod_total(void)            { return N_PRODUCTOS; }
EXPORT int prod_id(int pos)            { return (pos >= 0 && pos < N_PRODUCTOS) ? CATALOGO[pos].id : 0; }
EXPORT const char *prod_nombre(int id) { int i = indice(id); return i < 0 ? "" : CATALOGO[i].nombre; }
EXPORT const char *prod_emoji(int id)  { int i = indice(id); return i < 0 ? "" : CATALOGO[i].emoji; }
EXPORT int prod_precio(int id)         { int i = indice(id); return i < 0 ? 0 : CATALOGO[i].precio; }

/* ============ 2. Base de datos del sistema ============ */
#define MAX_CLIENTES 200
#define MAX_PEDIDOS  300
#define MAX_VENTAS   300
#define MAX_ITEMS    20
#define N_METODOS    4     /* 0 Efectivo, 1 Tarjeta, 2 Yape, 3 Tarjeta de credito */
#define VERSION_BASE 1

/* Estados de un pedido */
#define PENDIENTE 0
#define COBRADO   1
#define ANULADO   2

typedef struct { int id, cantidad, precio; } Item;

typedef struct {
    char dni[9];
    char nombre[61];
    char correo[81];
    char clave[41];
} Cliente;

typedef struct {
    int id;                 /* se muestra como P-0001 */
    char dni[9];            /* DNI del cliente */
    int dia, hora;
    int metodo;             /* metodo de pago elegido */
    int estado;             /* PENDIENTE, COBRADO o ANULADO */
    int boleta;             /* numero de boleta al cobrar */
    char atendio[21];       /* cajero que lo cobro/anulo, o "cliente" */
    int nItems;
    Item items[MAX_ITEMS];
    int cant, sub, igv, tot;
} Pedido;

typedef struct {
    int num;                /* se muestra como B001-000001 */
    int pedido;             /* posicion del pedido en la base */
    int dia, hora;
    int metodo;
    int recibido, vuelto;   /* solo para efectivo */
    char vendedor[21];
} Venta;

typedef struct {
    int version;
    int stock[N_PRODUCTOS];
    int nClientes, nPedidos, nVentas;
    int sigPedido, sigBoleta;
    Cliente clientes[MAX_CLIENTES];
    Pedido  pedidos[MAX_PEDIDOS];
    Venta   ventas[MAX_VENTAS];
} Base;

static Base base;

/* La pagina guarda una copia de la base en el navegador y la devuelve al abrir */
EXPORT void *base_datos(void) { return &base; }
EXPORT int base_tam(void)     { return (int)sizeof(Base); }
EXPORT int base_valida(void)  { return base.version == VERSION_BASE; }

EXPORT void base_iniciar(void) {
    limpiar(&base, sizeof base);
    base.version = VERSION_BASE;
    for (int i = 0; i < N_PRODUCTOS; i++) base.stock[i] = CATALOGO[i].stockBase;
    base.sigPedido = 1;
    base.sigBoleta = 1;
}

EXPORT int stock_de(int id) { int i = indice(id); return i < 0 ? 0 : base.stock[i]; }

/* ============ 3. Carrito ============ */
/* Codigos de resultado que entiende la pagina */
#define OK            0
#define ERR_CANTIDAD  1
#define ERR_PRODUCTO  2
#define ERR_STOCK     3
#define ERR_LLENO     4
#define ERR_VACIO     5

static Item carrito[MAX_ITEMS];
static int nCarrito = 0;

static int enCarrito(int id) {
    for (int i = 0; i < nCarrito; i++)
        if (carrito[i].id == id) return carrito[i].cantidad;
    return 0;
}

/* Lo que todavia se puede pedir = stock - lo que ya esta en el carrito */
EXPORT int disponible(int id) { return stock_de(id) - enCarrito(id); }

EXPORT int carrito_agregar(int id, int cantidad) {
    if (cantidad < 1) return ERR_CANTIDAD;
    if (indice(id) < 0) return ERR_PRODUCTO;
    if (cantidad > disponible(id)) return ERR_STOCK;
    for (int i = 0; i < nCarrito; i++) {
        if (carrito[i].id == id) { carrito[i].cantidad += cantidad; return OK; }
    }
    if (nCarrito >= MAX_ITEMS) return ERR_LLENO;
    carrito[nCarrito].id = id;
    carrito[nCarrito].cantidad = cantidad;
    carrito[nCarrito].precio = prod_precio(id);
    nCarrito++;
    return OK;
}

EXPORT int carrito_cambiar(int pos, int cantidad) {
    if (pos < 0 || pos >= nCarrito) return ERR_PRODUCTO;
    if (cantidad < 1) return ERR_CANTIDAD;
    if (cantidad > stock_de(carrito[pos].id)) return ERR_STOCK;
    carrito[pos].cantidad = cantidad;
    return OK;
}

EXPORT void carrito_quitar(int pos) {
    if (pos < 0 || pos >= nCarrito) return;
    for (int i = pos; i < nCarrito - 1; i++) carrito[i] = carrito[i + 1];
    nCarrito--;
}

EXPORT void carrito_vaciar(void)     { nCarrito = 0; }
EXPORT int carrito_items(void)       { return nCarrito; }
EXPORT int carrito_id(int pos)       { return (pos >= 0 && pos < nCarrito) ? carrito[pos].id : 0; }
EXPORT int carrito_cantidad(int pos) { return (pos >= 0 && pos < nCarrito) ? carrito[pos].cantidad : 0; }

/* ============ 4. Calculos: subtotal, IGV, total, vuelto ============ */
static int rCant, rSub, rIgv, rTot;

static void cerrarCalculo(void) {
    rIgv = (rSub * IGV_PORCENTAJE + 50) / 100;   /* redondeo al centimo */
    rTot = rSub + rIgv;
}

/* Totales del carrito actual */
EXPORT void calcular_carrito(void) {
    rCant = 0; rSub = 0;
    for (int i = 0; i < nCarrito; i++) {
        rCant += carrito[i].cantidad;
        rSub  += carrito[i].cantidad * carrito[i].precio;
    }
    cerrarCalculo();
}

/* Importe de una linea (precio x cantidad) */
EXPORT int importe(int precio, int cantidad) { return precio * cantidad; }

EXPORT int total_cantidad(void) { return rCant; }
EXPORT int total_subtotal(void) { return rSub; }
EXPORT int total_igv(void)      { return rIgv; }
EXPORT int total_pagar(void)    { return rTot; }

/* Vuelto en efectivo. Devuelve -1 si el dinero no alcanza */
EXPORT int calcular_vuelto(int total, int recibido) {
    if (recibido < total) return -1;
    return recibido - total;
}

/* ============ 5. Registro e inicio de sesion ============ */
static int buscarCliente(const char *dni) {
    for (int i = 0; i < base.nClientes; i++)
        if (iguales(base.clientes[i].dni, dni)) return i;
    return -1;
}

/* Correo valido: texto@dominio.ext, sin espacios y con un solo @ */
static int correoValido(const char *s) {
    int arroba = -1, n = largo(s);
    if (n > 80) return 0;
    for (int i = 0; i < n; i++) {
        if (s[i] == ' ') return 0;
        if (s[i] == '@') { if (arroba >= 0) return 0; arroba = i; }
    }
    if (arroba < 1 || arroba == n - 1) return 0;          /* algo antes y despues del @ */
    int punto = -1;
    for (int i = arroba + 1; i < n; i++) if (s[i] == '.') punto = i;
    return punto > arroba + 1 && punto < n - 1;           /* dominio.ext */
}

/* Registro de cliente.
 * casilla 0 = DNI, 1 = nombre, 2 = correo, 3 = contrasena, 4 = confirmar contrasena
 * Devuelve: 0 ok, 1 nombre corto, 2 DNI invalido, 3 correo invalido,
 *           4 contrasena de 6 a 40 caracteres, 5 contrasenas distintas,
 *           6 DNI ya registrado, 7 no hay espacio para mas clientes */
EXPORT int cliente_registrar(void) {
    const char *dni = casillas[0], *nombre = casillas[1], *correo = casillas[2];
    const char *clave = casillas[3], *clave2 = casillas[4];
    if (!soloDigitos(dni, 8)) return 2;
    if (largoSinEspacios(nombre) < 3) return 1;
    if (!correoValido(correo)) return 3;
    if (largo(clave) < 6 || largo(clave) > 40) return 4;
    if (!iguales(clave, clave2)) return 5;
    if (buscarCliente(dni) >= 0) return 6;
    if (base.nClientes >= MAX_CLIENTES) return 7;

    Cliente *c = &base.clientes[base.nClientes++];
    copiar(c->dni, dni, sizeof c->dni);
    copiar(c->nombre, nombre, sizeof c->nombre);
    copiar(c->correo, correo, sizeof c->correo);
    copiar(c->clave, clave, sizeof c->clave);
    return 0;
}

/* Ingreso de cliente. casilla 0 = DNI, 1 = contrasena
 * Devuelve: 0 ok, 1 DNI invalido, 2 no registrado, 3 contrasena incorrecta */
EXPORT int cliente_login(void) {
    if (!soloDigitos(casillas[0], 8)) return 1;
    int i = buscarCliente(casillas[0]);
    if (i < 0) return 2;
    if (!iguales(base.clientes[i].clave, casillas[1])) return 3;
    return 0;
}

/* Cliente de prueba para la demo: siempre existe.
 * DNI 12345678, contrasena 12345678. Devuelve 1 si lo tuvo que crear. */
#define DEMO_DNI    "12345678"
#define DEMO_NOMBRE "Cliente Demo"
#define DEMO_CORREO "demo@restaurantelatina.com"
#define DEMO_CLAVE  "12345678"
EXPORT int asegurar_cliente_demo(void) {
    if (buscarCliente(DEMO_DNI) >= 0 || base.nClientes >= MAX_CLIENTES) return 0;
    Cliente *c = &base.clientes[base.nClientes++];
    copiar(c->dni, DEMO_DNI, sizeof c->dni);
    copiar(c->nombre, DEMO_NOMBRE, sizeof c->nombre);
    copiar(c->correo, DEMO_CORREO, sizeof c->correo);
    copiar(c->clave, DEMO_CLAVE, sizeof c->clave);
    return 1;
}

/* Nombre del cliente cuyo DNI esta en la casilla 0 */
EXPORT const char *cliente_nombre(void) {
    int i = buscarCliente(casillas[0]);
    return i < 0 ? "" : base.clientes[i].nombre;
}

/* Empleados del sistema */
typedef struct { const char *usuario, *dni, *clave, *nombre; int rol; } Cajero;
#define ROL_EMPLEADO 1
#define ROL_ADMIN    2
static const Cajero CAJEROS[] = {
    {"admin",    "10000001", "123456",    "Administrador", ROL_ADMIN},
    {"empleado", "10000002", "123456789", "Cajero",        ROL_EMPLEADO}
};
#define N_CAJEROS 2
static int ultimoCajero = -1;

/* casilla 0 = usuario o DNI, 1 = contrasena. Devuelve 0 si falla, 1 empleado, 2 admin */
EXPORT int login_cajero(void) {
    ultimoCajero = -1;
    for (int i = 0; i < N_CAJEROS; i++) {
        int mismoUsuario = iguales(CAJEROS[i].usuario, casillas[0]) || iguales(CAJEROS[i].dni, casillas[0]);
        if (mismoUsuario && iguales(CAJEROS[i].clave, casillas[1])) {
            ultimoCajero = i;
            return CAJEROS[i].rol;
        }
    }
    return 0;
}
EXPORT const char *cajero_nombre(void)  { return ultimoCajero < 0 ? "" : CAJEROS[ultimoCajero].nombre; }
EXPORT const char *cajero_usuario(void) { return ultimoCajero < 0 ? "" : CAJEROS[ultimoCajero].usuario; }

/* ============ 6. Pedidos ============ */
static Pedido pedidoVacio;
static Venta ventaVacia;

static Pedido *pedido(int pos) {
    return (pos >= 0 && pos < base.nPedidos) ? &base.pedidos[pos] : &pedidoVacio;
}
static Venta *venta(int pos) {
    return (pos >= 0 && pos < base.nVentas) ? &base.ventas[pos] : &ventaVacia;
}

/* Posicion de un pedido por su numero, o -1 */
EXPORT int pedido_buscar(int id) {
    for (int i = 0; i < base.nPedidos; i++) if (base.pedidos[i].id == id) return i;
    return -1;
}

EXPORT int puede_cobrar(int estado) { return estado == PENDIENTE; }
EXPORT int puede_anular(int estado) { return estado == PENDIENTE; }

/* El cliente envia su carrito a caja. casilla 0 = DNI del cliente.
 * Revisa el stock, lo descuenta, calcula los totales y guarda el pedido.
 * Devuelve el numero de pedido (> 0) o un error:
 *   -3 sin stock suficiente, -4 no hay espacio, -5 carrito vacio, -6 cliente no existe */
EXPORT int pedido_crear(int metodo, int dia, int hora) {
    if (buscarCliente(casillas[0]) < 0) return -6;
    if (nCarrito == 0) return -5;
    if (base.nPedidos >= MAX_PEDIDOS) return -4;
    for (int i = 0; i < nCarrito; i++)
        if (carrito[i].cantidad > stock_de(carrito[i].id)) return -3;
    if (metodo < 0 || metodo >= N_METODOS) metodo = 0;

    Pedido *p = &base.pedidos[base.nPedidos++];
    limpiar(p, sizeof *p);
    p->id = base.sigPedido++;
    copiar(p->dni, casillas[0], sizeof p->dni);
    p->dia = dia; p->hora = hora;
    p->metodo = metodo;
    p->estado = PENDIENTE;
    p->nItems = nCarrito;
    for (int i = 0; i < nCarrito; i++) {
        p->items[i] = carrito[i];
        base.stock[indice(carrito[i].id)] -= carrito[i].cantidad;
    }
    calcular_carrito();
    p->cant = rCant; p->sub = rSub; p->igv = rIgv; p->tot = rTot;
    nCarrito = 0;
    return p->id;
}

/* El cajero cobra un pedido y se genera la boleta. casilla 0 = usuario del cajero.
 * recibido: efectivo entregado (solo si metodo = 0)
 * Devuelve el numero de boleta (> 0) o un error:
 *   -1 no existe, -2 ya fue atendido, -3 el efectivo no alcanza, -4 no hay espacio */
EXPORT int pedido_cobrar(int id, int metodo, int recibido, int dia, int hora) {
    int pos = pedido_buscar(id);
    if (pos < 0) return -1;
    Pedido *p = &base.pedidos[pos];
    if (!puede_cobrar(p->estado)) return -2;
    if (metodo < 0 || metodo >= N_METODOS) metodo = 0;
    int vuelto = 0;
    if (metodo == 0) {
        vuelto = calcular_vuelto(p->tot, recibido);
        if (vuelto < 0) return -3;
    } else {
        recibido = 0;
    }
    if (base.nVentas >= MAX_VENTAS) return -4;

    Venta *v = &base.ventas[base.nVentas++];
    limpiar(v, sizeof *v);
    v->num = base.sigBoleta++;
    v->pedido = pos;
    v->dia = dia; v->hora = hora;
    v->metodo = metodo;
    v->recibido = recibido; v->vuelto = vuelto;
    copiar(v->vendedor, casillas[0], sizeof v->vendedor);

    p->estado = COBRADO;
    p->boleta = v->num;
    p->metodo = metodo;
    copiar(p->atendio, casillas[0], sizeof p->atendio);
    return v->num;
}

/* Anula un pedido pendiente y devuelve el stock.
 * casilla 0 = DNI del cliente (porCliente = 1) o usuario del cajero (porCliente = 0)
 * Devuelve: 0 ok, -1 no existe, -2 ya fue atendido, -4 el pedido no es de ese cliente */
EXPORT int pedido_anular(int id, int porCliente) {
    int pos = pedido_buscar(id);
    if (pos < 0) return -1;
    Pedido *p = &base.pedidos[pos];
    if (!puede_anular(p->estado)) return -2;
    if (porCliente && !iguales(p->dni, casillas[0])) return -4;
    p->estado = ANULADO;
    copiar(p->atendio, porCliente ? "cliente" : casillas[0], sizeof p->atendio);
    for (int i = 0; i < p->nItems; i++) {
        int k = indice(p->items[i].id);
        if (k >= 0) base.stock[k] += p->items[i].cantidad;
    }
    return 0;
}

/* Datos de un pedido (por posicion) para mostrarlos en pantalla */
EXPORT int ped_id(int i)          { return pedido(i)->id; }
EXPORT const char *ped_dni(int i) { return pedido(i)->dni; }
EXPORT const char *ped_cliente(int i) {
    int c = buscarCliente(pedido(i)->dni);
    return c < 0 ? "Cliente" : base.clientes[c].nombre;
}
EXPORT int ped_dia(int i)         { return pedido(i)->dia; }
EXPORT int ped_hora(int i)        { return pedido(i)->hora; }
EXPORT int ped_metodo(int i)      { return pedido(i)->metodo; }
EXPORT int ped_estado(int i)      { return pedido(i)->estado; }
EXPORT int ped_boleta(int i)      { return pedido(i)->boleta; }
EXPORT const char *ped_atendio(int i) { return pedido(i)->atendio; }
EXPORT int ped_cant(int i)        { return pedido(i)->cant; }
EXPORT int ped_sub(int i)         { return pedido(i)->sub; }
EXPORT int ped_igv(int i)         { return pedido(i)->igv; }
EXPORT int ped_tot(int i)         { return pedido(i)->tot; }
EXPORT int ped_items(int i)       { return pedido(i)->nItems; }
EXPORT int ped_item_id(int i, int k)       { Pedido *p = pedido(i); return (k >= 0 && k < p->nItems) ? p->items[k].id : 0; }
EXPORT int ped_item_cantidad(int i, int k) { Pedido *p = pedido(i); return (k >= 0 && k < p->nItems) ? p->items[k].cantidad : 0; }
EXPORT int ped_item_precio(int i, int k)   { Pedido *p = pedido(i); return (k >= 0 && k < p->nItems) ? p->items[k].precio : 0; }

/* Datos de una venta / boleta (por posicion) */
EXPORT int venta_buscar(int num) {
    for (int i = 0; i < base.nVentas; i++) if (base.ventas[i].num == num) return i;
    return -1;
}
EXPORT int ven_num(int i)      { return venta(i)->num; }
EXPORT int ven_pedido(int i)   { return venta(i)->pedido; }
EXPORT int ven_dia(int i)      { return venta(i)->dia; }
EXPORT int ven_hora(int i)     { return venta(i)->hora; }
EXPORT int ven_metodo(int i)   { return venta(i)->metodo; }
EXPORT int ven_recibido(int i) { return venta(i)->recibido; }
EXPORT int ven_vuelto(int i)   { return venta(i)->vuelto; }
EXPORT const char *ven_vendedor(int i) { return venta(i)->vendedor; }

/* ============ 7. Listas y reportes ============ */
/* Las listas se arman aqui y la pagina solo las recorre */
static int lista[MAX_PEDIDOS];
static int nLista = 0;
EXPORT int lista_n(void)       { return nLista; }
EXPORT int lista_item(int k)   { return (k >= 0 && k < nLista) ? lista[k] : -1; }

/* Pedidos pendientes, del mas antiguo al mas nuevo (cola de caja) */
EXPORT void lista_pendientes(void) {
    nLista = 0;
    for (int i = 0; i < base.nPedidos; i++)
        if (base.pedidos[i].estado == PENDIENTE) lista[nLista++] = i;
}

/* Pedidos del cliente de la casilla 0, del mas nuevo al mas antiguo */
EXPORT void lista_cliente(void) {
    nLista = 0;
    for (int i = base.nPedidos - 1; i >= 0; i--)
        if (iguales(base.pedidos[i].dni, casillas[0])) lista[nLista++] = i;
}

/* Cantidad de pedidos pendientes (todos o solo del cliente de la casilla 0) */
EXPORT int pendientes(int soloCliente) {
    int n = 0;
    for (int i = 0; i < base.nPedidos; i++)
        if (base.pedidos[i].estado == PENDIENTE && (!soloCliente || iguales(base.pedidos[i].dni, casillas[0]))) n++;
    return n;
}

/* Resumen del dia para caja: cobrados, total cobrado, anulados y lista de atendidos */
static int diaCobrados, diaTotal, diaAnulados;
EXPORT void resumen_dia(int dia) {
    diaCobrados = diaTotal = diaAnulados = 0;
    nLista = 0;
    for (int i = base.nPedidos - 1; i >= 0; i--) {
        Pedido *p = &base.pedidos[i];
        if (p->dia != dia || p->estado == PENDIENTE) continue;
        if (p->estado == COBRADO) { diaCobrados++; diaTotal += p->tot; }
        else diaAnulados++;
        lista[nLista++] = i;
    }
}
EXPORT int dia_cobrados(void) { return diaCobrados; }
EXPORT int dia_total(void)    { return diaTotal; }
EXPORT int dia_anulados(void) { return diaAnulados; }

/* Reporte de ventas: metodo = -1 todos; dia = 0 todos los dias.
 * Deja en la lista las ventas que cumplen, de la mas nueva a la mas antigua */
static int repMetodo[N_METODOS], repTotal, repIgv, repBoletas, repUnidades;
EXPORT void reporte_calcular(int metodo, int dia) {
    for (int i = 0; i < N_METODOS; i++) repMetodo[i] = 0;
    repTotal = repIgv = repBoletas = repUnidades = 0;
    nLista = 0;
    for (int i = base.nVentas - 1; i >= 0; i--) {
        Venta *v = &base.ventas[i];
        if (metodo >= 0 && v->metodo != metodo) continue;
        if (dia && v->dia != dia) continue;
        Pedido *p = pedido(v->pedido);
        if (v->metodo >= 0 && v->metodo < N_METODOS) repMetodo[v->metodo] += p->tot;
        repTotal += p->tot; repIgv += p->igv; repUnidades += p->cant; repBoletas++;
        lista[nLista++] = i;
    }
}
EXPORT int reporte_metodo(int metodo) { return (metodo >= 0 && metodo < N_METODOS) ? repMetodo[metodo] : 0; }
EXPORT int reporte_total(void)    { return repTotal; }
EXPORT int reporte_igv(void)      { return repIgv; }
EXPORT int reporte_boletas(void)  { return repBoletas; }
EXPORT int reporte_unidades(void) { return repUnidades; }
EXPORT int reporte_promedio(void) { return repBoletas ? (repTotal + repBoletas / 2) / repBoletas : 0; }
