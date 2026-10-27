# アルゴ劇場

Comprendre les algorithmes du **基本情報技術者試験** (科目B) en les regardant avancer, une étape à la fois.

**En ligne : https://algo.simondepussay.com**

Tout est visible sur un seul écran : le programme en 擬似言語 avec la ligne en cours, les variables dans des boîtes, le tableau en barres, le トレース表 qui se remplit et le nombre d’opérations. C’est l’utilisateur qui avance, d’une étape à la fois.

- **見る** : regarder le programme tourner, avec une explication à chaque ligne.
- **予想する** : deviner ce qui va se passer avant chaque ligne importante.
- **練習** : 空欄 (compléter le code) et questions, à côté du programme.
- Interface en **日本語** ou en **English**.

Deux présentations du même programme, avec **les mêmes numéros de ligne** :
**擬似言語** et **流れ図** (organigramme JIS, comme dans les manuels : tableau `T[0]…T[N−1]`, variables en majuscules).

| Catégorie | Algorithmes |
|---|---|
| 探索 | 最大値, 線形探索, 線形探索（番兵法）, 2分探索 |
| 整列 | 基本選択法, 基本交換法（バブルソート）, 基本挿入法 |
| データ構造 | スタック, キュー（循環）, リスト（追加・削除） |
| 木 | 幅優先探索, 深さ優先探索（先行・中間・後行順）, 2分探索木（探索・追加） |

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | la page |
| `algo.css` | le style |
| `algos.js` | les algorithmes : programme, données, déroulé ligne par ligne, exercices |
| `moteur.js` | enregistre chaque étape et dessine l’étape courante |
| `flow.js` | dessin des 流れ図 (symboles JIS) |
| `visus.js` | dessins de la liste chaînée et des arbres |
| `fete.js` | confettis et personnages d’encouragement |

Ajouter un algorithme = ajouter une entrée dans `algos.js`.

Site statique, sans dépendance, hébergé sur Azure Static Web Apps (offre Free) : chaque push sur `main` le redéploie. En local, il suffit d’ouvrir `index.html`.

Les exemples sont écrits pour ce site. Les personnages sont des dessins SVG originaux.
