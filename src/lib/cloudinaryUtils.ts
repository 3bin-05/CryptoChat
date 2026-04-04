/**
 * Injects Cloudinary transformations into a secure_url.
 * Specifically adds f_auto,q_auto to optimize format and quality.
 */
export function getOptimizedCloudinaryUrl(url: string | undefined): string {
  if (!url) return '';
  
  // Example: https://res.cloudinary.com/demo/image/upload/v1570975164/sample.jpg
  // Target: https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1570975164/sample.jpg
  
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  
  return url;
}
