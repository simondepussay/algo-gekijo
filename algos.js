/* アルゴ劇場 — les algorithmes (japonais et anglais), dans la notation des manuels :
   tableau T indicé à partir de 0, variables en majuscules, 流れ図 JIS.
   Chaque algorithme décrit :
     cat      : "tansaku" (探索) | "seiretsu" (整列) | "kouzou" (データ構造)
     base     : premier indice du tableau (0 ici, comme dans le livre)
     prog     : le 擬似言語, une ligne par entrée (numérotées à partir de 1)
     flow     : le même programme en 流れ図 (voir flow.js) ; chaque nœud porte le numéro de ligne
     donnees  : { a: [...], x?, ops? } · prepare(d) : tableau réellement utilisé (番兵, pile vide…)
     vars, pointeurs, compteurs, actif(v, i, n) (case encore « en jeu »), garde (dernière case = 番兵)
     trace(L), ligne(v, a, arr, o, L) : le トレース表
     run(T)   : rejoue le programme ; T.step(ligne, explication, options)
     blancs, qcm : exercices
   Les exemples sont écrits pour ce site (aucune figure ni texte de manuel n'est recopié). */
(() => {
const VF = (L, ok) => (ok ? L("真", "true") : L("偽", "false"));

window.ALGOS = [

/* ═══════════════════════════ 探索 ═══════════════════════════ */
{
  id: "max", cat: "tansaku", jp: "最大値を求める", en: "Finding the maximum", ordre: "O(n)",
  resume: { ja: "配列を先頭から順に見て、それまでで一番大きい値を覚えておく。", en: "Walk through the array and remember the biggest value seen so far." },
  cle: { ja: "MAX は T[0] から始めるので、ループは I = 1 から。比較は N − 1 回。", en: "MAX starts from T[0], so the loop starts at I = 1. N − 1 comparisons." },
  base: 0, tab: "T",
  prog: [
    "○整数型: saidai(整数型の配列: T)",
    "  整数型: I, MAX",
    "  MAX ← T[0]",
    "  for (I を 1 から Tの要素数 − 1 まで 1 ずつ増やす)",
    "    if (T[I] > MAX)",
    "      MAX ← T[I]",
    "    endif",
    "  endfor",
    "  return MAX"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始", l: [1, 2] },
    { t: "proc", txt: "MAX ← T[0]", l: 3 },
    { t: "boucle", nom: "最大値探索", cond: "I:1, I < N, 1", l: 4, lFin: 8, corps: [
      { t: "si", cond: "T[I] > MAX", l: 5, oui: [{ t: "proc", txt: "MAX ← T[I]", l: 6 }], non: [] }
    ] },
    { t: "io", txt: "MAX 出力", l: 9 },
    { t: "term", txt: "終了" }
  ] }],
  donnees: { a: [53, 81, 27, 64, 90, 38] },
  vars: ["I", "MAX"], pointeurs: { I: "var(--shu)" }, compteurs: ["cmp", "aff"],
  trace: L => ["I", "T[I]", "T[I] > MAX", "MAX"],
  ligne: (v, a, arr, o, L) => [v.I ?? "—", v.I !== undefined && v.I < arr.length ? a(v.I) : "—", o.ok === undefined ? "—" : VF(L, o.ok), v.MAX ?? "—"],
  run(T) {
    const v = T.v, L = T.L;
    T.step(1, L(`T = {${T.liste()}} で saidai を呼び出す。要素数 N = ${T.n}。`, `Call saidai with T = {${T.liste()}}. N = ${T.n} elements.`));
    v.I = undefined; v.MAX = undefined;
    T.step(2, L("変数 I と MAX を用意する。まだ空。", "Variables I and MAX are created, still empty."));
    v.MAX = T.a(0);
    T.step(3, L(`MAX ← T[0]：最初の要素を「今までの最大」とする。MAX = ${v.MAX}。`, `MAX ← T[0]: the first element is “the biggest so far”. MAX = ${v.MAX}.`),
      { look: [0], row: true, q: { texte: L("この処理の後、MAX の値は？", "What will MAX be after this?"), choix: T.choix(v.MAX, [0, T.a(1), T.n]) } });
    for (v.I = 1; ; v.I++) {
      if (v.I >= T.n) {
        T.step(4, L(`I = ${v.I} は N = ${T.n} 未満ではない → ループ終了。`, `I = ${v.I} is not < N = ${T.n} → the loop ends.`),
          { q: { texte: L(`I = ${v.I}。ループは続く？`, `I = ${v.I}. Does the loop go on?`), choix: [L("続く", "it goes on"), L("終わる", "it ends")], bon: L("終わる", "it ends") } });
        break;
      }
      T.step(4, v.I === 1 ? L("I = 1 からループ開始。T[0] はもう MAX に入っている。", "The loop starts at I = 1: T[0] is already in MAX.") : L(`I が ${v.I} になる。`, `I becomes ${v.I}.`), { look: [v.I] });
      const ok = T.a(v.I) > v.MAX; T.c.cmp++;
      T.step(5, L(`T[${v.I}] = ${T.a(v.I)} ${ok ? ">" : "≤"} MAX = ${v.MAX} → ${VF(L, ok)}。`, `T[${v.I}] = ${T.a(v.I)} ${ok ? ">" : "≤"} MAX = ${v.MAX} → ${VF(L, ok)}.`),
        { cmp: [v.I], ok, row: !ok, q: { texte: L(`T[${v.I}] = ${T.a(v.I)}、MAX = ${v.MAX}。T[I] > MAX は？`, `T[${v.I}] = ${T.a(v.I)}, MAX = ${v.MAX}. Is T[I] > MAX?`), choix: [VF(L, true), VF(L, false)], bon: VF(L, ok) } });
      if (ok) {
        const ancien = v.MAX; v.MAX = T.a(v.I); T.c.aff++;
        T.step(6, L(`MAX ← T[${v.I}]：もっと大きい値が見つかった！MAX = ${v.MAX}。`, `MAX ← T[${v.I}]: found a bigger one! MAX = ${v.MAX}.`),
          { look: [v.I], row: true, ok, q: { texte: L("この処理の後、MAX の値は？", "What will MAX be after this?"), choix: T.choix(v.MAX, [ancien, v.I, ancien + 1]) } });
      }
    }
    T.step(9, L(`MAX = ${v.MAX} を出力（return）する。`, `Output (return) MAX = ${v.MAX}.`), { fin: true });
  },
  blancs: [
    { ligne: 5, trou: "T[I] > MAX", choix: ["T[I] > MAX", "T[I] < MAX", "T[I] > T[0]", "MAX > I"],
      expl: { ja: "見ている要素のほうが大きいときだけ MAX を入れ替える。", en: "MAX is replaced only when the element looked at is bigger." } },
    { ligne: 4, trou: "1", choix: ["1", "0", "2", "Tの要素数"],
      expl: { ja: "T[0] は MAX の初期値に使ったので 1 から。0 からでも答えは同じだが、無駄な比較が1回増える。", en: "T[0] was used to initialise MAX. Starting at 0 also works, but adds one useless comparison." } }
  ],
  qcm: [
    { ja: ["要素数 N のとき、比較は何回？", ["N − 1 回", "N 回", "N + 1 回", "N ÷ 2 回"], "I = 1 から N − 1 まで、1周に1回。"],
      en: ["With N elements, how many comparisons?", ["N − 1", "N", "N + 1", "N ÷ 2"], "From I = 1 to N − 1, one per round."] }
  ]
},

{
  id: "senkei", cat: "tansaku", jp: "線形探索", en: "Linear search", ordre: "O(n)",
  resume: { ja: "先頭から順に1つずつ、目的のデータ x と比べていく。整列していなくても使える。", en: "Compare each element with the target x, from the first one. Works even if the array is not sorted." },
  cle: { ja: "ループの条件は2つ：「I < N（範囲内）」かつ「T[I] ≠ x（まだ見つからない）」。", en: "Two loop conditions: “I < N (still inside)” and “T[I] ≠ x (not found yet)”." },
  base: 0, tab: "T",
  prog: [
    "○整数型: senkei(整数型の配列: T, 整数型: x)",
    "  整数型: I",
    "  I ← 0",
    "  while ((I < Tの要素数) and (T[I] ≠ x))",
    "    I ← I + 1",
    "  endwhile",
    "  if (I < Tの要素数)",
    "    return I",
    "  else",
    "    return −1",
    "  endif"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始" },
    { t: "io", txt: "x 入力", l: [1, 2] },
    { t: "proc", txt: "I ← 0", l: 3 },
    { t: "boucle", nom: "探索処理", cond: "I < N かつ x ≠ T[I]", l: 4, lFin: 6, corps: [{ t: "proc", txt: "I ← I + 1", l: 5 }] },
    { t: "si", cond: "I < N", l: 7, oui: [{ t: "io", txt: "I 出力", l: 8 }], non: [{ t: "io", txt: "(−1) 出力", l: 10 }] },
    { t: "term", txt: "終了" }
  ] }],
  donnees: { a: [27, 64, 15, 83, 41, 70], x: 83 },
  vars: ["x", "I"], pointeurs: { I: "var(--shu)" }, compteurs: ["cmp"],
  trace: L => ["I", "T[I]", "x ≠ T[I]", L("ループ", "loop")],
  ligne: (v, a, arr, o, L) => [v.I ?? "—", v.I !== undefined && v.I < arr.length ? a(v.I) : "—", o.ne === undefined ? "—" : VF(L, o.ne), o.cont === undefined ? "—" : o.cont ? L("続く", "go on") : L("終了", "end")],
  run(T) {
    const v = T.v, L = T.L;
    v.x = T.x;
    T.step(1, L(`T = {${T.liste()}} から x = ${T.x} を探す。`, `Look for x = ${T.x} in T = {${T.liste()}}.`));
    v.I = undefined;
    T.step(2, L("添字 I を用意する。", "The index I is created."));
    v.I = 0;
    T.step(3, L("I ← 0：先頭から探し始める。", "I ← 0: start from the first element."), { look: [0] });
    while (true) {
      const dedans = v.I < T.n;
      const ne = dedans ? T.a(v.I) !== T.x : undefined;
      if (dedans) T.c.cmp++;
      const cont = dedans && ne;
      T.step(4, !dedans ? L(`I = ${v.I} は N = ${T.n} 未満ではない → 範囲外なのでループ終了（T[I] は見ない）。`, `I = ${v.I} is not < N = ${T.n} → outside, the loop ends (T[I] is not read).`)
        : L(`T[${v.I}] = ${T.a(v.I)} ${ne ? "≠" : "="} x = ${T.x} → ${ne ? "まだ見つからない。続ける" : "見つかった！ループ終了"}。`, `T[${v.I}] = ${T.a(v.I)} ${ne ? "≠" : "="} x = ${T.x} → ${ne ? "not found yet, go on" : "found! the loop ends"}.`),
        { cmp: dedans ? [v.I] : [], row: true, ne, cont,
          q: { texte: dedans ? L(`T[${v.I}] = ${T.a(v.I)}、x = ${T.x}。ループは続く？`, `T[${v.I}] = ${T.a(v.I)}, x = ${T.x}. Does the loop go on?`) : L(`I = ${v.I}、N = ${T.n}。ループは続く？`, `I = ${v.I}, N = ${T.n}. Does the loop go on?`),
               choix: [L("続く", "it goes on"), L("終わる", "it ends")], bon: cont ? L("続く", "it goes on") : L("終わる", "it ends") } });
      if (!cont) break;
      v.I++;
      T.step(5, L(`I ← I + 1：次の要素へ。I = ${v.I}。`, `I ← I + 1: next element. I = ${v.I}.`), { look: v.I < T.n ? [v.I] : [] });
    }
    const trouve = v.I < T.n;
    T.step(7, L(`I = ${v.I} ${trouve ? "<" : "≥"} N = ${T.n} → ${trouve ? "見つかっている" : "見つからなかった"}。`, `I = ${v.I} ${trouve ? "<" : "≥"} N = ${T.n} → ${trouve ? "it was found" : "not found"}.`),
      { q: { texte: L("I < N は？", "Is I < N?"), choix: [VF(L, true), VF(L, false)], bon: VF(L, trouve) } });
    if (trouve) T.step(8, L(`I = ${v.I} を出力。x は T[${v.I}] にある。比較 ${T.c.cmp} 回。`, `Output I = ${v.I}: x is in T[${v.I}]. ${T.c.cmp} comparisons.`), { trouve: [v.I], fin: true });
    else T.step(10, L(`x = ${T.x} はない：(−1) を出力。比較 ${T.c.cmp} 回。`, `x = ${T.x} is not there: output (−1). ${T.c.cmp} comparisons.`), { fin: true });
  },
  blancs: [
    { ligne: 4, trou: "T[I] ≠ x", choix: ["T[I] ≠ x", "T[I] = x", "T[I] < x", "I ≠ x"],
      expl: { ja: "「まだ見つからない間」くり返すので ≠。= にすると最初の要素で止まってしまう。", en: "We repeat “while not found yet”, hence ≠. With =, the loop would stop at once." } },
    { ligne: 7, trou: "I < Tの要素数", choix: ["I < Tの要素数", "T[I] = x", "I > 0", "I = 0"],
      expl: { ja: "見つからなかったときは I = N（範囲外）になる。T[I] を見ると配列の外を読んでしまう。", en: "When not found, I = N (outside). Reading T[I] would go outside the array." } }
  ],
  qcm: [
    { ja: ["要素数 N で、見つからないときの比較回数は？", ["N 回", "N − 1 回", "N ÷ 2 回", "1 回"], "全部の要素と比べて、やっと「ない」とわかる。"],
      en: ["With N elements, how many comparisons when x is not there?", ["N", "N − 1", "N ÷ 2", "1"], "Every element must be compared before we know it is not there."] },
    { ja: ["線形探索の前提条件は？", ["特にない（整列していなくてもよい）", "昇順に整列している", "要素数が偶数", "重複がない"], "2分探索と違い、どんな並びでも使える。"],
      en: ["What must be true before a linear search?", ["nothing special (no sorting needed)", "sorted ascending", "even number of elements", "no duplicates"], "Unlike binary search, it works on any order."] }
  ]
},

