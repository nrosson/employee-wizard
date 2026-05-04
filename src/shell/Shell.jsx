import { useState, useEffect, useRef } from 'react';
import * as icons from 'lucide-react';

// Dynamic icon lookup for Lucide (converts kebab-case to PascalCase)
export function LucideIcon({ name, size = 16, color = 'currentColor', style: extra }) {
  const iconName = name
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  const Icon = icons[iconName];
  if (!Icon) return <span style={{ width: size, height: size, display: 'inline-block' }} />;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color, flexShrink: 0, ...extra,
    }}>
      <Icon size={size} color="currentColor" />
    </span>
  );
}

const NAV_ITEMS = [
  { id: 'dashboard',    icon: 'home',         label: 'Dashboard'   },
  { id: 'inbox',        icon: 'inbox',        label: 'Inbox',       badge: true },
  { id: 'accounting',   icon: 'book-open',    label: 'Accounting',  expandable: true },
  { id: 'payroll',      icon: 'dollar-sign',  label: 'Payroll',     expandable: true },
  { id: 'partners',     icon: 'handshake',    label: 'Partners',    expandable: true },
  { id: 'reports',      icon: 'bar-chart-2',  label: 'Reports'     },
  { id: 'settings',     icon: 'settings',     label: 'Settings'    },
  { id: 'marketplace',  icon: 'store',        label: 'Marketplace' },
  { id: 'company-list', icon: 'building-2',   label: 'Company List'},
];

const LEVEL_STYLE = {
  urgent:    { bg: 'var(--color-error-surface)',   fg: 'var(--color-error-text)'   },
  reminder:  { bg: 'var(--color-warning-surface)', fg: 'var(--color-warning-text)' },
  important: { bg: 'var(--color-info-surface)',    fg: 'var(--color-info-text)'    },
  general:   { bg: 'var(--surface-raised)',        fg: 'var(--text-muted)'         },
};
const LEVEL_LABEL = { urgent: 'Urgent', reminder: 'Reminder', important: 'Important', general: 'Info' };

function NotifRow({ notif, onToggleRead }) {
  const [hov, setHov] = useState(false);
  const ls = LEVEL_STYLE[notif.level] || LEVEL_STYLE.general;
  const unread = !notif.read;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => { if (unread) onToggleRead?.(notif.id); }}
      style={{
        display: 'flex', gap: 12, padding: '11px 16px',
        borderLeft: `3px solid ${unread ? ls.fg : 'transparent'}`,
        background: hov ? 'var(--surface-raised)' : unread ? ls.bg : 'transparent',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer', transition: 'background 120ms',
      }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        background: ls.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <LucideIcon name={notif.icon} size={13} color={ls.fg} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
            padding: '2px 6px', borderRadius: 3, background: ls.bg, color: ls.fg,
          }}>{LEVEL_LABEL[notif.level]}</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{notif.time}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: unread ? 600 : 400, color: 'var(--text-default)', lineHeight: 1.35 }}>
          {notif.title}
        </div>
        {notif.preview && (
          <div style={{
            fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>{notif.preview}</div>
        )}
      </div>
    </div>
  );
}

