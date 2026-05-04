import { useState } from 'react';
import { Sidebar, TopBar, Footer } from './shell/Shell.jsx';
import EmployeeWizard from './wizard/EmployeeWizard.jsx';
import EmployeeScrollForm from './wizard/EmployeeScrollForm.jsx';
import EmployeeInviteForm from './wizard/EmployeeInviteForm.jsx';
import EmployeeProfile from './wizard/EmployeeProfile.jsx';

const VIEWS = [
  { id: 'wizard', label: 'Step-by-step wizard' },
  { id: 'scroll', label: 'Single page' },
  { id: 'invite', label: 'Send invite' },
];

export default function App() {
  const [page, setPage] = useState('payroll');
  const [notifs, setNotifs] = useState([]);
  const [submittedEmployee, setSubmittedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('wizard');

  const handleToggleRead = (id) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const handleMarkAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const handleComplete = (formData) => setSubmittedEmployee(formData);
  const handleAddAnother = () => setSubmittedEmployee(null);

  return (
    <div className="suite-layout">
      <Sidebar current={page} onNavigate={setPage} inboxUnread={0} />
      <div className="suite-main">
        <TopBar notifs={notifs} onToggleRead={handleToggleRead} onMarkAllRead={handleMarkAllRead} />
        <main className="suite-content">
          {submittedEmployee ? (
            <EmployeeProfile formData={submittedEmployee} onAddAnother={handleAddAnother} />
          ) : (
            <>
              {/* View toggle */}
              <div style={{
                display: 'inline-flex',
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: 3,
                marginBottom: 28,
              }}>
                {VIEWS.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setViewMode(v.id)}
                    style={{
                      padding: '5px 14px',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 150ms',
                      background: viewMode === v.id ? 'var(--surface-default)' : 'transparent',
                      color: viewMode === v.id ? 'var(--text-default)' : 'var(--text-muted)',
                      boxShadow: viewMode === v.id ? 'var(--shadow-xs)' : 'none',
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              {viewMode === 'wizard' && <EmployeeWizard onComplete={handleComplete} />}
              {viewMode === 'scroll' && <EmployeeScrollForm onComplete={handleComplete} />}
              {viewMode === 'invite' && (
                <EmployeeInviteForm
                  onComplete={handleComplete}
                  onSwitchToManual={() => setViewMode('wizard')}
                />
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
