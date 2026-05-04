import { useState, useEffect } from 'react';
import { Badge, MetaGrid, Card } from '../shell/Primitives.jsx';
import { LucideIcon } from '../shell/Shell.jsx';

const PAY_SCHEDULE_LABELS = {
  weekly: 'Weekly', biweekly: 'Bi-Weekly', semimonthly: 'Semi-Monthly', monthly: 'Monthly',
};

export default function EmployeeProfile({ formData, onAddAnother }) {
  const [toastVisible, setToastVisible] = useState(true);
  const { personal, work, pay } = formData;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();

  useEffect(() => {
    const t = setTimeout(() => setToastVisible(false), 4500);
    return () => clearTimeout(t);
  }, []);

  const tabs = ['Overview', 'Pay Info', 'Tax Info', 'Documents', 'Time Off', 'History'];
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div>
      {/* Success toast */}
      {toastVisible && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 999,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 20px', borderRadius: 8,
          background: '#1c1c1e', color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          fontSize: 14, fontWeight: 500,
          animation: 'fadeIn 200ms ease',
          minWidth: 300,
        }}>
          <LucideIcon name="check-circle" size={16} color="#4ade80" />
          <span><strong>{fullName}</strong> has been added and is payroll-ready.</span>
        </div>
      )}

      {/* Profile header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--color-primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, flexShrink: 0,
          }}>
            {personal.firstName?.[0]}{personal.lastName?.[0]}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-default)' }}>
                {fullName}
              </h1>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                background: 'var(--color-success-surface)', color: 'var(--color-success-text)',
                border: '1px solid #86efac',
              }}>
                <LucideIcon name="check-circle" size={12} color="var(--color-success-text)" />
                Payroll Ready
              </span>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {work.title || 'Employee'} {work.location ? `· ${work.location.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}` : ''}
              {work.hireDate ? ` · Hired ${work.hireDate}` : ''}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onAddAnother}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 6,
              border: '1px solid var(--color-primary)',
              background: 'transparent', color: 'var(--color-primary)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <LucideIcon name="user-plus" size={14} color="currentColor" />
            Add Another Employee
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 6,
            border: '1px solid var(--border-input)',
            background: 'var(--surface-default)', color: 'var(--text-default)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            <LucideIcon name="more-horizontal" size={14} color="currentColor" />
            Actions
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 24,
      }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 18px',
              background: 'none', border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 600 : 500,
              fontSize: 13, cursor: 'pointer',
              marginBottom: -1,
              transition: 'color 150ms',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content — Overview */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card title="Personal Details">
            <MetaGrid items={[
              { label: 'Email',          value: personal.email || '—' },
              { label: 'Phone',          value: personal.phone || '—' },
              { label: 'Date of Birth',  value: personal.dob || '—' },
              { label: 'Marital Status', value: personal.maritalStatus ? personal.maritalStatus.charAt(0).toUpperCase() + personal.maritalStatus.slice(1) : '—' },
              { label: 'Address',        value: [personal.address, personal.city, personal.state, personal.zip].filter(Boolean).join(', ') || '—' },
            ]} />
          </Card>

          <Card title="Employment">
            <MetaGrid items={[
              { label: 'Title',           value: work.title || '—' },
              { label: 'Position Type',   value: work.positionType ? work.positionType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—' },
              { label: 'Department',      value: work.department || '—' },
              { label: 'Manager',         value: work.manager || '—' },
              { label: 'Pay Schedule',    value: PAY_SCHEDULE_LABELS[pay.paySchedule] || '—' },
              { label: pay.payType === 'hourly' ? 'Hourly Rate' : 'Annual Salary', value: pay.payRate ? `$${Number(pay.payRate).toLocaleString()}` : '—' },
            ]} />
          </Card>

          <Card title="Payroll Status" badge={<span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: 'var(--color-success-surface)', color: 'var(--color-success-text)',
          }}><LucideIcon name="check" size={10} color="currentColor" />Ready</span>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Federal taxes configured', done: true },
                { label: 'State taxes configured', done: true },
                { label: 'Pay rate set', done: !!pay.payRate },
                { label: 'Pay schedule assigned', done: !!pay.paySchedule },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    background: item.done ? 'var(--color-success-surface)' : 'var(--surface-raised)',
                    border: `1px solid ${item.done ? '#86efac' : 'var(--border-subtle)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.done && <LucideIcon name="check" size={10} color="var(--color-success-text)" />}
                  </div>
                  <span style={{ color: item.done ? 'var(--text-default)' : 'var(--text-muted)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab !== 'Overview' && (
        <div style={{
          padding: '40px 0', textAlign: 'center',
          color: 'var(--text-muted)', fontSize: 14,
        }}>
          <LucideIcon name="layout" size={24} color="var(--border-input)" />
          <div style={{ marginTop: 12 }}>{activeTab} tab — content goes here</div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}
