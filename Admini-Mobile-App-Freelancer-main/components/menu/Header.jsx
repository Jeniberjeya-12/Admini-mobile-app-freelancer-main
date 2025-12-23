import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Gradients } from '../../utils/gradients';
import { useAuth } from '../../contexts/AuthContext';

export default function Header({ title, showBackButton = false, onBackPress, onMenuPress }) {
  const { user } = useAuth();
  
  // Get userName for initial
  const userName = user?.name || user?.username || 'User';
  
  // Get first letter of userName for avatar
  const getInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  return (
    <LinearGradient
      colors={Gradients.header.colors}
      start={Gradients.header.start}
      end={Gradients.header.end}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        {showBackButton ? (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color={Colors.buttonText} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Ionicons name="menu" size={24} color={Colors.buttonText} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, (showBackButton || onMenuPress) && styles.headerTitleWithButton]}>{title}</Text>
        <TouchableOpacity style={styles.avatar}>
          <View style={styles.avatarBackground}>
            <Text style={styles.avatarText}>{getInitial()}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 16,
    minHeight: Platform.OS === 'ios' ? 90 : (StatusBar.currentHeight || 0) + 70,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Barlow-Bold',
    fontWeight: 'bold',
    color: Colors.buttonText,
    flex: 1,
    textAlign: 'center',
  },
  headerTitleWithButton: {
    marginLeft: 40,
    textAlign: 'left',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  avatarBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

