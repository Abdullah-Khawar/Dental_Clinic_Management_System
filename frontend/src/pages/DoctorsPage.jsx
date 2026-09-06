import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDoctors, useDoctorMutations } from "../hooks/useDoctors";
import { DoctorForm } from "../forms/DoctorForm";
import { Alert } from "../components/Alert";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Modal } from "../components/Modal";
import { Spinner } from "../components/Spinner";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalMode, setModalMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [serverError, setServerError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryArgs = useMemo(() => {
    const params = { limit: 8, sortBy: "id", order: "asc" };
    if (search.trim()) params.search = search.trim();
    if (statusFilter === "active") params.isActive = true;
    if (statusFilter === "inactive") params.isActive = false;
    return params;
  }, [search, statusFilter]);

  const { doctors, pagination, isLoading, isFetching, isError, error, loadMore } =
    useDoctors(queryArgs);
  const { createDoctor, updateDoctor, deleteDoctor, createState, updateState, deleteState } =
    useDoctorMutations();

  const openCreate = () => {
    setSelected(null);
    setServerError("");
    setModalMode("create");
  };

  const openEdit = (doctor) => {
    setSelected(doctor);
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
        await createDoctor(values).unwrap();
      } else {
        await updateDoctor({ id: selected._id || selected.id, ...values }).unwrap();
      }
      closeModal();
    } catch (err) {
      setServerError(err?.data?.message || "Unable to save doctor");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteDoctor(deleteTarget._id || deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      setServerError(err?.data?.message || "Unable to delete doctor");
    }
  };

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <h1>Doctors</h1>
          <p className="muted">
            Manage clinic doctors. Use Active / Inactive to control who can take
            new appointments. Dashboard “Active doctors” counts only Active ones.
          </p>
        </div>
        <Button onClick={openCreate}>Add doctor</Button>
      </div>

      <div className="toolbar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email, phone, specialization"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isError ? <Alert>{error || "Failed to load doctors"}</Alert> : null}
      {serverError && !modalMode ? <Alert>{serverError}</Alert> : null}

      {isLoading && doctors.length === 0 ? (
        <Spinner label="Loading doctors..." />
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="Try another search or add a new doctor."
          action={<Button onClick={openCreate}>Add doctor</Button>}
        />
      ) : (
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Contact</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor._id || doctor.id}>
                    <td>
                      <Link
                        className="text-link"
                        to={`/doctors/${doctor._id || doctor.id}`}
                      >
                        {doctor.name}
                      </Link>
                    </td>
                    <td>{doctor.specialization}</td>
                    <td>
                      <div>{doctor.email}</div>
                      <div className="muted">{doctor.phone}</div>
                    </td>
                    <td>{doctor.availability}</td>
                    <td>
                      <Badge tone={doctor.isActive ? "success" : "neutral"}>
                        {doctor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="row-actions">
                      <Button variant="secondary" onClick={() => openEdit(doctor)}>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setServerError("");
                          setDeleteTarget(doctor);
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
          title={modalMode === "create" ? "Add doctor" : "Edit doctor"}
          onClose={closeModal}
        >
          <DoctorForm
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
          title="Delete doctor"
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
            Delete <strong>{deleteTarget.name}</strong>? This cannot be undone.
          </p>
        </Modal>
      ) : null}
    </section>
  );
}
