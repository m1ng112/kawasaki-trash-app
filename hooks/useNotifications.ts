import { useState, useEffect } from 'react';
import { NotificationService, NotificationSettings } from '@/services/notificationService';
import { useLocalization } from '@/contexts/LocalizationContext';

export function useNotifications() {
  const { language } = useLocalization();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      setLoading(true);
      
      // Initialize notification service
      await NotificationService.initialize();
      
      // Load current settings
      const currentSettings = await NotificationService.getSettings();
      setSettings(currentSettings);
      
      // Check permission status
      const hasPermission = await NotificationService.requestPermissions();
      setPermissionGranted(hasPermission);
      
    } catch (error) {
      console.error('Error initializing notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      await NotificationService.saveSettings(newSettings);
      const updatedSettings = await NotificationService.getSettings();
      setSettings(updatedSettings);
      
      // Update scheduled notifications
      if (updatedSettings.enabled && permissionGranted) {
        await NotificationService.updateNotificationsForUserArea();
      } else {
        await NotificationService.cancelAllNotifications();
      }
      
      return true;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const granted = await NotificationService.requestPermissions();
      setPermissionGranted(granted);
      
      if (granted && settings?.enabled) {
        await NotificationService.updateNotificationsForUserArea();
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const scheduleNotifications = async () => {
    if (permissionGranted && settings?.enabled) {
      await NotificationService.updateNotificationsForUserArea();
    }
  };

  const cancelAllNotifications = async () => {
    await NotificationService.cancelAllNotifications();
  };

  const getScheduledNotifications = async () => {
    return await NotificationService.getScheduledNotifications();
  };

  return {
    settings,
    permissionGranted,
    loading,
    updateSettings,
    requestPermissions,
    scheduleNotifications,
    cancelAllNotifications,
    getScheduledNotifications,
  };
}