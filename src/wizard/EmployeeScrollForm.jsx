import { useState, useEffect, useRef } from 'react';
import { FormField, Banner } from '../shell/Primitives.jsx';
import SectionRow from './SectionRow.jsx';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

const NO_TAX_STATES = ['AK','FL','NV','NH','SD','TN','TX','WA','WY'];

const SECTIONS = [
  { id: 'personal',  label: 'Personal Info'   },
  { id: 'contact',   label: 'Contact Info'    },
  { id: 'work',      label: 'Work Details'    },
  { id: 'pay',       label: 'Pay Setup'       },
  { id: 'federal',   label: 'Federal Taxes'   },
  { id: 'state',     label: 'State Taxes'     },
];

const INITIAL = {
  firstName: '', middleName: '', lastName: '', ssn: '', dob: '',
  maritalStatus: '', maidenName: '',
  address: '', addressLine2: '', city: '', state: '', zip: '',
  email: '', phone: '', altPhone: '', sendPortalInvite: false,
  location: '', hireDate: '', positionType: '', title: '', department: '', manager: '', employeeId: '',
  paySchedule: '', payType: '', payRate: '', workersComp: '', isOwner: false,
  filingStatus: '', multipleJobs: false, dependentsAmount: '', otherIncome: '',
  deductions: '', extraWithholding: '', federalExempt: false,
  stateCode: '', stateFilingStatus: '', stateAllowances: '', stateExtraWithholding: '', stateExempt: false,
};

function validate(data) {
  const e = {};
  if (!data.firstName.trim())  e.firstName  = 'Required';
  if (!data.lastName.trim())   e.lastName   = 'Required';
  if (!data.ssn.trim())        e.ssn        = 'Required';
  if (!data.dob)               e.dob        = 'Required';
  if (!data.address.trim())    e.address    = 'Required';
  if (!data.city.trim())       e.city       = 'Required';
  if (!data.state)             e.state      = 'Required';
  if (!data.zip.trim())        e.zip        = 'Required';
  if (!data.email.trim())      e.email      = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email';
  if (!data.location)          e.location   = 'Required';
  if (!data.hireDate)          e.hireDate   = 'Required';
  if (!data.positionType)      e.positionType = 'Required';
  if (!data.title.trim())      e.title      = 'Required';
  if (!data.paySchedule)       e.paySchedule = 'Required';
  if (!data.payType)           e.payType    = 'Required';
  if (!data.payRate || Number(data.payRate) <= 0) e.payRate = 'Required';
  if (!data.federalExempt && !data.filingStatus) e.filingStatus = 'Required';
  if (!data.stateCode)         e.stateCode  = 'Required';
  const noTax = data.stateCode && NO_TAX_STATES.includes(data.stateCode);
  if (!noTax && !data.stateExempt && !data.stateFilingStatus) e.stateFilingStatus = 'Required';
  return e;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
      },
      { rootMargin: '-15% 0px -75% 0px', threshold: 0 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return [active, setActive];
}

function Field({ label, required, hint, error, children }) {
  return (
    <FormField label={label} required={required} hint={error || hint} error={!!error}>
      {children}
    </FormField>
  );
}

function inp(data, set, field, extra = {}) {
  return (
    <input
      className={`form-input${extra.error ? ' error' : ''}`}
      value={data[field]}
      onChange={e => set({ ...data, [field]: e.target.value })}
      {...extra}
    />
  );
}

