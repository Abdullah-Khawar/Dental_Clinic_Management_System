import { formatPkPhone, PK_PHONE_MAX_LENGTH } from "../utils/phone";

export function PhoneInput({ value, onChange, onBlur, name, id, placeholder, ...props }) {
  const handleChange = (event) => {
    onChange(formatPkPhone(event.target.value));
  };

  const handleFocus = (event) => {
    if (!value || value === "") {
      onChange("+92");
    }
    props.onFocus?.(event);
  };

  const handleBlur = (event) => {
    if (value === "+92" || value === "+92-") {
      onChange("+92");
    }
    onBlur?.(event);
  };

  return (
    <input
      {...props}
      id={id}
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      maxLength={PK_PHONE_MAX_LENGTH}
      placeholder={placeholder || "+92-321-5550001"}
      value={value || "+92"}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
