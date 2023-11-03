import { useState } from 'react';
import Cookies from 'js-cookie';

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
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
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
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
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
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`
      },
      body: JSON.stringify({ email: email, enteredOTP: enteredOTP }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === 'OTP Verified') {
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