export default function EmployeeScrollForm({ onComplete }) {
  const [data, setData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useActiveSection(SECTIONS.map(s => s.id));

  const set = field => e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'state' && !prev.stateCode) next.stateCode = value;
      return next;
    });
  };

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  const handleSubmit = () => {
    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrSection = SECTIONS.find(s =>
        Object.keys(errs).some(k => {
          if (s.id === 'personal') return ['firstName','lastName','ssn','dob','maritalStatus'].includes(k);
          if (s.id === 'contact')  return ['address','city','state','zip','email'].includes(k);
          if (s.id === 'work')     return ['location','hireDate','positionType','title'].includes(k);
          if (s.id === 'pay')      return ['paySchedule','payType','payRate'].includes(k);
          if (s.id === 'federal')  return ['filingStatus'].includes(k);
          if (s.id === 'state')    return ['stateCode','stateFilingStatus'].includes(k);
          return false;
        })
      );
      if (firstErrSection) scrollTo(firstErrSection.id);
      return;
    }
    onComplete({
      personal: data, work: data, pay: data, federal: data, state: data,
    });
  };

  const noTax = data.stateCode && NO_TAX_STATES.includes(data.stateCode);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 48, alignItems: 'start' }}>

      {/* ── Sticky section nav ── */}
      <nav style={{ position: 'sticky', top: 28, alignSelf: 'start' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12 }}>
          Sections
        </div>
        {SECTIONS.map(s => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', textAlign: 'left',
                padding: '7px 10px', marginBottom: 2,
                background: isActive ? 'var(--surface-brand-subtle)' : 'transparent',
                border: 'none', borderRadius: 6,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: isActive ? 'var(--color-primary)' : 'var(--border-default)',
                transition: 'background 150ms',
              }} />
              {s.label}
            </button>
          );
        })}

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
          >
            Add Employee
          </button>
          <button
            onClick={() => alert('Draft saved.')}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Save & Exit
          </button>
        </div>
      </nav>

      {/* ── Scrollable form ── */}
      <div>

        {/* Personal Info */}
        <div id="personal" style={{ scrollMarginTop: 28 }}>
          <SectionRow title="Personal Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="First Name" required error={errors.firstName}>
                <input className={`form-input${errors.firstName ? ' error' : ''}`} value={data.firstName} onChange={set('firstName')} />
              </Field>
              <Field label="Middle Name">
                <input className="form-input" value={data.middleName} onChange={set('middleName')} />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Last Name" required error={errors.lastName}>
                <input className={`form-input${errors.lastName ? ' error' : ''}`} value={data.lastName} onChange={set('lastName')} />
              </Field>
              <div />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Social Security Number" required error={errors.ssn}>
                <input className={`form-input${errors.ssn ? ' error' : ''}`} value={data.ssn} onChange={set('ssn')} placeholder="XXX-XX-XXXX" maxLength={11} />
              </Field>
              <Field label="Birth Date" required error={errors.dob}>
                <input className={`form-input${errors.dob ? ' error' : ''}`} type="date" value={data.dob} onChange={set('dob')} />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Marital Status">
                <select className="form-input" value={data.maritalStatus} onChange={set('maritalStatus')}>
                  <option value="">Select...</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </Field>
              <Field label="Other Name / Maiden Name">
                <input className="form-input" value={data.maidenName} onChange={set('maidenName')} />
              </Field>
            </div>
          </SectionRow>
        </div>

        {/* Contact Info */}
        <div id="contact" style={{ scrollMarginTop: 28 }}>
          <SectionRow title="Contact Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Mailing Address" required error={errors.address}>
                <input className={`form-input${errors.address ? ' error' : ''}`} value={data.address} onChange={set('address')} placeholder="Enter an address" />
              </Field>
              <div />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Apt, Unit, Flr, Ste, Bldg #">
                <input className="form-input" value={data.addressLine2} onChange={set('addressLine2')} />
              </Field>
              <div />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="City" required error={errors.city}>
                <input className={`form-input${errors.city ? ' error' : ''}`} value={data.city} onChange={set('city')} />
              </Field>
              <Field label="State" required error={errors.state}>
                <select className={`form-input${errors.state ? ' error' : ''}`} value={data.state} onChange={set('state')}>
                  <option value="">Select...</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="ZIP Code" required error={errors.zip}>
                <input className={`form-input${errors.zip ? ' error' : ''}`} value={data.zip} onChange={set('zip')} maxLength={10} />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Email" required error={errors.email}>
                <input className={`form-input${errors.email ? ' error' : ''}`} type="email" value={data.email} onChange={set('email')} />
              </Field>
              <div />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Cell Phone">
                <input className="form-input" value={data.phone} onChange={set('phone')} placeholder="(555) 000-0000" />
              </Field>
              <Field label="Alternate Phone">
                <input className="form-input" value={data.altPhone} onChange={set('altPhone')} placeholder="(555) 000-0000" />
              </Field>
            </div>
          </SectionRow>
        </div>

        {/* Work Details */}
        <div id="work" style={{ scrollMarginTop: 28 }}>
          <SectionRow title="Work Details">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Work Location" required error={errors.location}>
                <select className={`form-input${errors.location ? ' error' : ''}`} value={data.location} onChange={set('location')}>
                  <option value="">Select...</option>
                  <option value="main-office">Main Office</option>
                  <option value="remote">Remote</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="storefront">Storefront</option>
                </select>
              </Field>
              <Field label="Hire Date" required error={errors.hireDate}>
                <input className={`form-input${errors.hireDate ? ' error' : ''}`} type="date" value={data.hireDate} onChange={set('hireDate')} />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Position Type" required error={errors.positionType}>
                <select className={`form-input${errors.positionType ? ' error' : ''}`} value={data.positionType} onChange={set('positionType')}>
                  <option value="">Select...</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="contractor">Contractor</option>
                </select>
              </Field>
              <Field label="Job Title" required error={errors.title}>
                <input className={`form-input${errors.title ? ' error' : ''}`} value={data.title} onChange={set('title')} placeholder="e.g. Barista, Shift Manager" />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Department">
                <input className="form-input" value={data.department} onChange={set('department')} />
              </Field>
              <Field label="Manager / Supervisor">
                <input className="form-input" value={data.manager} onChange={set('manager')} />
              </Field>
            </div>
          </SectionRow>
        </div>

        {/* Pay Setup */}
        <div id="pay" style={{ scrollMarginTop: 28 }}>
          <SectionRow title="Pay Setup">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Pay Schedule" required error={errors.paySchedule}>
                <select className={`form-input${errors.paySchedule ? ' error' : ''}`} value={data.paySchedule} onChange={set('paySchedule')}>
                  <option value="">Select...</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-Weekly</option>
                  <option value="semimonthly">Semi-Monthly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </Field>
              <Field label="Pay Type" required error={errors.payType}>
                <select className={`form-input${errors.payType ? ' error' : ''}`} value={data.payType} onChange={set('payType')}>
                  <option value="">Select...</option>
                  <option value="salary">Salary</option>
                  <option value="hourly">Hourly</option>
                </select>
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label={data.payType === 'hourly' ? 'Hourly Rate' : 'Annual Salary'} required error={errors.payRate}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}>$</span>
                  <input className={`form-input${errors.payRate ? ' error' : ''}`} style={{ paddingLeft: 24 }} type="number" min="0" value={data.payRate} onChange={set('payRate')} />
                </div>
              </Field>
              <Field label="Workers' Comp Code" hint="Optional">
                <input className="form-input" value={data.workersComp} onChange={set('workersComp')} placeholder="e.g. 8810" />
              </Field>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <input type="checkbox" id="isOwner" checked={data.isOwner} onChange={set('isOwner')} style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }} />
              <label htmlFor="isOwner" style={{ fontSize: 13, color: 'var(--text-default)', cursor: 'pointer', lineHeight: 1.5 }}>
                Owner or Officer
                <br /><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Check if this employee is a business owner or corporate officer.</span>
              </label>
            </div>
          </SectionRow>
        </div>

        {/* Federal Taxes */}
        <div id="federal" style={{ scrollMarginTop: 28 }}>
          <SectionRow title="Federal Taxes">
            <div style={{ marginBottom: 16 }}>
              <Banner variant="info" icon="info" title="Use values from the employee's W-4 form">
                These values determine how much federal income tax to withhold each pay period.
              </Banner>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="W-4 Filing Status" required error={errors.filingStatus}>
                <select className={`form-input${errors.filingStatus ? ' error' : ''}`} value={data.filingStatus} onChange={set('filingStatus')} disabled={data.federalExempt}>
                  <option value="">Select...</option>
                  <option value="single">Single or Married filing separately</option>
                  <option value="married">Married filing jointly</option>
                  <option value="head">Head of household</option>
                </select>
              </Field>
              <div />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Dependent Tax Credit Amount" hint="From Step 3 of W-4">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}>$</span>
                  <input className="form-input" style={{ paddingLeft: 24 }} type="number" min="0" value={data.dependentsAmount} onChange={set('dependentsAmount')} placeholder="0" />
                </div>
              </Field>
              <Field label="Extra Withholding per Pay Period" hint="From Step 4c of W-4">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}>$</span>
                  <input className="form-input" style={{ paddingLeft: 24 }} type="number" min="0" value={data.extraWithholding} onChange={set('extraWithholding')} placeholder="0" />
                </div>
              </Field>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
              <input type="checkbox" id="multipleJobs" checked={data.multipleJobs} onChange={set('multipleJobs')} style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }} />
              <label htmlFor="multipleJobs" style={{ fontSize: 13, cursor: 'pointer', lineHeight: 1.5, color: 'var(--text-default)' }}>
                Multiple jobs or spouse also works (Step 2 of W-4)
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <input type="checkbox" id="federalExempt" checked={data.federalExempt} onChange={set('federalExempt')} style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }} />
              <label htmlFor="federalExempt" style={{ fontSize: 13, cursor: 'pointer', lineHeight: 1.5, color: 'var(--color-warning-text)' }}>
                Claim exemption from federal income tax withholding
              </label>
            </div>
          </SectionRow>
        </div>

        {/* State Taxes */}
        <div id="state" style={{ scrollMarginTop: 28 }}>
          <SectionRow title="State Taxes" last>
            <div style={{ marginBottom: 16 }}>
              <Banner variant="info" icon="info" title="Based on the employee's state withholding form">
                Use values from your employee's state equivalent of a W-4.
              </Banner>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="State of Residence / Work State" required error={errors.stateCode}>
                <select className={`form-input${errors.stateCode ? ' error' : ''}`} value={data.stateCode} onChange={set('stateCode')}>
                  <option value="">Select...</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <div />
            </div>
            {noTax && (
              <Banner variant="success" icon="check-circle" title={`${data.stateCode} has no state income tax`}>
                No state withholding required.
              </Banner>
            )}
            {data.stateCode && !noTax && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <Field label="State Filing Status" required error={errors.stateFilingStatus}>
                    <select className={`form-input${errors.stateFilingStatus ? ' error' : ''}`} value={data.stateFilingStatus} onChange={set('stateFilingStatus')}>
                      <option value="">Select...</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="head">Head of Household</option>
                    </select>
                  </Field>
                  <Field label="State Allowances" hint="From state form">
                    <input className="form-input" type="number" min="0" value={data.stateAllowances} onChange={set('stateAllowances')} placeholder="0" />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <Field label="Extra State Withholding" hint="Per pay period">
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}>$</span>
                      <input className="form-input" style={{ paddingLeft: 24 }} type="number" min="0" value={data.stateExtraWithholding} onChange={set('stateExtraWithholding')} placeholder="0" />
                    </div>
                  </Field>
                  <div />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <input type="checkbox" id="stateExempt" checked={data.stateExempt} onChange={set('stateExempt')} style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }} />
                  <label htmlFor="stateExempt" style={{ fontSize: 13, cursor: 'pointer', lineHeight: 1.5, color: 'var(--color-warning-text)' }}>
                    Claim exemption from state income tax withholding
                  </label>
                </div>
              </>
            )}
          </SectionRow>
        </div>

      </div>
    </div>
  );
}
