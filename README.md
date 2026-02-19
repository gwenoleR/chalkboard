# 🧗 Chalkboard

A custom mobile & web UI for [Social Boulder](https://sboulder.com) — track your climbing sessions, explore gym boulders, and follow your progress.

> Built with ❤️ by climbers, for climbers. Connects directly to the Social Boulder backend via the DDP (Meteor.js WebSocket) protocol.

---

## ✨ Features

- 🗺️ Browse boulders by gym, grade, and color — immersive card feed with full-width photos
- 🖼️ Full-width boulder photos with holds color badge and label dot
- 📍 Mini gym floor plan on each card with the boulder's zone highlighted
- 🎬 "Beta" badge on cards that have a demo video
- ✅ Log sends and flashes
- 📊 Track your progress and stats over time (sends, likes, comments)
- 🌍 Multi-language support (French & English)
- 🌙 Light & dark mode

---

## 🛠️ Tech stack

| Layer         | Technology                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| Framework     | [Expo](https://expo.dev) + [Expo Router](https://expo.github.io/router)                                           |
| Styling       | [NativeWind v4](https://www.nativewind.dev) (Tailwind CSS)                                                        |
| UI components | [react-native-reusables](https://reactnativereusables.com) + [lucide-react-native](https://lucide.dev) |
| Backend       | DDP over WebSocket ([simpleddp](https://github.com/Gregivy/simpleddp))                                            |
| i18n          | [i18next](https://www.i18next.com) + [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/) |
| Design system | French Rose `#e35f8d` × Teal `#2aab7e` · Outfit + DM Sans                                                         |
| Storybook     | [@storybook/react-native](https://storybook.js.org/docs/react-native)                                             |

---

## 🚀 Getting started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) on your device, or an iOS/Android simulator

### Install

```bash
npm install
```

### Configure

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### Run

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

---

## 🎨 Storybook

Explore the design system components interactively:

```bash
npm run storybook
```

---

## 🧹 Code quality

```bash
# Lint
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format with Prettier
npm run format

# Check formatting
npm run format:check
```

---

## 📁 Project structure

```
app/                  ← Expo Router screens
components/
  design-system/      ← Storybook stories
  ui/                 ← react-native-reusables components
lib/
  i18n/               ← Translations (fr, en)
  theme.ts            ← Design tokens
  utils.ts            ← cn() helper
hooks/                ← Custom React hooks
exploration/          ← DDP reference scripts (Node.js)
```

---

## 📄 License

[Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/)

You are free to use, share, and adapt this project for **non-commercial purposes**, as long as you give appropriate credit. Commercial use is not permitted.
