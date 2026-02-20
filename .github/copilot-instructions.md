# Social Boulder – Copilot Instructions

> **⚠️ RÈGLE IMPÉRATIVE** : Ce fichier doit être maintenu à jour en permanence.
> Toute modification de stack, configuration, schema, ou convention **doit être reflétée ici immédiatement**.
> C'est la source de vérité unique du projet.

## Code conventions

### Fichiers & nommage

- **Composants** : `PascalCase.tsx` — ex: `BoulderCard.tsx`
- **Hooks** : `use-kebab-case.ts` — ex: `use-ddp-connection.ts`
- **Utilitaires / helpers** : `kebab-case.ts` — ex: `format-grade.ts`
- **Stories** : `ComponentName.stories.tsx` colocalisées avec le composant ou dans `components/design-system/`
- **Types** : dans `types/` pour les types globaux, colocalisés sinon

### Composants

- Tout élément graphique un peu complexe doit être extrait dans son propre composant
- **Tout composant doit être accompagné de sa story Storybook** (`ComponentName.stories.tsx` colocalisée)
- Si un composant est modifié, sa story doit être mise à jour en conséquence
- Toujours des **fonctions nommées** (`function BoulderCard()`, pas de `const BoulderCard = () =>`)
- **Export default** en bas de fichier
- Props typées avec une `interface` nommée : `interface BoulderCardProps { ... }`
- Pas de `StyleSheet.create` — on utilise uniquement **NativeWind** (`className`)
- Pour les styles conditionnels : utiliser `cn()` depuis `@/lib/utils`

### TypeScript

- **Strict mode** activé — pas de `any`, pas de `!` non-null assertion sauf cas exceptionnel commenté
- Préférer `type` pour les unions/intersections, `interface` pour les formes d'objets
- Toujours typer les retours des fonctions utilitaires

### Styling

- Classes **NativeWind** en priorité (`className="..."`)
- Ordre des classes Tailwind géré automatiquement par **prettier-plugin-tailwindcss**
- Utiliser les tokens sémantiques (`bg-background`, `text-foreground`, `border-border`) plutôt que les couleurs brutes quand c'est du UI générique
- Utiliser les couleurs brutes (`bg-primary-500`) pour les éléments spécifiques à la charte

### DDP / données

- Toute la logique DDP dans `lib/ddp/` (hooks + client)
- Jamais d'appel DDP direct dans les composants — passer par des hooks (`use-boulders.ts`, etc.)
- Les credentials viennent exclusivement de `process.env.EXPO_PUBLIC_*`

### Langue

- Tout est en **anglais** : code, commentaires, noms de variables, messages d'erreur, doc
- Les textes affichés à l'utilisateur passent **toujours** par i18n (voir section i18n)

### Commentaires

- Commenter le **pourquoi**, jamais le **quoi** — le code dit ce qu'il fait, le commentaire explique pourquoi
- Toujours en **anglais**
- `// TODO:` pour les choses à faire, `// FIXME:` pour les bugs connus, `// HACK:` pour les contournements — toujours avec une explication
- **JSDoc** pour les hooks et fonctions utilitaires publics :
  ```ts
  /**
   * Returns the human-readable color name for a boulder label.
   * Label 0 means the boulder has no color assigned yet.
   */
  function getLabelColor(label: number, gym: Gym): string { ... }
  ```
- Pas de commentaires évidents (`// increment counter`, `// return value`) — les supprimer

### Structure des dossiers

- `app/` — routes Expo Router uniquement, pas de logique métier
- `components/` — composants réutilisables, un fichier par composant
- `components/ui/` — composants RNR (copiés via CLI, ne pas modifier manuellement)
- `components/design-system/` — stories et composants de charte
- `lib/` — logique partagée (DDP, utils, theme)
- `types/` — types globaux partagés entre plusieurs fichiers
- `hooks/` — hooks React custom

### Git

- Commits en **anglais**, préfixés d'un **gitmoji** (https://gitmoji.dev)
  - ex: `✨ Add boulder list screen`, `🐛 Fix DDP reconnection on background`, `♻️ Refactor grade formatting`
