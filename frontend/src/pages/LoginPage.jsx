import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Spinner } from "../components/Spinner";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginState, isAuthenticated, isLoading, refetch } = useAuth();
  const [serverError, setServerError] = useState("");
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "admin@dental.local",
      password: "Admin123!",
    },
  });

  if (isLoading) {
    return <Spinner label="Checking session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await login(values).unwrap();
      await refetch();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <p className="brand">DentalCare</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage doctors and appointments.</p>

        <label>
          Email
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email ? (
            <span className="field-error">{errors.email.message}</span>
          ) : null}
        </label>

        <label>
          Password
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password ? (
            <span className="field-error">{errors.password.message}</span>
          ) : null}
        </label>

        <Alert>{serverError}</Alert>

        <Button type="submit" disabled={loginState.isLoading}>
          {loginState.isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
