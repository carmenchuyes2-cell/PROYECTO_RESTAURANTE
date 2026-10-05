/*
 * RestauranteLatina — DISEÑO DE LA PÁGINA (JavaScript)
 * ------------------------------------------------------------------
 * Este archivo contiene TODO el diseño de la aplicación web:
 *   PARTE 1. Estilos (colores, tamaños, botones, tarjetas)
 *   PARTE 2. Pantallas (login, menú, pedido, boleta, ventas)
 *   PARTE 3. Interfaz (qué pasa al pulsar cada botón)
 *   PARTE 4. Conexión con la lógica en C
 *
 * NO calcula, NO valida y NO decide nada: toda la lógica de cómo funciona
 * el sistema (clientes, stock, carrito, IGV, totales, vuelto, registro,
 * login, pedidos, boletas, listas y reportes) está en logica.c, y aquí
 * se usa como C.funcion(). JavaScript solo dibuja lo que C responde.
 */

/* ================================================================
 * PARTE 1. ESTILOS
 * ================================================================ */
document.head.insertAdjacentHTML("beforeend", `<style>
/* ============ Variables ============ */
:root{
  --rojo:#D62828; --rojo-d:#b51f1f; --amarillo:#FCBF49; --naranja:#F77F00;
  --negro:#212529; --negro-2:#2f353b; --crema:#FFF8F0; --gris:#6c757d;
  --linea:#ece4da; --card:#fff; --radio:14px;
}
*{box-sizing:border-box;margin:0;padding:0}
[hidden]{display:none!important}
html{scroll-behavior:smooth}
body{font-family:Arial,Helvetica,sans-serif;background:var(--crema);color:var(--negro)}
.muted{color:var(--gris)}
.row{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;margin-top:1rem}

/* ============ Botones ============ */
.btn{border:none;border-radius:10px;padding:.75rem 1.1rem;font-weight:bold;cursor:pointer;text-decoration:none;display:inline-block;min-height:44px;font-size:.95rem;text-align:center}
.btn-yellow{background:var(--amarillo);color:var(--negro)}
.btn-red{background:var(--rojo);color:#fff}.btn-red:hover{background:var(--rojo-d)}
.btn-orange{background:var(--naranja);color:#fff}
.btn-dark{background:var(--negro);color:var(--amarillo)}
.btn-ghost{background:#f1ece6;color:var(--negro)}
.btn-block{width:100%;margin-top:.6rem}
.pill{background:#fff;border:1px solid var(--linea);border-radius:999px;padding:.4rem .8rem;font-size:.85rem}

/* ============ Formularios ============ */
label{display:block;font-size:.9rem;font-weight:bold;margin:.6rem 0 .3rem}
input,select{width:100%;padding:.7rem .8rem;border:1px solid #ddd;border-radius:10px;font-size:1rem;min-height:44px;background:#fff}
.grid-form{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.grid-form label{margin-top:0}
.error-msg{background:#fde2e2;color:#8a1414;padding:.6rem;border-radius:10px;margin-top:.7rem;font-size:.9rem;font-weight:bold}

/* ============ Login ============ */
.brand-logo.sm{width:40px;height:40px;font-size:1.2rem}

/* ============ Estructura app ============ */
#app{display:flex;min-height:100vh}
.sidebar{width:240px;background:var(--negro);color:#fff;display:flex;flex-direction:column;padding:1rem;position:sticky;top:0;height:100vh;flex-shrink:0}
.side-brand{display:flex;gap:.6rem;align-items:center;padding:.4rem;margin-bottom:1.2rem}
.side-brand strong span{color:var(--amarillo)}
.side-brand small{display:block;font-size:.75rem;color:#adb5bd}
.side-nav{display:flex;flex-direction:column;gap:.35rem;flex:1}
.nav-btn{color:#ced4da;text-decoration:none;padding:.75rem .85rem;border-radius:10px;font-weight:bold;display:flex;justify-content:space-between;align-items:center}
.nav-btn:hover,.nav-btn.active{background:var(--negro-2);color:#fff}
.nav-btn.active{box-shadow:inset 4px 0 0 var(--amarillo)}
.nav-count{background:var(--amarillo);color:var(--negro);border-radius:999px;padding:.05rem .5rem;font-size:.75rem}
.side-user{border-top:1px solid var(--negro-2);padding-top:.8rem}
.user-info small{display:block;font-size:.8rem;color:#adb5bd;margin-top:.15rem}

.main{flex:1;padding:1.4rem 1.6rem;min-width:0}
.topbar{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem;flex-wrap:wrap}
.topbar h2{color:var(--rojo);border-left:8px solid var(--amarillo);padding-left:.6rem}
.topbar p{margin-top:.2rem;padding-left:calc(.6rem + 8px)}
.top-actions{display:flex;gap:.5rem;flex-wrap:wrap}

/* Pasos */
.steps{list-style:none;display:flex;gap:.4rem;margin-bottom:1rem;flex-wrap:wrap}
.steps li{background:#fff;border:1px solid var(--linea);padding:.4rem .8rem;border-radius:999px;font-size:.85rem;cursor:pointer;color:var(--gris)}
.steps li b{display:inline-grid;place-items:center;width:1.3rem;height:1.3rem;border-radius:50%;background:#f1ece6;margin-right:.2rem;font-size:.75rem}
.steps li.active{background:var(--amarillo);border-color:var(--amarillo);color:var(--negro);font-weight:bold}
.steps li.active b{background:var(--negro);color:var(--amarillo)}

/* Pantallas */
.screen{display:none}
.screen.active{display:block}

/* Tarjetas */
.card{background:var(--card);border:1px solid var(--linea);border-radius:var(--radio);padding:1rem;margin-bottom:.9rem}
.card h3{margin-bottom:.8rem;font-size:1.05rem}
.card-head{display:flex;justify-content:space-between;align-items:baseline}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:.9rem;margin-bottom:.9rem}
.cards .card{margin-bottom:0}
.stat{border-top:5px solid var(--naranja)}
.stat span{color:var(--gris);font-size:.85rem}
.stat strong{display:block;font-size:1.5rem;margin:.25rem 0;color:var(--rojo)}
.stat small{color:var(--gris)}

/* ============ Menú ============ */
.menu-layout,.pos-layout{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:.9rem;align-items:start}
.side-summary{position:sticky;top:1rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:.8rem}
.prod{background:#fff;border:2px solid #f1ece6;border-radius:12px;padding:.9rem;text-align:center;display:flex;flex-direction:column;gap:.25rem;transition:.15s}
.prod:hover{border-color:var(--naranja);transform:translateY(-2px)}
.prod.sel{border-color:var(--rojo);background:#fff6ec}
.prod .em{font-size:2rem}
.prod h4{font-size:.98rem;min-height:2.4em}
.prod .price{color:var(--rojo);font-weight:bold;font-size:1.2rem}
.prod small{color:var(--gris)}
.prod small.low{color:var(--rojo);font-weight:bold}
.prod button{margin-top:auto;width:100%}
.prod.out{opacity:.45;pointer-events:none}
.qty{display:flex;gap:.3rem;align-items:stretch}
.qty input{text-align:center}
.qty .btn{min-width:48px}
.live{margin-top:1rem;background:#FFF3CD;border-radius:12px;padding:1rem;text-align:center}
.live span{display:block;color:var(--gris);font-size:.85rem}
.live strong{display:block;font-size:1.8rem;color:var(--rojo);margin:.2rem 0}

/* ============ Pedido ============ */
.table-wrap{overflow-x:auto}
.tbl{width:100%;border-collapse:collapse;font-size:.92rem}
.tbl th{background:var(--negro);color:var(--amarillo);padding:.65rem;text-align:left;font-size:.8rem;text-transform:uppercase}
.tbl th:first-child{border-top-left-radius:10px}.tbl th:last-child{border-top-right-radius:10px}
.tbl td{padding:.6rem .65rem;border-bottom:1px solid #f1ece6}
.tbl td input{width:72px;min-height:36px;padding:.35rem}
.tbl .num{text-align:right;white-space:nowrap}
.del{background:none;border:1px solid #f1ece6;border-radius:8px;cursor:pointer;padding:.3rem .5rem}
.empty{padding:1rem 0;text-align:center}
#cartCards{display:none;gap:.6rem}
.cart-card{background:#fff;border:1px solid #f1ece6;border-left:6px solid var(--naranja);border-radius:10px;padding:.8rem;display:flex;justify-content:space-between;align-items:center;gap:.5rem}
.cart-card input{width:64px;min-height:40px;padding:.4rem}
.totals{display:grid;gap:.35rem;border-bottom:1px dashed var(--linea);padding-bottom:.7rem}
.totals div{display:flex;justify-content:space-between}
.grand{font-size:1.25rem;color:var(--rojo);font-weight:bold}
.totals .grand{border-top:1px dashed var(--linea);padding-top:.5rem;margin-top:.2rem}
.pay{margin-top:1rem;border-top:2px dashed var(--naranja);padding-top:1rem;display:grid;gap:.7rem}
.pay h3{margin:0}
.pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.pay-opt{border:1px solid #eee;border-radius:10px;padding:.7rem;display:flex;gap:.4rem;align-items:center;cursor:pointer;min-height:48px;margin:0;font-size:.9rem}
.pay-opt input{width:auto;min-height:0}
.pay-opt:has(input:checked){border-color:var(--rojo);background:#FFF3CD}
.yape-box{background:#f6f0ff;border:2px solid #7b2ff7;border-radius:12px;padding:1rem;text-align:center;display:grid;gap:.5rem;justify-items:center}
.yape-box h4{color:#5b21b6}
.yape-box img{background:#fff;padding:8px;border-radius:10px;border:1px solid #ddd;max-width:100%;height:auto}
.qr-monto{font-weight:bold;color:var(--rojo);font-size:1.2rem}

/* ============ Boleta ============ */
.boleta{max-width:520px;background:#fff;border:2px solid var(--rojo);border-radius:12px;overflow:hidden;margin-bottom:1rem}
.b-head{background:var(--rojo);color:#fff;text-align:center;padding:1rem;display:grid;gap:.2rem}
.b-head strong{font-size:1.1rem;letter-spacing:.5px}
.b-head span{font-size:.8rem;opacity:.9}
.b-head h3{justify-self:center;background:var(--amarillo);color:var(--negro);border-radius:999px;padding:.2rem .9rem;font-size:.95rem;margin-top:.3rem}
.b-body{padding:1rem;font-size:.9rem}
.b-meta{display:grid;gap:.2rem;padding-bottom:.6rem;border-bottom:1px dashed #ddd}
.b-meta span{color:var(--gris)}
.b-table{width:100%;border-collapse:collapse;margin:.6rem 0;font-size:.88rem}
.b-table th{text-align:left;color:var(--gris);font-size:.75rem;text-transform:uppercase;border-bottom:1px solid #eee;padding:.35rem .2rem}
.b-table td{padding:.35rem .2rem;border-bottom:1px dotted #eee}
.b-table .num{text-align:right;white-space:nowrap}
.b-tot{background:#FFF3CD;border-radius:10px;padding:.8rem;display:grid;gap:.25rem}
.b-tot div{display:flex;justify-content:space-between;gap:1rem}
.b-tot .grand{border-top:1px dashed #e0c98a;padding-top:.4rem;margin-top:.2rem}
.b-foot{text-align:center;color:var(--gris);font-size:.8rem;margin-top:.8rem}
.actions{display:flex;gap:.6rem;flex-wrap:wrap}

/* ============ Ventas ============ */
.toolbar{display:flex;gap:.6rem;margin-bottom:.9rem;flex-wrap:wrap}
.toolbar select,.toolbar input{flex:1;min-width:160px}
.bar{display:flex;align-items:center;gap:.6rem;margin:.45rem 0;font-size:.9rem}
.bar .lbl{width:150px}
.bar .track{flex:1;background:#f1ece6;border-radius:999px;height:10px;overflow:hidden}
.bar .fill{height:10px;background:var(--naranja)}
.bar .val{width:110px;text-align:right;font-weight:bold}
.tag{display:inline-block;background:#FFF3CD;border-radius:999px;padding:.15rem .6rem;font-size:.8rem;font-weight:bold}

/* ============ Extras ============ */
.cart-fab{display:none;position:fixed;bottom:76px;right:12px;background:var(--negro);color:var(--amarillo);border:none;border-radius:30px;padding:.9rem 1.2rem;font-weight:bold;z-index:30;box-shadow:0 4px 14px rgba(0,0,0,.3);font-size:1rem}
.bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--negro);z-index:25;padding:.3rem}
.bottom-nav a{flex:1;color:#fff;text-decoration:none;text-align:center;font-size:1.2rem;display:flex;flex-direction:column;align-items:center;padding:.4rem}
.bottom-nav a small{font-size:.7rem}
.bottom-nav a.active{color:var(--amarillo)}
.toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--negro);color:#fff;padding:.8rem 1.2rem;border-radius:10px;opacity:0;transition:.3s;z-index:40;max-width:90vw;text-align:center;pointer-events:none}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
footer{color:var(--gris);text-align:center;padding:1.5rem 0 .5rem;font-size:.85rem}

/* ============ Tablet ============ */
@media(max-width:1100px){
  .cards{grid-template-columns:1fr 1fr}
  .menu-layout,.pos-layout{grid-template-columns:1fr}
  .side-summary{position:static}
}
/* ============ Móvil ============ */
@media(max-width:700px){
  #app{flex-direction:column}
  .sidebar{width:100%;height:auto;position:sticky;top:0;z-index:20;flex-direction:row;align-items:center;justify-content:space-between;padding:.6rem .9rem}
  .side-brand{margin:0}
  .side-nav{display:none}
  .side-user{border:0;padding:0;display:flex;align-items:center;gap:.5rem}
  .side-user .btn{width:auto;margin:0;padding:.5rem .8rem;min-height:36px;font-size:.85rem}
  .user-info strong{font-size:.85rem}
  .main{padding:.9rem;padding-bottom:140px}
  .grid-form{grid-template-columns:1fr}
  .grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}
  #pedido .table-wrap{display:none}
  #cartCards{display:grid}
  .cart-fab{display:block}
  .bottom-nav{display:flex}
  .toast{bottom:140px}
  .actions .btn{flex:1 1 100%}
  .bar .lbl{width:100px}.bar .val{width:90px}
}
@media(max-width:420px){.cards{grid-template-columns:1fr}.user-info{display:none}}

/* ============ Impresión ============ */
@media print{
  body *{visibility:hidden}
  #boletaView,#boletaView *{visibility:visible}
  #boletaView{position:absolute;left:0;top:0;width:100%;border:0}
  .no-print{display:none!important}
}


/* ============ Mini pedido / bienvenida ============ */
.mini-cart{margin-top:1rem;border-top:1px dashed var(--linea);padding-top:.8rem}
.mini-cart ul{list-style:none;margin-top:.5rem;display:grid;gap:.3rem;max-height:220px;overflow:auto}
.mini-cart li{display:flex;justify-content:space-between;gap:.5rem;font-size:.88rem;background:#fffaf2;border-radius:8px;padding:.4rem .6rem}
.mini-cart li.vacio{justify-content:center;color:var(--gris)}
.welcome{border-left:6px solid var(--amarillo)}
.welcome h3{margin-bottom:.3rem}
.nav-count.alert{background:var(--rojo);color:#fff}
.nav-count.alert.zero{background:var(--negro-2);color:#adb5bd}

/* ============ Pedidos (cola cajero / mis pedidos) ============ */
.orders{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:.9rem}
.order{background:#fff;border:1px solid var(--linea);border-left:6px solid var(--naranja);border-radius:12px;padding:1rem;display:grid;gap:.6rem;align-content:start}
.order.cobrado{border-left-color:#2b9348}
.order.anulado{border-left-color:#adb5bd;opacity:.75}
.order.nuevo{animation:pulso 1.2s ease 3}
@keyframes pulso{50%{box-shadow:0 0 0 6px rgba(247,127,0,.25)}}
.order-head{display:flex;justify-content:space-between;align-items:center;gap:.5rem}
.order-head b{font-size:1.05rem}
.order-cli{font-size:.9rem}
.order-cli small{color:var(--gris)}
.order ul{list-style:none;display:grid;gap:.2rem;font-size:.88rem;border-top:1px dashed var(--linea);border-bottom:1px dashed var(--linea);padding:.5rem 0}
.order li{display:flex;justify-content:space-between;gap:.5rem}
.order-tot{display:flex;justify-content:space-between;font-weight:bold;color:var(--rojo);font-size:1.1rem}
.order-actions{display:flex;gap:.5rem;flex-wrap:wrap}
.order-actions .btn{flex:1}
.order-actions select{flex:1 1 100%}
.st{display:inline-block;border-radius:999px;padding:.15rem .6rem;font-size:.78rem;font-weight:bold}
.st.pendiente{background:#FFF3CD;color:#8a5a00}
.st.cobrado{background:#d8f3dc;color:#1b6b34}
.st.anulado{background:#eceff1;color:#555}
.orders .empty{grid-column:1/-1}
.order-actions input{flex:1 1 100%;min-height:40px}

/* ============ Accesos (inicio, cliente, registro, empleado) ============ */
.login-wrap{position:relative;min-height:100vh;display:grid;place-items:center;padding:2rem 1rem;overflow:hidden;
  background:radial-gradient(900px 500px at 15% 10%,rgba(255,170,60,.55),transparent 60%),radial-gradient(700px 500px at 90% 90%,rgba(255,120,0,.5),transparent 60%),linear-gradient(135deg,#e8451e,#f77f00)}
.doodles{position:absolute;inset:0;pointer-events:none}
.doodles svg{position:absolute;color:#fff;opacity:.22;pointer-events:none}
.d-burger{width:110px;top:5%;left:3%;transform:rotate(-12deg)}
.d-fries{width:90px;bottom:10%;left:4%;transform:rotate(-10deg)}
.d-cup{width:80px;top:34%;right:7%;transform:rotate(14deg)}
.d-spark1{width:46px;top:10%;right:22%}
.d-spark2{width:46px;top:25%;left:12%}
.login-card{position:relative;z-index:1;background:#fff;width:min(440px,100%);border-radius:18px;padding:2rem 1.9rem 1.6rem;
  box-shadow:0 24px 60px rgba(90,25,0,.35);animation:entrar .35s ease}
@keyframes entrar{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
.ico{width:1.15em;height:1.15em;flex-shrink:0;vertical-align:-.2em}

/* marca */
.brand-logo{width:56px;height:56px;border-radius:14px;background:var(--amarillo);display:grid;place-items:center;font-size:1.8rem;flex-shrink:0;box-shadow:0 4px 10px rgba(252,191,73,.45)}
.brand-logo.xl{width:76px;height:76px;font-size:2.5rem;border-radius:18px;margin:0 auto .8rem}
.brand-name{font-size:1.45rem;color:var(--negro);letter-spacing:-.3px}
.brand-name span{color:var(--naranja)}
.brand-tag{color:var(--gris);font-size:.92rem;margin-top:.15rem}
.brand-line{display:block;width:56px;height:3px;border-radius:3px;background:var(--naranja);margin:1rem auto 1.2rem}
.login-brand{display:flex;gap:.9rem;align-items:center;justify-content:center;margin-top:2.6rem}

/* pantalla de inicio */
.acceso-inicio{text-align:center;padding-top:2.2rem}
.acceso-inicio .brand-name{font-size:1.8rem}
.btn-acceso{width:100%;display:flex;align-items:center;justify-content:center;gap:.7rem;border:0;border-radius:10px;padding:.95rem 1rem;margin-top:.9rem;
  font-size:1.05rem;font-weight:bold;color:#fff;cursor:pointer;transition:transform .15s,box-shadow .15s,filter .15s}
.btn-acceso .ico{width:1.35em;height:1.35em}
.btn-acceso.cliente{background:linear-gradient(180deg,#ff8a1f,#f76b00);box-shadow:0 6px 16px rgba(247,107,0,.35)}
.btn-acceso.empleado{background:linear-gradient(180deg,#ec4646,#d62828);box-shadow:0 6px 16px rgba(214,40,40,.3)}
.btn-acceso:hover{transform:translateY(-2px);filter:brightness(1.05)}
.btn-acceso:active{transform:translateY(0)}

/* botón volver */
.btn-volver{position:absolute;top:1rem;left:1rem;display:inline-flex;align-items:center;gap:.45rem;border:1px solid #f3dccb;background:#fff7f0;
  color:#c2410c;font-weight:bold;font-size:.85rem;padding:.3rem .8rem .3rem .3rem;border-radius:999px;cursor:pointer;transition:all .2s}
.volver-circ{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--naranja);color:#fff;transition:transform .2s}
.btn-volver:hover{background:var(--naranja);color:#fff;border-color:var(--naranja);box-shadow:0 4px 12px rgba(247,127,0,.35)}
.btn-volver:hover .volver-circ{background:#fff;color:var(--naranja);transform:translateX(-3px)}

/* formularios */
.acceso-titulo{display:flex;align-items:center;gap:.55rem;color:var(--naranja);font-size:1.3rem;margin-bottom:.4rem}
.acceso-titulo .ico{width:1.3em;height:1.3em}
.campo{display:block;font-size:.92rem;font-weight:bold;margin:.85rem 0 0;color:var(--negro)}
.input-ico{position:relative;display:flex;align-items:center;margin-top:.4rem}
.input-ico>.ico{position:absolute;left:.85rem;color:#8b939b;pointer-events:none}
.input-ico input{padding-left:2.6rem;border:1px solid #dfe3e8;border-radius:8px;font-weight:normal;transition:border-color .15s,box-shadow .15s}
.input-ico input:focus{outline:none;border-color:var(--naranja);box-shadow:0 0 0 3px rgba(247,127,0,.18)}
.input-ico input:focus~.ico,.input-ico:focus-within>.ico{color:var(--naranja)}
.input-ico .ojo{position:absolute;right:.5rem;border:0;background:none;color:#6c757d;cursor:pointer;padding:.35rem;display:grid;place-items:center;border-radius:6px}
.input-ico .ojo:hover{color:var(--naranja);background:#fff3e8}
.input-ico:has(.ojo) input{padding-right:2.6rem}
.btn-ingresar{width:100%;margin-top:1.3rem;border:0;border-radius:10px;padding:.95rem;font-size:1.05rem;font-weight:bold;color:#fff;cursor:pointer;
  background:linear-gradient(180deg,#ff8a1f,#f76b00);box-shadow:0 6px 16px rgba(247,107,0,.3);transition:transform .15s,filter .15s}
.btn-ingresar:hover{transform:translateY(-1px);filter:brightness(1.05)}
.switch-msg{text-align:center;margin-top:1rem;font-size:.9rem;color:var(--gris)}
#registroForm .switch-msg{color:var(--rojo)}
.switch-msg a{color:var(--rojo);font-weight:bold}
.autorizado{display:flex;align-items:center;justify-content:center;gap:.4rem;margin-top:1rem;font-size:.85rem;color:var(--gris)}
.autorizado .ico{color:#8b939b}
.demo-cuentas{margin-top:1rem;background:#fff7f0;border:1px dashed #f3c9a6;border-radius:10px;padding:.75rem .9rem;display:grid;gap:.35rem;font-size:.88rem}
.demo-titulo{font-weight:bold;color:#c2410c;font-size:.8rem;text-transform:uppercase;letter-spacing:.4px}
.demo-fila{display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap}
.demo-cuentas code{background:#fff;border:1px solid #f3dccb;border-radius:5px;padding:.05rem .35rem;font-size:.85rem}
.demo-cuentas small{color:var(--gris);font-size:.78rem}
@media(max-width:560px){.doodles{display:none}.login-card{padding:1.8rem 1.2rem 1.4rem}.login-brand{margin-top:2.8rem}.brand-name{font-size:1.25rem}}
</style>`);

