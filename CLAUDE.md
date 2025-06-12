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

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Installation
- `npm install` - Install all dependencies
- When installing new dependencies that may have peer dependency conflicts with React 19, use `npm install --legacy-peer-deps`

### Package Management Rules
- **IMPORTANT**: Always run `npm install --legacy-peer-deps` after adding new dependencies to update package-lock.json
- This prevents `npm ci` errors: "npm ci can only install packages when your package.json and package-lock.json are in sync"
- After modifying package.json:
  1. Run `npm install --legacy-peer-deps`
  2. Verify with `npm ci --legacy-peer-deps` to ensure it works
  3. Commit both package.json and package-lock.json together

### iOS Build Issues
- **C++ Compilation Errors**: If you see errors like "Cannot find module 'yoga/algorithm/AbsoluteLayout.h'" or SDWebImage compilation failures:
  1. Run `pod install --repo-update` in the root directory to reinstall iOS dependencies
  2. This fixes missing Yoga layout engine headers and other native dependencies
  3. The Yoga pod creates header links in `ios/Pods/Headers/Public/Yoga/` and `ios/Pods/Headers/Private/Yoga/`

## Architecture

This is a React Native Expo project using:
- **Expo Router v5** for file-based routing
- **TypeScript** with strict mode enabled
- **React Native 0.79.3** with React 19.0.0
- **Expo SDK 53**

### Routing Structure
- `/app/_layout.tsx` - Root layout with Stack navigator
- `/app/(tabs)/_layout.tsx` - Bottom tab navigator
- `/app/(tabs)/index.tsx` - Home screen (waste collection schedule)
- `/app/(tabs)/calendar.tsx` - Calendar view
- `/app/(tabs)/search.tsx` - Waste item search
- `/app/(tabs)/camera.tsx` - Camera for waste identification (placeholder)
- `/app/(tabs)/settings.tsx` - App settings
- `/app/language-selection.tsx` - Language selection screen
- `/app/district-selection.tsx` - District/area selection
- `/app/town-selection.tsx` - Town selection within district
- `/app/terms-of-service.tsx` - Terms of service
- `/app/privacy-policy.tsx` - Privacy policy (multilingual)
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
- The project uses React Native's new architecture
- Deep linking scheme is "trashai"
- Path alias `@/*` maps to project root
- Using React 19.0.0 which may cause peer dependency warnings with some packages

## Testing

### Test Framework
- **Jest** with **jest-expo** preset for React Native testing
- **React Native Testing Library** for component testing
- Test files should be placed in `__tests__` directories next to the code they test

### Test Structure
- `/app/__tests__/` - Tests for app screens and layouts
- `/components/__tests__/` - Tests for reusable components
- `/data/__tests__/` - Tests for data processing and business logic
- `/services/__tests__/` - Tests for service layers

### Writing Tests
- Mock external dependencies (expo modules, navigation, etc.) in test files or jest.setup.js
- Use `jest.useFakeTimers()` when testing time-dependent functionality
- Clear all mocks in `beforeEach()` to ensure test isolation
- For timezone-sensitive tests, use `date.toISOString().split('T')[0]` to ensure consistent date strings

## Data Management

### Waste Collection Data
- **Area schedules** are defined in `/data/areas.ts`
- **Waste items database** in `/data/wasteItems.ts`
- **Schedule calculation** logic in `/data/scheduleCalculator.ts`
- **Holiday data** in `/data/holidays.ts`

### Localization
- Supports 4 languages: Japanese (ja), English (en), Chinese (zh), Korean (ko)
- Language context provided by `LocalizationContext`
- Category translations in `/data/categoryHelper.ts`

## Key Services

### NotificationService
- Handles waste collection reminders
- Schedules notifications for evening before and morning of collection
- Respects user preferences stored in AsyncStorage
- Platform-specific notification channels for Android

## Privacy and Legal

### Privacy Policy
- Implemented as modal screen accessible from settings
- Available in 4 languages (Japanese, English, Chinese, Korean)
- Clearly states data collection practices:
  - Location information (device only, not transmitted)
  - Selected area information (device only)
  - Notification settings (device only)
- No data transmission to external servers
- No third-party data sharing

### Data Storage
- All user data stored locally using AsyncStorage
- No external API calls or data transmission
- iOS PrivacyInfo.xcprivacy configured for no data collection

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing patterns for component structure
- Use themed components (`ThemedText`, `ThemedView`) for consistent styling
- Implement platform-specific code using `.ios.tsx` and `.android.tsx` extensions when needed

### State Management
- Local state with React hooks for component-specific data
- AsyncStorage for persistent user preferences
- Context API for global app state (localization, theme)

### Error Handling
- Always handle async errors with try-catch blocks
- Log errors appropriately without exposing sensitive information
- Provide fallback behavior for failed operations

### Performance
- Use React.memo for expensive component renders
- Implement lazy loading for heavy components
- Optimize list rendering with proper key props and item layouts

### Dependencies and Compatibility
- When adding new packages, check compatibility with React 19.0.0
- Use `--legacy-peer-deps` flag if peer dependency conflicts arise
- Prefer packages that explicitly support Expo SDK 53

### Testing Best Practices
- Write tests for business logic first (data processing, calculations)
- Test user interactions and component behavior, not implementation details
- Use descriptive test names that explain what is being tested
- Group related tests using `describe` blocks
- Always clean up after tests (timers, mocks, etc.)

### Git Workflow
- Commit messages should be clear and descriptive
- Test changes locally before committing
- Run `npm run lint` and `npm test` before pushing changes
- Keep commits focused on a single feature or fix

### Debugging
- Use React Native Debugger for development
- Console logs should be removed before committing
- Use breakpoints instead of console.log for debugging
- Check Expo logs for runtime errors

### Common Issues and Solutions
- **Metro bundler issues**: Run `npx expo start -c` to clear cache
- **Dependency issues**: Delete node_modules and run `npm install --legacy-peer-deps`
- **iOS build issues**: Run `cd ios && pod install`
- **Test failures**: Check if mocks in jest.setup.js need updating