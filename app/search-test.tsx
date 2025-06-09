import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalization } from '@/contexts/LocalizationContext';
import { searchWasteItems } from '@/data/wasteItems';

const TEST_QUERIES = {
  ja: ['生ごみ', 'なまごみ', '野菜', 'ペットボトル', '缶', 'プラスチック'],
  en: ['food waste', 'plastic', 'can', 'bottle', 'newspaper'],
  zh: ['厨余垃圾', '塑料', '罐头', '报纸', '纸箱'],
  ko: ['음식물쓰레기', '플라스틱', '캔', '신문', '박스']
};

export default function SearchTestScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t, language } = useLocalization();
  const [query, setQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (searchQuery: string, searchLang: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      const searchResults = searchWasteItems(searchQuery, searchLang);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  const testQueries = TEST_QUERIES[selectedLanguage as keyof typeof TEST_QUERIES] || TEST_QUERIES.ja;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Search Test</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language Selector */}
        <View style={styles.languageSelector}>
          <ThemedText style={styles.sectionTitle}>Test Language:</ThemedText>
          <View style={styles.languageButtons}>
            {['ja', 'en', 'zh', 'ko'].map(lang => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageButton,
                  { backgroundColor: selectedLanguage === lang ? colors.tint : '#e0e0e0' }
                ]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <ThemedText style={[
                  styles.languageButtonText,
                  { color: selectedLanguage === lang ? 'white' : '#333' }
                ]}>
                  {lang.toUpperCase()}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <ThemedText style={styles.sectionTitle}>Search Query:</ThemedText>
          <TextInput
            style={[styles.searchInput, { backgroundColor: colors.surface }]}
            placeholder={`Search in ${selectedLanguage}...`}
            value={query}
            onChangeText={(text) => handleSearch(text, selectedLanguage)}
            returnKeyType="search"
          />
        </View>

        {/* Quick Test Buttons */}
        <View style={styles.quickTestContainer}>
          <ThemedText style={styles.sectionTitle}>Quick Tests:</ThemedText>
          <View style={styles.testButtonGrid}>
            {testQueries.map(testQuery => (
              <TouchableOpacity
                key={testQuery}
                style={styles.testButton}
                onPress={() => handleSearch(testQuery, selectedLanguage)}
              >
                <ThemedText style={styles.testButtonText}>{testQuery}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <ThemedText style={styles.sectionTitle}>
            Results ({results.length}):
          </ThemedText>
          {results.length === 0 && query ? (
            <ThemedText style={styles.noResults}>No results found</ThemedText>
          ) : (
            results.map((item, index) => (
              <View key={item.id} style={styles.resultItem}>
                <ThemedText style={styles.resultName}>
                  {index + 1}. {item.name} {item.icon}
                </ThemedText>
                <ThemedText style={styles.resultCategory}>
                  Category: {item.category}
                </ThemedText>
                <ThemedText style={styles.resultKeywords}>
                  Keywords: {item.keywords.slice(0, 5).join(', ')}
                  {item.keywords.length > 5 ? '...' : ''}
                </ThemedText>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2196F3',
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  languageSelector: {
    marginBottom: 20,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  quickTestContainer: {
    marginBottom: 20,
  },
  testButtonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  testButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  testButtonText: {
    color: '#2196F3',
    fontSize: 14,
  },
  resultsContainer: {
    marginBottom: 20,
  },
  noResults: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  resultItem: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  resultKeywords: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
});