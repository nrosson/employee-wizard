import { Badge, MetaGrid } from '../../shell/Primitives.jsx';
import { LucideIcon } from '../../shell/Shell.jsx';

function SectionCard({ title, icon, children, onEdit, stepIndex }) {
  return (
    <div style={{
      border: '1px solid var(--border-subtle)',
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        background: 'var(--surface-raised)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LucideIcon name={icon} size={15} color="var(--color-primary)" />
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-default)' }}>{title}</span>
        </div>
        <button
          onClick={() => onEdit(stepIndex)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <LucideIcon name="pencil" size={11} color="var(--color-primary)" />
          Edit
        </button>
      </div>
      <div style={{ padding: '16px 18px' }}>
        {children}
      </div>
    </div>
  );
}

const PAY_SCHEDULE_LABELS = {
  weekly: 'Weekly', biweekly: 'Bi-Weekly', semimonthly: 'Semi-Monthly', monthly: 'Monthly',
};
const FILING_STATUS_LABELS = {
  single: 'Single / MFS', married: 'Married Filing Jointly', head: 'Head of Household',
};
const NO_TAX_STATES = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'];

export default function Step6Review({ formData, onEdit }) {
  const { personal, work, pay, federal, state } = formData;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const noStateTax = state.stateCode && NO_TAX_STATES.includes(state.stateCode);

  return (
    <div>
      {/* Payroll-ready badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px', borderRadius: 8, marginBottom: 28,
        background: 'var(--color-success-surface)',
        border: '1px solid #86efac',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--color-success-text)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <LucideIcon name="check" size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-success-text)' }}>
            Payroll Ready
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-success-text)', opacity: 0.85 }}>
            All required information has been collected. {fullName || 'This employee'} can be run on payroll immediately after saving.
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <SectionCard title="Personal Info" icon="user" onEdit={onEdit} stepIndex={0}>
        <MetaGrid items={[
          { label: 'Full Name',       value: fullName || '—' },
          { label: 'SSN',             value: personal.ssn ? `•••-••-${personal.ssn.slice(-4)}` : '—' },
          { label: 'Date of Birth',   value: personal.dob || '—' },
          { label: 'Marital Status',  value: personal.maritalStatus ? personal.maritalStatus.charAt(0).toUpperCase() + personal.maritalStatus.slice(1) : '—' },
          { label: 'Address',         value: [personal.address, personal.city, personal.state, personal.zip].filter(Boolean).join(', ') || '—' },
          { label: 'Phone',           value: personal.phone || '—' },
          { label: 'Email',           value: personal.email || '—' },
        ]} />
      </SectionCard>

      {/* Work Info */}
      <SectionCard title="Work Info" icon="briefcase" onEdit={onEdit} stepIndex={1}>
        <MetaGrid items={[
          { label: 'Location',       value: work.location ? work.location.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—' },
          { label: 'Hire Date',      value: work.hireDate || '—' },
          { label: 'Position Type',  value: work.positionType ? work.positionType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—' },
          { label: 'Job Title',      value: work.title || '—' },
          { label: 'Department',     value: work.department || '—' },
          { label: 'Manager',        value: work.manager || '—' },
        ]} />
      </SectionCard>

      {/* Pay Info */}
      <SectionCard title="Pay Info" icon="dollar-sign" onEdit={onEdit} stepIndex={2}>
        <MetaGrid items={[
          { label: 'Pay Schedule',     value: PAY_SCHEDULE_LABELS[pay.paySchedule] || '—' },
          { label: 'Pay Type',         value: pay.payType === 'hourly' ? 'Hourly' : pay.payType === 'salary' ? 'Salary' : '—' },
          { label: pay.payType === 'hourly' ? 'Hourly Rate' : 'Annual Salary', value: pay.payRate ? `$${Number(pay.payRate).toLocaleString()}` : '—' },
          { label: "Workers' Comp",    value: pay.workersComp || 'None' },
          { label: 'Owner / Officer',  value: pay.isOwner ? 'Yes' : 'No' },
        ]} />
      </SectionCard>

      {/* Federal Taxes */}
      <SectionCard title="Federal Taxes" icon="landmark" onEdit={onEdit} stepIndex={3}>
        {federal.federalExempt ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LucideIcon name="alert-triangle" size={15} color="var(--color-warning-text)" />
            <span style={{ fontSize: 13, color: 'var(--color-warning-text)', fontWeight: 600 }}>
              Exempt from federal income tax withholding
            </span>
          </div>
        ) : (
          <MetaGrid items={[
            { label: 'Filing Status',       value: FILING_STATUS_LABELS[federal.filingStatus] || '—' },
            { label: 'Multiple Jobs',       value: federal.multipleJobs ? 'Yes' : 'No' },
            { label: 'Dependent Credits',   value: federal.dependentsAmount ? `$${Number(federal.dependentsAmount).toLocaleString()}` : '$0' },
            { label: 'Other Income',        value: federal.otherIncome ? `$${Number(federal.otherIncome).toLocaleString()}` : '$0' },
            { label: 'Deductions',          value: federal.deductions ? `$${Number(federal.deductions).toLocaleString()}` : '$0' },
            { label: 'Extra Withholding',   value: federal.extraWithholding ? `$${Number(federal.extraWithholding).toLocaleString()}` : '$0' },
          ]} />
        )}
      </SectionCard>

      {/* State Taxes */}
      <SectionCard title="State Taxes" icon="map-pin" onEdit={onEdit} stepIndex={4}>
        {noStateTax ? (
          <div style={{ fontSize: 13, color: 'var(--color-success-text)', fontWeight: 600 }}>
            {state.stateCode} has no state income tax — no withholding required.
          </div>
        ) : state.stateExempt ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LucideIcon name="alert-triangle" size={15} color="var(--color-warning-text)" />
            <span style={{ fontSize: 13, color: 'var(--color-warning-text)', fontWeight: 600 }}>
              Exempt from {state.stateCode} state income tax withholding
            </span>
          </div>
        ) : (
          <MetaGrid items={[
            { label: 'State',                value: state.stateCode || '—' },
            { label: 'Filing Status',        value: FILING_STATUS_LABELS[state.stateFilingStatus] || '—' },
            { label: 'State Allowances',     value: state.stateAllowances || '0' },
            { label: 'Extra Withholding',    value: state.stateExtraWithholding ? `$${Number(state.stateExtraWithholding).toLocaleString()}` : '$0' },
          ]} />
        )}
      </SectionCard>
    </div>
  );
}
