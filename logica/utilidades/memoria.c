/* Funciones basicas de memoria y texto.
 * Se necesitan porque el compilador a WebAssembly no trae la libreria estandar (-nostdlib). */
typedef __SIZE_TYPE__ tam_t;

tam_t strlen(const char *s) {
    tam_t n = 0;
    while (s[n]) n++;
    return n;
}

void *memset(void *p, int valor, tam_t n) {
    unsigned char *b = (unsigned char *)p;
    for (tam_t i = 0; i < n; i++) b[i] = (unsigned char)valor;
    return p;
}

void *memcpy(void *destino, const void *origen, tam_t n) {
    unsigned char *d = (unsigned char *)destino;
    const unsigned char *o = (const unsigned char *)origen;
    for (tam_t i = 0; i < n; i++) d[i] = o[i];
    return destino;
}
