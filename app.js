// RestauranteLatina responsive + pantallas interactivas (movil/tablet/PC)
const IGV = 0.18;
let catalogo = [
  {id:1,nombre:"Hamburguesa Clasica",precio:12.90,stock:50,emoji:"🍔"},
  {id:2,nombre:"Pollo Crispy",precio:14.50,stock:40,emoji:"🍗"},
  {id:3,nombre:"Papas Fritas Grandes",precio:7.50,stock:80,emoji:"🍟"},
  {id:4,nombre:"Combo Familiar",precio:39.90,stock:20,emoji:"🧺"},
  {id:5,nombre:"Hot Dog Especial",precio:9.90,stock:45,emoji:"🌭"},
  {id:6,nombre:"Gaseosa 500ml",precio:4.50,stock:100,emoji:"🥤"},
  {id:7,nombre:"Nuggets x10",precio:11.90,stock:35,emoji:"🍖"},
  {id:8,nombre:"Helado Sundae",precio:6.50,stock:30,emoji:"🍨"}
];
// Usuarios y roles (igual que consola C: admin/123456, empleado/123456789)
const USUARIOS = {
  admin: {pass: "123456", rol: "admin", nombre: "Administrador"},
  empleado: {pass: "123456789", rol: "empleado", nombre: "Empleado"}
};
let sesion = JSON.parse(sessionStorage.getItem("rl_sesion") || "null");
let carrito = [];
let nBoleta = Number(localStorage.getItem("rl_next") || 1);
const $ = id => document.getElementById(id);

function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove("show"), 2200);
}
function deviceHint(){
  const w = window.innerWidth;
  $("deviceHint").textContent = w <= 700 ? "📱 Modo celular" : w <= 1024 ? "📟 Modo tablet" : "🖥️ Modo PC";
}
window.addEventListener("resize", deviceHint);

/* Navegacion por pantallas + control de sesion */
function exigeLogin(name){
  if(!sesion && name!=="login"){ go("login"); toast("Primero ingresa usuario y contraseña."); return false; }
  if(sesion && sesion.rol!=="admin" && name==="ventas"){ toast("Solo administrador ve ventas."); return false; }
  return true;
}
function go(name){
  if(name!=="login" && !exigeLogin(name)) return;
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active", s.id===name));
  document.querySelectorAll("[data-go]").forEach(a=>a.classList.toggle("active", a.dataset.go===name));
  document.querySelectorAll("#stepsBar li").forEach(li=>li.classList.toggle("active", li.dataset.step===name || (name==="ventas"&&li.dataset.step==="boleta")));
  const el = $(name); if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
  $("navMobile").classList.remove("open");
}
function aplicarRol(){
  const esAdmin = sesion && sesion.rol==="admin";
  document.querySelectorAll('[data-admin="1"]').forEach(el=>{ el.style.display = esAdmin ? "" : "none"; });
  $("userBox").hidden = !sesion;
  if(sesion) $("userBadge").textContent = sesion.nombre + " (" + sesion.rol + ")";
  document.body.classList.toggle("locked", !sesion);
}
$("loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  const u = $("loginUser").value.trim(), p = $("loginPass").value;
  const ref = USUARIOS[u];
  if(ref && ref.pass===p){
    sesion = {user: u, rol: ref.rol, nombre: ref.nombre};
    sessionStorage.setItem("rl_sesion", JSON.stringify(sesion));
    $("loginMsg").textContent = "";
    aplicarRol(); go("menu"); renderVentas();
    toast("Bienvenido " + ref.nombre + ".");
  } else {
    $("loginMsg").textContent = "Usuario o contraseña incorrectos.";
  }
});
$("btnLogout").addEventListener("click", ()=>{
  sesion = null; sessionStorage.removeItem("rl_sesion");
  aplicarRol(); go("login"); toast("Sesión cerrada.");
});
document.querySelectorAll("[data-go]").forEach(a=>a.addEventListener("click", e=>{
  e.preventDefault(); go(a.dataset.go);
}));
$("menuBtn").addEventListener("click", ()=>$("navMobile").classList.toggle("open"));
document.querySelectorAll("#stepsBar li").forEach(li=>li.addEventListener("click", ()=>go(li.dataset.step==="pago"?"pedido":li.dataset.step)));

