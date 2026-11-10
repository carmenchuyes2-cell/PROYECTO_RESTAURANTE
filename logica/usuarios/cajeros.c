#include "tipos.h"
#include "utilidades/texto.h"

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
