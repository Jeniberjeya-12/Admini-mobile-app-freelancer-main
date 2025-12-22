import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export default function PasswordInput({
  value,
  onChangeText,
  placeholder = 'Password',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConstraints, setShowConstraints] = useState(false);

  const checkStrength = (password) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters', met: /.{8,}/.test(password) },
      { regex: /[0-9]/, text: 'At least 1 number', met: /[0-9]/.test(password) },
      {
        regex: /[a-zA-Z]/,
        text: 'At least 1 alphabet letter',
        met: /[a-zA-Z]/.test(password),
      },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: 'At least 1 special character',
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ];

    return requirements;
  };

  const strength = checkStrength(value);
  const strengthScore = strength.filter((req) => req.met).length;

  const getStrengthColor = (score) => {
    if (score === 0) return Colors.border;
    if (score <= 1) return Colors.error;
    if (score <= 2) return '#f59e0b';
    if (score === 3) return '#eab308';
    return Colors.primary;
  };

  const getStrengthText = (score) => {
    if (score === 0) return 'Enter a password';
    if (score <= 2) return 'Weak password';
    if (score === 3) return 'Medium password';
    return 'Strong password';
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={Colors.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isVisible}
          onFocus={() => setShowConstraints(true)}
          onBlur={() => setShowConstraints(false)}
        />
        <TouchableOpacity
          onPress={() => setIsVisible(!isVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {showConstraints && value.length > 0 && (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBarContainer}>
            <View
              style={[
                styles.strengthBar,
                {
                  width: `${(strengthScore / 4) * 100}%`,
                  backgroundColor: getStrengthColor(strengthScore),
                },
              ]}
            />
          </View>
          <Text style={styles.strengthText}>
            {getStrengthText(strengthScore)}. Must contain:
          </Text>
          <View style={styles.requirementsList}>
            {strength.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <Ionicons
                  name={req.met ? 'checkmark-circle' : 'close-circle'}
                  size={16}
                  color={req.met ? Colors.primary : Colors.textLight}
                />
                <Text
                  style={[
                    styles.requirementText,
                    req.met && styles.requirementMet,
                  ]}
                >
                  {req.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingRight: 40,
  },
  eyeIcon: {
    padding: 4,
  },
  strengthContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  requirementMet: {
    color: Colors.primary,
  },
});

