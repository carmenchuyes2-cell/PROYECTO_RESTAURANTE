// RestauranteLatina — DISEÑO / INTERFAZ en JavaScript (app.js).
// Este archivo solo muestra las pantallas, lee lo que escribe el usuario y guarda los datos en el navegador.
// NO hace cálculos ni validaciones: toda la lógica (stock, carrito, IGV, totales, vuelto, registro,
// login, estados de pedidos y reportes) está en C, en logica/logica.c, y aquí se usa como "C.funcion()".

logicaC.then(iniciarApp).catch(err=>{
  document.body.insertAdjacentHTML("afterbegin",
    `<p style="background:#D62828;color:#fff;padding:1rem;text-align:center;font-weight:bold">
     No se pudo cargar la lógica en C. Verifica que exista la carpeta "logica" con el archivo logica-compilada.js junto a index.html.</p>`);
  console.error(err);
});

function iniciarApp(C){

/* ============ Datos que vienen del C ============ */
const METODOS = ["Efectivo","Tarjeta","Yape","Tarjeta de credito"];
const ESTADO = {pendiente:0, cobrado:1, anulado:2};       // mismos números que en logica.c
const MSG_CARRITO = {1:"Cantidad inválida.", 2:"Ese producto no existe.", 3:"Stock insuficiente.",
                     4:"Tu pedido llegó al máximo de 20 productos distintos.", 5:"Pedido vacío."};
const MSG_REGISTRO = {1:"Escribe tu nombre completo.", 2:"El DNI debe tener 8 dígitos.",
                      3:"Escribe un correo válido (ejemplo: nombre@correo.com).", 4:"La contraseña debe tener al menos 6 caracteres.",
                      5:"Las contraseñas no coinciden.", 6:"Ese DNI ya está registrado. Inicia sesión."};
const MSG_LOGIN = {1:"El DNI debe tener 8 dígitos.", 2:"Ese DNI no está registrado. Pulsa \"Regístrate aquí\".",
                   3:"Contraseña incorrecta."};

// Catálogo leído desde C (precio en céntimos)
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

/* ============ Utilidades ============ */
const $ = id => document.getElementById(id);
const soles = c => "S/ " + (c/100).toFixed(2);              // céntimos -> texto
const aCentimos = txt => Math.round(parseFloat(String(txt).replace(",", ".")) * 100);
const numBoleta = n => "B001-" + String(n).padStart(6,"0");
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const hoyISO = () => { const d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
const leer = k => JSON.parse(localStorage.getItem(k) || "[]");
const guardar = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const esCliente = () => sesion && sesion.rol==="cliente";
const esStaff = () => sesion && sesion.rol!=="cliente";
const esAdmin = () => sesion && sesion.rol==="admin";
function siguiente(clave){ const n=Number(localStorage.getItem(clave)||1); localStorage.setItem(clave,n+1); return n; }
function importe(precio, cantidad){ C.calc_iniciar(); C.calc_item(precio, cantidad); C.calc_terminar(); return C.total_subtotal(); }
function leerTotales(){ return {cant:C.total_cantidad(), sub:C.total_subtotal(), igv:C.total_igv(), tot:C.total_pagar()}; }

function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove("show"), 2600);
}
function deviceHint(){
  const w = window.innerWidth;
  $("deviceHint").textContent = w <= 700 ? "📱 Modo celular" : w <= 1024 ? "📟 Modo tablet" : "🖥️ Modo PC";
}
window.addEventListener("resize", deviceHint);

/* ============ Stock (lo controla C, aquí solo se guarda) ============ */
function cargarStock(){
  const s = JSON.parse(localStorage.getItem("rlc_stock") || "null");
  C.stock_reiniciar();
  if(s) catalogo.forEach(p=>{ if(s[p.id]!==undefined) C.stock_poner(p.id, s[p.id]); });
}
function guardarStock(){
  guardar("rlc_stock", Object.fromEntries(catalogo.map(p=>[p.id, C.stock_de(p.id)])));
}

