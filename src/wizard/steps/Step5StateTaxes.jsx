import { FormField, Banner } from '../../shell/Primitives.jsx';

const NO_INCOME_TAX_STATES = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'];

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'District of Columbia' },
];

export default function Step5StateTaxes({ data, onChange, errors }) {
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange({ ...data, [field]: value });
  };

  const noTax = data.stateCode && NO_INCOME_TAX_STATES.includes(data.stateCode);

  return (
    <div>
      <Banner variant="info" icon="info" title="State withholding is based on the employee's state form">
        Have the employee complete their state's equivalent of a W-4 (e.g. Form IT-2104 in New York, DE-4 in California). Use values from that form below.
      </Banner>

      <div style={{ marginTop: 24 }}>
        {/* State of Residence */}
        <div style={{ marginBottom: 16 }}>
          <FormField label="State of Residence / Work State" required error={!!errors.stateCode} hint={errors.stateCode}>
            <select
              className={`form-input${errors.stateCode ? ' error' : ''}`}
              value={data.stateCode}
              onChange={set('stateCode')}
            >
              <option value="">Select state…</option>
              {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
          </FormField>
        </div>

        {noTax && (
          <Banner variant="success" icon="check-circle" title={`${data.stateCode} has no state income tax`}>
            Employees in this state are not subject to state income tax withholding. No additional information is required for this step.
          </Banner>
        )}

        {data.stateCode && !noTax && (
          <>
            {/* Filing Status for State */}
            <div style={{ marginBottom: 16 }}>
              <FormField label="State Filing Status" required error={!!errors.stateFilingStatus} hint={errors.stateFilingStatus}>
                <select
                  className={`form-input${errors.stateFilingStatus ? ' error' : ''}`}
                  value={data.stateFilingStatus}
                  onChange={set('stateFilingStatus')}
                >
                  <option value="">Select filing status…</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="head">Head of Household</option>
                </select>
              </FormField>
            </div>

            {/* Allowances + Extra Withholding */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <FormField label="State Allowances / Exemptions" hint="Number of allowances claimed on state form">
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="1"
                  value={data.stateAllowances}
                  onChange={set('stateAllowances')}
                  placeholder="0"
                />
              </FormField>
              <FormField label="Extra State Withholding per Period" hint="Additional amount in dollars">
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
                    value={data.stateExtraWithholding}
                    onChange={set('stateExtraWithholding')}
                    placeholder="0"
                  />
                </div>
              </FormField>
            </div>

            {/* State Exemption */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '14px 16px', borderRadius: 8,
              background: 'var(--color-warning-surface)', border: '1px solid #fcd34d',
            }}>
              <input
                type="checkbox"
                id="stateExempt"
                checked={data.stateExempt}
                onChange={set('stateExempt')}
                style={{ marginTop: 2, accentColor: 'var(--color-primary)', width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }}
              />
              <label htmlFor="stateExempt" style={{ fontSize: 14, color: 'var(--color-warning-text)', cursor: 'pointer', lineHeight: 1.5 }}>
                <strong>Claim exemption from state income tax withholding</strong>
                <br />
                <span style={{ fontSize: 12 }}>
                  Only check if the employee has claimed exemption on their state withholding form and qualifies under state law.
                </span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
