/* アルゴ劇場 — dessin des 流れ図 (organigrammes, symboles JIS X 0121).
   Un organigramme est une liste de nœuds ; chaque nœud porte le numéro de ligne « l »
   du 擬似言語 correspondant (nombre ou tableau), affiché dans une pastille.
     { t: "term", txt }                         开始 / 終了 (terminal)
     { t: "proc", txt, l }                      traitement (rectangle)
     { t: "io",   txt, l }                      entrée / sortie (parallélogramme)
     { t: "appel", txt, l }                     traitement prédéfini (double trait)
     { t: "si", cond, l, oui: [...], non: [...] } décision (losange, Yes en bas, No à droite)
     { t: "boucle", nom, cond, l, lFin, corps: [...] }  limites de boucle (début / fin)
   FLOW.dessiner(graphes) renvoie le SVG ; plusieurs graphes sont placés côte à côte. */
(() => {
"use strict";
const BH = 30, G = 16, DH = 42, LH = 40, BADGE = 26;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tw = s => [...String(s || "")].reduce((w, c) => w + (c.charCodeAt(0) > 255 ? 12.5 : 7.4), 0);
const larg = (...txts) => Math.max(116, ...txts.map(t => tw(t) + 30));
const lignes = l => (l === undefined ? "" : ` data-l="${[].concat(l).join(" ")}"`);

const trait = (x1, y1, x2, y2, fleche) => `<line class="fc-trait" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${fleche ? ' marker-end="url(#fc-fleche)"' : ""}/>`;
const texte = (x, y, s, cls = "") => `<text class="fc-txt ${cls}" x="${x}" y="${y}">${esc(s)}</text>`;
const pastille = (x, y, l) => l === undefined ? "" :
  `<g class="fc-no"><circle cx="${x}" cy="${y}" r="10"/><text x="${x}" y="${y}">${[].concat(l)[0]}</text></g>`;

function forme(t, x, y, w, h) {
  if (t === "term") return `<rect class="fc-forme" x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/>`;
  if (t === "io") return `<polygon class="fc-forme" points="${x + 10},${y} ${x + w},${y} ${x + w - 10},${y + h} ${x},${y + h}"/>`;
  if (t === "appel") return `<rect class="fc-forme" x="${x}" y="${y}" width="${w}" height="${h}"/><line class="fc-trait" x1="${x + 8}" y1="${y}" x2="${x + 8}" y2="${y + h}"/><line class="fc-trait" x1="${x + w - 8}" y1="${y}" x2="${x + w - 8}" y2="${y + h}"/>`;
  if (t === "si") return `<polygon class="fc-forme" points="${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}"/>`;
  if (t === "debutBoucle") return `<polygon class="fc-forme" points="${x + 9},${y} ${x + w - 9},${y} ${x + w},${y + 9} ${x + w},${y + h} ${x},${y + h} ${x},${y + 9}"/>`;
  if (t === "finBoucle") return `<polygon class="fc-forme" points="${x},${y} ${x + w},${y} ${x + w},${y + h - 9} ${x + w - 9},${y + h} ${x + 9},${y + h} ${x},${y + h - 9}"/>`;
  return `<rect class="fc-forme" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
}

/* chaque mise en page renvoie { w, h, ax (axe depuis la gauche), draw(x, y) } */
function simple(n) {
  const w = larg(n.txt), h = BH;
  return { w, h, ax: w / 2, draw: (x, y) =>
    `<g class="fn"${lignes(n.l)}>${forme(n.t, x, y, w, h)}${texte(x + w / 2, y + h / 2, n.txt)}${pastille(x - 14, y + h / 2, n.l)}</g>` };
}

function suite(noeuds) {
  const items = (noeuds || []).map(mise);
  if (!items.length) return { w: 0, h: 0, ax: 0, vide: true, draw: () => "" };
  const gauche = Math.max(...items.map(i => i.ax)), droite = Math.max(...items.map(i => i.w - i.ax));
  const h = items.reduce((s, i) => s + i.h, 0) + G * (items.length - 1);
  return { w: gauche + droite, h, ax: gauche, draw(x, y) {
    let o = "", cy = y; const a = x + gauche;
    items.forEach((it, k) => {
      o += it.draw(a - it.ax, cy); cy += it.h;
      if (k < items.length - 1) { o += trait(a, cy, a, cy + G); cy += G; }
    });
    return o;
  } };
}

function decision(n) {
  const dw = Math.max(120, tw(n.cond) + 56);
  const O = suite(n.oui), N = suite(n.non);
  const gauche = Math.max(dw / 2, O.ax), droiteO = Math.max(dw / 2, O.w - O.ax);
  const ecart = droiteO + 30 + (N.vide ? 0 : N.ax);
  const droite = ecart + (N.vide ? 0 : N.w - N.ax);
  const corps = Math.max(O.vide ? 0 : O.h + G, N.vide ? 0 : N.h + G);
  const h = DH + corps + G;
  return { w: gauche + droite, h, ax: gauche, draw(x, y) {
    const a = x + gauche, nx = a + ecart, bas = y + h, jonction = bas - G / 2;
    let o = `<g class="fn"${lignes(n.l)}>${forme("si", a - dw / 2, y, dw, DH)}${texte(a, y + DH / 2, n.cond)}${pastille(a - dw / 2 - 14, y + DH / 2, n.l)}</g>`;
    o += texte(a + 16, y + DH + 9, "Yes", "fc-oui") + texte(a + dw / 2 + 16, y + DH / 2 - 9, "No", "fc-oui");
    let cy = y + DH;
    if (!O.vide) { o += trait(a, cy, a, cy + G) + O.draw(a - O.ax, cy + G); cy += G + O.h; }
    o += trait(a, cy, a, bas);
    o += trait(a + dw / 2, y + DH / 2, nx, y + DH / 2);
    let ny = y + DH / 2;
    if (!N.vide) { o += trait(nx, ny, nx, y + DH + G) + N.draw(nx - N.ax, y + DH + G); ny = y + DH + G + N.h; }
    o += trait(nx, ny, nx, jonction) + trait(nx, jonction, a + 2, jonction, true);
    return o;
  } };
}

function boucle(n) {
  const B = suite(n.corps);
  const w0 = larg(n.nom, n.cond);
  const gauche = Math.max(w0 / 2, B.ax), droite = Math.max(w0 / 2, B.w - B.ax);
  const h = LH + G + (B.vide ? 0 : B.h + G) + BH;
  return { w: gauche + droite, h, ax: gauche, draw(x, y) {
    const a = x + gauche;
    let o = `<g class="fn"${lignes(n.l)}>${forme("debutBoucle", a - w0 / 2, y, w0, LH)}${texte(a, y + 13, n.nom)}${texte(a, y + 29, n.cond, "fc-cond")}${pastille(a - w0 / 2 - 14, y + LH / 2, n.l)}</g>`;
    let cy = y + LH;
    o += trait(a, cy, a, cy + G); cy += G;
    if (!B.vide) { o += B.draw(a - B.ax, cy) + trait(a, cy + B.h, a, cy + B.h + G); cy += B.h + G; }
    o += `<g class="fn"${lignes(n.lFin)}>${forme("finBoucle", a - w0 / 2, cy, w0, BH)}${texte(a, cy + BH / 2, n.nom)}${pastille(a - w0 / 2 - 14, cy + BH / 2, n.lFin)}</g>`;
    return o;
  } };
}

function mise(n) {
  if (n.t === "si") return decision(n);
  if (n.t === "boucle") return boucle(n);
  return simple(n);
}

/* graphes : [{ titre?, noeuds: [...] }, ...] */
function dessiner(graphes) {
  const MARGE = 12;
  const mises = graphes.map(g => ({ g, m: suite(g.noeuds) }));
  let x = BADGE + MARGE, hMax = 0, corps = "";
  for (const { g, m } of mises) {
    const haut = g.titre ? 22 : 0;
    if (g.titre) corps += texte(x + m.ax, MARGE + 6, g.titre, "fc-titre");
    corps += m.draw(x, MARGE + haut);
    hMax = Math.max(hMax, m.h + haut);
    x += m.w + BADGE + 34;
  }
  const W = x - BADGE - 34 + MARGE, H = hMax + MARGE * 2;
  return { w: W, h: H, svg: `<svg class="fc" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
    <defs><marker id="fc-fleche" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="fc-pointe"/></marker></defs>
    ${corps}</svg>` };
}

window.FLOW = { dessiner };
})();
