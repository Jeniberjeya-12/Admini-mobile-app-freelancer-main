import { Platform } from 'react-native';

// API Configuration and utilities
// IMPORTANT: Update these URLs to match your server configuration
// Default Flask server runs on port 8000
const SERVER_PORT = 8000; // Backend server port
const SERVER_IP = '192.168.0.3'; // Update this IP if your network changes

const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development: Use localhost for web, IP address for mobile
    if (Platform.OS === 'web') {
      return `http://localhost:${SERVER_PORT}`;
    } else {
      // Mobile/Expo: Use IP address instead of localhost
      return `http://${SERVER_IP}:${SERVER_PORT}`;
    }
  } else {
    // Production: Update with your production server URL
    return 'https://your-production-server.com';
  }
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Make an API request with cookie support
 * @param {string} endpoint - API endpoint (e.g., '/login')
 * @param {object} options - Fetch options
 * @param {boolean} useFormData - Whether to send as FormData (default: false, uses JSON)
 * @returns {Promise<Response>}
 */
export async function apiRequest(endpoint, options = {}, useFormData = false) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🌐 [API] ${options.method || 'GET'} ${url}`);
  console.log(`📡 [API] Base URL: ${API_BASE_URL}, Platform: ${Platform.OS}`);
  console.log(`📡 [API] Using FormData: ${useFormData}`);
  
  // Set headers based on whether we're using FormData or JSON
  const defaultHeaders = useFormData
    ? {
        'Accept': 'application/json',
        ...options.headers,
      }
    : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      };

  const defaultOptions = {
    credentials: 'include', // Include cookies in requests (works on web, may need manual handling on mobile)
    headers: defaultHeaders,
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    console.log(`📥 [API] ${options.method || 'GET'} ${url} - Status: ${response.status} ${response.statusText}`);
    console.log(`📥 [API] Response URL: ${response.url}`);
    console.log(`📥 [API] Response headers:`, Object.fromEntries(response.headers.entries()));
    
    return response;
  } catch (error) {
    console.error(`❌ [API] ${options.method || 'GET'} ${url} - Error:`, error);
    console.error(`❌ [API] Error details:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check if it's a CORS error
    if (error.message && (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.message.includes('Access-Control'))) {
      const corsError = new Error(`CORS Error: The backend server at ${API_BASE_URL} is not allowing requests from ${Platform.OS === 'web' ? window.location.origin : 'mobile app'}. Please configure the backend to allow CORS from your frontend origin.`);
      corsError.name = 'CORSError';
      corsError.originalError = error;
      throw corsError;
    }
    
    throw error;
  }
}

