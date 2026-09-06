export function Alert({ tone = "error", children, className = "" }) {
  if (!children) return null;
  return <div className={`alert alert-${tone} ${className}`.trim()}>{children}</div>;
}
