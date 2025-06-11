import React from 'react';
import { render } from '@testing-library/react-native';
import PrivacyPolicyScreen from '../privacy-policy';

// Mock the modules
jest.mock('@/contexts/LocalizationContext', () => ({
  useLocalization: jest.fn(() => ({
    language: 'en',
  })),
}));

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children }: any) => children,
  },
  useRouter: jest.fn(() => ({
    back: jest.fn(),
  })),
}));

describe('PrivacyPolicyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render privacy policy in English', () => {
    const { getByText } = render(<PrivacyPolicyScreen />);
    
    expect(getByText('Last updated: January 1, 2024')).toBeTruthy();
    expect(getByText('Introduction')).toBeTruthy();
    expect(getByText('Information We Collect')).toBeTruthy();
  });

  it('should render privacy policy in Japanese', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'ja' });

    const { getByText } = render(<PrivacyPolicyScreen />);
    
    expect(getByText('最終更新日: 2024年1月1日')).toBeTruthy();
    expect(getByText('はじめに')).toBeTruthy();
    expect(getByText('収集する情報')).toBeTruthy();
  });

  it('should render privacy policy in Chinese', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'zh' });

    const { getByText } = render(<PrivacyPolicyScreen />);
    
    expect(getByText('最后更新：2024年1月1日')).toBeTruthy();
    expect(getByText('简介')).toBeTruthy();
    expect(getByText('我们收集的信息')).toBeTruthy();
  });

  it('should render privacy policy in Korean', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'ko' });

    const { getByText } = render(<PrivacyPolicyScreen />);
    
    expect(getByText('최종 업데이트: 2024년 1월 1일')).toBeTruthy();
    expect(getByText('소개')).toBeTruthy();
    expect(getByText('수집하는 정보')).toBeTruthy();
  });

  it('should include all required privacy policy sections in English', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'en' });
    
    const { getByText } = render(<PrivacyPolicyScreen />);
    
    // Check for key sections
    expect(getByText('Introduction')).toBeTruthy();
    expect(getByText('Information We Collect')).toBeTruthy();
    expect(getByText('Use of Information')).toBeTruthy();
    expect(getByText('Third-Party Disclosure')).toBeTruthy();
    expect(getByText('Data Storage')).toBeTruthy();
    expect(getByText('Security')).toBeTruthy();
    expect(getByText('Children\'s Privacy')).toBeTruthy();
    expect(getByText('Changes')).toBeTruthy();
    expect(getByText('Contact')).toBeTruthy();
  });

  it('should contain proper data handling information in English', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'en' });
    
    const { getByText } = render(<PrivacyPolicyScreen />);
    
    // Check for key privacy information (using partial text that should be found)
    expect(getByText(/Device only/)).toBeTruthy();
    expect(getByText(/not transmitted to external servers/)).toBeTruthy();
    expect(getByText(/not sell, trade, or transfer/)).toBeTruthy();
  });
});