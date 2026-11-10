#include "base/base.h"
#include "catalogo/catalogo.h"
#include "utilidades/texto.h"

Base base;

/* La pagina guarda una copia de la base en el navegador y la devuelve al abrir */
EXPORT void *base_datos(void) { return &base; }
EXPORT int base_tam(void)     { return (int)sizeof(Base); }
EXPORT int base_valida(void)  { return base.version == VERSION_BASE; }

EXPORT void base_iniciar(void) {
    limpiar(&base, sizeof base);
    base.version = VERSION_BASE;
    for (int i = 0; i < N_PRODUCTOS; i++) base.stock[i] = CATALOGO[i].stockBase;
    base.sigPedido = 1;
    base.sigBoleta = 1;
}

EXPORT int stock_de(int id) { int i = indice(id); return i < 0 ? 0 : base.stock[i]; }
