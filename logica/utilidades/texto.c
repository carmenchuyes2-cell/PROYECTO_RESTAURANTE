#include "utilidades/texto.h"

/* ============ Utilidades de texto (sin librerias) ============ */
int largo(const char *s) { int n = 0; while (s[n]) n++; return n; }
int iguales(const char *a, const char *b) {
    while (*a && *a == *b) { a++; b++; }
    return *a == *b;
}
void copiar(char *destino, const char *origen, int tam) {
    int i = 0;
    for (; i < tam - 1 && origen[i]; i++) destino[i] = origen[i];
    destino[i] = '\0';
}
int esDigito(char c) { return c >= '0' && c <= '9'; }
int soloDigitos(const char *s, int cuantos) {
    if (largo(s) != cuantos) return 0;
    for (int i = 0; s[i]; i++) if (!esDigito(s[i])) return 0;
    return 1;
}
/* Largo sin contar espacios al inicio y al final */
int largoSinEspacios(const char *s) {
    int ini = 0, fin = largo(s);
    while (ini < fin && s[ini] == ' ') ini++;
    while (fin > ini && s[fin - 1] == ' ') fin--;
    return fin - ini;
}
/* Pone en cero un bloque de memoria */
void limpiar(void *p, int tam) {
    volatile char *b = (volatile char *)p;
    for (int i = 0; i < tam; i++) b[i] = 0;
}

/* Casillas de texto: la pagina escribe aqui lo que el usuario teclea */
char casillas[N_CASILLAS][TAM_CASILLA];
EXPORT char *casilla(int n) { return (n >= 0 && n < N_CASILLAS) ? casillas[n] : 0; }
EXPORT int casilla_tam(void) { return TAM_CASILLA; }
