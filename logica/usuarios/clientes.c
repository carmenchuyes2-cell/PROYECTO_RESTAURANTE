#include "usuarios/clientes.h"
#include "base/base.h"
#include "utilidades/texto.h"

int buscarCliente(const char *dni) {
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
