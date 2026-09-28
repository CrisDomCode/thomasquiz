# Quiz Masterclass Nadège Lefort — Documentation projet

## Vue d'ensemble

Quiz de qualification en 4 étapes, conçu pour filtrer les leads avant une inscription à la masterclass gratuite "Réveille ton Désir et Active ton Plaisir". Chaque réponse est immédiatement enregistrée et fait avancer le quiz sans bouton "Suivant".

---

## Stack technique

- HTML / CSS / JS vanilla (aucun framework)
- Police : Raleway (Google Fonts)
- Pas de dépendances externes

---

## Structure des fichiers

```
index.html   — Structure HTML, questions, résultats, bio Nadège
style.css    — Tout le style (responsive inclus)
quiz.js      — Logique du quiz, personnalisation, transitions
img/         — Photo de Nadège
```

---

## Les 4 questions

Chaque option a une valeur interne : `positive`, `medium` ou `negative`.

| Étape | Question | negative | medium | positive |
|-------|----------|----------|--------|----------|
| Q1 | Comment vis-tu ton intimité aujourd'hui ? | C'est devenu une corvée | Ça s'est éteint petit à petit | Je suis complètement épanouie |
| Q2 | Est-ce que ça t'arrive de faire semblant... ? | Plus souvent que je voudrais l'admettre | Parfois, oui | Non, jamais |
| Q3 | Est-ce que la sexualité a déjà été un problème dans ton couple ? | Oui, ça crée des tensions | On n'en parle pas, mais ça pèse | Non, on est sur la même longueur d'onde |
| Q4 | Et si tu pouvais comprendre ce qui s'est éteint... | Je ne sais plus si c'est possible | Pourquoi pas, si c'est sans jugement | Oui, j'en ai vraiment besoin |

---

## Logique de branchement

```
Q1 → Q2 → Q3
              ↓
   Q1 + Q2 + Q3 toutes positives ?
              ├── OUI → Résultat "déjà épanouie" (result-happy)
              └── NON → Q4 → Résultat inscription (result-signup)
```

La vérification se fait à la fin de Q3. Si les 3 premières réponses sont toutes `positive`, on court-circuite Q4 et on affiche directement le message "tu n'en as pas besoin".

---

## Résultat 1 — Déjà épanouie (`result-happy`)

Affiché uniquement si Q1 + Q2 + Q3 sont toutes `positive`.

Message : félicite la personne pour sa connexion à son intimité, lui suggère de partager le lien avec une amie qui en aurait besoin. Bouton "Partager le lien" (Web Share API avec fallback copie dans le presse-papiers).

---

## Résultat 2 — Inscription (`result-signup`)

Affiché dans tous les autres cas, après Q4.

Contient dans l'ordre :
1. Icône ✓ verte
2. "Cette masterclass est **faite pour toi !**"
3. **Message personnalisé** (voir ci-dessous)
4. Infos événement : date + titre de la masterclass + "Réservé aux femmes"
5. Deux témoignages (Cathy, Élodie)
6. Formulaire d'inscription

---

## Personnalisation du message (`buildPersonalizedText`)

Le message est composé de 4 fragments assemblés selon les réponses. Il est injecté dans `#result-personalized` avant d'afficher l'étape résultat.

### Fragment 1 — Ouverture (basé sur Q1)
- `negative` → "Tu le sais, même si tu n'oses pas toujours le dire : l'intimité est devenue quelque chose que tu subis plus que tu ne choisis."
- `medium` → "Ce désir qui s'est éteint petit à petit, sans qu'on sache vraiment quand, ni pourquoi..."

### Fragment 2 — Approfondissement (basé sur Q2, avec conscience de Q1)

Q1 = negative :
- Q2 `negative` → "Te forcer, faire semblant, ne pas vraiment être là : ce n'est pas une fatalité, c'est un signal que ton corps t'envoie."
- Q2 `medium` → "Ces moments où tu n'es pas tout à fait présente, où tu te forces un peu..."
- Q2 `positive` → "Et même si tu ne te forces pas à proprement parler, le simple fait que ça pèse change tout à la qualité de la présence."

