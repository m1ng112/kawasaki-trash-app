# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint to check code quality
- `npm run reset-project` - Reset project to fresh state

### Installation
- `npm install` - Install all dependencies

## Architecture

This is a React Native Expo project using:
- **Expo Router v5** for file-based routing
- **TypeScript** with strict mode enabled
- **React Native 0.79.3** with React 19.0.0
- **Expo SDK 53**

### Routing Structure
- `/app/_layout.tsx` - Root layout with Stack navigator
- `/app/(tabs)/_layout.tsx` - Bottom tab navigator
- `/app/(tabs)/index.tsx` - Home screen
- `/app/(tabs)/explore.tsx` - Explore screen
- `/app/+not-found.tsx` - 404 handler

Routes are automatically generated from the file structure in `/app/`. The project uses typed routes (`expo.experiments.typedRoutes: true`).

### Component Organization
- `/components/` - Reusable UI components
- `/components/ui/` - Platform-specific UI components
- `/constants/Colors.ts` - Theme colors for light/dark modes
- `/hooks/` - Custom React hooks

### Styling Approach
- Automatic light/dark theme switching
- Platform-specific implementations where needed (`.ios.tsx`, `.web.ts`)
- Themed components (`ThemedText`, `ThemedView`) for consistent styling

### Configuration
- `app.json` - Expo configuration (scheme: "trashai", newArchEnabled: true)
- `tsconfig.json` - TypeScript config with `@/*` path alias
- `eslint.config.js` - ESLint with Expo's config

## Important Notes
- No test framework is currently configured
- The project uses React Native's new architecture
- Deep linking scheme is "trashai"
- Path alias `@/*` maps to project root