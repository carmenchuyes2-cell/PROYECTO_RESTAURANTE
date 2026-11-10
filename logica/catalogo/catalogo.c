#include "catalogo/catalogo.h"

const Producto CATALOGO[N_PRODUCTOS] = {
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
int indice(int id) {
    for (int i = 0; i < N_PRODUCTOS; i++)
        if (CATALOGO[i].id == id) return i;
    return -1;
}

EXPORT int prod_total(void)            { return N_PRODUCTOS; }
EXPORT int prod_id(int pos)            { return (pos >= 0 && pos < N_PRODUCTOS) ? CATALOGO[pos].id : 0; }
EXPORT const char *prod_nombre(int id) { int i = indice(id); return i < 0 ? "" : CATALOGO[i].nombre; }
EXPORT const char *prod_emoji(int id)  { int i = indice(id); return i < 0 ? "" : CATALOGO[i].emoji; }
EXPORT int prod_precio(int id)         { int i = indice(id); return i < 0 ? 0 : CATALOGO[i].precio; }
