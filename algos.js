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
},

{
  id: "heap", cat: "ki", jp: "ヒープ（追加・取出し）", en: "Heap (add / take)", ordre: "O(log n)",
  resume: { ja: "親 ≥ 子 がどこでも成り立つ2分木。配列で表し、T[I] の子は T[2I + 1] と T[2I + 2]、親は T[(I − 1) ÷ 2]。根がいつも最大値。", en: "A binary tree where parent ≥ child everywhere. Stored in an array: the children of H[I] are H[2I + 1] and H[2I + 2], its parent H[(I − 1) ÷ 2]. The root is always the maximum." },
  cle: { ja: "追加：末尾に入れて、親より大きい間は上へ交換。取出し：根を取り、末尾を根に移して、大きいほうの子と交換しながら下へ。", en: "Add: put it at the end, swap upward while bigger than its parent. Take: remove the root, move the last item to the root, swap downward with the bigger child." },
  base: 0, tab: "H", visu: "arbre", ops: ["add", "take"], opsArg: { add: true }, opsExemple: "add 85, take",
  arbre: { tab: "H", implicite: true, n: v => v.N }, memoire: ["H"],
  prog: [
    "大域: 整数型の配列: H    /* 要素数 8。どこでも 親 ≥ 子 */",
    "大域: 整数型: N ← 5      /* 使用中の要素数 */",
    "○tsuika(整数型: num)",
    "  整数型: I, J, work",
    "  I ← N",
    "  H[I] ← num",
    "  N ← N + 1",
    "  J ← (I − 1) ÷ 2 の商    /* 親の添字 */",
    "  while ((I > 0) and (H[J] < H[I]))",
    "    work ← H[I]",
    "    H[I] ← H[J]",
    "    H[J] ← work",
    "    I ← J",
    "    J ← (I − 1) ÷ 2 の商",
    "  endwhile",
    "○整数型: toridashi()",
    "  整数型: I, K, work, v",
    "  v ← H[0]",
    "  N ← N − 1",
    "  H[0] ← H[N]",
    "  I ← 0",
    "  K ← 2 × I + 1    /* 左の子 */",
    "  while (K < N)",
    "    if ((K + 1 < N) and (H[K + 1] > H[K]))",
    "      K ← K + 1",
    "    endif",
    "    if (H[I] < H[K])",
    "      work ← H[I]",
    "      H[I] ← H[K]",
    "      H[K] ← work",
    "      I ← K",
    "      K ← 2 × I + 1",
    "    else",
    "      K ← N    /* 交換不要：ループを終える */",
    "    endif",
    "  endwhile",
    "  return v"
  ],
  flow: [
    { titre: "追加", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "num 入力", l: [3, 4] },
      { t: "proc", txt: "I ← N", l: 5 },
      { t: "proc", txt: "H[I] ← num", l: 6 },
      { t: "proc", txt: "N ← N + 1", l: 7 },
      { t: "proc", txt: "J ← (I − 1) ÷ 2", l: 8 },
      { t: "boucle", nom: "再編成", cond: "I > 0 かつ H[J] < H[I]", l: 9, lFin: 15, corps: [
        { t: "proc", txt: "work ← H[I]", l: 10 }, { t: "proc", txt: "H[I] ← H[J]", l: 11 }, { t: "proc", txt: "H[J] ← work", l: 12 },
        { t: "proc", txt: "I ← J", l: 13 }, { t: "proc", txt: "J ← (I − 1) ÷ 2", l: 14 }] },
      { t: "term", txt: "終了" }
    ] },
    { titre: "取出し", noeuds: [
      { t: "term", txt: "開始", l: [16, 17] },
      { t: "proc", txt: "v ← H[0]", l: 18 },
      { t: "proc", txt: "N ← N − 1", l: 19 },
      { t: "proc", txt: "H[0] ← H[N]", l: 20 },
      { t: "proc", txt: "I ← 0", l: 21 },
      { t: "proc", txt: "K ← 2 × I + 1", l: 22 },
      { t: "boucle", nom: "再編成", cond: "K < N", l: 23, lFin: 36, corps: [
        { t: "si", cond: "K + 1 < N かつ H[K + 1] > H[K]", l: 24, oui: [{ t: "proc", txt: "K ← K + 1", l: 25 }], non: [] },
        { t: "si", cond: "H[I] < H[K]", l: 27, oui: [
          { t: "proc", txt: "work ← H[I]", l: 28 }, { t: "proc", txt: "H[I] ← H[K]", l: 29 }, { t: "proc", txt: "H[K] ← work", l: 30 },
          { t: "proc", txt: "I ← K", l: 31 }, { t: "proc", txt: "K ← 2 × I + 1", l: 32 }], non: [{ t: "proc", txt: "K ← N", l: 34 }] }] },
      { t: "io", txt: "v 出力", l: 37 },
      { t: "term", txt: "終了" }
    ] }
  ],
  donnees: { ops: [["add", 85], ["take"], ["add", 40]] },
  prepare: () => ({ H: [90, 70, 80, 30, 50, null, null, null] }),
  hasard() {
    const ops = []; let n = 5;
    for (let k = 0; k < 4; k++) {
      if (n >= 8 || (n > 1 && Math.random() < .4)) { ops.push(["take"]); n--; }
      else { ops.push(["add", 10 + Math.floor(Math.random() * 89)]); n++; }
    }
    return ops;
  },
  vars: ["num", "I", "J", "K", "N", "v", "出力"], pointeurs: { I: "var(--shu)", J: "var(--matcha)", K: "var(--ai)" }, compteurs: ["cmp", "swap"],
  trace: L => [L("操作", "operation"), "N", L("ヒープ", "heap"), L("出力", "output")],
  ligne: (v, a, arr, o, L, t) => [o.op ?? "—", v.N, t.H.slice(0, v.N).join(" "), v["出力"] || "—"],
  run(T) {
    const v = T.v, L = T.L, H = i => T.t("H", i), quo = i => Math.max(0, Math.trunc((i - 1) / 2));
    v.N = 5; v["出力"] = "";
    T.step(2, L("ヒープ：どの親も子以上。だから根 H[0] がいつも最大。", "Heap: every parent ≥ its children, so the root H[0] is always the maximum."));
    T.ops.forEach(([op, x]) => {
      v.num = undefined; v.I = undefined; v.J = undefined; v.K = undefined; v.v = undefined;
      if (op === "add") {
        v.num = x;
        T.step(3, L(`tsuika(${x})：${x} を追加する。`, `tsuika(${x}): add ${x}.`));
        if (v.N >= 8) { T.step(3, L("いっぱいなので、この例では追加しない。", "Full: this example skips the add."), { row: true, op: `add ${x}` }); return; }
        T.step(4, L("I（今の位置）、J（親の位置）。", "I (current position), J (parent position)."));
        v.I = v.N; T.step(5, L(`I ← N = ${v.I}：いちばん後ろに入れる。`, `I ← N = ${v.I}: put it at the very end.`), { look: [v.I] });
        T.tset("H", v.I, x); T.step(6, L(`H[${v.I}] ← ${x}。`, `H[${v.I}] ← ${x}.`), { ecrit: [v.I] });
        v.N++; T.step(7, L(`N ← N + 1 = ${v.N}。`, `N ← N + 1 = ${v.N}.`), { look: [v.I] });
        v.J = quo(v.I); T.step(8, L(`J ← (${v.I} − 1) ÷ 2 = ${v.J}：親の位置。`, `J ← (${v.I} − 1) ÷ 2 = ${v.J}: the parent.`), { look: [v.J],
          q: { texte: L(`H[${v.I}] の親の添字は？`, `What is the parent index of H[${v.I}]?`), choix: T.choix(v.J, [v.I - 1, v.I * 2 + 1, Math.trunc(v.I / 2) === v.J ? v.J + 1 : Math.trunc(v.I / 2)]) } });
        while (true) {
          const monte = v.I > 0 && H(v.J) < H(v.I);
          if (v.I > 0) T.c.cmp++;
          T.step(9, v.I === 0 ? L("I = 0：根に着いた → 終了。", "I = 0: reached the root → done.") : L(`親 H[${v.J}] = ${H(v.J)} ${monte ? "<" : "≥"} H[${v.I}] = ${H(v.I)} → ${monte ? "親より大きいので交換" : "ヒープの形が正しい"}。`, `parent H[${v.J}] = ${H(v.J)} ${monte ? "<" : "≥"} H[${v.I}] = ${H(v.I)} → ${monte ? "bigger than its parent: swap" : "the heap is fine"}.`),
            { cmp: v.I > 0 ? [v.J, v.I] : [], q: { texte: v.I === 0 ? L("I = 0。まだ上へ？", "I = 0. Keep going up?") : L(`親 ${H(v.J)}、子 ${H(v.I)}。交換する？`, `Parent ${H(v.J)}, child ${H(v.I)}. Swap?`), choix: [L("交換する", "swap"), L("しない", "no")], bon: monte ? L("交換する", "swap") : L("しない", "no") } });
          if (!monte) break;
          v.work = H(v.I); T.step(10, L(`work ← ${v.work}。`, `work ← ${v.work}.`));
          T.tset("H", v.I, H(v.J)); T.step(11, L(`H[${v.I}] ← H[${v.J}]。`, `H[${v.I}] ← H[${v.J}].`), { ecrit: [v.I] });
          T.tset("H", v.J, v.work); T.c.swap++; T.step(12, L(`H[${v.J}] ← work：${v.work} が1段上がった。`, `H[${v.J}] ← work: ${v.work} moved up one level.`), { ecrit: [v.J] });
          v.I = v.J; T.step(13, L(`I ← J = ${v.I}。`, `I ← J = ${v.I}.`), { look: [v.I] });
          v.J = quo(v.I); T.step(14, L(`J ← ${v.J}：新しい親。`, `J ← ${v.J}: the new parent.`), { look: [v.J] });
        }
        T.step(15, L(`追加完了。`, `Add done.`), { row: true, op: `add ${x}` });
      } else {
        T.step(16, L("toridashi()：最大値（根）を取り出す。", "toridashi(): take out the maximum (the root)."));
        if (v.N === 0) { T.step(16, L("空なので、この例では取り出さない。", "Empty: this example skips."), { row: true, op: "take" }); return; }
        T.step(17, L("I、K（大きいほうの子）、v（取り出す値）。", "I, K (the bigger child), v (the value taken)."));
        v.v = H(0); T.step(18, L(`v ← H[0] = ${v.v}：根が最大値。`, `v ← H[0] = ${v.v}: the root is the maximum.`), { look: [0],
          q: { texte: L("取り出される値は？", "Which value comes out?"), choix: T.choix(v.v, T.tab("H").filter(z => z !== null)) } });
        v.N--; T.step(19, L(`N ← N − 1 = ${v.N}。`, `N ← N − 1 = ${v.N}.`));
        T.tset("H", 0, H(v.N)); T.step(20, L(`H[0] ← H[${v.N}] = ${H(0)}：いちばん後ろを根に移す。ヒープが崩れた！`, `H[0] ← H[${v.N}] = ${H(0)}: the last item moves to the root. The heap is broken!`), { ecrit: [0] });
        v.I = 0; T.step(21, L("I ← 0：根から下へ直していく。", "I ← 0: fix it from the root downward."), { look: [0] });
        v.K = 1; T.step(22, L("K ← 2 × 0 + 1 = 1：左の子。", "K ← 2 × 0 + 1 = 1: the left child."));
        while (true) {
          const cont = v.K < v.N;
          T.step(23, cont ? L(`K = ${v.K} < N = ${v.N} → 子がいる。`, `K = ${v.K} < N = ${v.N} → there is a child.`) : L(`K = ${v.K} ≥ N = ${v.N} → 終了。`, `K = ${v.K} ≥ N = ${v.N} → done.`));
          if (!cont) break;
          const droite = v.K + 1 < v.N && H(v.K + 1) > H(v.K);
          if (v.K + 1 < v.N) T.c.cmp++;
          T.step(24, v.K + 1 < v.N ? L(`左 ${H(v.K)}、右 ${H(v.K + 1)} → 大きいのは${droite ? "右" : "左"}。`, `left ${H(v.K)}, right ${H(v.K + 1)} → the bigger one is on the ${droite ? "right" : "left"}.`) : L("右の子はいない。", "No right child."),
            { cmp: v.K + 1 < v.N ? [v.K, v.K + 1] : [v.K], q: v.K + 1 < v.N ? { texte: L(`左 ${H(v.K)}、右 ${H(v.K + 1)}。大きいのは？`, `Left ${H(v.K)}, right ${H(v.K + 1)}. Which is bigger?`), choix: [L("左", "left"), L("右", "right")], bon: droite ? L("右", "right") : L("左", "left") } : undefined });
          if (droite) { v.K++; T.step(25, L(`K ← K + 1 = ${v.K}。`, `K ← K + 1 = ${v.K}.`), { look: [v.K] }); }
          const desc = H(v.I) < H(v.K); T.c.cmp++;
          T.step(27, L(`H[${v.I}] = ${H(v.I)} ${desc ? "<" : "≥"} H[${v.K}] = ${H(v.K)} → ${desc ? "子と交換して下へ" : "ヒープの形が正しい"}。`, `H[${v.I}] = ${H(v.I)} ${desc ? "<" : "≥"} H[${v.K}] = ${H(v.K)} → ${desc ? "swap with the child, go down" : "the heap is fine"}.`),
            { cmp: [v.I, v.K], q: { texte: L(`親 ${H(v.I)}、子 ${H(v.K)}。交換する？`, `Parent ${H(v.I)}, child ${H(v.K)}. Swap?`), choix: [L("交換する", "swap"), L("しない", "no")], bon: desc ? L("交換する", "swap") : L("しない", "no") } });
          if (desc) {
            v.work = H(v.I); T.step(28, L(`work ← ${v.work}。`, `work ← ${v.work}.`));
            T.tset("H", v.I, H(v.K)); T.step(29, L(`H[${v.I}] ← H[${v.K}]。`, `H[${v.I}] ← H[${v.K}].`), { ecrit: [v.I] });
            T.tset("H", v.K, v.work); T.c.swap++; T.step(30, L(`H[${v.K}] ← work。`, `H[${v.K}] ← work.`), { ecrit: [v.K] });
            v.I = v.K; T.step(31, L(`I ← K = ${v.I}。`, `I ← K = ${v.I}.`), { look: [v.I] });
            v.K = 2 * v.I + 1; T.step(32, L(`K ← 2 × ${v.I} + 1 = ${v.K}。`, `K ← 2 × ${v.I} + 1 = ${v.K}.`));
          } else { v.K = v.N; T.step(34, L("K ← N：ループを終える。", "K ← N: leave the loop.")); }
        }
        v["出力"] = (v["出力"] ? v["出力"] + ", " : "") + v.v;
        T.step(37, L(`return ${v.v}。`, `return ${v.v}.`), { row: true, op: "take" });
      }
    });
    v.num = undefined; v.I = undefined; v.J = undefined; v.K = undefined;
    T.step(2, L("すべての操作が終わった。", "All operations done."), { fin: true });
  },
  blancs: [
    { ligne: 8, trou: "(I − 1) ÷ 2 の商", choix: ["(I − 1) ÷ 2 の商", "I ÷ 2 の商", "2 × I + 1", "I − 1"],
      expl: { ja: "添字が 0 から始まるとき、子は 2I + 1 と 2I + 2。だから親は (I − 1) ÷ 2。", en: "With indexes from 0, the children are 2I + 1 and 2I + 2, so the parent is (I − 1) ÷ 2." } },
    { ligne: 27, trou: "H[I] < H[K]", choix: ["H[I] < H[K]", "H[I] > H[K]", "H[K] < H[K + 1]", "K < N"],
      expl: { ja: "親のほうが小さいときだけ、親 ≥ 子 が崩れているので交換する。", en: "Only when the parent is smaller is “parent ≥ child” broken, so swap." } }
  ],
  qcm: [
    { ja: ["ヒープ（親 ≥ 子）で、必ず最大値がある場所は？", ["根", "いちばん後ろ", "いちばん左の葉", "決まっていない"], "どの親も子以上なので、いちばん上が最大。"],
      en: ["In a heap (parent ≥ child), where is the maximum always?", ["the root", "the last cell", "the leftmost leaf", "anywhere"], "Every parent ≥ its children, so the top is the biggest."] }
  ]
},

