// API Configuration
// Always use hosted server for API calls
// Frontend can run on localhost for development, but API calls go to hosted server
const getBaseURL = () => {
  // Always use the hosted server for API calls
  return 'https://app.admini.co.in/api';
};

export const API_BASE_URL = getBaseURL();

export const API_ENDPOINTS = {
  MOBILE_AGENCY_LOGIN: '/mobile-agency-login', // Mobile login for freelancer/branding agency (returns access_token)
  MOBILE_LOGOUT: '/mobile-logout', // Mobile logout with user type (same as mobile app client)
  USER: '/user', // Get user details
};
