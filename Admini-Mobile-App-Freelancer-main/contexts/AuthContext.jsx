import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'employee', 'organisation', 'franchise', 'freelancer', or 'super_admin'

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      // Check if we have a stored user session
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userType = userData.user_type || userData.userType || 'employee';
        const normalizedType = userType.toLowerCase();
        const isFreelancer = normalizedType === 'freelancer';
        const isSuperAdmin = normalizedType === 'super_admin' || normalizedType === 'superadmin' || normalizedType === 'super-admin';
        
        // For freelancer and super_admin, they don't use /user endpoint, just restore from storage
        if (isFreelancer || isSuperAdmin) {
          setUser(userData);
          setIsAuthenticated(true);
          const role = isSuperAdmin ? 'super_admin' : 'freelancer';
          setUserRole(role);
          setIsLoading(false);
          return;
        }
        
        // For client/organization, verify token is still valid by calling /user endpoint
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER}`, {
          method: 'GET',
          credentials: 'include', // Include cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
          // Determine user role based on user_type or other fields
          const userType = userData.user_type || userData.userType || 'employee';
          const normalizedType = userType.toLowerCase();
          let role = 'employee';
          
          if (normalizedType === 'organisation' || normalizedType === 'organization' || normalizedType === 'org') {
            role = 'organisation';
          } else if (normalizedType === 'franchise') {
            role = 'franchise';
          } else if (normalizedType === 'freelancer') {
            role = 'freelancer';
          } else if (normalizedType === 'super_admin' || normalizedType === 'superadmin' || normalizedType === 'super-admin') {
            role = 'super_admin';
          }
          
          setUserRole(role);
        } else {
          // Token invalid, clear storage
          await AsyncStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (username, password, expectedRole = null) => {
    // Determine which login endpoint to use based on expected role
    let loginEndpoint = API_ENDPOINTS.LOGIN; // Default: client/organization login
    
    if (expectedRole === 'freelancer') {
      loginEndpoint = API_ENDPOINTS.FREELANCER_LOGIN;
    } else if (expectedRole === 'super_admin' || expectedRole === 'superadmin' || expectedRole === 'super-admin') {
      loginEndpoint = API_ENDPOINTS.SUPERADMIN_LOGIN;
    }
    
    console.log('🔵 [LOGIN] Logging in...', { 
      username: username ? '***' : 'empty',
      expectedRole,
      apiUrl: `${API_BASE_URL}${loginEndpoint}`
    });
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}${loginEndpoint}`, {
        method: 'POST',
        credentials: 'include', // Important: Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('🔵 [LOGIN] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        console.error('Login failed:', response.status, errorData);
        setIsLoading(false);
        return { success: false, error: errorData.error || 'Invalid credentials' };
      }

      const loginResponse = await response.json();
      
      // Handle freelancer login (returns access_token in body, not cookies)
      if (expectedRole === 'freelancer') {
        const accessToken = loginResponse.access_token;
        
        if (!accessToken) {
          setIsLoading(false);
          return { success: false, error: 'No access token received' };
        }

        // Store token in AsyncStorage for future requests
        await AsyncStorage.setItem('access_token', accessToken);
        
        // Create user data object from login response
        const userData = {
          username: username,
          user_type: 'freelancer',
          ...loginResponse
        };
        
        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setUserRole('freelancer');
        
        console.log('✅ [LOGIN] Freelancer login successful');
        setIsLoading(false);
        return { success: true, user: userData };
      }

      // Handle superadmin login (uses cookies like regular login, but /user endpoint might not support it)
      if (expectedRole === 'super_admin' || expectedRole === 'superadmin' || expectedRole === 'super-admin') {
        // Superadmin uses cookies, but /user endpoint might not work
        // Create user data from login response
        const userData = {
          username: username,
          user_type: 'super_admin',
          ...loginResponse
        };
        
        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setUserRole('super_admin');
        
        console.log('✅ [LOGIN] Super admin login successful');
        setIsLoading(false);
        return { success: true, user: userData };
      }

      // For client/organization login: cookies are set automatically
      // Now fetch user details
      const userResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        setIsLoading(false);
        return { success: false, error: 'Failed to fetch user details' };
      }

      const userData = await userResponse.json();
      
      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      // Determine user role
      // Check for user_type, userType, or check if user is organisation owner
      const userType = userData.user_type || userData.userType || 
                       (userData.org_name && !userData.department ? 'organisation' : 'employee');
      const normalizedType = userType.toLowerCase();
      let role = 'employee';
      
      // If expectedRole was provided, use it (for franchise/freelancer/super_admin logins)
      if (expectedRole && (normalizedType === expectedRole.toLowerCase() || expectedRole === 'franchise' || expectedRole === 'freelancer' || expectedRole === 'super_admin')) {
        role = expectedRole.toLowerCase();
      } else if (normalizedType === 'organisation' || normalizedType === 'organization' || normalizedType === 'org') {
        role = 'organisation';
      } else if (normalizedType === 'franchise') {
        role = 'franchise';
      } else if (normalizedType === 'freelancer') {
        role = 'freelancer';
      } else if (normalizedType === 'super_admin' || normalizedType === 'superadmin' || normalizedType === 'super-admin') {
        role = 'super_admin';
      }
      
      setUserRole(role);
      
      console.log('✅ [LOGIN] Login successful', { role, userType });
      setIsLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('🔴 [LOGOUT] Logging out...');
    
    setIsLoading(true);
    
    try {
      // Get user type for logout
      const usertype = userRole === 'organisation' ? 'client' : 'client'; // Default to client
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usertype }),
      });

      // Clear local storage regardless of response
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setIsLoading(false);

      if (response.ok) {
        console.log('✅ [LOGOUT] Logout successful');
        return { success: true };
      } else {
        console.warn('⚠️ [LOGOUT] Logout API call failed, but local session cleared');
        return { success: true }; // Still return success since we cleared local state
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if API call fails
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setIsLoading(false);
      return { success: true }; // Return success since we cleared local state
    }
  }, [userRole]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user,
      userRole,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
