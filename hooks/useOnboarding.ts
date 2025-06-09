import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type OnboardingStep = 'language' | 'location' | 'completed';

export function useOnboarding() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('language');

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const [onboardingStatus, step, language, district] = await Promise.all([
        AsyncStorage.getItem('hasCompletedOnboarding'),
        AsyncStorage.getItem('onboardingStep'),
        AsyncStorage.getItem('selectedLanguage'),
        AsyncStorage.getItem('selectedDistrict'),
      ]);
      
      const completed = onboardingStatus === 'true';
      setHasCompletedOnboarding(completed);
      
      if (!completed) {
        // Determine which step to navigate to
        if (!language) {
          setCurrentStep('language');
          router.replace('/language-selection');
        } else if (!district || step === 'location') {
          setCurrentStep('location');
          router.replace('/district-selection');
        } else {
          // If we have both but onboarding isn't marked complete, mark it complete
          await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
          await AsyncStorage.setItem('onboardingStep', 'completed');
          setHasCompletedOnboarding(true);
        }
      } else {
        setCurrentStep('completed');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // If there's an error, start from the beginning
      setCurrentStep('language');
      router.replace('/language-selection');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, hasCompletedOnboarding, currentStep };
}