import { useMemo, useState } from "react";
import { useAppointments, useAppointmentMutations } from "../hooks/useAppointments";
import { useDoctors } from "../hooks/useDoctors";
import { AppointmentForm } from "../forms/AppointmentForm";
import { Alert } from "../components/Alert";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Modal } from "../components/Modal";
import { Spinner } from "../components/Spinner";

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

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [serverError, setServerError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryArgs = useMemo(() => {
    const params = { limit: 8, sortBy: "id", order: "asc" };
    if (search.trim()) params.search = search.trim();
    if (status) params.status = status;
    if (doctorFilter) params.doctor = doctorFilter;
    return params;
  }, [search, status, doctorFilter]);

  const {
    appointments,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    loadMore,
  } = useAppointments(queryArgs);
  const { doctors } = useDoctors({ limit: 100, sortBy: "id", order: "asc" });
  const {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    createState,
    updateState,
    deleteState,
  } = useAppointmentMutations();

  const openCreate = () => {
    setSelected(null);
    setServerError("");
    setModalMode("create");
  };

  const openEdit = (appointment) => {
    setSelected(appointment);
    setServerError("");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
    setServerError("");
  };

  const handleSubmit = async (values) => {
    setServerError("");
    try {
      if (modalMode === "create") {
        await createAppointment(values).unwrap();
      } else {
        await updateAppointment({
          id: selected._id || selected.id,
          ...values,
        }).unwrap();
      }
      closeModal();
    } catch (err) {
      setServerError(err?.data?.message || "Unable to save appointment");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteAppointment(deleteTarget._id || deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      setServerError(err?.data?.message || "Unable to delete appointment");
    }
  };

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p className="muted">
            Book and update patient visits. Filter by doctor or status.
            Pending = needs confirmation, Scheduled = confirmed, Completed =
            done, Cancelled = dropped.
          </p>
        </div>
        <Button onClick={openCreate}>Add appointment</Button>
      </div>

      <div className="toolbar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search patient, contact, or reason"
        />
        <select
          value={doctorFilter}
          onChange={(event) => setDoctorFilter(event.target.value)}
        >
          <option value="">All doctors</option>
          {doctors.map((doctor) => (
            <option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {isError ? <Alert>{error || "Failed to load appointments"}</Alert> : null}
      {serverError && !modalMode ? <Alert>{serverError}</Alert> : null}

      {isLoading && appointments.length === 0 ? (
        <Spinner label="Loading appointments..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="Try another filter or create a new appointment."
          action={<Button onClick={openCreate}>Add appointment</Button>}
        />
      ) : (
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>When</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id || appointment.id}>
                    <td>
                      <div>{appointment.patientName}</div>
                      <div className="muted">{appointment.patientContact}</div>
                    </td>
                    <td>{appointment.doctor?.name || "—"}</td>
                    <td>{formatDateTime(appointment.dateTime)}</td>
                    <td>{appointment.reason}</td>
                    <td>
                      <Badge tone={statusTone[appointment.status] || "neutral"}>
                        {appointment.status}
                      </Badge>
                    </td>
                    <td className="row-actions">
                      <Button
                        variant="secondary"
                        onClick={() => openEdit(appointment)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setServerError("");
                          setDeleteTarget(appointment);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination?.hasNextPage ? (
            <div className="panel-footer">
              <Button
                variant="secondary"
                onClick={loadMore}
                disabled={isFetching}
              >
                {isFetching ? "Loading..." : "Load more"}
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {modalMode ? (
        <Modal
          title={modalMode === "create" ? "Add appointment" : "Edit appointment"}
          onClose={closeModal}
        >
          <AppointmentForm
            doctors={doctors.filter(
              (doctor) =>
                doctor.isActive ||
                doctor._id === (selected?.doctor?._id || selected?.doctor) ||
                doctor.id === (selected?.doctor?.id || selected?.doctor),
            )}
            defaultValues={selected || undefined}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            isSubmitting={createState.isLoading || updateState.isLoading}
            serverError={serverError}
          />
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          title="Delete appointment"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                disabled={deleteState.isLoading}
              >
                {deleteState.isLoading ? "Deleting..." : "Confirm delete"}
              </Button>
            </>
          }
        >
          <p>
            Delete appointment for <strong>{deleteTarget.patientName}</strong>?
          </p>
        </Modal>
      ) : null}
    </section>
  );
}