function renderMenu(){
  const g = $("menuGrid"); g.innerHTML = "";
  const sel = $("selProd"); sel.innerHTML = "";
  catalogo.forEach(p=>{
    const d = document.createElement("div");
    d.className = "prod";
    d.innerHTML = `<div style="font-size:2rem">${p.emoji||"🍔"}</div><h3>${p.nombre}</h3><p class="price">S/ ${p.precio.toFixed(2)}</p><small>Stock: ${p.stock}</small><button class="btn btn-red" data-id="${p.id}">Seleccionar</button>`;
    g.appendChild(d);
    const o = document.createElement("option");
    o.value = p.id; o.textContent = `${p.nombre} - S/${p.precio.toFixed(2)}`;
    sel.appendChild(o);
  });
  g.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    $("selProd").value = b.dataset.id;
    toast("Seleccionado. Ajusta cantidad y pulsa Agregar.");
  }));
}
function totales(){
  let cant=0, sub=0;
  carrito.forEach(i=>{cant+=i.cantidad; sub+=i.cantidad*i.precio;});
  const igv=sub*IGV, tot=sub+igv;
  return {cant,sub,igv,tot};
}
function renderCarrito(){
  const tb=$("cartBody"); tb.innerHTML="";
  const cards=$("cartCards"); cards.innerHTML="";
  carrito.forEach((it,idx)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${it.nombre}</td><td><input type="number" min="1" value="${it.cantidad}" data-idx="${idx}" style="width:64px"/></td><td>S/${it.precio.toFixed(2)}</td><td>S/${(it.precio*it.cantidad).toFixed(2)}</td><td><button data-del="${idx}" aria-label="Quitar">❌</button></td>`;
    tb.appendChild(tr);
    const c=document.createElement("div"); c.className="cart-card";
    c.innerHTML=`<div><b>${it.nombre}</b><br><small>S/${it.precio.toFixed(2)} c/u = S/${(it.precio*it.cantidad).toFixed(2)}</small></div><div><input type="number" min="1" value="${it.cantidad}" data-idx="${idx}"/> <button data-del="${idx}">❌</button></div>`;
    cards.appendChild(c);
  });
  document.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{
    const it=carrito[+b.dataset.del];
    const cat=catalogo.find(p=>p.id===it.id); cat.stock+=it.cantidad;
    carrito.splice(+b.dataset.del,1); sync(); toast("Artículo eliminado.");
  }));
  document.querySelectorAll('#cartBody input,#cartCards input').forEach(inp=>inp.addEventListener("change",()=>{
    const idx=+inp.dataset.idx, v=+inp.value;
    if(v<1){sync();return;}
    const it=carrito[idx], cat=catalogo.find(p=>p.id===it.id);
    const diff=v-it.cantidad;
    if(diff>cat.stock){toast("Stock insuficiente."); sync(); return;}
    cat.stock-=diff; it.cantidad=v; sync();
  }));
  const t=totales();
  $("tCant").textContent=t.cant;
  $("tSub").textContent="S/ "+t.sub.toFixed(2);
  $("tIgv").textContent="S/ "+t.igv.toFixed(2);
  $("tTot").textContent="S/ "+t.tot.toFixed(2);
  $("liveTotal").textContent="S/ "+t.tot.toFixed(2);
  $("liveCount").textContent=t.cant+" productos";
  $("fabCount").textContent=t.cant;
  $("fabTotal").textContent="S/ "+t.tot.toFixed(2);
}
function sync(){ renderMenu(); renderCarrito(); actualizarYapeQR(); }

/* QR Yape: aparece solo al seleccionar Yape, con monto del total */
const YAPE_NUMERO = "999888777";
function metodoActual(){
  const r = document.querySelector('input[name="pay"]:checked');
  return r ? r.value : "Efectivo";
}
function actualizarYapeQR(){
  const box = $("yapeBox"); if(!box) return;
  const esYape = metodoActual() === "Yape" && !$("payBox").hidden;
  box.hidden = !esYape;
  if(!esYape) return;
  const t = totales();
  $("qrMonto").textContent = "Total a pagar: S/ " + t.tot.toFixed(2);
  const data = "YAPE|RestauranteLatina|" + YAPE_NUMERO + "|S/" + t.tot.toFixed(2);
  $("qrImg").src = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(data);
}
document.querySelectorAll('input[name="pay"]').forEach(r=>r.addEventListener("change", actualizarYapeQR));

$("qtyPlus").addEventListener("click",()=>{ $("inpCant").value = (+$("inpCant").value||1)+1; });
$("qtyMinus").addEventListener("click",()=>{ $("inpCant").value = Math.max(1, (+$("inpCant").value||1)-1); });

$("btnAdd").addEventListener("click",()=>{
  const id=+$("selProd").value, cant=+$("inpCant").value||1;
  if(cant<1){toast("Cantidad inválida.");return;}
  const p=catalogo.find(x=>x.id===id);
  if(!p||p.stock<cant){toast("Stock insuficiente.");return;}
  const ex=carrito.find(x=>x.id===id);
  if(ex) ex.cantidad+=cant; else carrito.push({id:p.id,nombre:p.nombre,precio:p.precio,cantidad:cant});
  p.stock-=cant; sync();
  toast(`Agregado ${p.nombre} x${cant}. ¿Otro? Sigue aquí o ve a Pedido.`);
});
$("btnSeguir").addEventListener("click",()=>go("menu"));
$("btnFinalizar").addEventListener("click",()=>{
  if(!carrito.length){toast("Pedido vacío.");return;}
  $("payBox").hidden=false;
  document.querySelector('#stepsBar [data-step="pago"]').classList.add("active");
  actualizarYapeQR();
  $("payBox").scrollIntoView({behavior:"smooth"});
  toast("Total calculado. Elige método de pago.");
});
$("btnPagar").addEventListener("click",()=>{
  if(!carrito.length){toast("Pedido vacío.");return;}
  const t=totales();
  const metodo=document.querySelector('input[name="pay"]:checked').value;
  const dni=$("dni").value||"12345678";
  const nom=$("nombreCli").value||"Cliente General";
  const venta={num:nBoleta,fecha:new Date().toLocaleString(),dni,cliente:nom,items:[...carrito],...t,metodo,vendedor:sesion?sesion.user:"-"};
  const ventas=JSON.parse(localStorage.getItem("rl_ventas")||"[]");
  ventas.push(venta); localStorage.setItem("rl_ventas",JSON.stringify(ventas));
  localStorage.setItem("rl_next",++nBoleta);
  $("bNum").textContent="BOLETA #"+String(venta.num).padStart(3,"0");
  $("bCli").textContent=venta.fecha+" | "+dni+" - "+nom;
  $("bItems").innerHTML=venta.items.map(i=>`<p>${i.nombre} x${i.cantidad} — S/${(i.precio*i.cantidad).toFixed(2)}</p>`).join("");
  $("bTot").innerHTML=`<p>Cantidad: ${t.cant} | Subtotal: S/${t.sub.toFixed(2)} | IGV: S/${t.igv.toFixed(2)}</p><h3 class="grand">TOTAL S/${t.tot.toFixed(2)}</h3><p>Pago: <b>${metodo}</b></p>`;
  carrito=[]; sync(); renderVentas(); go("boleta");
  toast("Boleta generada ("+metodo+").");
});
function renderVentas(){
  const f=$("filtroPago").value;
  const ventas=JSON.parse(localStorage.getItem("rl_ventas")||"[]");
  const list=$("salesList"); list.innerHTML="";
  let total=0; const por={Efectivo:0,Tarjeta:0,Yape:0,"Tarjeta de credito":0};
  ventas.filter(v=>f==="todos"||v.metodo===f).forEach(v=>{
    total+=v.tot; if(por[v.metodo]!==undefined) por[v.metodo]+=v.tot;
    const d=document.createElement("div"); d.className="sale";
    d.innerHTML=`<b>#${String(v.num).padStart(3,"0")}</b> ${v.fecha} — ${v.cliente} — S/${v.tot.toFixed(2)} [${v.metodo}] <small>por ${v.vendedor||"-"}</small>`;
    list.appendChild(d);
  });
  $("dayTotal").textContent="S/ "+total.toFixed(2);
  $("salesSummary").innerHTML = Object.entries(por).map(([k,v])=>`<span class="chip">${k}: S/${v.toFixed(2)}</span>`).join("");
}
$("btnReporte").addEventListener("click",()=>{renderVentas(); toast("Reporte actualizado.");});
$("filtroPago").addEventListener("change",renderVentas);
$("btnPrint").addEventListener("click", () => window.print());

deviceHint(); sync(); renderVentas(); aplicarRol(); go(sesion ? "menu" : "login");