export function BellButton({ notifs = [], onToggleRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('unread');
  const unreadCount = notifs.filter(n => !n.read).length;
  const shown = tab === 'unread' ? notifs.filter(n => !n.read) : notifs;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Notifications"
        style={{
          width: 36, height: 36, borderRadius: 8,
          border: '1px solid var(--border-input)',
          background: open ? 'var(--surface-raised)' : 'var(--surface-default)',
          cursor: 'pointer', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 150ms',
        }}>
        <LucideIcon name="bell" size={16} color="var(--text-secondary)" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -5, right: -5,
            minWidth: 18, height: 18, padding: '0 4px', borderRadius: 999,
            background: 'var(--color-error-text)', color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--surface-default)',
          }}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
            width: 400, maxHeight: 540,
            display: 'flex', flexDirection: 'column',
            background: 'var(--surface-default)',
            border: '1px solid var(--border-subtle)', borderRadius: 10,
            boxShadow: 'var(--shadow-md)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px 10px', borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{
                    padding: '1px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: 'var(--surface-brand-subtle)', color: 'var(--color-primary)',
                  }}>{unreadCount} new</span>
                )}
              </div>
              <button onClick={onMarkAllRead} disabled={unreadCount === 0} style={{
                background: 'none', border: 'none', fontSize: 12, fontWeight: 600,
                cursor: unreadCount === 0 ? 'default' : 'pointer',
                color: unreadCount === 0 ? 'var(--text-muted)' : 'var(--color-primary)',
              }}>Mark all read</button>
            </div>
            <div style={{ padding: '8px 12px 0', display: 'flex', gap: 3, flexShrink: 0 }}>
              {[['unread', `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`], ['all', 'All']].map(([k, lbl]) => (
                <button key={k} onClick={() => setTab(k)} style={{
                  padding: '5px 11px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                  background: tab === k ? 'var(--surface-brand-subtle)' : 'transparent',
                  color: tab === k ? 'var(--color-primary)' : 'var(--text-muted)',
                }}>{lbl}</button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid var(--border-subtle)', marginTop: 6 }}>
              {shown.length === 0
                ? <div style={{ padding: '48px 24px', textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>All caught up</div>
                : shown.map(n => <NotifRow key={n.id} notif={n} onToggleRead={onToggleRead} />)
              }
            </div>
            <div style={{
              padding: '10px 16px', borderTop: '1px solid var(--border-subtle)',
              background: 'var(--surface-raised)', flexShrink: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)' }}>
                Preferences
              </button>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--color-primary)' }}>
                View all messages →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function UserDropdown({ name = 'David Meyerson' }) {
  const [open, setOpen] = useState(false);
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const menuItems = [
    { label: 'My Profile',    icon: 'user'           },
    { label: 'Preferences',   icon: 'settings'       },
    { label: 'Give Feedback', icon: 'message-circle', divider: true },
    { label: 'Log Out',       icon: 'log-out',        divider: true },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 5px',
          background: open ? 'var(--surface-raised)' : 'transparent',
          border: '1px solid', borderColor: open ? 'var(--border-input)' : 'transparent',
          borderRadius: 8, cursor: 'pointer', transition: 'background 150ms, border-color 150ms',
        }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'var(--color-primary)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700,
        }}>{initials}</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-default)' }}>
          {name.split(' ')[0]}
        </span>
        <LucideIcon name="chevron-down" size={13} color="var(--text-muted)" />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100,
            width: 240, background: 'var(--surface-default)',
            border: '1px solid var(--border-subtle)', borderRadius: 10,
            boxShadow: 'var(--shadow-md)', padding: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 10px' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                background: 'var(--color-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
              }}>{initials}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-default)' }}>{name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Account owner</div>
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 4px' }} />
            <div
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 6,
                cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)',
                transition: 'background 120ms', marginBottom: 4,
              }}>
              <LucideIcon name="gift" size={14} color="var(--color-primary)" />
              Refer a friend and get $100
            </div>
            <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 4 }} />
            {menuItems.map(it => (
              <div key={it.label}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: it.divider ? '10px 10px 8px' : '8px 10px',
                  borderTop: it.divider ? '1px solid var(--border-subtle)' : 'none',
                  marginTop: it.divider ? 6 : 0,
                  borderRadius: 6, cursor: 'pointer', fontSize: 13, color: 'var(--text-default)',
                  transition: 'background 120ms',
                }}>
                <LucideIcon name={it.icon} size={14} color="var(--text-muted)" />
                {it.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function TopBar({ notifs = [], onToggleRead, onMarkAllRead }) {
  return (
    <header role="banner" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 56, borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-default)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-default)' }}>Riverbend Cafe LLC</span>
          <span style={{ color: 'var(--border-default)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>PS 265676</span>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, marginLeft: 2,
            padding: '3px 10px', background: 'transparent',
            border: '1px solid var(--color-primary)', borderRadius: 6,
            color: 'var(--color-primary)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>
            <LucideIcon name="refresh-cw" size={11} color="var(--color-primary)" />
            Switch
          </button>
        </div>
        <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none' }}>My Products</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="#" onClick={e => e.preventDefault()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none',
            marginRight: 4,
          }}>
          <LucideIcon name="help-circle" size={15} color="currentColor" />
          Get Help
        </a>
        <BellButton notifs={notifs} onToggleRead={onToggleRead} onMarkAllRead={onMarkAllRead} />
        <div style={{ width: 1, height: 22, background: 'var(--border-subtle)', margin: '0 2px' }} />
        <UserDropdown />
      </div>
    </header>
  );
}

export function Sidebar({ current, onNavigate, inboxUnread = 0 }) {
  return (
    <nav style={{ background: '#fff', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0, borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--color-primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, letterSpacing: '-0.5px',
          }}>P</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-default)', letterSpacing: '-0.2px' }}>Patriot Software</span>
        </div>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: '16px 10px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => {
          const active = current === item.id;
          return (
            <li key={item.id}>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate(item.id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  borderRadius: 6, textDecoration: 'none', fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                  background: active ? 'var(--surface-brand-subtle)' : 'transparent',
                  transition: 'background 150ms, color 150ms',
                }}>
                <LucideIcon name={item.icon} size={16} color="currentColor" />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && inboxUnread > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#fff',
                    background: 'var(--color-error-text)', padding: '1px 6px',
                    borderRadius: 999,
                  }}>{inboxUnread}</span>
                )}
                {item.expandable && <LucideIcon name="chevron-right" size={13} color="#aaa" />}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer role="contentinfo" style={{
      padding: '14px 0', borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-default)', display: 'flex', justifyContent: 'space-between',
      fontSize: 12, color: 'var(--text-muted)',
    }}>
      <div>© 2026 Patriot Software, LLC</div>
      <div style={{ display: 'flex', gap: 20 }}>
        {['Accessibility', 'Trademarks', 'Privacy Policy', 'Terms of Service'].map(l => (
          <a key={l} href="#" onClick={e => e.preventDefault()}
            style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{l}</a>
        ))}
      </div>
    </footer>
  );
}
