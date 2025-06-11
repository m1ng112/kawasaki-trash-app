import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((colors, colorName) => {
    // Return light color by default
    return colors?.light || '#000000';
  }),
}));

describe('ThemedText', () => {
  it('should render text with default style', () => {
    const { getByText, toJSON } = render(
      <ThemedText>Default Text</ThemedText>
    );

    expect(getByText('Default Text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should apply title style when type is title', () => {
    const { getByText } = render(
      <ThemedText type="title">Title Text</ThemedText>
    );

    const textElement = getByText('Title Text');
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
      })
    );
  });

  it('should apply subtitle style when type is subtitle', () => {
    const { getByText } = render(
      <ThemedText type="subtitle">Subtitle Text</ThemedText>
    );

    const textElement = getByText('Subtitle Text');
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({
        fontSize: 20,
        fontWeight: 'bold',
      })
    );
  });

  it('should apply defaultSemiBold style when type is defaultSemiBold', () => {
    const { getByText } = render(
      <ThemedText type="defaultSemiBold">Semi Bold Text</ThemedText>
    );

    const textElement = getByText('Semi Bold Text');
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
      })
    );
  });

  it('should apply link style when type is link', () => {
    const { getByText } = render(
      <ThemedText type="link">Link Text</ThemedText>
    );

    const textElement = getByText('Link Text');
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
      })
    );
  });

  it('should use custom light color when provided', () => {
    const { useThemeColor } = require('@/hooks/useThemeColor');
    useThemeColor.mockImplementation((colors) => colors.light);

    const { getByText } = render(
      <ThemedText lightColor="#FF0000" darkColor="#00FF00">
        Custom Color Text
      </ThemedText>
    );

    const textElement = getByText('Custom Color Text');
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({
        color: '#FF0000',
      })
    );
  });

  it('should merge custom styles with type styles', () => {
    const customStyle = { marginTop: 10, fontSize: 18 };
    const { getByText } = render(
      <ThemedText type="default" style={customStyle}>
        Custom Style Text
      </ThemedText>
    );

    const textElement = getByText('Custom Style Text');
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({
        marginTop: 10,
        fontSize: 18, // Custom style should override default
      })
    );
  });

  it('should pass through additional props', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemedText 
        testID="themed-text"
        numberOfLines={2}
        onPress={onPress}
      >
        Props Text
      </ThemedText>
    );

    const textElement = getByText('Props Text');
    expect(textElement.props.testID).toBe('themed-text');
    expect(textElement.props.numberOfLines).toBe(2);
    expect(textElement.props.onPress).toBe(onPress);
  });

  it('should handle undefined type gracefully', () => {
    const { getByText } = render(
      <ThemedText type={undefined}>Undefined Type</ThemedText>
    );

    const textElement = getByText('Undefined Type');
    // Should apply default style
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({
        fontSize: 16,
        lineHeight: 24,
      })
    );
  });
});