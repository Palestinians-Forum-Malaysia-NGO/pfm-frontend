import { COUNTRIES } from "../../../../constants/lists";

export const COUNTRY_NAME_BY_CODE = COUNTRIES.reduce((acc, c) => {
  acc[c.code] = c.name;
  return acc;
}, {});

export const COUNTRY_OPTIONS = [
  ...["PS", "MY"].map((code) => ({ value: code, label: COUNTRY_NAME_BY_CODE[code] })),
  ...COUNTRIES
    .filter((c) => c.code !== "PS" && c.code !== "MY")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({ value: c.code, label: c.name })),
];

export default COUNTRY_OPTIONS;
