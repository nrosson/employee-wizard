import { FormField, Banner } from '../../shell/Primitives.jsx';

export default function Step4FederalTaxes({ data, onChange, errors }) {
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange({ ...data, [field]: value });
  };

  return (
    <div>
      <Banner variant="info" icon="info" title="Use values from the employee's W-4 form">
        Ask your employee to complete a W-4. These values come directly from that form and determine how much federal income tax to withhold each pay period.
      </Banner>

      <div style={{ marginTop: 24 }}>
        {/* Filing Status */}
        <div style={{ marginBottom: 16 }}>
          <FormField label="W-4 Filing Status" required error={!!errors.filingStatus} hint={errors.filingStatus}>
            <select
              className={`form-input${errors.filingStatus ? ' error' : ''}`}
              value={data.filingStatus}
              onChange={set('filingStatus')}
            >
              <option value="">Select filing status…</option>
              <option value="single">Single or Married filing separately</option>
              <option value="married">Married filing jointly or Qualifying surviving spouse</option>
              <option value="head">Head of household</option>
            </select>
          </FormField>
        </div>

        {/* Multiple Jobs / Spouse Works */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '14px 16px', borderRadius: 8, marginBottom: 16,
          background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
        }}>
          <input
            type="checkbox"
            id="multipleJobs"
            checked={data.multipleJobs}
            onChange={set('multipleJobs')}
            style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }}
          />
          <label htmlFor="multipleJobs" style={{ fontSize: 14, color: 'var(--text-default)', cursor: 'pointer', lineHeight: 1.5 }}>
            <strong>Multiple jobs or spouse also works (Step 2 of W-4)</strong>
            <br />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Check if the employee or their spouse has multiple jobs and the combined income uses the Multiple Jobs Worksheet.
            </span>
          </label>
        </div>

        {/* Dependents + Other Income */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Dependent Tax Credit Amount" hint="From Step 3 of W-4 (in dollars)">
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none',
              }}>$</span>
              <input
                className="form-input"
                style={{ paddingLeft: 24 }}
                type="number"
                min="0"
                step="1"
                value={data.dependentsAmount}
                onChange={set('dependentsAmount')}
                placeholder="0"
              />
            </div>
          </FormField>
          <FormField label="Other Income (not from jobs)" hint="From Step 4a of W-4 (in dollars)">
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none',
              }}>$</span>
              <input
                className="form-input"
                style={{ paddingLeft: 24 }}
                type="number"
                min="0"
                step="1"
                value={data.otherIncome}
                onChange={set('otherIncome')}
                placeholder="0"
              />
            </div>
          </FormField>
        </div>

        {/* Deductions + Extra Withholding */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Deductions" hint="From Step 4b of W-4 (in dollars)">
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none',
              }}>$</span>
              <input
                className="form-input"
                style={{ paddingLeft: 24 }}
                type="number"
                min="0"
                step="1"
                value={data.deductions}
                onChange={set('deductions')}
                placeholder="0"
              />
            </div>
          </FormField>
          <FormField label="Extra Withholding per Pay Period" hint="From Step 4c of W-4 (in dollars)">
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none',
              }}>$</span>
              <input
                className="form-input"
                style={{ paddingLeft: 24 }}
                type="number"
                min="0"
                step="1"
                value={data.extraWithholding}
                onChange={set('extraWithholding')}
                placeholder="0"
              />
            </div>
          </FormField>
        </div>

        {/* Federal Exemption */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '14px 16px', borderRadius: 8,
          background: 'var(--color-warning-surface)', border: '1px solid #fcd34d',
        }}>
          <input
            type="checkbox"
            id="federalExempt"
            checked={data.federalExempt}
            onChange={set('federalExempt')}
            style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }}
          />
          <label htmlFor="federalExempt" style={{ fontSize: 14, color: 'var(--color-warning-text)', cursor: 'pointer', lineHeight: 1.5 }}>
            <strong>Claim exemption from federal income tax withholding</strong>
            <br />
            <span style={{ fontSize: 12 }}>
              Only check if the employee wrote "Exempt" on their W-4 and qualifies under IRS rules. No federal income tax will be withheld.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
