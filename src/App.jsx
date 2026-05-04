import { useState } from 'react';
import { Sidebar, TopBar, Footer } from './shell/Shell.jsx';
import EmployeeWizard from './wizard/EmployeeWizard.jsx';
import EmployeeProfile from './wizard/EmployeeProfile.jsx';

export default function App() {
  const [page, setPage] = useState('payroll');
  const [notifs, setNotifs] = useState([]);
  const [submittedEmployee, setSubmittedEmployee] = useState(null);

  const handleToggleRead = (id) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const handleMarkAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const handleComplete = (formData) => {
    setSubmittedEmployee(formData);
  };

  const handleAddAnother = () => {
    setSubmittedEmployee(null);
  };

  return (
    <div className="suite-layout">
      <Sidebar current={page} onNavigate={setPage} inboxUnread={0} />
      <div className="suite-main">
        <TopBar notifs={notifs} onToggleRead={handleToggleRead} onMarkAllRead={handleMarkAllRead} />
        <main className="suite-content">
          {submittedEmployee ? (
            <EmployeeProfile formData={submittedEmployee} onAddAnother={handleAddAnother} />
          ) : (
            <EmployeeWizard onComplete={handleComplete} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
