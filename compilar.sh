#!/usr/bin/env bash
# Compila todos los modulos de logica/ a WebAssembly y actualiza diseno.js
set -e
cd "$(dirname "$0")"

FUENTES=$(find logica -name '*.c' | sort)
OPCIONES="-Oz -nostdlib -fvisibility=hidden -Ilogica"

if command -v zig >/dev/null; then
  zig cc --target=wasm32-freestanding $OPCIONES \
    -Wl,--no-entry -Wl,--export-dynamic -o logica.wasm $FUENTES
else
  clang --target=wasm32 $OPCIONES \
    -Wl,--no-entry -Wl,--export-dynamic -o logica.wasm $FUENTES
fi
echo "Compilado: logica.wasm ($(stat -c %s logica.wasm) bytes)"

# Guarda logica.wasm en base64 dentro de diseno.js (PARTE 4)
python3 - "$(base64 -w0 logica.wasm)" <<'PY'
import re, sys
ruta = "diseno.js"
js = open(ruta, encoding="utf-8").read()
nuevo, n = re.subn(r'(const LOGICA_C_COMPILADA =\s*")[^"]*(")',
                   lambda m: m.group(1) + sys.argv[1] + m.group(2), js)
if n != 1:
    sys.exit("No se encontro LOGICA_C_COMPILADA en diseno.js")
open(ruta, "w", encoding="utf-8").write(nuevo)
print("diseno.js actualizado")
PY