/* ================================================================
 * PARTE 2. PANTALLAS
 * ================================================================ */
document.body.insertAdjacentHTML("afterbegin", `

<!-- ============ ÍCONOS (SVG) ============ -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="4.5" fill="currentColor"/><path d="M3.5 21c0-4.4 3.8-7 8.5-7s8.5 2.6 8.5 7z" fill="currentColor"/></symbol>
  <symbol id="i-user-line" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></g></symbol>
  <symbol id="i-user-plus" viewBox="0 0 24 24"><circle cx="9.5" cy="7.5" r="4.5" fill="currentColor"/><path d="M1.5 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor"/><path d="M19.5 7v6M16.5 10h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
  <symbol id="i-briefcase" viewBox="0 0 24 24"><path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6" fill="none" stroke="currentColor" stroke-width="2"/><rect x="2" y="6" width="20" height="14" rx="2.5" fill="currentColor"/><path d="M2 12.5h20" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/><rect x="10" y="11" width="4" height="3" rx=".8" fill="#fff"/></symbol>
  <symbol id="i-idcard" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M14 10h4.5M14 13.5h4.5"/></g></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><path d="M7.5 11V8a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4.5" y="11" width="15" height="10" rx="2" fill="currentColor"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 6.5 9 6.5 9-6.5"/></g></symbol>
  <symbol id="i-eye" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3" fill="currentColor"/></g></symbol>
  <symbol id="i-eye-off" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/></g></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 2.5 4.5 5.5v6c0 4.8 3.2 8.4 7.5 9.8 4.3-1.4 7.5-5 7.5-9.8v-6z" fill="currentColor"/><path d="m8.8 12 2.2 2.2 4.2-4.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-back" viewBox="0 0 24 24"><path d="M14.5 6 8.5 12l6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
</svg>

<!-- ============ ACCESOS (inicio, cliente, registro, empleado) ============ -->
<div id="login-screen" class="login-wrap">
  <!-- dibujos de fondo -->
  <div class="doodles" aria-hidden="true">
    <svg class="d-burger" viewBox="0 0 64 48"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22C6 10 18 4 32 4s26 6 26 18z"/><path d="M4 28h56M8 34c4 3 8 3 12 0s8-3 12 0 8 3 12 0 8-3 12 0"/><path d="M6 40h52v2a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"/><path d="M22 12h.01M32 10h.01M42 12h.01"/></g></svg>
    <svg class="d-fries" viewBox="0 0 48 64"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 26V6M22 26V2M30 26V5M38 26V9"/><path d="M6 26h36l-5 34H11z"/><path d="M14 38c6 4 14 4 20 0"/></g></svg>
    <svg class="d-cup" viewBox="0 0 48 64"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 20h28l-4 40H14z"/><path d="M7 14h34v6H7zM26 14l4-12h8"/></g></svg>
    <svg class="d-spark1" viewBox="0 0 40 40"><g stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M10 4l6 12M22 26l12-4"/></g></svg>
    <svg class="d-spark2" viewBox="0 0 40 40"><g stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M28 4l-6 12M18 26 6 22"/></g></svg>
  </div>

  <!-- 1. Inicio: elegir tipo de acceso -->
  <div class="login-card acceso-inicio" id="inicioAcceso">
    <div class="brand-logo xl">🍔</div>
    <h1 class="brand-name">Restaurante<span>Latina</span></h1>
    <p class="brand-tag">FastFood • Pedidos, pagos y boletas</p>
    <span class="brand-line"></span>
    <button type="button" class="btn-acceso cliente" data-tab-link="cliente">
      <svg class="ico"><use href="#i-user"/></svg> Ingresar como Cliente
    </button>
    <button type="button" class="btn-acceso empleado" data-tab-link="cajero">
      <svg class="ico"><use href="#i-briefcase"/></svg> Ingresar como Empleado
    </button>
  </div>

  <!-- 2. Ingreso de cliente -->
  <form class="login-card login-form" id="clienteForm" hidden novalidate>
    <button type="button" class="btn-volver" data-tab-link="inicio" aria-label="Volver al inicio">
      <span class="volver-circ"><svg class="ico"><use href="#i-back"/></svg></span> Volver
    </button>
    <div class="login-brand">
      <div class="brand-logo">🍔</div>
      <div><h1 class="brand-name">Restaurante<span>Latina</span></h1><p class="brand-tag">FastFood • Pedidos, pagos y boletas</p></div>
    </div>
    <span class="brand-line"></span>
    <h2 class="acceso-titulo"><svg class="ico"><use href="#i-user"/></svg> Ingreso de Cliente</h2>
    <label class="campo">DNI
      <span class="input-ico"><svg class="ico"><use href="#i-idcard"/></svg>
        <input id="cliDni" placeholder="Ingresa tu DNI" inputmode="numeric" maxlength="8" autocomplete="username" required /></span>
    </label>
    <label class="campo">Contraseña
      <span class="input-ico"><svg class="ico"><use href="#i-lock"/></svg>
        <input id="cliPass" type="password" placeholder="Ingresa tu contraseña" autocomplete="current-password" required />
        <button type="button" class="ojo" aria-label="Mostrar contraseña"><svg class="ico"><use href="#i-eye"/></svg></button></span>
    </label>
    <p class="error-msg" id="cliMsg" hidden></p>
    <button class="btn-ingresar" type="submit">Ingresar</button>
    <p class="switch-msg">¿No tienes cuenta? <a href="#" data-tab-link="registro">Regístrate aquí</a></p>
  </form>

  <!-- 3. Registro de cliente -->
  <form class="login-card login-form" id="registroForm" hidden novalidate>
    <button type="button" class="btn-volver" data-tab-link="inicio" aria-label="Volver al inicio">
      <span class="volver-circ"><svg class="ico"><use href="#i-back"/></svg></span> Volver
    </button>
    <div class="login-brand">
      <div class="brand-logo">🍔</div>
      <div><h1 class="brand-name">Restaurante<span>Latina</span></h1><p class="brand-tag">FastFood • Pedidos, pagos y boletas</p></div>
    </div>
    <span class="brand-line"></span>
    <h2 class="acceso-titulo"><svg class="ico"><use href="#i-user-plus"/></svg> Crear cuenta de Cliente</h2>
    <label class="campo">DNI
      <span class="input-ico"><svg class="ico"><use href="#i-idcard"/></svg>
        <input id="regDni" placeholder="Ingresa tu DNI" inputmode="numeric" maxlength="8" required /></span>
    </label>
    <label class="campo">Nombre completo
      <span class="input-ico"><svg class="ico"><use href="#i-user-line"/></svg>
        <input id="regNombre" placeholder="Ingresa tu nombre completo" autocomplete="name" required /></span>
    </label>
    <label class="campo">Correo
      <span class="input-ico"><svg class="ico"><use href="#i-mail"/></svg>
        <input id="regCorreo" type="email" placeholder="Ingresa tu correo electrónico" autocomplete="email" required /></span>
    </label>
    <label class="campo">Contraseña
      <span class="input-ico"><svg class="ico"><use href="#i-lock"/></svg>
        <input id="regPass" type="password" placeholder="Ingresa tu contraseña (mín. 6)" autocomplete="new-password" required />
        <button type="button" class="ojo" aria-label="Mostrar contraseña"><svg class="ico"><use href="#i-eye"/></svg></button></span>
    </label>
    <label class="campo">Confirmar contraseña
      <span class="input-ico"><svg class="ico"><use href="#i-lock"/></svg>
        <input id="regPass2" type="password" placeholder="Confirma tu contraseña" autocomplete="new-password" required />
        <button type="button" class="ojo" aria-label="Mostrar contraseña"><svg class="ico"><use href="#i-eye"/></svg></button></span>
    </label>
    <p class="error-msg" id="regMsg" hidden></p>
    <button class="btn-ingresar" type="submit">Registrarse</button>
    <p class="switch-msg">Ya tengo una cuenta / <a href="#" data-tab-link="cliente">Ingresar</a></p>
  </form>

  <!-- 4. Ingreso de empleado -->
  <form class="login-card login-form" id="loginForm" hidden novalidate>
    <button type="button" class="btn-volver" data-tab-link="inicio" aria-label="Volver al inicio">
      <span class="volver-circ"><svg class="ico"><use href="#i-back"/></svg></span> Volver
    </button>
    <div class="login-brand">
      <div class="brand-logo">🍔</div>
      <div><h1 class="brand-name">Restaurante<span>Latina</span></h1><p class="brand-tag">FastFood • Pedidos, pagos y boletas</p></div>
    </div>
    <span class="brand-line"></span>
    <h2 class="acceso-titulo"><svg class="ico"><use href="#i-briefcase"/></svg> Ingreso de Empleado</h2>
    <label class="campo">Usuario o DNI
      <span class="input-ico"><svg class="ico"><use href="#i-user-line"/></svg>
        <input id="loginUser" placeholder="Ingresa tu usuario o DNI" autocomplete="username" required /></span>
    </label>
    <label class="campo">Contraseña
      <span class="input-ico"><svg class="ico"><use href="#i-lock"/></svg>
        <input id="loginPass" type="password" placeholder="Ingresa tu contraseña" autocomplete="current-password" required />
        <button type="button" class="ojo" aria-label="Mostrar contraseña"><svg class="ico"><use href="#i-eye"/></svg></button></span>
    </label>
    <p class="error-msg" id="loginMsg" hidden></p>
    <button class="btn-ingresar" type="submit">Ingresar como empleado</button>
    <p class="autorizado"><svg class="ico"><use href="#i-shield"/></svg> Acceso para personal autorizado</p>
    <div class="demo-cuentas">
      <span class="demo-titulo">Cuentas de prueba (demo)</span>
      <div class="demo-fila"><b>Administrador</b><span><code>admin</code> / <code>123456</code></span></div>
      <div class="demo-fila"><b>Cajero</b><span><code>empleado</code> / <code>123456789</code></span></div>
      <small>También puedes entrar con el DNI: 10000001 (admin) o 10000002 (cajero)</small>
    </div>
  </form>
</div>

<!-- ============ APP ============ -->
<div id="app" hidden>
  <aside class="sidebar">
    <div class="side-brand">
      <div class="brand-logo sm">🍔</div>
      <div><strong>Restaurante<span>Latina</span></strong><small>FastFood • S/ • IGV 18%</small></div>
    </div>
    <nav class="side-nav">
      <a href="#menu" data-go="menu" data-show="cliente" class="nav-btn">🍔 Menú</a>
      <a href="#pedido" data-go="pedido" data-show="cliente" class="nav-btn">🧾 Mi pedido <span class="nav-count" id="navCount">0</span></a>
      <a href="#mispedidos" data-go="mispedidos" data-show="cliente" class="nav-btn">📦 Mis pedidos <span class="nav-count" id="navMis">0</span></a>
      <a href="#pedidos" data-go="pedidos" data-show="staff" class="nav-btn">🔔 Pedidos clientes <span class="nav-count alert" id="navPend">0</span></a>
      <a href="#boleta" data-go="boleta" data-show="staff" class="nav-btn">🎫 Boleta</a>
      <a href="#ventas" data-go="ventas" data-show="admin" class="nav-btn">📊 Ventas</a>
    </nav>
    <div class="side-user">
      <div class="user-info"><strong id="userName">-</strong><small id="userRole">-</small></div>
      <button class="btn btn-ghost btn-block" id="btnLogout" type="button">Cerrar sesión</button>
    </div>
  </aside>

  <main class="main">
    <!-- Barra superior -->
    <header class="topbar">
      <div>
        <h2 id="viewTitle">Menú</h2>
        <p id="viewSubtitle" class="muted">Selecciona los productos</p>
      </div>
      <div class="top-actions">
        <span class="pill" id="todayLabel"></span>
        <span class="pill" id="deviceHint"></span>
      </div>
    </header>

    <!-- Pasos (se llenan según el rol) -->
    <ol class="steps" id="stepsBar"></ol>

    <!-- ===== MENÚ ===== -->
    <section id="menu" class="screen">
      <div class="menu-layout">
        <div>
          <div class="card welcome">
            <div>
              <h3>¡Hola, <span id="hola">cliente</span>! 👋</h3>
              <p class="muted">Elige tus productos, revisa tu pedido y envíalo a caja. Verás su estado en <b>Mis pedidos</b>.</p>
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <h3>Productos</h3>
              <small class="muted" id="menuCount"></small>
            </div>
            <div class="grid" id="menuGrid"></div>
          </div>
        </div>

        <aside class="card side-summary">
          <h3>Agregar al pedido</h3>
          <label>Producto
            <select id="selProd" aria-label="Producto"></select>
          </label>
          <label>Cantidad</label>
          <div class="qty">
            <button class="btn btn-dark" id="qtyMinus" type="button">−</button>
            <input id="inpCant" type="number" min="1" value="1" />
            <button class="btn btn-dark" id="qtyPlus" type="button">+</button>
          </div>
          <button class="btn btn-red btn-block" id="btnAdd" type="button">Agregar +</button>

          <div class="mini-cart">
            <div class="card-head"><b>Tu pedido</b><small class="muted" id="miniCount">vacío</small></div>
            <ul id="miniCart"></ul>
          </div>

          <div class="live">
            <span>Total en vivo</span>
            <strong id="liveTotal">S/ 0.00</strong>
            <small id="liveCount">0 productos</small>
          </div>
          <button class="btn btn-orange btn-block" data-go="pedido" type="button">Siguiente: mi pedido →</button>
        </aside>
      </div>
    </section>

    <!-- ===== PEDIDO + PAGO ===== -->
    <section id="pedido" class="screen">
      <div class="pos-layout">
        <div class="card">
          <h3>Tu pedido</h3>
          <div class="table-wrap">
            <table class="tbl">
              <thead><tr><th>Producto</th><th>Cant.</th><th>P. Unit</th><th>Subtotal</th><th></th></tr></thead>
              <tbody id="cartBody"></tbody>
            </table>
          </div>
          <div id="cartCards"></div>
          <p class="empty muted" id="cartEmpty">Tu pedido está vacío. Agrega productos desde el menú.</p>
          <div class="row">
            <button class="btn btn-dark" id="btnSeguir" type="button">← ¿Agregar otro? Volver al menú</button>
          </div>
        </div>

        <aside class="card side-summary">
          <h3>Resumen</h3>
          <div class="totals">
            <div><span>Cantidad</span><b id="tCant">0</b></div>
            <div><span>Subtotal</span><b id="tSub">S/ 0.00</b></div>
            <div><span>IGV 18%</span><b id="tIgv">S/ 0.00</b></div>
            <div class="grand"><span>Total</span><b id="tTot">S/ 0.00</b></div>
          </div>
          <button class="btn btn-orange btn-block" id="btnFinalizar" type="button">Mostrar total y pagar →</button>

          <div class="pay" id="payBox" hidden>
            <h3>¿Cómo pagarás?</h3>
            <div class="pay-grid">
              <label class="pay-opt"><input type="radio" name="pay" value="Efectivo" checked /> 💵 Efectivo</label>
              <label class="pay-opt"><input type="radio" name="pay" value="Tarjeta" /> 💳 Tarjeta</label>
              <label class="pay-opt"><input type="radio" name="pay" value="Yape" /> 📱 Yape</label>
              <label class="pay-opt"><input type="radio" name="pay" value="Tarjeta de credito" /> 💎 T. Crédito</label>
            </div>
            <div class="yape-box" id="yapeBox" hidden>
              <h4>📱 Paga con Yape escaneando el QR</h4>
              <img id="qrImg" width="200" height="200" alt="QR Yape RestauranteLatina" />
              <p class="qr-monto" id="qrMonto">Total: S/ 0.00</p>
              <p>Yape al: <b>999 888 777</b> — RestauranteLatina</p>
              <small class="muted">1) Abre Yape • 2) Escanea • 3) Confirma el monto • 4) Continúa</small>
            </div>
            <button class="btn btn-red btn-block" id="btnPagar" type="button">📤 Enviar pedido a caja</button>
          </div>
        </aside>
      </div>
    </section>

    <!-- ===== MIS PEDIDOS (cliente) ===== -->
    <section id="mispedidos" class="screen">
      <div class="orders" id="misPedidos"></div>
    </section>

    <!-- ===== PEDIDOS DE CLIENTES (cajero) ===== -->
    <section id="pedidos" class="screen">
      <div class="cards">
        <div class="card stat"><span>Pendientes</span><strong id="sPend">0</strong><small>Por cobrar</small></div>
        <div class="card stat"><span>Cobrados hoy</span><strong id="sCob">0</strong><small>Pedidos de clientes</small></div>
        <div class="card stat"><span>Total cobrado hoy</span><strong id="sCobTot">S/ 0.00</strong><small>Desde pedidos</small></div>
        <div class="card stat"><span>Anulados hoy</span><strong id="sAnul">0</strong><small>Cancelados</small></div>
      </div>

      <div class="card">
        <div class="card-head">
          <h3>🔔 Pedidos por cobrar</h3>
          <small class="muted">Se actualiza solo cuando un cliente envía un pedido</small>
        </div>
        <div class="orders" id="colaPedidos"></div>
      </div>

      <div class="card">
        <h3>Atendidos hoy</h3>
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>Pedido</th><th>Hora</th><th>Cliente</th><th>Estado</th><th>Boleta</th><th>Atendió</th><th>Total</th></tr></thead>
            <tbody id="atendidos"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ===== BOLETA ===== -->
    <section id="boleta" class="screen">
      <div class="boleta" id="boletaView">
        <div class="b-head">
          <strong>RESTAURANTELATINA</strong>
          <span>FastFood • Boleta de Venta Electrónica</span>
          <h3 id="bNum">BOLETA —</h3>
        </div>
        <div id="bEmpty" class="b-body muted">Aún no hay boleta. Finaliza un pedido.</div>
        <div id="bContent" class="b-body" hidden>
          <div class="b-meta">
            <div><span>Fecha:</span> <strong id="bFecha">-</strong></div>
            <div><span>Pedido:</span> <strong id="bPed">-</strong></div>
            <div><span>Cliente:</span> <strong id="bCli">-</strong></div>
            <div><span>DNI:</span> <strong id="bDni">-</strong></div>
            <div><span>Atendió:</span> <strong id="bVend">-</strong></div>
            <div><span>Forma de pago:</span> <strong id="bPago">-</strong></div>
          </div>
          <table class="b-table">
            <thead><tr><th>Cant.</th><th>Descripción</th><th>P.U.</th><th>Total</th></tr></thead>
            <tbody id="bItems"></tbody>
          </table>
          <div class="b-tot">
            <div><span>Cantidad de productos</span><span id="bCant">-</span></div>
            <div><span>Subtotal</span><span id="bSub">-</span></div>
            <div><span>IGV 18%</span><span id="bIgv">-</span></div>
            <div class="grand"><span>TOTAL</span><span id="bTot">-</span></div>
            <div id="bRecRow"><span>Efectivo recibido</span><span id="bRec">-</span></div>
            <div id="bVueRow"><span>Vuelto</span><span id="bVue">-</span></div>
          </div>
          <p class="b-foot">¡Gracias por su preferencia! • Comprobante generado localmente</p>
        </div>
      </div>
      <div class="actions no-print">
        <button class="btn btn-dark" id="btnPrint" type="button">🖨️ Imprimir / Guardar</button>
        <button class="btn btn-orange" data-go="mispedidos" data-show="cliente" type="button">← Mis pedidos</button>
        <button class="btn btn-orange" data-go="pedidos" data-show="staff" type="button">← Pedidos clientes</button>
        <button class="btn btn-yellow" data-go="ventas" data-show="admin" type="button">Ver ventas →</button>
      </div>
    </section>

    <!-- ===== VENTAS (solo admin) ===== -->
    <section id="ventas" class="screen">
      <div class="cards">
        <div class="card stat"><span>Total vendido</span><strong id="dayTotal">S/ 0.00</strong><small id="statCount">0 boletas</small></div>
        <div class="card stat"><span>Ticket promedio</span><strong id="statAvg">S/ 0.00</strong><small>Por boleta</small></div>
        <div class="card stat"><span>Productos vendidos</span><strong id="statItems">0</strong><small>Unidades</small></div>
        <div class="card stat"><span>IGV recaudado</span><strong id="statIgv">S/ 0.00</strong><small>18%</small></div>
      </div>

      <div class="card">
        <h3>Métodos de pago</h3>
        <div id="salesSummary"></div>
      </div>

      <div class="card">
        <div class="toolbar">
          <select id="filtroPago">
            <option value="todos">Todos los métodos</option>
            <option>Efectivo</option><option>Tarjeta</option>
            <option>Yape</option><option>Tarjeta de credito</option>
          </select>
          <input id="filtroFecha" type="date" aria-label="Fecha" />
          <button class="btn btn-ghost" id="btnLimpiar" type="button">Limpiar</button>
          <button class="btn btn-yellow" id="btnReporte" type="button">Actualizar</button>
        </div>
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>Boleta</th><th>Fecha</th><th>Cliente</th><th>Ítems</th><th>Pago</th><th>Atendió</th><th>Total</th></tr></thead>
            <tbody id="salesList"></tbody>
          </table>
        </div>
      </div>
    </section>

    <footer>© 2026 RestauranteLatina — FastFood • Responsive móvil / tablet / PC</footer>
  </main>

  <button class="cart-fab" id="cartFab" data-go="pedido" data-show="cliente" type="button">🧾 <span id="fabCount">0</span> • <span id="fabTotal">S/ 0.00</span></button>

  <nav class="bottom-nav">
    <a href="#menu" data-go="menu" data-show="cliente">🍔<small>Menú</small></a>
    <a href="#pedido" data-go="pedido" data-show="cliente">🧾<small>Pedido</small></a>
    <a href="#mispedidos" data-go="mispedidos" data-show="cliente">📦<small>Mis pedidos</small></a>
    <a href="#pedidos" data-go="pedidos" data-show="staff">🔔<small>Clientes</small></a>
    <a href="#boleta" data-go="boleta" data-show="staff">🎫<small>Boleta</small></a>
    <a href="#ventas" data-go="ventas" data-show="admin">📊<small>Ventas</small></a>
  </nav>
</div>

<div class="toast" id="toast"></div>
`);

