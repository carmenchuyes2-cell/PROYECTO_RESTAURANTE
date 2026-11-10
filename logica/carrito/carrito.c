#include "carrito/carrito.h"
#include "base/base.h"
#include "catalogo/catalogo.h"

Item carrito[MAX_ITEMS];
int nCarrito = 0;

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
