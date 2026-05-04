import { FormField } from '../../shell/Primitives.jsx';
import SectionRow from '../SectionRow.jsx';

export default function Step3PayInfo({ data, onChange, errors }) {
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange({ ...data, [field]: value });
  };

  return (
    <div>
      <SectionRow title="Pay Schedule">
        {/* Pay Schedule + Pay Type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Pay Schedule" required error={!!errors.paySchedule} hint={errors.paySchedule}>
            <select
              className={`form-input${errors.paySchedule ? ' error' : ''}`}
              value={data.paySchedule}
              onChange={set('paySchedule')}
            >
              <option value="">Select...</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="semimonthly">Semi-Monthly</option>
              <option value="monthly">Monthly</option>
            </select>
          </FormField>
          <FormField label="Pay Type" required error={!!errors.payType} hint={errors.payType}>
            <select
              className={`form-input${errors.payType ? ' error' : ''}`}
              value={data.payType}
              onChange={set('payType')}
            >
              <option value="">Select...</option>
              <option value="salary">Salary</option>
              <option value="hourly">Hourly</option>
            </select>
          </FormField>
        </div>

        {/* Pay Rate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField
            label={data.payType === 'hourly' ? 'Hourly Rate' : 'Annual Salary'}
            required
            error={!!errors.payRate}
            hint={errors.payRate || (data.payType === 'hourly' ? 'Rate per hour in USD' : 'Annual gross in USD')}
          >
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none',
              }}>$</span>
              <input
                className={`form-input${errors.payRate ? ' error' : ''}`}
                style={{ paddingLeft: 24 }}
                type="number"
                min="0"
                step="0.01"
                value={data.payRate}
                onChange={set('payRate')}
                placeholder={data.payType === 'hourly' ? '15.00' : '52000'}
              />
            </div>
          </FormField>
          <div />
        </div>
      </SectionRow>

      <SectionRow title="Additional Details" last>
        {/* Workers' Comp */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Workers' Compensation Code" hint="Optional — state class code">
            <input className="form-input" value={data.workersComp} onChange={set('workersComp')} placeholder="e.g. 8810" />
          </FormField>
          <div />
        </div>

        {/* Owner/Officer */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <input
            type="checkbox"
            id="isOwner"
            checked={data.isOwner}
            onChange={set('isOwner')}
            style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }}
          />
          <label htmlFor="isOwner" style={{ fontSize: 13, color: 'var(--text-default)', cursor: 'pointer', lineHeight: 1.5 }}>
            Owner or Officer
            <br />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Check if this employee is a business owner or corporate officer. This may affect certain tax calculations.
            </span>
          </label>
        </div>
      </SectionRow>
    </div>
  );
}
