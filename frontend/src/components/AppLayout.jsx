import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./Button";
import { baseApi } from "../api/baseApi";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Cookie may already be cleared; still leave the app shell.
    }
    dispatch(baseApi.util.resetApiState());
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            D
          </div>
          <div>
            <p className="brand">DentalCare</p>
            <p className="brand-sub">Clinic console</p>
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/doctors">Doctors</NavLink>
          <NavLink to="/appointments">Appointments</NavLink>
        </nav>

        <div className="user-chip">
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
