import { useState } from 'react';
import { Loader2, Activity } from 'lucide-react';
import { LandingPage } from '@/pages/LandingPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { AuthPage } from '@/pages/AuthPage';
import { AmbulanceDriverPage } from '@/pages/AmbulanceDriverPage';
import { DashboardShell } from '@/components/DashboardShell';
import { useAuth, getSelectedCity } from '@/hooks/useAuth';
import type { UserRole } from '@/lib/types';

type AppView = 'landing' | 'signup' | 'login' | 'ambulance-portal';

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [pendingRole, setPendingRole] = useState<UserRole>('public');
  const [pendingCity, setPendingCity] = useState<string | null>(null);
  const { user, loading: authLoading, signInAsRole, signOut } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/30">
          <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-2 text-navy-400">
          <Loader2 className="w-4 h-4 animate-spin text-accent-400" />
          <span className="text-sm">Connecting to Emergency Network…</span>
        </div>
      </div>
    );
  }

  // Standalone ambulance portal webpage view (accessible directly)
  if (view === 'ambulance-portal') {
    return <AmbulanceDriverPage onBackToMain={() => setView('landing')} />;
  }

  // If user is signed in, show dashboard
  if (user) {
    const role = (user as { role?: UserRole }).role ?? 'public';
    const savedCity = getSelectedCity();
    return (
      <DashboardShell
        role={role}
        userEmail={user.email}
        onSignOut={signOut}
        initialCity={savedCity}
      />
    );
  }

  // Landing page
  if (view === 'landing') {
    return (
      <LandingPage
        onSignIn={() => setView('login')}
        onOpenAmbulancePortal={() => setView('ambulance-portal')}
        onSelectRole={(role, city) => {
          setPendingRole(role);
          setPendingCity(city ?? null);
          if (role === 'hospital') {
            setView('signup');
          } else {
            // Public and ambulance go straight in
            signInAsRole(role, city ? { city } : undefined);
          }
        }}
      />
    );
  }

  // Sign-in page
  if (view === 'login') {
    return (
      <AuthPage
        onBack={() => setView('landing')}
        onSignUp={() => setView('signup')}
      />
    );
  }

  // Sign-up page (for hospital staff)
  if (view === 'signup') {
    return (
      <SignUpPage
        onBack={() => setView('landing')}
        onSignIn={() => setView('login')}
        onSignedUp={async (email, password, details) => {
          await signInAsRole('hospital', {
            email,
            password,
            fullName: details.fullName,
            hospitalName: details.hospitalName,
            city: details.city,
          });
        }}
      />
    );
  }

  return null;
}

export default App;