Q1 = medium :
- Q2 `negative` → "Et si tu te retrouves à te forcer, à faire semblant... c'est ton corps qui te dit que quelque chose ne va pas."
- Q2 `medium` → "Ces moments où tu n'es pas tout à fait là, où tu te forces un peu..."
- Q2 `positive` → "Et pourtant, même sans te forcer vraiment, tu sens que quelque chose manque. C'est souvent plus difficile à mettre en mots... mais tout aussi réel."

### Fragment 3 — Couple (basé sur Q3)
- `negative` → "Et quand ça crée en plus des tensions ou des silences dans le couple, le poids devient encore plus lourd à porter seule."
- `medium` → "Et ce non-dit dans le couple, cette chose qui pèse sans être nommée, ça aussi, on va pouvoir le mettre en lumière."
- `positive` → "Ce n'est pas une question de couple... c'est une question de toi, de ton rapport à ton propre désir et à ton corps."

### Fragment 4 — Fermeture (basé sur Q4)
- `negative` → "Si tu ne sais plus si c'est possible, c'est souvent parce que personne ne t'a encore montré le bon chemin. C'est exactement ce que cette masterclass va changer."
- `medium` → "Sans jugement, sans pression, à ton rythme : c'est exactement mon approche. Cette Masterclass peut tout changer."
- `positive` → "Tu sais que tu en as le besoin ou l'envie, et c'est déjà un grand pas. En 90 minutes, tu vas comprendre ce qui s'est éteint... et comment le rallumer."

---

## Formulaire d'inscription

Champs : prénom (requis), email (requis), téléphone (facultatif — pour recevoir un SMS de rappel le jour J).

À la soumission (`handleSubmit`) : le contenu de `#quiz-card` est remplacé par un message de confirmation ("Tu es inscrite !"). Aucun appel API n'est branché pour l'instant — à connecter à l'outil d'emailing de Nadège.

---

## Transitions entre étapes

- Fade-out rapide (0.4s) de l'étape courante via la classe `.fading-out`
- Fade-in lent (0.9s) de la nouvelle étape via la classe `.active`
- Le scroll remonte en haut à chaque changement d'étape
- Le header (H1 + sous-titre) se masque automatiquement sur les écrans résultat

---

## Responsive

Breakpoint à 640px : padding réduit sur `.quiz-card`, `.quiz-header`, `.bio-card`.

---

## Pièges techniques à ne pas reproduire

- **Écoute sur `change`, pas sur `click`** — les labels cliquables avec `input[type="radio"]` cachés posaient un bug de sélection si on écoutait le `click` sur le label (l'état coché n'était pas fiable). On écoute le `change` sur le radio directement.
- **Pas de `translateY` dans les transitions** — ajouté puis retiré : le mouvement vertical rendait le passage entre étapes trop brusque. La transition est une pure opacité (fade-out 0.4s + fade-in 0.9s).

---

## Typographie française

Toujours respecter :
- `&nbsp;` avant `?`, `!`, `:`, `;`
- Guillemets français : `«&nbsp;…&nbsp;»` (avec espaces insécables à l'intérieur)
- Apostrophe typographique `'` plutôt que `'`

---

## Point contre-intuitif — valeurs de Q4

La valeur `positive` sur Q4 correspond à **"Oui, j'en ai vraiment besoin"**, pas à une réponse de satisfaction. La logique `positive/medium/negative` reflète l'engagement envers la masterclass, pas le bien-être de la personne. Ne pas confondre avec Q1/Q2/Q3 où `positive` = tout va bien.

---

## Intégration en attente

`handleSubmit` dans `quiz.js` remplace le DOM par un message de confirmation mais **ne poste aucune donnée**. À brancher sur l'outil email/CRM de Nadège Lefort (champs disponibles : `prenom`, `email`, `tel`).