{
  id: "hash", cat: "tansaku", jp: "ハッシュ探索（オープンアドレス法）", en: "Hash search (open addressing)", ordre: "O(1)",
  resume: { ja: "データからハッシュ関数（ここでは x mod 10）で格納位置を計算する。探すときも同じ計算で一発で位置がわかる。", en: "A hash function (here x mod 10) turns the data into its storage position. Searching uses the same calculation, so the position is known at once." },
  cle: { ja: "違うデータが同じ位置になる＝シノニム（衝突）。そのときは次の位置（+1）を順に調べる。", en: "Two values landing on the same position = a synonym (collision). Then try the next position (+1), and so on." },
  base: 0, tab: "T", ops: ["add", "find"], opsArg: { add: true, find: true }, opsExemple: "add 23, find 43",
  prog: [
    "大域: 整数型の配列: T    /* 要素数 10。空きは −1 */",
    "○kakunou(整数型: x)",
    "  整数型: I",
    "  I ← x mod 10        /* ハッシュ関数 */",
    "  while (T[I] ≠ −1)   /* 衝突：次の位置へ */",
    "    I ← (I + 1) mod 10",
    "  endwhile",
    "  T[I] ← x",
    "○整数型: tansaku(整数型: x)",
    "  整数型: I",
    "  I ← x mod 10",
    "  while ((T[I] ≠ −1) and (T[I] ≠ x))",
    "    I ← (I + 1) mod 10",
    "  endwhile",
    "  if (T[I] = x)",
    "    return I",
    "  else",
    "    return −1",
    "  endif"
  ],
  flow: [
    { titre: "格納", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "x 入力", l: [2, 3] },
      { t: "proc", txt: "I ← x % 10", l: 4 },
      { t: "boucle", nom: "空き探索", cond: "T[I] ≠ −1", l: 5, lFin: 7, corps: [{ t: "proc", txt: "I ← (I + 1) % 10", l: 6 }] },
      { t: "proc", txt: "T[I] ← x", l: 8 },
      { t: "term", txt: "終了" }
    ] },
    { titre: "探索", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "x 入力", l: [9, 10] },
      { t: "proc", txt: "I ← x % 10", l: 11 },
      { t: "boucle", nom: "探索処理", cond: "T[I] ≠ −1 かつ x ≠ T[I]", l: 12, lFin: 14, corps: [{ t: "proc", txt: "I ← (I + 1) % 10", l: 13 }] },
      { t: "si", cond: "x = T[I]", l: 15, oui: [{ t: "io", txt: "I 出力", l: 16 }], non: [{ t: "io", txt: "(−1) 出力", l: 18 }] },
      { t: "term", txt: "終了" }
    ] }
  ],
  donnees: { ops: [["add", 23], ["add", 41], ["add", 33], ["add", 58], ["add", 43], ["find", 43], ["find", 63]] },
  prepare: () => Array(10).fill(null),
  hasard() {
    const ops = [], base = 1 + Math.floor(Math.random() * 9), dans = [];
    for (let k = 0; k < 5; k++) { const x = (k % 2 ? 1 + Math.floor(Math.random() * 9) : base) + 10 * (1 + Math.floor(Math.random() * 8)); if (!dans.includes(x)) { dans.push(x); ops.push(["add", x]); } }
    ops.push(["find", dans[dans.length - 1]], ["find", base + 90]);
    return ops;
  },
  vars: ["x", "I"], pointeurs: { I: "var(--shu)" }, compteurs: ["cmp"],
  trace: L => [L("操作", "operation"), "x mod 10", L("調べた位置", "positions tried"), L("結果", "result")],
  ligne: (v, a, arr, o) => [o.op ?? "—", o.h ?? "—", o.essais ?? "—", o.res ?? "—"],
  run(T) {
    const v = T.v, L = T.L;
    T.step(1, L("空の表（10 個）。ハッシュ関数は x mod 10（1の位）。", "An empty table of 10 cells. The hash function is x mod 10 (the last digit)."));
    T.ops.forEach(([op, x]) => {
      v.x = x; v.I = undefined;
      const essais = [];
      if (op === "add") {
        T.step(2, L(`kakunou(${x})：${x} を格納する。`, `kakunou(${x}): store ${x}.`));
        if (!T.arr().includes(null)) { T.step(2, L("表がいっぱいなので、この例では格納しない。", "The table is full: this example skips."), { row: true, op: `add ${x}` }); return; }
        T.step(3, L("I を用意。", "I is created."));
        v.I = x % 10; essais.push(v.I);
        T.step(4, L(`I ← ${x} mod 10 = ${v.I}：ここに入れたい。`, `I ← ${x} mod 10 = ${v.I}: this is where it should go.`), { look: [v.I],
          q: { texte: L(`${x} mod 10 は？`, `${x} mod 10 = ?`), choix: T.choix(v.I, [Math.trunc(x / 10), (v.I + 1) % 10, x % 7]) } });
        while (true) {
          const pris = T.a(v.I) !== null;
          T.step(5, pris ? L(`T[${v.I}] = ${T.a(v.I)}：使用中！衝突（シノニム）。`, `T[${v.I}] = ${T.a(v.I)}: in use! A collision (synonym).`) : L(`T[${v.I}] は空き。`, `T[${v.I}] is free.`),
            { look: [v.I], q: { texte: L(`T[${v.I}] は空いている？`, `Is T[${v.I}] free?`), choix: [L("空き", "free"), L("使用中", "in use")], bon: pris ? L("使用中", "in use") : L("空き", "free") } });
          if (!pris) break;
          v.I = (v.I + 1) % 10; essais.push(v.I);
          T.step(6, L(`I ← (I + 1) mod 10 = ${v.I}：次の位置を調べる。`, `I ← (I + 1) mod 10 = ${v.I}: try the next position.`), { look: [v.I] });
        }
        T.set(v.I, x);
        T.step(8, L(`T[${v.I}] ← ${x}。`, `T[${v.I}] ← ${x}.`), { ecrit: [v.I], row: true, op: `add ${x}`, h: x % 10, essais: essais.join("→"), res: `T[${v.I}]` });
      } else {
        T.step(9, L(`tansaku(${x})：${x} を探す。`, `tansaku(${x}): look for ${x}.`));
        T.step(10, L("I を用意。", "I is created."));
        v.I = x % 10; essais.push(v.I);
        T.step(11, L(`I ← ${x} mod 10 = ${v.I}：まずここを見る。`, `I ← ${x} mod 10 = ${v.I}: look here first.`), { look: [v.I],
          q: { texte: L(`${x} mod 10 は？`, `${x} mod 10 = ?`), choix: T.choix(v.I, [Math.trunc(x / 10), (v.I + 1) % 10, x % 7]) } });
        let tours = 0;
        while (true) {
          const vide = T.a(v.I) === null, ne = !vide && T.a(v.I) !== x;
          if (!vide) T.c.cmp++;
          T.step(12, vide ? L(`T[${v.I}] は空き → ${x} はない。`, `T[${v.I}] is free → ${x} is not there.`) : L(`T[${v.I}] = ${T.a(v.I)} ${ne ? "≠" : "="} ${x} → ${ne ? "次へ" : "見つかった！"}`, `T[${v.I}] = ${T.a(v.I)} ${ne ? "≠" : "="} ${x} → ${ne ? "next" : "found!"}`),
            { cmp: vide ? [] : [v.I], q: { texte: L(`T[${v.I}] = ${vide ? "空き" : T.a(v.I)}、x = ${x}。探索は続く？`, `T[${v.I}] = ${vide ? "free" : T.a(v.I)}, x = ${x}. Keep searching?`), choix: [L("続く", "keep going"), L("終わる", "stop")], bon: ne ? L("続く", "keep going") : L("終わる", "stop") } });
          if (!ne || ++tours >= 10) break;
          v.I = (v.I + 1) % 10; essais.push(v.I);
          T.step(13, L(`I ← ${v.I}。`, `I ← ${v.I}.`), { look: [v.I] });
        }
        const ok = T.a(v.I) === x;
        T.step(15, L(`T[I] = x は${ok ? "真" : "偽"}。`, `T[I] = x is ${ok ? "true" : "false"}.`));
        T.step(ok ? 16 : 18, ok ? L(`return ${v.I}。比較 ${essais.length} 回。`, `return ${v.I}. ${essais.length} comparisons.`) : L("return −1：見つからなかった。", "return −1: not found."),
          { trouve: ok ? [v.I] : [], row: true, op: `find ${x}`, h: x % 10, essais: essais.join("→"), res: ok ? v.I : -1 });
      }
    });
    v.x = undefined; v.I = undefined;
    T.step(1, L("すべての操作が終わった。", "All operations done."), { fin: true });
  },
  blancs: [
    { ligne: 6, trou: "(I + 1) mod 10", choix: ["(I + 1) mod 10", "I + 1", "x mod 10", "(I − 1) mod 10"],
      expl: { ja: "次の位置へ。mod 10 で、T[9] の次は T[0] に戻る。", en: "Go to the next position. mod 10 makes T[9] wrap back to T[0]." } }
  ],
  qcm: [
    { ja: ["ハッシュ関数 x mod 10 で、23 と 43 の関係は？", ["シノニム（同じ位置）", "無関係", "23 が 43 の親", "整列されている"], "どちらも 1の位が 3 なので、同じ位置 3 になる。"],
      en: ["With the hash function x mod 10, what are 23 and 43?", ["synonyms (same position)", "unrelated", "23 is 43’s parent", "sorted"], "Both end in 3, so both map to position 3."] },
    { ja: ["衝突がなければ、ハッシュ探索の比較回数は？", ["1 回", "N 回", "log₂N 回", "N ÷ 2 回"], "計算した位置を一度見るだけ。"],
      en: ["Without collisions, how many comparisons does a hash search need?", ["1", "N", "log₂N", "N ÷ 2"], "Just one look at the computed position."] }
  ]
},

