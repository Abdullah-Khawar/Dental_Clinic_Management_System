export function Spinner({ label = "Loading..." }) {
  return (
    <div className="state-box" role="status">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
