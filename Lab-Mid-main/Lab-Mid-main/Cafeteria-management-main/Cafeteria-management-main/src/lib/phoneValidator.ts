/**
 * Validate Pakistani phone number format
 * Accepts formats: +923XXXXXXXXXX, 923XXXXXXXXXX, 03XXXXXXXXXX
 */
export const validatePakistaniPhone = (number: string): boolean => {
  // Remove all whitespace and special characters except +
  const cleaned = number.replace(/[\s\-\(\)]/g, '');
  
  // Regex for Pakistani mobile numbers
  // Must start with +92 or 92 or 0, followed by 3, then 9 digits
  const regex = /^(\+92|92|0)?3[0-9]{9}$/;
  
  return regex.test(cleaned);
};

/**
 * Format phone number to +92XXXXXXXXXX format
 */
export const formatPhoneNumber = (number: string): string => {
  // Remove all non-digits
  let cleaned = number.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.substring(1);
  } else if (!cleaned.startsWith('92')) {
    cleaned = '92' + cleaned;
  }
  
  return '+' + cleaned;
};

/**
 * Clean phone number for display (remove + prefix)
 */
export const cleanPhoneNumber = (number: string): string => {
  return number.replace(/^\+/, '');
};

/**
 * Get last 4 digits of phone number for display
 */
export const getMaskedPhoneNumber = (number: string): string => {
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length < 4) return number;
  return '***' + cleaned.slice(-4);
};
