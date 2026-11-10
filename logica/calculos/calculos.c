#include "tipos.h"
#include "calculos/calculos.h"
#include "carrito/carrito.h"

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