{
  id: "heapsort", cat: "seiretsu", jp: "ヒープソート", en: "Heap sort", ordre: "O(n log n)",
  resume: { ja: "① 配列をヒープ（親 ≥ 子）にする。② 根（最大値）を末尾と交換して確定し、残りをヒープに直す。これをくり返す。", en: "① Turn the array into a heap (parent ≥ child). ② Swap the root (the maximum) with the last cell to fix it, then repair the rest. Repeat." },
  cle: { ja: "ヒープの根はいつも最大値。だから「根を後ろへ → 直す」で大きい順に後ろから確定していく。", en: "The root of a heap is always the maximum, so “root to the back → repair” fixes values from the back, biggest first." },
  base: 0, tab: "T", visu: "arbre",
  arbre: { tab: "T", implicite: true, n: (v, t) => (v.phase === 2 ? v.N : v.phase === 1 ? (v.I ?? 0) + 1 : v.phase === 3 ? t.T.length : 1) }, memoire: ["T"],
  prog: [
    "○heapsort(整数型の配列: T)",
    "  整数型: N, I, K, P, work",
    "  for (I を 1 から Tの要素数 − 1 まで 1 ずつ増やす)    /* ① ヒープを作る */",
    "    K ← I",
    "    P ← (K − 1) ÷ 2 の商",
    "    while ((K > 0) and (T[P] < T[K]))",
    "      work ← T[K]",
    "      T[K] ← T[P]",
    "      T[P] ← work",
    "      K ← P",
    "      P ← (K − 1) ÷ 2 の商",
    "    endwhile",
    "  endfor",
    "  for (N を Tの要素数 − 1 から 1 まで 1 ずつ減らす)    /* ② 最大値を後ろへ */",
    "    work ← T[0]",
    "    T[0] ← T[N]",
    "    T[N] ← work",
    "    P ← 0",
    "    K ← 1",
    "    while (K < N)",
    "      if ((K + 1 < N) and (T[K + 1] > T[K]))",
    "        K ← K + 1",
    "      endif",
    "      if (T[P] < T[K])",
    "        work ← T[P]",
    "        T[P] ← T[K]",
    "        T[K] ← work",
    "        P ← K",
    "        K ← 2 × P + 1",
    "      else",
    "        K ← N",
    "      endif",
    "    endwhile",
    "  endfor"
  ],
  flow: [
    { titre: "① ヒープ作成", noeuds: [
      { t: "term", txt: "開始", l: [1, 2] },
      { t: "boucle", nom: "ヒープ作成", cond: "I:1, I < N, 1", l: 3, lFin: 13, corps: [
        { t: "proc", txt: "K ← I", l: 4 }, { t: "proc", txt: "P ← (K − 1) ÷ 2", l: 5 },
        { t: "boucle", nom: "上へ", cond: "K > 0 かつ T[P] < T[K]", l: 6, lFin: 12, corps: [
          { t: "proc", txt: "T[K] と T[P] を交換", l: [7, 8, 9] }, { t: "proc", txt: "K ← P", l: 10 }, { t: "proc", txt: "P ← (K − 1) ÷ 2", l: 11 }] }] },
      { t: "term", txt: "②へ" }
    ] },
    { titre: "② 整列", noeuds: [
      { t: "term", txt: "②" },
      { t: "boucle", nom: "整列処理", cond: "N:N − 1, N > 0, −1", l: 14, lFin: 34, corps: [
        { t: "proc", txt: "T[0] と T[N] を交換", l: [15, 16, 17] },
        { t: "proc", txt: "P ← 0, K ← 1", l: [18, 19] },
        { t: "boucle", nom: "下へ", cond: "K < N", l: 20, lFin: 33, corps: [
          { t: "si", cond: "K + 1 < N かつ T[K + 1] > T[K]", l: 21, oui: [{ t: "proc", txt: "K ← K + 1", l: 22 }], non: [] },
          { t: "si", cond: "T[P] < T[K]", l: 24, oui: [{ t: "proc", txt: "T[P] と T[K] を交換", l: [25, 26, 27] }, { t: "proc", txt: "P ← K, K ← 2 × P + 1", l: [28, 29] }], non: [{ t: "proc", txt: "K ← N", l: 31 }] }] }] },
      { t: "term", txt: "終了" }
    ] }
  ],
  donnees: { a: [35, 72, 18, 90, 51, 64] },
  prepare: d => ({ T: d.a.slice() }),
  vars: ["I", "N", "K", "P", "work"], pointeurs: { K: "var(--shu)", P: "var(--matcha)" }, compteurs: ["cmp", "swap"],
  trace: L => [L("段階", "phase"), "I / N", L("実行後の T", "T after")],
  ligne: (v, a, arr, o, L, t) => [v.phase === 1 ? L("① 作成", "① build") : v.phase === 2 ? L("② 整列", "② sort") : "—", v.phase === 1 ? v.I : v.phase === 2 ? v.N : "—", t.T.join("  ")],
  run(T) {
    const v = T.v, L = T.L, X = i => T.t("T", i), n = T.tab("T").length, quo = i => Math.max(0, Math.trunc((i - 1) / 2));
    const echange = (i, j, l, msg) => { const w = X(i); T.tset("T", i, X(j)); T.tset("T", j, w); T.c.swap++; T.step(l, msg, { ecrit: [i, j] }); };
    v.phase = 0;
    T.step(1, L(`T = {${T.tab("T").join(", ")}} を昇順に整列する。木の形で見ると T[0] が根、T[I] の子は T[2I + 1] と T[2I + 2]。`, `Sort T = {${T.tab("T").join(", ")}}. Seen as a tree, T[0] is the root and the children of T[I] are T[2I + 1] and T[2I + 2].`));
    T.step(2, L("N、I、K（子）、P（親）、work。", "N, I, K (child), P (parent), work."));
    v.phase = 1;
    for (v.I = 1; v.I < n; v.I++) {
      T.step(3, L(`I = ${v.I}：T[${v.I}] = ${X(v.I)} をヒープに加える。`, `I = ${v.I}: add T[${v.I}] = ${X(v.I)} to the heap.`), { look: [v.I] });
      v.K = v.I; T.step(4, L(`K ← ${v.K}。`, `K ← ${v.K}.`), { look: [v.K] });
      v.P = quo(v.K); T.step(5, L(`P ← (${v.K} − 1) ÷ 2 = ${v.P}：親。`, `P ← (${v.K} − 1) ÷ 2 = ${v.P}: the parent.`), { look: [v.P] });
      while (true) {
        const monte = v.K > 0 && X(v.P) < X(v.K);
        if (v.K > 0) T.c.cmp++;
        T.step(6, v.K === 0 ? L("K = 0：根に着いた。", "K = 0: reached the root.") : L(`親 ${X(v.P)} ${monte ? "<" : "≥"} 子 ${X(v.K)} → ${monte ? "交換" : "そのまま"}。`, `parent ${X(v.P)} ${monte ? "<" : "≥"} child ${X(v.K)} → ${monte ? "swap" : "leave"}.`),
          { cmp: v.K > 0 ? [v.P, v.K] : [], q: v.K > 0 ? { texte: L(`親 ${X(v.P)}、子 ${X(v.K)}。交換する？`, `Parent ${X(v.P)}, child ${X(v.K)}. Swap?`), choix: [L("交換する", "swap"), L("しない", "no")], bon: monte ? L("交換する", "swap") : L("しない", "no") } : undefined });
        if (!monte) break;
        v.work = X(v.K);
        echange(v.K, v.P, 9, L(`T[${v.K}] と T[${v.P}] を交換：${X(v.P)} が上へ。`, `Swap T[${v.K}] and T[${v.P}]: ${X(v.P)} moves up.`));
        v.K = v.P; T.step(10, L(`K ← P = ${v.K}。`, `K ← P = ${v.K}.`), { look: [v.K] });
        v.P = quo(v.K); T.step(11, L(`P ← ${v.P}。`, `P ← ${v.P}.`));
      }
    }
    T.step(13, L(`① 完了：ヒープができた。根 T[0] = ${X(0)} が最大値。`, `① done: the heap is built. The root T[0] = ${X(0)} is the maximum.`), { look: [0], row: true });
    v.phase = 2; v.I = undefined;
    for (v.N = n - 1; v.N >= 1; v.N--) {
      T.step(14, L(`N = ${v.N}：根（最大値 ${X(0)}）を T[${v.N}] へ。`, `N = ${v.N}: the root (maximum ${X(0)}) goes to T[${v.N}].`), { look: [0, v.N],
        q: { texte: L(`T[${v.N}] に確定する値は？`, `Which value gets fixed in T[${v.N}]?`), choix: T.choix(X(0), T.tab("T")) } });
      v.work = X(0);
      echange(0, v.N, 17, L(`T[0] と T[${v.N}] を交換。${X(v.N)} が確定 ★`, `Swap T[0] and T[${v.N}]. ${X(v.N)} is final ★`));
      T.fixer(v.N);
      v.P = 0; v.K = 1;
      T.step(19, L("P ← 0、K ← 1：根から下へ直す。", "P ← 0, K ← 1: repair from the root down."), { look: [0] });
      while (true) {
        const cont = v.K < v.N;
        T.step(20, cont ? L(`K = ${v.K} < N = ${v.N} → 子がいる。`, `K = ${v.K} < N = ${v.N} → there is a child.`) : L("子がいない → 直し終わり。", "No child → repair done."));
        if (!cont) break;
        const droite = v.K + 1 < v.N && X(v.K + 1) > X(v.K);
        if (v.K + 1 < v.N) T.c.cmp++;
        T.step(21, v.K + 1 < v.N ? L(`左 ${X(v.K)}、右 ${X(v.K + 1)} → 大きいのは${droite ? "右" : "左"}。`, `left ${X(v.K)}, right ${X(v.K + 1)} → bigger: ${droite ? "right" : "left"}.`) : L("右の子はいない。", "No right child."), { cmp: v.K + 1 < v.N ? [v.K, v.K + 1] : [v.K] });
        if (droite) { v.K++; T.step(22, L(`K ← ${v.K}。`, `K ← ${v.K}.`), { look: [v.K] }); }
        const desc = X(v.P) < X(v.K); T.c.cmp++;
        T.step(24, L(`親 ${X(v.P)} ${desc ? "<" : "≥"} 子 ${X(v.K)} → ${desc ? "交換して下へ" : "ヒープに戻った"}。`, `parent ${X(v.P)} ${desc ? "<" : "≥"} child ${X(v.K)} → ${desc ? "swap and go down" : "the heap is fine again"}.`),
          { cmp: [v.P, v.K], q: { texte: L(`親 ${X(v.P)}、子 ${X(v.K)}。交換する？`, `Parent ${X(v.P)}, child ${X(v.K)}. Swap?`), choix: [L("交換する", "swap"), L("しない", "no")], bon: desc ? L("交換する", "swap") : L("しない", "no") } });
        if (desc) {
          v.work = X(v.P);
          echange(v.P, v.K, 27, L(`T[${v.P}] と T[${v.K}] を交換。`, `Swap T[${v.P}] and T[${v.K}].`));
          v.P = v.K; v.K = 2 * v.P + 1;
          T.step(29, L(`P ← ${v.P}、K ← ${v.K}。`, `P ← ${v.P}, K ← ${v.K}.`), { look: [v.P] });
        } else { v.K = v.N; T.step(31, L("K ← N：ループを終える。", "K ← N: leave the loop.")); }
      }
      T.step(33, L("ヒープに戻った。", "Back to a heap."), { row: true });
    }
    T.fixer(0); v.phase = 3; v.N = undefined; v.K = undefined; v.P = undefined;
    T.step(34, L(`完了！T = {${T.tab("T").join(", ")}}。`, `Done! T = {${T.tab("T").join(", ")}}.`), { fin: true });
  },
  blancs: [
    { ligne: 17, trou: "T[N] ← work", choix: ["T[N] ← work", "T[0] ← work", "T[N] ← T[0]", "work ← T[N]"],
      expl: { ja: "work には元の根（最大値）が入っている。それを後ろ T[N] に置いて確定する。", en: "work holds the old root (the maximum): put it at the back, T[N], where it is final." } }
  ],
  qcm: [
    { ja: ["ヒープソートの計算量は？", ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], "根から下へ直すのは木の高さ log n。それを n 回。"],
      en: ["What does heap sort cost?", ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], "Repairing from the root costs the tree height, log n, done n times."] }
  ]
},