- Pas de commit de fichiers générés (`.expo/`, `storybook.requires.ts`)

### NativeWind + @gorhom/portal

`@gorhom/bottom-sheet` (et d'autres libs utilisant `@gorhom/portal`) créent un arbre React séparé, ce qui casse le `VariableContext` de `react-native-css-interop`. Les tokens NativeWind (`var(--foreground)` etc.) ne se résolvent pas dans ce contexte.

**Fix** : envelopper le contenu de la sheet avec `<View style={isDark ? THEME_VARS.dark : THEME_VARS.light}>` où `THEME_VARS` est construit avec `vars()` de nativewind qui réinjecte les CSS variables. Voir `components/UserListSheet.tsx` comme référence.

**Background color** : utiliser `backgroundStyle={{ backgroundColor: hex }}` sur `<BottomSheetModal>` (composant par défaut) — ne pas utiliser `backgroundComponent` custom (perd le border radius). Les hex doivent être en dur (hsl() n'est pas valide en inline style RN).

Build a custom UI for **Social Boulder** (`sboulder.com`) by connecting directly to their backend via the **DDP protocol** (Meteor.js). There is no REST API — all communication uses WebSocket DDP.

## DDP connection

- **WebSocket URL**: `wss://www.sboulder.com/sockjs/websocket`
- **Required header**: `Origin: https://www.sboulder.com`
- **Auth**: token dans `.env` → `EXPO_PUBLIC_DDP_TOKEN` / `EXPO_PUBLIC_DDP_USER_ID` (ne jamais committer `.env`)

```js
// Connection sequence
send({ msg: 'connect', version: '1', support: ['1'] });
// On 'connected':
send({ msg: 'method', method: 'login', params: [{ resume: TOKEN }], id: '1' });
```

## DDP subscriptions

| Name                  | Params                            | Collections populated                |
| --------------------- | --------------------------------- | ------------------------------------ |
| `_boulders.list`      | `[selector, sort, limit, cursor]` | `boulders`                           |
| `_boulders.count`     | `[selector]`                      | `counters-collection`                |
| `_boulders.comments`  | `[boulderId: String]`             | `comments`                           |
| `access-points`       | `gymId: String`                   | `access_control` only (NOT boulders) |
| `_gyms.info`          | `gymId: String`                   | `gyms`                               |
| `_gyms.list`          | `selector: Object`                | `gyms`                               |
| `users.single`        | `userId: String`                  | `users`                              |
| `users.notifications` | `limit: Number`                   | `notifications`                      |

### Fetching boulders

```js
// Active boulders — isClosed MUST be null (not false) to get open boulders
send({
  msg: 'sub',
  id: '1',
  name: '_boulders.list',
  params: [
    { gym: 'wattabloc', isClosed: null },
    { isClosed: 1, createdAt: -1, boulderNum: -1, label: -1, holdsColor: -1 },
    200, // limit — 200 returns all 127 wattabloc boulders in one shot
    null, // cursor (_id of last boulder for pagination, null = start)
  ],
});

// Count
send({
  msg: 'sub',
  id: '2',
  name: '_boulders.count',
  params: [{ gym: 'wattabloc', isClosed: null }],
});
// → collection "counters-collection": { count: 127 }
```

See `exploration/ddp-fetch-boulders.js` for a ready-to-run script.

## Gym IDs

Known gyms for the current user: `wattabloc`, `wattabloc/pans`, `wattabloc/spraywall`, `wattabloc/pan`, `isatix`, `auperchoir`, `arkose`, `arkose/massy`, `sb`

## DDP methods

```js
// Log a send (normal)
send({
  msg: 'method',
  method: '_boulders.send',
  params: [boulderId, false, userId, false, false, false, null],
  id: '1',
});

// Log a flash (first try)
send({
  msg: 'method',
  method: '_boulders.send',
  params: [boulderId, true, userId, false, false, false, null],
  id: '1',
});
```

Signature: `(boulderId: String, isFlash: Boolean, userId: String, isCoach: Boolean, isStandalone: Boolean, isZone: Boolean, videoContestId: String|null)`

Other methods: `_boulders.dislike(boulderId)`, `_users.markAllNotificationsAsRead()`, `_generateCSVData(gymId, '')`

### Boulder action methods (confirmed from web app)

```js
// Log a send
send({ msg:'method', method:'_boulders.send',
  params:[boulderId, true, userId, false, false, false, false] })

// Log a flash
send({ msg:'method', method:'_boulders.flash',
  params:[boulderId, userId, false, false] })

// Remove a send/flash
send({ msg:'method', method:'_boulders.notSend',
  params:[boulderId, true, userId, false] })

// Toggle like
send({ msg:'method', method:'_boulders.like',
  params:[boulderId, userId, false, false] })

// Unlike
send({ msg:'method', method:'_boulders.notLike',
  params:[boulderId, userId, false, false] })

// Get the user's send count per zone (returns result directly)
// selector: { gym, sentsList: userId, isClosed: null } → also works with flashesList, projectsList
send({ msg:'method', method:'_boulders.getZonesCount',
  params:[{ gym: 'wattabloc', sentsList: userId, isClosed: null }] })
// result: { "1": 0, "2": 0, "5": 1, ... }  — keys are zone IDs (see gyms.zones)

// Add to projects
send({ msg:'method', method:'_boulders.project',
  params:[boulderId, userId, false, false] })

// Remove from projects
send({ msg:'method', method:'_boulders.notProject',
  params:[boulderId] })

// Post a comment (text; uploadId null = no video)
send({ msg:'method', method:'_boulders.saveComment',
  params:[{ text, boulderId, coach:false, fromHomescreen:false, uploadId:null }] })

// Delete a comment
send({ msg:'method', method:'_boulders.deleteComment',
  params:[commentId, false] })
```

All action responses return `{ msg:"updated", methods:[id] }` (not a `result` — no return value).

## Collections schema

### `boulders`

Key fields (confirmed live on wattabloc, 127 boulders):

| Field                                     | Type                  | Notes                                                                 |
| ----------------------------------------- | --------------------- | --------------------------------------------------------------------- |
| `gym`                                     | `String`              | e.g. `"wattabloc"`                                                    |
| `label`                                   | `Number`              | 1–8, maps to color via `gyms.labels`                                  |
| `grade`                                   | `String`              | e.g. `"6B+"`                                                          |
| `holdsColor`                              | `Number`              | integer → name via `gyms.holdsColors`, hex via `gyms.holdsColorsHexa` |
| `routeTypes`                              | `Number[]`            | integers → names via `gyms.routeTypes` map                            |
| `routeSetter`                             | `String[]`            | array of names                                                        |
| `zone`                                    | `Number`              | → name via `gyms.zones`                                               |
| `picture`                                 | `Object`              | `{ id, zoom, highlighted, share, ratio, width, crop }`                |
| `boulderNum`                              | `Number`              | displayed number in gym                                               |
| `createdAt`                               | `DdpDate`             | `{ $date: ms }` — use `ddpDateToDate()` to get a JS Date             |
| `closedAt`                                | `DdpDate?`            | planned teardown date — `daysUntilTeardown(b.closedAt)` → days left  |
| `isClosed`                                | `null \| DdpDate`     | **null** = open; `DdpDate` = already closed (actual closure date)    |
| `sentsList` / `sentsCount`                | `userId[]` / `Number` |                                                                       |
| `flashesList` / `flashesCount`            | `userId[]` / `Number` |                                                                       |
| `likesList` / `likesCount` / `likesRatio` |                       |                                                                       |
| `projectsList` / `followers`              | `userId[]`            |                                                                       |
| `commentsCount` / `videosCount`           | `Number`              |                                                                       |

### Images (S3)

Base: `https://socialboulder.s3-eu-west-1.amazonaws.com`

```js
const S3 = 'https://socialboulder.s3-eu-west-1.amazonaws.com';
`${S3}/bouldersPics/${picture.id}.jpg` // original
`${S3}/400/bouldersPics/${picture.id}.jpg` // 400px wide
`${S3}/800/bouldersPics/${picture.id}.jpg` // 800px wide
`${S3}/bouldersZooms/${picture.zoom}.jpg` // zoomed crop
`${S3}/boulderPicsShare/${picture.share}.jpg`; // 1200px share
```

### `gyms` (wattabloc mappings)

`holdsColors`: `{1:"roses", 2:"noires", 3:"oranges", 4:"vertes", 5:"violettes", 6:"blanches", 7:"rouges", 8:"bleues", 9:"jaunes", 10:"mint"}`

`labels`: `{1:"jaune", 2:"vert", 3:"bleu", 4:"rouge", 5:"violet", 6:"noir", 7:"blanc", 8:"rose"}`

`zones`: `{1:"Bout du Monde", 2:"Extension", 3:"Grande Dalle", 4:"Petit toit", 5:"Proue", 6:"Dévers", 7:"Fronton", 8:"Petite Dalle", 9:"Réta", 100:"Spraywall", 101:"Pan"}`

`routeTypes`: integers 1–21 → `{1:"Technique", 2:"Équilibre", 3:"Souplesse", 4:"Physique", 5:"Gainage", 6:"Compression", 7:"À doigts", 8:"Pose de pieds", 9:"Complexe", 10:"Basique", 11:"Dynamique", 12:"Coordination", 13:"Jeté", 14:"Run & Jump", 15:"Petits gabarits", 16:"Grands gabarits", 17:"Traversée", 18:"Long", 19:"Volumes", 20:"Plats", 21:"No Foot"}`

### `users`

```js
{
  _id: String,
  profile: {
    name: String,
    scores: {
      [gymSlug]: {
        points: { [label]: Number },
        counts: { [label]: Number },  // nb blocs envoyés par label
        bestGrades: Object,
        sessionsCount: Number,
        lastSend: Date,
      }
    }
  },
  emails: [{ address: String, verified: Boolean }],
  gyms: [gymSlug],        // toutes les salles visitées
  favoriteGyms: [gymSlug],
  lastGym: String,
  notificationsCount: Number,
  friendship: { friends: [userId], requesting: [userId], requestedBy: [userId] }
}
```

### `comments` (via `_boulders.comments`)

User posts on a boulder — can contain text, a video (Mux), or both.

| Field         | Type      | Notes                                                          |
| ------------- | --------- | -------------------------------------------------------------- |
| `userId`      | `String`  | author                                                         |
| `boulderId`   | `String`  |                                                                |
| `text`        | `String`  | can be empty (video-only post)                                 |
| `videoId`     | `String?` | Mux video ID                                                   |
| `videoSource` | `String?` | `"mux"`                                                        |
| `date`        | `DdpDate` | `{ $date: ms }`                                                |
| `highlighted` | `Boolean?`| pinned post (e.g. setter's beta video)                         |
| `userProfile` | `Object`  | Astronomy-serialised — parse via `parseUserProfile()` in hook  |
| `gymInfos`    | `Object`  | `{ name, appType }`                                            |

### `notifications`

```js
{
  _id: String,
  type: String,           // ex: "boulders.newBoulder"
  receiverId: String,
  senderId: String,
  senderProfile: Object,
  boulderId: String,
  gym: String,
  createdAt: Date,
  _isNew: Boolean,
}
```

## Exploration scripts

`exploration/` contains Node.js scripts using the `ws` package. **Do not modify them** — use as reference.

| Script                          | Purpose                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `ddp-fetch-boulders.js`         | Fetch all active boulders from a gym. Usage: `node exploration/ddp-fetch-boulders.js [gymId] [limit]` |
| `ddp-test-user-subs.js`         | Test `users.single` subscriptions for a given userId                                                  |
| `ddp-explore-boulder-detail.js` | Probe available subscriptions for a boulder (comments, media, etc.)                                   |
| `ddp-explore-comments.js`       | Find boulders with comments and dump the `comments` collection schema                                 |

## i18n

- **Stack** : `i18next` + `react-i18next` + `expo-localization`
- **Langue par défaut** : français (`fallbackLng: 'fr'`), détection automatique via `expo-localization`
- **Fichiers de traduction** : `lib/i18n/locales/fr.json` et `en.json`
- **Usage dans les composants** :

  ```tsx
  import { useTranslation } from 'react-i18next';

  function MyComponent() {
    const { t } = useTranslation();
    return <Text>{t('common.loading')}</Text>;
  }
  ```

- Toutes les clés de traduction sont en **anglais**
- **Jamais** de chaîne UI en dur dans les composants — toujours `t('...')`

## Stack

- **Framework**: Expo (SDK latest) + Expo Router (file-based routing) + Expo Web (`react-native-web`)
- **Language**: TypeScript
- **UI Components**: `react-native-reusables` (équivalent shadcn pour RN+Web, copy-paste, NativeWind v4) - [Docs](https://reactnativereusables.com/docs)
  - Ajouter un composant : `npx @react-native-reusables/cli@latest add <component>`
  - Vérifier la config : `npx @react-native-reusables/cli@latest doctor`
  - Composants copiés dans `components/ui/` et `node_modules/@rnr/`
- **Styling**: NativeWind v4 (Tailwind CSS pour React Native/Web) — classes `className` disponibles sur tous les composants
  - Couleur `primary`: French Rose `#e35f8d` — aussi accessible via `hsl(var(--primary))`
  - Couleur `secondary`: Teal `#2aab7e` — aussi accessible via `hsl(var(--secondary))`
  - Tokens sémantiques RNR : `background`, `foreground`, `card`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `popover`
  - Border radius : `rounded-lg` = `var(--radius)` = `0.5rem`
  - Dark mode : classe `dark` sur le root (`darkMode: 'class'`)
  - Fichiers clés : `global.css` (CSS vars), `tailwind.config.js`, `lib/theme.ts` (THEME + NAV_THEME), `lib/utils.ts` (cn helper)
  - Fonts: **Outfit** (headings) + **DM Sans** (body/UI) — `className="font-outfit-bold"`, `"font-dm-sans"`, etc.
- **Storybook**: `@storybook/react-native` v10, lancé avec `npm run storybook`
  - Stories dans `components/**/*.stories.tsx`
  - Design system stories: `components/design-system/ColorPalette.stories.tsx`, `Typography.stories.tsx`
- **DDP client**: `simpleddp` — Promise-based, reactive, works with the native browser/RN `WebSocket` global
  - Singleton dans `lib/ddp/client.ts`, partagé par tous les hooks
  - Login centralisé via `ensureLoggedIn()` — appelé une seule fois même si plusieurs hooks démarrent en parallèle
  - Pattern dans les hooks : `await ensureLoggedIn()` → `client.subscribe(...)` → `await sub.ready()` → `client.collection(...).fetch()`
  - **Cleanup** : toujours utiliser `sub.remove()` (pas `sub.stop()`) dans le return d'un `useEffect`. `stop()` laisse la sub dans `this.subs` de simpleddp → React Strict Mode double-invoque les effets → le 2e montage récupère la sub stoppée et son `ready()` rejette sur le `nosub` du cleanup précédent.
- **Scripts**: `npm run start/ios/android/web`, `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`, `npm run storybook`

## Project structure

```
app/
  _layout.tsx          ← root layout (fonts, NAV_THEME, PortalHost, GestureHandlerRootView, BottomSheetModalProvider, i18n init)
  index.tsx            ← liste des blocs (wattabloc)
  boulder/
    [id].tsx           ← page détail d'un bloc (stats tappables → UserListSheet)
components/
  BoulderCard.tsx      ← carte d'un bloc (grade, route types, holds color badge)
  BoulderCard.stories.tsx ← Storybook stories
  BoulderStatRow.tsx   ← rangée de stats avec séparateurs verticaux (envois, flashs, likes) — stats tappables via onPress
  BoulderStatRow.stories.tsx ← Storybook stories
  FullScreenImage.tsx  ← visionneuse plein écran avec zoom (pinch, double-tap)
  FullScreenImage.stories.tsx ← Storybook stories
  GymMap.tsx           ← plan SVG de la salle (zones cliquables)
  GymMap.stories.tsx   ← Storybook stories
  HoldsColorBadge.tsx  ← badge couleur des prises (contraste auto)
  HoldsColorBadge.stories.tsx ← Storybook stories
  UserAvatar.tsx       ← avatar circulaire avec initiales en fallback
  UserAvatar.stories.tsx ← Storybook stories
  UserListSheet.tsx    ← bottom-sheet liste de grimpeurs (sents/flashes/likes) — réinjecte les CSS vars NativeWind via vars()
  UserListSheet.stories.tsx ← Storybook stories
  design-system/       ← stories Storybook (ColorPalette, Typography)
  ui/                  ← composants RNR (ajoutés via CLI, ne pas modifier manuellement)
lib/
  ddp/
    client.ts          ← singleton simpleddp + ensureLoggedIn() (login unique partagé, survit au fast-refresh via global)
  i18n/
    index.ts           ← config i18next (langue device, fallback fr)
    locales/
      fr.json          ← traductions françaises
      en.json          ← traductions anglaises
  suppress-lib-warnings.ts ← filtre les warnings de libs tierces (react-native-web, react-navigation)
  color.ts             ← isLightColor() + contrastColor() (utilitaires couleur partagés)
  last-gym.ts          ← getLastGym() / setLastGym() via AsyncStorage (deeplink + fast-reload gym hint)
  theme.ts             ← THEME (toutes les couleurs résolues) + NAV_THEME
  utils.ts             ← cn() helper (clsx + tailwind-merge) + daysUntilTeardown()
hooks/
  use-boulders.ts      ← subscribe _boulders.list + _boulders.count → { boulders, count, loading, error }
  use-boulder.ts       ← single boulder by id (fast-path collection cache + fallback DDP using last-gym)
  use-boulder-users.ts ← fetch user profiles for a list of IDs via concurrent users.single subs
  use-zones-count.ts   ← _boulders.getZonesCount query → { counts, loading, refresh } (sends/flashes/projects per zone)
  use-boulder-actions.ts ← DDP action methods (logSend, logFlash, removeSend, toggleLike, addProject, removeProject, saveComment, deleteComment)
  use-boulder-comments.ts ← subscribe _boulders.comments → { comments, loading, error } (texte + vidéo Mux)
  use-gym.ts           ← subscribe _gyms.info → { gym, loading }
  use-color-scheme.ts  ← hook color scheme (web-safe)
types/
  boulder.ts           ← DdpDate, ddpDateToDate(), Boulder, BoulderComment, BoulderCommentUserProfile
  gym.ts               ← type Gym
  user.ts              ← type User (id, profile.name)
exploration/
  ddp-fetch-boulders.js        ← fetch all active boulders from a gym
  ddp-test-user-subs.js        ← test users.single subscriptions (confirmed working server-side)
  ddp-explore-boulder-detail.js ← probe available subs for a boulder
  ddp-explore-comments.js      ← dump comments collection schema
.rnstorybook/
  preview.tsx          ← décorateurs Storybook (fonts, fond blanc)
  main.ts              ← config Storybook
.env                   ← credentials DDP (gitignored)
.env.example           ← template à committer
global.css             ← CSS variables (--primary, --secondary, --radius…)
tailwind.config.js     ← couleurs + fonts + borderRadius + plugins
```

```ts
import SimpleDDP from 'simpleddp';

const ddp = new SimpleDDP({
  endpoint: 'wss://www.sboulder.com/sockjs/websocket',
  SocketConstructor: WebSocket, // native in browser (Expo Web) and React Native
  reconnectInterval: 5000,
});
```

- **CORS**: server declares `"origins": ["*:*"]` — no restriction on the Origin header
- **Auth token**: valid until 2126, stored in `.env` (gitignored)
