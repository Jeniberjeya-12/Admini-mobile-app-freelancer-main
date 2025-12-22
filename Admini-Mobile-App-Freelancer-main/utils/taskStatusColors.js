// Task Status Badge Colors
// Shared utility for consistent status badge colors across the app

export const getStatusBadgeColor = (status) => {
  if (!status) return '#6B7280'; // Default gray
  
  const statusLower = (status || '').toLowerCase().trim();
  
  // Rejection statuses - Red
  if (statusLower.includes('reject') || statusLower.includes('rejected')) {
    return '#FF3B30'; // Red
  }
  
  // Delayed statuses - Brick Red
  if (statusLower.includes('delayed') || statusLower === 'delayed') {
    return '#B22222'; // Brick Red
  }
  
  // Submitted statuses - Green
  if (statusLower.includes('submit') || statusLower.includes('submitted')) {
    return '#10B981'; // Green
  }
  
  // On Going / In Progress - Blue
  if (statusLower.includes('going') || 
      statusLower.includes('progress') || 
      statusLower.includes('ongoing') ||
      statusLower === 'on going') {
    return '#007AFF'; // Blue
  }
  
  // Completed - Dark Green
  if (statusLower.includes('complete') || statusLower === 'completed') {
    return '#059669'; // Dark Green
  }
  
  // On Hold - Orange
  if (statusLower.includes('hold') || statusLower === 'on hold') {
    return '#FF9500'; // Orange
  }
  
  // Pending - Red
  if (statusLower.includes('pending') || statusLower === 'pending') {
    return '#FF3B30'; // Red
  }
  
  // Approved - Green
  if (statusLower.includes('approve') || statusLower.includes('approved')) {
    return '#10B981'; // Green
  }
  
  // Default - Gray
  return '#6B7280'; // Gray
};

export const getStatusBadgeStyle = (status) => {
  return { backgroundColor: getStatusBadgeColor(status) };
};