{
  id: "banpei", cat: "tansaku", jp: "線形探索（番兵法）", en: "Linear search with sentinel", ordre: "O(n)",
  resume: { ja: "配列の最後に x（番兵）を置いておくと必ず見つかるので、「範囲内か」の判定がいらなくなる。", en: "Put x (the sentinel) after the last element: it is always found, so the “still inside?” test disappears." },
  cle: { ja: "ループの条件が1つだけになり、比較が減る。最後に「見つけたのは番兵か？」を I < N で確かめる。", en: "Only one loop condition, so fewer comparisons. At the end, I < N tells whether we found the sentinel." },
  base: 0, tab: "T", garde: true,
  prog: [
    "○整数型: banpei(整数型の配列: T, 整数型: x)",
    "  整数型: I, N",
    "  N ← Tの要素数 − 1    /* 最後の要素は番兵用 */",
    "  T[N] ← x",
    "  I ← 0",
    "  while (T[I] ≠ x)",
    "    I ← I + 1",
    "  endwhile",
    "  if (I < N)",
    "    return I",
    "  else",
    "    return −1",
    "  endif"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始" },
    { t: "io", txt: "x 入力", l: [1, 2] },
    { t: "proc", txt: "N ← 要素数 − 1", l: 3 },
    { t: "proc", txt: "T[N] ← x", l: 4 },
    { t: "proc", txt: "I ← 0", l: 5 },
    { t: "boucle", nom: "探索処理", cond: "x ≠ T[I]", l: 6, lFin: 8, corps: [{ t: "proc", txt: "I ← I + 1", l: 7 }] },
    { t: "si", cond: "I < N", l: 9, oui: [{ t: "io", txt: "I 出力", l: 10 }], non: [{ t: "io", txt: "(−1) 出力", l: 12 }] },
    { t: "term", txt: "終了" }
  ] }],
  donnees: { a: [27, 64, 15, 83, 41], x: 41 },
  prepare: d => d.a.concat([null]),
  vars: ["x", "N", "I"], pointeurs: { I: "var(--shu)", N: "var(--kin)" }, compteurs: ["cmp"],
  trace: L => ["I", "T[I]", "x ≠ T[I]"],
  ligne: (v, a, arr, o, L) => [v.I ?? "—", v.I !== undefined ? a(v.I) ?? "—" : "—", o.ne === undefined ? "—" : VF(L, o.ne)],
  run(T) {
    const v = T.v, L = T.L;
    v.x = T.x;
    T.step(1, L(`T = {${T.liste()}} から x = ${T.x} を探す。最後の空きは番兵用。`, `Look for x = ${T.x}. The last empty cell is for the sentinel.`));
    v.N = undefined; v.I = undefined;
    T.step(2, L("I と N を用意する。", "I and N are created."));
    v.N = T.n - 1;
    T.step(3, L(`N ← ${v.N}：本当のデータは T[0]〜T[${v.N - 1}]。T[${v.N}] は番兵の席。`, `N ← ${v.N}: the real data is T[0]…T[${v.N - 1}]. T[${v.N}] is the sentinel’s seat.`), { look: [v.N] });
    T.set(v.N, T.x);
    T.step(4, L(`T[N] ← x：番兵 ${T.x} を置く。これで必ずどこかで見つかる。`, `T[N] ← x: place the sentinel ${T.x}. Now x is always found somewhere.`), { ecrit: [v.N] });
    v.I = 0;
    T.step(5, L("I ← 0：先頭から。", "I ← 0: from the start."), { look: [0] });
    while (true) {
      const ne = T.a(v.I) !== T.x; T.c.cmp++;
      T.step(6, L(`T[${v.I}] = ${T.a(v.I)} ${ne ? "≠" : "="} x → ${ne ? "続ける" : "ループ終了"}。範囲のチェックはいらない。`, `T[${v.I}] = ${T.a(v.I)} ${ne ? "≠" : "="} x → ${ne ? "go on" : "the loop ends"}. No range check needed.`),
        { cmp: [v.I], row: true, ne, q: { texte: L(`T[${v.I}] = ${T.a(v.I)}、x = ${T.x}。ループは続く？`, `T[${v.I}] = ${T.a(v.I)}, x = ${T.x}. Does the loop go on?`), choix: [L("続く", "it goes on"), L("終わる", "it ends")], bon: ne ? L("続く", "it goes on") : L("終わる", "it ends") } });
      if (!ne) break;
      v.I++;
      T.step(7, L(`I ← I + 1 = ${v.I}。`, `I ← I + 1 = ${v.I}.`), { look: [v.I] });
    }
    const vrai = v.I < v.N;
    T.step(9, L(`I = ${v.I} ${vrai ? "<" : "="} N = ${v.N} → ${vrai ? "本物のデータで見つかった" : "見つけたのは番兵だった"}。`, `I = ${v.I} ${vrai ? "<" : "="} N = ${v.N} → ${vrai ? "found in the real data" : "we only found the sentinel"}.`),
      { q: { texte: L("見つけたのは本物？それとも番兵？", "Real data or the sentinel?"), choix: [L("本物", "real data"), L("番兵", "sentinel")], bon: vrai ? L("本物", "real data") : L("番兵", "sentinel") } });
    if (vrai) T.step(10, L(`I = ${v.I} を出力。比較 ${T.c.cmp} 回。`, `Output I = ${v.I}. ${T.c.cmp} comparisons.`), { trouve: [v.I], fin: true });
    else T.step(12, L(`(−1) を出力。比較 ${T.c.cmp} 回。`, `Output (−1). ${T.c.cmp} comparisons.`), { fin: true });
  },
  blancs: [
    { ligne: 4, trou: "T[N] ← x", choix: ["T[N] ← x", "T[0] ← x", "x ← T[N]", "T[N] ← −1"],
      expl: { ja: "最後の要素に x を入れるのが番兵。どこにも x がなくても、ここで必ず止まる。", en: "The sentinel is x placed in the last cell: even if x is nowhere else, the loop stops there." } }
  ],
  qcm: [
    { ja: ["番兵法の利点は？", ["ループ内の判定が1つ減る", "整列が不要になる", "2分探索より速い", "配列が小さくてすむ"], "「I < N」の判定が不要になり、1周あたりの比較が減る。"],
      en: ["What does the sentinel bring?", ["one less test inside the loop", "no sorting needed", "faster than binary search", "a smaller array"], "The “I < N” test disappears, so each round compares less."] }
  ]
},

{
  id: "nibun", cat: "tansaku", jp: "2分探索", en: "Binary search", ordre: "O(log n)",
  resume: { ja: "整列済みの配列で、真ん中 T[M] と x を比べ、x がありえない半分を捨てる。範囲は毎回半分になる。", en: "In a sorted array, compare the middle T[M] with x and drop the half where x cannot be. The range halves every time." },
  cle: { ja: "前提：昇順に整列済み。M は (L + H) ÷ 2 の商。L > H になったら範囲が空。", en: "Requires an ascending sorted array. M is the quotient of (L + H) ÷ 2. When L > H, the range is empty." },
  base: 0, tab: "T", trie: true,
  prog: [
    "○整数型: nibun(整数型の配列: T, 整数型: x)",
    "  整数型: L, H, M",
    "  L ← 0",
    "  H ← Tの要素数 − 1",
    "  M ← (L + H) ÷ 2 の商",
    "  while ((L ≤ H) and (T[M] ≠ x))",
    "    if (T[M] < x)",
    "      L ← M + 1",
    "    else",
    "      H ← M − 1",
    "    endif",
    "    M ← (L + H) ÷ 2 の商",
    "  endwhile",
    "  if (L ≤ H)",
    "    return M",
    "  else",
    "    return −1",
    "  endif"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始" },
    { t: "io", txt: "x 入力", l: [1, 2] },
    { t: "proc", txt: "L ← 0", l: 3 },
    { t: "proc", txt: "H ← N − 1", l: 4 },
    { t: "proc", txt: "M ← (L + H) ÷ 2", l: 5 },
    { t: "boucle", nom: "探索処理", cond: "L ≤ H かつ x ≠ T[M]", l: 6, lFin: 13, corps: [
      { t: "si", cond: "x > T[M]", l: 7, oui: [{ t: "proc", txt: "L ← M + 1", l: 8 }], non: [{ t: "proc", txt: "H ← M − 1", l: 10 }] },
      { t: "proc", txt: "M ← (L + H) ÷ 2", l: 12 }
    ] },
    { t: "si", cond: "L ≤ H", l: 14, oui: [{ t: "io", txt: "M 出力", l: 15 }], non: [{ t: "io", txt: "(−1) 出力", l: 17 }] },
    { t: "term", txt: "終了" }
  ] }],
  donnees: { a: [12, 25, 31, 47, 58, 66, 80, 94], x: 66 },
  vars: ["x", "L", "H", "M"], pointeurs: { L: "var(--matcha)", M: "var(--shu)", H: "var(--ai)" }, compteurs: ["cmp"],
  actif: (v, i) => v.L === undefined || v.H === undefined || (i >= v.L && i <= v.H),
  trace: L => ["L", "H", "M", "T[M]", L("判定", "test")],
  ligne: (v, a, arr, o) => [v.L ?? "—", v.H ?? "—", v.M ?? "—", v.M !== undefined && v.M >= 0 && v.M < arr.length ? a(v.M) : "—", o.signe ?? "—"],
  run(T) {
    const v = T.v, L = T.L, quo = (p, q) => Math.trunc((p + q) / 2);
    v.x = T.x;
    T.step(1, L(`整列済みの T = {${T.liste()}} から x = ${T.x} を探す。`, `Look for x = ${T.x} in the sorted T = {${T.liste()}}.`));
    v.L = undefined; v.H = undefined; v.M = undefined;
    T.step(2, L("L（下限）、H（上限）、M（真ん中）を用意する。", "L (low end), H (high end) and M (middle) are created."));
    v.L = 0; T.step(3, L("L ← 0：範囲の下限は先頭。", "L ← 0: the range starts at the first cell."));
    v.H = T.n - 1; T.step(4, L(`H ← ${v.H}：範囲の上限は末尾。`, `H ← ${v.H}: the range ends at the last cell.`));
    v.M = quo(v.L, v.H);
    T.step(5, L(`M ← (${v.L} + ${v.H}) ÷ 2 の商 = ${v.M}。`, `M ← quotient of (${v.L} + ${v.H}) ÷ 2 = ${v.M}.`),
      { look: [v.M], q: { texte: L(`(${v.L} + ${v.H}) ÷ 2 の商は？`, `Quotient of (${v.L} + ${v.H}) ÷ 2?`), choix: T.choix(v.M, [v.M + 1, v.L + v.H, v.H]) } });
    while (true) {
      const dedans = v.L <= v.H;
      const ne = dedans ? T.a(v.M) !== T.x : undefined;
      if (dedans) T.c.cmp++;
      const cont = dedans && ne;
      const signe = !dedans ? "—" : !ne ? "=" : T.a(v.M) < T.x ? "<" : ">";
      T.step(6, !dedans ? L(`L = ${v.L} > H = ${v.H}：範囲が空 → ループ終了。`, `L = ${v.L} > H = ${v.H}: the range is empty → the loop ends.`)
        : L(`T[${v.M}] = ${T.a(v.M)} ${ne ? "≠" : "="} x = ${T.x} → ${ne ? "続ける" : "見つかった！ループ終了"}。`, `T[${v.M}] = ${T.a(v.M)} ${ne ? "≠" : "="} x = ${T.x} → ${ne ? "go on" : "found! the loop ends"}.`),
        { cmp: dedans ? [v.M] : [], row: dedans, signe,
          q: { texte: dedans ? L(`L = ${v.L}, H = ${v.H}, T[M] = ${T.a(v.M)}, x = ${T.x}。ループは続く？`, `L = ${v.L}, H = ${v.H}, T[M] = ${T.a(v.M)}, x = ${T.x}. Does the loop go on?`) : L(`L = ${v.L}, H = ${v.H}。ループは続く？`, `L = ${v.L}, H = ${v.H}. Does the loop go on?`),
               choix: [L("続く", "it goes on"), L("終わる", "it ends")], bon: cont ? L("続く", "it goes on") : L("終わる", "it ends") } });
      if (!cont) break;
      const droite = T.a(v.M) < T.x;
      T.step(7, L(`T[M] = ${T.a(v.M)} ${droite ? "<" : ">"} x = ${T.x} → x は${droite ? "右" : "左"}側にある。`, `T[M] = ${T.a(v.M)} ${droite ? "<" : ">"} x = ${T.x} → x is on the ${droite ? "right" : "left"}.`),
        { cmp: [v.M], q: { texte: L("x はどちら側？", "Which side is x on?"), choix: [L("右側（L を動かす）", "right (move L)"), L("左側（H を動かす）", "left (move H)")], bon: droite ? L("右側（L を動かす）", "right (move L)") : L("左側（H を動かす）", "left (move H)") } });
      if (droite) {
        v.L = v.M + 1;
        T.step(8, L(`L ← M + 1 = ${v.L}：M を含む左半分を捨てる。`, `L ← M + 1 = ${v.L}: drop the left half, M included.`), { q: { texte: L("この処理の後、L は？", "What will L be?"), choix: T.choix(v.L, [v.M, v.M - 1, v.H]) } });
      } else {
        v.H = v.M - 1;
        T.step(10, L(`H ← M − 1 = ${v.H}：M を含む右半分を捨てる。`, `H ← M − 1 = ${v.H}: drop the right half, M included.`), { q: { texte: L("この処理の後、H は？", "What will H be?"), choix: T.choix(v.H, [v.M, v.M + 1, v.L]) } });
      }
      v.M = quo(v.L, v.H);
      T.step(12, L(`M ← (${v.L} + ${v.H}) ÷ 2 の商 = ${v.M}。`, `M ← quotient of (${v.L} + ${v.H}) ÷ 2 = ${v.M}.`),
        { look: v.L <= v.H ? [v.M] : [], q: { texte: L(`(${v.L} + ${v.H}) ÷ 2 の商は？`, `Quotient of (${v.L} + ${v.H}) ÷ 2?`), choix: T.choix(v.M, [v.M + 1, v.L + v.H, v.M - 1]) } });
    }
    const ok = v.L <= v.H;
    T.step(14, L(`L ≤ H は${VF(L, ok)} → ${ok ? "見つかった" : "見つからなかった"}。`, `L ≤ H is ${VF(L, ok)} → ${ok ? "found" : "not found"}.`));
    if (ok) T.step(15, L(`M = ${v.M} を出力。比較 ${T.c.cmp} 回だけ！`, `Output M = ${v.M}. Only ${T.c.cmp} comparisons!`), { trouve: [v.M], fin: true });
    else T.step(17, L(`(−1) を出力。比較 ${T.c.cmp} 回。`, `Output (−1). ${T.c.cmp} comparisons.`), { fin: true });
  },
  blancs: [
    { ligne: 8, trou: "M + 1", choix: ["M + 1", "M", "M − 1", "H"],
      expl: { ja: "T[M] はもう x ではないとわかっているので除く。「L ← M」だと範囲が縮まらず無限ループになることがある。", en: "T[M] is known not to be x, so drop it. With “L ← M” the range may stop shrinking → infinite loop." } },
    { ligne: 6, trou: "L ≤ H", choix: ["L ≤ H", "L < H", "L = H", "M ≤ H"],
      expl: { ja: "L = H のとき、まだ1つ調べる要素が残っている。", en: "When L = H, one element is still left to check." } }
  ],
  qcm: [
    { ja: ["要素数 1000 のとき、比較回数の最大はおよそ？", ["約 10 回", "約 100 回", "500 回", "1000 回"], "1000 → 500 → 250 → … と半分ずつ。log₂1000 ≈ 10。"],
      en: ["With 1000 elements, what is the maximum number of comparisons, roughly?", ["about 10", "about 100", "500", "1000"], "1000 → 500 → 250 → … halving each time. log₂1000 ≈ 10."] },
    { ja: ["2分探索の前提条件は？", ["整列済みであること", "要素数が偶数", "重複がない", "番兵がある"], "大小関係で半分を捨てるので、並んでいないと使えない。"],
      en: ["What must be true before a binary search?", ["the array is sorted", "even number of elements", "no duplicates", "a sentinel is present"], "Halves are dropped by comparing sizes: the array must be in order."] }
  ]
},

