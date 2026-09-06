import { useForm, Controller } from "react-hook-form";
import { Button } from "../components/Button";
import { Alert } from "../components/Alert";
import { PhoneInput } from "../components/PhoneInput";
import { formatPkPhone, isValidPkPhone, PK_PHONE_MESSAGE } from "../utils/phone";

export function DoctorForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      specialization: "",
      phone: "+92",
      email: "",
      availability: "",
      isActive: true,
      ...defaultValues,
      phone: formatPkPhone(defaultValues?.phone || "+92"),
    },
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        Name
        <input
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          })}
        />
        {errors.name ? <span className="field-error">{errors.name.message}</span> : null}
      </label>

      <label>
        Specialization
        <input
          {...register("specialization", {
            required: "Specialization is required",
          })}
        />
        {errors.specialization ? (
          <span className="field-error">{errors.specialization.message}</span>
        ) : null}
      </label>

      <label>
        Phone
        <Controller
          name="phone"
          control={control}
          rules={{
            required: "Phone is required",
            validate: (value) => isValidPkPhone(value) || PK_PHONE_MESSAGE,
          }}
          render={({ field }) => <PhoneInput {...field} />}
        />
        {errors.phone ? <span className="field-error">{errors.phone.message}</span> : null}
      </label>

      <label>
        Email
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
        />
        {errors.email ? <span className="field-error">{errors.email.message}</span> : null}
      </label>

      <label className="full-width">
        Availability
        <input
          {...register("availability", {
            required: "Availability is required",
          })}
          placeholder="Mon-Fri 9:00 AM - 5:00 PM"
        />
        {errors.availability ? (
          <span className="field-error">{errors.availability.message}</span>
        ) : null}
      </label>

      <label className="checkbox-row">
        <input type="checkbox" {...register("isActive")} />
        Active doctor
      </label>

      <Alert>{serverError}</Alert>

      <div className="form-actions full-width">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save doctor"}
        </Button>
      </div>
    </form>
  );
}
