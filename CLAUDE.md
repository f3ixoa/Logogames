# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies.
- `npm run dev` — run the Vite development server at port 3000 (`host: true` makes it accessible on the network).
- `npm run build` — create a production build in `dist/`; Vite uses Terser and removes `console` calls.
- `npm run preview` — serve the production build locally.

There are no lint or test scripts configured in `package.json`, and no test runner is present. The main verification command is `npm run build`.

## Architecture

This is a client-side React single-page app built with Vite and `react-router-dom`. `src/main.jsx` mounts `App` in `React.StrictMode`; `src/App.jsx` owns the browser router, shared header/sidebar, and routes. Routes select a speech sound, then a content category or game, with the selected sound/category passed in URL parameters.

Speech-learning content is held in static modules under `src/data/` (sounds, categories, syllables, words, sentences, texts, articulation, and game metadata). Pages under `src/pages/` look up the selected sound and render the corresponding content. Reusable presentation components are under `src/components/`.

Interactive games live under `src/games/`, each with its own React component and stylesheet. `VowelFlower` and `SpeechLadder` both use the shared sound/syllable data and speech utilities in `src/utils/`. `speechRecognition.js` wraps browser speech recognition and syllable matching; `speechSynthesis.js` wraps browser text-to-speech. When changing a game, preserve the route parameters/data flow and check its local CSS as well as React state/event handling.

Global styles are in `src/styles/global.css`; feature-specific styling is colocated with components/pages/games. Vite configuration is in `vite.config.js` (port 3000, output directory `dist`).
