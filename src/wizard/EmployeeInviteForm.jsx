import { useState } from 'react';
import { FormField } from '../shell/Primitives.jsx';
import { LucideIcon } from '../shell/Shell.jsx';

const EMPLOYEE_TASKS = [
  { icon: 'user',       label: 'Personal info',         detail: 'Name, SSN, date of birth, marital status' },
  { icon: 'map-pin',    label: 'Home address',           detail: 'Mailing address for tax purposes'          },
  { icon: 'landmark',   label: 'Federal tax (W-4)',      detail: 'Filing status, withholding adjustments'    },
  { icon: 'building-2', label: 'State tax withholding',  detail: 'State filing status and allowances'        },
];

function PendingState({ data, onAddAnother, onEditManually }) {
  const [resent, setResent] = useState(false);

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Status card */}
      <div style={{
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 24,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-raised)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--color-primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, flexShrink: 0,
            }}>
              {data.firstName?.[0]}{data.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-default)' }}>
                {data.firstName} {data.lastName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{data.email}</div>
            </div>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 'var(--radius-full)',
            fontSize: 11, fontWeight: 700,
            background: 'var(--color-warning-surface)',
            color: 'var(--color-warning-text)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-warning-text)' }} />
            Awaiting setup
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 20px 16px' }}>
          {/* Invite sent confirmation */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '12px 14px', borderRadius: 8, marginBottom: 20,
            background: 'var(--color-success-surface)',
            border: '1px solid #86efac',
          }}>
            <LucideIcon name="send" size={14} color="var(--color-success-text)" style={{ marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success-text)' }}>
                Setup invite sent to {data.email}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-success-text)', opacity: 0.85, marginTop: 2 }}>
                Invitations expire after 7 days.{' '}
                <button
                  onClick={() => setResent(true)}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, fontWeight: 600, color: 'var(--color-success-text)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {resent ? 'Sent!' : 'Resend'}
                </button>
              </div>
            </div>
          </div>

          {/* What employer entered */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Entered by you
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Hire Date',     value: data.hireDate     },
                { label: 'Job Title',     value: data.title        },
                { label: 'Pay Schedule',  value: data.paySchedule ? ({ weekly: 'Weekly', biweekly: 'Bi-Weekly', semimonthly: 'Semi-Monthly', monthly: 'Monthly' })[data.paySchedule] : '—' },
                { label: 'Pay',           value: data.payRate ? `$${Number(data.payRate).toLocaleString()} / ${data.payType === 'hourly' ? 'hr' : 'yr'}` : '—' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-default)', fontWeight: 500 }}>{item.value || '—'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* What employee needs to complete */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Employee will complete
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EMPLOYEE_TASKS.map(task => (
                <div key={task.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <LucideIcon name={task.icon} size={13} color="var(--text-muted)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-default)' }}>{task.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--surface-raised)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={onEditManually}
            style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}
          >
            Enter their info manually instead →
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            You'll be notified when they complete setup.
          </span>
        </div>
      </div>

      <button onClick={onAddAnother} className="btn btn-secondary">
        Add another employee
      </button>
    </div>
  );
}

export default function EmployeeInviteForm({ onComplete, onSwitchToManual }) {
  const [data, setData] = useState({
    firstName: '', lastName: '', email: '',
    hireDate: '', title: '', paySchedule: '', payType: '', payRate: '',
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = field => e => setData(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!data.firstName.trim()) e.firstName = 'Required';
    if (!data.lastName.trim())  e.lastName  = 'Required';
    if (!data.email.trim())     e.email     = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email';
    if (!data.hireDate)         e.hireDate  = 'Required';
    if (!data.title.trim())     e.title     = 'Required';
    return e;
  };

  const handleSend = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <PendingState
        data={data}
        onAddAnother={() => setSent(false)}
        onEditManually={onSwitchToManual}
      />
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }}>

      {/* Form */}
      <div>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-default)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
            Add Employee: Send Invite
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
            Enter the basics — your employee will complete the rest securely from their own device.
          </p>
        </div>

        {/* Name + email */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 16 }}>
            Employee
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FormField label="First Name" required error={!!errors.firstName} hint={errors.firstName}>
              <input className={`form-input${errors.firstName ? ' error' : ''}`} value={data.firstName} onChange={set('firstName')} />
            </FormField>
            <FormField label="Last Name" required error={!!errors.lastName} hint={errors.lastName}>
              <input className={`form-input${errors.lastName ? ' error' : ''}`} value={data.lastName} onChange={set('lastName')} />
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="Work Email" required error={!!errors.email} hint={errors.email || 'Invite will be sent here'}>
              <input className={`form-input${errors.email ? ' error' : ''}`} type="email" value={data.email} onChange={set('email')} placeholder="name@company.com" />
            </FormField>
            <div />
          </div>
        </div>

        {/* Work info */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 16 }}>
            Position
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FormField label="Hire Date" required error={!!errors.hireDate} hint={errors.hireDate}>
              <input className={`form-input${errors.hireDate ? ' error' : ''}`} type="date" value={data.hireDate} onChange={set('hireDate')} />
            </FormField>
            <FormField label="Job Title" required error={!!errors.title} hint={errors.title}>
              <input className={`form-input${errors.title ? ' error' : ''}`} value={data.title} onChange={set('title')} placeholder="e.g. Barista, Shift Manager" />
            </FormField>
          </div>
        </div>

        {/* Pay info */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 16 }}>
            Pay <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>(optional — can be set later)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FormField label="Pay Schedule">
              <select className="form-input" value={data.paySchedule} onChange={set('paySchedule')}>
                <option value="">Select...</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="semimonthly">Semi-Monthly</option>
                <option value="monthly">Monthly</option>
              </select>
            </FormField>
            <FormField label="Pay Type">
              <select className="form-input" value={data.payType} onChange={set('payType')}>
                <option value="">Select...</option>
                <option value="salary">Salary</option>
                <option value="hourly">Hourly</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label={data.payType === 'hourly' ? 'Hourly Rate' : 'Annual Salary'}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}>$</span>
                <input className="form-input" style={{ paddingLeft: 24 }} type="number" min="0" value={data.payRate} onChange={set('payRate')} />
              </div>
            </FormField>
            <div />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleSend} className="btn btn-primary" style={{ gap: 8 }}>
            <LucideIcon name="send" size={14} color="currentColor" />
            Send Setup Invite
          </button>
          <button onClick={onSwitchToManual} className="btn btn-ghost" style={{ fontSize: 13 }}>
            Enter info manually instead
          </button>
        </div>
      </div>

      {/* What happens next panel */}
      <div style={{
        position: 'sticky', top: 28,
        border: '1px solid var(--border-subtle)',
        borderRadius: 8, overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-raised)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-default)' }}>What happens next</div>
        </div>
        <div style={{ padding: '16px' }}>
          {[
            { step: 1, icon: 'send',       title: 'Invite sent',             body: `${data.firstName || 'The employee'} receives an email with a secure link.` },
            { step: 2, icon: 'user',        title: 'Employee fills in info',  body: 'They enter their personal details, address, and tax withholding on their own device.' },
            { step: 3, icon: 'check-circle',title: 'You review & approve',    body: "You confirm everything looks right before they're added to payroll." },
          ].map((item, i) => (
            <div key={item.step} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 16 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--surface-brand-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <LucideIcon name={item.icon} size={13} color="var(--color-primary)" />
                </div>
                {i < 2 && <div style={{ width: 1, flex: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />}
              </div>
              <div style={{ paddingTop: 4, paddingBottom: i < 2 ? 12 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-default)', marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-raised)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            The employee's SSN and tax info go directly into the system — you never see them.
          </div>
        </div>
      </div>

    </div>
  );
}
