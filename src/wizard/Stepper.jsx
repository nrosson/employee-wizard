import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Personal Info' },
  { label: 'Work Info' },
  { label: 'Pay Info' },
  { label: 'Federal Taxes' },
  { label: 'State Taxes' },
  { label: 'Review & Confirm' },
];

export default function Stepper({ currentStep, completedSteps, onStepClick }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 0,
      marginBottom: 32,
      overflowX: 'auto',
      paddingBottom: 2,
    }}>
      {STEPS.map((step, i) => {
        const isCompleted = completedSteps.has(i);
        const isActive = currentStep === i;
        const isPending = !isCompleted && !isActive;
        const isClickable = isCompleted;

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : 'none', minWidth: 0 }}>
            {/* Step item */}
            <button
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                cursor: isClickable ? 'pointer' : 'default',
                padding: '0 4px',
                flexShrink: 0,
              }}
            >
              {/* Circle */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                transition: 'all 200ms',
                background: isCompleted
                  ? 'var(--color-primary)'
                  : isActive
                    ? 'var(--surface-default)'
                    : 'var(--surface-raised)',
                border: isActive
                  ? '2px solid var(--color-primary)'
                  : isCompleted
                    ? '2px solid var(--color-primary)'
                    : '2px solid var(--border-input)',
                color: isCompleted
                  ? '#fff'
                  : isActive
                    ? 'var(--color-primary)'
                    : 'var(--text-muted)',
              }}>
                {isCompleted ? <Check size={15} strokeWidth={3} /> : i + 1}
              </div>

              {/* Label */}
              <span style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : isCompleted ? 600 : 400,
                color: isActive
                  ? 'var(--color-primary)'
                  : isCompleted
                    ? 'var(--text-secondary)'
                    : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                lineHeight: 1.3,
              }}>
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1,
                height: 2,
                marginTop: 15,
                background: isCompleted ? 'var(--color-primary)' : 'var(--border-subtle)',
                transition: 'background 200ms',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