/* ============ Login, registro y roles ============ */
// Pantallas de acceso: inicio (elegir) -> cliente / registro / empleado, con botón Volver
const FORMS = {inicio:"inicioAcceso", cliente:"clienteForm", registro:"registroForm", cajero:"loginForm"};
function mostrarTab(tab){
  Object.entries(FORMS).forEach(([k,id])=>{ $(id).hidden = k!==tab; });
  document.querySelectorAll(".login-form .error-msg").forEach(m=>m.hidden=true);
  const f = $(FORMS[tab]).querySelector("input"); if(f) f.focus();
}
// Botón del ojo: mostrar / ocultar contraseña
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
function sesionCliente(c){ return {user:c.dni, rol:"cliente", nombre:c.nombre, dni:c.dni}; }

// Registro: C valida los datos (validar_registro)
$("registroForm").addEventListener("submit", e=>{
  e.preventDefault();
  const nombre=$("regNombre").value.trim(), dni=$("regDni").value.trim(), correo=$("regCorreo").value.trim();
  const clientes = leer("rl_clientes");
  C.escribir(0, dni); C.escribir(1, nombre); C.escribir(2, correo);
  C.escribir(3, $("regPass").value); C.escribir(4, $("regPass2").value);
  const r = C.validar_registro(clientes.some(c=>c.dni===dni) ? 1 : 0);
  if(r) return error("regMsg", MSG_REGISTRO[r]);
  const nuevo = {dni, nombre, correo, pass:$("regPass").value, registro:new Date().toLocaleString()};
  clientes.push(nuevo); guardar("rl_clientes", clientes);
  e.target.reset(); $("regMsg").hidden = true;
  iniciar(sesionCliente(nuevo), "Cuenta creada. ¡Bienvenido " + nombre + "!");
});
// Ingreso de cliente: C compara DNI y contraseña (login_cliente)
$("clienteForm").addEventListener("submit", e=>{
  e.preventDefault();
  const dni = $("cliDni").value.trim();
  const c = leer("rl_clientes").find(x=>x.dni===dni);
  C.escribir(0, dni); C.escribir(1, $("cliPass").value); C.escribir(2, c ? c.pass : "");
  const r = C.login_cliente(c ? 1 : 0);
  if(r) return error("cliMsg", MSG_LOGIN[r]);
  $("cliMsg").hidden = true; e.target.reset();
  iniciar(sesionCliente(c), "Bienvenido " + c.nombre + ". ¡Arma tu pedido!");
});
// Ingreso de cajero: los usuarios están en C (login_cajero)
$("loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  const u = $("loginUser").value.trim();
  C.escribir(0, u); C.escribir(1, $("loginPass").value);
  const rol = C.login_cajero();
  if(!rol) return error("loginMsg", "Usuario o contraseña incorrectos.");
  const nombre = C.texto(C.cajero_nombre());
  $("loginMsg").hidden = true; e.target.reset();
  iniciar({user:u, rol: rol===2 ? "admin" : "empleado", nombre}, "Caja abierta: " + nombre + ".");
});
$("btnLogout").addEventListener("click", ()=>{
  C.carrito_vaciar(); $("payBox").hidden = true;
  sesion = null; sessionStorage.removeItem("rl_sesion");
  aplicarRol(); mostrarTab("inicio"); sync(); toast("Sesión cerrada.");
});

/* ============ Navegación ============ */
// Cliente: menú, pedido, mis pedidos y boleta. Cajero: pedidos de clientes y boleta. Admin: además ventas.
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

/* ============ Menú ============ */
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

/* ============ Pedido (carrito en C) ============ */
function itemsCarrito(){
  const items = [];
  for(let i=0; i<C.carrito_items(); i++){
    const p = producto(C.carrito_id(i));
    items.push({id:p.id, nombre:p.nombre, precio:p.precio, cantidad:C.carrito_cantidad(i)});
  }
  return items;
}
function totalesCarrito(){ C.calcular_carrito(); return leerTotales(); }

