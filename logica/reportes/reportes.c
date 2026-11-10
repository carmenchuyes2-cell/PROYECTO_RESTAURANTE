#include "base/base.h"
#include "pedidos/pedidos.h"
#include "utilidades/texto.h"

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