/* ═══════════════════════════ 整列 ═══════════════════════════ */
{
  id: "sentaku", cat: "seiretsu", jp: "基本選択法", en: "Selection sort", ordre: "O(n²)",
  resume: { ja: "未整列の部分から最小値を探し、その先頭と交換する。これを先頭から1つずつくり返す。", en: "Find the smallest value in the unsorted part and swap it with the first unsorted cell. Repeat from left to right." },
  cle: { ja: "交換は1周に1回だけ。比較は値に関係なく N(N − 1) ÷ 2 回。", en: "Only one swap per pass. Always N(N − 1) ÷ 2 comparisons, whatever the values." },
  base: 0, tab: "T",
  prog: [
    "○sentaku(整数型の配列: T)",
    "  整数型: I, J, MIN, work",
    "  for (I を 0 から Tの要素数 − 2 まで 1 ずつ増やす)",
    "    MIN ← I",
    "    for (J を I + 1 から Tの要素数 − 1 まで 1 ずつ増やす)",
    "      if (T[J] < T[MIN])",
    "        MIN ← J",
    "      endif",
    "    endfor",
    "    work ← T[I]",
    "    T[I] ← T[MIN]",
    "    T[MIN] ← work",
    "  endfor"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始", l: [1, 2] },
    { t: "boucle", nom: "整列処理", cond: "I:0, I < N − 1, 1", l: 3, lFin: 13, corps: [
      { t: "proc", txt: "MIN ← I", l: 4 },
      { t: "boucle", nom: "最小値探索", cond: "J:I + 1, J < N, 1", l: 5, lFin: 9, corps: [
        { t: "si", cond: "T[J] < T[MIN]", l: 6, oui: [{ t: "proc", txt: "MIN ← J", l: 7 }], non: [] }
      ] },
      { t: "proc", txt: "work ← T[I]", l: 10 },
      { t: "proc", txt: "T[I] ← T[MIN]", l: 11 },
      { t: "proc", txt: "T[MIN] ← work", l: 12 }
    ] },
    { t: "term", txt: "終了" }
  ] }],
  donnees: { a: [64, 25, 12, 22, 11] },
  vars: ["I", "J", "MIN", "work"], pointeurs: { I: "var(--matcha)", J: "var(--shu)", MIN: "var(--ai)" }, compteurs: ["cmp", "swap"],
  trace: L => ["I", "MIN", "T[MIN]", L("実行後の T", "T after")],
  ligne: (v, a, arr) => [v.I ?? "—", v.MIN ?? "—", v.MIN !== undefined ? a(v.MIN) : "—", arr.join("  ")],
  run(T) {
    const v = T.v, L = T.L;
    T.step(1, L(`T = {${T.liste()}} を昇順に整列する。`, `Sort T = {${T.liste()}} in ascending order.`));
    v.I = undefined; v.J = undefined; v.MIN = undefined; v.work = undefined;
    T.step(2, L("I（確定させる位置）、J（調べる位置）、MIN（最小値の添字）、work（交換用）。", "I (cell to fill), J (cell being checked), MIN (index of the smallest), work (for the swap)."));
    for (v.I = 0; ; v.I++) {
      if (v.I > T.n - 2) { T.fixer(T.n - 1); T.step(3, L("I が N − 1 に達した。最後の1つは自動的に最大。", "I reached N − 1. The last one is automatically the biggest.")); break; }
      T.step(3, L(`I = ${v.I}：T[${v.I}]〜T[${T.n - 1}] の最小値を T[${v.I}] に持ってくる。`, `I = ${v.I}: bring the smallest of T[${v.I}]…T[${T.n - 1}] to T[${v.I}].`), { look: [v.I] });
      v.MIN = v.I;
      T.step(4, L(`MIN ← I = ${v.I}：とりあえず T[${v.I}] = ${T.a(v.I)} を最小とする。`, `MIN ← I = ${v.I}: assume T[${v.I}] = ${T.a(v.I)} is the smallest.`), { look: [v.I] });
      for (v.J = v.I + 1; ; v.J++) {
        if (v.J > T.n - 1) { T.step(5, L(`J = ${v.J}：調べ終わった。最小は T[${v.MIN}] = ${T.a(v.MIN)}。`, `J = ${v.J}: all checked. The smallest is T[${v.MIN}] = ${T.a(v.MIN)}.`), { look: [v.MIN] }); break; }
        T.step(5, L(`J = ${v.J}。`, `J = ${v.J}.`), { look: [v.J] });
        const ok = T.a(v.J) < T.a(v.MIN); T.c.cmp++;
        T.step(6, L(`T[${v.J}] = ${T.a(v.J)} ${ok ? "<" : "≥"} T[MIN] = ${T.a(v.MIN)} → ${VF(L, ok)}。`, `T[${v.J}] = ${T.a(v.J)} ${ok ? "<" : "≥"} T[MIN] = ${T.a(v.MIN)} → ${VF(L, ok)}.`),
          { cmp: [v.J, v.MIN], q: { texte: L(`T[J] = ${T.a(v.J)}、T[MIN] = ${T.a(v.MIN)}。T[J] < T[MIN] は？`, `T[J] = ${T.a(v.J)}, T[MIN] = ${T.a(v.MIN)}. Is T[J] < T[MIN]?`), choix: [VF(L, true), VF(L, false)], bon: VF(L, ok) } });
        if (ok) { v.MIN = v.J; T.step(7, L(`MIN ← J = ${v.J}：新しい最小 ${T.a(v.J)}。`, `MIN ← J = ${v.J}: new smallest ${T.a(v.J)}.`), { look: [v.J] }); }
      }
      v.work = T.a(v.I);
      T.step(10, L(`work ← T[${v.I}] = ${v.work}（退避）。`, `work ← T[${v.I}] = ${v.work} (kept safe).`), { look: [v.I] });
      T.set(v.I, T.a(v.MIN));
      T.step(11, L(`T[I] ← T[MIN]：最小値 ${T.a(v.I)} を T[${v.I}] へ。`, `T[I] ← T[MIN]: the smallest ${T.a(v.I)} goes to T[${v.I}].`), { ecrit: [v.I] });
      T.set(v.MIN, v.work); T.c.swap++; T.fixer(v.I);
      T.step(12, L(`T[MIN] ← work：交換完了。T[${v.I}] = ${T.a(v.I)} が確定 ★`, `T[MIN] ← work: swap done. T[${v.I}] = ${T.a(v.I)} is final ★`),
        { ecrit: [v.MIN], row: true, q: { texte: L(`交換後、T[${v.I}] の値は？`, `After the swap, what is T[${v.I}]?`), choix: T.choix(T.a(v.I), T.arr()) } });
    }
    T.step(13, L(`完了！T = {${T.liste()}}。`, `Done! T = {${T.liste()}}.`), { fin: true });
  },
  blancs: [
    { ligne: 6, trou: "T[J] < T[MIN]", choix: ["T[J] < T[MIN]", "T[J] > T[MIN]", "T[I] < T[J]", "J < MIN"],
      expl: { ja: "昇順なので最小値を探す。より小さい要素を見つけたら MIN を更新。", en: "Ascending order: look for the smallest. When a smaller one appears, update MIN." } },
    { ligne: 5, trou: "I + 1", choix: ["I + 1", "0", "I", "1"],
      expl: { ja: "T[0]〜T[I − 1] は確定済み、T[I] は MIN の初期値。だから I + 1 から調べる。", en: "T[0]…T[I − 1] are final and T[I] is MIN’s start value, so checking starts at I + 1." } }
  ],
  qcm: [
    { ja: ["要素数 5 のとき、比較は何回？", ["10 回", "5 回", "4 回", "25 回"], "4 + 3 + 2 + 1 = 10 = N(N − 1) ÷ 2。"],
      en: ["With 5 elements, how many comparisons?", ["10", "5", "4", "25"], "4 + 3 + 2 + 1 = 10 = N(N − 1) ÷ 2."] }
  ]
},

{
  id: "koukan", cat: "seiretsu", jp: "基本交換法（バブルソート）", en: "Exchange (bubble) sort", ordre: "O(n²)",
  resume: { ja: "隣どうしを比べ、順序が逆なら交換する。1回の走査で最大値が末尾まで上がっていく。", en: "Compare neighbours and swap them when in the wrong order. Each pass pushes the biggest value to the end." },
  cle: { ja: "走査ごとに末尾の要素が確定（★）。交換には work が必要。", en: "Each pass fixes the last element (★). A swap needs work." },
  base: 0, tab: "T",
  prog: [
    "○koukan(整数型の配列: T)",
    "  整数型: K, I, work",
    "  for (K を Tの要素数 − 1 から 1 まで 1 ずつ減らす)",
    "    for (I を 0 から K − 1 まで 1 ずつ増やす)",
    "      if (T[I] > T[I + 1])",
    "        work ← T[I]",
    "        T[I] ← T[I + 1]",
    "        T[I + 1] ← work",
    "      endif",
    "    endfor",
    "  endfor"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始", l: [1, 2] },
    { t: "boucle", nom: "整列処理", cond: "K:N − 1, K > 0, −1", l: 3, lFin: 11, corps: [
      { t: "boucle", nom: "比較交換処理", cond: "I:0, I < K, 1", l: 4, lFin: 10, corps: [
        { t: "si", cond: "T[I] > T[I + 1]", l: 5, oui: [
          { t: "proc", txt: "work ← T[I]", l: 6 },
          { t: "proc", txt: "T[I] ← T[I + 1]", l: 7 },
          { t: "proc", txt: "T[I + 1] ← work", l: 8 }
        ], non: [] }
      ] }
    ] },
    { t: "term", txt: "終了" }
  ] }],
  donnees: { a: [6, 3, 8, 1, 5] },
  vars: ["K", "I", "work"], pointeurs: { K: "var(--matcha)", I: "var(--shu)" }, compteurs: ["cmp", "swap"],
  trace: L => ["K", "I", "T[I] > T[I+1]", L("交換", "swap"), L("実行後の T", "T after")],
  ligne: (v, a, arr, o, L) => [v.K ?? "—", v.I ?? "—", o.ok === undefined ? "—" : VF(L, o.ok), o.ok === undefined ? "—" : o.ok ? "✓" : "–", arr.join("  ")],
  run(T) {
    const v = T.v, L = T.L;
    T.step(1, L(`T = {${T.liste()}} を昇順に整列する。`, `Sort T = {${T.liste()}} in ascending order.`));
    v.K = undefined; v.I = undefined; v.work = undefined;
    T.step(2, L("K（走査の終わり）、I（比べる位置）、work（交換用）。", "K (end of the pass), I (position compared), work (for the swap)."));
    for (v.K = T.n - 1; ; v.K--) {
      if (v.K < 1) { T.fixer(0); T.step(3, L("K が 0 になった：整列完了。", "K reached 0: sorting done.")); break; }
      T.step(3, L(`K = ${v.K}：この走査で T[0]〜T[${v.K}] の最大値を T[${v.K}] へ運ぶ。`, `K = ${v.K}: this pass carries the biggest of T[0]…T[${v.K}] to T[${v.K}].`), { look: [v.K] });
      for (v.I = 0; ; v.I++) {
        if (v.I > v.K - 1) {
          T.fixer(v.K);
          T.step(4, L(`I = ${v.I}：走査終了。T[${v.K}] = ${T.a(v.K)} が確定 ★`, `I = ${v.I}: end of the pass. T[${v.K}] = ${T.a(v.K)} is final ★`),
            { look: [v.K], q: { texte: L(`走査 K = ${v.K} が終わる。T[${v.K}] に確定する値は？`, `Pass K = ${v.K} ends. Which value is fixed in T[${v.K}]?`), choix: T.choix(T.a(v.K), T.arr()) } });
          break;
        }
        T.step(4, L(`I = ${v.I}：T[${v.I}] と T[${v.I + 1}] を比べる。`, `I = ${v.I}: compare T[${v.I}] and T[${v.I + 1}].`), { look: [v.I, v.I + 1] });
        const ok = T.a(v.I) > T.a(v.I + 1); T.c.cmp++;
        T.step(5, L(`T[${v.I}] = ${T.a(v.I)} ${ok ? ">" : "≤"} T[${v.I + 1}] = ${T.a(v.I + 1)} → ${ok ? "逆順なので交換" : "そのまま"}。`, `T[${v.I}] = ${T.a(v.I)} ${ok ? ">" : "≤"} T[${v.I + 1}] = ${T.a(v.I + 1)} → ${ok ? "wrong order, swap" : "leave them"}.`),
          { cmp: [v.I, v.I + 1], ok, row: !ok, q: { texte: L(`T[${v.I}] = ${T.a(v.I)}、T[${v.I + 1}] = ${T.a(v.I + 1)}。交換する？`, `T[${v.I}] = ${T.a(v.I)}, T[${v.I + 1}] = ${T.a(v.I + 1)}. Swap?`), choix: [L("交換する", "swap"), L("しない", "no swap")], bon: ok ? L("交換する", "swap") : L("しない", "no swap") } });
        if (ok) {
          v.work = T.a(v.I);
          T.step(6, L(`work ← T[${v.I}]：${v.work} を退避。`, `work ← T[${v.I}]: ${v.work} kept safe.`), { look: [v.I] });
          T.set(v.I, T.a(v.I + 1));
          T.step(7, L(`T[I] ← T[I + 1]：${T.a(v.I)} が2つになった！でも ${v.work} は work にある。`, `T[I] ← T[I + 1]: ${T.a(v.I)} is there twice! But ${v.work} is safe in work.`), { ecrit: [v.I] });
          T.set(v.I + 1, v.work); T.c.swap++;
          T.step(8, L("T[I + 1] ← work：交換完了。", "T[I + 1] ← work: swap done."), { ecrit: [v.I + 1], row: true, ok,
            q: { texte: L(`この処理の後、T[${v.I + 1}] は？`, `What will T[${v.I + 1}] be?`), choix: T.choix(v.work, [T.a(v.I), v.I + 1, v.K]) } });
        }
      }
    }
    T.step(11, L(`完了！T = {${T.liste()}}。`, `Done! T = {${T.liste()}}.`), { fin: true });
  },
  blancs: [
    { ligne: 4, trou: "K − 1", choix: ["K − 1", "K", "Tの要素数 − 1", "0"],
      expl: { ja: "T[I] と T[I + 1] を比べるので、I + 1 が K を超えてはいけない。", en: "T[I] is compared with T[I + 1], so I + 1 must not go past K." } },
    { ligne: 8, trou: "work", choix: ["work", "T[I]", "T[I + 1]", "I"],
      expl: { ja: "7行目の後、元の T[I] の値は work にしか残っていない。", en: "After line 7, the old T[I] only survives in work." } }
  ],
  qcm: [
    { ja: ["交換が1回も起きない配列は？", ["{1, 3, 5, 6, 8}", "{8, 6, 5, 3, 1}", "{3, 1, 5, 6, 8}", "{1, 3, 6, 5, 8}"], "すでに整列済みなら比較はすべて偽。"],
      en: ["Which array causes no swap at all?", ["{1, 3, 5, 6, 8}", "{8, 6, 5, 3, 1}", "{3, 1, 5, 6, 8}", "{1, 3, 6, 5, 8}"], "Already sorted: every comparison is false."] }
  ]
},

