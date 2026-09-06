export function EmptyState({ title, description, action }) {
  return (
    <div className="state-box empty-state">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action || null}
    </div>
  );
}
