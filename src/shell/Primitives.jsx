import { LucideIcon } from './Shell.jsx';

export function Button({ variant = 'primary', size, icon, children, ...rest }) {
  const cls = `btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''}`;
  return (
    <button className={cls} {...rest}>
      {icon ? <LucideIcon name={icon} size={14} color="currentColor" /> : null}
      {children}
    </button>
  );
}

export function Badge({ variant = 'neutral', dot, children }) {
  return (
    <span className={`badge badge-${variant}`}>
      {dot ? <span className="badge-dot" /> : null}
      {children}
    </span>
  );
}

export function Banner({ variant = 'info', icon, title, children }) {
  return (
    <div className={`banner banner-${variant}`}>
      {icon && <span className="banner-icon"><LucideIcon name={icon} size={16} color="currentColor" /></span>}
      <div>
        {title && <div className="banner-title">{title}</div>}
        <div className="banner-message">{children}</div>
      </div>
    </div>
  );
}

export function FormField({ label, hint, error, required, children }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span style={{ color: 'var(--color-error-text)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {hint ? <span className={`form-hint${error ? ' error' : ''}`}>{hint}</span> : null}
    </div>
  );
}

export function Card({ title, badge, footer, children }) {
  return (
    <div className="card">
      {(title || badge) && (
        <div className="card-header">
          <span className="card-title">{title}</span>
          {badge}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

export function MetaGrid({ items }) {
  return (
    <div className="meta-grid">
      {items.map((m, i) => (
        <div className="meta-item" key={i}>
          <span className="meta-label">{m.label}</span>
          <span className="meta-value">{m.value || <span style={{ color: 'var(--text-muted)' }}>—</span>}</span>
        </div>
      ))}
    </div>
  );
}