{
  id: "sounyuu", cat: "seiretsu", jp: "基本挿入法", en: "Insertion sort", ordre: "O(n²)",
  resume: { ja: "左側を「整列済み」と考え、右の要素を1つずつ取り出して、整列済みの中の正しい位置へ挿入する。", en: "Treat the left part as sorted, take the next element and insert it at the right place inside the sorted part." },
  cle: { ja: "前の要素のほうが大きい間、交換しながら左へ移動。ほぼ整列済みのデータにはとても速い。", en: "Move left by swapping while the previous element is bigger. Very fast on nearly sorted data." },
  base: 0, tab: "T",
  prog: [
    "○sounyuu(整数型の配列: T)",
    "  整数型: I, J, work",
    "  for (I を 1 から Tの要素数 − 1 まで 1 ずつ増やす)",
    "    J ← I",
    "    while ((J > 0) and (T[J − 1] > T[J]))",
    "      work ← T[J]",
    "      T[J] ← T[J − 1]",
    "      T[J − 1] ← work",
    "      J ← J − 1",
    "    endwhile",
    "  endfor"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始", l: [1, 2] },
    { t: "boucle", nom: "整列処理", cond: "I:1, I < N, 1", l: 3, lFin: 11, corps: [
      { t: "proc", txt: "J ← I", l: 4 },
      { t: "boucle", nom: "挿入処理", cond: "J > 0 かつ T[J − 1] > T[J]", l: 5, lFin: 10, corps: [
        { t: "proc", txt: "work ← T[J]", l: 6 },
        { t: "proc", txt: "T[J] ← T[J − 1]", l: 7 },
        { t: "proc", txt: "T[J − 1] ← work", l: 8 },
        { t: "proc", txt: "J ← J − 1", l: 9 }
      ] }
    ] },
    { t: "term", txt: "終了" }
  ] }],
  donnees: { a: [31, 12, 45, 8, 27] },
  vars: ["I", "J", "work"], pointeurs: { I: "var(--matcha)", J: "var(--shu)" }, compteurs: ["cmp", "swap"],
  trace: L => ["I", L("挿入した値", "inserted"), L("実行後の T", "T after")],
  ligne: (v, a, arr, o) => [v.I ?? "—", o.val ?? "—", arr.join("  ")],
  run(T) {
    const v = T.v, L = T.L;
    T.step(1, L(`T = {${T.liste()}} を昇順に整列する。最初は T[0] だけが「整列済み」。`, `Sort T = {${T.liste()}}. At first only T[0] is “sorted”.`), { partiel: 0 });
    v.I = undefined; v.J = undefined; v.work = undefined;
    T.step(2, L("I（挿入する要素）、J（今の位置）、work（交換用）。", "I (element to insert), J (its current position), work (for the swap)."), { partiel: 0 });
    for (v.I = 1; ; v.I++) {
      if (v.I > T.n - 1) { for (let k = 0; k < T.n; k++) T.fixer(k); T.step(3, L("I が N になった：全体が整列済み。", "I reached N: the whole array is sorted.")); break; }
      const val = T.a(v.I);
      T.step(3, L(`I = ${v.I}：T[${v.I}] = ${val} を左の整列済み部分に挿入する。`, `I = ${v.I}: insert T[${v.I}] = ${val} into the sorted left part.`), { look: [v.I], partiel: v.I - 1 });
      v.J = v.I;
      T.step(4, L(`J ← I = ${v.J}。`, `J ← I = ${v.J}.`), { look: [v.J], partiel: v.I - 1 });
      while (true) {
        const pos = v.J > 0;
        const ok = pos && T.a(v.J - 1) > T.a(v.J);
        if (pos) T.c.cmp++;
        T.step(5, !pos ? L("J = 0：左端に着いた → ループ終了。", "J = 0: reached the left end → the loop ends.")
          : L(`T[${v.J - 1}] = ${T.a(v.J - 1)} ${ok ? ">" : "≤"} T[${v.J}] = ${T.a(v.J)} → ${ok ? "交換して左へ" : "ここが正しい位置"}。`, `T[${v.J - 1}] = ${T.a(v.J - 1)} ${ok ? ">" : "≤"} T[${v.J}] = ${T.a(v.J)} → ${ok ? "swap and move left" : "this is the right place"}.`),
          { cmp: pos ? [v.J - 1, v.J] : [], partiel: ok ? v.I - 1 : v.I, row: !ok, val,
            q: { texte: pos ? L(`T[${v.J - 1}] = ${T.a(v.J - 1)}、T[${v.J}] = ${T.a(v.J)}。もっと左へ動く？`, `T[${v.J - 1}] = ${T.a(v.J - 1)}, T[${v.J}] = ${T.a(v.J)}. Move further left?`) : L("J = 0。もっと左へ動く？", "J = 0. Move further left?"),
                 choix: [L("動く", "yes"), L("止まる", "no, stop")], bon: ok ? L("動く", "yes") : L("止まる", "no, stop") } });
        if (!ok) break;
        v.work = T.a(v.J);
        T.step(6, L(`work ← T[${v.J}] = ${v.work}。`, `work ← T[${v.J}] = ${v.work}.`), { look: [v.J], partiel: v.I - 1 });
        T.set(v.J, T.a(v.J - 1));
        T.step(7, L(`T[J] ← T[J − 1]：${T.a(v.J)} を右へずらす。`, `T[J] ← T[J − 1]: shift ${T.a(v.J)} to the right.`), { ecrit: [v.J], partiel: v.I - 1 });
        T.set(v.J - 1, v.work); T.c.swap++;
        T.step(8, L(`T[J − 1] ← work：${v.work} が1つ左へ。`, `T[J − 1] ← work: ${v.work} moved one cell left.`), { ecrit: [v.J - 1], partiel: v.I - 1 });
        v.J--;
        T.step(9, L(`J ← J − 1 = ${v.J}。`, `J ← J − 1 = ${v.J}.`), { look: [v.J], partiel: v.I - 1,
          q: { texte: L("この処理の後、J は？", "What will J be?"), choix: T.choix(v.J, [v.J + 1, v.I, 0]) } });
      }
    }
    T.step(11, L(`完了！T = {${T.liste()}}。`, `Done! T = {${T.liste()}}.`), { fin: true });
  },
  blancs: [
    { ligne: 5, trou: "T[J − 1] > T[J]", choix: ["T[J − 1] > T[J]", "T[J − 1] < T[J]", "T[J] > T[I]", "J > I"],
      expl: { ja: "左隣のほうが大きい間は、まだ正しい位置ではない。", en: "While the left neighbour is bigger, we are not at the right place yet." } },
    { ligne: 5, trou: "J > 0", choix: ["J > 0", "J > 1", "J < I", "J ≥ 0"],
      expl: { ja: "J = 0 なら左端。T[J − 1] = T[−1] は存在しない。", en: "J = 0 is the left end: T[J − 1] = T[−1] does not exist." } }
  ],
  qcm: [
    { ja: ["すでにほぼ整列しているデータに最も速いのは？", ["基本挿入法", "基本選択法", "基本交換法", "どれも同じ"], "挿入法は正しい位置ならすぐ止まるので、比較がほとんどいらない。"],
      en: ["Which one is fastest on nearly sorted data?", ["insertion sort", "selection sort", "bubble sort", "all the same"], "Insertion stops right away when an element is already in place."] }
  ]
},

/* ═══════════════════════════ データ構造 ═══════════════════════════ */
{
  id: "stack", cat: "kouzou", jp: "スタック", en: "Stack", ordre: "O(1)",
  resume: { ja: "後入れ先出し（LIFO）。最後に入れた（プッシュ）データを最初に取り出す（ポップ）。", en: "Last in, first out (LIFO). The last pushed item is the first popped." },
  cle: { ja: "Sp は「今いちばん上にある要素の位置」。空のとき Sp = −1。プッシュは Sp を増やしてから格納。", en: "Sp is “the position of the top element”. Empty means Sp = −1. Push increments Sp, then stores." },
  base: 0, tab: "S", ops: ["push", "pop"],
  prog: [
    "大域: 整数型の配列: S    /* 要素数 5 */",
    "大域: 整数型: Sp ← −1",
    "○push(整数型: num)",
    "  if (Sp < Sの要素数 − 1)",
    "    Sp ← Sp + 1",
    "    S[Sp] ← num",
    "  endif",
    "○整数型: pop()",
    "  整数型: v ← −1",
    "  if (Sp > −1)",
    "    v ← S[Sp]",
    "    Sp ← Sp − 1",
    "  endif",
    "  return v"
  ],
  flow: [
    { titre: "push", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "num 入力", l: 3 },
      { t: "si", cond: "Sp < N − 1", l: 4, oui: [{ t: "proc", txt: "Sp ← Sp + 1", l: 5 }, { t: "proc", txt: "S[Sp] ← num", l: 6 }], non: [] },
      { t: "term", txt: "終了" }
    ] },
    { titre: "pop", noeuds: [
      { t: "term", txt: "開始", l: [8, 9] },
      { t: "si", cond: "Sp > −1", l: 10, oui: [{ t: "io", txt: "S[Sp] 出力", l: 11 }, { t: "proc", txt: "Sp ← Sp − 1", l: 12 }], non: [] },
      { t: "term", txt: "終了", l: 14 }
    ] }
  ],
  donnees: { ops: [["push", 10], ["push", 20], ["push", 30], ["pop"], ["push", 40], ["pop"], ["pop"], ["pop"]] },
  prepare: () => [null, null, null, null, null],
  vars: ["Sp", "num", "v", "出力"], pointeurs: { Sp: "var(--shu)" }, compteurs: ["aff"],
  actif: (v, i) => i <= v.Sp,
  trace: L => [L("操作", "operation"), "Sp", L("出力", "output"), L("実行後の S", "S after")],
  ligne: (v, a, arr, o) => [o.op ?? "—", v.Sp ?? "—", o.sortie ?? "—", arr.map(x => x ?? "·").join("  ")],
  run(T) {
    const v = T.v, L = T.L, N = T.n;
    v.Sp = -1; v["出力"] = "";
    T.step(2, L("スタックは空：Sp = −1（どこも指していない）。", "The stack is empty: Sp = −1 (points nowhere)."));
    T.ops.forEach(([op, x], k) => {
      const fin = k === T.ops.length - 1;
      if (op === "push") {
        v.num = x; v.v = undefined;
        T.step(3, L(`push(${x}) を呼び出す。`, `Call push(${x}).`));
        const ok = v.Sp < N - 1;
        T.step(4, L(`Sp = ${v.Sp} ${ok ? "<" : "≥"} N − 1 = ${N - 1} → ${ok ? "空きがある" : "満杯なので何もしない"}。`, `Sp = ${v.Sp} ${ok ? "<" : "≥"} N − 1 = ${N - 1} → ${ok ? "there is room" : "full, nothing happens"}.`),
          { q: { texte: L(`Sp = ${v.Sp}。格納できる？`, `Sp = ${v.Sp}. Can it be stored?`), choix: [L("できる", "yes"), L("満杯", "full")], bon: ok ? L("できる", "yes") : L("満杯", "full") }, row: !ok, op: `push ${x}`, fin: fin && !ok });
        if (!ok) return;
        v.Sp++;
        T.step(5, L(`Sp ← Sp + 1 = ${v.Sp}：先に位置を1つ上げる。`, `Sp ← Sp + 1 = ${v.Sp}: first move up one cell.`),
          { look: [v.Sp], q: { texte: L("この処理の後、Sp は？", "What will Sp be?"), choix: T.choix(v.Sp, [v.Sp - 1, v.Sp + 1, x]) } });
        T.set(v.Sp, x);
        T.step(6, L(`S[${v.Sp}] ← ${x}：いちばん上に積んだ。`, `S[${v.Sp}] ← ${x}: stacked on top.`), { ecrit: [v.Sp], row: true, op: `push ${x}`, fin });
      } else {
        v.num = undefined;
        T.step(8, L("pop() を呼び出す。", "Call pop()."));
        v.v = -1;
        T.step(9, L("v ← −1：取り出せなかったときの値。", "v ← −1: the value if nothing can be taken."));
        const ok = v.Sp > -1;
        T.step(10, L(`Sp = ${v.Sp} ${ok ? ">" : "="} −1 → ${ok ? "データがある" : "空なので何もしない"}。`, `Sp = ${v.Sp} ${ok ? ">" : "="} −1 → ${ok ? "there is data" : "empty, nothing happens"}.`),
          { q: { texte: L(`Sp = ${v.Sp}。取り出せる？`, `Sp = ${v.Sp}. Can we pop?`), choix: [L("取り出せる", "yes"), L("空", "empty")], bon: ok ? L("取り出せる", "yes") : L("空", "empty") } });
        if (ok) {
          v.v = T.a(v.Sp);
          T.step(11, L(`v ← S[${v.Sp}] = ${v.v}：いちばん上のデータ。`, `v ← S[${v.Sp}] = ${v.v}: the top item.`),
            { look: [v.Sp], q: { texte: L("取り出される値は？", "Which value comes out?"), choix: T.choix(v.v, T.arr().filter(z => z !== null)) } });
          v.Sp--;
          T.step(12, L(`Sp ← Sp − 1 = ${v.Sp}。${v.v} は配列に残っているが、もうスタックの外（灰色）。`, `Sp ← Sp − 1 = ${v.Sp}. ${v.v} is still in the array, but outside the stack now (grey).`));
        }
        v["出力"] = (v["出力"] ? v["出力"] + ", " : "") + v.v;
        T.step(14, L(`return v → ${v.v}。`, `return v → ${v.v}.`), { row: true, op: "pop", sortie: v.v, fin });
      }
    });
  },
  blancs: [
    { ligne: 5, trou: "Sp ← Sp + 1", choix: ["Sp ← Sp + 1", "Sp ← Sp − 1", "Sp ← 0", "Sp ← num"],
      expl: { ja: "Sp は「今の一番上」を指すので、新しいデータの前に1つ上げる。", en: "Sp points to the current top, so it moves up before the new item is stored." } },
    { ligne: 11, trou: "S[Sp]", choix: ["S[Sp]", "S[0]", "S[Sp + 1]", "S[Sp − 1]"],
      expl: { ja: "LIFO：最後に入れたもの＝ Sp が指す要素を取り出す。", en: "LIFO: the last item in is the one Sp points to." } }
  ],
  qcm: [
    { ja: ["空のスタックに push 1, push 2, pop, push 3, pop の順に操作した。出力は？", ["2, 3", "1, 2", "2, 1", "3, 2"], "pop は最後に入れたものから出る。"],
      en: ["Empty stack: push 1, push 2, pop, push 3, pop. What is output?", ["2, 3", "1, 2", "2, 1", "3, 2"], "pop always takes the last item pushed."] },
    { ja: ["スタックの性質は？", ["LIFO", "FIFO", "優先度順", "ランダム"], "Last In, First Out。"],
      en: ["What kind of structure is a stack?", ["LIFO", "FIFO", "priority order", "random"], "Last In, First Out."] }
  ]
},

