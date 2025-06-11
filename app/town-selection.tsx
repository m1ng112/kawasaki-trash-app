import React, { useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalizationContext } from '@/contexts/LocalizationContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { kawasakiWardTownMap } from '@/data/wardTownMapComplete';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TownSelectionScreen() {
  const router = useRouter();
  const { ward } = useLocalSearchParams<{ ward: string }>();
  const context = useContext(LocalizationContext);
  const language = context?.language || 'ja';
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const primaryColor = useThemeColor({}, 'tint');

  const towns = kawasakiWardTownMap[ward as keyof typeof kawasakiWardTownMap] || [];
  const filteredTowns = towns.filter(town => 
    town.toLowerCase().includes(searchText.toLowerCase())
  );

  // For now, we'll create areas for each town with sample schedules
  // In a real app, this would come from a comprehensive database
  const handleTownSelect = async (town: string) => {
    setLoading(true);
    try {
      // Create a unique area ID based on ward and town
      const areaId = `${ward}-${town}`;
      
      // Save both ward and area to storage
      await AsyncStorage.setItem('selectedWard', ward);
      await AsyncStorage.setItem('selectedAreaId', areaId);
      await AsyncStorage.setItem('selectedTown', town);
      
      // Mark onboarding as completed
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      await AsyncStorage.setItem('onboardingStep', 'completed');
      
      // Schedule notifications for the selected area
      const { NotificationService } = await import('@/services/notificationService');
      await NotificationService.updateNotificationsForUserArea();
      
      // Navigate to home
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving town selection:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    ja: {
      title: '町を選択',
      searchPlaceholder: '町名を検索...',
      back: '戻る',
      wardPrefix: 'の町',
    },
    en: {
      title: 'Select Town',
      searchPlaceholder: 'Search town...',
      back: 'Back',
      wardPrefix: ' Towns',
    },
    zh: {
      title: '选择町',
      searchPlaceholder: '搜索町名...',
      back: '返回',
      wardPrefix: '的町',
    },
    ko: {
      title: '마을 선택',
      searchPlaceholder: '마을 검색...',
      back: '뒤로',
      wardPrefix: '의 마을',
    },
  };

  const t = translations[language as keyof typeof translations];

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
          <ThemedText style={styles.backText}>{t.back}</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>{t.title}</ThemedText>
        <ThemedText style={styles.subtitle}>
          {ward}{language === 'ja' || language === 'zh' ? t.wardPrefix : t.wardPrefix}
        </ThemedText>
      </ThemedView>

      <View style={[styles.searchContainer, { borderColor }]}>
        <Ionicons name="search" size={20} color={borderColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={borderColor}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.townGrid}>
          {filteredTowns.map((town) => (
            <TouchableOpacity
              key={town}
              style={[styles.townCard, { borderColor }]}
              onPress={() => handleTownSelect(town)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.townName}>{town}</ThemedText>
              <Ionicons name="chevron-forward" size={20} color={borderColor} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  townGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  townCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  townName: {
    fontSize: 16,
    fontWeight: '500',
  },
});