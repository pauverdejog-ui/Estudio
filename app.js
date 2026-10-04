/* Temario · seguimiento de estudio (PWA sin dependencias) */
(() => {
  "use strict";

  const STORE_KEY = "temario.v1";
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  /* ───────────────────────── Utilidades ───────────────────────── */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayStr = () => ymd(new Date());
  const parseLocal = (s) => {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(s);
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
  };
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 864e5);
  const fmtNum = (n, d = 1) => n.toLocaleString("es-ES", { maximumFractionDigits: d, minimumFractionDigits: 0 });
  const pctStr = (x) => `${Math.round(x * 100)}`;
  const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const MON = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
  const DOW = ["L", "M", "X", "J", "V", "S", "D"];
  const WEEKDAY = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const fmtDate = (d, withYear) => `${d.getDate()} ${MON[d.getMonth()]}${withYear ? " " + d.getFullYear() : ""}`;
  const fmtTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const hasTime = (s) => typeof s === "string" && s.includes("T");
  const vibrate = (ms = 8) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* noop */ } };

  /* ───────────────────────── Estado ───────────────────────── */
  function buildDefaultSubjects() {
    return DEFAULT_SUBJECTS.map((s) => ({
      id: s.id, uni: s.uni, code: s.code, short: s.short, name: s.name, color: s.color, note: s.note || "",
      temas: s.temas.map(([title, points], ti) => ({
        id: `${s.id}-${ti + 1}`,
        title,
        points: points.map((p, pi) => ({ id: `${s.id}-${ti + 1}-${pi + 1}`, title: p }))
      }))
    }));
  }
  function buildDefaultEvents() {
    return DEFAULT_EVENTS.map((e) => ({ id: uid(), sid: e.sid, type: e.type, title: e.title, start: e.start, end: e.end || "", allDay: !!e.allDay }));
  }
  function freshState() {
    return {
      v: DATA_VERSION,
      subjects: buildDefaultSubjects(),
      events: buildDefaultEvents(),
      progress: {},
      notes: {},
      log: {},
      settings: { weight: "subject", theme: "auto", backupDays: 7, lastBackup: null, created: todayStr(), uniFilter: "all" }
    };
  }
  function normalize(st) {
    const base = freshState();
    const out = Object.assign({}, base, st);
    out.settings = Object.assign({}, base.settings, st.settings || {});
    out.progress = st.progress || {};
    out.notes = st.notes || {};
    out.log = st.log || {};
    out.events = Array.isArray(st.events) ? st.events : base.events;
    out.subjects = Array.isArray(st.subjects) && st.subjects.length ? st.subjects : base.subjects;
    return out;
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return normalize(JSON.parse(raw));
    } catch (e) { console.warn("No se pudo leer el estado", e); }
    return freshState();
  }
  let state = load();
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
      catch (e) { toast("No se pudo guardar en el dispositivo. Exporta una copia."); }
    }, 120);
  }
  function saveNow() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* noop */ }
  }
  window.addEventListener("pagehide", saveNow);
  document.addEventListener("visibilitychange", () => { if (document.hidden) saveNow(); });
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* noop */ }

  /* ───────────────────────── Cálculos ───────────────────────── */
  const subjById = (id) => state.subjects.find((s) => s.id === id);
  const stateOf = (pid) => (state.progress[pid] && state.progress[pid].s) || 0;

  function statsOfPoints(points) {
    let total = points.length, studied = 0, reviewed = 0;
    for (const p of points) {
      const s = stateOf(p.id);
      if (s >= 1) studied++;
      if (s >= 2) reviewed++;
    }
    return { total, studied, reviewed, pS: total ? studied / total : 0, pR: total ? reviewed / total : 0 };
  }
  const allPoints = (subj) => subj.temas.flatMap((t) => t.points);
  const subjStats = (subj) => statsOfPoints(allPoints(subj));

  function globalStats(subjects = state.subjects) {
    const per = subjects.map(subjStats).filter((s) => s.total > 0);
    const total = per.reduce((a, s) => a + s.total, 0);
    const studied = per.reduce((a, s) => a + s.studied, 0);
    const reviewed = per.reduce((a, s) => a + s.reviewed, 0);
    let pS, pR;
    if (state.settings.weight === "points") {
      pS = total ? studied / total : 0; pR = total ? reviewed / total : 0;
    } else {
      pS = per.length ? per.reduce((a, s) => a + s.pS, 0) / per.length : 0;
      pR = per.length ? per.reduce((a, s) => a + s.pR, 0) / per.length : 0;
    }
    return { total, studied, reviewed, pS, pR };
  }

  const evStart = (e) => parseLocal(e.start);
  function evEnd(e) {
    if (e.end) {
      const d = parseLocal(e.end);
      if (!hasTime(e.end)) d.setHours(23, 59);
      return d;
    }
    const d = parseLocal(e.start);
    if (!hasTime(e.start)) d.setHours(23, 59); else d.setHours(d.getHours() + 2);
    return d;
  }
  const sortedEvents = () => [...state.events].sort((a, b) => evStart(a) - evStart(b));
  const upcomingEvents = (now = new Date()) => sortedEvents().filter((e) => evEnd(e) >= now);
  function nextExam(sid) {
    const now = new Date();
    return sortedEvents().find((e) => e.sid === sid && e.type === "exam" && evEnd(e) >= now) || null;
  }
  function nextPec(sid) {
    const now = new Date();
    return sortedEvents().find((e) => e.sid === sid && e.type === "pec" && evEnd(e) >= now) || null;
  }
  function countdown(e) {
    const n = daysBetween(new Date(), evStart(e));
    if (n < 0) return "en curso";
    if (n === 0) return "hoy";
    if (n === 1) return "mañana";
    return `${n} días`;
  }
  function pace(subj) {
    const ex = nextExam(subj.id);
    if (!ex) return null;
    const st = subjStats(subj);
    const days = Math.max(daysBetween(new Date(), evStart(ex)), 0);
    const remaining = st.total - st.studied;
    const remainingRev = st.total - st.reviewed;
    const div = Math.max(days, 1);
    return { exam: ex, days, remaining, remainingRev, perDay: remaining / div, perDayRev: remainingRev / div };
  }

  /* Actividad */
  function logAdd(n) {
    const k = todayStr();
    state.log[k] = Math.max(0, (state.log[k] || 0) + n);
    if (!state.log[k]) delete state.log[k];
  }
  function streak() {
    let d = new Date(), n = 0;
    if (!state.log[ymd(d)]) d.setDate(d.getDate() - 1);
    while (state.log[ymd(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function weekStart(d) {
    const x = startOfDay(d); const dow = (x.getDay() + 6) % 7; x.setDate(x.getDate() - dow); return x;
  }
  function weeklyCounts(weeks = 8) {
    const out = []; const ws = weekStart(new Date());
    for (let i = weeks - 1; i >= 0; i--) {
      const start = new Date(ws); start.setDate(start.getDate() - i * 7);
      let sum = 0;
      for (let k = 0; k < 7; k++) { const d = new Date(start); d.setDate(d.getDate() + k); sum += state.log[ymd(d)] || 0; }
      out.push({ start, sum });
    }
    return out;
  }

  /* Cambiar estado de un punto */
  function setPoint(pid, s) {
    const prev = state.progress[pid] || { s: 0 };
    const old = prev.s || 0;
    if (old === s) return;
    const t = todayStr();
    // Registro de actividad: suma al subir, resta si deshaces algo marcado hoy
    if (s > old) logAdd(s - old);
    else {
      if (old >= 2 && s < 2 && prev.r === t) logAdd(-1);
      if (old >= 1 && s < 1 && prev.d === t) logAdd(-1);
    }
    if (s === 0) { delete state.progress[pid]; }
    else {
      const next = { s, d: prev.d || t };
      if (s >= 1 && old < 1) next.d = t;
      if (s === 2) next.r = old < 2 ? t : prev.r;
      state.progress[pid] = next;
    }
    save();
  }

  /* ───────────────────────── UI genérica ───────────────────────── */
  const view = $("#view");
  let toastTimer = null;
  function toast(msg, action) {
    const el = $("#toast");
    el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ""}`;
    el.hidden = false;
    if (action) $("button", el).onclick = () => { el.hidden = true; action.run(); };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, action ? 6000 : 2600);
  }

  let sheetOnClose = null;
  function openSheet(html, onMount, onClose) {
    const sh = $("#sheet");
    sh.innerHTML = `<div class="grab"></div>${html}`;
    sh.hidden = false; $("#sheetBackdrop").hidden = false;
    document.body.style.overflow = "hidden";
    sheetOnClose = onClose || null;
    onMount && onMount(sh);
  }
  function closeSheet() {
    $("#sheet").hidden = true; $("#sheetBackdrop").hidden = true;
    document.body.style.overflow = "";
    const cb = sheetOnClose; sheetOnClose = null;
    cb && cb();
  }
  $("#sheetBackdrop").addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#sheet").hidden) closeSheet(); });

  function confirmSheet({ title, text, ok = "Aceptar", danger = false, cancel = "Cancelar" }) {
    return new Promise((resolve) => {
      let result = false;
      openSheet(`
        <h3>${esc(title)}</h3>
        ${text ? `<p class="sheet-sub">${esc(text)}</p>` : ""}
        <div class="sheet-actions two">
          <button class="btn ghost" data-a="no">${esc(cancel)}</button>
          <button class="btn ${danger ? "danger" : ""}" data-a="ok">${esc(ok)}</button>
        </div>`, (sh) => {
        $('[data-a="ok"]', sh).onclick = () => { result = true; closeSheet(); };
        $('[data-a="no"]', sh).onclick = () => closeSheet();
      }, () => resolve(result));
    });
  }

  function bar(pS, pR, color, cls = "") {
    return `<div class="bar ${cls}" style="--c:${color}" role="img" aria-label="${pctStr(pS)}% estudiado, ${pctStr(pR)}% repasado">
      <i class="studied" style="width:${(pS * 100).toFixed(2)}%"></i><i class="reviewed" style="width:${(pR * 100).toFixed(2)}%"></i></div>`;
  }

  const ICON = {
    more: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="19" cy="12" r="1.8" fill="currentColor"/></svg>`,
    note: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 4h14v12l-4 4H5z M15 20v-4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    chev: `<svg class="chev" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    check: `<svg class="one" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    check2: `<svg class="two" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12.5l4 4L15 8M9.5 16.5L18 8M13 16.5l8.5-8.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    left: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    right: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    up: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    down: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  /* ───────────────────────── Router ───────────────────────── */
  const ui = { open: {}, edit: false, calMonth: null, calSel: null };
  function setHeader(title, { back = false, actions = "", sub = false } = {}) {
    $("#pageTitle").textContent = title;
    $("#backBtn").hidden = !back;
    $("#topActions").innerHTML = actions;
    $("#topbar").classList.toggle("sub", sub);
    document.title = title === "Temario" ? "Temario" : `${title} · Temario`;
  }
  $("#backBtn").addEventListener("click", () => {
    if (history.length > 1 && sessionStorage.getItem("temario.nav")) history.back();
    else location.hash = "#/asignaturas";
  });

  function route() {
    const h = location.hash.replace(/^#/, "") || "/";
    const parts = h.split("/").filter(Boolean);
    let tab = "home";
    if (parts[0] === "asignaturas") tab = "subjects";
    else if (parts[0] === "a") tab = "subjects";
    else if (parts[0] === "calendario") tab = "cal";
    else if (parts[0] === "ajustes") tab = "settings";
    $$(".tabbar a").forEach((a) => a.classList.toggle("active", a.dataset.tab === tab));
    const fab = $(".fab"); if (fab) fab.remove();

    if (parts[0] === "a" && parts[1] && subjById(parts[1])) renderSubject(subjById(parts[1]));
    else if (tab === "subjects") renderSubjects();
    else if (tab === "cal") renderCalendar();
    else if (tab === "settings") renderSettings();
    else renderHome();
  }
  window.addEventListener("hashchange", () => { $("#toast").hidden = true; sessionStorage.setItem("temario.nav", "1"); ui.edit = false; route(); window.scrollTo(0, 0); });

  /* ───────────────────────── Vista: Progreso ───────────────────────── */
  function backupDue() {
    const last = state.settings.lastBackup;
    const days = +state.settings.backupDays || 0;
    if (!days) return false;
    const anyProgress = Object.keys(state.progress).length > 0;
    if (!last) return anyProgress;
    return daysBetween(parseLocal(last), new Date()) >= days;
  }

  function ledgerRows(subjects) {
    return subjects.map((s) => {
      const st = subjStats(s);
      const p = pace(s);
      let meta = `<span>${st.studied}/${st.total} puntos · ${st.reviewed} repasados</span>`;
      let paceTxt = "";
      if (p) {
        paceTxt = p.remaining === 0
          ? `<span class="pace">Examen ${countdown(p.exam)}</span>`
          : `<span class="pace">${fmtNum(p.perDay)}/día · examen ${countdown(p.exam)}</span>`;
      }
      return `<a class="ledger-row" href="#/a/${s.id}" style="--c:${s.color}">
        <div class="ledger-line"><span class="dot"></span><span class="ledger-name">${esc(s.name)}</span><span class="ledger-pct">${pctStr(st.pS)}%</span></div>
        ${bar(st.pS, st.pR, s.color)}
        <div class="ledger-meta">${meta}${paceTxt}</div>
      </a>`;
    }).join("");
  }

  function evRow(e) {
    const s = subjById(e.sid);
    const d = evStart(e);
    const n = daysBetween(new Date(), d);
    const soon = n <= 7 ? "soon" : "";
    const time = hasTime(e.start) ? fmtTime(d) : "todo el día";
    const range = e.end && !hasTime(e.end) && e.end !== e.start ? ` → ${fmtDate(parseLocal(e.end))}` : (e.end && hasTime(e.end) && ymd(parseLocal(e.end)) !== ymd(d) ? ` → ${fmtDate(parseLocal(e.end))} ${fmtTime(parseLocal(e.end))}` : "");
    const typeLbl = e.type === "exam" ? "Examen" : e.type === "pec" ? "Entrega" : "Otro";
    return `<button class="ev-row" data-ev="${e.id}" style="--c:${s ? s.color : "var(--muted)"}">
      <div class="ev-when"><b>${d.getDate()}</b><span>${MON[d.getMonth()]}</span></div>
      <div class="ev-body">
        <div class="ev-title">${esc(e.title)}</div>
        <div class="ev-sub"><span class="tag ${e.type}">${typeLbl}</span><span>${WEEKDAY[d.getDay()]}, ${time}${range}</span></div>
      </div>
      <span class="chip ${e.type} ${soon}">${countdown(e)}</span>
    </button>`;
  }

  function weeksSvg() {
    const data = weeklyCounts(8);
    const max = Math.max(4, ...data.map((d) => d.sum));
    const W = 280, H = 96, padB = 16, bw = 22, gap = (W - bw * data.length) / (data.length - 1);
    const bars = data.map((d, i) => {
      const h = Math.max(2, (d.sum / max) * (H - padB - 14));
      const x = i * (bw + gap), y = H - padB - h;
      const cur = i === data.length - 1;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="5" fill="${cur ? "var(--accent)" : "color-mix(in srgb, var(--accent) 38%, var(--track))"}"><title>${d.sum} marcas, semana del ${fmtDate(d.start)}</title></rect>
        ${d.sum ? `<text x="${(x + bw / 2).toFixed(1)}" y="${(y - 3).toFixed(1)}" text-anchor="middle">${d.sum}</text>` : ""}
        <text x="${(x + bw / 2).toFixed(1)}" y="${H - 3}" text-anchor="middle">${d.start.getDate()}/${d.start.getMonth() + 1}</text>`;
    }).join("");
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Puntos marcados por semana">${bars}</svg>`;
  }

  function renderHome() {
    setHeader("Temario");
    const g = globalStats();
    const ups = upcomingEvents().slice(0, 5);
    const thisWeek = weeklyCounts(1)[0].sum;
    const uned = state.subjects.filter((s) => s.uni === "UNED");
    const liu = state.subjects.filter((s) => s.uni === "LiU");
    const others = state.subjects.filter((s) => s.uni !== "UNED" && s.uni !== "LiU");
    const groups = [["UNED", uned], ["LiU", liu], ["Otras", others]].filter(([, l]) => l.length);

    view.innerHTML = `
      <section class="card hero">
        <div class="hero-top">
          <div class="hero-pct num">${pctStr(g.pS)}<small>%</small></div>
          <div class="hero-side">
            <div><b class="num">${g.studied}</b> de <b class="num">${g.total}</b> puntos estudiados</div>
            <div><b class="num">${pctStr(g.pR)}%</b> repasado · quedan <b class="num">${g.total - g.studied}</b></div>
          </div>
        </div>
        ${bar(g.pS, g.pR, "var(--accent)", "thick")}
        <div class="legend"><span><i></i>Repasado</span><span><i class="soft"></i>Estudiado</span><span><i class="none"></i>Pendiente</span></div>
        ${backupDue() ? `<div class="banner"><p>${state.settings.lastBackup ? `Tu última copia es del ${fmtDate(parseLocal(state.settings.lastBackup), true)}.` : "Aún no has guardado ninguna copia de tu progreso."}</p><button class="btn small" id="quickBackup">Exportar</button></div>` : ""}
      </section>

      <section class="section">
        <div class="section-head"><h2>Próximas fechas</h2><a class="link" href="#/calendario">Calendario</a></div>
        <div class="card upcoming">${ups.length ? ups.map(evRow).join("") : `<div class="empty">No hay fechas próximas. Añádelas en Calendario.</div>`}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Por asignatura</h2></div>
        <div class="card ledger">
          ${groups.map(([name, list]) => `<div class="ledger-group">${esc(name)}</div>${ledgerRows(list)}`).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Constancia</h2></div>
        <div class="card activity">
          <div class="stats">
            <div class="stat"><b class="num">${streak()}</b><span>días seguidos</span></div>
            <div class="stat"><b class="num">${thisWeek}</b><span>marcas esta semana</span></div>
          </div>
          <div class="weeks">${weeksSvg()}</div>
        </div>
      </section>`;

    $$(".ev-row", view).forEach((b) => b.addEventListener("click", () => eventSheet(state.events.find((e) => e.id === b.dataset.ev))));
    const qb = $("#quickBackup"); if (qb) qb.addEventListener("click", exportJson);
  }

  /* ───────────────────────── Vista: Asignaturas ───────────────────────── */
  function renderSubjects() {
    setHeader("Asignaturas", { actions: `<button class="icon-btn text" id="addSubj">Añadir</button>` });
    const f = state.settings.uniFilter || "all";
    const unis = [...new Set(state.subjects.map((s) => s.uni))];
    const list = state.subjects.filter((s) => f === "all" || s.uni === f);
    const g = globalStats(list);
    view.innerHTML = `
      <div class="segmented" role="group" aria-label="Filtrar por universidad">
        <button aria-pressed="${f === "all"}" data-f="all">Todas</button>
        ${unis.map((u) => `<button aria-pressed="${f === u}" data-f="${esc(u)}">${esc(u)}</button>`).join("")}
      </div>
      <div class="card hero" style="padding:14px 16px">
        <div class="ledger-line" style="margin-bottom:8px"><span class="ledger-name">${f === "all" ? "Todas las asignaturas" : esc(f)}</span><span class="ledger-pct">${pctStr(g.pS)}%</span></div>
        ${bar(g.pS, g.pR, "var(--accent)")}
        <div class="ledger-meta"><span>${g.studied}/${g.total} estudiados</span><span>${pctStr(g.pR)}% repasado</span></div>
      </div>
      <div class="section"><div class="card ledger">${list.length ? ledgerRows(list) : `<div class="empty">No hay asignaturas.</div>`}</div></div>`;
    $$(".segmented button", view).forEach((b) => b.addEventListener("click", () => { state.settings.uniFilter = b.dataset.f; save(); renderSubjects(); }));
    $("#addSubj").addEventListener("click", () => subjectSheet(null));
  }

  function subjectSheet(subj) {
    const isNew = !subj;
    const s = subj || { id: "s" + uid(), uni: state.settings.uniFilter !== "all" ? state.settings.uniFilter : "UNED", code: "", short: "", name: "", color: "#2f6fdb", note: "", temas: [] };
    openSheet(`
      <h3>${isNew ? "Nueva asignatura" : "Editar asignatura"}</h3>
      <form id="sf">
        <label class="field"><span>Nombre</span><input name="name" required value="${esc(s.name)}"></label>
        <div class="field-row">
          <label class="field"><span>Código</span><input name="code" value="${esc(s.code)}"></label>
          <label class="field"><span>Universidad</span><input name="uni" value="${esc(s.uni)}" list="unis"></label>
        </div>
        <datalist id="unis">${[...new Set(state.subjects.map((x) => x.uni))].map((u) => `<option value="${esc(u)}">`).join("")}</datalist>
        <div class="field-row">
          <label class="field"><span>Nombre corto</span><input name="short" value="${esc(s.short)}"></label>
          <label class="field"><span>Color</span><input name="color" type="color" value="${esc(s.color)}"></label>
        </div>
        <label class="field"><span>Nota</span><input name="note" value="${esc(s.note)}"></label>
        <div class="sheet-actions">
          <button class="btn" type="submit">${isNew ? "Crear asignatura" : "Guardar cambios"}</button>
          ${isNew ? "" : `<button class="btn danger" type="button" id="delSubj">Eliminar asignatura</button>`}
        </div>
      </form>`, (sh) => {
      $("#sf", sh).addEventListener("submit", (ev) => {
        ev.preventDefault();
        const fd = new FormData(ev.target);
        Object.assign(s, { name: fd.get("name").trim(), code: fd.get("code").trim(), uni: fd.get("uni").trim() || "Otras", short: fd.get("short").trim(), color: fd.get("color"), note: fd.get("note").trim() });
        if (isNew) { s.temas = [{ id: s.id + "-" + uid(), title: "Tema 1", points: [] }]; state.subjects.push(s); }
        save(); closeSheet();
        if (isNew) { ui.edit = true; location.hash = `#/a/${s.id}`; } else route();
      });
      const del = $("#delSubj", sh);
      if (del) del.addEventListener("click", async () => {
        closeSheet();
        const ok = await confirmSheet({ title: `¿Eliminar ${s.name}?`, text: "Se borran su temario, su progreso y sus fechas. No se puede deshacer salvo con una copia.", ok: "Eliminar", danger: true });
        if (!ok) return;
        allPoints(s).forEach((p) => { delete state.progress[p.id]; delete state.notes[p.id]; });
        state.subjects = state.subjects.filter((x) => x.id !== s.id);
        state.events = state.events.filter((e) => e.sid !== s.id);
        save(); location.hash = "#/asignaturas";
      });
    });
  }

  /* ───────────────────────── Vista: detalle de asignatura ───────────────────────── */
  function renderSubject(subj) {
    setHeader(subj.short || subj.name, {
      back: true, sub: true,
      actions: `<button class="icon-btn text" id="editToggle">${ui.edit ? "Listo" : "Editar"}</button><button class="icon-btn" id="subjMore" aria-label="Más opciones">${ICON.more}</button>`
    });
    const st = subjStats(subj);
    const p = pace(subj);
    const pec = nextPec(subj.id);
    let paceHtml = "";
    if (p) {
      const d = evStart(p.exam);
      if (p.remaining > 0) {
        paceHtml = `<div class="pace-box"><span class="pace-num num">${fmtNum(p.perDay)}</span> puntos/día para acabar el temario antes del examen del <b>${fmtDate(d)}</b> (${countdown(p.exam)}).
        ${p.remainingRev > 0 ? `<div class="muted small" style="margin-top:4px">Para tenerlo todo repasado: ${fmtNum(p.perDayRev)} puntos/día.</div>` : ""}</div>`;
      } else if (p.remainingRev > 0) {
        paceHtml = `<div class="pace-box">Temario completo. Te quedan <b>${p.remainingRev}</b> puntos por repasar: <b>${fmtNum(p.perDayRev)}</b>/día hasta el examen del ${fmtDate(d)} (${countdown(p.exam)}).</div>`;
      } else {
        paceHtml = `<div class="pace-box">Todo estudiado y repasado. Examen el ${fmtDate(d)} (${countdown(p.exam)}).</div>`;
      }
    } else {
      paceHtml = `<div class="pace-box muted">Sin examen próximo en el calendario. Añádelo para ver el ritmo que necesitas.</div>`;
    }

    view.innerHTML = `
      <section class="card subj-head" style="--c:${subj.color}">
        <div class="subj-code">${esc(subj.uni)}${subj.code ? " · " + esc(subj.code) : ""}</div>
        <h2 class="subj-name">${esc(subj.name)}</h2>
        ${bar(st.pS, st.pR, subj.color, "thick")}
        <div class="subj-figs">
          <div class="fig"><b>${pctStr(st.pS)}%</b><span>estudiado</span></div>
          <div class="fig"><b>${pctStr(st.pR)}%</b><span>repasado</span></div>
          <div class="fig"><b>${st.total - st.studied}</b><span>pendientes</span></div>
        </div>
        ${paceHtml}
        ${pec ? `<div class="kv" style="margin:10px 0 0">Próxima entrega: <b>${esc(pec.title)}</b> · ${fmtDate(evStart(pec))} (${countdown(pec)})</div>` : ""}
      </section>
      ${subj.note ? `<p class="subj-note">${esc(subj.note)}</p>` : ""}
      <div class="temas" id="temas">${ui.edit ? temasEditHtml(subj) : temasHtml(subj)}</div>`;

    $("#editToggle").addEventListener("click", () => { ui.edit = !ui.edit; renderSubject(subj); });
    $("#subjMore").addEventListener("click", () => subjectMenu(subj));
    if (ui.edit) bindEdit(subj); else bindTemas(subj);
  }

  function temasHtml(subj) {
    if (!subj.temas.length) return `<div class="empty">Este temario está vacío. Pulsa Editar para añadir temas y puntos.</div>`;
    return subj.temas.map((t, i) => {
      const st = statsOfPoints(t.points);
      const open = !!ui.open[t.id];
      const done = st.total && st.reviewed === st.total;
      return `<article class="card tema ${open ? "open" : ""} ${done ? "done" : ""}" data-t="${t.id}" style="--c:${subj.color}">
        <button class="tema-head" aria-expanded="${open}">
          <span class="tema-n">${i + 1}</span>
          <span>
            <span class="tema-title">${esc(t.title)}</span>
            <span class="tema-sub">${bar(st.pS, st.pR, subj.color, "thin")}<span>${st.studied}/${st.total}</span></span>
          </span>
          ${ICON.chev}
        </button>
        ${open ? `<div class="tema-body">
          <div class="tema-tools">
            <span class="tools-lbl">Marcar tema</span>
            <button class="btn small ghost" data-all="1">Estudiado</button>
            <button class="btn small ghost" data-all="2">Repasado</button>
            <button class="btn small ghost" data-all="0">Pendiente</button>
          </div>
          ${t.points.map((p) => pointHtml(p)).join("") || `<div class="empty" style="margin:10px">Sin puntos.</div>`}
        </div>` : ""}
      </article>`;
    }).join("");
  }

  function pointHtml(p) {
    const pr = state.progress[p.id];
    const s = (pr && pr.s) || 0;
    const note = state.notes[p.id];
    const label = ["Pendiente", "Estudiado", "Repasado"][s];
    let meta = "";
    if (pr && pr.d) meta += `Estudiado ${fmtDate(parseLocal(pr.d))}`;
    if (pr && pr.r) meta += ` · repasado ${fmtDate(parseLocal(pr.r))}`;
    if (note) meta += `${meta ? " · " : ""}<span class="note-flag">nota</span>`;
    return `<div class="point" data-p="${p.id}" data-s="${s}">
      <button class="state-btn" aria-label="${esc(p.title)}: ${label}. Cambiar estado"><span class="state">${ICON.check}${ICON.check2}</span></button>
      <div class="point-text">${esc(p.title)}${meta ? `<span class="point-meta">${meta}</span>` : ""}</div>
      <button class="more-btn" aria-label="Detalles y nota">${note ? ICON.note : ICON.more}</button>
    </div>`;
  }

  function refreshHeadStats(subj) {
    // Re-render ligero de la cabecera y de la barra del tema sin perder la posición
    const y = window.scrollY;
    renderSubject(subj);
    window.scrollTo(0, y);
  }

  function bindTemas(subj) {
    $$(".tema", view).forEach((art) => {
      const tid = art.dataset.t;
      const tema = subj.temas.find((t) => t.id === tid);
      $(".tema-head", art).addEventListener("click", () => { ui.open[tid] = !ui.open[tid]; refreshHeadStats(subj); });
      $$("[data-all]", art).forEach((b) => b.addEventListener("click", () => {
        const s = +b.dataset.all;
        const before = tema.points.map((p) => [p.id, stateOf(p.id)]);
        tema.points.forEach((p) => setPoint(p.id, s));
        vibrate(14);
        refreshHeadStats(subj);
        toast(s === 0 ? "Tema desmarcado" : s === 1 ? "Tema marcado como estudiado" : "Tema marcado como repasado", {
          label: "Deshacer", run: () => { before.forEach(([pid, old]) => setPoint(pid, old)); refreshHeadStats(subj); }
        });
      }));
      $$(".point", art).forEach((row) => {
        const pid = row.dataset.p;
        $(".state-btn", row).addEventListener("click", () => {
          const s = (stateOf(pid) + 1) % 3;
          setPoint(pid, s);
          vibrate(s ? 10 : 6);
          refreshHeadStats(subj);
        });
        $(".more-btn", row).addEventListener("click", () => {
          const point = tema.points.find((x) => x.id === pid);
          pointSheet(subj, tema, point);
        });
      });
    });
  }

  function pointSheet(subj, tema, point) {
    const pr = state.progress[point.id] || {};
    let s = pr.s || 0;
    openSheet(`
      <h3>${esc(point.title)}</h3>
      <p class="sheet-sub">${esc(subj.short || subj.name)} · ${esc(tema.title)}</p>
      <div class="state-pick" style="--c:${subj.color}">
        <button data-s="0" aria-pressed="${s === 0}">Pendiente</button>
        <button data-s="1" aria-pressed="${s === 1}">Estudiado</button>
        <button data-s="2" aria-pressed="${s === 2}">Repasado</button>
      </div>
      ${pr.d || pr.r ? `<p class="kv">${pr.d ? `Estudiado el ${fmtDate(parseLocal(pr.d), true)}` : ""}${pr.r ? ` · repasado el ${fmtDate(parseLocal(pr.r), true)}` : ""}</p>` : ""}
      <label class="field"><span>Nota</span><textarea id="noteTa" placeholder="Dudas, ejercicios hechos, páginas del libro…">${esc(state.notes[point.id] || "")}</textarea></label>
      <div class="sheet-actions"><button class="btn" id="noteSave">Guardar</button></div>`, (sh) => {
      $$(".state-pick button", sh).forEach((b) => b.addEventListener("click", () => {
        s = +b.dataset.s;
        $$(".state-pick button", sh).forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.s === s)));
      }));
      $("#noteSave", sh).addEventListener("click", () => {
        setPoint(point.id, s);
        const txt = $("#noteTa", sh).value.trim();
        if (txt) state.notes[point.id] = txt; else delete state.notes[point.id];
        save(); closeSheet(); refreshHeadStats(subj);
      });
    });
  }

  function subjectMenu(subj) {
    openSheet(`
      <h3>${esc(subj.name)}</h3>
      <div class="card list" style="box-shadow:none;background:var(--surface-2)">
        <button class="list-row" data-a="edit"><span class="grow">Editar nombre, código y color</span></button>
        <button class="list-row" data-a="expand"><span class="grow">Desplegar todos los temas</span></button>
        <button class="list-row" data-a="collapse"><span class="grow">Plegar todos los temas</span></button>
        <button class="list-row" data-a="addev"><span class="grow">Añadir examen o entrega</span></button>
        <button class="list-row danger" data-a="reset"><span class="grow">Borrar el progreso de esta asignatura</span></button>
      </div>`, (sh) => {
      $$("[data-a]", sh).forEach((b) => b.addEventListener("click", async () => {
        const a = b.dataset.a;
        if (a === "edit") { closeSheet(); subjectSheet(subj); }
        if (a === "expand") { subj.temas.forEach((t) => (ui.open[t.id] = true)); closeSheet(); renderSubject(subj); }
        if (a === "collapse") { subj.temas.forEach((t) => (ui.open[t.id] = false)); closeSheet(); renderSubject(subj); }
        if (a === "addev") { closeSheet(); eventSheet(null, { sid: subj.id }); }
        if (a === "reset") {
          closeSheet();
          const ok = await confirmSheet({ title: "¿Borrar el progreso?", text: `Todos los puntos de ${subj.name} vuelven a pendiente. Las notas se conservan.`, ok: "Borrar progreso", danger: true });
          if (ok) { allPoints(subj).forEach((p) => delete state.progress[p.id]); save(); renderSubject(subj); }
        }
      }));
    });
  }

  /* Modo edición del temario */
  function temasEditHtml(subj) {
    return subj.temas.map((t, i) => `
      <article class="card tema" data-t="${t.id}" style="--c:${subj.color}">
        <div class="tema-edit">
          <input value="${esc(t.title)}" data-tt aria-label="Título del tema ${i + 1}">
          <button class="mini-btn" data-tm="-1" aria-label="Subir tema">${ICON.up}</button>
          <button class="mini-btn" data-tm="1" aria-label="Bajar tema">${ICON.down}</button>
          <button class="mini-btn del" data-tdel aria-label="Eliminar tema">${ICON.trash}</button>
        </div>
        <div class="tema-body">
          ${t.points.map((p) => `<div class="edit-row" data-p="${p.id}">
            <input value="${esc(p.title)}" data-pt aria-label="Punto">
            <button class="mini-btn" data-pm="-1" aria-label="Subir punto">${ICON.up}</button>
            <button class="mini-btn" data-pm="1" aria-label="Bajar punto">${ICON.down}</button>
            <button class="mini-btn del" data-pdel aria-label="Eliminar punto">${ICON.trash}</button>
          </div>`).join("")}
          <div class="add-row"><button class="btn small ghost" data-padd>Añadir punto</button></div>
        </div>
      </article>`).join("") + `<button class="btn block ghost" id="addTema">Añadir tema</button>`;
  }

  function bindEdit(subj) {
    const rerender = () => { const y = window.scrollY; $("#temas").innerHTML = temasEditHtml(subj); bindEdit(subj); window.scrollTo(0, y); };
    $$(".tema", view).forEach((art) => {
      const t = subj.temas.find((x) => x.id === art.dataset.t);
      $("[data-tt]", art).addEventListener("change", (e) => { t.title = e.target.value.trim() || t.title; save(); });
      $$("[data-tm]", art).forEach((b) => b.addEventListener("click", () => {
        const i = subj.temas.indexOf(t), j = i + +b.dataset.tm;
        if (j < 0 || j >= subj.temas.length) return;
        [subj.temas[i], subj.temas[j]] = [subj.temas[j], subj.temas[i]]; save(); rerender();
      }));
      $("[data-tdel]", art).addEventListener("click", async () => {
        const ok = await confirmSheet({ title: `¿Eliminar "${t.title}"?`, text: `Se borran sus ${t.points.length} puntos y su progreso.`, ok: "Eliminar", danger: true });
        if (!ok) return;
        t.points.forEach((p) => { delete state.progress[p.id]; delete state.notes[p.id]; });
        subj.temas = subj.temas.filter((x) => x !== t); save(); rerender();
      });
      $$(".edit-row", art).forEach((row) => {
        const p = t.points.find((x) => x.id === row.dataset.p);
        $("[data-pt]", row).addEventListener("change", (e) => { p.title = e.target.value.trim() || p.title; save(); });
        $$("[data-pm]", row).forEach((b) => b.addEventListener("click", () => {
          const i = t.points.indexOf(p), j = i + +b.dataset.pm;
          if (j < 0 || j >= t.points.length) return;
          [t.points[i], t.points[j]] = [t.points[j], t.points[i]]; save(); rerender();
        }));
        $("[data-pdel]", row).addEventListener("click", () => {
          const idx = t.points.indexOf(p);
          const saved = { pr: state.progress[p.id], note: state.notes[p.id] };
          t.points.splice(idx, 1); delete state.progress[p.id]; delete state.notes[p.id]; save(); rerender();
          toast("Punto eliminado", { label: "Deshacer", run: () => {
            t.points.splice(idx, 0, p); if (saved.pr) state.progress[p.id] = saved.pr; if (saved.note) state.notes[p.id] = saved.note; save(); rerender();
          } });
        });
      });
      $("[data-padd]", art).addEventListener("click", () => {
        t.points.push({ id: `${t.id}-${uid()}`, title: "Nuevo punto" }); save(); rerender();
        const inputs = $$(`.tema[data-t="${t.id}"] [data-pt]`); const last = inputs[inputs.length - 1];
        if (last) { last.focus(); last.select(); }
      });
    });
    $("#addTema").addEventListener("click", () => {
      subj.temas.push({ id: `${subj.id}-${uid()}`, title: `Tema ${subj.temas.length + 1}`, points: [] }); save(); rerender();
    });
  }

  /* ───────────────────────── Vista: Calendario ───────────────────────── */
  function renderCalendar() {
    setHeader("Calendario", { actions: `<button class="icon-btn" id="calMore" aria-label="Importar o exportar">${ICON.more}</button>` });
    const now = new Date();
    if (!ui.calMonth) ui.calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const m = ui.calMonth;
    const first = new Date(m.getFullYear(), m.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const gridStart = new Date(first); gridStart.setDate(1 - offset);
    const byDay = {};
    for (const e of state.events) {
      const s = startOfDay(evStart(e));
      const end = e.type === "pec" ? startOfDay(evEnd(e)) : s;
      // Las entregas se marcan el día de cierre (y el de inicio si es distinto)
      const keys = new Set([ymd(s), ymd(end)]);
      keys.forEach((k) => (byDay[k] = byDay[k] || []).push(e));
    }
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart); d.setDate(gridStart.getDate() + i);
      const k = ymd(d);
      const evs = byDay[k] || [];
      const cls = [d.getMonth() !== m.getMonth() ? "out" : "", k === todayStr() ? "today" : "", k === ui.calSel ? "sel" : "", evs.some((e) => e.type === "exam") ? "has-exam" : ""].join(" ");
      cells.push(`<button class="cal-day ${cls}" data-d="${k}" aria-label="${d.getDate()} de ${MONTHS[d.getMonth()]}${evs.length ? `, ${evs.length} eventos` : ""}">
        <span class="d">${d.getDate()}</span>
        <span class="cal-dots">${evs.slice(0, 4).map((e) => `<i class="${e.type}" style="--c:${(subjById(e.sid) || {}).color || "var(--muted)"}"></i>`).join("")}</span>
      </button>`);
      if (i === 34 && new Date(gridStart.getTime() + 35 * 864e5).getMonth() !== m.getMonth()) break;
    }
    const sel = ui.calSel;
    const selEvents = sel ? (byDay[sel] || []).sort((a, b) => evStart(a) - evStart(b)) : [];
    const ups = upcomingEvents();

    view.innerHTML = `
      <section class="card cal">
        <div class="cal-head">
          <button class="icon-btn" id="prevM" aria-label="Mes anterior">${ICON.left}</button>
          <h2>${MONTHS[m.getMonth()]} ${m.getFullYear()}</h2>
          <button class="icon-btn" id="nextM" aria-label="Mes siguiente">${ICON.right}</button>
        </div>
        <div class="cal-grid">${DOW.map((d) => `<div class="cal-dow">${d}</div>`).join("")}${cells.join("")}</div>
        <div class="cal-legend"><span><span class="dot" style="--c:var(--ink)"></span>color de la asignatura</span><span>anillo rojo: examen</span><span>cuadrado: entrega</span></div>
      </section>
      ${sel ? `<section class="section"><div class="section-head"><h2>${(() => { const d = parseLocal(sel); return `${WEEKDAY[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`; })()}</h2><button class="link" id="addOnDay">Añadir</button></div>
        <div class="card upcoming">${selEvents.length ? selEvents.map(evRow).join("") : `<div class="empty">Nada este día.</div>`}</div></section>` : ""}
      <section class="section">
        <div class="section-head"><h2>Próximas fechas</h2><span class="muted small">${ups.length} pendientes</span></div>
        <div class="card upcoming">${ups.length ? ups.map(evRow).join("") : `<div class="empty">No hay fechas próximas.</div>`}</div>
      </section>`;

    const fab = document.createElement("button");
    fab.className = "fab"; fab.setAttribute("aria-label", "Añadir fecha"); fab.innerHTML = ICON.plus;
    fab.addEventListener("click", () => eventSheet(null, { date: ui.calSel }));
    document.body.appendChild(fab);

    $("#prevM").addEventListener("click", () => { ui.calMonth = new Date(m.getFullYear(), m.getMonth() - 1, 1); renderCalendar(); });
    $("#nextM").addEventListener("click", () => { ui.calMonth = new Date(m.getFullYear(), m.getMonth() + 1, 1); renderCalendar(); });
    $$(".cal-day", view).forEach((b) => b.addEventListener("click", () => {
      ui.calSel = ui.calSel === b.dataset.d ? null : b.dataset.d;
      const d = parseLocal(b.dataset.d);
      if (d.getMonth() !== m.getMonth()) ui.calMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      renderCalendar();
    }));
    $$(".ev-row", view).forEach((b) => b.addEventListener("click", () => eventSheet(state.events.find((e) => e.id === b.dataset.ev))));
    const aod = $("#addOnDay"); if (aod) aod.addEventListener("click", () => eventSheet(null, { date: ui.calSel }));
    $("#calMore").addEventListener("click", () => openSheet(`
      <h3>Fechas</h3>
      <div class="card list" style="box-shadow:none;background:var(--surface-2)">
        <button class="list-row" data-a="imp"><span class="grow">Importar archivo .ics<small>Desde Calendario de Apple, Google o TimeEdit</small></span></button>
        <button class="list-row" data-a="exp"><span class="grow">Exportar fechas a .ics<small>Para añadirlas a otro calendario</small></span></button>
        <button class="list-row" data-a="past"><span class="grow">Ver fechas pasadas</span></button>
      </div>`, (sh) => {
      $('[data-a="imp"]', sh).onclick = () => { closeSheet(); $("#fileIcs").click(); };
      $('[data-a="exp"]', sh).onclick = () => { closeSheet(); exportIcs(); };
      $('[data-a="past"]', sh).onclick = () => { closeSheet(); pastSheet(); };
    }));
  }

  function pastSheet() {
    const now = new Date();
    const past = sortedEvents().filter((e) => evEnd(e) < now).reverse();
    openSheet(`<h3>Fechas pasadas</h3><div class="card upcoming" style="box-shadow:none;background:var(--surface-2)">${past.length ? past.map(evRow).join("") : `<div class="empty">Ninguna todavía.</div>`}</div>`, (sh) => {
      $$(".ev-row", sh).forEach((b) => b.addEventListener("click", () => { closeSheet(); eventSheet(state.events.find((e) => e.id === b.dataset.ev)); }));
    });
  }

  function eventSheet(ev, preset = {}) {
    const isNew = !ev;
    const e = ev || { id: uid(), sid: preset.sid || (state.subjects[0] && state.subjects[0].id) || "", type: "exam", title: "", start: (preset.date || todayStr()) + "T09:00", end: "", allDay: false };
    const sDate = e.start.slice(0, 10), sTime = hasTime(e.start) ? e.start.slice(11, 16) : "09:00";
    const eDate = e.end ? e.end.slice(0, 10) : "", eTime = e.end && hasTime(e.end) ? e.end.slice(11, 16) : "";
    openSheet(`
      <h3>${isNew ? "Nueva fecha" : "Editar fecha"}</h3>
      <form id="ef">
        <label class="field"><span>Título</span><input name="title" required value="${esc(e.title)}" placeholder="Examen, PEC 2, entrega…"></label>
        <div class="field-row">
          <label class="field"><span>Asignatura</span><select name="sid">${state.subjects.map((s) => `<option value="${s.id}" ${s.id === e.sid ? "selected" : ""}>${esc(s.short || s.name)}</option>`).join("")}<option value="" ${!e.sid ? "selected" : ""}>Ninguna</option></select></label>
          <label class="field"><span>Tipo</span><select name="type">
            <option value="exam" ${e.type === "exam" ? "selected" : ""}>Examen</option>
            <option value="pec" ${e.type === "pec" ? "selected" : ""}>PEC / entrega</option>
            <option value="other" ${e.type === "other" ? "selected" : ""}>Otro</option></select></label>
        </div>
        <label class="switch-row"><span>Todo el día</span><input type="checkbox" name="allDay" ${e.allDay ? "checked" : ""}></label>
        <div class="field-row">
          <label class="field"><span>Inicio</span><input type="date" name="sDate" required value="${sDate}"></label>
          <label class="field time"><span>Hora</span><input type="time" name="sTime" value="${sTime}"></label>
        </div>
        <div class="field-row">
          <label class="field"><span>Fin (opcional)</span><input type="date" name="eDate" value="${eDate}"></label>
          <label class="field time"><span>Hora fin</span><input type="time" name="eTime" value="${eTime}"></label>
        </div>
        <div class="sheet-actions">
          <button class="btn" type="submit">${isNew ? "Añadir fecha" : "Guardar cambios"}</button>
          ${isNew ? "" : `<button class="btn danger" type="button" id="evDel">Eliminar fecha</button>`}
        </div>
      </form>`, (sh) => {
      const f = $("#ef", sh);
      const syncTime = () => $$(".field.time", sh).forEach((el) => (el.style.display = f.allDay.checked ? "none" : ""));
      f.allDay.addEventListener("change", syncTime); syncTime();
      f.addEventListener("submit", (x) => {
        x.preventDefault();
        const all = f.allDay.checked;
        e.title = f.title.value.trim(); e.sid = f.sid.value; e.type = f.type.value; e.allDay = all;
        e.start = all ? f.sDate.value : `${f.sDate.value}T${f.sTime.value || "09:00"}`;
        if (f.eDate.value) e.end = all ? f.eDate.value : `${f.eDate.value}T${f.eTime.value || f.sTime.value || "10:00"}`;
        else if (!all && f.eTime.value) e.end = `${f.sDate.value}T${f.eTime.value}`;
        else e.end = "";
        if (isNew) state.events.push(e);
        save(); closeSheet(); route(); toast(isNew ? "Fecha añadida" : "Fecha guardada");
      });
      const del = $("#evDel", sh);
      if (del) del.addEventListener("click", () => {
        const idx = state.events.indexOf(e);
        state.events.splice(idx, 1); save(); closeSheet(); route();
        toast("Fecha eliminada", { label: "Deshacer", run: () => { state.events.splice(idx, 0, e); save(); route(); } });
      });
    });
  }

  /* ───────────────────────── ICS ───────────────────────── */
  function icsUnfold(text) { return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, ""); }
  function icsUnescape(v) { return v.replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1").trim(); }
  function icsDate(val, params) {
    // Devuelve {s: "YYYY-MM-DD" | "YYYY-MM-DDTHH:MM", allDay}
    const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(val.trim());
    if (!m) return null;
    if (!m[4] || /VALUE=DATE(?!-)/.test(params)) return { s: `${m[1]}-${m[2]}-${m[3]}`, allDay: true };
    if (m[7]) {
      const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
      return { s: `${ymd(d)}T${fmtTime(d)}`, allDay: false };
    }
    return { s: `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`, allDay: false };
  }
  function parseIcs(text) {
    const lines = icsUnfold(text).split("\n");
    const out = []; let cur = null;
    for (const line of lines) {
      if (line === "BEGIN:VEVENT") { cur = {}; continue; }
      if (line === "END:VEVENT") { if (cur && cur.start) out.push(cur); cur = null; continue; }
      if (!cur) continue;
      const i = line.indexOf(":"); if (i < 0) continue;
      const left = line.slice(0, i), val = line.slice(i + 1);
      const [name, ...params] = left.split(";");
      const p = params.join(";");
      if (name === "SUMMARY") cur.title = icsUnescape(val);
      else if (name === "DESCRIPTION") cur.desc = icsUnescape(val);
      else if (name === "DTSTART") { const d = icsDate(val, p); if (d) { cur.start = d.s; cur.allDay = d.allDay; } }
      else if (name === "DTEND") { const d = icsDate(val, p); if (d) { cur.end = d.s; cur.endAllDay = d.allDay; } }
    }
    // DTEND de día completo es exclusivo
    out.forEach((e) => {
      if (e.allDay && e.end) {
        const d = parseLocal(e.end); d.setDate(d.getDate() - 1);
        e.end = ymd(d) === e.start ? "" : ymd(d);
      }
    });
    return out;
  }
  const KEYWORDS = [
    ["ff3", /fundamentos de f[ií]sica (iii|3)|61042018/i], ["mm2", /m[eé]todos matem[aá]ticos (ii|2)|61042024/i],
    ["mec", /mec[aá]nica|61042107/i], ["em1", /electromagnetismo (i|1)\b|61042030/i], ["fc2", /f[ií]sica computacional|61042047/i],
    ["td1", /termodin[aá]mica|61043029/i]
  ];
  function guessSid(text) {
    for (const s of state.subjects) if (s.code && new RegExp(`\\b${s.code}\\b`, "i").test(text)) return s.id;
    for (const [sid, re] of KEYWORDS) if (re.test(text) && subjById(sid)) return sid;
    for (const s of state.subjects) if (s.name && text.toLowerCase().includes(s.name.toLowerCase())) return s.id;
    return "";
  }
  function guessType(text) {
    if (/\bPEC\b|entrega|deadline|report due|inlämning|\bPED\b|\bPEL\b/i.test(text)) return "pec";
    if (/examen|exam\b|tentamen|\bTEN\d?\b|tenta\b|prueba presencial/i.test(text)) return "exam";
    return "other";
  }
  $("#fileIcs").addEventListener("change", async (ev) => {
    const file = ev.target.files[0]; ev.target.value = "";
    if (!file) return;
    let items;
    try { items = parseIcs(await file.text()); } catch (e) { toast("No se pudo leer el archivo .ics"); return; }
    if (!items.length) { toast("El archivo no contiene eventos"); return; }
    const mapped = items.map((it) => {
      const text = `${it.title || ""} ${it.desc || ""}`;
      return { id: uid(), sid: guessSid(text), type: guessType(text), title: it.title || "Evento", start: it.start, end: it.end || "", allDay: !!it.allDay };
    });
    const key = (e) => `${e.title.toLowerCase()}|${e.start.slice(0, 10)}`;
    const existing = new Set(state.events.map(key));
    const fresh = mapped.filter((e) => !existing.has(key(e)));
    const important = fresh.filter((e) => e.type !== "other");
    const dupes = mapped.length - fresh.length;
    openSheet(`
      <h3>Importar fechas</h3>
      <p class="sheet-sub">${mapped.length} eventos en el archivo${dupes ? `, ${dupes} ya estaban` : ""}. ${important.length} parecen exámenes o entregas.</p>
      <div class="sheet-actions">
        <button class="btn" data-a="imp" ${important.length ? "" : "disabled"}>Importar ${important.length} exámenes y entregas</button>
        <button class="btn ghost" data-a="all" ${fresh.length ? "" : "disabled"}>Importar los ${fresh.length} eventos nuevos</button>
      </div>
      <p class="kv" style="margin-top:12px">Después puedes cambiar la asignatura o el tipo de cada fecha tocándola.</p>`, (sh) => {
      const go = (list) => { state.events.push(...list); save(); closeSheet(); route(); toast(`${list.length} fechas importadas`); };
      $('[data-a="imp"]', sh).onclick = () => go(important);
      $('[data-a="all"]', sh).onclick = () => go(fresh);
    });
  });

  function icsEscape(s) { return String(s).replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n"); }
  function icsStamp(d) { return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`; }
  const icsDay = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  function exportIcs() {
    const now = icsStamp(new Date());
    const vevents = state.events.map((e) => {
      const s = subjById(e.sid);
      const st = evStart(e);
      const lines = ["BEGIN:VEVENT", `UID:${e.id}@temario`, `DTSTAMP:${now}`, `SUMMARY:${icsEscape(e.title)}`];
      if (!hasTime(e.start)) {
        const endD = e.end ? parseLocal(e.end) : new Date(st); endD.setDate(endD.getDate() + 1);
        lines.push(`DTSTART;VALUE=DATE:${icsDay(st)}`, `DTEND;VALUE=DATE:${icsDay(endD)}`);
      } else {
        const en = e.end ? parseLocal(e.end) : new Date(st.getTime() + 2 * 3600e3);
        lines.push(`DTSTART:${icsStamp(st)}`, `DTEND:${icsStamp(en)}`);
      }
      if (s) lines.push(`DESCRIPTION:${icsEscape(`${s.name}${s.code ? " (" + s.code + ")" : ""}`)}`);
      lines.push(`CATEGORIES:${e.type === "exam" ? "Examen" : e.type === "pec" ? "Entrega" : "Otro"}`, "END:VEVENT");
      return lines.join("\r\n");
    });
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Temario//ES", "CALSCALE:GREGORIAN", ...vevents, "END:VCALENDAR"].join("\r\n");
    shareOrDownload(new Blob([ics], { type: "text/calendar" }), `temario-fechas-${todayStr()}.ics`, "Fechas de examen");
  }

  /* ───────────────────────── Copias de seguridad ───────────────────────── */
  async function shareOrDownload(blob, filename, title) {
    const file = new File([blob], filename, { type: blob.type });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        await navigator.share({ files: [file], title });
        return true;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return false;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  }
  async function exportJson() {
    saveNow();
    const data = Object.assign({ app: "temario", exportedAt: new Date().toISOString() }, state);
    const ok = await shareOrDownload(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), `temario-copia-${todayStr()}.json`, "Copia de Temario");
    if (ok) { state.settings.lastBackup = todayStr(); save(); toast("Copia exportada"); route(); }
  }
  $("#fileJson").addEventListener("change", async (ev) => {
    const file = ev.target.files[0]; ev.target.value = "";
    if (!file) return;
    let data;
    try { data = JSON.parse(await file.text()); } catch (e) { toast("El archivo no es un JSON válido"); return; }
    if (!data || !Array.isArray(data.subjects) || typeof data.progress !== "object") { toast("Este archivo no es una copia de Temario"); return; }
    const n = Object.keys(data.progress).length;
    const when = data.exportedAt ? fmtDate(new Date(data.exportedAt), true) : "fecha desconocida";
    const ok = await confirmSheet({ title: "¿Restaurar esta copia?", text: `Copia del ${when} con ${data.subjects.length} asignaturas y ${n} puntos marcados. Sustituye todo lo que hay ahora en este dispositivo.`, ok: "Restaurar" });
    if (!ok) return;
    delete data.app; delete data.exportedAt;
    state = normalize(data); saveNow(); applyTheme(); route(); toast("Copia restaurada");
  });

  /* ───────────────────────── Vista: Ajustes ───────────────────────── */
  function renderSettings() {
    setHeader("Ajustes");
    const s = state.settings;
    const nMarked = Object.keys(state.progress).length;
    view.innerHTML = `
      <section class="section" style="margin-top:6px">
        <div class="section-head"><h2>Copia de seguridad</h2></div>
        <div class="card list">
          <button class="list-row" id="expJson"><span class="grow">Exportar copia (.json)<small>${s.lastBackup ? `Última: ${fmtDate(parseLocal(s.lastBackup), true)}` : "Todavía no has exportado ninguna"} · ${nMarked} puntos marcados</small></span></button>
          <button class="list-row" id="impJson"><span class="grow">Restaurar una copia<small>Sustituye los datos de este dispositivo</small></span></button>
          <div class="list-row"><span class="grow">Recordarme exportar</span>
            <select id="bkDays">${[[0, "Nunca"], [3, "Cada 3 días"], [7, "Cada semana"], [14, "Cada 2 semanas"], [30, "Cada mes"]].map(([v, l]) => `<option value="${v}" ${+s.backupDays === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Fechas</h2></div>
        <div class="card list">
          <button class="list-row" id="impIcs"><span class="grow">Importar archivo .ics<small>Exámenes y PEC desde tu calendario</small></span></button>
          <button class="list-row" id="expIcs"><span class="grow">Exportar fechas a .ics</span></button>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Preferencias</h2></div>
        <div class="card list">
          <div class="list-row"><span class="grow">Porcentaje global<small>Cómo se combinan las asignaturas</small></span>
            <select id="weight"><option value="subject" ${s.weight === "subject" ? "selected" : ""}>Igual peso por asignatura</option><option value="points" ${s.weight === "points" ? "selected" : ""}>Por número de puntos</option></select></div>
          <div class="list-row"><span class="grow">Apariencia</span>
            <select id="theme"><option value="auto" ${s.theme === "auto" ? "selected" : ""}>Automática</option><option value="light" ${s.theme === "light" ? "selected" : ""}>Clara</option><option value="dark" ${s.theme === "dark" ? "selected" : ""}>Oscura</option></select></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Restablecer</h2></div>
        <div class="card list">
          <button class="list-row" id="resetSyl"><span class="grow">Recuperar el temario original<small>Conserva el progreso de los puntos que siguen existiendo</small></span></button>
          <button class="list-row" id="resetEv"><span class="grow">Recuperar las fechas originales<small>Las del calendario a 4 de octubre de 2026</small></span></button>
          <button class="list-row danger" id="wipe"><span class="grow">Borrar todos los datos</span></button>
        </div>
      </section>

      <p class="foot">Los datos se guardan solo en este dispositivo. Para instalar la app: en iPhone, abre la web en Safari y usa Compartir → Añadir a pantalla de inicio; en Android, menú de Chrome → Instalar aplicación.<br>Temario basado en las guías docentes de la UNED y los syllabus de LiU. Revísalo con la guía de este curso y edítalo si cambia algo.</p>`;

    $("#expJson").onclick = exportJson;
    $("#impJson").onclick = () => $("#fileJson").click();
    $("#impIcs").onclick = () => $("#fileIcs").click();
    $("#expIcs").onclick = exportIcs;
    $("#bkDays").onchange = (e) => { s.backupDays = +e.target.value; save(); };
    $("#weight").onchange = (e) => { s.weight = e.target.value; save(); };
    $("#theme").onchange = (e) => { s.theme = e.target.value; save(); applyTheme(); };
    $("#resetSyl").onclick = async () => {
      const ok = await confirmSheet({ title: "¿Recuperar el temario original?", text: "Se pierden los temas, puntos y asignaturas que hayas añadido o renombrado.", ok: "Recuperar" });
      if (!ok) return;
      state.subjects = buildDefaultSubjects();
      const ids = new Set(state.subjects.flatMap((x) => allPoints(x).map((p) => p.id)));
      Object.keys(state.progress).forEach((k) => { if (!ids.has(k)) delete state.progress[k]; });
      Object.keys(state.notes).forEach((k) => { if (!ids.has(k)) delete state.notes[k]; });
      save(); toast("Temario original recuperado");
    };
    $("#resetEv").onclick = async () => {
      const ok = await confirmSheet({ title: "¿Recuperar las fechas originales?", text: "Se sustituyen todas las fechas actuales.", ok: "Recuperar" });
      if (!ok) return;
      state.events = buildDefaultEvents(); save(); toast("Fechas recuperadas");
    };
    $("#wipe").onclick = async () => {
      const ok = await confirmSheet({ title: "¿Borrar todos los datos?", text: "Progreso, notas, fechas y cambios del temario. Exporta una copia antes si la quieres conservar.", ok: "Borrar todo", danger: true });
      if (!ok) return;
      state = freshState(); saveNow(); applyTheme(); toast("Datos borrados"); location.hash = "#/";
    };
  }

  /* ───────────────────────── Tema y arranque ───────────────────────── */
  function applyTheme() {
    const t = state.settings.theme;
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  }

  // Service worker (funciona sin conexión y avisa de nuevas versiones)
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").then((reg) => {
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          nw && nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              toast("Hay una versión nueva de la app", { label: "Actualizar", run: () => nw.postMessage("skipWaiting") });
            }
          });
        });
      }).catch(() => { /* sin SW */ });
      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => { if (!reloaded) { reloaded = true; location.reload(); } });
    });
  }

  // Si la app queda abierta pasada la medianoche, se actualizan las cuentas atrás
  let lastDay = todayStr();
  setInterval(() => { if (todayStr() !== lastDay) { lastDay = todayStr(); route(); } }, 60000);

  applyTheme();
  saveNow();
  route();
})();
