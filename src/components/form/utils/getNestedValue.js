/**
 * Reads a value from a nested object using dot / bracket notation.
 * e.g. getNestedValue(formData, "user.address[0].city")
 */
export const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
};
