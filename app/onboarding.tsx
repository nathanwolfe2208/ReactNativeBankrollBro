import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ONBOARDING_SCREENS = [
  {
    title: 'Track Your Sessions',
    description: 'Record your poker sessions with details like buy-in, cash-out, location, and more.',
    image: require('../assets/images/tracking.png'),
  },
  {
    title: 'Analyze Your Results',
    description: 'Get insights into your performance with detailed statistics and charts.',
    image: require('../assets/images/analytics.png'),
  },
  {
    title: 'Improve Your Game',
    description: 'Make data-driven decisions to improve your poker profitability.',
    image: require('../assets/images/improvement.png'),
  },
];

export default function OnboardingScreen() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = useCallback(async () => {
    if (currentScreen < ONBOARDING_SCREENS.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      await completeOnboarding();
    }
  }, [currentScreen]);

  const handleSkip = useCallback(async () => {
    await completeOnboarding();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace('/login');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const screen = ONBOARDING_SCREENS[currentScreen];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {!imagesLoaded && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2f95dc" />
        </View>
      )}
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image 
          source={screen.image} 
          style={styles.image} 
          resizeMode="contain"
          onLoad={() => setImagesLoaded(true)}
        />
        <Text style={styles.title}>{screen.title}</Text>
        <Text style={styles.description}>{screen.description}</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.indicators}>
          {ONBOARDING_SCREENS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentScreen && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentScreen === ONBOARDING_SCREENS.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    padding: 32,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#2f95dc',
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
