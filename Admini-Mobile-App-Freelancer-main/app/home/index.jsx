import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Gradients } from '../../utils/gradients';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/menu/Header';
import Sidebar from '../../components/menu/Sidebar';

export default function FreelancerHomeScreen() {
  const { isAuthenticated, userRole } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Module cards based on the dashboard image
  const moduleCards = [
    { 
      id: 1, 
      title: 'Operation Dashboard', 
      icon: 'settings-outline', 
      color: Colors.primary 
    },
    { 
      id: 2, 
      title: 'Franchise', 
      icon: 'git-network-outline', 
      color: '#10b981' 
    },
    { 
      id: 3, 
      title: 'Main Dashboard', 
      icon: 'bar-chart-outline', 
      color: '#f59e0b' 
    },
    { 
      id: 4, 
      title: 'OnBoarding Forms', 
      icon: 'document-text-outline', 
      color: '#ef4444' 
    },
    { 
      id: 5, 
      title: 'Marketing Management', 
      icon: 'megaphone-outline', 
      color: '#8b5cf6' 
    },
    { 
      id: 6, 
      title: 'Lead Management', 
      icon: 'people-outline', 
      color: '#06b6d4' 
    },
  ];

  if (!isAuthenticated || userRole !== 'freelancer') {
    return null;
  }

  return (
    <LinearGradient
      colors={Gradients.background.colors}
      start={Gradients.background.start}
      end={Gradients.background.end}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      <Header title="All Modules" onMenuPress={() => setSidebarVisible(true)} />
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Modules</Text>
          <View style={styles.cardsGrid}>
            {moduleCards.map((card) => (
              <TouchableOpacity key={card.id} style={styles.moduleCard}>
                <View style={[styles.iconContainer, { backgroundColor: `${card.color}20` }]}>
                  <Ionicons name={card.icon} size={32} color={card.color} />
                </View>
                <Text style={styles.moduleTitle}>{card.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'Barlow-Bold',
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: Colors.textSecondary,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Barlow-Bold',
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  moduleCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});

