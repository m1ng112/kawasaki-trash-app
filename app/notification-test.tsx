import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationService } from '@/services/notificationService';
import * as Notifications from 'expo-notifications';

export default function NotificationTestScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { settings, permissionGranted, requestPermissions } = useNotifications();
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    loadScheduledCount();
  }, []);

  const loadScheduledCount = async () => {
    const scheduled = await NotificationService.getScheduledNotifications();
    setScheduledCount(scheduled.length);
  };

  const handleTestNotification = async () => {
    if (!permissionGranted) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert('Error', 'Notification permission required');
        return;
      }
    }

    // Schedule a test notification in 5 seconds
    const testDate = new Date();
    testDate.setSeconds(testDate.getSeconds() + 5);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'テスト通知',
        body: '通知機能が正常に動作しています！',
      },
      trigger: testDate,
    });

    Alert.alert('Success', 'Test notification scheduled for 5 seconds from now');
  };

  const handleScheduleNotifications = async () => {
    if (!permissionGranted) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert('Error', 'Notification permission required');
        return;
      }
    }

    await NotificationService.updateNotificationsForUserArea();
    await loadScheduledCount();
    Alert.alert('Success', 'Notifications scheduled for your area');
  };

  const handleCancelAll = async () => {
    await NotificationService.cancelAllNotifications();
    await loadScheduledCount();
    Alert.alert('Success', 'All notifications cancelled');
  };

  const handleViewScheduled = async () => {
    const scheduled = await NotificationService.getScheduledNotifications();
    const titles = scheduled.map(n => n.content.title).join('\n');
    Alert.alert(
      `Scheduled Notifications (${scheduled.length})`,
      titles || 'No notifications scheduled'
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Notification Test</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>Status</ThemedText>
          <ThemedText style={styles.infoText}>
            Permission: {permissionGranted ? '✅ Granted' : '❌ Not granted'}
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Notifications enabled: {settings?.enabled ? '✅ Yes' : '❌ No'}
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Scheduled notifications: {scheduledCount}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={handleTestNotification}
        >
          <ThemedText style={styles.buttonText}>Send Test Notification (5s)</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={handleScheduleNotifications}
        >
          <ThemedText style={styles.buttonText}>Schedule Area Notifications</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF9800' }]}
          onPress={handleViewScheduled}
        >
          <ThemedText style={styles.buttonText}>View Scheduled</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#F44336' }]}
          onPress={handleCancelAll}
        >
          <ThemedText style={styles.buttonText}>Cancel All</ThemedText>
        </TouchableOpacity>
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
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});