{
  id: "queue", cat: "kouzou", jp: "キュー（循環）", en: "Circular queue", ordre: "O(1)",
  resume: { ja: "先入れ先出し（FIFO）。末尾に入れて（エンキュー）、先頭から取り出す（デキュー）。配列は循環して使う。", en: "First in, first out (FIFO). Add at the tail (enqueue), take from the head (dequeue). The array is used in a circle." },
  cle: { ja: "Hp は先頭、Tp は末尾。(Tp + 1) mod N で配列の最後から最初に戻る。データ数は M で管理。", en: "Hp is the head, Tp the tail. (Tp + 1) mod N wraps from the last cell to the first. M counts the items." },
  base: 0, tab: "Q", ops: ["enq", "deq"],
  prog: [
    "大域: 整数型の配列: Q    /* 要素数 N = 5 */",
    "大域: 整数型: Hp ← 0, Tp ← 4, M ← 0",
    "○enqueue(整数型: num)",
    "  if (M < Qの要素数)",
    "    Tp ← (Tp + 1) mod Qの要素数",
    "    Q[Tp] ← num",
    "    M ← M + 1",
    "  endif",
    "○整数型: dequeue()",
    "  整数型: v ← −1",
    "  if (M > 0)",
    "    v ← Q[Hp]",
    "    Hp ← (Hp + 1) mod Qの要素数",
    "    M ← M − 1",
    "  endif",
    "  return v"
  ],
  flow: [
    { titre: "enqueue", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "num 入力", l: 3 },
      { t: "si", cond: "M < N", l: 4, oui: [{ t: "proc", txt: "Tp ← (Tp + 1) % N", l: 5 }, { t: "proc", txt: "Q[Tp] ← num", l: 6 }, { t: "proc", txt: "M ← M + 1", l: 7 }], non: [] },
      { t: "term", txt: "終了" }
    ] },
    { titre: "dequeue", noeuds: [
      { t: "term", txt: "開始", l: [9, 10] },
      { t: "si", cond: "M > 0", l: 11, oui: [{ t: "io", txt: "Q[Hp] 出力", l: 12 }, { t: "proc", txt: "Hp ← (Hp + 1) % N", l: 13 }, { t: "proc", txt: "M ← M − 1", l: 14 }], non: [] },
      { t: "term", txt: "終了", l: 16 }
    ] }
  ],
  donnees: { ops: [["enq", 10], ["enq", 20], ["enq", 30], ["deq"], ["enq", 40], ["enq", 50], ["enq", 60], ["deq"], ["enq", 70]] },
  prepare: () => [null, null, null, null, null],
  vars: ["Hp", "Tp", "M", "num", "v", "出力"], pointeurs: { Hp: "var(--matcha)", Tp: "var(--shu)" }, compteurs: ["aff"],
  actif: (v, i, n) => v.M !== undefined && ((i - v.Hp + n) % n) < v.M,
  trace: L => [L("操作", "operation"), "Hp", "Tp", "M", L("出力", "output")],
  ligne: (v, a, arr, o) => [o.op ?? "—", v.Hp, v.Tp, v.M, o.sortie ?? "—"],
  run(T) {
    const v = T.v, L = T.L, N = T.n;
    v.Hp = 0; v.Tp = N - 1; v.M = 0; v["出力"] = "";
    T.step(2, L(`キューは空：Hp = 0、Tp = ${N - 1}、M = 0。`, `The queue is empty: Hp = 0, Tp = ${N - 1}, M = 0.`));
    T.ops.forEach(([op, x], k) => {
      const fin = k === T.ops.length - 1;
      if (op === "enq") {
        v.num = x; v.v = undefined;
        T.step(3, L(`enqueue(${x}) を呼び出す。`, `Call enqueue(${x}).`));
        const ok = v.M < N;
        T.step(4, L(`M = ${v.M} ${ok ? "<" : "="} N = ${N} → ${ok ? "空きがある" : "満杯なので何もしない"}。`, `M = ${v.M} ${ok ? "<" : "="} N = ${N} → ${ok ? "there is room" : "full, nothing happens"}.`),
          { q: { texte: L(`M = ${v.M}。格納できる？`, `M = ${v.M}. Can it be stored?`), choix: [L("できる", "yes"), L("満杯", "full")], bon: ok ? L("できる", "yes") : L("満杯", "full") }, row: !ok, op: `enq ${x}`, fin: fin && !ok });
        if (!ok) return;
        const ancien = v.Tp;
        v.Tp = (v.Tp + 1) % N;
        T.step(5, L(`Tp ← (${ancien} + 1) mod ${N} = ${v.Tp}${ancien === N - 1 ? "：末尾から先頭に戻った（循環）！" : "。"}`, `Tp ← (${ancien} + 1) mod ${N} = ${v.Tp}${ancien === N - 1 ? ": wrapped from the end back to the start!" : "."}`),
          { look: [v.Tp], q: { texte: L(`(${ancien} + 1) mod ${N} は？`, `(${ancien} + 1) mod ${N} = ?`), choix: T.choix(v.Tp, [ancien + 1, ancien, 0, N]) } });
        T.set(v.Tp, x);
        T.step(6, L(`Q[${v.Tp}] ← ${x}：末尾に並んだ。`, `Q[${v.Tp}] ← ${x}: joins the tail.`), { ecrit: [v.Tp] });
        v.M++;
        T.step(7, L(`M ← M + 1 = ${v.M}。`, `M ← M + 1 = ${v.M}.`), { row: true, op: `enq ${x}`, fin });
      } else {
        v.num = undefined;
        T.step(9, L("dequeue() を呼び出す。", "Call dequeue()."));
        v.v = -1;
        T.step(10, L("v ← −1。", "v ← −1."));
        const ok = v.M > 0;
        T.step(11, L(`M = ${v.M} ${ok ? ">" : "="} 0 → ${ok ? "データがある" : "空なので何もしない"}。`, `M = ${v.M} ${ok ? ">" : "="} 0 → ${ok ? "there is data" : "empty, nothing happens"}.`),
          { q: { texte: L(`M = ${v.M}。取り出せる？`, `M = ${v.M}. Can we dequeue?`), choix: [L("取り出せる", "yes"), L("空", "empty")], bon: ok ? L("取り出せる", "yes") : L("空", "empty") } });
        if (ok) {
          v.v = T.a(v.Hp);
          T.step(12, L(`v ← Q[${v.Hp}] = ${v.v}：いちばん先に入ったデータ。`, `v ← Q[${v.Hp}] = ${v.v}: the item that came first.`),
            { look: [v.Hp], q: { texte: L("取り出される値は？", "Which value comes out?"), choix: T.choix(v.v, T.arr().filter(z => z !== null)) } });
          const ancien = v.Hp;
          v.Hp = (v.Hp + 1) % N;
          T.step(13, L(`Hp ← (${ancien} + 1) mod ${N} = ${v.Hp}。`, `Hp ← (${ancien} + 1) mod ${N} = ${v.Hp}.`));
          v.M--;
          T.step(14, L(`M ← M − 1 = ${v.M}。`, `M ← M − 1 = ${v.M}.`));
        }
        v["出力"] = (v["出力"] ? v["出力"] + ", " : "") + v.v;
        T.step(16, L(`return v → ${v.v}。`, `return v → ${v.v}.`), { row: true, op: "deq", sortie: v.v, fin });
      }
    });
  },
  blancs: [
    { ligne: 5, trou: "(Tp + 1) mod Qの要素数", choix: ["(Tp + 1) mod Qの要素数", "Tp + 1", "(Tp − 1) mod Qの要素数", "Hp + M"],
      expl: { ja: "mod N で、末尾の次が先頭に戻る。ただの Tp + 1 だと配列の外に出る。", en: "mod N makes the cell after the last one wrap to the first. Plain Tp + 1 would leave the array." } },
    { ligne: 12, trou: "Q[Hp]", choix: ["Q[Hp]", "Q[Tp]", "Q[0]", "Q[M]"],
      expl: { ja: "FIFO：いちばん先に入ったデータ＝ Hp が指す要素を取り出す。", en: "FIFO: the oldest item is the one Hp points to." } }
  ],
  qcm: [
    { ja: ["空のキューに enq 1, enq 2, deq, enq 3, deq の順に操作した。出力は？", ["1, 2", "2, 3", "2, 1", "1, 3"], "先に入れたものから出る。"],
      en: ["Empty queue: enq 1, enq 2, deq, enq 3, deq. What is output?", ["1, 2", "2, 3", "2, 1", "1, 3"], "Items come out in the order they went in."] },
    { ja: ["循環キューで Hp と Tp だけでは区別しにくいのは？", ["空と満杯", "先頭と末尾", "偶数と奇数", "整列済みかどうか"], "空のときも満杯のときも Hp と Tp の関係が同じになるので、M でデータ数を管理する。"],
      en: ["In a circular queue, what is hard to tell apart with only Hp and Tp?", ["empty and full", "head and tail", "even and odd", "sorted or not"], "Empty and full give the same Hp/Tp relation, so M counts the items."] }
  ]
},

