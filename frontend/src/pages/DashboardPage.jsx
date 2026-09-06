import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { Spinner } from "../components/Spinner";
import { Alert } from "../components/Alert";
import { EmptyState } from "../components/EmptyState";
import { Badge } from "../components/Badge";

const formatDateTime = (value) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const statusTone = {
  Pending: "warning",
  Scheduled: "info",
  Completed: "success",
  Cancelled: "neutral",
};

const summaryCards = [
  {
    key: "totalDoctors",
    title: "Active doctors",
    hint: "Doctors currently marked Active (inactive doctors are not counted).",
  },
  {
    key: "upcomingAppointments",
    title: "Upcoming visits",
    hint: "Future appointments with status Pending or Scheduled.",
  },
  {
    key: "todaysAppointments",
    title: "Today’s visits",
    hint: "All appointments scheduled for today, except Cancelled.",
  },
  {
    key: "pendingAppointments",
    title: "Needs confirmation",
    hint: "Appointments still in Pending status (any date).",
  },
];

export default function DashboardPage() {
  const {
    totalDoctors,
    upcomingAppointments,
    todaysAppointments,
    pendingAppointments,
    recentAppointments,
    isLoading,
    isError,
    error,
  } = useDashboard();

  const values = {
    totalDoctors,
    upcomingAppointments,
    todaysAppointments,
    pendingAppointments,
  };

  if (isLoading) {
    return <Spinner label="Loading dashboard..." />;
  }

  if (isError) {
    return <Alert>{error || "Failed to load dashboard"}</Alert>;
  }

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">
            Quick snapshot of clinic activity. Each card explains what it counts.
          </p>
        </div>
        <div className="header-actions">
          <Link className="text-link" to="/doctors">
            View doctors
          </Link>
          <Link className="text-link" to="/appointments">
            View appointments
          </Link>
        </div>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <article key={card.key} className="summary-card">
            <p className="summary-title">{card.title}</p>
            <strong>{values[card.key]}</strong>
            <p className="summary-hint">{card.hint}</p>
          </article>
        ))}
      </div>

      <div className="help-panel">
        <h2>Status guide</h2>
        <p className="muted">
          Appointment statuses used across the system:
        </p>
        <ul className="status-guide">
          <li>
            <Badge tone="warning">Pending</Badge>
            <span>Waiting for confirmation</span>
          </li>
          <li>
            <Badge tone="info">Scheduled</Badge>
            <span>Confirmed and on the calendar</span>
          </li>
          <li>
            <Badge tone="success">Completed</Badge>
            <span>Visit finished</span>
          </li>
          <li>
            <Badge tone="neutral">Cancelled</Badge>
            <span>Not happening (excluded from Today / Upcoming)</span>
          </li>
        </ul>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Next upcoming visits</h2>
            <p className="muted panel-subtitle">
              Next 5 future Pending or Scheduled appointments.
            </p>
          </div>
          <Link className="text-link" to="/appointments">
            See all
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <EmptyState
            title="No upcoming appointments"
            description="When you schedule Pending or Scheduled visits in the future, they will show here."
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>When</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr key={appointment._id || appointment.id}>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.doctor?.name || "—"}</td>
                    <td>{formatDateTime(appointment.dateTime)}</td>
                    <td>
                      <Badge tone={statusTone[appointment.status] || "neutral"}>
                        {appointment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
