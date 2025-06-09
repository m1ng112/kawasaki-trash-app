import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NotificationService } from '@/services/notificationService';

const DISTRICTS = [
  { id: 'kawasaki', name: '川崎区', nameEn: 'Kawasaki' },
  { id: 'saiwai', name: '幸区', nameEn: 'Saiwai' },
  { id: 'nakahara', name: '中原区', nameEn: 'Nakahara' },
  { id: 'takatsu', name: '高津区', nameEn: 'Takatsu' },
  { id: 'miyamae', name: '宮前区', nameEn: 'Miyamae' },
  { id: 'tama', name: '多摩区', nameEn: 'Tama' },
  { id: 'asao', name: '麻生区', nameEn: 'Asao' },
];

export default function DistrictSelectionScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme ?? 'light'];

  const handleSelectDistrict = async (districtId: string) => {
    try {
      // Save both keys for compatibility
      await AsyncStorage.setItem('selectedWard', districtId);
      await AsyncStorage.setItem('selectedDistrict', districtId);
      
      // Mark onboarding as completed
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      await AsyncStorage.setItem('onboardingStep', 'completed');
      
      // Schedule notifications for the selected area
      await NotificationService.updateNotificationsForUserArea();
      
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to save district selection');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>お住まいの地域を選択</ThemedText>
        <ThemedText style={styles.subtitle}>Select your district</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {DISTRICTS.map((district) => (
          <TouchableOpacity
            key={district.id}
            style={[
              styles.districtCard,
              {
                backgroundColor: colorScheme === 'dark' ? colors.surface : colors.surface,
                borderColor: colorScheme === 'dark' ? colors.border : '#00000010',
              },
            ]}
            onPress={() => handleSelectDistrict(district.id)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.districtName}>{district.name}</ThemedText>
            <ThemedText style={styles.districtNameEn}>{district.nameEn}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  districtCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  districtName: {
    fontSize: 18,
    fontWeight: '600',
  },
  districtNameEn: {
    fontSize: 14,
    opacity: 0.6,
  },
});