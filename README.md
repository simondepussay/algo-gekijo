# アルゴ劇場

Comprendre les algorithmes du **基本情報技術者試験** (科目B) en les regardant avancer, une étape à la fois.

**En ligne : https://algo.simondepussay.com**

Tout est visible sur un seul écran : le programme en 擬似言語 avec la ligne en cours, les variables dans des boîtes, le tableau en barres, le トレース表 qui se remplit et le nombre d’opérations. C’est l’utilisateur qui avance, d’une étape à la fois.

- **見る** : regarder le programme tourner, avec une explication à chaque ligne.
- **予想する** : deviner ce qui va se passer avant chaque ligne importante.
- **練習** : 空欄 (compléter le code) et questions, à côté du programme.
- Interface en **日本語** ou en **English**.

Trois algorithmes pour commencer : 最大値, バブルソート, 二分探索.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | la page |
| `algo.css` | le style |
| `algos.js` | les algorithmes : programme, données, déroulé ligne par ligne, exercices |
| `moteur.js` | enregistre chaque étape et dessine l’étape courante |
| `fete.js` | confettis et personnages d’encouragement |

Ajouter un algorithme = ajouter une entrée dans `algos.js`.

Site statique, sans dépendance : il suffit d’ouvrir `index.html` ou de le servir avec n’importe quel serveur.

Les exemples sont écrits pour ce site. Les personnages sont des dessins SVG originaux.
