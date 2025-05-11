import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/components/ui/Card';
import { GraduationCap, Book } from 'lucide-react-native';

interface StudentCardProps {
  name: string;
  school: string;
  grade: string;
  imageUrl?: string;
  onPress?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  name,
  school,
  grade,
  imageUrl,
  onPress,
}) => {
  const { colors, colorScheme } = useTheme();
  
  return (
    <Card 
      variant="glass" 
      onPress={onPress} 
      animated 
      style={styles.card}
    >
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={[
                styles.avatar,
                { 
                  borderColor: colors.primary,
                  shadowColor: colors.primary,
                }
              ]}
            />
          ) : (
            <View 
              style={[
                styles.avatarPlaceholder,
                { 
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                }
              ]}
            >
              <Text 
                style={[
                  styles.avatarInitial,
                  { color: colors.secondary }
                ]}
              >
                {name.charAt(0)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text 
            style={[
              styles.name, 
              { color: colors.text }
            ]}
            numberOfLines={1}
          >
            {name}
          </Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <GraduationCap size={16} color={colors.primary} />
              <Text 
                style={[
                  styles.detail, 
                  { color: colors.textSecondary }
                ]}
                numberOfLines={1}
              >
                {school}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Book size={16} color={colors.primary} />
              <Text 
                style={[
                  styles.detail, 
                  { color: colors.textSecondary }
                ]}
              >
                {grade}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  detailsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
    padding: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
});

export default StudentCard;
