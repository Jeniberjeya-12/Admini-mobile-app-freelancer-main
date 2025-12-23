import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, userRole, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && userRole === 'freelancer') {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, userRole, isLoading, router]);

  return null;
}
