import { Link, useParams } from "react-router-dom";
import { useDoctor } from "../hooks/useDoctors";
import { Alert } from "../components/Alert";
import { Badge } from "../components/Badge";
import { Spinner } from "../components/Spinner";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const { doctor, isLoading, isError, error } = useDoctor(id);

  if (isLoading) {
    return <Spinner label="Loading doctor..." />;
  }

  if (isError) {
    return <Alert>{error || "Doctor not found"}</Alert>;
  }

  if (!doctor) {
    return <Alert>Doctor not found</Alert>;
  }

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="muted">
            <Link className="text-link" to="/doctors">
              Doctors
            </Link>{" "}
            / Detail
          </p>
          <h1>{doctor.name}</h1>
        </div>
        <Badge tone={doctor.isActive ? "success" : "neutral"}>
          {doctor.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="detail-grid panel">
        <div>
          <p className="label">Specialization</p>
          <p>{doctor.specialization}</p>
        </div>
        <div>
          <p className="label">Email</p>
          <p>{doctor.email}</p>
        </div>
        <div>
          <p className="label">Phone</p>
          <p>{doctor.phone}</p>
        </div>
        <div>
          <p className="label">Availability</p>
          <p>{doctor.availability}</p>
        </div>
      </div>
    </section>
  );
}
