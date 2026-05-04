import { FormField } from '../../shell/Primitives.jsx';
import SectionRow from '../SectionRow.jsx';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

export default function Step1PersonalInfo({ data, onChange, errors }) {
  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });
  const setCheck = (field) => (e) => onChange({ ...data, [field]: e.target.checked });

  return (
    <div>
      <SectionRow title="Personal Information">
        {/* First Name + Middle Name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="First Name" required error={!!errors.firstName} hint={errors.firstName}>
            <input
              className={`form-input${errors.firstName ? ' error' : ''}`}
              value={data.firstName}
              onChange={set('firstName')}
            />
          </FormField>
          <FormField label="Middle Name">
            <input className="form-input" value={data.middleName} onChange={set('middleName')} />
          </FormField>
        </div>

        {/* Last Name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Last Name" required error={!!errors.lastName} hint={errors.lastName}>
            <input
              className={`form-input${errors.lastName ? ' error' : ''}`}
              value={data.lastName}
              onChange={set('lastName')}
            />
          </FormField>
          <div />
        </div>

        {/* SSN + Birth Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Social Security Number" required error={!!errors.ssn} hint={errors.ssn}>
            <input
              className={`form-input${errors.ssn ? ' error' : ''}`}
              value={data.ssn}
              onChange={set('ssn')}
              placeholder="XXX-XX-XXXX"
              maxLength={11}
            />
          </FormField>
          <FormField label="Birth Date" required error={!!errors.dob} hint={errors.dob}>
            <input
              className={`form-input${errors.dob ? ' error' : ''}`}
              type="date"
              value={data.dob}
              onChange={set('dob')}
            />
          </FormField>
        </div>

        {/* Marital Status + Other Name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Marital Status" error={!!errors.maritalStatus} hint={errors.maritalStatus}>
            <select
              className={`form-input${errors.maritalStatus ? ' error' : ''}`}
              value={data.maritalStatus}
              onChange={set('maritalStatus')}
            >
              <option value="">Select...</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </FormField>
          <FormField label="Other Name / Maiden Name">
            <input className="form-input" value={data.maidenName} onChange={set('maidenName')} />
          </FormField>
        </div>
      </SectionRow>

      <SectionRow title="Contact Information" last>
        {/* Mailing Address */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Mailing Address" required error={!!errors.address} hint={errors.address}>
            <input
              className={`form-input${errors.address ? ' error' : ''}`}
              value={data.address}
              onChange={set('address')}
              placeholder="Enter an address"
            />
          </FormField>
          <div />
        </div>

        {/* Apt/Unit */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Apt, Unit, Flr, Ste, Bldg #">
            <input className="form-input" value={data.addressLine2} onChange={set('addressLine2')} />
          </FormField>
          <div />
        </div>

        {/* City + State + ZIP */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="City" required error={!!errors.city} hint={errors.city}>
            <input
              className={`form-input${errors.city ? ' error' : ''}`}
              value={data.city}
              onChange={set('city')}
            />
          </FormField>
          <FormField label="State" required error={!!errors.state} hint={errors.state}>
            <select
              className={`form-input${errors.state ? ' error' : ''}`}
              value={data.state}
              onChange={set('state')}
            >
              <option value="">Select...</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="ZIP Code" required error={!!errors.zip} hint={errors.zip}>
            <input
              className={`form-input${errors.zip ? ' error' : ''}`}
              value={data.zip}
              onChange={set('zip')}
              maxLength={10}
            />
          </FormField>
        </div>

        {/* Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Email" required error={!!errors.email} hint={errors.email}>
            <input
              className={`form-input${errors.email ? ' error' : ''}`}
              type="email"
              value={data.email}
              onChange={set('email')}
            />
          </FormField>
          <div />
        </div>

        {/* Portal invite checkbox */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
          <input
            type="checkbox"
            id="sendPortalInvite"
            checked={data.sendPortalInvite}
            onChange={setCheck('sendPortalInvite')}
            style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }}
          />
          <label htmlFor="sendPortalInvite" style={{ fontSize: 13, color: 'var(--text-default)', cursor: 'pointer', lineHeight: 1.5 }}>
            Send Portal Registration Email.{' '}
            <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--color-primary)' }}>
              Learn More ↗
            </a>
            <br />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Invitations are valid for 7 days after being sent.
            </span>
          </label>
        </div>

        {/* Cell Phone + Alternate Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Cell Phone" hint={errors.phone} error={!!errors.phone}>
            <input
              className={`form-input${errors.phone ? ' error' : ''}`}
              value={data.phone}
              onChange={set('phone')}
              placeholder="(555) 000-0000"
            />
          </FormField>
          <FormField label="Alternate Phone">
            <input className="form-input" value={data.altPhone} onChange={set('altPhone')} placeholder="(555) 000-0000" />
          </FormField>
        </div>
      </SectionRow>
    </div>
  );
}
