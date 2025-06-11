import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Platform } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { commonStyles } from '@/styles/common';
import { kawasakiAreas } from '@/data/areas';
import { getAreaScheduleData } from '@/data/scheduleData';
import { getCollectionTypes } from '@/data/scheduleCalculator';
import { isHoliday, getHoliday } from '@/data/holidays';
import { getCategoryDisplayName } from '@/data/categoryHelper';
import type { Area, WasteCategory } from '@/types';

// Calendar localization setup
LocaleConfig.locales['ja'] = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
  today: '今日',
};

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};

export default function CalendarScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme ?? 'light'];
  const { t, language } = useLocalization();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Set calendar locale based on selected language
    LocaleConfig.defaultLocale = language === 'en' ? 'en' : 'ja';
    loadUserArea();
  }, [language]);

  useEffect(() => {
    if (selectedArea) {
      generateMarkedDates();
    }
  }, [selectedArea]);

  const loadUserArea = async () => {
    try {
      // First try to load by specific area ID (for new town selection flow)
      const savedAreaId = await AsyncStorage.getItem('selectedAreaId');
      const savedTown = await AsyncStorage.getItem('selectedTown');
      
      if (savedAreaId && savedTown) {
        // Try to find the specific area from schedule data first
        const scheduleArea = getAreaScheduleData(savedAreaId);
        if (scheduleArea) {
          setSelectedArea(scheduleArea);
          return;
        }
      }
      
      // Fallback to old ward-based selection for backward compatibility
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

  const generateMarkedDates = () => {
    if (!selectedArea) return;

    const marked: any = {};
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // Generate 3 months ahead

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];

      // Check if it's a holiday
      if (isHoliday(dateString)) {
        const holiday = getHoliday(dateString);
        marked[dateString] = {
          marked: true,
          dotColor: '#FF6B6B',
          customStyles: {
            container: {
              backgroundColor: '#FF6B6B20',
            },
            text: {
              color: '#FF6B6B',
              fontWeight: 'bold',
            },
          },
          holiday: holiday?.name || '',
        };
      } else {
        // Use new schedule calculation logic
        const collectionTypes = getCollectionTypes(currentDate, selectedArea);

        if (collectionTypes.length > 0) {
          const primaryType = collectionTypes[0];
          const color = getWasteCategoryColor(primaryType);
          
          marked[dateString] = {
            marked: true,
            dotColor: color,
            customStyles: {
              container: {
                backgroundColor: color + '20',
              },
              text: {
                color: color,
                fontWeight: 'bold',
              },
            },
            types: collectionTypes,
          };
        }
      }

      // Highlight today
      if (dateString === today) {
        marked[dateString] = {
          ...marked[dateString],
          selected: true,
          selectedColor: colors.tint,
        };
      }

      // Highlight selected date
      if (dateString === selectedDate) {
        marked[dateString] = {
          ...marked[dateString],
          selected: true,
          selectedColor: colors.tint + '80',
        };
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setMarkedDates(marked);
  };

  const getWasteCategoryColor = (category: WasteCategory): string => {
    switch (category) {
      case 'normalGarbage':      // 普通ゴミ (燃やすゴミ)
        return Colors.normalGarbage;
      case 'cansBottles':        // 空き缶・ペットボトル
        return Colors.cansBottles;
      case 'glassBottles':       // 空きびん
        return Colors.glassBottles;
      case 'usedBatteries':      // 使用済み乾電池
        return Colors.usedBatteries;
      case 'mixedPaper':         // ミックスペーパー
        return Colors.mixedPaper;
      case 'plasticPackaging':   // プラスチック製容器包装
        return Colors.plasticPackaging;
      case 'smallMetal':         // 小物金属
        return Colors.smallMetal;
      case 'oversizedWaste':     // 粗大ごみ (normally not displayed)
        return Colors.oversizedWaste;
      // Keep old categories for backward compatibility
      case 'burnable':
        return Colors.burnable;
      case 'recyclable':
        return Colors.recyclable;
      case 'nonBurnable':
        return Colors.nonBurnable;
      case 'oversized':
        return Colors.oversized;
      default:
        return colors.tint;
    }
  };

  const getWasteCategoryName = (category: WasteCategory): string => {
    return getCategoryDisplayName(category, language);
  };

  const renderSelectedDateInfo = () => {
    if (!selectedDate) {
      return (
        <ThemedView style={[commonStyles.card, colorScheme === 'dark' ? commonStyles.cardDark : {}]}>
          <ThemedText style={styles.infoText}>
            {language === 'ja' ? '日付を選択してください' : 'Select a date to see collection info'}
          </ThemedText>
        </ThemedView>
      );
    }

    const dateInfo = markedDates[selectedDate];
    const selectedDateObj = new Date(selectedDate);
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][selectedDateObj.getDay()];
    
    // Get collection types for the selected date
    const collectionTypes = selectedArea ? getCollectionTypes(selectedDateObj, selectedArea) : [];

    if (!dateInfo || (collectionTypes.length === 0 && !dateInfo.holiday)) {
      return (
        <ThemedView style={[commonStyles.card, colorScheme === 'dark' ? commonStyles.cardDark : {}]}>
          <ThemedText style={styles.dateHeader}>
            {selectedDateObj.getMonth() + 1}月{selectedDateObj.getDate()}日（{dayOfWeek}）
          </ThemedText>
          <ThemedText style={styles.infoText}>{t('home.noCollection')}</ThemedText>
        </ThemedView>
      );
    }

    if (dateInfo.holiday) {
      return (
        <ThemedView style={[
          commonStyles.card,
          colorScheme === 'dark' ? commonStyles.cardDark : {},
          { borderLeftWidth: 6, borderLeftColor: '#FF6B6B' }
        ]}>
          <ThemedText style={styles.dateHeader}>
            {selectedDateObj.getMonth() + 1}月{selectedDateObj.getDate()}日（{dayOfWeek}）
          </ThemedText>
          <ThemedText style={[styles.wasteType, { color: '#FF6B6B' }]}>
            {dateInfo.holiday}
          </ThemedText>
          <ThemedText style={styles.infoText}>
            {language === 'ja' ? 'ごみ収集はお休みです' : 'No waste collection on this holiday'}
          </ThemedText>
        </ThemedView>
      );
    }

    if (collectionTypes.length > 0) {
      const primaryColor = getWasteCategoryColor(collectionTypes[0]);
      
      return (
        <ThemedView style={[
          commonStyles.card,
          colorScheme === 'dark' ? commonStyles.cardDark : {},
          { borderLeftWidth: 6, borderLeftColor: primaryColor }
        ]}>
          <ThemedText style={styles.dateHeader}>
            {selectedDateObj.getMonth() + 1}月{selectedDateObj.getDate()}日（{dayOfWeek}）
          </ThemedText>
          <ThemedText style={[styles.wasteType, { color: primaryColor }]}>
            {collectionTypes.map((type: WasteCategory) => getWasteCategoryName(type)).join(' • ')}
          </ThemedText>
          <ThemedText style={styles.infoText}>
            {language === 'ja' ? '朝8時までに指定場所に出してください' : 'Put out waste by 8:00 AM at designated location'}
          </ThemedText>
        </ThemedView>
      );
    }

    return null;
  };

  const renderLegend = () => {
    return (
      <ThemedView style={[commonStyles.card, colorScheme === 'dark' ? commonStyles.cardDark : {}]}>
        <ThemedText style={[commonStyles.subtitle, colorScheme === 'dark' ? commonStyles.subtitleDark : {}]}>
          {language === 'ja' ? '凡例' : 'Legend'}
        </ThemedText>
        <ThemedView style={styles.legendItems}>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: Colors.burnable }]} />
            <ThemedText style={styles.legendText}>{t('waste.burnable')}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: Colors.recyclable }]} />
            <ThemedText style={styles.legendText}>{t('waste.recyclable')}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: Colors.nonBurnable }]} />
            <ThemedText style={styles.legendText}>{t('waste.nonBurnable')}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
            <ThemedText style={styles.legendText}>
              {language === 'ja' ? '祝日' : 'Holiday'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <ScrollView 
      style={[commonStyles.container, colorScheme === 'dark' ? commonStyles.containerDark : {}]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={[commonStyles.title, colorScheme === 'dark' ? commonStyles.titleDark : {}]}>
          {t('calendar.title')}
        </ThemedText>
        {selectedArea && (
          <ThemedText style={[commonStyles.textSecondary, colorScheme === 'dark' ? commonStyles.textSecondaryDark : {}]}>
            {selectedArea.area}
          </ThemedText>
        )}
      </ThemedView>

      {/* Calendar */}
      <ThemedView style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          markingType={'custom'}
          theme={{
            calendarBackground: colorScheme === 'dark' ? colors.surface : colors.surface,
            textSectionTitleColor: colors.text,
            selectedDayBackgroundColor: colors.tint,
            selectedDayTextColor: '#ffffff',
            todayTextColor: colors.tint,
            dayTextColor: colors.text,
            textDisabledColor: colors.text + '50',
            monthTextColor: colors.text,
            arrowColor: colors.tint,
            indicatorColor: colors.tint,
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
          }}
          style={styles.calendar}
        />
      </ThemedView>

      {/* Selected Date Info */}
      {renderSelectedDateInfo()}

      {/* Legend */}
      {renderLegend()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  calendarContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  calendar: {
    borderRadius: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  wasteType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
  },
  legendItems: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
  },
});