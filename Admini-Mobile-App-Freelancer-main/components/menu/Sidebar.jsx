import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '../../utils/gradients';
import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ visible, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole } = useAuth();
  const slideAnim = useRef(new Animated.Value(-280)).current; // Start off-screen to the left

  // All menu items
  const allMenuItems = [
    { name: 'Tasks', icon: 'checkmark-circle-outline', route: '/pages/tasks' },
    { name: 'Dashboard', icon: 'grid-outline', route: '/pages/dashboard' },
    { name: 'Users', icon: 'people-outline', route: '/pages/users' },
    { name: 'Reports', icon: 'document-text-outline', route: '/pages/reports' },
    { name: 'Settings', icon: 'settings-outline', route: '/pages/index' },
  ];

  // Filter menu items based on user role
  let menuItems;
  if (userRole === 'freelancer') {
    // Show Home and Settings for freelancer
    menuItems = [
      { name: 'Home', icon: 'home-outline', route: '/home' },
      { name: 'Settings', icon: 'settings-outline', route: '/home/settings' },
      { name: 'Profile', icon: 'person-outline', route: '/home/profile' },
      { name: 'Password', icon: 'lock-closed-outline', route: '/home/password' },
      { name: 'Employee', icon: 'people-outline', route: '/home/employee' },
    ];
  } else if (userRole === 'super_admin') {
    // Show Home and Settings for super admin
    menuItems = [
      { name: 'Home', icon: 'home-outline', route: '/pages/super-admin-home' },
      { name: 'Settings', icon: 'settings-outline', route: '/pages/settings' },
    ];
  } else if (userRole === 'employee') {
    // Show Tasks and Settings for employees
    menuItems = allMenuItems.filter(item => item.name === 'Tasks' || item.name === 'Settings');
  } else {
    // Show all for organisation
    menuItems = allMenuItems;
  }

  const handleNavigation = (route) => {
    router.push(route);
    onClose();
  };

  // Animate sidebar slide from left
  useEffect(() => {
    if (visible) {
      // Slide in from left
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out to left
      Animated.timing(slideAnim, {
        toValue: -280,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const isActive = (route) => {
    if (!pathname) return false;
    
    // Extract the route name from the full route path
    // e.g., '/dashboard' -> 'dashboard', '/tasks' -> 'tasks'
    const routeName = route.replace('/', '');
    const currentPath = String(pathname);
    
    // Check if pathname matches the route
    return currentPath === route || currentPath.includes(route);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.sidebar, 
            { transform: [{ translateX: slideAnim }] }
          ]}
          onStartShouldSetResponder={() => true}
        >
          <LinearGradient
            colors={Gradients.header.colors}
            start={Gradients.header.start}
            end={Gradients.header.end}
            style={styles.sidebarHeader}
          >
            <Text style={styles.sidebarTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.buttonText} />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.menuItems}>
            {menuItems.map((item) => {
              // Show active styling (color change and dot) for all menu items when their route is active
              const active = isActive(item.route);
              
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.menuItem, active && styles.menuItemActive]}
                  onPress={() => handleNavigation(item.route)}
                >
                  <View style={styles.menuItemContent}>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={active ? Colors.primary : Colors.textPrimary}
                    />
                    <Text
                      style={[
                        styles.menuItemText,
                        active && styles.menuItemTextActive,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>
                  {active && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 280,
    height: '100%',
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  sidebarHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: 24,
    fontFamily: 'Barlow-Bold',
    fontWeight: 'bold',
    color: Colors.buttonText,
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.customBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemActive: {
    backgroundColor: Colors.customBlue,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Barlow-Medium',
    color: Colors.textPrimary,
  },
  menuItemTextActive: {
    fontFamily: 'Barlow-SemiBold',
    color: Colors.primary,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});