/* ================================================================
 * PARTE 3. INTERFAZ
 * Aquí solo se dibuja lo que responde C (logica.c).
 * Cada "C.algo()" es una función escrita en C.
 * ================================================================ */
cargarLogicaC().then(iniciarApp).catch(err=>{
  document.body.insertAdjacentHTML("afterbegin",
    `<p style="background:#D62828;color:#fff;padding:1rem;text-align:center;font-weight:bold">
     No se pudo cargar la lógica en C. Verifica que diseno.js esté completo y junto a index.html.</p>`);
  console.error(err);
});

function iniciarApp(C){

/* ---------- Textos que se muestran según la respuesta de C ---------- */
const METODOS = ["Efectivo","Tarjeta","Yape","Tarjeta de credito"];
const ESTADOS = ["pendiente","cobrado","anulado"];
const ESTADO_TXT = ["⏳ Pendiente","✅ Cobrado","✖ Anulado"];
const MSG_CARRITO = {1:"Cantidad inválida.", 2:"Ese producto no existe.", 3:"Stock insuficiente.",
                     4:"Tu pedido llegó al máximo de 20 productos distintos.", 5:"Pedido vacío."};
const MSG_REGISTRO = {1:"Escribe tu nombre completo.", 2:"El DNI debe tener 8 dígitos.",
                      3:"Escribe un correo válido (ejemplo: nombre@correo.com).", 4:"La contraseña debe tener entre 6 y 40 caracteres.",
                      5:"Las contraseñas no coinciden.", 6:"Ese DNI ya está registrado. Inicia sesión.",
                      7:"No hay espacio para más clientes."};
const MSG_LOGIN = {1:"El DNI debe tener 8 dígitos.", 2:"Ese DNI no está registrado. Pulsa \"Regístrate aquí\".",
                   3:"Contraseña incorrecta."};
const MSG_PEDIDO = {"-3":"Ya no hay stock suficiente de un producto. Revisa tu pedido.", "-4":"No hay espacio para más pedidos.",
                    "-5":"Pedido vacío.", "-6":"Tu cuenta no existe. Vuelve a iniciar sesión."};
const MSG_COBRO = {"-1":"Ese pedido no existe.", "-2":"Ese pedido ya fue atendido.", "-4":"No hay espacio para más boletas."};

// Catálogo que viene de C
const catalogo = [];
for(let i=0; i<C.prod_total(); i++){
  const id = C.prod_id(i);
  catalogo.push({id, nombre:C.texto(C.prod_nombre(id)), emoji:C.texto(C.prod_emoji(id)), precio:C.prod_precio(id)});
}
const producto = id => catalogo.find(p=>p.id===id);

const VISTAS = {
  menu:       {titulo:"Menú",               sub:"Selecciona los productos y la cantidad"},
  pedido:     {titulo:"Pedido y pago",      sub:"Revisa el pedido, el total y el método de pago"},
  mispedidos: {titulo:"Mis pedidos",        sub:"Estado de los pedidos que enviaste a caja"},
  pedidos:    {titulo:"Pedidos de clientes",sub:"Pedidos enviados por los clientes, listos para cobrar"},
  boleta:     {titulo:"Boleta digital",     sub:"Comprobante de la venta"},
  ventas:     {titulo:"Ventas y pagos",     sub:"Resumen de boletas emitidas"}
};
const PASOS = [["menu","Menú"],["pedido","Pedido"],["pago","Pago"],["mispedidos","Enviado a caja"]];

let sesion = JSON.parse(sessionStorage.getItem("rl_sesion") || "null");
let vistaActual = "menu";

/* ---------- Ayudas para mostrar ---------- */
const $ = id => document.getElementById(id);
const soles = c => "S/ " + (c/100).toFixed(2);              // céntimos -> texto
const aCentimos = txt => Math.round(parseFloat(String(txt).replace(",", ".")) * 100);
const numBoleta = n => "B001-" + String(n).padStart(6,"0");
const numPedido = n => "P-" + String(n).padStart(4,"0");
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dos = n => String(n).padStart(2,"0");
const hoy = () => { const d=new Date(); return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate(); };   // AAAAMMDD
const ahora = () => { const d=new Date(); return d.getHours()*10000 + d.getMinutes()*100 + d.getSeconds(); };  // HHMMSS
const verDia = n => dos(n%100) + "/" + dos(Math.floor(n/100)%100) + "/" + Math.floor(n/10000);
const verHora = n => dos(Math.floor(n/10000)) + ":" + dos(Math.floor(n/100)%100);
const esCliente = () => sesion && sesion.rol==="cliente";
const esStaff = () => sesion && sesion.rol!=="cliente";
const esAdmin = () => sesion && sesion.rol==="admin";

function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove("show"), 2600);
}
function deviceHint(){
  const w = window.innerWidth;
  $("deviceHint").textContent = w <= 700 ? "📱 Modo celular" : w <= 1024 ? "📟 Modo tablet" : "🖥️ Modo PC";
}
window.addEventListener("resize", deviceHint);

