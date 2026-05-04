import { FormField } from '../../shell/Primitives.jsx';
import SectionRow from '../SectionRow.jsx';

export default function Step2WorkInfo({ data, onChange, errors }) {
  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  return (
    <div>
      <SectionRow title="Employment Details">
        {/* Location + Hire Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Work Location" required error={!!errors.location} hint={errors.location}>
            <select
              className={`form-input${errors.location ? ' error' : ''}`}
              value={data.location}
              onChange={set('location')}
            >
              <option value="">Select...</option>
              <option value="main-office">Main Office</option>
              <option value="remote">Remote</option>
              <option value="warehouse">Warehouse</option>
              <option value="storefront">Storefront</option>
            </select>
          </FormField>
          <FormField label="Hire Date" required error={!!errors.hireDate} hint={errors.hireDate}>
            <input
              className={`form-input${errors.hireDate ? ' error' : ''}`}
              type="date"
              value={data.hireDate}
              onChange={set('hireDate')}
            />
          </FormField>
        </div>

        {/* Position Type + Job Title */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Position Type" required error={!!errors.positionType} hint={errors.positionType}>
            <select
              className={`form-input${errors.positionType ? ' error' : ''}`}
              value={data.positionType}
              onChange={set('positionType')}
            >
              <option value="">Select...</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="seasonal">Seasonal</option>
              <option value="contractor">Contractor</option>
            </select>
          </FormField>
          <FormField label="Job Title" required error={!!errors.title} hint={errors.title}>
            <input
              className={`form-input${errors.title ? ' error' : ''}`}
              value={data.title}
              onChange={set('title')}
              placeholder="e.g. Barista, Shift Manager"
            />
          </FormField>
        </div>

        {/* Department + Manager */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Department">
            <input className="form-input" value={data.department} onChange={set('department')} placeholder="e.g. Operations" />
          </FormField>
          <FormField label="Manager / Supervisor">
            <input className="form-input" value={data.manager} onChange={set('manager')} placeholder="Full name" />
          </FormField>
        </div>

        {/* Employee ID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Employee ID" hint="Leave blank to auto-assign">
            <input className="form-input" value={data.employeeId} onChange={set('employeeId')} placeholder="Auto-assigned" />
          </FormField>
          <div />
        </div>
      </SectionRow>
    </div>
  );
}