{
  id: "liste", cat: "kouzou", jp: "リスト（追加・削除）", en: "Linked list (add / delete)", ordre: "O(n)",
  resume: { ja: "データ D と「次の要素の添字」P を組にして、ポインタでつなぐ。並び順を変えるのにデータを動かさず、ポインタだけを書き換える。", en: "Each item pairs data D with P, the index of the next item. To change the order, only pointers are rewritten — the data never moves." },
  cle: { ja: "追加：空きに格納 → 追加位置（prv と cur の間）を探す → P[I] ← cur、P[prv] ← I。削除：P[prv] ← P[cur] で飛ばす。", en: "Add: store in a free cell → find the spot (between prv and cur) → P[I] ← cur, P[prv] ← I. Delete: skip it with P[prv] ← P[cur]." },
  base: 0, tab: "D, P", visu: "liste", ops: ["add", "del"], opsArg: { add: true, del: true }, opsExemple: "add 30, del 20",
  prog: [
    "大域: 整数型の配列: D, P    /* 要素数 5。D[I] = −1 は空き */",
    "大域: 整数型: Top           /* 先頭要素の添字 */",
    "○tsuika(整数型: num)        /* 昇順を保って追加 */",
    "  整数型: I, prv, cur",
    "  I ← 0",
    "  while (D[I] ≠ −1)         /* 空き要素を探す */",
    "    I ← I + 1",
    "  endwhile",
    "  D[I] ← num",
    "  prv ← −1",
    "  cur ← Top",
    "  while ((cur ≠ −1) and (D[cur] < num))",
    "    prv ← cur",
    "    cur ← P[cur]",
    "  endwhile",
    "  P[I] ← cur",
    "  if (prv = −1)",
    "    Top ← I",
    "  else",
    "    P[prv] ← I",
    "  endif",
    "○sakujo(整数型: num)",
    "  整数型: prv, cur",
    "  prv ← −1",
    "  cur ← Top",
    "  while (D[cur] ≠ num)",
    "    prv ← cur",
    "    cur ← P[cur]",
    "  endwhile",
    "  if (prv = −1)",
    "    Top ← P[cur]",
    "  else",
    "    P[prv] ← P[cur]",
    "  endif",
    "  D[cur] ← −1",
    "  P[cur] ← −1"
  ],
  flow: [
    { titre: "追加", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "num 入力", l: [3, 4] },
      { t: "proc", txt: "I ← 0", l: 5 },
      { t: "boucle", nom: "空き探索", cond: "D[I] ≠ −1", l: 6, lFin: 8, corps: [{ t: "proc", txt: "I ← I + 1", l: 7 }] },
      { t: "proc", txt: "D[I] ← num", l: 9 },
      { t: "proc", txt: "prv ← −1", l: 10 },
      { t: "proc", txt: "cur ← Top", l: 11 },
      { t: "boucle", nom: "位置探索", cond: "cur ≠ −1 かつ D[cur] < num", l: 12, lFin: 15, corps: [
        { t: "proc", txt: "prv ← cur", l: 13 }, { t: "proc", txt: "cur ← P[cur]", l: 14 }] },
      { t: "proc", txt: "P[I] ← cur", l: 16 },
      { t: "si", cond: "prv = −1", l: 17, oui: [{ t: "proc", txt: "Top ← I", l: 18 }], non: [{ t: "proc", txt: "P[prv] ← I", l: 20 }] },
      { t: "term", txt: "終了" }
    ] },
    { titre: "削除", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "num 入力", l: [22, 23] },
      { t: "proc", txt: "prv ← −1", l: 24 },
      { t: "proc", txt: "cur ← Top", l: 25 },
      { t: "boucle", nom: "削除探索", cond: "D[cur] ≠ num", l: 26, lFin: 29, corps: [
        { t: "proc", txt: "prv ← cur", l: 27 }, { t: "proc", txt: "cur ← P[cur]", l: 28 }] },
      { t: "si", cond: "prv = −1", l: 30, oui: [{ t: "proc", txt: "Top ← P[cur]", l: 31 }], non: [{ t: "proc", txt: "P[prv] ← P[cur]", l: 33 }] },
      { t: "proc", txt: "D[cur] ← −1", l: 35 },
      { t: "proc", txt: "P[cur] ← −1", l: 36 },
      { t: "term", txt: "終了" }
    ] }
  ],
  donnees: { ops: [["add", 30], ["del", 20], ["add", 5]] },
  prepare: () => ({ D: [20, 40, 10, -1, -1], P: [1, -1, 0, -1, -1] }),
  hasard() {
    const dans = new Set([10, 20, 40]), ops = [];
    for (let k = 0; k < 4; k++) {
      if (dans.size >= 5 || (dans.size > 1 && Math.random() < .4)) { const x = [...dans][Math.floor(Math.random() * dans.size)]; dans.delete(x); ops.push(["del", x]); }
      else { let x; do { x = 1 + Math.floor(Math.random() * 60); } while (dans.has(x)); dans.add(x); ops.push(["add", x]); }
    }
    return ops;
  },
  vars: ["num", "I", "prv", "cur", "Top"], pointeurs: { I: "var(--kin)", prv: "var(--matcha)", cur: "var(--shu)" }, compteurs: ["cmp", "aff"],
  trace: L => [L("操作", "operation"), "I", "prv", "cur", "Top", L("リスト", "list")],
  ligne: (v, a, arr, o, L, tabs) => {
    const ch = []; const vu = new Set();
    for (let k = v.Top; k !== -1 && k !== undefined && !vu.has(k); k = tabs.P[k]) { ch.push(tabs.D[k]); vu.add(k); }
    return [o.op ?? "—", v.I ?? "—", v.prv ?? "—", v.cur ?? "—", v.Top, ch.join("→")];
  },
  run(T) {
    const v = T.v, L = T.L, D = i => T.t("D", i), P = i => T.t("P", i);
    const chaine = () => { const r = []; for (let k = v.Top; k !== -1; k = P(k)) r.push(D(k)); return r.join(" → "); };
    v.Top = 2;
    T.step(2, L(`リストは ${chaine()}。Top = 2：先頭は D[2]。配列の中の位置と、つながる順番は別。`, `The list is ${chaine()}. Top = 2: the first item is D[2]. Position in the array and order in the list are different things.`));
    T.ops.forEach(([op, x]) => {
      v.num = x; v.I = undefined; v.prv = undefined; v.cur = undefined;
      if (op === "add") {
        T.step(3, L(`tsuika(${x})：${x} を昇順の正しい位置に追加する。`, `tsuika(${x}): add ${x} at its place in ascending order.`));
        if (!T.tab("D").includes(-1)) { T.step(3, L("空きがないので、この例では追加しない。", "No free cell: this example skips the add."), { row: true, op: `add ${x}` }); return; }
        if (chaine().split(" → ").includes(String(x))) { T.step(3, L(`${x} はもうリストにあるので、この例では追加しない。`, `${x} is already in the list: this example skips the add.`), { row: true, op: `add ${x}` }); return; }
        T.step(4, L("I（空き要素）、prv（前の要素）、cur（今の要素）を用意。", "I (free cell), prv (previous item), cur (current item) are created."));
        v.I = 0;
        T.step(5, L("I ← 0：空き要素を先頭から探す。", "I ← 0: look for a free cell from the start."), { look: [0] });
        while (true) {
          const pris = D(v.I) !== -1;
          T.step(6, L(`D[${v.I}] = ${D(v.I)} → ${pris ? "使用中" : "空き！"}。`, `D[${v.I}] = ${D(v.I)} → ${pris ? "in use" : "free!"}.`),
            { look: [v.I], q: { texte: L(`D[${v.I}] = ${D(v.I)}。ここは空き？`, `D[${v.I}] = ${D(v.I)}. Is this cell free?`), choix: [L("空き", "free"), L("使用中", "in use")], bon: pris ? L("使用中", "in use") : L("空き", "free") } });
          if (!pris) break;
          v.I++;
          T.step(7, L(`I ← I + 1 = ${v.I}。`, `I ← I + 1 = ${v.I}.`), { look: [v.I] });
        }
        T.tset("D", v.I, x);
        T.step(9, L(`D[${v.I}] ← ${x}：データを空きに入れた。まだリストにはつながっていない。`, `D[${v.I}] ← ${x}: the data is in the free cell, but not linked to the list yet.`), { ecrit: [v.I] });
        v.prv = -1;
        T.step(10, L("prv ← −1：前の要素はまだない。", "prv ← −1: no previous item yet."));
        v.cur = v.Top;
        T.step(11, L(`cur ← Top = ${v.cur}：先頭からたどる。`, `cur ← Top = ${v.cur}: walk from the head.`), { look: [v.cur] });
        while (true) {
          const fin = v.cur === -1, plus = !fin && D(v.cur) < x;
          if (!fin) T.c.cmp++;
          T.step(12, fin ? L("cur = −1：リストの終わりに着いた → ここに追加。", "cur = −1: reached the end → add here.")
            : L(`D[${v.cur}] = ${D(v.cur)} ${plus ? "<" : "≥"} ${x} → ${plus ? "まだ先へ" : "ここ（cur の前）に追加"}。`, `D[${v.cur}] = ${D(v.cur)} ${plus ? "<" : "≥"} ${x} → ${plus ? "keep going" : "add here (before cur)"}.`),
            { cmp: fin ? [] : [v.cur], q: { texte: fin ? L("cur = −1。もっと先へ進む？", "cur = −1. Keep going?") : L(`D[cur] = ${D(v.cur)}、num = ${x}。もっと先へ進む？`, `D[cur] = ${D(v.cur)}, num = ${x}. Keep going?`),
              choix: [L("進む", "keep going"), L("止まる", "stop")], bon: plus ? L("進む", "keep going") : L("止まる", "stop") } });
          if (!plus) break;
          v.prv = v.cur;
          T.step(13, L(`prv ← cur = ${v.prv}。`, `prv ← cur = ${v.prv}.`));
          v.cur = P(v.cur);
          T.step(14, L(`cur ← P[${v.prv}] = ${v.cur}：次の要素へ。`, `cur ← P[${v.prv}] = ${v.cur}: next item.`),
            { look: v.cur === -1 ? [] : [v.cur], q: { texte: L(`P[${v.prv}] は？（cur の新しい値）`, `What is P[${v.prv}]? (the new cur)`), choix: T.choix(v.cur, [v.prv, -1, v.Top]) } });
        }
        T.tset("P", v.I, v.cur);
        T.step(16, L(`P[${v.I}] ← cur = ${v.cur}：新しい要素の次は cur。`, `P[${v.I}] ← cur = ${v.cur}: the new item points to cur.`), { ecrit: [v.I] });
        const tete = v.prv === -1;
        T.step(17, L(`prv = ${v.prv} → ${tete ? "先頭に追加する" : "途中に追加する"}。`, `prv = ${v.prv} → ${tete ? "add at the head" : "add in the middle"}.`),
          { q: { texte: L("prv = −1 は？", "Is prv = −1?"), choix: [L("真", "true"), L("偽", "false")], bon: tete ? L("真", "true") : L("偽", "false") } });
        if (tete) { v.Top = v.I; T.step(18, L(`Top ← ${v.I}：新しい先頭。リスト：${chaine()}。`, `Top ← ${v.I}: new head. List: ${chaine()}.`), { row: true, op: `add ${x}` }); }
        else { T.tset("P", v.prv, v.I); T.step(20, L(`P[${v.prv}] ← ${v.I}：前の要素から新しい要素へつないだ。リスト：${chaine()}。`, `P[${v.prv}] ← ${v.I}: the previous item now points to the new one. List: ${chaine()}.`), { ecrit: [v.prv], row: true, op: `add ${x}` }); }
      } else {
        T.step(22, L(`sakujo(${x})：${x} を削除する。`, `sakujo(${x}): delete ${x}.`));
        if (!chaine().split(" → ").includes(String(x))) { T.step(22, L(`${x} はリストにないので、この例では削除しない。`, `${x} is not in the list: this example skips the delete.`), { row: true, op: `del ${x}` }); return; }
        T.step(23, L("prv と cur を用意。", "prv and cur are created."));
        v.prv = -1; T.step(24, L("prv ← −1。", "prv ← −1."));
        v.cur = v.Top; T.step(25, L(`cur ← Top = ${v.cur}。`, `cur ← Top = ${v.cur}.`), { look: [v.cur] });
        while (true) {
          const ne = D(v.cur) !== x; T.c.cmp++;
          T.step(26, L(`D[${v.cur}] = ${D(v.cur)} ${ne ? "≠" : "="} ${x} → ${ne ? "次へ" : "見つかった"}。`, `D[${v.cur}] = ${D(v.cur)} ${ne ? "≠" : "="} ${x} → ${ne ? "next" : "found"}.`),
            { cmp: [v.cur], q: { texte: L(`D[cur] = ${D(v.cur)}。削除するデータ？`, `D[cur] = ${D(v.cur)}. Is it the one to delete?`), choix: [L("はい", "yes"), L("いいえ", "no")], bon: ne ? L("いいえ", "no") : L("はい", "yes") } });
          if (!ne) break;
          v.prv = v.cur; T.step(27, L(`prv ← cur = ${v.prv}。`, `prv ← cur = ${v.prv}.`));
          v.cur = P(v.cur); T.step(28, L(`cur ← P[${v.prv}] = ${v.cur}。`, `cur ← P[${v.prv}] = ${v.cur}.`), { look: [v.cur] });
        }
        const tete = v.prv === -1;
        T.step(30, L(`prv = ${v.prv} → ${tete ? "先頭を削除する" : "途中を削除する"}。`, `prv = ${v.prv} → ${tete ? "delete the head" : "delete in the middle"}.`),
          { q: { texte: L("prv = −1 は？", "Is prv = −1?"), choix: [L("真", "true"), L("偽", "false")], bon: tete ? L("真", "true") : L("偽", "false") } });
        if (tete) { v.Top = P(v.cur); T.step(31, L(`Top ← P[cur] = ${v.Top}：2番目が新しい先頭。`, `Top ← P[cur] = ${v.Top}: the second item becomes the head.`)); }
        else { T.tset("P", v.prv, P(v.cur)); T.step(33, L(`P[${v.prv}] ← P[${v.cur}] = ${P(v.prv)}：削除する要素を飛ばしてつないだ（論理的な削除）。`, `P[${v.prv}] ← P[${v.cur}] = ${P(v.prv)}: the link now skips the item (logical delete).`), { ecrit: [v.prv],
          q: { texte: L(`P[${v.prv}] に入る値は？`, `What goes into P[${v.prv}]?`), choix: T.choix(P(v.cur), [v.cur, -1, v.prv]) } }); }
        T.tset("D", v.cur, -1);
        T.step(35, L(`D[${v.cur}] ← −1：データも消す（物理的な削除）。`, `D[${v.cur}] ← −1: clear the data too (physical delete).`), { ecrit: [v.cur] });
        T.tset("P", v.cur, -1);
        T.step(36, L(`P[${v.cur}] ← −1。リスト：${chaine()}。`, `P[${v.cur}] ← −1. List: ${chaine()}.`), { ecrit: [v.cur], row: true, op: `del ${x}` });
      }
    });
    v.num = undefined; v.I = undefined; v.prv = undefined; v.cur = undefined;
    T.step(1, L(`すべての操作が終わった。リスト：${chaine()}。`, `All operations done. List: ${chaine()}.`), { fin: true });
  },
  blancs: [
    { ligne: 16, trou: "P[I] ← cur", choix: ["P[I] ← cur", "P[I] ← prv", "P[cur] ← I", "P[I] ← −1"],
      expl: { ja: "新しい要素は cur の前に入るので、新しい要素の次は cur。", en: "The new item goes before cur, so its “next” is cur." } },
    { ligne: 33, trou: "P[prv] ← P[cur]", choix: ["P[prv] ← P[cur]", "P[cur] ← P[prv]", "P[prv] ← cur", "Top ← cur"],
      expl: { ja: "前の要素から、削除する要素の「次」へ直接つなぐ。これで cur はたどれなくなる。", en: "Link the previous item straight to the deleted item’s “next”: cur can no longer be reached." } }
  ],
  qcm: [
    { ja: ["リストの利点は？", ["要素を移動せずに挿入・削除できる", "添字で直接アクセスできる", "常に整列されている", "メモリが少なくてすむ"], "ポインタを書き換えるだけで、データは動かさない。"],
      en: ["What is the advantage of a linked list?", ["insert/delete without moving items", "direct access by index", "always sorted", "uses less memory"], "Only pointers are rewritten; the data never moves."] },
    { ja: ["P[I] = −1 の意味は？", ["その要素がリストの最後", "その要素が空き", "その要素が先頭", "エラー"], "次の要素がない＝終端。"],
      en: ["What does P[I] = −1 mean?", ["the item is the last one", "the cell is free", "the item is the head", "an error"], "No next item = end of the list."] }
  ]
},

