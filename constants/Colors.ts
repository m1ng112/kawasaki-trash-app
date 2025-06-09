/**
 * Kawasaki City Waste Sorting App Color Palette
 * Colors are optimized for accessibility and recycling/eco-friendly theme
 */

export const Colors = {
  primary: '#4CAF50',      // Main green (eco/recycling)
  secondary: '#2196F3',    // Blue (information/search)
  warning: '#FF9800',      // Orange (non-burnable waste/caution)
  accent: '#9C27B0',       // Purple (camera/AI functions)
  danger: '#F44336',       // Red (notifications/important)
  
  // Waste category colors
  burnable: '#4CAF50',     // Green for burnable waste
  recyclable: '#2196F3',   // Blue for recyclable waste
  nonBurnable: '#FF9800',  // Orange for non-burnable waste
  oversized: '#9C27B0',    // Purple for oversized waste

  light: {
    text: '#333333',         // Main text
    textSecondary: '#666666', // Secondary text
    background: '#FFFFFF',   // White background
    surface: '#FFFFFF',      // Card/surface background
    border: '#E0E0E0',       // Border color
    tint: '#4CAF50',         // Primary green
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#4CAF50',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    text: '#ECEDEE',         // Light text for dark mode
    textSecondary: '#B3B3B3', // Secondary text for dark mode
    background: '#151718',   // Dark background
    surface: '#1E1E1E',      // Dark card/surface background
    border: '#2E2E2E',       // Dark border color
    tint: '#5AC8FA',         // Light blue for dark mode
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#5AC8FA',
    shadow: 'rgba(255, 255, 255, 0.08)',
  },
};