{
  id: "shaker", cat: "seiretsu", jp: "シェーカーソート", en: "Shaker sort", ordre: "O(n²)",
  resume: { ja: "交換法の改良。右へ進むときは最大値を右端へ、左へ戻るときは最小値を左端へ。往復しながら両端から確定させる。", en: "An improved bubble sort. Going right pushes the maximum to the right end; coming back pushes the minimum to the left end. Both ends get fixed as it shakes back and forth." },
  cle: { ja: "L と R の間だけが未整列。右向きの後 R ← R − 1、左向きの後 L ← L + 1。", en: "Only the part between L and R is unsorted. After going right, R ← R − 1; after going left, L ← L + 1." },
  base: 0, tab: "T",
  prog: [
    "○shaker(整数型の配列: T)",
    "  整数型: L, R, I, work",
    "  L ← 0",
    "  R ← Tの要素数 − 1",
    "  while (L < R)",
    "    for (I を L から R − 1 まで 1 ずつ増やす)    /* 右へ */",
    "      if (T[I] > T[I + 1])",
    "        work ← T[I]",
    "        T[I] ← T[I + 1]",
    "        T[I + 1] ← work",
    "      endif",
    "    endfor",
    "    R ← R − 1",
    "    for (I を R から L + 1 まで 1 ずつ減らす)    /* 左へ */",
    "      if (T[I − 1] > T[I])",
    "        work ← T[I]",
    "        T[I] ← T[I − 1]",
    "        T[I − 1] ← work",
    "      endif",
    "    endfor",
    "    L ← L + 1",
    "  endwhile"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始", l: [1, 2] },
    { t: "proc", txt: "L ← 0", l: 3 },
    { t: "proc", txt: "R ← N − 1", l: 4 },
    { t: "boucle", nom: "整列ループ", cond: "L < R", l: 5, lFin: 22, corps: [
      { t: "boucle", nom: "右方向", cond: "I:L, I < R, 1", l: 6, lFin: 12, corps: [
        { t: "si", cond: "T[I] > T[I + 1]", l: 7, oui: [{ t: "proc", txt: "T[I] と T[I + 1] を交換", l: [8, 9, 10] }], non: [] }] },
      { t: "proc", txt: "R ← R − 1", l: 13 },
      { t: "boucle", nom: "左方向", cond: "I:R, I > L, −1", l: 14, lFin: 20, corps: [
        { t: "si", cond: "T[I − 1] > T[I]", l: 15, oui: [{ t: "proc", txt: "T[I] と T[I − 1] を交換", l: [16, 17, 18] }], non: [] }] },
      { t: "proc", txt: "L ← L + 1", l: 21 }] },
    { t: "term", txt: "終了" }
  ] }],
  donnees: { a: [5, 1, 4, 2, 8, 0, 3] },
  vars: ["L", "R", "I", "work"], pointeurs: { L: "var(--matcha)", R: "var(--ai)", I: "var(--shu)" }, compteurs: ["cmp", "swap"],
  actif: (v, i) => v.L === undefined || v.R === undefined || (i >= v.L && i <= v.R),
  trace: L => [L("向き", "direction"), "L", "R", L("実行後の T", "T after")],
  ligne: (v, a, arr, o, L) => [o.sens ?? "—", v.L ?? "—", v.R ?? "—", arr.join("  ")],
  run(T) {
    const v = T.v, L = T.L;
    const echange = (i, j, l) => { v.work = T.a(i); T.set(i, T.a(j)); T.set(j, v.work); T.c.swap++; T.step(l, L(`T[${i}] と T[${j}] を交換。`, `Swap T[${i}] and T[${j}].`), { ecrit: [i, j] }); };
    T.step(1, L(`T = {${T.liste()}} を昇順に整列する。`, `Sort T = {${T.liste()}} in ascending order.`));
    v.L = undefined; v.R = undefined; v.I = undefined; v.work = undefined;
    T.step(2, L("L（未整列の左端）、R（右端）、I、work。", "L (left end of the unsorted part), R (right end), I, work."));
    v.L = 0; T.step(3, L("L ← 0。", "L ← 0."));
    v.R = T.n - 1; T.step(4, L(`R ← ${v.R}。`, `R ← ${v.R}.`));
    while (true) {
      const cont = v.L < v.R;
      T.step(5, cont ? L(`L = ${v.L} < R = ${v.R} → まだ未整列の部分がある。`, `L = ${v.L} < R = ${v.R} → an unsorted part remains.`) : L("L ≥ R → 完了。", "L ≥ R → done."), { fin: !cont });
      if (!cont) { for (let k = 0; k < T.n; k++) T.fixer(k); break; }
      for (v.I = v.L; v.I < v.R; v.I++) {
        T.step(6, L(`右へ：I = ${v.I}。`, `Going right: I = ${v.I}.`), { look: [v.I, v.I + 1] });
        const ok = T.a(v.I) > T.a(v.I + 1); T.c.cmp++;
        T.step(7, L(`T[${v.I}] = ${T.a(v.I)} ${ok ? ">" : "≤"} T[${v.I + 1}] = ${T.a(v.I + 1)}。`, `T[${v.I}] = ${T.a(v.I)} ${ok ? ">" : "≤"} T[${v.I + 1}] = ${T.a(v.I + 1)}.`),
          { cmp: [v.I, v.I + 1], q: { texte: L(`${T.a(v.I)} と ${T.a(v.I + 1)}。交換する？`, `${T.a(v.I)} and ${T.a(v.I + 1)}. Swap?`), choix: [L("交換する", "swap"), L("しない", "no")], bon: ok ? L("交換する", "swap") : L("しない", "no") } });
        if (ok) echange(v.I, v.I + 1, 10);
      }
      T.fixer(v.R);
      v.R--; T.step(13, L(`右端 T[${v.R + 1}] が確定 ★ R ← ${v.R}。`, `The right end T[${v.R + 1}] is final ★ R ← ${v.R}.`), { row: true, sens: L("→ 右へ", "→ right") });
      for (v.I = v.R; v.I > v.L; v.I--) {
        T.step(14, L(`左へ：I = ${v.I}。`, `Going left: I = ${v.I}.`), { look: [v.I - 1, v.I] });
        const ok = T.a(v.I - 1) > T.a(v.I); T.c.cmp++;
        T.step(15, L(`T[${v.I - 1}] = ${T.a(v.I - 1)} ${ok ? ">" : "≤"} T[${v.I}] = ${T.a(v.I)}。`, `T[${v.I - 1}] = ${T.a(v.I - 1)} ${ok ? ">" : "≤"} T[${v.I}] = ${T.a(v.I)}.`),
          { cmp: [v.I - 1, v.I], q: { texte: L(`${T.a(v.I - 1)} と ${T.a(v.I)}。交換する？`, `${T.a(v.I - 1)} and ${T.a(v.I)}. Swap?`), choix: [L("交換する", "swap"), L("しない", "no")], bon: ok ? L("交換する", "swap") : L("しない", "no") } });
        if (ok) echange(v.I, v.I - 1, 18);
      }
      T.fixer(v.L);
      v.L++; T.step(21, L(`左端 T[${v.L - 1}] が確定 ★ L ← ${v.L}。`, `The left end T[${v.L - 1}] is final ★ L ← ${v.L}.`), { row: true, sens: L("← 左へ", "← left") });
    }
  },
  blancs: [
    { ligne: 13, trou: "R ← R − 1", choix: ["R ← R − 1", "R ← R + 1", "L ← L + 1", "R ← L"],
      expl: { ja: "右へ進むと最大値が右端に来て確定。だから右端を1つ縮める。", en: "Going right brings the maximum to the right end, where it is final: shrink the right end by one." } }
  ],
  qcm: [
    { ja: ["シェーカーソートで、左へ戻る走査で左端に集まるのは？", ["最小値", "最大値", "中央値", "番兵"], "左向きに比べて交換すると、小さい値が左へ運ばれる。"],
      en: ["In shaker sort, what does the leftward pass carry to the left end?", ["the minimum", "the maximum", "the median", "a sentinel"], "Comparing and swapping leftward carries small values to the left."] }
  ]
},