/* ---------- Copia de la base de datos de C en el navegador ----------
 * C guarda clientes, pedidos, ventas y stock en su memoria. Para no perderlos
 * al cerrar la página, se guarda una copia de esa memoria tal cual (sin leerla). */
const CLAVE_BASE = "rl_base_c";
let ultimaBase = null;
function memoriaBase(){ return new Uint8Array(C.memory.buffer, C.base_datos(), C.base_tam()); }
function guardarBase(){
  const b = memoriaBase(); let s = "";
  for(let i=0; i<b.length; i+=0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i+0x8000));
  ultimaBase = btoa(s);
  try{ localStorage.setItem(CLAVE_BASE, ultimaBase); }catch(e){ toast("No se pudo guardar en este navegador."); }
}
function cargarBase(){
  const t = localStorage.getItem(CLAVE_BASE);
  if(t){
    const bin = atob(t);
    if(bin.length===C.base_tam()){
      const b = memoriaBase();
      for(let i=0; i<bin.length; i++) b[i] = bin.charCodeAt(i);
      if(C.base_valida()){ ultimaBase = t; return; }
    }
  }
  C.base_iniciar(); guardarBase();
}

/* ---------- Pantallas de acceso ---------- */
const FORMS = {inicio:"inicioAcceso", cliente:"clienteForm", registro:"registroForm", cajero:"loginForm"};
function mostrarTab(tab){
  Object.entries(FORMS).forEach(([k,id])=>{ $(id).hidden = k!==tab; });
  document.querySelectorAll(".login-form .error-msg").forEach(m=>m.hidden=true);
  const f = $(FORMS[tab]).querySelector("input"); if(f) f.focus();
}
document.querySelectorAll(".ojo").forEach(b=>b.addEventListener("click",()=>{
  const inp = b.parentElement.querySelector("input"), ver = inp.type==="password";
  inp.type = ver ? "text" : "password";
  b.querySelector("use").setAttribute("href", ver ? "#i-eye-off" : "#i-eye");
  b.setAttribute("aria-label", ver ? "Ocultar contraseña" : "Mostrar contraseña");
}));
document.querySelectorAll("[data-tab-link]").forEach(a=>a.addEventListener("click", e=>{ e.preventDefault(); mostrarTab(a.dataset.tabLink); }));
function error(id, msg){ $(id).textContent = msg; $(id).hidden = false; }
function iniciar(s, msg){
  sesion = s; sessionStorage.setItem("rl_sesion", JSON.stringify(s));
  aplicarRol(); go(inicio()); toast(msg);
}
function entrarCliente(dni, msg){
  C.escribir(0, dni);
  const nombre = C.texto(C.cliente_nombre());
  iniciar({user:dni, rol:"cliente", nombre, dni}, msg + nombre + "!");
}

