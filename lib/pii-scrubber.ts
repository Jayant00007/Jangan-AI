/**
 * PII Scrubber & Privacy Guardrail for Census Saathi
 * Detects and redacts sensitive personally identifiable information (PII)
 * before processing with AI models or storing in memory.
 */

export interface ScrubResult {
  cleanedText: string;
  hadPii: boolean;
  redactedTypes: string[];
}

export function scrubPII(input: string): ScrubResult {
  if (!input || typeof input !== 'string') {
    return { cleanedText: '', hadPii: false, redactedTypes: [] };
  }

  let cleaned = input;
  const redactedTypes: string[] = [];

  // 1. Aadhaar Card Pattern: 12 digits (with optional spaces or dashes: XXXX XXXX XXXX)
  const aadhaarRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  if (aadhaarRegex.test(cleaned)) {
    cleaned = cleaned.replace(aadhaarRegex, '[REDACTED_AADHAAR_NUMBER]');
    redactedTypes.push('Aadhaar Number');
  }

  // 2. Indian Mobile Number Pattern: 10 digits starting with 6, 7, 8, 9 (with optional +91 or 0)
  const phoneRegex = /(?:\+91[\s-]?)?(?:0)?[6-9]\d{9}\b/g;
  if (phoneRegex.test(cleaned)) {
    cleaned = cleaned.replace(phoneRegex, '[REDACTED_PHONE_NUMBER]');
    redactedTypes.push('Phone Number');
  }

  // 3. Indian PAN Card Pattern: 5 uppercase letters, 4 digits, 1 uppercase letter (e.g. ABCDE1234F)
  const panRegex = /\b[A-Za-z]{5}\d{4}[A-Za-z]{1}\b/g;
  if (panRegex.test(cleaned)) {
    cleaned = cleaned.replace(panRegex, '[REDACTED_PAN_CARD]');
    redactedTypes.push('PAN Number');
  }

  // 4. Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  if (emailRegex.test(cleaned)) {
    cleaned = cleaned.replace(emailRegex, '[REDACTED_EMAIL]');
    redactedTypes.push('Email Address');
  }

  // 5. Credit/Debit Card Numbers: 16 digits
  const cardRegex = /\b(?:\d{4}[\s-]?){3}\d{4}\b/g;
  if (cardRegex.test(cleaned)) {
    cleaned = cleaned.replace(cardRegex, '[REDACTED_CARD_NUMBER]');
    redactedTypes.push('Card Number');
  }

  return {
    cleanedText: cleaned,
    hadPii: redactedTypes.length > 0,
    redactedTypes: Array.from(new Set(redactedTypes)),
  };
}