{
  id: "shell", cat: "seiretsu", jp: "シェルソート", en: "Shell sort", ordre: "O(n^1.25) 程度",
  resume: { ja: "間隔 gap だけ離れた要素どうしで挿入法を行い、gap を半分ずつ小さくしていく。最後は gap = 1（ふつうの挿入法）。", en: "Run insertion sort on elements gap apart, then halve gap. The last pass, gap = 1, is a plain insertion sort." },
  cle: { ja: "離れた要素を先に大きく動かしておくので、最後の挿入法ではほとんど動かさずにすむ。", en: "Far-apart elements are moved first, so the final insertion pass has almost nothing left to do." },
  base: 0, tab: "T",
  prog: [
    "○shell(整数型の配列: T)",
    "  整数型: gap, I, J, work",
    "  gap ← Tの要素数 ÷ 2 の商",
    "  while (gap > 0)",
    "    for (I を gap から Tの要素数 − 1 まで 1 ずつ増やす)",
    "      J ← I",
    "      while ((J ≥ gap) and (T[J − gap] > T[J]))",
    "        work ← T[J]",
    "        T[J] ← T[J − gap]",
    "        T[J − gap] ← work",
    "        J ← J − gap",
    "      endwhile",
    "    endfor",
    "    gap ← gap ÷ 2 の商",
    "  endwhile"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "開始", l: [1, 2] },
    { t: "proc", txt: "gap ← N ÷ 2", l: 3 },
    { t: "boucle", nom: "整列ループ", cond: "gap > 0", l: 4, lFin: 15, corps: [
      { t: "boucle", nom: "整列処理", cond: "I:gap, I < N, 1", l: 5, lFin: 13, corps: [
        { t: "proc", txt: "J ← I", l: 6 },
        { t: "boucle", nom: "挿入処理", cond: "J ≥ gap かつ T[J − gap] > T[J]", l: 7, lFin: 12, corps: [
          { t: "proc", txt: "T[J] と T[J − gap] を交換", l: [8, 9, 10] }, { t: "proc", txt: "J ← J − gap", l: 11 }] }] },
      { t: "proc", txt: "gap ← gap ÷ 2", l: 14 }] },
    { t: "term", txt: "終了" }
  ] }],
  donnees: { a: [62, 83, 18, 53, 7, 17, 95, 86] },
  vars: ["gap", "I", "J", "work"], pointeurs: { I: "var(--matcha)", J: "var(--shu)" }, compteurs: ["cmp", "swap"],
  trace: L => ["gap", L("実行後の T", "T after")],
  ligne: (v, a, arr) => [v.gap ?? "—", arr.join("  ")],
  run(T) {
    const v = T.v, L = T.L;
    T.step(1, L(`T = {${T.liste()}} を昇順に整列する。`, `Sort T = {${T.liste()}} in ascending order.`));
    v.gap = undefined; v.I = undefined; v.J = undefined; v.work = undefined;
    T.step(2, L("gap（間隔）、I、J、work。", "gap (the distance), I, J, work."));
    v.gap = Math.trunc(T.n / 2);
    T.step(3, L(`gap ← ${T.n} ÷ 2 = ${v.gap}：${v.gap} つ離れた要素どうしを比べる。`, `gap ← ${T.n} ÷ 2 = ${v.gap}: compare elements ${v.gap} apart.`));
    while (true) {
      const cont = v.gap > 0;
      T.step(4, cont ? L(`gap = ${v.gap} > 0 → 続ける。`, `gap = ${v.gap} > 0 → go on.`) : L("gap = 0 → 完了。", "gap = 0 → done."), { fin: !cont });
      if (!cont) { for (let k = 0; k < T.n; k++) T.fixer(k); break; }
      for (v.I = v.gap; v.I < T.n; v.I++) {
        T.step(5, L(`I = ${v.I}：T[${v.I}] を、gap = ${v.gap} 間隔のグループの中で挿入する。`, `I = ${v.I}: insert T[${v.I}] inside its group of elements ${v.gap} apart.`), { look: [v.I] });
        v.J = v.I; T.step(6, L(`J ← ${v.J}。`, `J ← ${v.J}.`), { look: [v.J] });
        while (true) {
          const pos = v.J >= v.gap, ok = pos && T.a(v.J - v.gap) > T.a(v.J);
          if (pos) T.c.cmp++;
          T.step(7, !pos ? L(`J = ${v.J} < gap → グループの先頭に着いた。`, `J = ${v.J} < gap → reached the start of the group.`) : L(`T[${v.J - v.gap}] = ${T.a(v.J - v.gap)} ${ok ? ">" : "≤"} T[${v.J}] = ${T.a(v.J)} → ${ok ? "交換" : "そのまま"}。`, `T[${v.J - v.gap}] = ${T.a(v.J - v.gap)} ${ok ? ">" : "≤"} T[${v.J}] = ${T.a(v.J)} → ${ok ? "swap" : "leave"}.`),
            { cmp: pos ? [v.J - v.gap, v.J] : [], q: pos ? { texte: L(`${T.a(v.J - v.gap)} と ${T.a(v.J)}（${v.gap} 離れている）。交換する？`, `${T.a(v.J - v.gap)} and ${T.a(v.J)} (${v.gap} apart). Swap?`), choix: [L("交換する", "swap"), L("しない", "no")], bon: ok ? L("交換する", "swap") : L("しない", "no") } : undefined });
          if (!ok) break;
          v.work = T.a(v.J); T.set(v.J, T.a(v.J - v.gap)); T.set(v.J - v.gap, v.work); T.c.swap++;
          T.step(10, L(`T[${v.J}] と T[${v.J - v.gap}] を交換：${v.work} が ${v.gap} つ左へ跳んだ。`, `Swap T[${v.J}] and T[${v.J - v.gap}]: ${v.work} jumped ${v.gap} cells left.`), { ecrit: [v.J, v.J - v.gap] });
          v.J -= v.gap; T.step(11, L(`J ← J − gap = ${v.J}。`, `J ← J − gap = ${v.J}.`), { look: [v.J] });
        }
      }
      T.step(13, L(`gap = ${v.gap} の整列が終わった。`, `The gap = ${v.gap} pass is done.`), { row: true });
      v.gap = Math.trunc(v.gap / 2);
      T.step(14, L(`gap ← gap ÷ 2 = ${v.gap}。`, `gap ← gap ÷ 2 = ${v.gap}.`), { q: { texte: L("次の gap は？", "What is the next gap?"), choix: T.choix(v.gap, [v.gap * 2, v.gap + 1, 0]) } });
    }
  },
  blancs: [
    { ligne: 7, trou: "T[J − gap] > T[J]", choix: ["T[J − gap] > T[J]", "T[J − 1] > T[J]", "T[J] > T[J + gap]", "J > gap"],
      expl: { ja: "比べるのは gap だけ離れた要素。gap = 1 のときだけ、ふつうの挿入法と同じになる。", en: "Compare elements gap apart. Only when gap = 1 is it the plain insertion sort." } }
  ],
  qcm: [
    { ja: ["シェルソートの最後の段階（gap = 1）は何と同じ？", ["基本挿入法", "基本選択法", "基本交換法", "ヒープソート"], "間隔 1 で挿入法をすれば、ふつうの挿入法。"],
      en: ["The last pass of shell sort (gap = 1) is the same as…?", ["insertion sort", "selection sort", "bubble sort", "heap sort"], "Insertion with a distance of 1 is plain insertion sort."] }
  ]
},

