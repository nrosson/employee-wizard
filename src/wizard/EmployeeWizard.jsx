import { useState } from 'react';
import Stepper from './Stepper.jsx';
import WizardNav from './WizardNav.jsx';
import Step1PersonalInfo from './steps/Step1PersonalInfo.jsx';
import Step2WorkInfo from './steps/Step2WorkInfo.jsx';
import Step3PayInfo from './steps/Step3PayInfo.jsx';
import Step4FederalTaxes from './steps/Step4FederalTaxes.jsx';
import Step5StateTaxes from './steps/Step5StateTaxes.jsx';
import Step6Review from './steps/Step6Review.jsx';

const STEP_TITLES = [
  'Personal Info',
  'Work Info',
  'Pay Info',
  'Federal Taxes',
  'State Taxes',
  'Review & Confirm',
];

const INITIAL_FORM = {
  personal: {
    firstName: '', lastName: '', ssn: '', dob: '', maritalStatus: '',
    address: '', city: '', state: '', zip: '', phone: '', email: '',
  },
  work: {
    location: '', hireDate: '', positionType: '', title: '',
    department: '', manager: '', employeeId: '',
  },
  pay: {
    paySchedule: '', payType: '', payRate: '', workersComp: '', isOwner: false,
  },
  federal: {
    filingStatus: '', multipleJobs: false,
    dependentsAmount: '', otherIncome: '', deductions: '',
    extraWithholding: '', federalExempt: false,
  },
  state: {
    stateCode: '', stateFilingStatus: '', stateAllowances: '',
    stateExtraWithholding: '', stateExempt: false,
  },
};

const SECTION_KEYS = ['personal', 'work', 'pay', 'federal', 'state'];
const NO_TAX_STATES = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'];

function validateStep(step, formData) {
  const errors = {};
  if (step === 0) {
    const p = formData.personal;
    if (!p.firstName.trim()) errors.firstName = 'First name is required';
    if (!p.lastName.trim()) errors.lastName = 'Last name is required';
    if (!p.ssn.trim()) errors.ssn = 'SSN is required';
    else if (!/^\d{3}-\d{2}-\d{4}$/.test(p.ssn) && !/^\d{9}$/.test(p.ssn.replace(/-/g, '')))
      errors.ssn = 'Please enter a valid SSN (XXX-XX-XXXX)';
    if (!p.dob) errors.dob = 'Date of birth is required';
    if (!p.maritalStatus) errors.maritalStatus = 'Marital status is required';
    if (!p.address.trim()) errors.address = 'Street address is required';
    if (!p.city.trim()) errors.city = 'City is required';
    if (!p.state) errors.state = 'State is required';
    if (!p.zip.trim()) errors.zip = 'ZIP code is required';
    if (!p.email.trim()) errors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
      errors.email = 'Please enter a valid email address';
  }

  if (step === 1) {
    const w = formData.work;
    if (!w.location) errors.location = 'Work location is required';
    if (!w.hireDate) errors.hireDate = 'Hire date is required';
    if (!w.positionType) errors.positionType = 'Position type is required';
    if (!w.title.trim()) errors.title = 'Job title is required';
  }

  if (step === 2) {
    const p = formData.pay;
    if (!p.paySchedule) errors.paySchedule = 'Pay schedule is required';
    if (!p.payType) errors.payType = 'Pay type is required';
    if (!p.payRate || Number(p.payRate) <= 0) errors.payRate = 'Pay rate must be greater than 0';
  }

  if (step === 3) {
    const f = formData.federal;
    if (!f.federalExempt && !f.filingStatus) errors.filingStatus = 'Filing status is required';
  }

  if (step === 4) {
    const s = formData.state;
    if (!s.stateCode) errors.stateCode = 'State is required';
    const noTax = s.stateCode && NO_TAX_STATES.includes(s.stateCode);
    if (!noTax && !s.stateExempt && !s.stateFilingStatus) {
      errors.stateFilingStatus = 'State filing status is required';
    }
  }

  return errors;
}

export default function EmployeeWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const updateSection = (key) => (data) =>
    setFormData(prev => ({ ...prev, [key]: data }));

  const handleContinue = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

    if (currentStep < STEP_TITLES.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submit
      onComplete(formData);
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (step) => {
    if (completedSteps.has(step)) {
      setErrors({});
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveExit = () => {
    alert('Draft saved. You can return to this employee from the employee list.');
  };

  const stepProps = [
    { data: formData.personal, onChange: updateSection('personal') },
    { data: formData.work,     onChange: updateSection('work')     },
    { data: formData.pay,      onChange: updateSection('pay')      },
    { data: formData.federal,  onChange: updateSection('federal')  },
    { data: formData.state,    onChange: updateSection('state')    },
  ];

  return (
    <div>
      {/* Page heading */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <a
            href="#"
            onClick={e => { e.preventDefault(); handleSaveExit(); }}
            style={{ fontSize: 13, color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            ← Employees
          </a>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-default)', margin: '0 0 4px' }}>
          Add New Employee
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
          Step {currentStep + 1} of {STEP_TITLES.length} — {STEP_TITLES[currentStep]}
        </p>
      </div>

      {/* Stepper */}
      <Stepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Step content */}
      <div style={{
        background: 'var(--surface-default)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: '24px 28px',
      }}>
        {currentStep === 0 && <Step1PersonalInfo {...stepProps[0]} errors={errors} />}
        {currentStep === 1 && <Step2WorkInfo     {...stepProps[1]} errors={errors} />}
        {currentStep === 2 && <Step3PayInfo      {...stepProps[2]} errors={errors} />}
        {currentStep === 3 && <Step4FederalTaxes {...stepProps[3]} errors={errors} />}
        {currentStep === 4 && <Step5StateTaxes   {...stepProps[4]} errors={errors} />}
        {currentStep === 5 && (
          <Step6Review
            formData={formData}
            onEdit={(step) => {
              setErrors({});
              setCurrentStep(step);
            }}
          />
        )}
      </div>

      {/* Nav */}
      <WizardNav
        currentStep={currentStep}
        totalSteps={STEP_TITLES.length}
        onBack={handleBack}
        onContinue={handleContinue}
        onSaveExit={handleSaveExit}
      />
    </div>
  );
}
