import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { NotificationService, NotificationSettings } from '../notificationService';
import type { Area } from '@/types';

// Mock dependencies
jest.mock('expo-notifications');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));
jest.mock('@/data/areas', () => ({
  kawasakiAreas: []
}));

describe('NotificationService', () => {
  const mockNotifications = Notifications as jest.Mocked<typeof Notifications>;
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  const mockArea: Area = {
    id: 'test-area',
    name_jp: 'テストエリア',
    name_en: 'Test Area',
    district: 'test-district',
    schedule: {
      normalGarbage: [1, 5],
      cansBottles: [3],
      glassBottles: [2],
      usedBatteries: [2],
      mixedPaper: [4],
      plasticPackaging: [6],
      smallMetal: { weekday: 0, weeks: [1, 3] },
      oversizedWaste: 'reservation',
      // Legacy fields for backward compatibility
      burnable: [1, 5],
      recyclable: [3],
      nonBurnable: [0]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T10:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initialize', () => {
    it('should set up Android notification channel', async () => {
      (Platform as any).OS = 'android';
      
      await NotificationService.initialize();
      
      expect(mockNotifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        'waste-collection',
        {
          name: 'Waste Collection Reminders',
          importance: mockNotifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4CAF50',
        }
      );
    });

    it('should not set up channel on iOS', async () => {
      (Platform as any).OS = 'ios';
      
      await NotificationService.initialize();
      
      expect(mockNotifications.setNotificationChannelAsync).not.toHaveBeenCalled();
    });
  });

  describe('requestPermissions', () => {
    it('should return true when permissions are already granted', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'granted',
        expires: 'never',
        granted: true,
        canAskAgain: true
      });
      
      const result = await NotificationService.requestPermissions();
      
      expect(result).toBe(true);
      expect(mockNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('should request permissions when not granted', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'denied',
        expires: 'never',
        granted: false,
        canAskAgain: true
      });
      mockNotifications.requestPermissionsAsync.mockResolvedValue({
        status: 'granted',
        expires: 'never',
        granted: true,
        canAskAgain: true
      });
      
      const result = await NotificationService.requestPermissions();
      
      expect(result).toBe(true);
      expect(mockNotifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false when permissions are denied', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'denied',
        expires: 'never',
        granted: false,
        canAskAgain: true
      });
      mockNotifications.requestPermissionsAsync.mockResolvedValue({
        status: 'denied',
        expires: 'never',
        granted: false,
        canAskAgain: true
      });
      
      const result = await NotificationService.requestPermissions();
      
      expect(result).toBe(false);
    });
  });

  describe('getSettings', () => {
    it('should return default settings when no saved settings', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      
      const settings = await NotificationService.getSettings();
      
      expect(settings).toEqual({
        enabled: true,
        eveningTime: { hour: 19, minute: 0 },
        morningTime: { hour: 7, minute: 0 },
        enabledTypes: ['burnable', 'recyclable', 'nonBurnable', 'oversized'],
      });
    });

    it('should merge saved settings with defaults', async () => {
      const savedSettings = {
        enabled: false,
        eveningTime: { hour: 20, minute: 30 }
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedSettings));
      
      const settings = await NotificationService.getSettings();
      
      expect(settings).toEqual({
        enabled: false,
        eveningTime: { hour: 20, minute: 30 },
        morningTime: { hour: 7, minute: 0 },
        enabledTypes: ['burnable', 'recyclable', 'nonBurnable', 'oversized'],
      });
    });

    it('should handle errors and return defaults', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const settings = await NotificationService.getSettings();
      
      expect(settings).toEqual({
        enabled: true,
        eveningTime: { hour: 19, minute: 0 },
        morningTime: { hour: 7, minute: 0 },
        enabledTypes: ['burnable', 'recyclable', 'nonBurnable', 'oversized'],
      });
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('saveSettings', () => {
    it('should save partial settings merged with current', async () => {
      const currentSettings = {
        enabled: true,
        eveningTime: { hour: 19, minute: 0 },
        morningTime: { hour: 7, minute: 0 },
        enabledTypes: ['burnable', 'recyclable', 'nonBurnable', 'oversized'],
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(currentSettings));
      
      await NotificationService.saveSettings({ enabled: false });
      
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'notificationSettings',
        JSON.stringify({ ...currentSettings, enabled: false })
      );
    });

    it('should handle save errors gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Save error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await NotificationService.saveSettings({ enabled: false });
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('scheduleNotificationsForArea', () => {
    beforeEach(() => {
      mockAsyncStorage.getItem.mockResolvedValue(null); // Default settings
      mockNotifications.scheduleNotificationAsync.mockResolvedValue('mock-id');
    });

    it('should not schedule notifications when disabled', async () => {
      const disabledSettings = { enabled: false };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(disabledSettings));
      
      await NotificationService.scheduleNotificationsForArea(mockArea);
      
      expect(mockNotifications.cancelAllScheduledNotificationsAsync).not.toHaveBeenCalled();
      expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('should cancel existing notifications before scheduling new ones', async () => {
      await NotificationService.scheduleNotificationsForArea(mockArea);
      
      expect(mockNotifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    });

    it('should schedule evening and morning notifications for collection days', async () => {
      await NotificationService.scheduleNotificationsForArea(mockArea);
      
      // Should schedule notifications for:
      // - Burnable (Monday, Friday)
      // - Recyclable (Wednesday)
      // - NonBurnable (Sunday)
      // Each should get 2 notifications (evening + morning) × 4 weeks
      // But some evening notifications for the current week might be in the past
      
      const calls = mockNotifications.scheduleNotificationAsync.mock.calls.length;
      expect(calls).toBeGreaterThanOrEqual(24); // At least 3 weeks worth
      expect(calls).toBeLessThanOrEqual(32); // At most 4 weeks worth
    });

    it('should not schedule notifications for past dates', async () => {
      // Set current time to late in the day
      jest.setSystemTime(new Date('2024-01-01T23:00:00'));
      
      await NotificationService.scheduleNotificationsForArea(mockArea);
      
      // Some notifications should be skipped because they're in the past
      const calls = mockNotifications.scheduleNotificationAsync.mock.calls;
      calls.forEach(call => {
        const trigger = call[0].trigger as Date;
        expect(trigger.getTime()).toBeGreaterThan(new Date().getTime());
      });
    });

    it('should use correct language for notifications', async () => {
      await NotificationService.scheduleNotificationsForArea(mockArea, 'en');
      
      const calls = mockNotifications.scheduleNotificationAsync.mock.calls;
      expect(calls[0][0].content.title).toBe('Waste Collection Reminder');
      expect(calls[0][0].content.body).toContain('collection day');
    });

    it('should only schedule notifications for enabled types', async () => {
      const settings = {
        enabled: true,
        enabledTypes: ['burnable'] // Only burnable enabled
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(settings));
      
      await NotificationService.scheduleNotificationsForArea(mockArea);
      
      // Should only schedule for burnable (Monday, Friday)
      // 2 days × 2 notifications × 4 weeks = up to 16 total
      // But some might be in the past
      const calls = mockNotifications.scheduleNotificationAsync.mock.calls.length;
      expect(calls).toBeGreaterThanOrEqual(12); // At least 3 weeks
      expect(calls).toBeLessThanOrEqual(16); // At most 4 weeks
    });
  });

  describe('cancelAllNotifications', () => {
    it('should cancel all scheduled notifications', async () => {
      await NotificationService.cancelAllNotifications();
      
      expect(mockNotifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('getScheduledNotifications', () => {
    it('should return all scheduled notifications', async () => {
      const mockNotificationRequests = [
        { identifier: '1', content: { title: 'Test' } },
        { identifier: '2', content: { title: 'Test 2' } }
      ];
      mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue(
        mockNotificationRequests as any
      );
      
      const result = await NotificationService.getScheduledNotifications();
      
      expect(result).toEqual(mockNotificationRequests);
    });
  });

  describe('updateNotificationsForUserArea', () => {
    it('should schedule notifications for saved user area', async () => {
      mockAsyncStorage.getItem.mockImplementation((key) => {
        if (key === 'selectedWard') return Promise.resolve('test-ward');
        if (key === 'selectedLanguage') return Promise.resolve('en');
        if (key === 'notificationSettings') return Promise.resolve(null);
        return Promise.resolve(null);
      });

      // Update the mocked areas data
      const { kawasakiAreas } = require('@/data/areas');
      kawasakiAreas.push({
        ward: 'test-ward',
        ...mockArea
      });

      await NotificationService.updateNotificationsForUserArea();
      
      // Verify notifications were scheduled
      expect(mockNotifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await NotificationService.updateNotificationsForUserArea();
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Private helper methods', () => {
    it('should generate correct notification content in different languages', async () => {
      const languages = ['ja', 'en', 'zh', 'ko'];
      
      for (const lang of languages) {
        await NotificationService.scheduleNotificationsForArea(mockArea, lang);
        
        const calls = mockNotifications.scheduleNotificationAsync.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        
        expect(lastCall.content.title).toBeTruthy();
        expect(lastCall.content.body).toBeTruthy();
        
        mockNotifications.scheduleNotificationAsync.mockClear();
      }
    });

    it('should use Android-specific properties on Android', async () => {
      (Platform as any).OS = 'android';
      
      await NotificationService.scheduleNotificationsForArea(mockArea);
      
      const calls = mockNotifications.scheduleNotificationAsync.mock.calls;
      expect(calls[0][0].content.channelId).toBe('waste-collection');
      expect(calls[0][0].content.icon).toBe('notification_icon');
    });

    it('should not use Android properties on iOS', async () => {
      (Platform as any).OS = 'ios';
      
      await NotificationService.scheduleNotificationsForArea(mockArea);
      
      const calls = mockNotifications.scheduleNotificationAsync.mock.calls;
      expect(calls[0][0].content.channelId).toBeUndefined();
      expect(calls[0][0].content.icon).toBeUndefined();
    });
  });
});