{
  id: "chain", cat: "tansaku", jp: "ハッシュ探索（チェーン法）", en: "Hash search (chaining)", ordre: "O(1)",
  resume: { ja: "ハッシュ値（x mod 5）ごとにリストを持つ。シノニムは同じ位置のリストにつないでいくので、表があふれない。", en: "Each hash value (x mod 5) owns a linked list. Synonyms are chained in the same list, so the table never overflows." },
  cle: { ja: "格納：ノード領域に入れて、そのリストの先頭につなぐ。探索：H[K] からリストをたどる（線形探索と同じ）。", en: "Store: put it in the node area and link it at the head of its list. Find: walk the list from H[K] (a linear search)." },
  base: 0, tab: "H, D, P", visu: "hachage", ops: ["add", "find"], opsArg: { add: true, find: true }, opsExemple: "add 12, find 7",
  prog: [
    "大域: 整数型の配列: H      /* 要素数 5：各リストの先頭ノード（なければ −1） */",
    "大域: 整数型の配列: D, P   /* ノード領域：データと次のノード */",
    "大域: 整数型: N ← 0        /* 使用中のノード数 */",
    "○kakunou(整数型: x)",
    "  整数型: K",
    "  K ← x mod 5             /* ハッシュ関数 */",
    "  D[N] ← x",
    "  P[N] ← H[K]             /* 今の先頭の前につなぐ */",
    "  H[K] ← N",
    "  N ← N + 1",
    "○整数型: tansaku(整数型: x)",
    "  整数型: K, I",
    "  K ← x mod 5",
    "  I ← H[K]",
    "  while ((I ≠ −1) and (D[I] ≠ x))",
    "    I ← P[I]",
    "  endwhile",
    "  return I"
  ],
  flow: [
    { titre: "格納", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "x 入力", l: [4, 5] },
      { t: "proc", txt: "K ← x % 5", l: 6 },
      { t: "proc", txt: "D[N] ← x", l: 7 },
      { t: "proc", txt: "P[N] ← H[K]", l: 8 },
      { t: "proc", txt: "H[K] ← N", l: 9 },
      { t: "proc", txt: "N ← N + 1", l: 10 },
      { t: "term", txt: "終了" }
    ] },
    { titre: "探索", noeuds: [
      { t: "term", txt: "開始" },
      { t: "io", txt: "x 入力", l: [11, 12] },
      { t: "proc", txt: "K ← x % 5", l: 13 },
      { t: "proc", txt: "I ← H[K]", l: 14 },
      { t: "boucle", nom: "探索処理", cond: "I ≠ −1 かつ x ≠ D[I]", l: 15, lFin: 17, corps: [{ t: "proc", txt: "I ← P[I]", l: 16 }] },
      { t: "io", txt: "I 出力", l: 18 },
      { t: "term", txt: "終了" }
    ] }
  ],
  donnees: { ops: [["add", 12], ["add", 7], ["add", 22], ["add", 9], ["add", 17], ["find", 7], ["find", 27]] },
  prepare: () => ({ H: [-1, -1, -1, -1, -1], D: Array(8).fill(null), P: Array(8).fill(null) }),
  hasard() {
    const ops = [], dans = []; const k = Math.floor(Math.random() * 5);
    for (let n = 0; n < 6; n++) { let x; do { x = (n % 2 ? Math.floor(Math.random() * 5) : k) + 5 * (1 + Math.floor(Math.random() * 18)); } while (dans.includes(x) || x > 99); dans.push(x); ops.push(["add", x]); }
    ops.push(["find", dans[1]], ["find", k + 95 > 99 ? k + 90 : k + 95]);
    return ops;
  },
  vars: ["x", "K", "I", "N"], pointeurs: { I: "var(--shu)" }, compteurs: ["cmp"],
  trace: L => [L("操作", "operation"), "K", L("たどったノード", "nodes walked"), L("結果", "result")],
  ligne: (v, a, arr, o) => [o.op ?? "—", v.K ?? "—", o.essais ?? "—", o.res ?? "—"],
  run(T) {
    const v = T.v, L = T.L, H = k => T.t("H", k), D = i => T.t("D", i), P = i => T.t("P", i);
    v.N = 0;
    T.step(3, L("空の表：H[0]〜H[4] はすべて −1（リストが空）。ハッシュ関数は x mod 5。", "An empty table: H[0]…H[4] are all −1 (empty lists). The hash function is x mod 5."));
    T.ops.forEach(([op, x]) => {
      v.x = x; v.K = undefined; v.I = undefined;
      if (op === "add") {
        T.step(4, L(`kakunou(${x})：${x} を格納する。`, `kakunou(${x}): store ${x}.`));
        if (v.N >= 8) { T.step(4, L("ノード領域がいっぱいなので、この例では格納しない。", "The node area is full: this example skips."), { row: true, op: `add ${x}` }); return; }
        T.step(5, L("K を用意。", "K is created."));
        v.K = x % 5;
        T.step(6, L(`K ← ${x} mod 5 = ${v.K}：${v.K} 番のリストに入れる。`, `K ← ${x} mod 5 = ${v.K}: it goes into list ${v.K}.`), { q: { texte: L(`${x} mod 5 は？`, `${x} mod 5 = ?`), choix: T.choix(v.K, [x % 10, Math.trunc(x / 5), (v.K + 1) % 5]) } });
        T.tset("D", v.N, x);
        T.step(7, L(`D[${v.N}] ← ${x}：ノード領域の ${v.N} 番に入れる。`, `D[${v.N}] ← ${x}: store it in node ${v.N}.`), { ecrit: [v.N] });
        const avant = H(v.K);
        T.tset("P", v.N, avant);
        T.step(8, L(`P[${v.N}] ← H[${v.K}] = ${avant}：${avant === -1 ? "リストは空だったので、次はない（−1）" : `新しいノードの次は、今の先頭（ノード ${avant}）`}。`, `P[${v.N}] ← H[${v.K}] = ${avant}: ${avant === -1 ? "the list was empty, so no next (−1)" : `the new node points to the current head (node ${avant})`}.`), { ecrit: [v.N],
          q: { texte: L(`P[${v.N}] に入る値は？`, `What goes into P[${v.N}]?`), choix: T.choix(avant, [v.N, -1, v.K]) } });
        T.tset("H", v.K, v.N);
        T.step(9, L(`H[${v.K}] ← ${v.N}：新しいノードがリストの先頭になった。${avant === -1 ? "" : "シノニムがつながっている！"}`, `H[${v.K}] ← ${v.N}: the new node is now the head of the list.${avant === -1 ? "" : " Synonyms are chained!"}`));
        v.N++;
        T.step(10, L(`N ← N + 1 = ${v.N}。`, `N ← N + 1 = ${v.N}.`), { row: true, op: `add ${x}`, res: `H[${v.K}]` });
      } else {
        T.step(11, L(`tansaku(${x})：${x} を探す。`, `tansaku(${x}): look for ${x}.`));
        T.step(12, L("K と I を用意。", "K and I are created."));
        v.K = x % 5;
        T.step(13, L(`K ← ${x} mod 5 = ${v.K}：${v.K} 番のリストだけ見ればよい。`, `K ← ${x} mod 5 = ${v.K}: only list ${v.K} needs to be checked.`), { q: { texte: L(`${x} mod 5 は？`, `${x} mod 5 = ?`), choix: T.choix(v.K, [x % 10, Math.trunc(x / 5), (v.K + 1) % 5]) } });
        v.I = H(v.K);
        const essais = [];
        T.step(14, L(`I ← H[${v.K}] = ${v.I}：リストの先頭から。`, `I ← H[${v.K}] = ${v.I}: from the head of the list.`), { look: v.I === -1 ? [] : [v.I] });
        while (true) {
          const fin = v.I === -1, ne = !fin && D(v.I) !== x;
          if (!fin) { T.c.cmp++; essais.push(D(v.I)); }
          T.step(15, fin ? L("I = −1：リストの終わり → 見つからない。", "I = −1: end of the list → not found.") : L(`D[${v.I}] = ${D(v.I)} ${ne ? "≠" : "="} ${x} → ${ne ? "次のノードへ" : "見つかった！"}`, `D[${v.I}] = ${D(v.I)} ${ne ? "≠" : "="} ${x} → ${ne ? "next node" : "found!"}`),
            { cmp: fin ? [] : [v.I], q: { texte: fin ? L("I = −1。探索は続く？", "I = −1. Keep searching?") : L(`D[I] = ${D(v.I)}、x = ${x}。探索は続く？`, `D[I] = ${D(v.I)}, x = ${x}. Keep searching?`), choix: [L("続く", "keep going"), L("終わる", "stop")], bon: ne ? L("続く", "keep going") : L("終わる", "stop") } });
          if (!ne) break;
          v.I = P(v.I);
          T.step(16, L(`I ← P[I] = ${v.I}。`, `I ← P[I] = ${v.I}.`), { look: v.I === -1 ? [] : [v.I] });
        }
        T.step(18, v.I === -1 ? L("return −1：見つからなかった。", "return −1: not found.") : L(`return ${v.I}：${x} はノード ${v.I}。`, `return ${v.I}: ${x} is node ${v.I}.`),
          { trouve: v.I === -1 ? [] : [v.I], row: true, op: `find ${x}`, essais: essais.join("→") || "（空）", res: v.I });
      }
    });
    v.x = undefined; v.K = undefined; v.I = undefined;
    T.step(3, L("すべての操作が終わった。", "All operations done."), { fin: true });
  },
  blancs: [
    { ligne: 8, trou: "P[N] ← H[K]", choix: ["P[N] ← H[K]", "P[N] ← −1", "H[K] ← P[N]", "P[N] ← K"],
      expl: { ja: "先頭に追加するので、新しいノードの次は「今までの先頭」。−1 にすると、前からあったノードが切れてしまう。", en: "We add at the head, so the new node points to the old head. With −1, the nodes already in the list would be lost." } }
  ],
  qcm: [
    { ja: ["チェーン法の特徴は？", ["シノニムをリストでつなぐので、表があふれない", "衝突したら次の位置を探す", "必ず比較1回で見つかる", "整列が必要"], "「次の位置を探す」のはオープンアドレス法。"],
      en: ["What characterises chaining?", ["synonyms are chained in lists, so the table never overflows", "on a collision, try the next position", "always found in one comparison", "sorting is required"], "“Try the next position” is open addressing."] }
  ]
},

