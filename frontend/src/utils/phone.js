export const PK_PHONE_REGEX = /^\+92-\d{3}-\d{7}$/;
export const PK_PHONE_MESSAGE = "Phone must be in format +92-3XX-XXXXXXX";
export const PK_PHONE_MAX_LENGTH = 15; // +92-XXX-XXXXXXX

/** Keep only national digits and format as +92-XXX-XXXXXXX */
export function formatPkPhone(input) {
  let digits = String(input || "").replace(/\D/g, "");

  if (digits.startsWith("92")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  if (!digits.length) {
    return "+92";
  }

  if (digits.length <= 3) {
    return `+92-${digits}`;
  }

  return `+92-${digits.slice(0, 3)}-${digits.slice(3)}`;
}

export function isValidPkPhone(value) {
  return PK_PHONE_REGEX.test(String(value || "").trim());
}
