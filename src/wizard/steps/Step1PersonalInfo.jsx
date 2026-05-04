import { FormField } from '../../shell/Primitives.jsx';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

export default function Step1PersonalInfo({ data, onChange, errors }) {
  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  return (
    <div>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Enter the employee's personal information. All fields marked with an asterisk are required to complete payroll setup.
      </p>

      {/* Name row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <FormField label="First Name" required error={!!errors.firstName} hint={errors.firstName}>
          <input
            className={`form-input${errors.firstName ? ' error' : ''}`}
            value={data.firstName}
            onChange={set('firstName')}
            placeholder="Jane"
          />
        </FormField>
        <FormField label="Last Name" required error={!!errors.lastName} hint={errors.lastName}>
          <input
            className={`form-input${errors.lastName ? ' error' : ''}`}
            value={data.lastName}
            onChange={set('lastName')}
            placeholder="Smith"
          />
        </FormField>
      </div>

      {/* SSN + DOB */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <FormField label="Social Security Number" required error={!!errors.ssn} hint={errors.ssn || 'Format: XXX-XX-XXXX'}>
          <input
            className={`form-input${errors.ssn ? ' error' : ''}`}
            value={data.ssn}
            onChange={set('ssn')}
            placeholder="XXX-XX-XXXX"
            maxLength={11}
          />
        </FormField>
        <FormField label="Date of Birth" required error={!!errors.dob} hint={errors.dob}>
          <input
            className={`form-input${errors.dob ? ' error' : ''}`}
            type="date"
            value={data.dob}
            onChange={set('dob')}
          />
        </FormField>
      </div>

      {/* Marital Status */}
      <div style={{ marginBottom: 16 }}>
        <FormField label="Marital Status" required error={!!errors.maritalStatus} hint={errors.maritalStatus}>
          <select
            className={`form-input${errors.maritalStatus ? ' error' : ''}`}
            value={data.maritalStatus}
            onChange={set('maritalStatus')}
          >
            <option value="">Select status…</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </FormField>
      </div>

      {/* Address */}
      <div style={{ marginBottom: 16 }}>
        <FormField label="Street Address" required error={!!errors.address} hint={errors.address}>
          <input
            className={`form-input${errors.address ? ' error' : ''}`}
            value={data.address}
            onChange={set('address')}
            placeholder="123 Main St"
          />
        </FormField>
      </div>

      {/* City + State + Zip */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <FormField label="City" required error={!!errors.city} hint={errors.city}>
          <input
            className={`form-input${errors.city ? ' error' : ''}`}
            value={data.city}
            onChange={set('city')}
            placeholder="Springfield"
          />
        </FormField>
        <FormField label="State" required error={!!errors.state} hint={errors.state}>
          <select
            className={`form-input${errors.state ? ' error' : ''}`}
            value={data.state}
            onChange={set('state')}
          >
            <option value="">State</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="ZIP Code" required error={!!errors.zip} hint={errors.zip}>
          <input
            className={`form-input${errors.zip ? ' error' : ''}`}
            value={data.zip}
            onChange={set('zip')}
            placeholder="12345"
            maxLength={10}
          />
        </FormField>
      </div>

      {/* Phone + Email */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormField label="Phone Number" hint={errors.phone || 'Optional'} error={!!errors.phone}>
          <input
            className={`form-input${errors.phone ? ' error' : ''}`}
            value={data.phone}
            onChange={set('phone')}
            placeholder="(555) 000-0000"
          />
        </FormField>
        <FormField label="Email Address" required error={!!errors.email} hint={errors.email}>
          <input
            className={`form-input${errors.email ? ' error' : ''}`}
            type="email"
            value={data.email}
            onChange={set('email')}
            placeholder="jane@example.com"
          />
        </FormField>
      </div>
    </div>
  );
}
