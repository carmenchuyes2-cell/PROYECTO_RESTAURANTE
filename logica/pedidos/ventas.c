#include "base/base.h"

static Venta ventaVacia;

static Venta *venta(int pos) {
    return (pos >= 0 && pos < base.nVentas) ? &base.ventas[pos] : &ventaVacia;
}

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
