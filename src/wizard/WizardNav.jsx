import { Button } from '../shell/Primitives.jsx';

export default function WizardNav({ currentStep, totalSteps, onBack, onContinue, onSaveExit, loading }) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 0 0',
      borderTop: '1px solid var(--border-subtle)',
      marginTop: 32,
    }}>
      <div>
        {currentStep > 0 && (
          <Button variant="secondary" icon="arrow-left" onClick={onBack} disabled={loading}>
            Back
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" onClick={onSaveExit} disabled={loading}>
          Save & Exit
        </Button>
        <Button
          variant="primary"
          icon={isLastStep ? 'user-plus' : 'arrow-right'}
          onClick={onContinue}
          disabled={loading}
          style={{ flexDirection: isLastStep ? 'row' : 'row-reverse' }}
        >
          {isLastStep ? 'Add Employee' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