// Registro: C valida y guarda al cliente
$("registroForm").addEventListener("submit", e=>{
  e.preventDefault();
  cargarBase();
  const dni = $("regDni").value.trim();
  C.escribir(0, dni); C.escribir(1, $("regNombre").value.trim()); C.escribir(2, $("regCorreo").value.trim());
  C.escribir(3, $("regPass").value); C.escribir(4, $("regPass2").value);
  const r = C.cliente_registrar();
  if(r) return error("regMsg", MSG_REGISTRO[r]);
  guardarBase();
  e.target.reset(); $("regMsg").hidden = true;
  entrarCliente(dni, "Cuenta creada. ¡Bienvenido ");
});
// Ingreso de cliente: C busca el DNI y compara la contraseña
$("clienteForm").addEventListener("submit", e=>{
  e.preventDefault();
  cargarBase();
  const dni = $("cliDni").value.trim();
  C.escribir(0, dni); C.escribir(1, $("cliPass").value);
  const r = C.cliente_login();
  if(r) return error("cliMsg", MSG_LOGIN[r]);
  $("cliMsg").hidden = true; e.target.reset();
  entrarCliente(dni, "¡Bienvenido ");
});
// Ingreso de empleado: los empleados están en C
$("loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  C.escribir(0, $("loginUser").value.trim()); C.escribir(1, $("loginPass").value);
  const rol = C.login_cajero();
  if(!rol) return error("loginMsg", "Usuario o contraseña incorrectos.");
  const nombre = C.texto(C.cajero_nombre()), user = C.texto(C.cajero_usuario());
  $("loginMsg").hidden = true; e.target.reset();
  iniciar({user, rol: rol===2 ? "admin" : "empleado", nombre}, "Caja abierta: " + nombre + ".");
});
$("btnLogout").addEventListener("click", ()=>{
  C.carrito_vaciar(); $("payBox").hidden = true;
  sesion = null; sessionStorage.removeItem("rl_sesion");
  aplicarRol(); mostrarTab("inicio"); sync(); toast("Sesión cerrada.");
});

/* ---------- Navegación entre pantallas ---------- */
const inicio = () => esCliente() ? "menu" : "pedidos";
function puedeVer(name){
  if(!sesion) return false;
  if(name==="ventas") return esAdmin();
  if(name==="pedidos") return esStaff();
  if(["menu","pedido","mispedidos"].includes(name)) return esCliente();
  return true;
}
function go(name){
  if(!puedeVer(name)){ toast(sesion ? "No tienes acceso a esta sección." : "Primero inicia sesión."); return; }
  vistaActual = name;
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active", s.id===name));
  document.querySelectorAll(".nav-btn, .bottom-nav a").forEach(a=>a.classList.toggle("active", a.dataset.go===name));
  const pagando = name==="pedido" && !$("payBox").hidden;
  document.querySelectorAll("#stepsBar li").forEach(li=>li.classList.toggle("active",
    li.dataset.step===name || (pagando && li.dataset.step==="pago")));
  $("stepsBar").hidden = !esCliente() || name==="boleta";
  $("viewTitle").textContent = VISTAS[name].titulo;
  $("viewSubtitle").textContent = VISTAS[name].sub;
  if(name==="ventas") renderVentas();
  if(name==="pedidos") renderCola();
  if(name==="mispedidos") renderMisPedidos();
  window.scrollTo({top:0, behavior:"smooth"});
}
function aplicarRol(){
  document.querySelectorAll("[data-show]").forEach(el=>{
    const r = el.dataset.show;
    const ver = r==="cliente" ? esCliente() : r==="staff" ? esStaff() : r==="admin" ? esAdmin() : true;
    el.style.display = ver ? "" : "none";
  });
  $("login-screen").hidden = !!sesion;
  $("app").hidden = !sesion;
  if(!sesion) return;
  $("userName").textContent = sesion.nombre;
  $("userRole").textContent = esCliente() ? "Cliente • DNI " + sesion.dni : esAdmin() ? "Administrador • caja + ventas" : "Cajero • caja";
  $("hola").textContent = sesion.nombre;
  $("stepsBar").innerHTML = PASOS.map(([k,t],i)=>`<li data-step="${k}"><b>${i+1}</b> ${t}</li>`).join("");
  document.querySelectorAll("#stepsBar li").forEach(li=>li.addEventListener("click", ()=>{
    if(li.dataset.step==="pago") $("btnFinalizar").click(); else go(li.dataset.step);
  }));
  actualizarBadges();
}
document.querySelectorAll("[data-go]").forEach(a=>a.addEventListener("click", e=>{
  e.preventDefault(); go(a.dataset.go);
}));

/* ---------- Menú ---------- */
function renderMenu(){
  const g = $("menuGrid"), sel = $("selProd"), actual = sel.value;
  g.innerHTML = ""; sel.innerHTML = "";
  catalogo.forEach(p=>{
    const disp = C.disponible(p.id);
    const d = document.createElement("div");
    d.className = "prod" + (disp<=0 ? " out" : "") + (String(p.id)===actual ? " sel" : "");
    d.innerHTML = `<div class="em">${p.emoji}</div><h4>${p.nombre}</h4><p class="price">${soles(p.precio)}</p>
      <small class="${disp<=5?"low":""}">${disp<=0 ? "Agotado" : "Stock: " + disp}</small>
      <button class="btn btn-red" data-id="${p.id}" type="button">Seleccionar</button>`;
    g.appendChild(d);
    const o = document.createElement("option");
    o.value = p.id; o.textContent = `${p.emoji} ${p.nombre} — ${soles(p.precio)}`;
    sel.appendChild(o);
  });
  if(actual) sel.value = actual;
  $("menuCount").textContent = catalogo.length + " productos";
  g.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    $("selProd").value = b.dataset.id; renderMenu();
    toast("Seleccionado. Ajusta cantidad y pulsa Agregar.");
  }));
}
$("selProd").addEventListener("change", renderMenu);
$("qtyPlus").addEventListener("click",()=>{ $("inpCant").value = (+$("inpCant").value||1)+1; });
$("qtyMinus").addEventListener("click",()=>{ $("inpCant").value = Math.max(1, (+$("inpCant").value||1)-1); });
$("btnAdd").addEventListener("click",()=>{
  const id = +$("selProd").value, cant = Math.floor(+$("inpCant").value) || 0;
  const r = C.carrito_agregar(id, cant);
  if(r) return toast(MSG_CARRITO[r]);
  $("inpCant").value = 1; sync();
  toast(`Agregado ${producto(id).nombre} x${cant}. ¿Otro? Sigue aquí o ve a Pedido.`);
});

