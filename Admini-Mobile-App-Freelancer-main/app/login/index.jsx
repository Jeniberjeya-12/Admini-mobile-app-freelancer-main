import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Gradients } from '../../utils/gradients';
import { useAuth } from '../../contexts/AuthContext';

export default function FreelancerLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, userRole } = useAuth();
  const hasNavigatedRef = useRef(false);

  // Redirect if already authenticated as freelancer
  useEffect(() => {
    if (isAuthenticated && userRole === 'freelancer') {
      router.replace('/home');
    }
  }, [isAuthenticated, userRole, router]);

  // Don't render login form if already authenticated
  if (isAuthenticated && userRole === 'freelancer') {
    return null;
  }

  const handleLogin = async () => {
    // Prevent multiple login attempts
    if (isLoggingIn || hasNavigatedRef.current) {
      return;
    }

    setLoginError('');
    if (!username || !password) {
      setLoginError('Please fill in all fields');
      return;
    }

    try {
      setIsLoggingIn(true);
      
      const result = await login(username, password, 'freelancer');
      
      if (result.success) {
        hasNavigatedRef.current = true;
        router.replace('/home');
      } else {
        setLoginError(result.error || 'Login failed');
        setIsLoggingIn(false);
        hasNavigatedRef.current = false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
      setIsLoggingIn(false);
      hasNavigatedRef.current = false;
    }
  };

  return (
    <LinearGradient
      colors={Gradients.background.colors}
      start={Gradients.background.start}
      end={Gradients.background.end}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Image
              source={require('../../assets/icons/auth/logo.svg')}
              style={styles.logoImage}
              contentFit="contain"
            />
            <Text style={styles.title}>Freelancer Login</Text>
            <Text style={styles.subtitle}>Please Sign into your Freelancer Account!</Text>

            <View style={styles.form}>
              {/* Username Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={Colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor={Colors.textLight}
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      setLoginError('');
                    }}
                    autoCapitalize="none"
                    autoComplete="username"
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={Colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.textLight}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setLoginError('');
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {loginError ? (
                <Text style={styles.errorText}>{loginError}</Text>
              ) : null}

              <TouchableOpacity 
                style={[styles.loginButton, isLoggingIn && styles.loginButtonDisabled]} 
                onPress={handleLogin}
                disabled={isLoggingIn}
              >
                <LinearGradient
                  colors={Gradients.primary.colors}
                  start={Gradients.primary.start}
                  end={Gradients.primary.end}
                  style={StyleSheet.absoluteFill}
                  borderRadius={12}
                />
                <Text style={styles.loginButtonText}>
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              <View style={styles.linksContainer}>
                <TouchableOpacity
                  onPress={() => {
                    // TODO: Implement forgot password
                    console.log('Forgot password');
                  }}
                  style={styles.link}
                >
                  <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Barlow-Bold',
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
    color: Colors.textPrimary,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 52,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: Colors.buttonText,
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    fontWeight: '600',
    zIndex: 1,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  link: {
    paddingVertical: 4,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    textDecorationLine: 'underline',
  },
});

