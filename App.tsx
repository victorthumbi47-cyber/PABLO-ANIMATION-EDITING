
import React, { useState } from 'react';
import { View, User } from './types';
import Landing from './views/Landing';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import OwnerDashboard from './views/OwnerDashboard';
import Editor from './views/Editor';
import Processing from './views/Processing';
import Export from './views/Export';
import Payment from './views/Payment';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [user, setUser] = useState<User | null>(null);

  const navigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    if (u.role === 'OWNER') {
      navigate(View.OWNER_DASHBOARD);
    } else {
      navigate(View.DASHBOARD);
    }
  };

  const handlePaymentComplete = () => {
    if (user) {
      setUser({ ...user, isPremium: true });
    }
    navigate(View.DASHBOARD);
  };

  const renderView = () => {
    switch (currentView) {
      case View.LANDING:
        return <Landing onStart={() => navigate(View.AUTH)} />;
      case View.AUTH:
        return <Auth onLogin={handleLogin} />;
      case View.DASHBOARD:
        return <Dashboard 
          user={user}
          onNewProject={() => navigate(View.EDITOR)} 
          onSelectProject={() => navigate(View.EDITOR)} 
        />;
      case View.OWNER_DASHBOARD:
        return <OwnerDashboard onNewProject={() => navigate(View.EDITOR)} />;
      case View.EDITOR:
        return <Editor user={user} onGenerate={() => navigate(View.PROCESSING)} onUpgrade={() => navigate(View.PAYMENT)} />;
      case View.PROCESSING:
        return <Processing onComplete={() => navigate(View.EXPORT)} />;
      case View.EXPORT:
        return (
          <Export 
            onPay={() => {
              if (user?.role === 'OWNER') {
                navigate(View.OWNER_DASHBOARD);
              } else {
                navigate(View.PAYMENT);
              }
            }} 
            isAdmin={user?.role === 'OWNER'}
          />
        );
      case View.PAYMENT:
        return <Payment onComplete={handlePaymentComplete} />;
      default:
        return <Landing onStart={() => navigate(View.AUTH)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark">
      {renderView()}
    </div>
  );
};

export default App;