/* ═══════════════════════════ 木 ═══════════════════════════ */
{
  id: "haba", cat: "ki", jp: "幅優先探索", en: "Breadth-first traversal", ordre: "O(n)",
  resume: { ja: "根から順に、同じ深さのノードを左から右へ取り出す。次に見るノードの添字をキューに入れて管理する。", en: "From the root, visit the nodes level by level, left to right. The indexes of the nodes still to visit wait in a queue." },
  cle: { ja: "キューから1つ取り出して出力 → その左の子、右の子をキューの末尾へ。キューが空になったら終わり。", en: "Take one index from the queue and output it → put its left child, then its right child at the tail. Stop when the queue is empty." },
  base: 0, tab: "Data, Lp, Rp, Q", visu: "arbre",
  arbre: { data: "Data", lp: "Lp", rp: "Rp", root: () => 0 }, memoire: ["Data", "Lp", "Rp", "Q"], marques: { Q: ["Hp", "Tp"] },
  prog: [
    "大域: 整数型の配列: Data, Lp, Rp    /* 子がないときは −1 */",
    "大域: 整数型: Root ← 0",
    "○habayuusen()",
    "  整数型の配列: Q    /* キュー：見るノードの添字 */",
    "  整数型: Hp, Tp, I",
    "  Q[0] ← Root",
    "  Hp ← 0",
    "  Tp ← 0",
    "  while (Hp ≤ Tp)",
    "    I ← Q[Hp]",
    "    Hp ← Hp + 1",
    "    Data[I] を出力する",
    "    if (Lp[I] ≠ −1)",
    "      Tp ← Tp + 1",
    "      Q[Tp] ← Lp[I]",
    "    endif",
    "    if (Rp[I] ≠ −1)",
    "      Tp ← Tp + 1",
    "      Q[Tp] ← Rp[I]",
    "    endif",
    "  endwhile"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始", l: [3, 4, 5] },
    { t: "proc", txt: "Q[0] ← Root", l: 6 },
    { t: "proc", txt: "Hp ← 0", l: 7 },
    { t: "proc", txt: "Tp ← 0", l: 8 },
    { t: "boucle", nom: "ループ1", cond: "Hp ≤ Tp", l: 9, lFin: 21, corps: [
      { t: "proc", txt: "I ← Q[Hp]", l: 10 },
      { t: "proc", txt: "Hp ← Hp + 1", l: 11 },
      { t: "io", txt: "Data[I] 出力", l: 12 },
      { t: "si", cond: "Lp[I] ≠ −1", l: 13, oui: [{ t: "proc", txt: "Tp ← Tp + 1", l: 14 }, { t: "proc", txt: "Q[Tp] ← Lp[I]", l: 15 }], non: [] },
      { t: "si", cond: "Rp[I] ≠ −1", l: 17, oui: [{ t: "proc", txt: "Tp ← Tp + 1", l: 18 }, { t: "proc", txt: "Q[Tp] ← Rp[I]", l: 19 }], non: [] }
    ] },
    { t: "term", txt: "終了" }
  ] }],
  donnees: {},
  prepare: () => ({ Data: [50, 30, 70, 20, 40, 60], Lp: [1, 3, 5, -1, -1, -1], Rp: [2, 4, -1, -1, -1, -1], Q: [null, null, null, null, null, null] }),
  vars: ["I", "Hp", "Tp", "出力"], pointeurs: { I: "var(--shu)" }, compteurs: ["aff"],
  trace: L => ["I", "Data[I]", "Hp", "Tp", L("キュー", "queue"), L("出力", "output")],
  ligne: (v, a, arr, o, L, t) => [v.I ?? "—", v.I !== undefined ? t.Data[v.I] : "—", v.Hp ?? "—", v.Tp ?? "—",
    v.Hp !== undefined ? t.Q.slice(v.Hp, v.Tp + 1).join(" ") || "（空）" : "—", v["出力"] || "—"],
  run(T) {
    const v = T.v, L = T.L, D = i => T.t("Data", i), Lp = i => T.t("Lp", i), Rp = i => T.t("Rp", i);
    v["出力"] = "";
    T.step(1, L("木は配列で表す：Data にノードの値、Lp・Rp に左・右の子の添字（いなければ −1）。", "The tree lives in arrays: Data holds the values, Lp and Rp the indexes of the left and right children (−1 if none)."));
    T.step(3, L("habayuusen() を呼び出す。", "Call habayuusen()."));
    T.tset("Q", 0, 0);
    T.step(6, L("Q[0] ← Root：まず根をキューに入れる。", "Q[0] ← Root: first put the root in the queue."));
    v.Hp = 0; T.step(7, L("Hp ← 0：取り出す位置。", "Hp ← 0: where to take from."));
    v.Tp = 0; T.step(8, L("Tp ← 0：最後に入れた位置。", "Tp ← 0: where the last one went in."));
    while (true) {
      const cont = v.Hp <= v.Tp;
      T.step(9, L(`Hp = ${v.Hp} ${cont ? "≤" : ">"} Tp = ${v.Tp} → ${cont ? "キューにまだある" : "キューが空：終了"}。`, `Hp = ${v.Hp} ${cont ? "≤" : ">"} Tp = ${v.Tp} → ${cont ? "the queue is not empty" : "the queue is empty: done"}.`),
        { q: { texte: L(`Hp = ${v.Hp}、Tp = ${v.Tp}。ループは続く？`, `Hp = ${v.Hp}, Tp = ${v.Tp}. Does the loop go on?`), choix: [L("続く", "it goes on"), L("終わる", "it ends")], bon: cont ? L("続く", "it goes on") : L("終わる", "it ends") }, fin: !cont });
      if (!cont) break;
      v.I = T.t("Q", v.Hp);
      T.step(10, L(`I ← Q[${v.Hp}] = ${v.I}：キューの先頭のノード。`, `I ← Q[${v.Hp}] = ${v.I}: the node at the head of the queue.`), { look: [v.I],
        q: { texte: L("次に取り出されるノードの値は？", "Which node value comes out next?"), choix: T.choix(D(v.I), T.tab("Data")) } });
      v.Hp++; T.step(11, L(`Hp ← Hp + 1 = ${v.Hp}。`, `Hp ← Hp + 1 = ${v.Hp}.`), { look: [v.I] });
      T.fixer(v.I); v["出力"] = (v["出力"] ? v["出力"] + " " : "") + D(v.I);
      T.step(12, L(`${D(v.I)} を出力。`, `Output ${D(v.I)}.`), { look: [v.I], row: true });
      for (const [cote, f, l] of [[L("左", "left"), Lp, 13], [L("右", "right"), Rp, 17]]) {
        const a = f(v.I) !== -1;
        T.step(l, L(`${cote}の子 = ${f(v.I)} → ${a ? "いる" : "いない"}。`, `${cote} child = ${f(v.I)} → ${a ? "exists" : "none"}.`),
          { look: [v.I], q: { texte: L(`ノード ${D(v.I)} に${cote}の子はいる？`, `Does node ${D(v.I)} have a ${cote} child?`), choix: [L("いる", "yes"), L("いない", "no")], bon: a ? L("いる", "yes") : L("いない", "no") } });
        if (!a) continue;
        v.Tp++; T.step(l + 1, L(`Tp ← Tp + 1 = ${v.Tp}。`, `Tp ← Tp + 1 = ${v.Tp}.`));
        T.tset("Q", v.Tp, f(v.I));
        T.step(l + 2, L(`Q[${v.Tp}] ← ${f(v.I)}：${cote}の子（${D(f(v.I))}）をキューの末尾へ。`, `Q[${v.Tp}] ← ${f(v.I)}: the ${cote} child (${D(f(v.I))}) joins the tail of the queue.`), { look: [f(v.I)] });
      }
    }
  },
  blancs: [
    { ligne: 10, trou: "Q[Hp]", choix: ["Q[Hp]", "Q[Tp]", "Lp[I]", "Root"],
      expl: { ja: "キューは先頭（Hp）から取り出す。先に入れたノードから順に見るので、浅いレベルから進む。", en: "The queue is read from its head (Hp): nodes come out in the order they went in, level by level." } }
  ],
  qcm: [
    { ja: ["この木を幅優先探索すると、出力の順は？", ["50 30 70 20 40 60", "50 30 20 40 70 60", "20 30 40 50 60 70", "20 40 30 60 70 50"], "深さ 0 → 1 → 2 の順に、左から右へ。"],
      en: ["What order does a breadth-first traversal of this tree give?", ["50 30 70 20 40 60", "50 30 20 40 70 60", "20 30 40 50 60 70", "20 40 30 60 70 50"], "Level 0 → 1 → 2, left to right."] },
    { ja: ["幅優先探索で使うデータ構造は？", ["キュー", "スタック", "ヒープ", "ハッシュ表"], "先に入れたノードを先に見る（FIFO）。深さ優先ならスタック（または再帰）。"],
      en: ["Which structure does a breadth-first traversal use?", ["queue", "stack", "heap", "hash table"], "First in, first out. Depth-first uses a stack (or recursion)."] }
  ]
}
,

/* 深さ優先探索 : trois ordres générés par le même modèle */
...["saki", "naka", "ato"].map(o => {
  const M = {
    saki: { jp: "深さ優先探索（先行順）", en: "Depth-first: preorder", nom: "先行順（行きがけ）", nomEn: "preorder",
      lignes: ["  Data[I] を出力する", "  if (Lp[I] ≠ −1)", "    junkai(Lp[I])", "  endif", "  if (Rp[I] ≠ −1)", "    junkai(Rp[I])", "  endif"],
      out: 3, ifL: 4, callL: 5, ifR: 7, callR: 8, fin: 9, ordre: ["out", "L", "R"], res: "50 30 20 40 70 60",
      resume: { ja: "ノードを出力してから、左の部分木、右の部分木の順に回る（節 → 左 → 右）。", en: "Output the node first, then visit the left subtree, then the right one (node → left → right)." } },
    naka: { jp: "深さ優先探索（中間順）", en: "Depth-first: inorder", nom: "中間順（通りがけ）", nomEn: "inorder",
      lignes: ["  if (Lp[I] ≠ −1)", "    junkai(Lp[I])", "  endif", "  Data[I] を出力する", "  if (Rp[I] ≠ −1)", "    junkai(Rp[I])", "  endif"],
      out: 6, ifL: 3, callL: 4, ifR: 7, callR: 8, fin: 9, ordre: ["L", "out", "R"], res: "20 30 40 50 60 70",
      resume: { ja: "左の部分木を回ってからノードを出力し、最後に右の部分木（左 → 節 → 右）。2分探索木なら小さい順に並ぶ。", en: "Visit the left subtree, output the node, then the right subtree (left → node → right). On a binary search tree, values come out sorted." } },
    ato: { jp: "深さ優先探索（後行順）", en: "Depth-first: postorder", nom: "後行順（帰りがけ）", nomEn: "postorder",
      lignes: ["  if (Lp[I] ≠ −1)", "    junkai(Lp[I])", "  endif", "  if (Rp[I] ≠ −1)", "    junkai(Rp[I])", "  endif", "  Data[I] を出力する"],
      out: 9, ifL: 3, callL: 4, ifR: 6, callR: 7, fin: 9, ordre: ["L", "R", "out"], res: "20 40 30 60 70 50",
      resume: { ja: "左、右の部分木を回り終えてから、最後にノードを出力する（左 → 右 → 節）。", en: "Visit the left and right subtrees first, output the node last (left → right → node)." } }
  }[o];
  const fOut = { t: "io", txt: "Data[I] 出力", l: M.out };
  const fL = { t: "si", cond: "Lp[I] ≠ −1", l: M.ifL, oui: [{ t: "appel", txt: "木巡回(Lp[I])", l: M.callL }], non: [] };
  const fR = { t: "si", cond: "Rp[I] ≠ −1", l: M.ifR, oui: [{ t: "appel", txt: "木巡回(Rp[I])", l: M.callR }], non: [] };
  const corps = M.ordre.map(k => ({ out: fOut, L: fL, R: fR }[k]));
  const autres = { saki: "naka", naka: "ato", ato: "saki" };
  return {
    id: "fukasa-" + o, cat: "ki", jp: M.jp, en: M.en, ordre: "O(n)",
    resume: M.resume,
    cle: { ja: "再帰：junkai が自分自身を呼び出す。呼び出しが終わると、呼び出した場所に戻って続きを実行する。3つの順序の違いは「出力する位置」だけ。", en: "Recursion: junkai calls itself. When a call ends, execution returns to where it was called and goes on. The three orders only differ by where the output is." },
    base: 0, tab: "Data, Lp, Rp", visu: "arbre",
    arbre: { data: "Data", lp: "Lp", rp: "Rp", root: () => 0 }, memoire: ["Data", "Lp", "Rp"],
    prog: ["大域: 整数型の配列: Data, Lp, Rp    /* 最初は junkai(Root) で呼び出す */", `○junkai(整数型: I)    /* ${M.nom} */`, ...M.lignes],
    flow: [{ noeuds: [{ t: "term", txt: "木巡回(I)", l: 2 }, ...corps, { t: "term", txt: "出口", l: M.fin }] }],
    donnees: {},
    prepare: () => ({ Data: [50, 30, 70, 20, 40, 60], Lp: [1, 3, 5, -1, -1, -1], Rp: [2, 4, -1, -1, -1, -1] }),
    vars: ["I", "呼出し", "出力"], pointeurs: { I: "var(--shu)" }, compteurs: [],
    trace: L => [L("呼出し", "calls"), "I", L("出力", "output")],
    ligne: (v, a, arr, o2) => [v["呼出し"] || "—", v.I ?? "—", v["出力"] || "—"],
    run(T) {
      const v = T.v, L = T.L, D = i => T.t("Data", i), Lp = i => T.t("Lp", i), Rp = i => T.t("Rp", i), pile = [];
      v["出力"] = ""; v["呼出し"] = "";
      T.step(1, L(`junkai(Root) で根（${D(0)}）から始める。${M.nom}：出力の順番に注目。`, `Start from the root (${D(0)}) with junkai(Root). ${M.nomEn}: watch the output order.`));
      const montrer = I => { v.I = I; v["呼出し"] = pile.map(D).join(" → "); };
      const visite = I => {
        pile.push(I); montrer(I);
        T.step(2, L(`junkai(${I}) が始まる：ノード ${D(I)}。呼び出しの深さ ${pile.length}。`, `junkai(${I}) starts: node ${D(I)}. Call depth ${pile.length}.`), { look: [I] });
        for (const k of M.ordre) {
          if (k === "out") {
            T.fixer(I); v["出力"] = (v["出力"] ? v["出力"] + " " : "") + D(I);
            T.step(M.out, L(`${D(I)} を出力。`, `Output ${D(I)}.`), { look: [I], row: true });
            continue;
          }
          const f = k === "L" ? Lp : Rp, cote = k === "L" ? L("左", "left") : L("右", "right");
          const a = f(I) !== -1;
          T.step(k === "L" ? M.ifL : M.ifR, L(`${D(I)} の${cote}の子 → ${a ? D(f(I)) : "いない"}。`, `${cote} child of ${D(I)} → ${a ? D(f(I)) : "none"}.`),
            { look: [I], q: { texte: L(`${D(I)} に${cote}の子はいる？`, `Does ${D(I)} have a ${cote} child?`), choix: [L("いる", "yes"), L("いない", "no")], bon: a ? L("いる", "yes") : L("いない", "no") } });
          if (!a) continue;
          T.step(k === "L" ? M.callL : M.callR, L(`junkai(${f(I)}) を呼び出す：${cote}の部分木へ。今の続きは後で。`, `Call junkai(${f(I)}): go into the ${cote} subtree. The rest of this call waits.`), { look: [f(I)] });
          visite(f(I));
          montrer(I);
          T.step(k === "L" ? M.callL : M.callR, L(`junkai(${I}) に戻ってきた：ノード ${D(I)} の続きから。`, `Back in junkai(${I}): carry on with node ${D(I)}.`), { look: [I] });
        }
        T.step(M.fin, L(`junkai(${I}) が終わる：呼び出し元へ戻る。`, `junkai(${I}) ends: return to the caller.`), { look: [I], fin: pile.length === 1 });
        pile.pop();
      };
      visite(0);
    },
    blancs: [
      { ligne: M.callL, trou: "junkai(Lp[I])", choix: ["junkai(Lp[I])", "junkai(Rp[I])", "junkai(I)", "junkai(Root)"],
        expl: { ja: "左の子をあらたな「処理対象のノード」として、自分自身を呼び出す（再帰）。junkai(I) だと同じノードを永遠に呼び続ける。", en: "Call itself with the left child as the new node (recursion). junkai(I) would call the same node forever." } }
    ],
    qcm: [
      { ja: [`この木を${M.nom}で回ると、出力の順は？`, [M.res, ...["50 30 20 40 70 60", "20 30 40 50 60 70", "20 40 30 60 70 50", "50 30 70 20 40 60"].filter(r => r !== M.res).slice(0, 3)], `${M.nom}：${M.ordre.map(k => ({ out: "節", L: "左", R: "右" })[k]).join(" → ")}。`],
        en: [`What order does a ${M.nomEn} traversal of this tree give?`, [M.res, ...["50 30 20 40 70 60", "20 30 40 50 60 70", "20 40 30 60 70 50", "50 30 70 20 40 60"].filter(r => r !== M.res).slice(0, 3)], `${M.nomEn}: ${M.ordre.map(k => ({ out: "node", L: "left", R: "right" })[k]).join(" → ")}.`] },
      { ja: ["深さ優先探索で、再帰の代わりに使えるデータ構造は？", ["スタック", "キュー", "ハッシュ表", "リスト"], "呼び出しの「戻り先」を積んでおく＝ LIFO。"],
        en: ["What structure can replace recursion in a depth-first traversal?", ["stack", "queue", "hash table", "list"], "The “return points” pile up: LIFO."] }
    ]
  };
})
,

