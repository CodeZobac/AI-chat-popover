/**
 * Generates a unique reference number for scheduling requests
 */
export function generateReferenceNumber(type: 'interview' | 'tour' | 'call', id: string): string {
  const prefix = {
    interview: 'INT',
    tour: 'TOUR',
    call: 'CALL'
  }[type];

  // Extract the last 8 characters of the ID for uniqueness
  const shortId = id.slice(-8).toUpperCase();
  
  // Add current timestamp for additional uniqueness
  const timestamp = Date.now().toString().slice(-4);
  
  return `${prefix}-${shortId}-${timestamp}`;
}

/**
 * Alternative reference number generator using sequential numbering
 * This would be used if you want simpler, sequential reference numbers
 */
export function generateSequentialReferenceNumber(type: 'interview' | 'tour' | 'call', sequenceNumber: number): string {
  const prefix = {
    interview: 'INT',
    tour: 'TOUR',
    call: 'CALL'
  }[type];

  // Pad the sequence number to 6 digits
  const paddedNumber = sequenceNumber.toString().padStart(6, '0');
  
  return `${prefix}-${paddedNumber}`;
}

/**
 * Validates a reference number format
 */
export function validateReferenceNumber(referenceNumber: string): boolean {
  const pattern = /^(INT|TOUR|CALL)-[A-Z0-9]{8}-[0-9]{4}$/;
  return pattern.test(referenceNumber);
}

/**
 * Extracts the type from a reference number
 */
export function extractTypeFromReference(referenceNumber: string): 'interview' | 'tour' | 'call' | null {
  if (referenceNumber.startsWith('INT-')) return 'interview';
  if (referenceNumber.startsWith('TOUR-')) return 'tour';
  if (referenceNumber.startsWith('CALL-')) return 'call';
  return null;
}