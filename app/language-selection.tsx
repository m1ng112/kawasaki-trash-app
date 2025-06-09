import React from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

const LANGUAGES = [
  { id: 'ja', name: '日本語', nameEn: 'Japanese', flag: '🇯🇵' },
  { id: 'en', name: 'English', nameEn: 'English', flag: '🇺🇸' },
  { id: 'zh', name: '中文', nameEn: 'Chinese', flag: '🇨🇳' },
  { id: 'ko', name: '한국어', nameEn: 'Korean', flag: '🇰🇷' },
];

export default function LanguageSelectionScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme ?? 'light'];

  const handleLanguageSelect = async (language: typeof LANGUAGES[0]) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', language.id);
      await AsyncStorage.setItem('onboardingStep', 'location');
      router.replace('/district-selection');
    } catch {
      Alert.alert('Error', 'Failed to save language preference.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.icon}>♻️</ThemedText>
          <ThemedText style={styles.title}>川崎市ごみ分別アプリ</ThemedText>
          <ThemedText style={styles.titleEn}>Kawasaki City Waste Sorting App</ThemedText>
          <ThemedText style={styles.subtitle}>言語を選択してください / Please select your language</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.languageList}>
          {LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.id}
              style={[styles.languageButton, { borderColor: colors.tint }]}
              onPress={() => handleLanguageSelect(language)}
              activeOpacity={0.7}
            >
              <ThemedView style={styles.languageContent}>
                <ThemedText style={styles.flag}>{language.flag}</ThemedText>
                <ThemedView style={styles.languageNames}>
                  <ThemedText style={styles.languageName}>{language.name}</ThemedText>
                  {language.name !== language.nameEn && (
                    <ThemedText style={styles.languageNameEn}>{language.nameEn}</ThemedText>
                  )}
                </ThemedView>
              </ThemedView>
              <IconSymbol name="chevron.right" size={20} color={colors.icon} />
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleEn: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  languageList: {
    gap: 12,
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flag: {
    fontSize: 32,
  },
  languageNames: {
    gap: 4,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
  },
  languageNameEn: {
    fontSize: 14,
    opacity: 0.6,
  },
});