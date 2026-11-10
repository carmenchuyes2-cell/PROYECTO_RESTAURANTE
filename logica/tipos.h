#ifndef TIPOS_H
#define TIPOS_H

#define EXPORT __attribute__((visibility("default")))

#define N_CASILLAS 5
#define TAM_CASILLA 128
#define N_PRODUCTOS 8
#define IGV_PORCENTAJE 18

typedef struct {
    int id;
    const char *nombre;
    const char *emoji;
    int precio;       /* en centimos */
    int stockBase;    /* stock inicial */
} Producto;

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

#define OK            0
#define ERR_CANTIDAD  1
#define ERR_PRODUCTO  2
#define ERR_STOCK     3
#define ERR_LLENO     4
#define ERR_VACIO     5

#endif
