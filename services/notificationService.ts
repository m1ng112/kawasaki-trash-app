import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { kawasakiAreas } from '@/data/areas';
import type { WasteCategory, Area } from '@/types';

const NOTIFICATION_SETTINGS_KEY = 'notificationSettings';

export interface NotificationSettings {
  enabled: boolean;
  eveningTime: { hour: number; minute: number };
  morningTime: { hour: number; minute: number };
  enabledTypes: WasteCategory[];
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  eveningTime: { hour: 19, minute: 0 }, // 7:00 PM
  morningTime: { hour: 7, minute: 0 },   // 7:00 AM
  enabledTypes: ['burnable', 'recyclable', 'nonBurnable', 'oversized'],
};

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async initialize(): Promise<void> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('waste-collection', {
        name: 'Waste Collection Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
      });
    }
  }

  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  static async getSettings(): Promise<NotificationSettings> {
    try {
      const settingsString = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (settingsString) {
        return { ...defaultSettings, ...JSON.parse(settingsString) };
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
    return defaultSettings;
  }

  static async saveSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  static async scheduleNotificationsForArea(area: Area, language: string = 'ja'): Promise<void> {
    const settings = await this.getSettings();
    
    if (!settings.enabled) {
      return;
    }

    // Cancel existing notifications
    await this.cancelAllNotifications();

    const today = new Date();
    const daysInWeek = 7;
    
    // Schedule notifications for the next 4 weeks
    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < daysInWeek; day++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + (week * 7) + day);
        
        const dayOfWeek = targetDate.getDay();
        const collectionTypes: WasteCategory[] = [];
        
        // Check what types are collected on this day
        if (area.schedule.burnable.includes(dayOfWeek) && settings.enabledTypes.includes('burnable')) {
          collectionTypes.push('burnable');
        }
        if (area.schedule.recyclable.includes(dayOfWeek) && settings.enabledTypes.includes('recyclable')) {
          collectionTypes.push('recyclable');
        }
        if (area.schedule.nonBurnable.includes(dayOfWeek) && settings.enabledTypes.includes('nonBurnable')) {
          collectionTypes.push('nonBurnable');
        }

        if (collectionTypes.length > 0) {
          // Schedule evening notification (day before)
          await this.scheduleNotification({
            date: targetDate,
            types: collectionTypes,
            isEvening: true,
            settings,
            language,
          });

          // Schedule morning notification (collection day)
          await this.scheduleNotification({
            date: targetDate,
            types: collectionTypes,
            isEvening: false,
            settings,
            language,
          });
        }
      }
    }
  }

  private static async scheduleNotification({
    date,
    types,
    isEvening,
    settings,
    language,
  }: {
    date: Date;
    types: WasteCategory[];
    isEvening: boolean;
    settings: NotificationSettings;
    language: string;
  }): Promise<void> {
    const notificationDate = new Date(date);
    
    if (isEvening) {
      // Evening notification (day before)
      notificationDate.setDate(notificationDate.getDate() - 1);
      notificationDate.setHours(settings.eveningTime.hour, settings.eveningTime.minute, 0, 0);
    } else {
      // Morning notification (collection day)
      notificationDate.setHours(settings.morningTime.hour, settings.morningTime.minute, 0, 0);
    }

    // Don't schedule notifications for past dates
    if (notificationDate <= new Date()) {
      return;
    }

    const typeNames = this.getWasteTypeNames(types, language);
    const title = this.getNotificationTitle(language);
    const body = isEvening 
      ? this.getTomorrowMessage(typeNames, language)
      : this.getTodayMessage(typeNames, language);

    const identifier = `waste-${date.getTime()}-${isEvening ? 'evening' : 'morning'}`;

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title,
        body,
        channelId: Platform.OS === 'android' ? 'waste-collection' : undefined,
        icon: Platform.OS === 'android' ? 'notification_icon' : undefined,
      },
      trigger: notificationDate,
    });
  }

  private static getWasteTypeNames(types: WasteCategory[], language: string): string {
    const typeMap = {
      ja: {
        burnable: '燃やすごみ',
        nonBurnable: '燃やさないごみ',
        recyclable: '資源ごみ',
        oversized: '粗大ごみ',
      },
      en: {
        burnable: 'Burnable waste',
        nonBurnable: 'Non-burnable waste',
        recyclable: 'Recyclable waste',
        oversized: 'Oversized waste',
      },
      zh: {
        burnable: '可燃垃圾',
        nonBurnable: '不可燃垃圾',
        recyclable: '可回收垃圾',
        oversized: '大型垃圾',
      },
      ko: {
        burnable: '타는 쓰레기',
        nonBurnable: '타지 않는 쓰레기',
        recyclable: '재활용 쓰레기',
        oversized: '대형 쓰레기',
      },
    };

    const lang = language as keyof typeof typeMap;
    const names = types.map(type => typeMap[lang]?.[type] || typeMap.ja[type]);
    return names.join('・');
  }

  private static getNotificationTitle(language: string): string {
    const titles = {
      ja: 'ごみ収集のお知らせ',
      en: 'Waste Collection Reminder',
      zh: '垃圾收集提醒',
      ko: '쓰레기 수거 알림',
    };
    return titles[language as keyof typeof titles] || titles.ja;
  }

  private static getTomorrowMessage(typeNames: string, language: string): string {
    const messages = {
      ja: `明日は${typeNames}の収集日です`,
      en: `Tomorrow is ${typeNames} collection day`,
      zh: `明天是${typeNames}收集日`,
      ko: `내일은 ${typeNames} 수거일입니다`,
    };
    return messages[language as keyof typeof messages] || messages.ja;
  }

  private static getTodayMessage(typeNames: string, language: string): string {
    const messages = {
      ja: `今日は${typeNames}の収集日です`,
      en: `Today is ${typeNames} collection day`,
      zh: `今天是${typeNames}收集日`,
      ko: `오늘은 ${typeNames} 수거일입니다`,
    };
    return messages[language as keyof typeof messages] || messages.ja;
  }

  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  static async updateNotificationsForUserArea(): Promise<void> {
    try {
      const savedWard = await AsyncStorage.getItem('selectedWard');
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      
      if (savedWard) {
        const areas = kawasakiAreas.filter(area => area.ward === savedWard);
        if (areas.length > 0) {
          await this.scheduleNotificationsForArea(areas[0], savedLanguage || 'ja');
        }
      }
    } catch (error) {
      console.error('Error updating notifications for user area:', error);
    }
  }
}