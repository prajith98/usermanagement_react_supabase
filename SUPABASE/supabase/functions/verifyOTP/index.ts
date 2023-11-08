import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } }}
    )
    console.log("Client Created!");

    // Parse the JSON data from the request body to get the email and OTP.
    const { email,enteredOTP } = await req.json();


    // Sign in with OTP (One-Time Password) using the provided email.
    // Verify the OTP (One-Time Password) entered by the user for email-based authentication.
    const { data, error } = await supabaseClient.auth.verifyOtp({
        email,           // The user's email address.
        token: enteredOTP, // The OTP entered by the user.
        type: 'email',     // The type of authentication, in this case, email-based.
    });
       

    if (error) {
      // If there's an error, return a response with an error message and a status of 400.
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
   else {
        //check if username exist in USER table
        const { data: usersData, error } = await supabaseClient.from('USER').select('emailID').eq('emailID', email);
        if(!usersData[0].username)
        {
          const username = email.split("@")[0];
          const { data: usersData, error } = await supabaseClient.from('USER').update({ username : username}).eq('emailID', email);
        }
        //Retrieve a session
        const { data, _error } = await supabaseClient.auth.getSession()

        // return a response indicating that an OTP (One-Time Password) entered is correct.
        return new Response(JSON.stringify({ data,'Status': 'OTP Verified'}), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
    }

  } catch (error) {
    // If there's an unhandled error, return a response with an error message and a status of 400.
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
