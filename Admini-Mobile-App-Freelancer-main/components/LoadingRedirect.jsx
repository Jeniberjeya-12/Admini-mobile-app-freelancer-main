import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function LoadingRedirect({ message = 'Redirecting...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
});

