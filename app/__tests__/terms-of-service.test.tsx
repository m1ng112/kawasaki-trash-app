import React from 'react';
import { render } from '@testing-library/react-native';
import TermsOfServiceScreen from '../terms-of-service';

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

describe('TermsOfServiceScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render terms of service in English', () => {
    const { getByText } = render(<TermsOfServiceScreen />);
    
    expect(getByText('Last updated: January 1, 2024')).toBeTruthy();
    expect(getByText('Article 1 (Application)')).toBeTruthy();
    expect(getByText('Article 2 (User Registration)')).toBeTruthy();
    expect(getByText('Article 3 (Purpose of the App)')).toBeTruthy();
  });

  it('should render terms of service in Japanese', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'ja' });

    const { getByText } = render(<TermsOfServiceScreen />);
    
    expect(getByText('最終更新日: 2024年1月1日')).toBeTruthy();
    expect(getByText('第1条（適用）')).toBeTruthy();
    expect(getByText('第2条（利用登録）')).toBeTruthy();
    expect(getByText('第3条（本アプリの目的）')).toBeTruthy();
  });

  it('should render terms of service in Chinese', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'zh' });

    const { getByText } = render(<TermsOfServiceScreen />);
    
    expect(getByText('最后更新：2024年1月1日')).toBeTruthy();
    expect(getByText('第一条（适用）')).toBeTruthy();
    expect(getByText('第二条（用户注册）')).toBeTruthy();
    expect(getByText('第三条（应用目的）')).toBeTruthy();
  });

  it('should render terms of service in Korean', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'ko' });

    const { getByText } = render(<TermsOfServiceScreen />);
    
    expect(getByText('최종 업데이트: 2024년 1월 1일')).toBeTruthy();
    expect(getByText('제1조 (적용)')).toBeTruthy();
    expect(getByText('제2조 (이용등록)')).toBeTruthy();
    expect(getByText('제3조 (본 앱의 목적)')).toBeTruthy();
  });

  it('should include all required sections in English', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'en' });
    
    const { getByText } = render(<TermsOfServiceScreen />);
    
    // Check for key sections
    expect(getByText('Article 1 (Application)')).toBeTruthy();
    expect(getByText('Article 4 (User Obligations)')).toBeTruthy();
    expect(getByText('Article 5 (Prohibited Acts)')).toBeTruthy();
    expect(getByText('Article 6 (Disclaimer)')).toBeTruthy();
    expect(getByText('Article 7 (Privacy)')).toBeTruthy();
    expect(getByText('Article 11 (Governing Law and Jurisdiction)')).toBeTruthy();
  });

  it('should contain important legal information', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'en' });
    
    const { getByText } = render(<TermsOfServiceScreen />);
    
    // Check for key legal content
    expect(getByText(/not an official application of Kawasaki City/i)).toBeTruthy();
    expect(getByText(/Tokyo District Court/)).toBeTruthy();
    expect(getByText(/Japanese law/)).toBeTruthy();
  });

  it('should display footer and contact information', () => {
    const { useLocalization } = require('@/contexts/LocalizationContext');
    useLocalization.mockReturnValue({ language: 'en' });
    
    const { getByText } = render(<TermsOfServiceScreen />);
    
    expect(getByText(/Established: January 1, 2024/)).toBeTruthy();
    expect(getByText(/contact function within the App/)).toBeTruthy();
  });
});