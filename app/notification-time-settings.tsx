import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Platform,
  View,
  Switch
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { NotificationService } from '@/services/notificationService';
import type { NotificationSettings } from '@/services/notificationService';

export default function NotificationTimeSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useLocalization();
  
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [showEveningPicker, setShowEveningPicker] = useState(false);
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [eveningTime, setEveningTime] = useState(new Date());
  const [morningTime, setMorningTime] = useState(new Date());

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const notificationSettings = await NotificationService.getSettings();
    setSettings(notificationSettings);
    
    // Set initial time picker values
    const evening = new Date();
    evening.setHours(notificationSettings.eveningTime.hour);
    evening.setMinutes(notificationSettings.eveningTime.minute);
    evening.setSeconds(0);
    setEveningTime(evening);
    
    const morning = new Date();
    morning.setHours(notificationSettings.morningTime.hour);
    morning.setMinutes(notificationSettings.morningTime.minute);
    morning.setSeconds(0);
    setMorningTime(morning);
  };

  const formatTime = (hour: number, minute: number): string => {
    const time = new Date();
    time.setHours(hour);
    time.setMinutes(minute);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleEveningTimeChange = (event: any, selectedDate?: Date) => {
    setShowEveningPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEveningTime(selectedDate);
      if (Platform.OS === 'android') {
        saveEveningTime(selectedDate);
      }
    }
  };

  const handleMorningTimeChange = (event: any, selectedDate?: Date) => {
    setShowMorningPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setMorningTime(selectedDate);
      if (Platform.OS === 'android') {
        saveMorningTime(selectedDate);
      }
    }
  };

  const saveEveningTime = async (time: Date) => {
    if (!settings) return;
    
    const newSettings = {
      ...settings,
      eveningTime: {
        hour: time.getHours(),
        minute: time.getMinutes()
      }
    };
    
    await NotificationService.saveSettings(newSettings);
    await NotificationService.updateNotificationsForUserArea();
    setSettings(newSettings);
    
    Alert.alert(
      t('settings.saved'),
      t('notification.eveningTimeUpdated'),
      [{ text: t('common.ok') }]
    );
  };

  const saveMorningTime = async (time: Date) => {
    if (!settings) return;
    
    const newSettings = {
      ...settings,
      morningTime: {
        hour: time.getHours(),
        minute: time.getMinutes()
      }
    };
    
    await NotificationService.saveSettings(newSettings);
    await NotificationService.updateNotificationsForUserArea();
    setSettings(newSettings);
    
    Alert.alert(
      t('settings.saved'),
      t('notification.morningTimeUpdated'),
      [{ text: t('common.ok') }]
    );
  };

  if (!settings) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: t('notification.timeSettings'),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingHorizontal: Platform.OS === 'ios' ? 0 : 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.tint} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.description}>
            {t('notification.timeSettingsDescription')}
          </ThemedText>

          {/* Evening Notification */}
          <ThemedView style={[styles.section, { backgroundColor: colors.surface }]}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedView style={styles.sectionTitleRow}>
                <ThemedView style={styles.sectionTitleContainer}>
                  <ThemedText style={styles.sectionTitle}>
                    {t('notification.eveningNotification')}
                  </ThemedText>
                  <ThemedText style={styles.sectionSubtitle}>
                    {t('notification.eveningDescription')}
                  </ThemedText>
                </ThemedView>
                <Switch
                  value={settings.eveningEnabled}
                  onValueChange={async (value) => {
                    const newSettings = { ...settings, eveningEnabled: value };
                    await NotificationService.saveSettings(newSettings);
                    await NotificationService.updateNotificationsForUserArea();
                    setSettings(newSettings);
                  }}
                  trackColor={{ false: colors.border, true: colors.tint + '40' }}
                  thumbColor={settings.eveningEnabled ? colors.tint : colors.icon}
                />
              </ThemedView>
            </ThemedView>
            
            {settings.eveningEnabled && (
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    setShowEveningPicker(!showEveningPicker);
                  } else {
                    setShowEveningPicker(true);
                  }
                }}
              >
                <ThemedText style={styles.timeLabel}>
                  {t('notification.time')}
                </ThemedText>
                <ThemedText style={[styles.timeValue, { color: colors.tint }]}>
                  {formatTime(settings.eveningTime.hour, settings.eveningTime.minute)}
                </ThemedText>
                <Ionicons name="chevron-forward" size={20} color={colors.icon} />
              </TouchableOpacity>
            )}
            
            {showEveningPicker && settings.eveningEnabled && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={eveningTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleEveningTimeChange}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: colors.tint }]}
                    onPress={() => {
                      setShowEveningPicker(false);
                      saveEveningTime(eveningTime);
                    }}
                  >
                    <ThemedText style={styles.saveButtonText}>
                      {t('common.save')}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ThemedView>

          {/* Morning Notification */}
          <ThemedView style={[styles.section, { backgroundColor: colors.surface }]}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedView style={styles.sectionTitleRow}>
                <ThemedView style={styles.sectionTitleContainer}>
                  <ThemedText style={styles.sectionTitle}>
                    {t('notification.morningNotification')}
                  </ThemedText>
                  <ThemedText style={styles.sectionSubtitle}>
                    {t('notification.morningDescription')}
                  </ThemedText>
                </ThemedView>
                <Switch
                  value={settings.morningEnabled}
                  onValueChange={async (value) => {
                    const newSettings = { ...settings, morningEnabled: value };
                    await NotificationService.saveSettings(newSettings);
                    await NotificationService.updateNotificationsForUserArea();
                    setSettings(newSettings);
                  }}
                  trackColor={{ false: colors.border, true: colors.tint + '40' }}
                  thumbColor={settings.morningEnabled ? colors.tint : colors.icon}
                />
              </ThemedView>
            </ThemedView>
            
            {settings.morningEnabled && (
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    setShowMorningPicker(!showMorningPicker);
                  } else {
                    setShowMorningPicker(true);
                  }
                }}
              >
                <ThemedText style={styles.timeLabel}>
                  {t('notification.time')}
                </ThemedText>
                <ThemedText style={[styles.timeValue, { color: colors.tint }]}>
                  {formatTime(settings.morningTime.hour, settings.morningTime.minute)}
                </ThemedText>
                <Ionicons name="chevron-forward" size={20} color={colors.icon} />
              </TouchableOpacity>
            )}
            
            {showMorningPicker && settings.morningEnabled && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={morningTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleMorningTimeChange}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: colors.tint }]}
                    onPress={() => {
                      setShowMorningPicker(false);
                      saveMorningTime(morningTime);
                    }}
                  >
                    <ThemedText style={styles.saveButtonText}>
                      {t('common.save')}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ThemedView>

          <ThemedView style={styles.info}>
            <Ionicons name="information-circle" size={20} color={colors.icon} />
            <ThemedText style={styles.infoText}>
              {t('notification.timeSettingsInfo')}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.8,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  timeLabel: {
    flex: 1,
    fontSize: 16,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  pickerContainer: {
    marginTop: 12,
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    flexDirection: 'row',
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
});