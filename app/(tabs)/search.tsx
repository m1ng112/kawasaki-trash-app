import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { commonStyles } from '@/styles/common';
import { searchWasteItems, getDidYouMeanSuggestions, getPopularSearchTerms } from '@/data/wasteItems';
import { getCategoryDisplayName } from '@/data/categoryHelper';
import type { WasteItem, SearchHistoryItem } from '@/types';

const SEARCH_HISTORY_KEY = 'searchHistory';
const MAX_HISTORY_ITEMS = 10;

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme ?? 'light'];
  const { t, currentLanguage } = useLocalization();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WasteItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [didYouMeanSuggestions, setDidYouMeanSuggestions] = useState<string[]>([]);
  const [popularTerms, setPopularTerms] = useState<string[]>([]);

  useEffect(() => {
    loadSearchHistory();
    loadPopularTerms();
  }, []);

  useEffect(() => {
    loadPopularTerms();
  }, [currentLanguage]);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setDidYouMeanSuggestions([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveSearchHistory = async (query: string, item?: WasteItem) => {
    try {
      const newHistoryItem: SearchHistoryItem = {
        query,
        timestamp: Date.now(),
        result: item,
      };

      const updatedHistory = [
        newHistoryItem,
        ...searchHistory.filter(h => h.query !== query)
      ].slice(0, MAX_HISTORY_ITEMS);

      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const loadPopularTerms = () => {
    const terms = getPopularSearchTerms(currentLanguage, 6);
    setPopularTerms(terms);
  };

  const performSearch = (query: string) => {
    const results = searchWasteItems(query, currentLanguage);
    setSearchResults(results);
    
    // If no results, get "Did you mean" suggestions
    if (results.length === 0) {
      const suggestions = getDidYouMeanSuggestions(query, currentLanguage, 3);
      setDidYouMeanSuggestions(suggestions);
    } else {
      setDidYouMeanSuggestions([]);
    }
  };

  const handleItemPress = (item: WasteItem) => {
    saveSearchHistory(searchQuery, item);
    // Show detailed information in an alert for now
    Alert.alert(
      item.name,
      `${t('search.categoryLabel')}: ${getCategoryName(item.category)}\n\n${t('search.instructionsLabel')}: ${item.instructions}`,
      [{ text: t('common.ok') }]
    );
  };

  const handleHistoryItemPress = (historyItem: SearchHistoryItem) => {
    setSearchQuery(historyItem.query);
  };

  const getCategoryName = (category: string): string => {
    return getCategoryDisplayName(category, currentLanguage);
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'burnable':
        return Colors.burnable;
      case 'recyclable':
        return Colors.recyclable;
      case 'nonBurnable':
        return Colors.nonBurnable;
      case 'oversized':
        return Colors.oversized;
      default:
        return Colors.primary;
    }
  };

  const renderSearchResult = ({ item }: { item: WasteItem }) => (
    <TouchableOpacity
      style={[
        styles.resultItem,
        { 
          backgroundColor: colorScheme === 'dark' ? colors.surface : colors.surface,
          borderLeftColor: getCategoryColor(item.category)
        }
      ]}
      onPress={() => handleItemPress(item)}
    >
      <ThemedView style={styles.resultContent}>
        <ThemedView style={styles.resultHeader}>
          <ThemedText style={styles.itemIcon}>{item.icon || '📦'}</ThemedText>
          <ThemedView style={styles.itemInfo}>
            <ThemedText style={styles.itemName}>{item.name}</ThemedText>
            <ThemedText style={[styles.itemCategory, { color: getCategoryColor(item.category) }]}>
              {getCategoryName(item.category)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        {item.instructions && (
          <ThemedText style={styles.itemInstructions} numberOfLines={2}>
            {item.instructions}
          </ThemedText>
        )}
      </ThemedView>
      <IconSymbol name="chevron.right" size={16} color={colors.icon} />
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: { item: SearchHistoryItem }) => {
    const date = new Date(item.timestamp);
    const timeString = `${date.getMonth() + 1}/${date.getDate()}`;

    return (
      <TouchableOpacity
        style={[styles.historyItem, { backgroundColor: colorScheme === 'dark' ? colors.surface : colors.surface }]}
        onPress={() => handleHistoryItemPress(item)}
      >
        <IconSymbol name="clock" size={16} color={colors.icon} />
        <ThemedView style={styles.historyContent}>
          <ThemedText style={styles.historyQuery}>{item.query}</ThemedText>
          <ThemedText style={styles.historyTime}>{timeString}</ThemedText>
        </ThemedView>
        {item.result && (
          <ThemedText style={[styles.historyCategory, { color: getCategoryColor(item.result.category) }]}>
            {getCategoryName(item.result.category)}
          </ThemedText>
        )}
      </TouchableOpacity>
    );
  };

  const renderDidYouMean = () => {
    if (didYouMeanSuggestions.length === 0) return null;
    
    return (
      <ThemedView style={styles.didYouMeanContainer}>
        <ThemedText style={styles.didYouMeanTitle}>もしかして:</ThemedText>
        <ThemedView style={styles.suggestionButtons}>
          {didYouMeanSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => setSearchQuery(suggestion)}
            >
              <ThemedText style={styles.suggestionButtonText}>{suggestion}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
    );
  };

  const renderPopularTerms = () => {
    if (popularTerms.length === 0) return null;
    
    return (
      <ThemedView style={styles.popularTermsContainer}>
        <ThemedText style={styles.sectionTitle}>人気の検索ワード</ThemedText>
        <ThemedView style={styles.popularTermsGrid}>
          {popularTerms.map((term, index) => (
            <TouchableOpacity
              key={index}
              style={styles.popularTermButton}
              onPress={() => setSearchQuery(term)}
            >
              <ThemedText style={styles.popularTermText}>{term}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
    );
  };

  const renderEmptyState = () => {
    if (isSearching && searchResults.length === 0) {
      return (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyIcon}>🔍</ThemedText>
          <ThemedText style={styles.emptyTitle}>{t('search.noResults')}</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            {t('search.noResultsSubtitle')}
          </ThemedText>
          {renderDidYouMean()}
        </ThemedView>
      );
    }

    if (!isSearching && searchHistory.length === 0) {
      return (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyIcon}>📝</ThemedText>
          <ThemedText style={styles.emptyTitle}>{t('search.emptyHistory')}</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            {t('search.emptyHistorySubtitle')}
          </ThemedText>
          {renderPopularTerms()}
        </ThemedView>
      );
    }

    return null;
  };

  return (
    <ThemedView style={[commonStyles.container, colorScheme === 'dark' ? commonStyles.containerDark : {}]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={[commonStyles.title, colorScheme === 'dark' ? commonStyles.titleDark : {}]}>
          {t('search.title')}
        </ThemedText>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={[
        commonStyles.searchContainer,
        colorScheme === 'dark' ? commonStyles.searchContainerDark : {}
      ]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
        <TextInput
          style={[
            commonStyles.searchInput,
            colorScheme === 'dark' ? commonStyles.searchInputDark : {},
          ]}
          placeholder={t('search.placeholder')}
          placeholderTextColor={colors.icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </ThemedView>

      {/* Results or History */}
      <ThemedView style={styles.content}>
        {isSearching ? (
          <>
            {searchResults.length > 0 && (
              <ThemedText style={styles.sectionTitle}>
                {t('search.results')} ({searchResults.length})
              </ThemedText>
            )}
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
            />
          </>
        ) : (
          <>
            {searchHistory.length > 0 && (
              <ThemedView style={styles.historyHeader}>
                <ThemedText style={styles.sectionTitle}>
                  {t('search.history')}
                </ThemedText>
                <TouchableOpacity onPress={clearSearchHistory}>
                  <ThemedText style={[styles.clearButton, { color: colors.tint }]}>
                    {t('search.clearHistory')}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}
            <FlatList
              data={searchHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => `${item.timestamp}-${index}`}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
            />
          </>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    opacity: 0.8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemInstructions: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
    lineHeight: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  historyContent: {
    flex: 1,
    marginLeft: 12,
  },
  historyQuery: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  historyCategory: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
  didYouMeanContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  didYouMeanTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  suggestionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  suggestionButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  popularTermsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  popularTermsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  popularTermButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  popularTermText: {
    fontSize: 12,
    color: '#666',
  },
});