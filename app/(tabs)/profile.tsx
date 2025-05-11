import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoadingState } from '@/hooks/useLoadingState';
import apiService from '@/services/apiService';
import Card from '@/components/ui/Card';
import { SkeletonLoader } from '@/components/screens/SkeletonLoader';
import { User, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Sun, MessageSquare, Star, CreditCard, Settings } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { colors, colorScheme, toggleTheme } = useTheme();
  
  // Loading state for user data
  const userData = useLoadingState<any>({ initialLoading: true });
  
  // Load user data
  useEffect(() => {
    userData.execute(() => apiService.getUser());
  }, []);
  
  // Menu items
  const menuItems = [
    {
      id: 'account',
      title: 'Account',
      items: [
        {
          id: 'personal',
          title: 'Personal Information',
          icon: <User size={20} color={colors.primary} />,
        },
        {
          id: 'payment',
          title: 'Payment Methods',
          icon: <CreditCard size={20} color={colors.primary} />,
        },
        {
          id: 'notification',
          title: 'Notifications',
          icon: <Bell size={20} color={colors.primary} />,
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      items: [
        {
          id: 'appearance',
          title: 'Dark Mode',
          icon: colorScheme === 'dark' 
            ? <Moon size={20} color={colors.primary} />
            : <Sun size={20} color={colors.primary} />,
          toggle: true,
          value: colorScheme === 'dark',
          onToggle: toggleTheme,
        },
        {
          id: 'settings',
          title: 'App Settings',
          icon: <Settings size={20} color={colors.primary} />,
        },
      ],
    },
    {
      id: 'support',
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          icon: <HelpCircle size={20} color={colors.primary} />,
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          icon: <MessageSquare size={20} color={colors.primary} />,
        },
        {
          id: 'rate',
          title: 'Rate the App',
          icon: <Star size={20} color={colors.primary} />,
        },
      ],
    },
    {
      id: 'security',
      title: 'Security',
      items: [
        {
          id: 'privacy',
          title: 'Privacy & Security',
          icon: <Shield size={20} color={colors.primary} />,
        },
        {
          id: 'logout',
          title: 'Log Out',
          icon: <LogOut size={20} color={colors.error} />,
          danger: true,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {userData.isLoading ? (
            <View style={styles.profileLoading}>
              <SkeletonLoader 
                width={100} 
                height={100} 
                borderRadius={50} 
              />
              <View style={styles.profileInfoLoading}>
                <SkeletonLoader 
                  width={150} 
                  height={24} 
                  style={styles.margin} 
                />
                <SkeletonLoader 
                  width={180} 
                  height={16} 
                />
              </View>
            </View>
          ) : (
            <Animated.View 
              style={styles.profileContent}
              entering={FadeInDown.duration(800)}
            >
              <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300' }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.name, { color: colors.text }]}>
                  {userData.data?.name || 'User Name'}
                </Text>
                <Text style={[styles.email, { color: colors.textSecondary }]}>
                  {userData.data?.email || 'user@example.com'}
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.editButton, 
                    { backgroundColor: colors.primary }
                  ]}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
        
        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <Animated.View 
            key={section.id}
            style={styles.section}
            entering={FadeInDown.delay(200 + sectionIndex * 100).duration(600)}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            
            <Card>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && [
                      styles.borderBottom,
                      { borderBottomColor: colors.border }
                    ]
                  ]}
                  onPress={item.toggle ? undefined : () => {}}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.iconContainer}>
                      {item.icon}
                    </View>
                    <Text 
                      style={[
                        styles.menuItemText,
                        item.danger && { color: colors.error },
                        { color: item.danger ? colors.error : colors.text }
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ 
                        false: '#D1D1D6', 
                        true: colors.primary + '80' 
                      }}
                      thumbColor={item.value ? colors.primary : '#F4F3F4'}
                    />
                  ) : (
                    <ChevronRight size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </Animated.View>
        ))}
        
        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
  },
  profileLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfoLoading: {
    marginLeft: 16,
  },
  margin: {
    marginBottom: 8,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});