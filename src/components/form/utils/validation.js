import i18next from "i18next";

const t = (key, opts) => i18next.t(key, opts);

export const validate = (value, rules = []) => {
  for (const rule of rules) {
    const v = value ?? "";
    const empty = Array.isArray(v)
      ? v.length === 0
      : v === "" || v === null || v === undefined;

    if (rule.required && empty) {
      return rule.message ?? t("validation.required");
    }

    if (!empty) {
      if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) {
        return rule.message ?? t("validation.email");
      }
      if (rule.url) {
        let scheme;
        try { scheme = new URL(String(v)).protocol; } catch { scheme = null; }
        if (scheme !== "http:" && scheme !== "https:") {
          return rule.message ?? t("validation.url");
        }
      }
      if (rule.minLength && String(v).length < rule.minLength) {
        return rule.message ?? t("validation.minLength", { count: rule.minLength });
      }
      if (rule.maxLength && String(v).length > rule.maxLength) {
        return rule.message ?? t("validation.maxLength", { count: rule.maxLength });
      }
      if (rule.pattern && !rule.pattern.test(String(v))) {
        return rule.message ?? t("validation.pattern");
      }
      if (rule.min !== undefined && Number(v) < rule.min) {
        return rule.message ?? t("validation.min", { count: rule.min });
      }
      if (rule.max !== undefined && Number(v) > rule.max) {
        return rule.message ?? t("validation.max", { count: rule.max });
      }
      if (rule.minItems !== undefined && Array.isArray(v) && v.length < rule.minItems) {
        return rule.message ?? t("validation.minItems", { count: rule.minItems });
      }
    }
  }
  return null;
};