/**
 * Login API call - sends data as JSON
 * Note: Server uses request.get_json() which requires JSON format
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function loginAPI(username, password) {
  try {
    // Create JSON body - server expects JSON format
    const jsonBody = JSON.stringify({
      username: username,
      password: password
    });

    console.log('📤 [API] Sending login request as JSON (application/json)');

    const response = await apiRequest('/login', {
      method: 'POST',
      body: jsonBody,
      // Content-Type will be set to application/json by apiRequest
    }, false); // Use JSON, not FormData

    // Check if response is JSON
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // Response is not JSON, likely HTML error page or redirect
      const text = await response.text();
      console.error('❌ [API] Non-JSON response received:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        url: response.url,
        preview: text.substring(0, 200)
      });
      
      // Check if it's an HTML error page
      const isHtmlError = text.includes('<!DOCTYPE html>') || text.includes('<html') || contentType.includes('text/html');
      
      if (response.status === 404) {
        return { success: false, error: 'Login endpoint not found. Please check your server URL and ensure the /login endpoint exists.' };
      } else if (response.status === 415) {
        return { success: false, error: 'Server rejected the request format. Please check that the server accepts JSON format.' };
      } else if (response.status === 0 || !response.ok) {
        return { success: false, error: `Cannot connect to server. Please ensure the server is running on ${API_BASE_URL}` };
      } else if (isHtmlError && response.status === 200) {
        // Server returned HTML with 200 status - likely an error page or redirect
        // Try to extract error message from HTML if possible
        const errorMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i) || 
                          text.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
                          text.match(/error[^>]*>([^<]+)/i);
        const errorHint = errorMatch ? ` (${errorMatch[1]})` : '';
        
        // Check if URL changed (redirect happened)
        const urlChanged = response.url !== `${API_BASE_URL}/login`;
        const redirectHint = urlChanged ? ` The request was redirected to: ${response.url}` : '';
        
        return { 
          success: false, 
          error: `Server returned HTML instead of JSON.${redirectHint}${errorHint} This usually means: 1) The /login endpoint doesn't exist, 2) The server is redirecting, or 3) There's a CORS/configuration issue. Please verify your server is running and the endpoint is configured correctly.` 
        };
      } else {
        return { success: false, error: `Server returned unexpected response format (${contentType}). Expected JSON but received: ${contentType}` };
      }
    }

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Login successful' };
    } else {
      return { success: false, error: data.error || 'Login failed' };
    }
  } catch (error) {
    console.error('Login API error:', error);
    
    // Check if it's a CORS error
    if (error.name === 'CORSError' || (error.message && (error.message.includes('CORS') || error.message.includes('Failed to fetch')))) {
      return { 
        success: false, 
        error: `CORS Error: The backend server is not configured to allow requests from your frontend. Please configure the Flask backend to allow CORS from http://localhost:8081. Add flask-cors and configure it to allow your frontend origin.` 
      };
    }
    
    // Check if it's a JSON parse error
    if (error.message && error.message.includes('JSON')) {
      return { success: false, error: 'Server returned invalid response. Please check server URL and CORS settings.' };
    }
    
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Logout API call - sends data as JSON
 * @param {string} usertype - User type: 'client', 'franchise', 'super-admin', or other for agency
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function logoutAPI(usertype = 'client') {
  try {
    // Create JSON body - server expects JSON format
    const jsonBody = JSON.stringify({
      usertype: usertype
    });

    console.log('📤 [API] Sending logout request as JSON (application/json)');

    const response = await apiRequest('/logout', {
      method: 'POST',
      body: jsonBody,
      // Content-Type will be set to application/json by apiRequest
    }, false); // Use JSON, not FormData

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ [API] Non-JSON response in logout:', {
        status: response.status,
        contentType,
        preview: text.substring(0, 200)
      });
      return { success: false, error: 'Server returned invalid response' };
    }

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Logout successful' };
    } else {
      return { success: false, error: data.error || 'Logout failed' };
    }
  } catch (error) {
    console.error('Logout API error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Get current user info (protected route)
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function getCurrentUser() {
  try {
    const response = await apiRequest('/protected', {
      method: 'GET',
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, user: data };
    } else {
      return { success: false, error: data.error || 'Failed to get user info' };
    }
  } catch (error) {
    console.error('Get user API error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Get user details from /user endpoint
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function getUserDetails() {
  try {
    const response = await apiRequest('/user', {
      method: 'GET',
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ [API] Non-JSON response in getUserDetails:', {
        status: response.status,
        contentType,
        preview: text.substring(0, 200)
      });
      return { success: false, error: 'Server returned invalid response' };
    }

    const data = await response.json();

    if (response.ok) {
      return { success: true, user: data };
    } else {
      return { success: false, error: data.error || 'Failed to get user details' };
    }
  } catch (error) {
    console.error('Get user details API error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Test server connection
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function testConnection() {
  try {
    console.log(`🔍 [API] Testing connection to: ${API_BASE_URL}`);
    const response = await fetch(`${API_BASE_URL}/protected`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log(`🔍 [API] Test response status: ${response.status}`);
    console.log(`🔍 [API] Test response URL: ${response.url}`);
    
    const contentType = response.headers.get('content-type');
    console.log(`🔍 [API] Test response content-type: ${contentType}`);
    
    if (response.status === 401) {
      // 401 is expected for protected route without auth - server is reachable!
      return { success: true, message: 'Server is reachable (401 expected for protected route)' };
    }
    
    if (response.status === 404) {
      return { success: false, error: `Server endpoint not found. Is the server running on ${API_BASE_URL}?` };
    }
    
    return { success: true, message: `Server responded with status ${response.status}` };
  } catch (error) {
    console.error('❌ [API] Connection test failed:', error);
    return { 
      success: false, 
      error: `Cannot connect to server at ${API_BASE_URL}. Error: ${error.message}` 
    };
  }
}

export { API_BASE_URL };
