import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  useWindowDimensions,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '@/components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { width } = useWindowDimensions();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Background opacity animation
  const backgroundOpacity = useSharedValue(0);
  
  useEffect(() => {
    backgroundOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });
  
  // Content for onboarding screens
  const pages = [
    {
      title: 'Save for Your Child\'s Education',
      description: 'Create savings plans for school fees and track your progress towards your goals.',
      image: 'https://images.pexels.com/photos/8422137/pexels-photo-8422137.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Pay School Expenses',
      description: 'Easily pay tuition, books, uniforms, and other school-related expenses.',
      image: 'https://images.pexels.com/photos/8402269/pexels-photo-8402269.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Manage Multiple Students',
      description: 'Keep track of all your children\'s education finances in one place.',
      image: 'https://images.pexels.com/photos/5212687/pexels-photo-5212687.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  // Handle page change
  const handleScroll = (event: any) => {
  const offsetX = event.nativeEvent.contentOffset.x;
  const page = Math.round(offsetX / width);
  setCurrentPage(page);
};
  
  
  // Navigate to the next page or to the main app
const handleNext = () => {
  if (currentPage < pages.length - 1) {
    const nextPage = currentPage + 1;
    scrollViewRef.current?.scrollTo({
      x: width * nextPage,
      animated: true,
    });
    setCurrentPage(nextPage);
  } else {
    router.replace('/(tabs)');
  }
};
  
  
  // Skip onboarding and go to main app
  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Background Gradient */}
      <Animated.View style={[styles.backgroundGradient, backgroundStyle]}>
        <LinearGradient
          colors={[colors.primary, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.6 }}
          style={styles.gradient}
        />
      </Animated.View>
      
      {/* Header with Logo/App Name */}
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.delay(300).duration(800).springify()}
      >
        <Text style={[styles.logo, { color: colors.primary }]}>EduSave</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Secure your child's education future
        </Text>
      </Animated.View>
      
      {/* Onboarding Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Platform.OS === 'web' ? undefined : handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        onScrollEndDrag={Platform.OS === 'web' ? handleScroll : undefined}
      >
        {pages.map((page, index) => (
          <View key={index} style={[styles.page, { width }]}>
            <Animated.View 
              style={styles.imageContainer}
              entering={FadeIn.delay(500 + index * 100).duration(800)}
            >
              <Image
                source={{ uri: page.image }}
                style={styles.image}
                resizeMode="cover"
              />
            </Animated.View>
            
            <Animated.Text 
              style={[styles.title, { color: colors.text }]}
              entering={FadeInDown.delay(700 + index * 100).duration(800)}
            >
              {page.title}
            </Animated.Text>
            
            <Animated.Text 
              style={[styles.description, { color: colors.textSecondary }]}
              entering={FadeInDown.delay(900 + index * 100).duration(800)}
            >
              {page.description}
            </Animated.Text>
          </View>
        ))}
      </ScrollView>
      
      {/* Pagination Indicators */}
      <View style={styles.pagination}>
      {pages.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: currentPage === index ? colors.primary : colors.border,
              width: currentPage === index ? 20 : 8,
            },
          ]}
        />
      ))}
      
      </View>
      
      {/* Action Buttons */}
      <Animated.View 
        style={styles.buttonsContainer}
        entering={FadeInDown.delay(1000).duration(800)}
      >
        <Button
          title="Skip"
          variant="ghost"
          onPress={handleSkip}
          style={styles.skipButton}
        />
        
        <Button
          title={currentPage === pages.length - 1 ? "Get Started" : "Next"}
          variant="primary"
          onPress={handleNext}
          style={styles.nextButton}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
  },
  skipButton: {
    width: 100,
  },
  nextButton: {
    width: 150,
  },
});