import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth({ session, setSessionFromTokens }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

      checkEmailInUserTable(email);
    setLoading(false);
  };

  const checkEmailInUserTable = async (email) => {
    fetch('https://ziftjprnoezvauotceqp.supabase.co/functions/v1/checkForPaidUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      //  'Authorization': `Bearer 14fd9541f17f49af86c2f4928f7268a9` // Corrected API key reference
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZnRqcHJub2V6dmF1b3RjZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1NTExMDYsImV4cCI6MjAxMzEyNzEwNn0.tfELCWtR-xPJ0QBCPw9rLhp-9nIxF5Ql5-fSe5JJQAc'
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        if (data.Status === 'Paid User') {
          setEmailExists(true);
          sendOTPForEmailVerification(email);
        } else {
          alert('Not a paid user');
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const sendOTPForEmailVerification = async (email) => {
    fetch('https://ziftjprnoezvauotceqp.supabase.co/functions/v1/sendOTPForEmailVerification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      //  'Authorization': `Bearer 14fd9541f17f49af86c2f4928f7268a9` // Corrected API key reference
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZnRqcHJub2V6dmF1b3RjZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1NTExMDYsImV4cCI6MjAxMzEyNzEwNn0.tfELCWtR-xPJ0QBCPw9rLhp-9nIxF5Ql5-fSe5JJQAc'
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        if (data.Status === 'OTP Sent') {
          setOtpSent(true);
        } else {
          console.log(data.error);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const handleVerify = async () => {
    setLoading(true);

    fetch('https://ziftjprnoezvauotceqp.supabase.co/functions/v1/verifyOTP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      //  'Authorization': `Bearer 14fd9541f17f49af86c2f4928f7268a9` // Corrected API key reference
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZnRqcHJub2V6dmF1b3RjZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1NTExMDYsImV4cCI6MjAxMzEyNzEwNn0.tfELCWtR-xPJ0QBCPw9rLhp-9nIxF5Ql5-fSe5JJQAc'
      },
      body: JSON.stringify({ email: email, enteredOTP: enteredOTP }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === 'OTP Verified') {
          console.log(JSON.stringify(data));
          console.log("refresh_token : "+data.data.session.refresh_token)
          console.log("access_token : "+data.data.session.access_token)
          setSessionFromTokens(data.data.session);
        } else {
          console.log(data.Status);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Sign in via OTP with your email below</p>
        <form className="form-widget">
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {otpSent ? (
            <div>
              <input
                className="inputField"
                type="text"
                placeholder="Enter OTP"
                value={enteredOTP}
                required={true}
                onChange={(e) => setEnteredOTP(e.target.value)}
              />
            </div>
          ) : null}
          <div>
            <button className={'button block'} disabled={loading} onClick={otpSent ? handleVerify : handleLogin}>
              {loading ? (
                <span>Loading</span>
              ) : otpSent ? (
                <span>Verify OTP</span>
              ) : (
                <span>Send OTP</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
