/* アルゴ劇場 — dessins autres que les barres.
   Chaque dessin : construire(el) une fois, maj(el, st, prev, algo) à chaque étape.
   st.tabs contient les tableaux de l'algorithme (ex. { D: [...], P: [...] }). */
(() => {
"use strict";
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const drapeaux = (algo, v, i) => Object.entries(algo.pointeurs || {}).filter(([nom]) => v[nom] === i)
  .map(([nom, coul]) => `<span class="drapeau" style="background:${coul};border-bottom-color:${coul}">${esc(nom)}</span>`).join("");
const etat = (st, prev, i, noms) => [
  st.look.includes(i) ? "regarde" : "", st.cmp.includes(i) ? "compare" : "",
  st.ecrit.includes(i) || (prev && noms.some(t => prev.tabs[t][i] !== st.tabs[t][i])) ? "ecrit" : ""
].join(" ");

/* ——— liste chaînée : D (données), P (pointeur vers le suivant), Top ——— */
const liste = {
  construire(el) {
    el.innerHTML = `<div class="lst"><div class="lst-chaine"></div><div class="lst-hors"></div><table class="lst-mem"></table></div>`;
  },
  maj(el, st, prev, algo, L) {
    const { D, P } = st.tabs, v = st.v, n = D.length;
    const ordre = [], vu = new Set();
    for (let k = v.Top; k !== -1 && k !== undefined && !vu.has(k) && ordre.length <= n; k = P[k]) { ordre.push(k); vu.add(k); }
    const noeud = (i, cls = "") => `<div class="lst-n ${cls} ${etat(st, prev, i, ["D", "P"])}">
        <span class="lst-i">[${i}]</span>
        <div class="lst-box"><span class="lst-d">${esc(D[i])}</span><span class="lst-p">${esc(P[i])}</span></div>
        <div class="drapeaux">${drapeaux(algo, v, i)}</div></div>`;
    const fin = `<div class="lst-n lst-fin"><span class="lst-i">&nbsp;</span><div class="lst-box">−1</div><div class="drapeaux">${drapeaux(algo, v, -1)}</div></div>`;
    el.querySelector(".lst-chaine").innerHTML =
      `<div class="lst-top"><span>Top</span><b>${esc(v.Top)}</b></div><span class="lst-fl">→</span>` +
      ordre.map(i => noeud(i)).join('<span class="lst-fl">→</span>') + '<span class="lst-fl">→</span>' + fin;
    const hors = [];
    for (let i = 0; i < n; i++) if (D[i] !== -1 && !vu.has(i)) hors.push(i);
    el.querySelector(".lst-hors").innerHTML = hors.length
      ? `<span class="lst-legende">${L("リストの外（つながっていない要素）", "outside the list (not linked)")}</span>${hors.map(i => noeud(i, "lst-detache")).join("")}` : "";
    const ligne = (nom, tab) => `<tr><th>${nom}</th>${tab.map((x, i) => `<td class="${etat(st, prev, i, [nom])}${x === -1 && nom === "D" ? " libre" : ""}">${esc(x)}</td>`).join("")}</tr>`;
    el.querySelector(".lst-mem").innerHTML =
      `<tr><th></th>${D.map((_, i) => `<th>[${i}]</th>`).join("")}</tr>` + ligne("D", D) + ligne("P", P);
  }
};


/* ——— arbre binaire : Data / Lp / Rp (+ Root), ou tas implicite (enfants 2i + 1, 2i + 2) ———
   algo.arbre = { data, lp, rp, root(v) } ou { tab, implicite: true, n(v, tabs) }
   algo.memoire = tableaux affichés sous l'arbre ; algo.marques = { Q: ["Hp", "Tp"] } */
const arbre = {
  construire(el) {
    el.innerHTML = `<div class="arb"><svg class="arb-svg" preserveAspectRatio="xMidYMid meet"></svg><table class="lst-mem arb-mem"></table></div>`;
  },
  maj(el, st, prev, algo, L) {
    const cfg = algo.arbre, t = st.tabs, v = st.v;
    const nb = cfg.implicite ? cfg.n(v, t) : null;
    const enfants = i => cfg.implicite ? [2 * i + 1, 2 * i + 2].map(k => (k < nb ? k : -1)) : [t[cfg.lp][i], t[cfg.rp][i]];
    const val = i => (cfg.implicite ? t[cfg.tab][i] : t[cfg.data][i]);
    const racine = cfg.implicite ? (nb > 0 ? 0 : -1) : cfg.root(v);
    const pos = {}; let x = 0, prof = 0;
    const visite = (i, d) => {
      if (i === -1 || i === undefined || i === null || pos[i] || d > 12) return;
      const [g, dr] = enfants(i);
      visite(g, d + 1); pos[i] = { x: x++, d }; prof = Math.max(prof, d); visite(dr, d + 1);
    };
    visite(racine, 0);
    const W = 62, H = 70, PX = 34, PY = 34;
    const cx = i => PX + pos[i].x * W, cy = i => PY + pos[i].d * H;
    let traits = "", noeuds = "";
    for (const i of Object.keys(pos).map(Number)) {
      for (const c of enfants(i)) if (c !== -1 && pos[c]) traits += `<line class="arb-trait" x1="${cx(i)}" y1="${cy(i)}" x2="${cx(c)}" y2="${cy(c)}"/>`;
      const cls = [etat(st, prev, i, cfg.implicite ? [cfg.tab] : [cfg.data, cfg.lp, cfg.rp]), st.fixe.includes(i) ? "sorti" : "", st.trouve.includes(i) ? "trouve" : ""].join(" ");
      const fl = Object.entries(algo.pointeurs || {}).filter(([nom]) => v[nom] === i);
      noeuds += `<g class="arb-n ${cls}"><circle cx="${cx(i)}" cy="${cy(i)}" r="20"/>
        <text class="arb-v" x="${cx(i)}" y="${cy(i)}">${esc(val(i))}</text>
        <text class="arb-i" x="${cx(i) + 22}" y="${cy(i) - 18}">[${i}]</text>
        ${fl.map(([nom, coul], k) => `<g class="arb-fl"><rect x="${cx(i) - 16}" y="${cy(i) + 23 + k * 15}" width="32" height="13" rx="6.5" style="fill:${coul}"/><text x="${cx(i)}" y="${cy(i) + 29.5 + k * 15}">${esc(nom)}</text></g>`).join("")}</g>`;
    }
    const w = Math.max(1, x - 1) * W + PX * 2, h = prof * H + PY * 2 + 30;
    const svg = el.querySelector(".arb-svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.innerHTML = x ? traits + noeuds : `<text class="arb-vide" x="${w / 2}" y="${h / 2}">${L("（空）", "(empty)")}</text>`;
    const lignes = algo.memoire || [];
    const n = Math.max(...lignes.map(nom => t[nom].length));
    const marques = algo.marques || {};
    el.querySelector(".arb-mem").innerHTML = `<tr><th></th>${Array.from({ length: n }, (_, i) => `<th>[${i}]</th>`).join("")}</tr>` +
      lignes.map(nom => `<tr><th>${esc(nom)}</th>${t[nom].map((z, i) => {
        const chg = prev && prev.tabs[nom][i] !== z ? " ecrit" : "";
        const m = (marques[nom] || []).filter(p => v[p] === i);
        const hors = z === null || (cfg.implicite && nom === cfg.tab && i >= nb && !st.fixe.includes(i));
        return `<td class="${chg}${hors ? " libre" : ""}${cfg.implicite && st.fixe.includes(i) ? " fixe" : ""}">${z === null ? "" : esc(z)}${m.length ? `<sup>${m.join(" ")}</sup>` : ""}</td>`;
      }).join("")}</tr>`).join("");
  }
};


/* ——— ハッシュ（チェーン法）: H[k] = première node du compartiment k, D/P = nodes ——— */
const hachage = {
  construire(el) { el.innerHTML = `<div class="lst"><div class="hc"></div><table class="lst-mem"></table></div>`; },
  maj(el, st, prev, algo, L) {
    const { H, D, P } = st.tabs, v = st.v;
    const noeud = i => `<div class="lst-n ${etat(st, prev, i, ["D", "P"])}${st.trouve.includes(i) ? " trouve" : ""}"><span class="lst-i">[${i}]</span>
      <div class="lst-box"><span class="lst-d">${esc(D[i])}</span><span class="lst-p">${esc(P[i])}</span></div>
      <div class="drapeaux">${drapeaux(algo, v, i)}</div></div>`;
    el.querySelector(".hc").innerHTML = H.map((tete, k) => {
      const ch = [], vu = new Set();
      for (let i = tete; i !== -1 && i !== null && !vu.has(i) && ch.length < 10; i = P[i]) { ch.push(i); vu.add(i); }
      const chg = prev && prev.tabs.H[k] !== tete ? " ecrit" : "";
      return `<div class="hc-ligne${v.K === k ? " actif" : ""}"><span class="hc-k${chg}">H[${k}]</span><span class="lst-fl">→</span>${ch.map(noeud).join('<span class="lst-fl">→</span>')}${ch.length ? '<span class="lst-fl">→</span>' : ""}<span class="hc-fin">−1</span></div>`;
    }).join("");
    const ligne = nom => `<tr><th>${nom}</th>${st.tabs[nom].map((x, i) => `<td class="${prev && prev.tabs[nom][i] !== x ? "ecrit" : ""}${x === null ? " libre" : ""}">${x === null ? "" : esc(x)}</td>`).join("")}</tr>`;
    el.querySelector(".lst-mem").innerHTML = `<tr><th></th>${D.map((_, i) => `<th>[${i}]</th>`).join("")}</tr>` + ligne("H") + ligne("D") + ligne("P");
  }
};

window.VISUS = { liste, arbre, hachage };
})();
