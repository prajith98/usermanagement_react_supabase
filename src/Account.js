import { useState,useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Account({ session, onSignOut }) {

  const [username, setUsername] = useState(null)
  useEffect(() => {
    async function getProfile() {
      const { user } = session

      let { data, error } = await supabase.from('USER').select('*').eq('emailID', user.email);

      if (error) {
        console.warn(error)
      } else if (data) {
        setUsername(data[0].username)
      }
    }

    getProfile()
  }, [session])


  return (
    <div>
      <h1>Account Page</h1>
      {username && (
        <div>
          <p>Logged in as: {username}</p>
          <button onClick={onSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
}