/* ---------- Pedido (el carrito vive en C) ---------- */
function itemsCarrito(){
  const items = [];
  for(let i=0; i<C.carrito_items(); i++){
    const p = producto(C.carrito_id(i));
    items.push({nombre:p.nombre, precio:p.precio, cantidad:C.carrito_cantidad(i)});
  }
  return items;
}
function totalesCarrito(){
  C.calcular_carrito();
  return {cant:C.total_cantidad(), sub:C.total_subtotal(), igv:C.total_igv(), tot:C.total_pagar()};
}
function renderCarrito(){
  const items = itemsCarrito();
  $("cartBody").innerHTML = items.map((it,idx)=>`<tr><td>${it.nombre}</td>
    <td><input type="number" min="1" value="${it.cantidad}" data-idx="${idx}"/></td>
    <td class="num">${soles(it.precio)}</td><td class="num"><b>${soles(C.importe(it.precio,it.cantidad))}</b></td>
    <td><button class="del" data-del="${idx}" aria-label="Quitar" type="button">❌</button></td></tr>`).join("");
  $("cartCards").innerHTML = items.map((it,idx)=>`<div class="cart-card">
    <div><b>${it.nombre}</b><br><small>${soles(it.precio)} c/u = ${soles(C.importe(it.precio,it.cantidad))}</small></div>
    <div><input type="number" min="1" value="${it.cantidad}" data-idx="${idx}"/> <button class="del" data-del="${idx}" type="button">❌</button></div></div>`).join("");

  document.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{
    C.carrito_quitar(+b.dataset.del); sync(); toast("Artículo eliminado.");
  }));
  document.querySelectorAll("#cartBody input,#cartCards input").forEach(inp=>inp.addEventListener("change",()=>{
    const r = C.carrito_cambiar(+inp.dataset.idx, Math.floor(+inp.value) || 0);
    if(r) toast(MSG_CARRITO[r]);
    sync();
  }));

  const vacio = !items.length;
  $("cartEmpty").hidden = !vacio;
  document.querySelector("#pedido .table-wrap").style.visibility = vacio ? "hidden" : "";
  if(vacio) $("payBox").hidden = true;
  $("miniCart").innerHTML = vacio ? `<li class="vacio">Aún no agregas productos</li>`
    : items.map(i=>`<li><span>${i.cantidad} × ${i.nombre}</span><b>${soles(C.importe(i.precio,i.cantidad))}</b></li>`).join("");

  const t = totalesCarrito();
  $("miniCount").textContent = vacio ? "vacío" : t.cant + " und.";
  $("tCant").textContent = t.cant;
  $("tSub").textContent = soles(t.sub);
  $("tIgv").textContent = soles(t.igv);
  $("tTot").textContent = soles(t.tot);
  $("liveTotal").textContent = soles(t.tot);
  $("liveCount").textContent = t.cant + " productos";
  $("fabCount").textContent = t.cant;
  $("fabTotal").textContent = soles(t.tot);
  $("navCount").textContent = t.cant;
}
function sync(){ renderMenu(); renderCarrito(); actualizarYapeQR(); }
$("btnSeguir").addEventListener("click",()=>go("menu"));

/* ---------- Pago (QR Yape solo al elegir Yape) ---------- */
const YAPE_NUMERO = "999888777";
function metodoActual(){
  const r = document.querySelector('input[name="pay"]:checked');
  return METODOS.indexOf(r ? r.value : "Efectivo");
}
function actualizarYapeQR(){
  const esYape = METODOS[metodoActual()]==="Yape" && !$("payBox").hidden;
  $("yapeBox").hidden = !esYape;
  if(!esYape) return;
  const t = totalesCarrito();
  $("qrMonto").textContent = "Total a pagar: " + soles(t.tot);
  const data = "YAPE|RestauranteLatina|" + YAPE_NUMERO + "|S/" + (t.tot/100).toFixed(2);
  $("qrImg").src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(data);
}
document.querySelectorAll('input[name="pay"]').forEach(r=>r.addEventListener("change", actualizarYapeQR));
$("btnFinalizar").addEventListener("click",()=>{
  if(!C.carrito_items()) return toast(MSG_CARRITO[5]);
  $("payBox").hidden = false;
  go("pedido");
  actualizarYapeQR();
  $("payBox").scrollIntoView({behavior:"smooth", block:"center"});
  toast("Total calculado. Elige método de pago.");
});

/* ---------- Cliente: enviar pedido a caja (C lo crea) ---------- */
$("btnPagar").addEventListener("click", ()=>{
  cargarBase();
  C.escribir(0, sesion.dni);
  const id = C.pedido_crear(metodoActual(), hoy(), ahora());
  if(id < 0){ sync(); return toast(MSG_PEDIDO[id]); }
  guardarBase();
  $("payBox").hidden = true;
  sync(); actualizarBadges(); go("mispedidos");
  toast("📤 Pedido " + numPedido(id) + " enviado a caja.");
});
function renderMisPedidos(){
  if(!esCliente()) return;
  C.escribir(0, sesion.dni); C.lista_cliente();
  const html = [];
  for(let k=0; k<C.lista_n(); k++) html.push(tarjetaPedido(C.lista_item(k), "cliente"));
  $("misPedidos").innerHTML = html.length ? html.join("")
    : `<div class="card empty muted">Aún no envías pedidos. Ve al <b>Menú</b> para empezar.</div>`;
}

/* ---------- Tarjeta de un pedido (datos leídos de C) ---------- */
function tarjetaPedido(i, modo, nuevo){
  const id = C.ped_id(i), estado = C.ped_estado(i), clase = ESTADOS[estado];
  const metodo = METODOS[C.ped_metodo(i)], atendio = C.texto(C.ped_atendio(i));
  const items = [];
  for(let k=0; k<C.ped_items(i); k++){
    const p = producto(C.ped_item_id(i,k)), cant = C.ped_item_cantidad(i,k);
    items.push(`<li><span>${cant} × ${p.nombre}</span><span>${soles(C.importe(C.ped_item_precio(i,k), cant))}</span></li>`);
  }
  let acciones = "";
  if(modo==="cajero" && C.puede_cobrar(estado)){
    acciones = `<div class="order-actions">
      <select data-met="${id}" aria-label="Método de pago">${METODOS.map((m,n)=>`<option value="${n}" ${m===metodo?"selected":""}>${m}</option>`).join("")}</select>
      <input data-rec="${id}" type="number" min="0" step="0.10" placeholder="Efectivo recibido (S/)" aria-label="Efectivo recibido" />
      <button class="btn btn-red" data-cobrar="${id}" type="button">Cobrar y generar boleta</button>
      <button class="btn btn-ghost" data-anular="${id}" type="button">Anular</button></div>`;
  } else if(modo==="cliente" && C.puede_anular(estado)){
    acciones = `<p class="muted">Acércate a caja para pagar. Te avisaremos cuando se cobre.</p>
      <div class="order-actions"><button class="btn btn-ghost" data-anular="${id}" type="button">Cancelar pedido</button></div>`;
  } else if(C.ped_boleta(i)){
    acciones = `<div class="order-actions"><button class="btn btn-dark" data-verbol="${C.ped_boleta(i)}" type="button">🎫 Ver boleta ${numBoleta(C.ped_boleta(i))}</button></div>`;
  }
  return `<div class="order ${clase} ${nuevo?"nuevo":""}">
    <div class="order-head"><b>${numPedido(id)}</b><span class="st ${clase}">${ESTADO_TXT[estado]}</span></div>
    <div class="order-cli">👤 <b>${esc(C.texto(C.ped_cliente(i)))}</b> <small>• DNI ${esc(C.texto(C.ped_dni(i)))} • ${verHora(C.ped_hora(i))}</small><br>
      <small>Pago elegido: ${metodo}${atendio ? " • Atendió: " + esc(atendio) : ""}</small></div>
    <ul>${items.join("")}</ul>
    <div class="order-tot"><span>Total (${C.ped_cant(i)} und.)</span><span>${soles(C.ped_tot(i))}</span></div>
    ${acciones}</div>`;
}

/* ---------- Cajero: pedidos por cobrar ---------- */
let vistosCola = null;
function renderCola(){
  if(!esStaff()) return [];
  C.lista_pendientes();
  const pend = [];
  for(let k=0; k<C.lista_n(); k++) pend.push(C.lista_item(k));
  const ids = pend.map(i=>C.ped_id(i));
  const nuevos = vistosCola ? pend.filter((i,n)=>!vistosCola.has(ids[n])) : [];
  vistosCola = new Set(ids);
  $("colaPedidos").innerHTML = pend.length ? pend.map(i=>tarjetaPedido(i,"cajero",nuevos.includes(i))).join("")
    : `<p class="empty muted">No hay pedidos pendientes. Cuando un cliente envíe uno aparecerá aquí.</p>`;

  C.resumen_dia(hoy());
  $("sPend").textContent = pend.length;
  $("sCob").textContent = C.dia_cobrados();
  $("sCobTot").textContent = soles(C.dia_total());
  $("sAnul").textContent = C.dia_anulados();
  const filas = [];
  for(let k=0; k<C.lista_n(); k++){
    const i = C.lista_item(k), est = C.ped_estado(i), bol = C.ped_boleta(i);
    filas.push(`<tr><td><b>${numPedido(C.ped_id(i))}</b></td><td>${verHora(C.ped_hora(i))}</td>
      <td>${esc(C.texto(C.ped_cliente(i)))}<br><small class="muted">${esc(C.texto(C.ped_dni(i)))}</small></td>
      <td><span class="st ${ESTADOS[est]}">${ESTADO_TXT[est]}</span></td><td>${bol ? numBoleta(bol) : "—"}</td>
      <td>${esc(C.texto(C.ped_atendio(i)) || "-")}</td><td class="num"><b>${soles(C.ped_tot(i))}</b></td></tr>`);
  }
  $("atendidos").innerHTML = filas.length ? filas.join("")
    : `<tr><td colspan="7" class="empty muted">Todavía no se atienden pedidos hoy.</td></tr>`;
  return nuevos.map(i=>({id:numPedido(C.ped_id(i)), cliente:C.texto(C.ped_cliente(i))}));
}
function cobrarPedido(id){
  cargarBase();
  const metodo = +document.querySelector(`[data-met="${id}"]`).value;
  let recibido = 0;
  if(METODOS[metodo]==="Efectivo"){
    const txt = document.querySelector(`[data-rec="${id}"]`).value;
    if(txt==="") return toast("Ingresa el efectivo recibido del cliente.");
    recibido = aCentimos(txt);
  }
  C.escribir(0, sesion.user);
  const num = C.pedido_cobrar(id, metodo, recibido, hoy(), ahora());     // C valida, calcula vuelto y crea la boleta
  if(num===-3){
    const i = C.pedido_buscar(id);
    return toast("Falta " + soles(C.ped_tot(i) - recibido) + " para completar el pago.");
  }
  if(num < 0){ toast(MSG_COBRO[num]); refrescar(); return; }
  guardarBase();
  mostrarBoleta(C.venta_buscar(num)); actualizarBadges(); go("boleta");
  toast("✅ " + numPedido(id) + " cobrado — " + numBoleta(num));
}
function anularPedido(id){
  cargarBase();
  C.escribir(0, esCliente() ? sesion.dni : sesion.user);
  const r = C.pedido_anular(id, esCliente() ? 1 : 0);                 // C valida y devuelve el stock
  if(r < 0){ refrescar(); return; }
  guardarBase(); sync(); refrescar();
  toast(numPedido(id) + (esCliente() ? " cancelado." : " anulado."));
}
document.addEventListener("click", e=>{
  const b = e.target.closest("[data-cobrar],[data-anular],[data-verbol]");
  if(!b) return;
  if(b.dataset.cobrar) cobrarPedido(+b.dataset.cobrar);
  else if(b.dataset.anular) anularPedido(+b.dataset.anular);
  else { const v = C.venta_buscar(+b.dataset.verbol); if(v>=0){ mostrarBoleta(v); go("boleta"); } }
});

