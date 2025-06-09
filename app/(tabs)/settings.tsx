import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Colors } from '@/constants/Colors';
import { commonStyles } from '@/styles/common';
import { wardNames } from '@/data/areas';
import type { Language, Ward } from '@/types';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  value,
  icon,
  onPress,
  rightElement,
  showChevron = true
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { backgroundColor: colorScheme === 'dark' ? colors.surface : colors.surface }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {icon && <ThemedText style={styles.settingIcon}>{icon}</ThemedText>}
      <ThemedView style={styles.settingContent}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
        )}
        {value && (
          <ThemedText style={[styles.settingValue, { color: colors.tint }]}>
            {value}
          </ThemedText>
        )}
      </ThemedView>
      {rightElement}
      {showChevron && onPress && (
        <IconSymbol name="chevron.right" size={16} color={colors.icon} />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme ?? 'light'];
  const { t, language, setLanguage } = useLocalization();
  const { 
    settings: notificationSettings, 
    permissionGranted, 
    updateSettings: updateNotificationSettings,
    requestPermissions 
  } = useNotifications();
  
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [appVersion] = useState('1.0.0');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedWard = await AsyncStorage.getItem('selectedWard');
      if (savedWard) {
        setSelectedWard(savedWard as Ward);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleLanguageChange = () => {
    const languages: { code: Language; name: string }[] = [
      { code: 'ja', name: '日本語' },
      { code: 'en', name: 'English' },
      { code: 'zh', name: '中文' },
      { code: 'ko', name: '한국어' },
    ];

    Alert.alert(
      t('settings.language'),
      t('onboarding.selectLanguage'),
      languages.map(lang => ({
        text: lang.name,
        onPress: () => setLanguage(lang.code),
        style: lang.code === language ? 'destructive' : 'default',
      }))
    );
  };

  const handleAreaChange = () => {
    Alert.alert(
      t('settings.changeArea'),
      t('settings.changeAreaConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.ok'), 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('hasCompletedOnboarding');
              await AsyncStorage.removeItem('selectedWard');
              await AsyncStorage.removeItem('selectedDistrictName');
              router.replace('/language-selection');
            } catch (error) {
              console.error('Error resetting onboarding:', error);
            }
          }
        },
      ]
    );
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (value && !permissionGranted) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          t('settings.notifications'),
          t('notification.permissionDenied'),
          [{ text: t('common.ok') }]
        );
        return;
      }
    }

    const success = await updateNotificationSettings({ enabled: value });
    if (success) {
      Alert.alert(
        t('settings.notifications'),
        value 
          ? t('settings.notificationEnabled') 
          : t('settings.notificationDisabled')
      );
    } else {
      Alert.alert(
        t('common.error'),
        t('settings.notificationError'),
        [{ text: t('common.ok') }]
      );
    }
  };

  const handleAbout = () => {
    Alert.alert(
      t('settings.about'),
      t('settings.aboutMessage').replace('{version}', appVersion),
      [{ text: t('common.ok') }]
    );
  };

  const handleContact = () => {
    Alert.alert(
      t('settings.contact'),
      t('settings.contactMessage'),
      [{ text: t('common.ok') }]
    );
  };

  const getCurrentLanguageName = () => {
    switch (language) {
      case 'ja': return '日本語';
      case 'en': return 'English';
      case 'zh': return '中文';
      case 'ko': return '한국어';
      default: return '日本語';
    }
  };

  const getCurrentWardName = () => {
    if (!selectedWard) return t('settings.unset');
    return wardNames.ja[selectedWard] || selectedWard;
  };

  return (
    <ScrollView 
      style={[commonStyles.container, colorScheme === 'dark' ? commonStyles.containerDark : {}]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={[commonStyles.title, colorScheme === 'dark' ? commonStyles.titleDark : {}]}>
          {t('settings.title')}
        </ThemedText>
      </ThemedView>

      {/* User Settings Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{t('settings.userSettings')}</ThemedText>
        
        <SettingItem
          title={t('settings.language')}
          subtitle={t('settings.languageSubtitle')}
          value={getCurrentLanguageName()}
          icon="🌍"
          onPress={handleLanguageChange}
        />
        
        <SettingItem
          title={t('settings.area')}
          subtitle={t('settings.areaSubtitle')}
          value={getCurrentWardName()}
          icon="🗾"
          onPress={handleAreaChange}
        />
      </ThemedView>

      {/* Notification Settings Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{t('settings.notifications')}</ThemedText>
        
        <SettingItem
          title={t('settings.notificationCollection')}
          subtitle={t('settings.notificationCollectionSubtitle')}
          icon="🔔"
          rightElement={
            <Switch
              value={notificationSettings?.enabled ?? false}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.border, true: colors.tint + '40' }}
              thumbColor={notificationSettings?.enabled ? colors.tint : colors.icon}
            />
          }
          showChevron={false}
        />
        
        {notificationSettings?.enabled && (
          <SettingItem
            title={t('settings.notificationTime')}
            subtitle={t('settings.notificationTimeSubtitle')}
            value={t('settings.notificationTimeValue')}
            icon="⏰"
            onPress={() => Alert.alert(t('settings.notificationTime'), t('settings.notificationTimeMessage'))}
          />
        )}
      </ThemedView>

      {/* App Info Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{t('settings.appInfo')}</ThemedText>
        
        <SettingItem
          title={t('settings.version')}
          subtitle={t('settings.versionSubtitle')}
          value={appVersion}
          icon="📱"
          showChevron={false}
        />
        
        <SettingItem
          title={t('settings.about')}
          subtitle={t('settings.aboutSubtitle')}
          icon="ℹ️"
          onPress={handleAbout}
        />
        
        <SettingItem
          title={t('settings.contact')}
          subtitle={t('settings.contactSubtitle')}
          icon="📧"
          onPress={handleContact}
        />
        
        {__DEV__ && (
          <>
            <SettingItem
              title="Notification Test"
              subtitle="Test notification functionality (Dev only)"
              icon="🧪"
              onPress={() => router.push('/notification-test')}
            />
            <SettingItem
              title="Search Test"
              subtitle="Test multi-language search (Dev only)"
              icon="🔍"
              onPress={() => router.push('/search-test')}
            />
          </>
        )}
      </ThemedView>

      {/* Legal Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{t('settings.legal')}</ThemedText>
        
        <SettingItem
          title={t('settings.terms')}
          subtitle={t('settings.termsSubtitle')}
          icon="📄"
          onPress={() => Alert.alert(t('settings.terms'), t('settings.termsMessage'))}
        />
        
        <SettingItem
          title={t('settings.privacy')}
          subtitle={t('settings.privacySubtitle')}
          icon="🔒"
          onPress={() => Alert.alert(t('settings.privacy'), t('settings.privacyMessage'))}
        />
      </ThemedView>

      {/* Footer */}
      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          {t('settings.appName')}
        </ThemedText>
        <ThemedText style={styles.footerSubtext}>
          {t('settings.footerMessage')}
        </ThemedText>
      </ThemedView>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginHorizontal: 20,
    opacity: 0.8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
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
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    opacity: 0.6,
    lineHeight: 18,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
});