{
  id: "quick", cat: "seiretsu", jp: "クイックソート", en: "Quicksort", ordre: "O(n log n)",
  resume: { ja: "基準値（ピボット）を決め、それより小さい値を左、大きい値を右に分ける。左右それぞれを、同じ方法で再帰的に整列する。", en: "Pick a pivot, move smaller values to its left and bigger ones to its right, then sort each side the same way, recursively." },
  cle: { ja: "1回の分割で基準値の位置が確定（★）。平均 O(n log n) で速いが、すでに整列済みだと O(n²) になることがある。", en: "Each split fixes the pivot’s position (★). O(n log n) on average, but can fall to O(n²) on already sorted data." },
  base: 0, tab: "T",
  prog: [
    "○quick(整数型の配列: T, 整数型: L, 整数型: R)    /* 最初は quick(T, 0, Tの要素数 − 1) */",
    "  整数型: P, I, J, work",
    "  if (L < R)",
    "    P ← T[R]                  /* 基準値：右端 */",
    "    I ← L                     /* P より小さい値を置く位置 */",
    "    for (J を L から R − 1 まで 1 ずつ増やす)",
    "      if (T[J] < P)",
    "        work ← T[I]",
    "        T[I] ← T[J]",
    "        T[J] ← work",
    "        I ← I + 1",
    "      endif",
    "    endfor",
    "    work ← T[I]",
    "    T[I] ← T[R]",
    "    T[R] ← work               /* 基準値が T[I] で確定 */",
    "    quick(T, L, I − 1)",
    "    quick(T, I + 1, R)",
    "  endif"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "quick(L, R)", l: [1, 2] },
    { t: "si", cond: "L < R", l: 3, oui: [
      { t: "proc", txt: "P ← T[R]", l: 4 },
      { t: "proc", txt: "I ← L", l: 5 },
      { t: "boucle", nom: "分割", cond: "J:L, J < R, 1", l: 6, lFin: 13, corps: [
        { t: "si", cond: "T[J] < P", l: 7, oui: [{ t: "proc", txt: "T[I] と T[J] を交換", l: [8, 9, 10] }, { t: "proc", txt: "I ← I + 1", l: 11 }], non: [] }] },
      { t: "proc", txt: "T[I] と T[R] を交換", l: [14, 15, 16] },
      { t: "appel", txt: "quick(L, I − 1)", l: 17 },
      { t: "appel", txt: "quick(I + 1, R)", l: 18 }
    ], non: [] },
    { t: "term", txt: "出口", l: 19 }
  ] }],
  donnees: { a: [38, 81, 22, 50, 14, 67] },
  vars: ["L", "R", "P", "I", "J", "呼出し"], pointeurs: { L: "var(--matcha)", R: "var(--ai)", I: "var(--kin)", J: "var(--shu)" }, compteurs: ["cmp", "swap"],
  actif: (v, i) => v.L === undefined || (i >= v.L && i <= v.R),
  trace: L => [L("呼出し", "call"), L("基準値", "pivot"), L("確定位置", "fixed at"), L("実行後の T", "T after")],
  ligne: (v, a, arr) => [v.L !== undefined ? `(${v.L}, ${v.R})` : "—", v.P ?? "—", v.I ?? "—", arr.join("  ")],
  run(T) {
    const v = T.v, L = T.L, pile = [];
    const montrer = (l, r, p, i) => { v.L = l; v.R = r; v.P = p; v.I = i; v.J = undefined; v["呼出し"] = pile.map(([a, b]) => `(${a},${b})`).join(" → "); };
    const tri = (l, r) => {
      pile.push([l, r]); montrer(l, r, undefined, undefined);
      T.step(1, L(`quick(T, ${l}, ${r}) が呼ばれた：T[${l}]〜T[${r}] を整列する。`, `quick(T, ${l}, ${r}) is called: sort T[${l}]…T[${r}].`));
      const ok = l < r;
      T.step(3, ok ? L(`L = ${l} < R = ${r}：要素が2つ以上 → 分割する。`, `L = ${l} < R = ${r}: two or more elements → split.`) : L(`L = ${l} ≥ R = ${r}：要素が1つ以下 → 何もしない。`, `L = ${l} ≥ R = ${r}: one element or none → nothing to do.`),
        { q: { texte: L(`quick(T, ${l}, ${r})。分割する？`, `quick(T, ${l}, ${r}). Split?`), choix: [L("分割する", "split"), L("何もしない", "nothing")], bon: ok ? L("分割する", "split") : L("何もしない", "nothing") } });
      if (ok) {
        v.P = T.a(r); T.step(4, L(`P ← T[${r}] = ${v.P}：右端を基準値にする。`, `P ← T[${r}] = ${v.P}: the right end is the pivot.`), { look: [r] });
        v.I = l; T.step(5, L(`I ← ${l}：P より小さい値は T[${l}] から順に置いていく。`, `I ← ${l}: values smaller than P go to T[${l}], T[${l + 1}]…`), { look: [l] });
        for (v.J = l; v.J < r; v.J++) {
          T.step(6, L(`J = ${v.J}。`, `J = ${v.J}.`), { look: [v.J] });
          const pt = T.a(v.J) < v.P; T.c.cmp++;
          T.step(7, L(`T[${v.J}] = ${T.a(v.J)} ${pt ? "<" : "≥"} P = ${v.P} → ${pt ? "左側へ集める" : "そのまま"}。`, `T[${v.J}] = ${T.a(v.J)} ${pt ? "<" : "≥"} P = ${v.P} → ${pt ? "gather it on the left" : "leave it"}.`),
            { cmp: [v.J, r], q: { texte: L(`T[J] = ${T.a(v.J)}、P = ${v.P}。T[J] < P は？`, `T[J] = ${T.a(v.J)}, P = ${v.P}. Is T[J] < P?`), choix: [L("真", "true"), L("偽", "false")], bon: pt ? L("真", "true") : L("偽", "false") } });
          if (pt) {
            v.work = T.a(v.I); T.set(v.I, T.a(v.J)); T.set(v.J, v.work); T.c.swap++;
            T.step(10, v.I === v.J ? L(`T[${v.I}] と T[${v.J}]（同じ位置）を交換。`, `Swap T[${v.I}] with T[${v.J}] (the same cell).`) : L(`T[${v.I}] と T[${v.J}] を交換：${T.a(v.I)} を左側へ。`, `Swap T[${v.I}] and T[${v.J}]: ${T.a(v.I)} moves to the left part.`), { ecrit: [v.I, v.J] });
            v.I++; T.step(11, L(`I ← ${v.I}。`, `I ← ${v.I}.`), { look: [v.I] });
          }
        }
        T.step(6, L("J が R に着いた：分割の比較が終わった。", "J reached R: the split comparisons are done."));
        v.work = T.a(v.I); T.set(v.I, T.a(r)); T.set(r, v.work); T.c.swap++; T.fixer(v.I);
        T.step(16, L(`T[${v.I}] と T[${r}] を交換：基準値 ${v.P} が T[${v.I}] で確定 ★ 左はすべて小さく、右はすべて大きい。`, `Swap T[${v.I}] and T[${r}]: the pivot ${v.P} is final in T[${v.I}] ★ Everything left is smaller, everything right is bigger.`),
          { ecrit: [v.I, r], row: true, q: { texte: L(`基準値 ${v.P} が確定する位置は？`, `Where does the pivot ${v.P} end up?`), choix: T.choix(v.I, [l, r, v.I + 1]) } });
        const p = v.P, i = v.I;
        T.step(17, L(`quick(T, ${l}, ${i - 1})：左側を整列する。`, `quick(T, ${l}, ${i - 1}): sort the left part.`));
        tri(l, i - 1); montrer(l, r, p, i);
        T.step(17, L(`quick(T, ${l}, ${r}) に戻ってきた。`, `Back in quick(T, ${l}, ${r}).`));
        T.step(18, L(`quick(T, ${i + 1}, ${r})：右側を整列する。`, `quick(T, ${i + 1}, ${r}): sort the right part.`));
        tri(i + 1, r); montrer(l, r, p, i);
        T.step(18, L(`quick(T, ${l}, ${r}) に戻ってきた。`, `Back in quick(T, ${l}, ${r}).`));
      } else if (l === r) T.fixer(l);
      T.step(19, L(`quick(T, ${l}, ${r}) が終わる。`, `quick(T, ${l}, ${r}) ends.`), { fin: pile.length === 1 });
      pile.pop();
    };
    tri(0, T.n - 1);
  },
  blancs: [
    { ligne: 7, trou: "T[J] < P", choix: ["T[J] < P", "T[J] > P", "T[I] < T[J]", "J < I"],
      expl: { ja: "基準値より小さい値を左側（T[L]〜T[I − 1]）に集める。", en: "Values smaller than the pivot are gathered on the left (T[L]…T[I − 1])." } },
    { ligne: 17, trou: "quick(T, L, I − 1)", choix: ["quick(T, L, I − 1)", "quick(T, L, I)", "quick(T, 0, R)", "quick(T, I, R)"],
      expl: { ja: "T[I] は確定済みなので、その左 L〜I − 1 だけを整列する。I まで含めると無限に呼び続けることがある。", en: "T[I] is final, so only L…I − 1 is sorted next. Including I could recurse forever." } }
  ],
  qcm: [
    { ja: ["クイックソートの平均計算量は？", ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], "毎回ほぼ半分に分かれれば、深さ log n、各段で n。"],
      en: ["What is quicksort’s average cost?", ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], "If each split halves the range: depth log n, n work per level."] },
    { ja: ["右端を基準値にするとき、最も遅くなるデータは？", ["すでに整列済み", "ランダム", "すべて違う値", "要素が偶数個"], "毎回いちばん大きい値が基準値になり、片側に1つも分かれない → O(n²)。"],
      en: ["With the right end as pivot, which data is slowest?", ["already sorted", "random", "all distinct", "even count"], "The pivot is always the biggest, so nothing splits off → O(n²)."] }
  ]
},

