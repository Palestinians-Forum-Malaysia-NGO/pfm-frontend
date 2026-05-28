/**
 * Validates a value against a list of rules.
 * Returns the first error message, or null if valid.
 *
 * Supported rules:
 *   { required: true, message? }
 *   { email: true, message? }
 *   { minLength: number, message? }
 *   { maxLength: number, message? }
 *   { min: number, message? }        — numeric
 *   { max: number, message? }        — numeric
 *   { minItems: number, message? }   — arrays (multi-select, checkboxes)
 *   { pattern: RegExp, message? }
 */
export const validate = (value, rules = []) => {
  for (const rule of rules) {
    const v = value ?? "";
    const empty = Array.isArray(v)
      ? v.length === 0
      : v === "" || v === null || v === undefined;

    if (rule.required && empty) {
      return rule.message ?? "This field is required";
    }

    if (!empty) {
      if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) {
        return rule.message ?? "Enter a valid email address";
      }
      if (rule.minLength && String(v).length < rule.minLength) {
        return rule.message ?? `Minimum ${rule.minLength} characters`;
      }
      if (rule.maxLength && String(v).length > rule.maxLength) {
        return rule.message ?? `Maximum ${rule.maxLength} characters`;
      }
      if (rule.pattern && !rule.pattern.test(String(v))) {
        return rule.message ?? "Invalid format";
      }
      if (rule.min !== undefined && Number(v) < rule.min) {
        return rule.message ?? `Minimum value is ${rule.min}`;
      }
      if (rule.max !== undefined && Number(v) > rule.max) {
        return rule.message ?? `Maximum value is ${rule.max}`;
      }
      if (rule.minItems !== undefined && Array.isArray(v) && v.length < rule.minItems) {
        return rule.message ?? `Select at least ${rule.minItems}`;
      }
    }
  }
  return null;
};
