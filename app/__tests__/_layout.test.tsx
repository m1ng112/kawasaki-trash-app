import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RootLayout from '../_layout';
import { useFonts } from 'expo-font';
import { NotificationService } from '@/services/notificationService';

// Mock the modules
jest.mock('expo-font');
jest.mock('@/services/notificationService');
jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));
jest.mock('@/contexts/LocalizationContext', () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));
jest.mock('@react-navigation/native', () => ({
  DarkTheme: { dark: true, colors: {} },
  DefaultTheme: { dark: false, colors: {} },
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

describe('RootLayout', () => {
  const mockUseFonts = useFonts as jest.MockedFunction<typeof useFonts>;
  const mockInitialize = NotificationService.initialize as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render null when fonts are not loaded', () => {
    mockUseFonts.mockReturnValue([false]);
    
    const { toJSON } = render(<RootLayout />);
    
    expect(toJSON()).toBeNull();
  });

  it('should render the layout when fonts are loaded', () => {
    mockUseFonts.mockReturnValue([true]);
    
    const rendered = render(<RootLayout />);
    
    // Check that NotificationService.initialize was called
    expect(mockInitialize).toHaveBeenCalled();
    // Check that the component rendered something
    expect(rendered).toBeDefined();
  });

  it('should initialize notification service on mount', () => {
    mockUseFonts.mockReturnValue([true]);
    
    render(<RootLayout />);
    
    expect(mockInitialize).toHaveBeenCalledTimes(1);
  });
});