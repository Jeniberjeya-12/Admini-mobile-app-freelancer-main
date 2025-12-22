import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold, Barlow_700Bold } from '@expo-google-fonts/barlow';
import { Platform } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Barlow-Regular': Barlow_400Regular,
    'Barlow-Medium': Barlow_500Medium,
    'Barlow-SemiBold': Barlow_600SemiBold,
    'Barlow-Bold': Barlow_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Set SVG favicon for web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const logoPath = require('../assets/icons/auth/logo.svg');
      const svgUrl = typeof logoPath === 'string' ? logoPath : logoPath.default || logoPath;

      const existingFavicons = document.querySelectorAll("link[rel*='icon']");
      existingFavicons.forEach(favicon => favicon.remove());

      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      link.href = svgUrl;
      document.head.appendChild(link);

      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = svgUrl;
      document.head.appendChild(appleLink);
    }
  }, []);

  const screenOptions = useMemo(() => ({
    headerShown: false,
  }), []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthRedirectHandler />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={screenOptions}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

// Component to handle auth-based redirects for freelancer app
function AuthRedirectHandler() {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated && pathname !== '/' && pathname !== '/login') {
      router.replace('/login');
      return;
    }

    // If authenticated as freelancer, redirect to home
    if (isAuthenticated && userRole === 'freelancer' && (pathname === '/' || pathname === '/login')) {
      router.replace('/home');
      return;
    }

    // If authenticated but not freelancer, redirect to login (wrong app)
    if (isAuthenticated && userRole !== 'freelancer') {
      console.log('Wrong app - user is not a freelancer');
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, pathname, userRole, router]);

  return null;
}

