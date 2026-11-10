#include "pedidos/pedidos.h"
#include "base/base.h"
#include "carrito/carrito.h"
#include "calculos/calculos.h"
#include "catalogo/catalogo.h"
#include "usuarios/clientes.h"
#include "utilidades/texto.h"

static Pedido pedidoVacio;

Pedido *pedido(int pos) {
    return (pos >= 0 && pos < base.nPedidos) ? &base.pedidos[pos] : &pedidoVacio;
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
    p->cant = total_cantidad(); p->sub = total_subtotal();
    p->igv = total_igv();      p->tot = total_pagar();
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