{
  id: "tansakugi", cat: "ki", jp: "2分探索木（探索・追加）", en: "Binary search tree (find / add)", ordre: "O(log n)",
  resume: { ja: "どのノードでも「左の部分木 < 節 < 右の部分木」。探す値と比べて、小さければ左、大きければ右へ下りていく。", en: "At every node: left subtree < node < right subtree. Compare with the value: smaller → go left, bigger → go right." },
  cle: { ja: "探索：見つかるか、子がない（−1）ところまで下りる。追加：同じように下りて、最後のノード J の子として新しいノードをつなぐ。", en: "Find: go down until found or until there is no child (−1). Add: go down the same way and hang the new node under the last node J." },
  base: 0, tab: "Data, Lp, Rp", visu: "arbre", ops: ["find", "add"], opsArg: { find: true, add: true }, opsExemple: "find 30, add 35",
  arbre: { data: "Data", lp: "Lp", rp: "Rp", root: () => 0 }, memoire: ["Data", "Lp", "Rp"],
  prog: [
    "大域: 整数型の配列: Data, Lp, Rp    /* 要素数 8 */",
    "大域: 整数型: Root ← 0, N ← 5        /* N：使用中のノード数 */",
    "○整数型: tansaku(整数型: num)",
    "  整数型: I ← Root",
    "  while ((I ≠ −1) and (Data[I] ≠ num))",
    "    if (num < Data[I])",
    "      I ← Lp[I]",
    "    else",
    "      I ← Rp[I]",
    "    endif",
    "  endwhile",
    "  return I",
    "○tsuika(整数型: num)",
    "  整数型: I ← Root, J ← −1",
    "  while (I ≠ −1)",
    "    J ← I",
    "    if (num < Data[I])",
    "      I ← Lp[I]",
    "    else",
    "      I ← Rp[I]",
    "    endif",
    "  endwhile",
    "  Data[N] ← num",
    "  Lp[N] ← −1",
    "  Rp[N] ← −1",
    "  if (num < Data[J])",
    "    Lp[J] ← N",
    "  else",
    "    Rp[J] ← N",
    "  endif",
    "  N ← N + 1"
  ],
  flow: [
    { titre: "探索", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "num 入力", l: 3 },
      { t: "proc", txt: "I ← Root", l: 4 },
      { t: "boucle", nom: "ループ1", cond: "I ≠ −1 かつ Data[I] ≠ num", l: 5, lFin: 11, corps: [
        { t: "si", cond: "num < Data[I]", l: 6, oui: [{ t: "proc", txt: "I ← Lp[I]", l: 7 }], non: [{ t: "proc", txt: "I ← Rp[I]", l: 9 }] }] },
      { t: "io", txt: "I 出力", l: 12 },
      { t: "term", txt: "終了" }
    ] },
    { titre: "追加", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "num 入力", l: [13, 14] },
      { t: "boucle", nom: "ループ1", cond: "I ≠ −1", l: 15, lFin: 22, corps: [
        { t: "proc", txt: "J ← I", l: 16 },
        { t: "si", cond: "num < Data[I]", l: 17, oui: [{ t: "proc", txt: "I ← Lp[I]", l: 18 }], non: [{ t: "proc", txt: "I ← Rp[I]", l: 20 }] }] },
      { t: "proc", txt: "Data[N] ← num", l: 23 },
      { t: "proc", txt: "Lp[N] ← −1, Rp[N] ← −1", l: [24, 25] },
      { t: "si", cond: "num < Data[J]", l: 26, oui: [{ t: "proc", txt: "Lp[J] ← N", l: 27 }], non: [{ t: "proc", txt: "Rp[J] ← N", l: 29 }] },
      { t: "proc", txt: "N ← N + 1", l: 31 },
      { t: "term", txt: "終了" }
    ] }
  ],
  donnees: { ops: [["find", 30], ["add", 35], ["find", 55]] },
  prepare: () => ({ Data: [40, 20, 60, 10, 30, null, null, null], Lp: [1, 3, -1, -1, -1, null, null, null], Rp: [2, 4, -1, -1, -1, null, null, null] }),
  hasard() {
    const dans = new Set([40, 20, 60, 10, 30]), ops = []; let n = 5;
    for (let k = 0; k < 4; k++) {
      let x; do { x = 1 + Math.floor(Math.random() * 80); } while (dans.has(x));
      if (n < 8 && Math.random() < .5) { ops.push(["add", x]); dans.add(x); n++; }
      else ops.push(["find", Math.random() < .6 ? [...dans][Math.floor(Math.random() * dans.size)] : x]);
    }
    return ops;
  },
  vars: ["num", "I", "J", "N"], pointeurs: { I: "var(--shu)", J: "var(--matcha)" }, compteurs: ["cmp"],
  trace: L => [L("操作", "operation"), "I", "J", "Data[I]", L("判定", "test")],
  ligne: (v, a, arr, o, L, t) => [o.op ?? "—", v.I ?? "—", v.J ?? "—", v.I !== undefined && v.I >= 0 ? t.Data[v.I] : "—", o.signe ?? "—"],
  run(T) {
    const v = T.v, L = T.L, D = i => T.t("Data", i), Lp = i => T.t("Lp", i), Rp = i => T.t("Rp", i);
    v.N = 5;
    T.step(2, L("2分探索木：どのノードでも 左 < 節 < 右。N = 5 個のノードが入っている。", "Binary search tree: at every node, left < node < right. N = 5 nodes are in use."));
    T.ops.forEach(([op, x]) => {
      v.num = x; v.I = undefined; v.J = undefined;
      if (op === "find") {
        T.step(3, L(`tansaku(${x})：${x} を探す。`, `tansaku(${x}): look for ${x}.`));
        v.I = 0; T.step(4, L("I ← Root：根から下りていく。", "I ← Root: go down from the root."), { look: [0] });
        while (true) {
          const dedans = v.I !== -1, ne = dedans && D(v.I) !== x;
          if (dedans) T.c.cmp++;
          const signe = !dedans ? "−1" : !ne ? "=" : x < D(v.I) ? "<" : ">";
          T.step(5, !dedans ? L("I = −1：子がない → 見つからなかった。", "I = −1: no child → not found.") : L(`Data[${v.I}] = ${D(v.I)} ${ne ? "≠" : "="} ${x} → ${ne ? "続ける" : "見つかった！"}`, `Data[${v.I}] = ${D(v.I)} ${ne ? "≠" : "="} ${x} → ${ne ? "go on" : "found!"}`),
            { cmp: dedans ? [v.I] : [], row: true, op: `find ${x}`, signe, q: { texte: dedans ? L(`Data[I] = ${D(v.I)}、num = ${x}。ループは続く？`, `Data[I] = ${D(v.I)}, num = ${x}. Does the loop go on?`) : L("I = −1。ループは続く？", "I = −1. Does the loop go on?"),
              choix: [L("続く", "it goes on"), L("終わる", "it ends")], bon: ne ? L("続く", "it goes on") : L("終わる", "it ends") } });
          if (!ne) break;
          const g = x < D(v.I);
          T.step(6, L(`${x} ${g ? "<" : ">"} ${D(v.I)} → ${g ? "左" : "右"}へ。`, `${x} ${g ? "<" : ">"} ${D(v.I)} → go ${g ? "left" : "right"}.`), { cmp: [v.I],
            q: { texte: L(`${x} と ${D(v.I)}。どちらへ下りる？`, `${x} and ${D(v.I)}. Which way down?`), choix: [L("左", "left"), L("右", "right")], bon: g ? L("左", "left") : L("右", "right") } });
          const avant = v.I;
          v.I = g ? Lp(v.I) : Rp(v.I);
          T.step(g ? 7 : 9, L(`I ← ${g ? "Lp" : "Rp"}[${avant}] = ${v.I}${v.I === -1 ? "（子がない）" : ""}。`, `I ← ${g ? "Lp" : "Rp"}[${avant}] = ${v.I}${v.I === -1 ? " (no child)" : ""}.`), { look: v.I === -1 ? [] : [v.I] });
        }
        T.step(12, L(`return ${v.I}${v.I === -1 ? "：見つからなかった" : `：${x} は Data[${v.I}]`}。`, `return ${v.I}${v.I === -1 ? ": not found" : `: ${x} is in Data[${v.I}]`}.`), { trouve: v.I === -1 ? [] : [v.I] });
      } else {
        T.step(13, L(`tsuika(${x})：${x} を追加する。`, `tsuika(${x}): add ${x}.`));
        if (v.N >= 8) { T.step(13, L("配列がいっぱいなので、この例では追加しない。", "The arrays are full: this example skips the add."), { row: true, op: `add ${x}` }); return; }
        v.I = 0; v.J = -1;
        T.step(14, L("I ← Root、J ← −1：J は「ひとつ前のノード」。", "I ← Root, J ← −1: J is “the node above”."), { look: [0] });
        while (true) {
          const cont = v.I !== -1;
          T.step(15, cont ? L(`I = ${v.I} → まだ下りられる。`, `I = ${v.I} → we can still go down.`) : L(`I = −1 → ここが空き。新しいノードは J（${D(v.J)}）の子になる。`, `I = −1 → this is the free spot. The new node becomes a child of J (${D(v.J)}).`),
            { q: { texte: L(`I = ${v.I}。ループは続く？`, `I = ${v.I}. Does the loop go on?`), choix: [L("続く", "it goes on"), L("終わる", "it ends")], bon: cont ? L("続く", "it goes on") : L("終わる", "it ends") } });
          if (!cont) break;
          v.J = v.I; T.step(16, L(`J ← I = ${v.J}。`, `J ← I = ${v.J}.`), { look: [v.J] });
          const g = x < D(v.I); T.c.cmp++;
          T.step(17, L(`${x} ${g ? "<" : ">"} ${D(v.I)} → ${g ? "左" : "右"}へ。`, `${x} ${g ? "<" : ">"} ${D(v.I)} → go ${g ? "left" : "right"}.`), { cmp: [v.I],
            q: { texte: L(`${x} と ${D(v.I)}。どちらへ下りる？`, `${x} and ${D(v.I)}. Which way down?`), choix: [L("左", "left"), L("右", "right")], bon: g ? L("左", "left") : L("右", "right") } });
          const avant = v.I;
          v.I = g ? Lp(v.I) : Rp(v.I);
          T.step(g ? 18 : 20, L(`I ← ${g ? "Lp" : "Rp"}[${avant}] = ${v.I}。`, `I ← ${g ? "Lp" : "Rp"}[${avant}] = ${v.I}.`), { look: v.I === -1 ? [] : [v.I] });
        }
        T.tset("Data", v.N, x);
        T.step(23, L(`Data[${v.N}] ← ${x}：空いている ${v.N} 番に入れる。`, `Data[${v.N}] ← ${x}: store it in free cell ${v.N}.`), { ecrit: [v.N] });
        T.tset("Lp", v.N, -1); T.step(24, L(`Lp[${v.N}] ← −1：まだ子はいない。`, `Lp[${v.N}] ← −1: no children yet.`));
        T.tset("Rp", v.N, -1); T.step(25, L(`Rp[${v.N}] ← −1。`, `Rp[${v.N}] ← −1.`));
        const g = x < D(v.J);
        T.step(26, L(`${x} ${g ? "<" : ">"} Data[J] = ${D(v.J)} → ${g ? "左" : "右"}の子にする。`, `${x} ${g ? "<" : ">"} Data[J] = ${D(v.J)} → make it the ${g ? "left" : "right"} child.`), { look: [v.J] });
        T.tset(g ? "Lp" : "Rp", v.J, v.N);
        T.step(g ? 27 : 29, L(`${g ? "Lp" : "Rp"}[${v.J}] ← ${v.N}：つながった！`, `${g ? "Lp" : "Rp"}[${v.J}] ← ${v.N}: linked!`), { ecrit: [v.J, v.N] });
        v.N++; T.step(31, L(`N ← N + 1 = ${v.N}。`, `N ← N + 1 = ${v.N}.`), { row: true, op: `add ${x}` });
      }
    });
    v.num = undefined; v.I = undefined; v.J = undefined;
    T.step(2, L("すべての操作が終わった。", "All operations done."), { fin: true });
  },
  blancs: [
    { ligne: 6, trou: "num < Data[I]", choix: ["num < Data[I]", "num > Data[I]", "Lp[I] < Rp[I]", "I < num"],
      expl: { ja: "小さい値は左の部分木にある。だから num が小さければ左（Lp）へ。", en: "Smaller values live in the left subtree: if num is smaller, go left (Lp)." } },
    { ligne: 16, trou: "J ← I", choix: ["J ← I", "I ← J", "J ← Lp[I]", "J ← N"],
      expl: { ja: "I が −1 になる前に、ひとつ前のノードを J に覚えておく。新しいノードは J の子になる。", en: "Before I becomes −1, remember the node above in J: the new node will hang under J." } }
  ],
  qcm: [
    { ja: ["2分探索木を中間順でたどると、値はどう並ぶ？", ["昇順", "降順", "追加した順", "根からの深さ順"], "左 < 節 < 右 なので、左 → 節 → 右 でたどると小さい順。"],
      en: ["In what order does an inorder traversal of a binary search tree give the values?", ["ascending", "descending", "insertion order", "by depth"], "left < node < right, so left → node → right is sorted."] },
    { ja: ["2分探索木が偏って一直線になると、探索の計算量は？", ["O(n)", "O(log n)", "O(1)", "O(n²)"], "1本の線になると、線形探索と同じ。"],
      en: ["If the tree degenerates into a single line, what does finding cost?", ["O(n)", "O(log n)", "O(1)", "O(n²)"], "A single line is just a linear search."] }
  ]
}


];
})();