function renderCarrito(){
  const items = itemsCarrito();
  $("cartBody").innerHTML = items.map((it,idx)=>`<tr><td>${it.nombre}</td>
    <td><input type="number" min="1" value="${it.cantidad}" data-idx="${idx}"/></td>
    <td class="num">${soles(it.precio)}</td><td class="num"><b>${soles(importe(it.precio,it.cantidad))}</b></td>
    <td><button class="del" data-del="${idx}" aria-label="Quitar" type="button">❌</button></td></tr>`).join("");
  $("cartCards").innerHTML = items.map((it,idx)=>`<div class="cart-card">
    <div><b>${it.nombre}</b><br><small>${soles(it.precio)} c/u = ${soles(importe(it.precio,it.cantidad))}</small></div>
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
    : items.map(i=>`<li><span>${i.cantidad} × ${i.nombre}</span><b>${soles(importe(i.precio,i.cantidad))}</b></li>`).join("");

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

/* ============ Pago (QR Yape solo al elegir Yape) ============ */
const YAPE_NUMERO = "999888777";
function metodoActual(){
  const r = document.querySelector('input[name="pay"]:checked');
  return r ? r.value : "Efectivo";
}
function actualizarYapeQR(){
  const esYape = metodoActual()==="Yape" && !$("payBox").hidden;
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
$("btnPagar").addEventListener("click", enviarPedido);

/* ============ Cliente: enviar pedido a caja ============ */
function enviarPedido(){
  cargarStock();                         // stock más reciente (otros clientes pudieron pedir)
  const items = itemsCarrito(), t = totalesCarrito();
  const r = C.carrito_confirmar();       // C revisa el stock, lo descuenta y vacía el carrito
  if(r){ sync(); return toast(r===3 ? "Ya no hay stock suficiente de un producto. Revisa tu pedido." : MSG_CARRITO[r]); }
  guardarStock();
  const pedido = {
    id: "P-" + String(siguiente("rlc_pnext")).padStart(4,"0"),
    hora: new Date().toLocaleTimeString(), dia: hoyISO(),
    dni: sesion.dni, cliente: sesion.nombre,
    items, ...t, metodo: metodoActual(), estado: "pendiente"
  };
  const pedidos = leer("rlc_pedidos"); pedidos.push(pedido); guardar("rlc_pedidos", pedidos);
  $("payBox").hidden = true;
  sync(); actualizarBadges(); go("mispedidos");
  toast("📤 Pedido " + pedido.id + " enviado a caja.");
}
function renderMisPedidos(){
  if(!esCliente()) return;
  const mios = leer("rlc_pedidos").filter(p=>p.dni===sesion.dni).reverse();
  $("misPedidos").innerHTML = mios.length ? mios.map(p=>tarjetaPedido(p, "cliente")).join("")
    : `<div class="card empty muted">Aún no envías pedidos. Ve al <b>Menú</b> para empezar.</div>`;
}

/* ============ Cajero: cola de pedidos ============ */
const ESTADO_TXT = {pendiente:"⏳ Pendiente", cobrado:"✅ Cobrado", anulado:"✖ Anulado"};
function tarjetaPedido(p, modo){
  const items = p.items.map(i=>`<li><span>${i.cantidad} × ${i.nombre}</span><span>${soles(importe(i.precio,i.cantidad))}</span></li>`).join("");
  let acciones = "";
  if(modo==="cajero" && C.puede_cobrar(ESTADO[p.estado])){
    acciones = `<div class="order-actions">
      <select data-met="${p.id}" aria-label="Método de pago">${METODOS.map(m=>`<option ${m===p.metodo?"selected":""}>${m}</option>`).join("")}</select>
      <input data-rec="${p.id}" type="number" min="0" step="0.10" placeholder="Efectivo recibido (S/)" aria-label="Efectivo recibido" />
      <button class="btn btn-red" data-cobrar="${p.id}" type="button">Cobrar y generar boleta</button>
      <button class="btn btn-ghost" data-anular="${p.id}" type="button">Anular</button></div>`;
  } else if(modo==="cliente" && C.puede_anular(ESTADO[p.estado])){
    acciones = `<p class="muted">Acércate a caja para pagar. Te avisaremos cuando se cobre.</p>
      <div class="order-actions"><button class="btn btn-ghost" data-anular="${p.id}" type="button">Cancelar pedido</button></div>`;
  } else if(p.estado==="cobrado"){
    acciones = `<div class="order-actions"><button class="btn btn-dark" data-verbol="${p.boleta}" type="button">🎫 Ver boleta ${numBoleta(p.boleta)}</button></div>`;
  }
  return `<div class="order ${p.estado} ${p.nuevo?"nuevo":""}">
    <div class="order-head"><b>${p.id}</b><span class="st ${p.estado}">${ESTADO_TXT[p.estado]}</span></div>
    <div class="order-cli">👤 <b>${esc(p.cliente)}</b> <small>• DNI ${esc(p.dni)} • ${esc(p.hora)}</small><br>
      <small>Pago elegido: ${p.metodo}${p.atendio ? " • Atendió: " + esc(p.atendio) : ""}</small></div>
    <ul>${items}</ul>
    <div class="order-tot"><span>Total (${p.cant} und.)</span><span>${soles(p.tot)}</span></div>
    ${acciones}</div>`;
}
let vistosCola = null;
function renderCola(){
  if(!esStaff()) return [];
  const pedidos = leer("rlc_pedidos");
  const pend = pedidos.filter(p=>p.estado==="pendiente");
  const nuevos = vistosCola ? pend.filter(p=>!vistosCola.has(p.id)) : [];
  vistosCola = new Set(pend.map(p=>p.id));
  pend.forEach(p=>p.nuevo = nuevos.some(n=>n.id===p.id));
  $("colaPedidos").innerHTML = pend.length ? pend.map(p=>tarjetaPedido(p,"cajero")).join("")
    : `<p class="empty muted">No hay pedidos pendientes. Cuando un cliente envíe uno aparecerá aquí.</p>`;

  const hoy = pedidos.filter(p=>p.dia===hoyISO() && p.estado!=="pendiente").reverse();
  const cob = hoy.filter(p=>p.estado==="cobrado");
  C.reporte_iniciar();
  cob.forEach(p=>C.reporte_venta(METODOS.indexOf(p.metodo), p.tot, p.igv, p.cant));
  $("sPend").textContent = pend.length;
  $("sCob").textContent = C.reporte_boletas();
  $("sCobTot").textContent = soles(C.reporte_total());
  $("sAnul").textContent = hoy.length - cob.length;
  $("atendidos").innerHTML = hoy.length ? hoy.map(p=>`<tr><td><b>${p.id}</b></td><td>${esc(p.hora)}</td>
    <td>${esc(p.cliente)}<br><small class="muted">${esc(p.dni)}</small></td><td><span class="st ${p.estado}">${ESTADO_TXT[p.estado]}</span></td>
    <td>${p.boleta ? numBoleta(p.boleta) : "—"}</td><td>${esc(p.atendio||"-")}</td><td class="num"><b>${soles(p.tot)}</b></td></tr>`).join("")
    : `<tr><td colspan="7" class="empty muted">Todavía no se atienden pedidos hoy.</td></tr>`;
  return nuevos;
}
function cobrarPedido(id){
  const pedidos = leer("rlc_pedidos"), p = pedidos.find(x=>x.id===id);
  if(!p || !C.puede_cobrar(ESTADO[p.estado])){ toast("Ese pedido ya fue atendido."); refrescar(); return; }
  const sel = document.querySelector(`[data-met="${id}"]`);
  const metodo = sel ? sel.value : p.metodo;
  let recibido = 0, vuelto = 0;
  if(metodo==="Efectivo"){
    const txt = document.querySelector(`[data-rec="${id}"]`).value;
    recibido = txt==="" ? NaN : aCentimos(txt);
    if(isNaN(recibido)) return toast("Ingresa el efectivo recibido del cliente.");
    vuelto = C.calcular_vuelto(p.tot, recibido);          // C calcula el vuelto (-1 = no alcanza)
    if(vuelto < 0) return toast("Falta " + soles(p.tot - recibido) + " para completar el pago.");
  }
  const venta = {num:siguiente("rlc_next"), fecha:new Date().toLocaleString(), dia:hoyISO(), pedido:p.id,
    dni:p.dni, cliente:p.cliente, items:p.items, cant:p.cant, sub:p.sub, igv:p.igv, tot:p.tot,
    metodo, recibido, vuelto, vendedor:sesion.user};
  const ventas = leer("rlc_ventas"); ventas.push(venta); guardar("rlc_ventas", ventas);
  Object.assign(p, {estado:"cobrado", boleta:venta.num, metodo, atendio:sesion.user});
  guardar("rlc_pedidos", pedidos);
  mostrarBoleta(venta); actualizarBadges(); go("boleta");
  toast("✅ " + p.id + " cobrado — " + numBoleta(venta.num));
}
function anularPedido(id){
  const pedidos = leer("rlc_pedidos"), p = pedidos.find(x=>x.id===id);
  if(!p || !C.puede_anular(ESTADO[p.estado])){ refrescar(); return; }
  p.estado = "anulado"; p.atendio = esCliente() ? "cliente" : sesion.user;
  guardar("rlc_pedidos", pedidos);
  cargarStock(); p.items.forEach(i=>C.stock_devolver(i.id, i.cantidad)); guardarStock();
  sync(); refrescar();
  toast(p.id + (esCliente() ? " cancelado." : " anulado."));
}
document.addEventListener("click", e=>{
  const b = e.target.closest("[data-cobrar],[data-anular],[data-verbol]");
  if(!b) return;
  if(b.dataset.cobrar) cobrarPedido(b.dataset.cobrar);
  else if(b.dataset.anular) anularPedido(b.dataset.anular);
  else {
    const v = leer("rlc_ventas").find(x=>x.num===+b.dataset.verbol);
    if(v){ mostrarBoleta(v); go("boleta"); }
  }
});

/* ============ Boleta ============ */
function mostrarBoleta(v){
  $("bEmpty").hidden = true; $("bContent").hidden = false;
  $("bNum").textContent = numBoleta(v.num);
  $("bFecha").textContent = v.fecha;
  $("bPed").textContent = v.pedido;
  $("bCli").textContent = v.cliente;
  $("bDni").textContent = v.dni;
  $("bVend").textContent = v.vendedor;
  $("bPago").textContent = v.metodo;
  $("bItems").innerHTML = v.items.map(i=>`<tr><td>${i.cantidad}</td><td>${i.nombre}</td>
    <td class="num">${(i.precio/100).toFixed(2)}</td><td class="num">${(importe(i.precio,i.cantidad)/100).toFixed(2)}</td></tr>`).join("");
  $("bCant").textContent = v.cant;
  $("bSub").textContent = soles(v.sub);
  $("bIgv").textContent = soles(v.igv);
  $("bTot").textContent = soles(v.tot);
  const efectivo = v.recibido > 0;
  $("bRecRow").hidden = $("bVueRow").hidden = !efectivo;
  if(efectivo){ $("bRec").textContent = soles(v.recibido); $("bVue").textContent = soles(v.vuelto); }
}
$("btnPrint").addEventListener("click", () => window.print());

/* ============ Ventas (solo admin) — el reporte lo calcula C ============ */
function renderVentas(){
  const f=$("filtroPago").value, dia=$("filtroFecha").value;
  const lista=leer("rlc_ventas").filter(v=>(f==="todos"||v.metodo===f) && (!dia||v.dia===dia)).reverse();
  C.reporte_iniciar();
  lista.forEach(v=>C.reporte_venta(METODOS.indexOf(v.metodo), v.tot, v.igv, v.cant));

  $("dayTotal").textContent = soles(C.reporte_total());
  $("statCount").textContent = C.reporte_boletas() + " boletas";
  $("statAvg").textContent = soles(C.reporte_promedio());
  $("statItems").textContent = C.reporte_unidades();
  $("statIgv").textContent = soles(C.reporte_igv());

  const por = METODOS.map((m,i)=>[m, C.reporte_metodo(i)]);
  const max = Math.max(...por.map(x=>x[1]), 1);
  $("salesSummary").innerHTML = por.map(([k,v])=>`<div class="bar"><span class="lbl">${k}</span>
    <div class="track"><div class="fill" style="width:${v/max*100}%"></div></div><span class="val">${soles(v)}</span></div>`).join("");

  $("salesList").innerHTML = lista.length ? lista.map(v=>`<tr><td><b>${numBoleta(v.num)}</b><br><small class="muted">${esc(v.pedido)}</small></td><td>${esc(v.fecha)}</td>
    <td>${esc(v.cliente)}<br><small class="muted">${esc(v.dni)}</small></td><td>${v.cant}</td>
    <td><span class="tag">${v.metodo}</span></td><td>${esc(v.vendedor||"-")}</td><td class="num"><b>${soles(v.tot)}</b></td></tr>`).join("")
    : `<tr><td colspan="7" class="empty muted">No hay ventas con estos filtros.</td></tr>`;
}
$("btnReporte").addEventListener("click",()=>{renderVentas(); toast("Reporte actualizado.");});
$("filtroPago").addEventListener("change",renderVentas);
$("filtroFecha").addEventListener("change",renderVentas);
$("btnLimpiar").addEventListener("click",()=>{ $("filtroPago").value="todos"; $("filtroFecha").value=""; renderVentas(); });

/* ============ Sincronización cliente ↔ cajero (pestañas del mismo navegador) ============ */
function actualizarBadges(){
  const pedidos = leer("rlc_pedidos");
  const pend = pedidos.filter(p=>p.estado==="pendiente").length;
  $("navPend").textContent = pend;
  $("navPend").classList.toggle("zero", pend===0);
  if(esCliente()) $("navMis").textContent = pedidos.filter(p=>p.dni===sesion.dni && p.estado==="pendiente").length;
}
let ultimoPedidos = localStorage.getItem("rlc_pedidos");
let ultimoStock = localStorage.getItem("rlc_stock");
function refrescar(){
  if(!sesion) return [];
  const nuevos = renderCola();
  renderMisPedidos(); actualizarBadges();
  if(vistaActual==="ventas") renderVentas();
  return nuevos;
}
function revisarCambios(){
  const ped = localStorage.getItem("rlc_pedidos"), stk = localStorage.getItem("rlc_stock");
  if(stk !== ultimoStock){ ultimoStock = stk; cargarStock(); renderMenu(); }
  if(ped === ultimoPedidos) return;
  const antes = JSON.parse(ultimoPedidos || "[]");
  ultimoPedidos = ped;
  const nuevos = refrescar();
  if(esStaff() && nuevos.length) toast("🔔 Nuevo pedido " + nuevos[0].id + " de " + nuevos[0].cliente);
  if(esCliente()){
    leer("rlc_pedidos").filter(p=>p.dni===sesion.dni).forEach(p=>{
      const a = antes.find(x=>x.id===p.id);
      if(a && a.estado==="pendiente" && p.estado==="cobrado") toast("✅ Tu pedido " + p.id + " fue cobrado. Ya puedes ver tu boleta.");
      if(a && a.estado==="pendiente" && p.estado==="anulado" && p.atendio!=="cliente") toast("Tu pedido " + p.id + " fue anulado por caja.");
    });
  }
}
window.addEventListener("storage", revisarCambios);
setInterval(revisarCambios, 2000);

/* ============ Inicio ============ */
$("todayLabel").textContent = "📅 " + new Date().toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long"});
deviceHint(); cargarStock(); sync(); aplicarRol();
if(sesion){ renderCola(); go(inicio()); }
}
