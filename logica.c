/*
 * RestauranteLatina - LOGICA DEL SISTEMA EN C
 * ------------------------------------------------------------------
 * Este archivo contiene toda la logica del sistema. El diseno de la
 * pagina (diseno.js, en JavaScript) solo muestra las pantallas y llama
 * a estas funciones. Se compila a WebAssembly para que el navegador lo ejecute:
 *
 *   zig cc --target=wasm32-freestanding -O2 -nostdlib \
 *          -Wl,--no-entry -Wl,--export-dynamic -o logica.wasm logica.c
 *
 * (luego logica.wasm se guarda en base64 al final de diseno.js, PARTE 4)
 *
 * Que hace este archivo:
 *   1. Catalogo de productos (nombre, emoji, precio) y su stock
 *   2. Carrito: agregar, cambiar cantidad, quitar, validar stock
 *   3. Calculos: subtotal, IGV 18%, total y vuelto
 *   4. Validaciones de registro e inicio de sesion (cliente y cajero)
 *   5. Estados de los pedidos (pendiente, cobrado, anulado)
 *   6. Reporte de ventas por metodo de pago
 *
 * Todos los montos se manejan en CENTIMOS (enteros) para no tener
 * errores de redondeo: S/ 12.90 = 1290.
 */

#define EXPORT __attribute__((visibility("default")))

/* ============ 1. Catalogo y stock ============ */
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

static int stock[N_PRODUCTOS];   /* stock actual (lo carga y guarda la web) */

/* Posicion del producto en el catalogo, o -1 si no existe */
static int indice(int id) {
    for (int i = 0; i < N_PRODUCTOS; i++)
        if (CATALOGO[i].id == id) return i;
    return -1;
}

EXPORT int prod_total(void)          { return N_PRODUCTOS; }
EXPORT int prod_id(int pos)          { return (pos >= 0 && pos < N_PRODUCTOS) ? CATALOGO[pos].id : 0; }
EXPORT const char *prod_nombre(int id) { int i = indice(id); return i < 0 ? "" : CATALOGO[i].nombre; }
EXPORT const char *prod_emoji(int id)  { int i = indice(id); return i < 0 ? "" : CATALOGO[i].emoji; }
EXPORT int prod_precio(int id)       { int i = indice(id); return i < 0 ? 0 : CATALOGO[i].precio; }

EXPORT void stock_reiniciar(void) {
    for (int i = 0; i < N_PRODUCTOS; i++) stock[i] = CATALOGO[i].stockBase;
}
EXPORT void stock_poner(int id, int cantidad) {
    int i = indice(id);
    if (i >= 0 && cantidad >= 0) stock[i] = cantidad;
}
EXPORT int stock_de(int id) { int i = indice(id); return i < 0 ? 0 : stock[i]; }

/* Devuelve unidades al stock (cuando se anula un pedido) */
EXPORT void stock_devolver(int id, int cantidad) {
    int i = indice(id);
    if (i >= 0 && cantidad > 0) stock[i] += cantidad;
}

/* ============ 2. Carrito ============ */
#define MAX_ITEMS 20

/* Codigos de resultado que entiende la pagina */
#define OK                 0
#define ERR_CANTIDAD       1
#define ERR_PRODUCTO       2
#define ERR_STOCK          3
#define ERR_LLENO          4
#define ERR_VACIO          5

typedef struct { int id; int cantidad; } Item;

static Item carrito[MAX_ITEMS];
static int nItems = 0;

static int enCarrito(int id) {
    for (int i = 0; i < nItems; i++)
        if (carrito[i].id == id) return carrito[i].cantidad;
    return 0;
}

/* Lo que todavia se puede pedir = stock - lo que ya esta en el carrito */
EXPORT int disponible(int id) { return stock_de(id) - enCarrito(id); }

EXPORT int carrito_agregar(int id, int cantidad) {
    if (cantidad < 1) return ERR_CANTIDAD;
    if (indice(id) < 0) return ERR_PRODUCTO;
    if (cantidad > disponible(id)) return ERR_STOCK;
    for (int i = 0; i < nItems; i++) {
        if (carrito[i].id == id) { carrito[i].cantidad += cantidad; return OK; }
    }
    if (nItems >= MAX_ITEMS) return ERR_LLENO;
    carrito[nItems].id = id;
    carrito[nItems].cantidad = cantidad;
    nItems++;
    return OK;
}

EXPORT int carrito_cambiar(int pos, int cantidad) {
    if (pos < 0 || pos >= nItems) return ERR_PRODUCTO;
    if (cantidad < 1) return ERR_CANTIDAD;
    if (cantidad > stock_de(carrito[pos].id)) return ERR_STOCK;
    carrito[pos].cantidad = cantidad;
    return OK;
}

EXPORT void carrito_quitar(int pos) {
    if (pos < 0 || pos >= nItems) return;
    for (int i = pos; i < nItems - 1; i++) carrito[i] = carrito[i + 1];
    nItems--;
}

EXPORT void carrito_vaciar(void)    { nItems = 0; }
EXPORT int carrito_items(void)      { return nItems; }
EXPORT int carrito_id(int pos)      { return (pos >= 0 && pos < nItems) ? carrito[pos].id : 0; }
EXPORT int carrito_cantidad(int pos){ return (pos >= 0 && pos < nItems) ? carrito[pos].cantidad : 0; }

/* Confirma el pedido: vuelve a revisar el stock, lo descuenta y vacia el carrito */
EXPORT int carrito_confirmar(void) {
    if (nItems == 0) return ERR_VACIO;
    for (int i = 0; i < nItems; i++)
        if (carrito[i].cantidad > stock_de(carrito[i].id)) return ERR_STOCK;
    for (int i = 0; i < nItems; i++) stock[indice(carrito[i].id)] -= carrito[i].cantidad;
    nItems = 0;
    return OK;
}

