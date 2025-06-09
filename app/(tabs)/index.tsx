import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Platform, 
  View,
  Dimensions,
  StatusBar 
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { kawasakiAreas } from '@/data/areas';
import { getCategoryDisplayName } from '@/data/categoryHelper';
import type { Area, WasteCategory, CollectionInfo } from '@/types';

const { width } = Dimensions.get('window');

// カラーパレット
const colors = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  warning: '#FF9800',
  accent: '#9C27B0',
  danger: '#F44336',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  burnable: '#4CAF50',
  recyclable: '#2196F3',
  nonBurnable: '#FF9800',
  oversized: '#9C27B0',
};

interface MenuItemType {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { t, language } = useLocalization();
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [todayCollection, setTodayCollection] = useState<CollectionInfo | null>(null);
  const [nextCollection, setNextCollection] = useState<CollectionInfo | null>(null);

  // アニメーション用の値
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserArea();
    startAnimations();
  }, []);

  useEffect(() => {
    if (selectedArea) {
      calculateCollectionInfo();
    }
  }, [selectedArea]);

  const startAnimations = () => {
    // フェードインアニメーション
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // パルスアニメーション
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadUserArea = async () => {
    try {
      const savedWard = await AsyncStorage.getItem('selectedWard');
      if (savedWard) {
        const areas = kawasakiAreas.filter(area => area.ward === savedWard);
        if (areas.length > 0) {
          setSelectedArea(areas[0]);
        }
      }
    } catch (error) {
      console.error('Error loading user area:', error);
    }
  };

  const calculateCollectionInfo = () => {
    if (!selectedArea) return;

    const today = new Date();
    const todayDay = today.getDay();
    
    // Check today's collection
    const todayTypes: WasteCategory[] = [];
    if (selectedArea.schedule.burnable.includes(todayDay)) {
      todayTypes.push('burnable');
    }
    if (selectedArea.schedule.recyclable.includes(todayDay)) {
      todayTypes.push('recyclable');
    }
    if (selectedArea.schedule.nonBurnable.includes(todayDay)) {
      todayTypes.push('nonBurnable');
    }

    if (todayTypes.length > 0) {
      setTodayCollection({
        date: today.toISOString().split('T')[0],
        types: todayTypes,
      });
    }

    // Calculate next collection
    let nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 1);
    
    for (let i = 1; i <= 7; i++) {
      const checkDay = nextDate.getDay();
      const nextTypes: WasteCategory[] = [];
      
      if (selectedArea.schedule.burnable.includes(checkDay)) {
        nextTypes.push('burnable');
      }
      if (selectedArea.schedule.recyclable.includes(checkDay)) {
        nextTypes.push('recyclable');
      }
      if (selectedArea.schedule.nonBurnable.includes(checkDay)) {
        nextTypes.push('nonBurnable');
      }

      if (nextTypes.length > 0) {
        setNextCollection({
          date: nextDate.toISOString().split('T')[0],
          types: nextTypes,
        });
        break;
      }

      nextDate.setDate(nextDate.getDate() + 1);
    }
  };

  const getWasteCategoryColor = (category: WasteCategory): string => {
    switch (category) {
      case 'burnable':
        return colors.burnable;
      case 'recyclable':
        return colors.recyclable;
      case 'nonBurnable':
        return colors.nonBurnable;
      case 'oversized':
        return colors.oversized;
      default:
        return colors.primary;
    }
  };

  const getWasteCategoryName = (category: WasteCategory): string => {
    return getCategoryDisplayName(category, language);
  };

  const getWasteCategoryIcon = (category: WasteCategory): string => {
    switch (category) {
      case 'burnable':
        return 'flame';
      case 'recyclable':
        return 'recycle';
      case 'nonBurnable':
        return 'trash-bin';
      case 'oversized':
        return 'cube';
      default:
        return 'trash';
    }
  };

  // メニューアイテム
  const menuItems: MenuItemType[] = [
    {
      id: 'calendar',
      title: t('home.calendar'),
      icon: 'calendar',
      color: colors.warning,
      onPress: () => router.push('/(tabs)/calendar'),
    },
    {
      id: 'search',
      title: t('home.search'),
      icon: 'search',
      color: colors.secondary,
      onPress: () => router.push('/(tabs)/search'),
    },
    {
      id: 'settings',
      title: t('home.settings'),
      icon: 'settings',
      color: colors.danger,
      onPress: () => router.push('/(tabs)/settings'),
    },
  ];

  const renderTodayCard = () => {
    if (!todayCollection && !nextCollection) {
      return (
        <Animated.View 
          style={[
            styles.todayCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.todayCardBackground}>
            <View style={[styles.todayIconContainer, { backgroundColor: colors.textSecondary }]}>
              <Ionicons name="calendar-clear" size={40} color={colors.white} />
            </View>
            <ThemedText style={styles.todayTitle}>{t('home.noCollection')}</ThemedText>
            <ThemedText style={styles.todayDescription}>{t('home.tomorrowSchedule')}</ThemedText>
          </View>
        </Animated.View>
      );
    }

    if (todayCollection) {
      const mainType = todayCollection.types[0];
      const categoryColor = getWasteCategoryColor(mainType);
      const categoryIcon = getWasteCategoryIcon(mainType);
      
      return (
        <Animated.View 
          style={[
            styles.todayCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.todayCardBackground}>
            <View style={[styles.todayIconContainer, { backgroundColor: categoryColor }]}>
              <Ionicons name={categoryIcon as any} size={40} color={colors.white} />
            </View>
            <ThemedText style={styles.todayTitle}>{t('home.todayCollection')}</ThemedText>
            <ThemedText style={[styles.todayDescription, { color: categoryColor, fontWeight: '600' }]}>
              {todayCollection.types.map(type => getWasteCategoryName(type)).join(' • ')}
            </ThemedText>
            <ThemedText style={styles.todaySubDescription}>{t('home.collectionInstructions')}</ThemedText>
          </View>
        </Animated.View>
      );
    }

    if (nextCollection) {
      const nextDate = new Date(nextCollection.date);
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][nextDate.getDay()];
      const mainType = nextCollection.types[0];
      const categoryColor = getWasteCategoryColor(mainType);
      const categoryIcon = getWasteCategoryIcon(mainType);
      
      return (
        <Animated.View 
          style={[
            styles.todayCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.todayCardBackground}>
            <View style={[styles.todayIconContainer, { backgroundColor: categoryColor }]}>
              <Ionicons name={categoryIcon as any} size={40} color={colors.white} />
            </View>
            <ThemedText style={styles.todayTitle}>{t('home.nextCollection')}</ThemedText>
            <ThemedText style={styles.todayDescription}>
              {nextDate.getMonth() + 1}月{nextDate.getDate()}日（{dayOfWeek}）
            </ThemedText>
            <ThemedText style={[styles.todaySubDescription, { color: categoryColor, fontWeight: '600' }]}>
              {nextCollection.types.map(type => getWasteCategoryName(type)).join(' • ')}
            </ThemedText>
          </View>
        </Animated.View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* ヘッダー */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>{t('home.title')}</ThemedText>
        {selectedArea && (
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={16} color={colors.white} />
            <ThemedText style={styles.locationText}>{selectedArea.area}</ThemedText>
          </View>
        )}
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 今日のごみ情報カード */}
        {renderTodayCard()}

        {/* メニューグリッド */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={30} color={colors.white} />
              </View>
              <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* お知らせセクション */}
        <View style={styles.noticeSection}>
          <ThemedText style={styles.sectionTitle}>{t('home.sectionTitle')}</ThemedText>
          <View style={styles.noticeCard}>
            <View style={styles.noticeIconContainer}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
            </View>
            <View style={styles.noticeContent}>
              <ThemedText style={styles.noticeTitle}>{t('home.noticeTitle')}</ThemedText>
              <ThemedText style={styles.noticeDescription}>
                {t('home.noticeDescription')}
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 10,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  locationText: {
    color: colors.white,
    fontSize: 14,
    marginLeft: 5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  todayCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  todayCardBackground: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  todayIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  todayDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 5,
  },
  todaySubDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - 45) / 2,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  noticeSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  noticeCard: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  noticeIconContainer: {
    marginRight: 15,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 5,
  },
  noticeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});