/* ---------- Boleta (datos leídos de C) ---------- */
function mostrarBoleta(v){
  const i = C.ven_pedido(v);
  $("bEmpty").hidden = true; $("bContent").hidden = false;
  $("bNum").textContent = numBoleta(C.ven_num(v));
  $("bFecha").textContent = verDia(C.ven_dia(v)) + " " + verHora(C.ven_hora(v));
  $("bPed").textContent = numPedido(C.ped_id(i));
  $("bCli").textContent = C.texto(C.ped_cliente(i));
  $("bDni").textContent = C.texto(C.ped_dni(i));
  $("bVend").textContent = C.texto(C.ven_vendedor(v));
  $("bPago").textContent = METODOS[C.ven_metodo(v)];
  const filas = [];
  for(let k=0; k<C.ped_items(i); k++){
    const p = producto(C.ped_item_id(i,k)), cant = C.ped_item_cantidad(i,k), pu = C.ped_item_precio(i,k);
    filas.push(`<tr><td>${cant}</td><td>${p.nombre}</td><td class="num">${(pu/100).toFixed(2)}</td>
      <td class="num">${(C.importe(pu,cant)/100).toFixed(2)}</td></tr>`);
  }
  $("bItems").innerHTML = filas.join("");
  $("bCant").textContent = C.ped_cant(i);
  $("bSub").textContent = soles(C.ped_sub(i));
  $("bIgv").textContent = soles(C.ped_igv(i));
  $("bTot").textContent = soles(C.ped_tot(i));
  const efectivo = C.ven_recibido(v) > 0;
  $("bRecRow").hidden = $("bVueRow").hidden = !efectivo;
  if(efectivo){ $("bRec").textContent = soles(C.ven_recibido(v)); $("bVue").textContent = soles(C.ven_vuelto(v)); }
}
$("btnPrint").addEventListener("click", () => window.print());

/* ---------- Ventas (solo admin): C arma el reporte ---------- */
function renderVentas(){
  const f = $("filtroPago").value, fecha = $("filtroFecha").value;
  C.reporte_calcular(f==="todos" ? -1 : METODOS.indexOf(f), fecha ? +fecha.replaceAll("-","") : 0);

  $("dayTotal").textContent = soles(C.reporte_total());
  $("statCount").textContent = C.reporte_boletas() + " boletas";
  $("statAvg").textContent = soles(C.reporte_promedio());
  $("statItems").textContent = C.reporte_unidades();
  $("statIgv").textContent = soles(C.reporte_igv());

  const por = METODOS.map((m,n)=>[m, C.reporte_metodo(n)]);
  const max = Math.max(...por.map(x=>x[1]), 1);
  $("salesSummary").innerHTML = por.map(([k,v])=>`<div class="bar"><span class="lbl">${k}</span>
    <div class="track"><div class="fill" style="width:${v/max*100}%"></div></div><span class="val">${soles(v)}</span></div>`).join("");

  const filas = [];
  for(let k=0; k<C.lista_n(); k++){
    const v = C.lista_item(k), i = C.ven_pedido(v);
    filas.push(`<tr><td><b>${numBoleta(C.ven_num(v))}</b><br><small class="muted">${numPedido(C.ped_id(i))}</small></td>
      <td>${verDia(C.ven_dia(v))} ${verHora(C.ven_hora(v))}</td>
      <td>${esc(C.texto(C.ped_cliente(i)))}<br><small class="muted">${esc(C.texto(C.ped_dni(i)))}</small></td>
      <td>${C.ped_cant(i)}</td><td><span class="tag">${METODOS[C.ven_metodo(v)]}</span></td>
      <td>${esc(C.texto(C.ven_vendedor(v)))}</td><td class="num"><b>${soles(C.ped_tot(i))}</b></td></tr>`);
  }
  $("salesList").innerHTML = filas.length ? filas.join("")
    : `<tr><td colspan="7" class="empty muted">No hay ventas con estos filtros.</td></tr>`;
}
$("btnReporte").addEventListener("click",()=>{renderVentas(); toast("Reporte actualizado.");});
$("filtroPago").addEventListener("change",renderVentas);
$("filtroFecha").addEventListener("change",renderVentas);
$("btnLimpiar").addEventListener("click",()=>{ $("filtroPago").value="todos"; $("filtroFecha").value=""; renderVentas(); });

/* ---------- Avisos entre pestañas (cliente ↔ cajero) ---------- */
function actualizarBadges(){
  const pend = C.pendientes(0);
  $("navPend").textContent = pend;
  $("navPend").classList.toggle("zero", pend===0);
  if(esCliente()){ C.escribir(0, sesion.dni); $("navMis").textContent = C.pendientes(1); }
}
function refrescar(){
  if(!sesion) return [];
  const nuevos = renderCola();
  renderMisPedidos(); actualizarBadges();
  if(vistaActual==="ventas") renderVentas();
  return nuevos;
}
function estadosCliente(){
  const m = {};
  if(!esCliente()) return m;
  C.escribir(0, sesion.dni); C.lista_cliente();
  for(let k=0; k<C.lista_n(); k++){ const i = C.lista_item(k); m[C.ped_id(i)] = {estado:C.ped_estado(i), atendio:C.texto(C.ped_atendio(i))}; }
  return m;
}
function revisarCambios(){
  const t = localStorage.getItem(CLAVE_BASE);
  if(!t || t===ultimaBase) return;
  const antes = estadosCliente();
  cargarBase(); renderMenu();
  const nuevos = refrescar();
  if(esStaff() && nuevos.length) toast("🔔 Nuevo pedido " + nuevos[0].id + " de " + nuevos[0].cliente);
  const despues = estadosCliente();
  Object.entries(despues).forEach(([id,p])=>{
    const a = antes[id]; if(!a || a.estado!==0) return;
    if(p.estado===1) toast("✅ Tu pedido " + numPedido(+id) + " fue cobrado. Ya puedes ver tu boleta.");
    if(p.estado===2 && p.atendio!=="cliente") toast("Tu pedido " + numPedido(+id) + " fue anulado por caja.");
  });
}
window.addEventListener("storage", revisarCambios);
setInterval(revisarCambios, 2000);

/* ---------- Inicio ---------- */
$("todayLabel").textContent = "📅 " + new Date().toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long"});
cargarBase(); deviceHint(); sync(); aplicarRol();
if(sesion){ renderCola(); go(inicio()); }
}

/* ================================================================
 * PARTE 4. CONEXIÓN CON LA LÓGICA EN C
 * El navegador no puede leer un archivo .c directamente, así que
 * logica.c se compila a WebAssembly y se guarda aquí abajo (en base64).
 * Si se modifica logica.c, hay que volver a compilarlo y reemplazar
 * el texto de LOGICA_C_COMPILADA.
 * ================================================================ */
