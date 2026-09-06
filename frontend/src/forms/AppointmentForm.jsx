import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../components/Button";
import { Alert } from "../components/Alert";
import { PhoneInput } from "../components/PhoneInput";
import { formatPkPhone, isValidPkPhone, PK_PHONE_MESSAGE } from "../utils/phone";

const statuses = ["Pending", "Scheduled", "Completed", "Cancelled"];
const ACTIVE_BOOKING_STATUSES = ["Pending", "Scheduled"];

const toLocalInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const needsFutureDate = (status) => ACTIVE_BOOKING_STATUSES.includes(status);

const isPastDateTime = (value) => {
  if (!value) return false;
  return new Date(value).getTime() < Date.now();
};

export function AppointmentForm({
  doctors = [],
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}) {
  const originalWasPastActive = useMemo(() => {
    const status = defaultValues?.status || "Pending";
    return (
      Boolean(defaultValues?.dateTime) &&
      needsFutureDate(status) &&
      isPastDateTime(defaultValues.dateTime)
    );
  }, [defaultValues]);

  const initialDateTime = useMemo(() => {
    if (originalWasPastActive) {
      return toLocalInputValue(new Date());
    }

    return (
      toLocalInputValue(defaultValues?.dateTime) ||
      toLocalInputValue(new Date())
    );
  }, [defaultValues, originalWasPastActive]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientName: "",
      patientContact: "+92",
      doctor: "",
      dateTime: initialDateTime,
      reason: "",
      status: "Pending",
      ...defaultValues,
      doctor:
        defaultValues?.doctor?._id ||
        defaultValues?.doctor?.id ||
        defaultValues?.doctor ||
        "",
      dateTime: initialDateTime,
      patientContact: formatPkPhone(defaultValues?.patientContact || "+92"),
      status: defaultValues?.status || "Pending",
    },
  });

  const status = watch("status");
  const dateTime = watch("dateTime");
  const requiresFutureDate = needsFutureDate(status);

  useEffect(() => {
    if (requiresFutureDate && isPastDateTime(dateTime)) {
      setValue("dateTime", toLocalInputValue(new Date()), {
        shouldValidate: true,
      });
    }
  }, [requiresFutureDate, dateTime, setValue]);

  const submit = (values) => {
    onSubmit({
      ...values,
      dateTime: new Date(values.dateTime).toISOString(),
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit(submit)} noValidate>
      {originalWasPastActive ? (
        <Alert className="full-width">
          This appointment was Pending/Scheduled in the past. Date & time was
          moved to now — pick a new future slot before saving.
        </Alert>
      ) : null}

      <label>
        Patient name
        <input
          {...register("patientName", {
            required: "Patient name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          })}
        />
        {errors.patientName ? (
          <span className="field-error">{errors.patientName.message}</span>
        ) : null}
      </label>

      <label>
        Patient contact
        <Controller
          name="patientContact"
          control={control}
          rules={{
            required: "Patient contact is required",
            validate: (value) => isValidPkPhone(value) || PK_PHONE_MESSAGE,
          }}
          render={({ field }) => <PhoneInput {...field} />}
        />
        {errors.patientContact ? (
          <span className="field-error">{errors.patientContact.message}</span>
        ) : null}
      </label>

      <label>
        Doctor
        <select
          {...register("doctor", {
            required: "Doctor is required",
          })}
        >
          <option value="">Select doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
              {doctor.name} — {doctor.specialization}
            </option>
          ))}
        </select>
        {errors.doctor ? (
          <span className="field-error">{errors.doctor.message}</span>
        ) : null}
      </label>

      <label>
        Date & time
        <input
          type="datetime-local"
          min={requiresFutureDate ? toLocalInputValue(new Date()) : undefined}
          {...register("dateTime", {
            required: "Date and time is required",
            validate: (value) => {
              if (!requiresFutureDate) return true;
              if (isPastDateTime(value)) {
                return "Pending or Scheduled appointments need a current or future date and time";
              }
              return true;
            },
          })}
        />
        <span className="field-hint">
          {requiresFutureDate
            ? "Pending / Scheduled must be now or later."
            : "Completed / Cancelled can keep a past date."}
        </span>
        {errors.dateTime ? (
          <span className="field-error">{errors.dateTime.message}</span>
        ) : null}
      </label>

      <label className="full-width">
        Reason
        <textarea
          rows={3}
          {...register("reason", {
            required: "Reason is required",
          })}
        />
        {errors.reason ? (
          <span className="field-error">{errors.reason.message}</span>
        ) : null}
      </label>

      <label>
        Status
        <select {...register("status")}>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <Alert>{serverError}</Alert>

      <div className="form-actions full-width">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save appointment"}
        </Button>
      </div>
    </form>
  );
}
