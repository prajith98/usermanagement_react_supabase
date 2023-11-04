import { useState,useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import necessary components
import './App.css';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Account from './Account';
import Cookies from 'js-cookie';

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
      // Store the session in a cookie
      
      // Calculate the expiration time in seconds from the 'session.expires_in' value
      const maxAge = session.expires_in;
      Cookies.set('session', JSON.stringify(session), { expires: maxAge });

    }
  };
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      setSession(null);
    }
    
    // remove Cookie
    Cookies.remove('session');
  };

  // Function to check if the stored session is valid and reset the cookie if it's not
  const checkSessionValidity = async () => {

    await setSessionFromTokens(JSON.parse(Cookies.get('session')));
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      // Handle the error (e.g., session is not valid)
      console.error('Error checking session validity:', error);
      return false;
    }

    if (data) {
      // The session is valid
      return true;
    }

    // No session data found, remove the invalid session cookie
    Cookies.remove('session');
    return false;
  };

  useEffect(() => {
    async function initializeApp() {
      const sessionFromCookie = Cookies.get('session');
      if (sessionFromCookie) {
        // Check if the session is valid
        const isSessionValid = await checkSessionValidity();

        if (isSessionValid) {
          // If the session is valid, set it from the cookie
          setSession(JSON.parse(sessionFromCookie));
        }
        // No need to handle the else case explicitly as the cookie is removed when the session is invalid.
      }
    }

    initializeApp();
  }, []);


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