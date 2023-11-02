import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import necessary components
import './App.css';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Account from './Account';

function App() {
  const [session, setSession] = useState(null);

  // Function to set the session based on refreshToken and accessToken
  const setSessionFromTokens = async (session) => {
    if (session.refresh_token && session.access_token) {
      await supabase.auth.setSession({
        refresh_token: session.refresh_token,
        access_token: session.access_token,
        auth: { persistSession: false },
      });
      setSession(session);
    }
  };
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      setSession(null);
    }
  };

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Auth setSessionFromTokens={setSessionFromTokens} />} />
          <Route path="/dashboard" element={session ? <Account session={session} onSignOut={handleSignOut} /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;