{
  id: "merge", cat: "seiretsu", jp: "マージソート", en: "Merge sort", ordre: "O(n log n)",
  resume: { ja: "配列を半分に分け、それぞれを再帰的に整列してから、2つの整列済みの列を小さい順に併合（マージ）する。", en: "Split the array in half, sort each half recursively, then merge the two sorted halves, smallest first." },
  cle: { ja: "併合：左の先頭 T[I] と右の先頭 T[J] を比べ、小さいほうを作業用配列 W へ。最後に W を T に書き戻す。", en: "Merging: compare the heads T[I] (left) and T[J] (right), move the smaller to the work array W, then copy W back into T." },
  base: 0, tab: "T",
  prog: [
    "○merge(整数型の配列: T, 整数型: L, 整数型: R)    /* 最初は merge(T, 0, Tの要素数 − 1) */",
    "  整数型: M, I, J, K",
    "  整数型の配列: W                /* 作業用 */",
    "  if (L < R)",
    "    M ← (L + R) ÷ 2 の商",
    "    merge(T, L, M)",
    "    merge(T, M + 1, R)",
    "    I ← L",
    "    J ← M + 1",
    "    K ← 0",
    "    while ((I ≤ M) and (J ≤ R))",
    "      if (T[I] ≤ T[J])",
    "        W[K] ← T[I]",
    "        I ← I + 1",
    "      else",
    "        W[K] ← T[J]",
    "        J ← J + 1",
    "      endif",
    "      K ← K + 1",
    "    endwhile",
    "    while (I ≤ M)                /* 左の残り */",
    "      W[K] ← T[I]",
    "      I ← I + 1",
    "      K ← K + 1",
    "    endwhile",
    "    while (J ≤ R)                /* 右の残り */",
    "      W[K] ← T[J]",
    "      J ← J + 1",
    "      K ← K + 1",
    "    endwhile",
    "    for (K を 0 から R − L まで 1 ずつ増やす)",
    "      T[L + K] ← W[K]",
    "    endfor",
    "  endif"
  ],
  flow: [{ noeuds: [
    { t: "term", txt: "merge(L, R)", l: [1, 2, 3] },
    { t: "si", cond: "L < R", l: 4, oui: [
      { t: "proc", txt: "M ← (L + R) ÷ 2", l: 5 },
      { t: "appel", txt: "merge(L, M)", l: 6 },
      { t: "appel", txt: "merge(M + 1, R)", l: 7 },
      { t: "proc", txt: "I ← L, J ← M + 1, K ← 0", l: [8, 9, 10] },
      { t: "boucle", nom: "併合", cond: "I ≤ M かつ J ≤ R", l: 11, lFin: 20, corps: [
        { t: "si", cond: "T[I] ≤ T[J]", l: 12, oui: [{ t: "proc", txt: "W[K] ← T[I], I ← I + 1", l: [13, 14] }], non: [{ t: "proc", txt: "W[K] ← T[J], J ← J + 1", l: [16, 17] }] },
        { t: "proc", txt: "K ← K + 1", l: 19 }] },
      { t: "boucle", nom: "左の残り", cond: "I ≤ M", l: 21, lFin: 25, corps: [{ t: "proc", txt: "W[K] ← T[I], I・K を +1", l: [22, 23, 24] }] },
      { t: "boucle", nom: "右の残り", cond: "J ≤ R", l: 26, lFin: 30, corps: [{ t: "proc", txt: "W[K] ← T[J], J・K を +1", l: [27, 28, 29] }] },
      { t: "boucle", nom: "書き戻し", cond: "K:0, K ≤ R − L, 1", l: 31, lFin: 33, corps: [{ t: "proc", txt: "T[L + K] ← W[K]", l: 32 }] }
    ], non: [] },
    { t: "term", txt: "出口", l: 34 }
  ] }],
  donnees: { a: [38, 81, 22, 50, 14, 67] },
  vars: ["L", "R", "M", "I", "J", "W", "呼出し"], pointeurs: { I: "var(--matcha)", J: "var(--shu)" }, compteurs: ["cmp", "aff"],
  actif: (v, i) => v.L === undefined || (i >= v.L && i <= v.R),
  trace: L => [L("呼出し", "call"), "M", "W", L("実行後の T", "T after")],
  ligne: (v, a, arr) => [v.L !== undefined ? `(${v.L}, ${v.R})` : "—", v.M ?? "—", v.W || "—", arr.join("  ")],
  run(T) {
    const v = T.v, L = T.L, pile = [];
    const montrer = (l, r, m) => { v.L = l; v.R = r; v.M = m; v.I = undefined; v.J = undefined; v.W = ""; v["呼出し"] = pile.map(([a, b]) => `(${a},${b})`).join(" → "); };
    const tri = (l, r) => {
      pile.push([l, r]); montrer(l, r, undefined);
      T.step(1, L(`merge(T, ${l}, ${r}) が呼ばれた：T[${l}]〜T[${r}] を整列する。`, `merge(T, ${l}, ${r}) is called: sort T[${l}]…T[${r}].`));
      const ok = l < r;
      T.step(4, ok ? L("要素が2つ以上 → 半分に分ける。", "Two or more elements → split in half.") : L("要素が1つ → もう整列済み。", "One element → already sorted."));
      if (ok) {
        const m = Math.trunc((l + r) / 2); v.M = m;
        T.step(5, L(`M ← (${l} + ${r}) ÷ 2 = ${m}：左 T[${l}]〜T[${m}]、右 T[${m + 1}]〜T[${r}]。`, `M ← (${l} + ${r}) ÷ 2 = ${m}: left T[${l}]…T[${m}], right T[${m + 1}]…T[${r}].`),
          { q: { texte: L(`(${l} + ${r}) ÷ 2 の商は？`, `Quotient of (${l} + ${r}) ÷ 2?`), choix: T.choix(m, [m + 1, l + r, r]) } });
        T.step(6, L(`merge(T, ${l}, ${m})：左半分を整列する。`, `merge(T, ${l}, ${m}): sort the left half.`));
        tri(l, m); montrer(l, r, m);
        T.step(6, L(`merge(T, ${l}, ${r}) に戻ってきた：左半分 {${T.arr().slice(l, m + 1).join(", ")}} は整列済み。`, `Back in merge(T, ${l}, ${r}): the left half {${T.arr().slice(l, m + 1).join(", ")}} is sorted.`));
        T.step(7, L(`merge(T, ${m + 1}, ${r})：右半分を整列する。`, `merge(T, ${m + 1}, ${r}): sort the right half.`));
        tri(m + 1, r); montrer(l, r, m);
        T.step(7, L(`戻ってきた：右半分 {${T.arr().slice(m + 1, r + 1).join(", ")}} も整列済み。次は併合。`, `Back: the right half {${T.arr().slice(m + 1, r + 1).join(", ")}} is sorted too. Now merge.`));
        const W = [];
        v.I = l; v.J = m + 1;
        T.step(10, L(`I ← ${l}（左の先頭）、J ← ${m + 1}（右の先頭）、K ← 0。`, `I ← ${l} (head of the left), J ← ${m + 1} (head of the right), K ← 0.`), { look: [l, m + 1] });
        while (true) {
          const cont = v.I <= m && v.J <= r;
          T.step(11, cont ? L("左も右もまだ残っている。", "Both halves still have values.") : L(`${v.I > m ? "左" : "右"}が空になった → 併合ループ終了。`, `The ${v.I > m ? "left" : "right"} half is used up → leave the merge loop.`));
          if (!cont) break;
          const g = T.a(v.I) <= T.a(v.J); T.c.cmp++;
          T.step(12, L(`T[${v.I}] = ${T.a(v.I)} と T[${v.J}] = ${T.a(v.J)} → 小さいのは${g ? "左" : "右"}。`, `T[${v.I}] = ${T.a(v.I)} and T[${v.J}] = ${T.a(v.J)} → the smaller is on the ${g ? "left" : "right"}.`),
            { cmp: [v.I, v.J], q: { texte: L(`${T.a(v.I)} と ${T.a(v.J)}。W に入るのは？`, `${T.a(v.I)} and ${T.a(v.J)}. Which goes into W?`), choix: T.choix(Math.min(T.a(v.I), T.a(v.J)), [Math.max(T.a(v.I), T.a(v.J))]) } });
          if (g) { W.push(T.a(v.I)); v.W = W.join(" "); v.I++; T.c.aff++; T.step(14, L(`W ← ${W[W.length - 1]}、I ← ${v.I}。`, `W ← ${W[W.length - 1]}, I ← ${v.I}.`)); }
          else { W.push(T.a(v.J)); v.W = W.join(" "); v.J++; T.c.aff++; T.step(17, L(`W ← ${W[W.length - 1]}、J ← ${v.J}。`, `W ← ${W[W.length - 1]}, J ← ${v.J}.`)); }
          T.step(19, L(`K ← ${W.length}。`, `K ← ${W.length}.`));
        }
        while (v.I <= m) { W.push(T.a(v.I)); v.W = W.join(" "); v.I++; T.c.aff++; T.step(24, L(`左の残り ${W[W.length - 1]} を W へ。`, `Left leftover ${W[W.length - 1]} goes to W.`)); }
        while (v.J <= r) { W.push(T.a(v.J)); v.W = W.join(" "); v.J++; T.c.aff++; T.step(29, L(`右の残り ${W[W.length - 1]} を W へ。`, `Right leftover ${W[W.length - 1]} goes to W.`)); }
        v.I = undefined; v.J = undefined;
        for (let k = 0; k <= r - l; k++) { T.set(l + k, W[k]); }
        T.step(32, L(`W = {${W.join(", ")}} を T[${l}]〜T[${r}] に書き戻した。`, `W = {${W.join(", ")}} is copied back into T[${l}]…T[${r}].`), { ecrit: Array.from({ length: r - l + 1 }, (_, k) => l + k), row: true });
      }
      if (pile.length === 1) for (let k = 0; k < T.n; k++) T.fixer(k);
      T.step(34, L(`merge(T, ${l}, ${r}) が終わる。`, `merge(T, ${l}, ${r}) ends.`), { fin: pile.length === 1 });
      pile.pop();
    };
    tri(0, T.n - 1);
  },
  blancs: [
    { ligne: 12, trou: "T[I] ≤ T[J]", choix: ["T[I] ≤ T[J]", "T[I] ≥ T[J]", "I ≤ J", "T[I] = T[J]"],
      expl: { ja: "左右の先頭のうち小さいほうを先に W へ。≤ にすると、同じ値のとき左が先になり、順序が保たれる（安定）。", en: "The smaller head goes to W first. With ≤, equal values keep their order (the sort is stable)." } }
  ],
  qcm: [
    { ja: ["マージソートの計算量は？", ["いつも O(n log n)", "平均 O(n log n)、最悪 O(n²)", "O(n²)", "O(n)"], "分け方がいつも半分なので、データの並びに関係なく O(n log n)。"],
      en: ["What does merge sort cost?", ["always O(n log n)", "O(n log n) average, O(n²) worst", "O(n²)", "O(n)"], "It always splits in half, whatever the data: O(n log n)."] },
    { ja: ["マージソートの欠点は？", ["作業用の配列が必要", "最悪 O(n²)", "整列済みに弱い", "再帰が使えない"], "併合のために、元と同じ大きさの作業領域 W を使う。"],
      en: ["What is merge sort’s drawback?", ["it needs a work array", "O(n²) worst case", "slow on sorted data", "cannot use recursion"], "Merging needs a work area W as big as the data."] }
  ]
}


];
})();
