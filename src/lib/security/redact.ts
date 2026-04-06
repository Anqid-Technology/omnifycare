/**
 * PHI Redaction Utility for HIPAA Compliance
 *
 * This module ensures that Protected Health Information (PHI) is stripped
 * from all text before it is sent to external AI services (Anthropic API).
 * HIPAA requires that PHI never leaves the covered entity's control without
 * a signed Business Associate Agreement — redacting before transmission
 * is our primary safeguard.
 *
 * Called by: src/app/api/generate/route.ts, src/app/api/ai-fill/route.ts
 */

interface PHIPattern {
  /** Regex to match the PHI pattern */
  pattern: RegExp
  /** Replacement string inserted in place of matched PHI */
  replacement: string
  /** Human-readable description of what this pattern catches */
  description: string
}

const PHI_PATTERNS: PHIPattern[] = [
  // SSN — standalone format XXX-XX-XXXX
  {
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    replacement: '[SSN-REDACTED]',
    description: 'Social Security Numbers (XXX-XX-XXXX)',
  },
  // SSN — labeled references like "SSN: 123-45-6789" or "Social Security Number: 123456789"
  {
    pattern: /\b(?:SSN|Social Security(?:\s+Number)?)[:\s]+\d[\d\s-]{6,10}\d\b/gi,
    replacement: '[SSN-REDACTED]',
    description: 'Labeled SSN references (SSN: ..., Social Security Number: ...)',
  },
  // Medicaid ID — labeled references like "Medicaid ID: XX123456789"
  {
    pattern: /\b(?:Medicaid\s*(?:ID|Number|#))[:\s]+[A-Z0-9]{6,12}\b/gi,
    replacement: '[MEDICAID-REDACTED]',
    description: 'Labeled Medicaid ID references',
  },
  // Medicaid ID — Oregon format: two uppercase letters followed by 9 digits
  {
    pattern: /\b[A-Z]{2}\d{9}\b/g,
    replacement: '[MEDICAID-REDACTED]',
    description: 'Oregon Medicaid IDs (two letters + 9 digits)',
  },
  // NPI — National Provider Identifier (exactly 10 digits, often labeled)
  {
    pattern: /\b(?:NPI)[:\s#]*\d{10}\b/gi,
    replacement: '[NPI-REDACTED]',
    description: 'Labeled NPI (National Provider Identifier) numbers',
  },
  // NPI — standalone 10-digit number (more conservative: only at word boundaries)
  {
    pattern: /(?<=\bNPI\b[:\s#]*)\d{10}\b/gi,
    replacement: '[NPI-REDACTED]',
    description: 'NPI numbers following NPI label',
  },
  // Date of Birth — labeled formats like "DOB: 01/15/1990" or "Date of Birth: January 15, 1990"
  {
    pattern: /\b(?:DOB|Date of Birth|D\.O\.B\.?|Birth\s*Date)[:\s]+\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/gi,
    replacement: '[DOB-REDACTED]',
    description: 'Labeled dates of birth with numeric dates (DOB: MM/DD/YYYY)',
  },
  // Date of Birth — labeled with written-out month like "DOB: January 15, 1990"
  {
    pattern: /\b(?:DOB|Date of Birth|D\.O\.B\.?|Birth\s*Date)[:\s]+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
    replacement: '[DOB-REDACTED]',
    description: 'Labeled dates of birth with written months (DOB: Month DD, YYYY)',
  },
  // Phone numbers — US formats: (503) 555-1234, 503-555-1234, 503.555.1234, +1-503-555-1234
  {
    pattern: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g,
    replacement: '[PHONE-REDACTED]',
    description: 'US phone numbers in common formats',
  },
  // Email addresses
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replacement: '[EMAIL-REDACTED]',
    description: 'Email addresses',
  },
]

/**
 * Strips Protected Health Information (PHI) from text before sending to external AI services.
 *
 * HIPAA requires that PHI is not transmitted to third-party services without a BAA.
 * This function removes SSNs, phone numbers, email addresses, dates of birth,
 * Medicaid IDs, and NPI numbers from the input string.
 *
 * @param text - The raw text that may contain PHI
 * @returns The text with all detected PHI replaced by redaction markers
 *
 * @example
 * ```ts
 * const safe = sanitizeForAI("Patient SSN: 123-45-6789, DOB: 01/15/1990")
 * // => "Patient [SSN-REDACTED], [DOB-REDACTED]"
 * ```
 */
export function sanitizeForAI(text: string): string {
  let sanitized = text
  for (const { pattern, replacement } of PHI_PATTERNS) {
    // Reset lastIndex since patterns use the global flag
    pattern.lastIndex = 0
    sanitized = sanitized.replace(pattern, replacement)
  }
  return sanitized
}

/**
 * Recursively sanitizes all string values in an object, removing PHI.
 *
 * Use this when passing structured data (e.g., resident records, form submissions)
 * to AI services. Every string value in the object tree is run through sanitizeForAI.
 *
 * @param obj - An object whose string values may contain PHI
 * @returns A deep copy of the object with all string values redacted
 *
 * @example
 * ```ts
 * const safe = sanitizeObjectForAI({ name: "John", ssn: "123-45-6789" })
 * // => { name: "John", ssn: "[SSN-REDACTED]" }
 * ```
 */
export function sanitizeObjectForAI<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeForAI(value)
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeForAI(item)
          : item !== null && typeof item === 'object'
            ? sanitizeObjectForAI(item as Record<string, unknown>)
            : item
      )
    } else if (value !== null && typeof value === 'object') {
      result[key] = sanitizeObjectForAI(value as Record<string, unknown>)
    } else {
      result[key] = value
    }
  }
  return result as T
}

/**
 * Detects whether any PHI patterns are present in the given text.
 *
 * Use this for validation or logging — e.g., to warn when a user is about to
 * submit content containing PHI, or to flag audit log entries.
 *
 * @param text - The text to scan for PHI
 * @returns true if any PHI pattern matches, false otherwise
 *
 * @example
 * ```ts
 * if (detectsPHI(userInput)) {
 *   console.warn('PHI detected in user input — redacting before AI call')
 * }
 * ```
 */
export function detectsPHI(text: string): boolean {
  for (const { pattern } of PHI_PATTERNS) {
    pattern.lastIndex = 0
    if (pattern.test(text)) {
      return true
    }
  }
  return false
}
