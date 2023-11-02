import { useState } from 'react';

export default function Account({ session, onSignOut }) {
  const [user, setUser] = useState(session?.user);

  return (
    <div>
      <h1>Account Page</h1>
      {user && (
        <div>
          <p>Logged in as: {user.email}</p>
          <button onClick={onSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
}
