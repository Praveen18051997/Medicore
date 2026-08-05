import { getStatusColor } from '../../utils/helpers';

export default function Badge({ children, variant, className = '' }) {
  const cls = variant ? `badge-${variant}` : getStatusColor(children);
  return <span className={`badge ${cls} ${className}`}>{children}</span>;
}