function cargarLogicaC(){
  const LOGICA_C_COMPILADA =
    "AGFzbQEAAAABLAhgAX8Bf2AAAX9gAABgAn9/AX9gAX8AYAN/f38Bf2AFf39/f38Bf2ACf38AA1RTAAEBAAAAAAEBAQIAAAMDBAIBAAACAwEBAQEDAQEAAQEBAQEAAAAFBgMAAAAAAAAAAAAAAAAAAAMDAwAAAAAAAAAAAAEAAgIABAEBAQcAAQEBAQEFAwEAAwYIAX8BQYDAAAsHpAlTBm1lbW9yeQIAD19fc3RhY2tfcG9pbnRlcgMAB2Nhc2lsbGEAAAtjYXNpbGxhX3RhbQABCnByb2RfdG90YWwAAgdwcm9kX2lkAAMLcHJvZF9ub21icmUABApwcm9kX2Vtb2ppAAULcHJvZF9wcmVjaW8ABgpiYXNlX2RhdG9zAAcIYmFzZV90YW0ACAtiYXNlX3ZhbGlkYQAJDGJhc2VfaW5pY2lhcgAKCHN0b2NrX2RlAAsKZGlzcG9uaWJsZQAMD2NhcnJpdG9fYWdyZWdhcgAND2NhcnJpdG9fY2FtYmlhcgAODmNhcnJpdG9fcXVpdGFyAA8OY2Fycml0b192YWNpYXIAEA1jYXJyaXRvX2l0ZW1zABEKY2Fycml0b19pZAASEGNhcnJpdG9fY2FudGlkYWQAExBjYWxjdWxhcl9jYXJyaXRvABQHaW1wb3J0ZQAVDnRvdGFsX2NhbnRpZGFkABYOdG90YWxfc3VidG90YWwAFwl0b3RhbF9pZ3YAGAt0b3RhbF9wYWdhcgAZD2NhbGN1bGFyX3Z1ZWx0bwAaEWNsaWVudGVfcmVnaXN0cmFyABsNY2xpZW50ZV9sb2dpbgAeDmNsaWVudGVfbm9tYnJlAB8MbG9naW5fY2FqZXJvACANY2FqZXJvX25vbWJyZQAhDmNhamVyb191c3VhcmlvACINcGVkaWRvX2J1c2NhcgAjDHB1ZWRlX2NvYnJhcgAkDHB1ZWRlX2FudWxhcgAlDHBlZGlkb19jcmVhcgAmDXBlZGlkb19jb2JyYXIAJw1wZWRpZG9fYW51bGFyACgGcGVkX2lkACkHcGVkX2RuaQAqC3BlZF9jbGllbnRlACsHcGVkX2RpYQAsCHBlZF9ob3JhAC0KcGVkX21ldG9kbwAuCnBlZF9lc3RhZG8ALwpwZWRfYm9sZXRhADALcGVkX2F0ZW5kaW8AMQhwZWRfY2FudAAyB3BlZF9zdWIAMwdwZWRfaWd2ADQHcGVkX3RvdAA1CXBlZF9pdGVtcwA2C3BlZF9pdGVtX2lkADcRcGVkX2l0ZW1fY2FudGlkYWQAOA9wZWRfaXRlbV9wcmVjaW8AOQx2ZW50YV9idXNjYXIAOgd2ZW5fbnVtADsKdmVuX3BlZGlkbwA8B3Zlbl9kaWEAPQh2ZW5faG9yYQA+CnZlbl9tZXRvZG8APwx2ZW5fcmVjaWJpZG8AQAp2ZW5fdnVlbHRvAEEMdmVuX3ZlbmRlZG9yAEIHbGlzdGFfbgBDCmxpc3RhX2l0ZW0ARBBsaXN0YV9wZW5kaWVudGVzAEUNbGlzdGFfY2xpZW50ZQBGCnBlbmRpZW50ZXMARwtyZXN1bWVuX2RpYQBIDGRpYV9jb2JyYWRvcwBJCWRpYV90b3RhbABKDGRpYV9hbnVsYWRvcwBLEHJlcG9ydGVfY2FsY3VsYXIATA5yZXBvcnRlX21ldG9kbwBNDXJlcG9ydGVfdG90YWwATgtyZXBvcnRlX2lndgBPD3JlcG9ydGVfYm9sZXRhcwBQEHJlcG9ydGVfdW5pZGFkZXMAURByZXBvcnRlX3Byb21lZGlvAFIKiUFTFgAgAEEHdEHQw4CAAGpBACAAQQVJGwsFAEGAAQsEAEEICyIBAX9BACEBAkAgAEEHSw0AIABBFGwoAoDAgIAAIQELIAELPAEBf0HgfiEBAkADQCABQaDBgIAAaigCACAARg0BIAFBFGoiAQ0AC0Gcw4CAAA8LIAFBpMGAgABqKAIACzwBAX9B4H4hAQJAA0AgAUGgwYCAAGooAgAgAEYNASABQRRqIgENAAtBnMOAgAAPCyABQajBgIAAaigCAAs4AQF/QeB+IQECQANAIAFBoMGAgABqKAIAIABGDQEgAUEUaiIBDQALQQAPCyABQazBgIAAaigCAAsIAEHQyICAAAsGAEGolAkLDgBBACgC0MiAgABBAUYLcQECf0HY63YhAANAIABB+NyJgABqQQA6AAAgAEEBaiIADQALQQBBATYC0MiAgABBkMCAgAAhAEEEIQEDQCABQdDIgIAAaiAAKAIANgIAIABBFGohACABQQRqIgFBJEcNAAtBAEKBgICAEDcCgMmAgAALQAECf0HUyICAACEBQeB+IQICQANAIAJBoMGAgABqKAIAIABGDQEgAUEEaiEBIAJBFGoiAg0AC0EADwsgASgCAAuZAQEEf0HUyICAACEBQeB+IQICQAJAA0AgAkGgwYCAAGooAgAgAEYNASABQQRqIQEgAkEUaiICDQALQQAhAwwBCyABKAIAIQMLQQAhBAJAQQAoAvjciYAAIgFBAUgNAEGA3YmAACECAkADQCACKAIAIABGDQEgAkEMaiECIAFBf2oiAUUNAgwACwsgAkEEaigCACEECyADIARrC6sCAQN/QQEhAgJAIAFBAUgNAEHgfiECAkADQCACQaDBgIAAaigCACAARg0BIAJBFGoiAg0AC0ECDwsCQCABIAAQjICAgABMDQBBAw8LAkBBACgC+NyJgAAiA0EBSA0AQYDdiYAAIQIgAyEEAkACQANAIAIoAgAgAEYNASACQQxqIQIgBEF/aiIERQ0CDAALCyACQQRqIgIgAigCACABajYCAEEADwsgA0ETTA0AQQQPCyADQQxsIgJBhN2JgABqIAE2AgAgAkGA3YmAAGoiBCAANgIAQeB+IQICQAJAA0AgAkGgwYCAAGooAgAgAEYNASACQRRqIgINAAtBACECDAELIAJBrMGAgABqKAIAIQILIAQgAjYCCEEAIQJBACADQQFqNgL43ImAAAsgAguZAQEDf0ECIQICQAJAIABBAEgNACAAQQAoAvjciYAATg0AQQEhAiABQQFIDQAgAEEMbCIAQYDdiYAAaiEDIAAoAoDdiYAAIQRB1MiAgAAhAkHgfiEAAkADQCAAQaDBgIAAaigCACAERg0BIAJBBGohAiAAQRRqIgANAAwDCwsgASACKAIASg0BIAMgATYCBEEAIQILIAIPC0EDC3wBA38CQCAAQQBIDQAgAEEAKAL43ImAACIBTg0AAkAgACABQX9qIgJODQAgAEEMbEGA3YmAAGohAyAAQX9zIAFqIQADQCADIANBFGooAgA2AgggAyADQQxqIgEpAgA3AgAgASEDIABBf2oiAA0ACwtBACACNgL43ImAAAsLDQBBAEEANgL43ImAAAsLAEEAKAL43ImAAAswAQF/QQAhAQJAIABBAEgNACAAQQAoAvjciYAATg0AIABBDGwoAoDdiYAAIQELIAELMAEBf0EAIQECQCAAQQBIDQAgAEEAKAL43ImAAE4NACAAQQxsKAKE3YmAACEBCyABC6sBAQV/QQBBADYC9N6JgABBAEEANgLw3omAAEEAIQACQEEAKAL43ImAACIBQQFIDQBBACEAQYjdiYAAIQJBACEDA0AgAyACQXxqKAIAIgRqIQMgACACKAIAIARsaiEAIAJBDGohAiABQX9qIgENAAtBACAANgL03omAAEEAIAM2AvDeiYAAC0EAIABBEmxBMmpB5ABtIgI2AvjeiYAAQQAgAiAAajYC/N6JgAALBwAgASAAbAsLAEEAKALw3omAAAsLAEEAKAL03omAAAsLAEEAKAL43omAAAsLAEEAKAL83omAAAsPAEF/IAEgAGsgASAASBsLiggBB38CQBCcgICAAA0AQQIPC0F/IQADQCAAIgFBAWohACABQdHEgIAAai0AAA0AC0EAIQECQCAARQ0AA0AgAUHQxICAAGotAABBIEcNASAAIAFBAWoiAUcNAAsgACEBCwJAIAAgAU0NAANAIABBz8SAgABqLQAAQSBHDQEgAEF/aiIAIAFKDQALIAEhAAsCQCAAIAFrQQNODQBBAQ8LQQAhAANAIABB0MWAgABqIQEgAEEBaiICIQAgAS0AAA0AC0EDIQMCQCACQa5/akGwf0kNACACQX9qIQRBACEAQX8hAQNAAkACQCAAQdDFgIAAai0AACIFQcAARg0AIAVBIEcNAQwDCyABQX9KIQUgACEBIAUNAgsgBCAAQQFqIgBHDQALIAFBAUgNACABQQJqIAJGDQBBfyEFAkAgAUEBaiIGIARODQAgAkF+aiEEQX8hBQNAIAFBAWoiACAFIAFB0cWAgABqLQAAQS5GGyEFIAAhASAEIABHDQALCyAFIAZMDQAgBSACQX5qTg0AQX8hAANAIABB0caAgABqIQEgAEEBaiICIQAgAS0AAA0AC0EEIQMgAkEGSQ0AQX8hAANAIABB0caAgABqIQEgAEEBaiICIQAgAS0AAA0ACyACQShLDQBBACEFAkACQEEALQDQxoCAACIBDQBB0MeAgAAhAAwBC0HQx4CAACEAA0ACQCABQf8BcSAALQAARg0AIAEhBQwCCyAAQYF/aiEBIABBAWoiAiEAIAEtAAAiAQ0ACyACIQALAkAgBUH/AXEgAC0AAEYNAEEFDwsCQEHQw4CAABCdgICAAEF/TA0AQQYPC0EAIQACQEEAKAL0yICAACIEQccBTA0AQQcPC0EAIARBAWo2AvTIgIAAIARBwAFsQYjJgIAAaiECAkADQAJAIABB0MOAgABqLQAAIgENACAAIQEMAgsgAiAAaiABOgAAQQghASAAQQFqIgBBCEcNAAsLQQAhACACIAFqQQA6AAAgAkEJaiEDIARBwAFsQZHJgIAAaiEFAkADQAJAIABB0MSAgABqLQAAIgENACAAIQEMAgsgBSAAaiABOgAAQTwhASAAQQFqIgBBPEcNAAsLQQAhACADIAFqQQA6AAAgAkHGAGohAyAEQcABbEHOyYCAAGohBQJAA0ACQCAAQdDFgIAAai0AACIBDQAgACEBDAILIAUgAGogAToAAEHQACEBIABBAWoiAEHQAEcNAAsLQQAhACADIAFqQQA6AAAgAkGXAWohBSAEQcABbEGfyoCAAGohAgJAA0ACQCAAQdDGgIAAai0AACIBDQAgACEBDAILIAIgAGogAToAAEEoIQEgAEEBaiIAQShHDQALC0EAIQMgBSABakEAOgAACyADC3wBA39BdyEAA0AgAEHZw4CAAGohASAAQQFqIgIhACABLQAADQALAkACQCACDQACQEEALQDQw4CAACIADQBBAQ8LQdHDgIAAIQEDQCAAQUZqQf8BcUH1AU0NAUEBIQIgAS0AACEAIAFBAWohASAARQ0CDAALC0EAIQILIAILpgEBBn9BACEBAkBBACgC9MiAgAAiAkEBSA0AQYnJgIAAIQMDQAJAAkACQCABQcABbC0AiMmAgAAiBA0AIAAhBQwBCyADIQYgACEFA0AgBEH/AXEgBS0AAEcNAiAFQQFqIQUgBi0AACEEIAZBAWohBiAEDQALC0EAIQQLAkAgBEH/AXEgBS0AAEcNACABDwsgA0HAAWohAyABQQFqIgEgAkcNAAsLQX8LqQEBBH8CQBCcgICAAA0AQQEPC0EAIQACQEHQw4CAABCdgICAACIBQQBODQBBAg8LAkACQCABQcABbCIBLQCfyoCAACICDQBB0MSAgAAhAQwBCyABQaDKgIAAaiEDQdDEgIAAIQEDQAJAIAJB/wFxIAEtAABGDQAgAiEADAILIAFBAWohASADLQAAIQIgA0EBaiEDIAINAAsLQQBBAyAAQf8BcSABLQAARhsLKQEBf0Gcw4CAAEHQw4CAABCdgICAACIAQcABbEGRyYCAAGogAEEASBsLswMBB39BACEAQQBBfzYCyMOAgABBASEBAkADQAJAAkACQCAAQRRsIgIoAqDD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AAwBC0EAIAVBAWoiBTYCwOiJgAALQQAgBkEBaiIHNgKA34mAACAGQQJ0QZDfiYAAaiACQX5qNgIAIAchBgsgAUHAfWohASACQX9qIgJBAUsNAAsLCwsAQQAoAsjoiYAACwsAQQAoAsToiYAACwsAQQAoAsDoiYAAC6gDAQt/QQBCADcD2OiJgABBAEIANwPQ6ImAAEEAQQA2AuDoiYAAQQBBADYC5OiJgABBAEEANgLo6ImAAEEAQQA2AuzoiYAAQQBBADYCgN+JgAACQEEAKAL8yICAACICQQFIDQAgAkEBaiEDIAJBNGxB5OKIgABqIQJBACgC+MiAgAAhBEEAIQVBACEGQQAhB0EAIQhBACEJA0ACQAJAIABBAEgNACACKAIAIABHDQELAkAgAUUNACACQXhqKAIAIAFHDQELIAJBdGooAgAiCkHAAmxBiPWCgABqQfDoiYAAIAogBEgbQfDoiYAAIApBf0obIgooArwCIQsCQCACKAIAIgxBA0sNACAMQQJ0IgwgDCgC0OiJgAAgC2o2AtDoiYAAC0EAIAUgC2oiBTYC7OiJgABBACAIQQFqIgg2AuToiYAAQQAgCUEBaiILNgKA34mAAEEAIAYgCigCuAJqIgY2AujoiYAAQQAgByAKKAKwAmoiBzYC4OiJgAAgCUECdEGQ34mAAGogA0F+ajYCACALIQkLIAJBTGohAiADQX9qIgNBAUsNAAsLCyIBAX9BACEBAkAgAEEDSw0AIABBAnQoAtDoiYAAIQELIAELCwBBACgC7OiJgAALCwBBACgC6OiJgAALCwBBACgC5OiJgAALCwBBACgC4OiJgAALLwECf0EAIQACQEEAKALk6ImAACIBRQ0AQQAoAuzoiYAAIAFBAm1qIAFtIQALIAALC9wDAgBBgMAAC8gDAQAAAFohAADDIAAACgUAADIAAAACAAAAyCAAALkgAACqBQAAKAAAAAMAAADVIAAAtCAAAO4CAABQAAAABAAAAPggAACgIAAAlg8AABQAAAAFAAAAKyEAAKUgAADeAwAALQAAAAYAAAAdIQAAryAAAMIBAABkAAAABwAAAJEhAAC+IAAApgQAACMAAAAIAAAATCEAAKogAACKAgAAHgAAAPCfp7oA8J+MrQDwn42oAPCfpaQA8J+NnwDwn42XAPCfjZYA8J+NlABQb2xsbyBDcmlzcHkAUGFwYXMgRnJpdGFzIEdyYW5kZXMAQWRtaW5pc3RyYWRvcgBDb21ibyBGYW1pbGlhcgBDYWplcm8AZW1wbGVhZG8AYWRtaW4AR2FzZW9zYSA1MDBtbABIb3QgRG9nIEVzcGVjaWFsAGNsaWVudGUAQ2xpZW50ZQBIZWxhZG8gU3VuZGFlAEhhbWJ1cmd1ZXNhIENsYXNpY2EAMTIzNDU2Nzg5ADEyMzQ1NgAxMDAwMDAwMgAxMDAwMDAwMQBOdWdnZXRzIHgxMAAAAAAXIQAAiCEAAHghAADqIAAAAgAAAA4hAAB/IQAAbiEAAAchAAABAAAAAEHIwwALBP////8=";
  const bytes = Uint8Array.from(atob(LOGICA_C_COMPILADA), ch => ch.charCodeAt(0));
  return WebAssembly.instantiate(bytes, {}).then(({ instance }) => {
    const e = instance.exports;
    const enc = new TextEncoder(), dec = new TextDecoder();
    return {
      ...e,
      // Lee un texto (char*) devuelto por C
      texto(ptr){ const m = new Uint8Array(e.memory.buffer); let f = ptr; while (m[f]) f++; return dec.decode(m.subarray(ptr, f)); },
      // Escribe un texto en la casilla n de C (para validar registro / login)
      escribir(n, s){
        const ptr = e.casilla(n), m = new Uint8Array(e.memory.buffer);
        const b = enc.encode(String(s ?? "")).slice(0, e.casilla_tam() - 1);
        m.set(b, ptr); m[ptr + b.length] = 0;
      }
    };
  });
}