/* ============ 3. Calculos: subtotal, IGV, total, vuelto ============ */
static int rCant, rSub, rIgv, rTot;

static void cerrarCalculo(void) {
    rIgv = (rSub * IGV_PORCENTAJE + 50) / 100;   /* redondeo al centimo */
    rTot = rSub + rIgv;
}

/* Totales del carrito actual */
EXPORT void calcular_carrito(void) {
    rCant = 0; rSub = 0;
    for (int i = 0; i < nItems; i++) {
        rCant += carrito[i].cantidad;
        rSub  += carrito[i].cantidad * prod_precio(carrito[i].id);
    }
    cerrarCalculo();
}

/* Totales de un pedido guardado: calc_iniciar, calc_item por cada producto, calc_terminar */
EXPORT void calc_iniciar(void)                      { rCant = 0; rSub = 0; rIgv = 0; rTot = 0; }
EXPORT void calc_item(int precio, int cantidad)     { rCant += cantidad; rSub += precio * cantidad; }
EXPORT void calc_terminar(void)                     { cerrarCalculo(); }

EXPORT int total_cantidad(void) { return rCant; }
EXPORT int total_subtotal(void) { return rSub; }
EXPORT int total_igv(void)      { return rIgv; }
EXPORT int total_pagar(void)    { return rTot; }

/* Vuelto en efectivo. Devuelve -1 si el dinero no alcanza */
EXPORT int calcular_vuelto(int total, int recibido) {
    if (recibido < total) return -1;
    return recibido - total;
}

/* ============ 4. Registro e inicio de sesion ============ */
/* La pagina escribe los textos en estas casillas antes de llamar a las funciones */
#define N_CASILLAS 5
#define TAM_CASILLA 128
static char casillas[N_CASILLAS][TAM_CASILLA];

EXPORT char *casilla(int n) { return (n >= 0 && n < N_CASILLAS) ? casillas[n] : 0; }
EXPORT int casilla_tam(void) { return TAM_CASILLA; }

static int largo(const char *s) { int n = 0; while (s[n]) n++; return n; }
static int iguales(const char *a, const char *b) {
    while (*a && *a == *b) { a++; b++; }
    return *a == *b;
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

EXPORT int validar_dni(void) { return soloDigitos(casillas[0], 8); }

/* Correo valido: texto@dominio.ext, sin espacios y con un solo @ */
static int correoValido(const char *s) {
    int arroba = -1, n = largo(s);
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
 * yaExiste = 1 si la pagina ya tiene un cliente con ese DNI
 * Devuelve: 0 ok, 1 nombre corto, 2 DNI invalido, 3 correo invalido,
 *           4 contrasena corta, 5 contrasenas distintas, 6 DNI ya registrado */
EXPORT int validar_registro(int yaExiste) {
    const char *dni = casillas[0], *nombre = casillas[1], *correo = casillas[2];
    const char *pass = casillas[3], *pass2 = casillas[4];
    if (!soloDigitos(dni, 8)) return 2;
    if (largoSinEspacios(nombre) < 3) return 1;
    if (!correoValido(correo)) return 3;
    if (largo(pass) < 6) return 4;
    if (!iguales(pass, pass2)) return 5;
    if (yaExiste) return 6;
    return 0;
}

/* Ingreso de cliente.
 * casilla 0 = DNI escrito, 1 = contrasena escrita, 2 = contrasena guardada
 * existe = 1 si el DNI esta registrado
 * Devuelve: 0 ok, 1 DNI invalido, 2 no registrado, 3 contrasena incorrecta */
EXPORT int login_cliente(int existe) {
    if (!soloDigitos(casillas[0], 8)) return 1;
    if (!existe) return 2;
    if (!iguales(casillas[1], casillas[2])) return 3;
    return 0;
}

/* Cajeros del sistema (igual que la version de consola) */
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
EXPORT const char *cajero_nombre(void) { return ultimoCajero < 0 ? "" : CAJEROS[ultimoCajero].nombre; }

/* ============ 5. Estados de los pedidos ============ */
#define PENDIENTE 0
#define COBRADO   1
#define ANULADO   2

EXPORT int puede_cobrar(int estado) { return estado == PENDIENTE; }
EXPORT int puede_anular(int estado) { return estado == PENDIENTE; }

/* ============ 6. Reporte de ventas ============ */
#define N_METODOS 4   /* 0 Efectivo, 1 Tarjeta, 2 Yape, 3 Tarjeta de credito */
static int repMetodo[N_METODOS], repTotal, repIgv, repBoletas, repUnidades;

EXPORT void reporte_iniciar(void) {
    for (int i = 0; i < N_METODOS; i++) repMetodo[i] = 0;
    repTotal = repIgv = repBoletas = repUnidades = 0;
}
EXPORT void reporte_venta(int metodo, int total, int igv, int unidades) {
    if (metodo >= 0 && metodo < N_METODOS) repMetodo[metodo] += total;
    repTotal += total; repIgv += igv; repUnidades += unidades; repBoletas++;
}
EXPORT int reporte_metodo(int metodo) { return (metodo >= 0 && metodo < N_METODOS) ? repMetodo[metodo] : 0; }
EXPORT int reporte_total(void)    { return repTotal; }
EXPORT int reporte_igv(void)      { return repIgv; }
EXPORT int reporte_boletas(void)  { return repBoletas; }
EXPORT int reporte_unidades(void) { return repUnidades; }
EXPORT int reporte_promedio(void) { return repBoletas ? (repTotal + repBoletas / 2) / repBoletas : 0; }
