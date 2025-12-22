import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function PageIndex({ currentIndex, totalSteps }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              index === currentIndex && styles.stepCircleActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                index === currentIndex && styles.stepNumberActive,
              ]}
            >
              {String(index + 1).padStart(2, '0')}
            </Text>
          </View>
          {index < totalSteps - 1 && (
            <View
              style={[
                styles.separator,
                index < currentIndex && styles.separatorActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  stepNumberActive: {
    color: Colors.buttonText,
  },
  separator: {
    width: 32,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  separatorActive: {
    backgroundColor: Colors.primary,
  },
});

