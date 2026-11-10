#ifndef TEXTO_H
#define TEXTO_H

#include "tipos.h"

int largo(const char *s);
int iguales(const char *a, const char *b);
void copiar(char *destino, const char *origen, int tam);
int esDigito(char c);
int soloDigitos(const char *s, int cuantos);
int largoSinEspacios(const char *s);
void limpiar(void *p, int tam);

extern char casillas[N_CASILLAS][TAM_CASILLA];

#endif
